const express = require('express');
const UserProgress = require('../models/UserProgress');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user progress
router.get('/', auth, async (req, res) => {
  try {
    let progress = await UserProgress.findOne({ userId: req.user.id });
    
    if (!progress) {
      // Create initial progress record
      progress = new UserProgress({
        userId: req.user.id,
        skillProgress: [],
        learningPath: {
          currentPhase: 'foundation',
          completedPhases: [],
          recommendedModules: [],
          customPath: false
        },
        achievements: [],
        statistics: {
          totalStudyTime: 0,
          modulesCompleted: 0,
          quizzesTaken: 0,
          averageQuizScore: 0,
          currentStreak: 0,
          longestStreak: 0
        }
      });
      await progress.save();
    }

    res.json({
      success: true,
      progress
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update skill progress
router.put('/skill/:skillName', auth, async (req, res) => {
  try {
    const { skillName } = req.params;
    const { currentLevel, timeSpent, moduleCompleted, quizScore } = req.body;

    let progress = await UserProgress.findOne({ userId: req.user.id });
    
    if (!progress) {
      progress = new UserProgress({ userId: req.user.id });
    }

    // Find or create skill progress
    let skillIndex = progress.skillProgress.findIndex(sp => sp.skill === skillName);
    
    if (skillIndex === -1) {
      progress.skillProgress.push({
        skill: skillName,
        currentLevel: currentLevel || 0,
        targetLevel: 100,
        completedModules: [],
        quizScores: [],
        timeSpent: 0
      });
      skillIndex = progress.skillProgress.length - 1;
    }

    // Update skill progress
    if (currentLevel !== undefined) {
      progress.skillProgress[skillIndex].currentLevel = currentLevel;
    }
    
    if (timeSpent) {
      progress.skillProgress[skillIndex].timeSpent += timeSpent;
      progress.statistics.totalStudyTime += timeSpent;
    }
    
    if (moduleCompleted) {
      if (!progress.skillProgress[skillIndex].completedModules.includes(moduleCompleted)) {
        progress.skillProgress[skillIndex].completedModules.push(moduleCompleted);
        progress.statistics.modulesCompleted += 1;
      }
    }
    
    if (quizScore) {
      progress.skillProgress[skillIndex].quizScores.push({
        quizId: quizScore.quizId,
        score: quizScore.score,
        completedAt: new Date()
      });
      progress.statistics.quizzesTaken += 1;
      
      // Recalculate average quiz score
      const allScores = progress.skillProgress.flatMap(sp => sp.quizScores.map(qs => qs.score));
      progress.statistics.averageQuizScore = allScores.reduce((sum, score) => sum + score, 0) / allScores.length;
    }

    progress.skillProgress[skillIndex].lastUpdated = new Date();
    await progress.save();

    res.json({
      success: true,
      progress
    });
  } catch (error) {
    console.error('Update skill progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add achievement
router.post('/achievement', auth, async (req, res) => {
  try {
    const { badgeId, badgeName, description } = req.body;

    let progress = await UserProgress.findOne({ userId: req.user.id });
    
    if (!progress) {
      progress = new UserProgress({ userId: req.user.id });
    }

    // Check if achievement already exists
    const existingAchievement = progress.achievements.find(a => a.badgeId === badgeId);
    
    if (!existingAchievement) {
      progress.achievements.push({
        badgeId,
        badgeName,
        description,
        earnedAt: new Date()
      });
      
      await progress.save();
    }

    res.json({
      success: true,
      achievement: { badgeId, badgeName, description }
    });
  } catch (error) {
    console.error('Add achievement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get learning analytics
router.get('/analytics', auth, async (req, res) => {
  try {
    const progress = await UserProgress.findOne({ userId: req.user.id });
    
    if (!progress) {
      return res.json({
        success: true,
        analytics: {
          totalStudyTime: 0,
          skillsInProgress: 0,
          completionRate: 0,
          weeklyProgress: [],
          topSkills: []
        }
      });
    }

    // Calculate analytics
    const skillsInProgress = progress.skillProgress.length;
    const totalModulesCompleted = progress.statistics.modulesCompleted;
    const totalModulesAvailable = 50; // This should come from actual module count
    const completionRate = Math.round((totalModulesCompleted / totalModulesAvailable) * 100);

    // Get top skills by progress
    const topSkills = progress.skillProgress
      .sort((a, b) => b.currentLevel - a.currentLevel)
      .slice(0, 5)
      .map(sp => ({
        skill: sp.skill,
        level: sp.currentLevel,
        modulesCompleted: sp.completedModules.length
      }));

    // Mock weekly progress (in real app, calculate from actual data)
    const weeklyProgress = [
      { week: 'Week 1', studyTime: 120, modulesCompleted: 2 },
      { week: 'Week 2', studyTime: 180, modulesCompleted: 3 },
      { week: 'Week 3', studyTime: 150, modulesCompleted: 2 },
      { week: 'Week 4', studyTime: 200, modulesCompleted: 4 }
    ];

    res.json({
      success: true,
      analytics: {
        totalStudyTime: progress.statistics.totalStudyTime,
        skillsInProgress,
        completionRate,
        weeklyProgress,
        topSkills,
        achievements: progress.achievements.length,
        currentStreak: progress.statistics.currentStreak
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;