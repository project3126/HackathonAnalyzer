const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['employee', 'admin'],
    default: 'employee'
  },
  profile: {
    currentRole: String,
    desiredRole: String,
    skills: [String],
    experience: Number,
    department: String,
    profileComplete: {
      type: Boolean,
      default: false
    }
  },
  resume: {
    filename: String,
    originalName: String,
    uploadDate: Date,
    parsedData: {
      skills: [String],
      experience: [String],
      education: [String],
      projects: [String]
    }
  },
  learning: {
    xp: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    },
    badges: [String],
    completedModules: [String],
    currentStreak: {
      type: Number,
      default: 0
    },
    lastActiveDate: Date
  },
  quizResults: [{
    quizId: String,
    score: Number,
    completedAt: Date,
    timeSpent: Number,
    answers: [{
      questionId: String,
      selectedAnswer: Number,
      isCorrect: Boolean
    }]
  }],
  interviewSessions: [{
    sessionId: String,
    completedAt: Date,
    overallScore: Number,
    confidence: Number,
    clarity: Number,
    feedback: String,
    responses: [{
      question: String,
      response: String,
      score: Number
    }]
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);