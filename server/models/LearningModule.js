const mongoose = require('mongoose');

const learningModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  skill: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  type: {
    type: String,
    enum: ['video', 'article', 'practice', 'course'],
    required: true
  },
  content: {
    url: String,
    videoId: String,
    duration: String,
    provider: String // youtube, coursera, etc.
  },
  xpReward: {
    type: Number,
    default: 100
  },
  prerequisites: [String],
  tags: [String],
  isPremium: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LearningModule', learningModuleSchema);