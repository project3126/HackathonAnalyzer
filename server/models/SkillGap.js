const mongoose = require('mongoose');

const skillGapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currentRole: String,
  desiredRole: String,
  requiredSkills: [String],
  currentSkills: [String],
  missingSkills: [{
    skill: String,
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    },
    estimatedLearningTime: String
  }],
  matchPercentage: Number,
  analysisDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SkillGap', skillGapSchema);