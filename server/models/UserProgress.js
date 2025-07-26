const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skillProgress: [{
    skill: String,
    currentLevel: {
      type: Number,
      default: 0
    },
    targetLevel: {
      type: Number,
      default: 100
    },
    completedModules: [String],
    quizScores: [{
      quizId: String,
      score: Number,
      completedAt: Date
    }],
    timeSpent: {
      type: Number,
      default: 0 // in minutes
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }],
  learningPath: {
    currentPhase: {
      type: String,
      enum: ['foundation', 'assessment', 'learning', 'practice', 'certification'],
      default: 'foundation'
    },
    completedPhases: [String],
    recommendedModules: [String],
    customPath: Boolean
  },
  achievements: [{
    badgeId: String,
    badgeName: String,
    earnedAt: Date,
    description: String
  }],
  weeklyGoals: {
    modulesToComplete: {
      type: Number,
      default: 3
    },
    quizzesToTake: {
      type: Number,
      default: 2
    },
    studyTimeMinutes: {
      type: Number,
      default: 120
    }
  },
  statistics: {
    totalStudyTime: {
      type: Number,
      default: 0
    },
    modulesCompleted: {
      type: Number,
      default: 0
    },
    quizzesTaken: {
      type: Number,
      default: 0
    },
    averageQuizScore: {
      type: Number,
      default: 0
    },
    currentStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
userProgressSchema.index({ userId: 1 });
userProgressSchema.index({ 'skillProgress.skill': 1 });

module.exports = mongoose.model('UserProgress', userProgressSchema);