const mongoose = require('mongoose');

const jobRoleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Frontend', 'Backend', 'Full Stack', 'DevOps', 'Data Science', 'AI/ML', 'Mobile', 'QA', 'Product', 'Design']
  },
  level: {
    type: String,
    required: true,
    enum: ['Junior', 'Mid', 'Senior', 'Lead', 'Principal']
  },
  requiredSkills: [{
    skill: String,
    importance: {
      type: String,
      enum: ['critical', 'important', 'nice-to-have'],
      default: 'important'
    },
    minimumLevel: {
      type: Number,
      min: 1,
      max: 10,
      default: 5
    }
  }],
  description: String,
  responsibilities: [String],
  qualifications: [String],
  salaryRange: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  experienceRequired: {
    min: Number,
    max: Number
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better search performance
jobRoleSchema.index({ title: 'text', description: 'text' });
jobRoleSchema.index({ category: 1, level: 1 });
jobRoleSchema.index({ 'requiredSkills.skill': 1 });

module.exports = mongoose.model('JobRole', jobRoleSchema);