const express = require('express');
const LearningModule = require('../models/LearningModule');
const User = require('../models/User');
const SkillGap = require('../models/SkillGap');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get personalized learning modules
router.get('/modules', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const skillGap = await SkillGap.findOne({ userId: req.user.id });
    
    let modules;
    
    if (skillGap && skillGap.missingSkills.length > 0) {
      // Get modules for missing skills
      const missingSkillNames = skillGap.missingSkills.map(ms => ms.skill);
      modules = await LearningModule.find({
        skill: { $in: missingSkillNames },
        isActive: true
      }).sort({ difficulty: 1 });
    } else {
      // Get all modules if no skill gap analysis
      modules = await LearningModule.find({ isActive: true }).sort({ difficulty: 1 });
    }

    // Mark completed modules
    const modulesWithProgress = modules.map(module => ({
      ...module.toObject(),
      completed: user.learning.completedModules.includes(module._id.toString())
    }));

    res.json({
      success: true,
      modules: modulesWithProgress
    });
  } catch (error) {
    console.error('Get learning modules error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete a learning module
router.post('/modules/:id/complete', auth, async (req, res) => {
  try {
    const module = await LearningModule.findById(req.params.id);
    
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    const user = await User.findById(req.user.id);
    
    // Check if already completed
    if (user.learning.completedModules.includes(req.params.id)) {
      return res.status(400).json({ message: 'Module already completed' });
    }

    // Add to completed modules
    user.learning.completedModules.push(req.params.id);
    user.learning.xp += module.xpReward;
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

    // Award badges
    const completedCount = user.learning.completedModules.length;
    if (completedCount === 1 && !user.learning.badges.includes('First Steps')) {
      user.learning.badges.push('First Steps');
    }
    if (completedCount === 5 && !user.learning.badges.includes('Learning Enthusiast')) {
      user.learning.badges.push('Learning Enthusiast');
    }
    if (completedCount === 10 && !user.learning.badges.includes('Knowledge Seeker')) {
      user.learning.badges.push('Knowledge Seeker');
    }

    await user.save();

    res.json({
      success: true,
      message: 'Module completed successfully',
      xpGained: module.xpReward,
      newLevel: user.learning.level,
      newBadges: user.learning.badges
    });
  } catch (error) {
    console.error('Complete module error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get learning progress
router.get('/progress', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const skillGap = await SkillGap.findOne({ userId: req.user.id });
    
    // Calculate progress statistics
    const totalModules = await LearningModule.countDocuments({ isActive: true });
    const completedModules = user.learning.completedModules.length;
    const completedQuizzes = user.quizResults.length;
    
    // Calculate average quiz score
    const avgQuizScore = user.quizResults.length > 0 
      ? user.quizResults.reduce((sum, result) => sum + result.score, 0) / user.quizResults.length
      : 0;

    res.json({
      success: true,
      progress: {
        level: user.learning.level,
        xp: user.learning.xp,
        nextLevelXp: user.learning.level * 1000,
        badges: user.learning.badges,
        currentStreak: user.learning.currentStreak,
        completedModules: completedModules,
        totalModules: totalModules,
        completedQuizzes: completedQuizzes,
        averageQuizScore: Math.round(avgQuizScore),
        skillGapProgress: skillGap ? {
          matchPercentage: skillGap.matchPercentage,
          missingSkillsCount: skillGap.missingSkills.length
        } : null
      }
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;