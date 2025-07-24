const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Mock interview questions database
const interviewQuestions = {
  general: [
    "Tell me about yourself and your professional background.",
    "What are your greatest strengths and weaknesses?",
    "Why are you interested in this role?",
    "Where do you see yourself in 5 years?",
    "Why are you looking to change roles?"
  ],
  technical: [
    "How do you approach solving complex technical problems?",
    "Describe a challenging project you worked on recently.",
    "How do you stay updated with new technologies?",
    "Explain a technical concept to a non-technical person.",
    "How do you handle debugging and troubleshooting?"
  ],
  behavioral: [
    "Describe a time when you had to work with a difficult team member.",
    "Tell me about a time you failed and how you handled it.",
    "How do you handle tight deadlines and pressure?",
    "Describe a situation where you had to learn something new quickly.",
    "Tell me about a time you had to make a difficult decision."
  ],
  leadership: [
    "How do you motivate team members?",
    "Describe your leadership style.",
    "How do you handle conflicts within your team?",
    "Tell me about a time you had to give difficult feedback.",
    "How do you prioritize tasks for your team?"
  ]
};

// Start interview session
router.post('/start', auth, async (req, res) => {
  try {
    const { categories = ['general', 'technical', 'behavioral'] } = req.body;
    
    // Generate random questions from selected categories
    const selectedQuestions = [];
    categories.forEach(category => {
      if (interviewQuestions[category]) {
        const categoryQuestions = interviewQuestions[category];
        const randomQuestion = categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)];
        selectedQuestions.push({
          category,
          question: randomQuestion
        });
      }
    });

    // Shuffle questions
    const shuffledQuestions = selectedQuestions.sort(() => Math.random() - 0.5);

    res.json({
      success: true,
      sessionId: Date.now().toString(),
      questions: shuffledQuestions.slice(0, 5) // Limit to 5 questions
    });
  } catch (error) {
    console.error('Start interview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit interview responses
router.post('/submit', auth, async (req, res) => {
  try {
    const { sessionId, responses } = req.body;
    
    // Simple scoring algorithm (in real app, use AI for better analysis)
    const scoredResponses = responses.map(response => {
      const wordCount = response.response.split(' ').length;
      const hasKeywords = /experience|project|team|challenge|solution|result/i.test(response.response);
      
      let score = 50; // Base score
      
      // Length scoring
      if (wordCount > 100) score += 20;
      else if (wordCount > 50) score += 10;
      
      // Keyword scoring
      if (hasKeywords) score += 20;
      
      // Confidence scoring (random for demo, would use AI in real app)
      const confidence = Math.floor(Math.random() * 30) + 70;
      
      return {
        ...response,
        score: Math.min(score, 100),
        confidence
      };
    });

    // Calculate overall scores
    const overallScore = Math.round(
      scoredResponses.reduce((sum, r) => sum + r.score, 0) / scoredResponses.length
    );
    
    const confidence = Math.round(
      scoredResponses.reduce((sum, r) => sum + r.confidence, 0) / scoredResponses.length
    );
    
    const clarity = Math.floor(Math.random() * 20) + 80; // Mock clarity score

    // Generate feedback
    const feedback = generateFeedback(overallScore, confidence, clarity);

    // Save interview session
    const user = await User.findById(req.user.id);
    user.interviewSessions.push({
      sessionId,
      completedAt: new Date(),
      overallScore,
      confidence,
      clarity,
      feedback,
      responses: scoredResponses
    });

    // Award XP
    const xpGained = Math.max(100, overallScore);
    user.learning.xp += xpGained;
    user.learning.level = Math.floor(user.learning.xp / 1000) + 1;

    // Award interview badges
    const interviewCount = user.interviewSessions.length;
    if (interviewCount === 1 && !user.learning.badges.includes('Interview Rookie')) {
      user.learning.badges.push('Interview Rookie');
    }
    if (interviewCount === 5 && !user.learning.badges.includes('Interview Pro')) {
      user.learning.badges.push('Interview Pro');
    }
    if (overallScore >= 90 && !user.learning.badges.includes('Interview Master')) {
      user.learning.badges.push('Interview Master');
    }

    await user.save();

    res.json({
      success: true,
      results: {
        overallScore,
        confidence,
        clarity,
        feedback,
        xpGained,
        responses: scoredResponses
      }
    });
  } catch (error) {
    console.error('Submit interview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get interview history
router.get('/history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      sessions: user.interviewSessions.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    });
  } catch (error) {
    console.error('Get interview history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to generate feedback
function generateFeedback(overallScore, confidence, clarity) {
  const feedback = [];
  
  if (overallScore >= 90) {
    feedback.push("Excellent performance! Your responses were comprehensive and well-structured.");
  } else if (overallScore >= 75) {
    feedback.push("Good job! Your answers showed solid understanding and experience.");
  } else if (overallScore >= 60) {
    feedback.push("Decent performance, but there's room for improvement in providing more detailed examples.");
  } else {
    feedback.push("Consider preparing more specific examples and practicing your responses.");
  }
  
  if (confidence >= 80) {
    feedback.push("You demonstrated strong confidence throughout the interview.");
  } else {
    feedback.push("Work on building confidence by practicing more mock interviews.");
  }
  
  if (clarity >= 85) {
    feedback.push("Your communication was clear and easy to follow.");
  } else {
    feedback.push("Focus on speaking more clearly and organizing your thoughts before responding.");
  }
  
  return feedback.join(' ');
}

module.exports = router;