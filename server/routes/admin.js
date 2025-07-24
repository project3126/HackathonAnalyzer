const express = require('express');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const LearningModule = require('../models/LearningModule');
const SkillGap = require('../models/SkillGap');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get dashboard analytics
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments({ role: 'employee' });
    const activeUsers = await User.countDocuments({ 
      role: 'employee',
      'learning.lastActiveDate': { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    // Learning statistics
    const totalQuizzes = await Quiz.countDocuments();
    const totalModules = await LearningModule.countDocuments();
    
    // Calculate average completion rate
    const users = await User.find({ role: 'employee' });
    const avgCompletionRate = users.length > 0 
      ? users.reduce((sum, user) => sum + user.learning.completedModules.length, 0) / users.length / totalModules * 100
      : 0;

    // Top skills analysis
    const skillGaps = await SkillGap.find();
    const skillFrequency = {};
    
    skillGaps.forEach(gap => {
      gap.missingSkills.forEach(skill => {
        skillFrequency[skill.skill] = (skillFrequency[skill.skill] || 0) + 1;
      });
    });

    const topMissingSkills = Object.entries(skillFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }));

    // Recent activity
    const recentUsers = await User.find({ role: 'employee' })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email createdAt learning.lastActiveDate');

    res.json({
      success: true,
      analytics: {
        userStats: {
          totalUsers,
          activeUsers,
          inactiveUsers: totalUsers - activeUsers
        },
        learningStats: {
          totalQuizzes,
          totalModules,
          avgCompletionRate: Math.round(avgCompletionRate)
        },
        topMissingSkills,
        recentActivity: recentUsers
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users with filters
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { search, department, skillGap, page = 1, limit = 20 } = req.query;
    
    let query = { role: 'employee' };
    
    // Apply filters
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (department) {
      query['profile.department'] = department;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    // Get skill gaps for users
    const userIds = users.map(user => user._id);
    const skillGaps = await SkillGap.find({ userId: { $in: userIds } });
    
    const usersWithSkillGaps = users.map(user => {
      const userSkillGap = skillGaps.find(sg => sg.userId.toString() === user._id.toString());
      return {
        ...user.toObject(),
        skillGap: userSkillGap
      };
    });

    res.json({
      success: true,
      users: usersWithSkillGaps,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user details
router.get('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const skillGap = await SkillGap.findOne({ userId: req.params.id });

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        skillGap
      }
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate reports
router.get('/reports/:type', adminAuth, async (req, res) => {
  try {
    const { type } = req.params;
    const { startDate, endDate } = req.query;
    
    let report = {};
    
    switch (type) {
      case 'user-progress':
        report = await generateUserProgressReport(startDate, endDate);
        break;
      case 'skill-gaps':
        report = await generateSkillGapReport();
        break;
      case 'learning-analytics':
        report = await generateLearningAnalyticsReport(startDate, endDate);
        break;
      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }

    res.json({
      success: true,
      report
    });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper functions for reports
async function generateUserProgressReport(startDate, endDate) {
  const dateFilter = {};
  if (startDate) dateFilter.$gte = new Date(startDate);
  if (endDate) dateFilter.$lte = new Date(endDate);
  
  const users = await User.find({ 
    role: 'employee',
    ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
  }).select('name email learning profile.currentRole profile.desiredRole');

  return {
    title: 'User Progress Report',
    generatedAt: new Date(),
    data: users.map(user => ({
      name: user.name,
      email: user.email,
      currentRole: user.profile.currentRole,
      desiredRole: user.profile.desiredRole,
      level: user.learning.level,
      xp: user.learning.xp,
      completedModules: user.learning.completedModules.length,
      badges: user.learning.badges.length
    }))
  };
}

async function generateSkillGapReport() {
  const skillGaps = await SkillGap.find().populate('userId', 'name email');
  
  const skillFrequency = {};
  skillGaps.forEach(gap => {
    gap.missingSkills.forEach(skill => {
      if (!skillFrequency[skill.skill]) {
        skillFrequency[skill.skill] = { count: 0, users: [] };
      }
      skillFrequency[skill.skill].count++;
      skillFrequency[skill.skill].users.push(gap.userId.name);
    });
  });

  return {
    title: 'Skill Gap Analysis Report',
    generatedAt: new Date(),
    totalAnalyses: skillGaps.length,
    topMissingSkills: Object.entries(skillFrequency)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 20)
      .map(([skill, data]) => ({ skill, ...data }))
  };
}

async function generateLearningAnalyticsReport(startDate, endDate) {
  const dateFilter = {};
  if (startDate) dateFilter.$gte = new Date(startDate);
  if (endDate) dateFilter.$lte = new Date(endDate);
  
  const users = await User.find({ role: 'employee' });
  const totalModules = await LearningModule.countDocuments();
  
  const analytics = {
    totalLearners: users.length,
    totalModulesCompleted: users.reduce((sum, user) => sum + user.learning.completedModules.length, 0),
    totalXpEarned: users.reduce((sum, user) => sum + user.learning.xp, 0),
    averageLevel: users.reduce((sum, user) => sum + user.learning.level, 0) / users.length,
    totalQuizzesTaken: users.reduce((sum, user) => sum + user.quizResults.length, 0),
    totalInterviews: users.reduce((sum, user) => sum + user.interviewSessions.length, 0)
  };

  return {
    title: 'Learning Analytics Report',
    generatedAt: new Date(),
    period: { startDate, endDate },
    analytics
  };
}

module.exports = router;