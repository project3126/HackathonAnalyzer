const express = require('express');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all quizzes
router.get('/', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isActive: true }).select('-questions.correctAnswer');
    res.json({
      success: true,
      quizzes: quizzes
    });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get quiz by ID (for taking quiz)
router.get('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).select('-questions.correctAnswer');
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json({
      success: true,
      quiz: quiz
    });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit quiz answers
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const { answers, timeSpent } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Calculate score
    let correctAnswers = 0;
    const detailedAnswers = [];

    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) correctAnswers++;
      
      detailedAnswers.push({
        questionId: question._id,
        selectedAnswer: userAnswer,
        isCorrect: isCorrect
      });
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const xpGained = Math.max(50, score);

    // Update user
    const user = await User.findById(req.user.id);
    
    // Add quiz result
    user.quizResults.push({
      quizId: req.params.id,
      score: score,
      completedAt: new Date(),
      timeSpent: timeSpent,
      answers: detailedAnswers
    });

    // Update learning progress
    user.learning.xp += xpGained;
    user.learning.level = Math.floor(user.learning.xp / 1000) + 1;
    user.learning.lastActiveDate = new Date();

    // Update streak
    const today = new Date().toDateString();
    const lastActive = user.learning.lastActiveDate ? user.learning.lastActiveDate.toDateString() : null;
    
    if (lastActive !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastActive === yesterday.toDateString()) {
        user.learning.currentStreak += 1;
      } else {
        user.learning.currentStreak = 1;
      }
    }

    await user.save();

    res.json({
      success: true,
      result: {
        score: score,
        correctAnswers: correctAnswers,
        totalQuestions: quiz.questions.length,
        xpGained: xpGained,
        timeSpent: timeSpent
      }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's quiz results
router.get('/results/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('quizResults.quizId');
    
    res.json({
      success: true,
      results: user.quizResults
    });
  } catch (error) {
    console.error('Get quiz results error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;