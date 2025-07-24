const express = require('express');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const SkillGap = require('../models/SkillGap');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { parseResume } = require('../utils/resumeParser');
const { analyzeSkillGap } = require('../utils/skillAnalyzer');

const router = express.Router();

// Ensure upload directory exists
const uploadDir = 'uploads/resumes';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Upload and parse resume
router.post('/upload', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;

    // Parse resume
    const parsedData = await parseResume(filePath, originalName);

    // Update user with resume data
    const user = await User.findById(req.user.id);
    user.resume = {
      filename: req.file.filename,
      originalName: originalName,
      uploadDate: new Date(),
      parsedData: parsedData
    };

    // Update profile with extracted skills
    user.profile.skills = [...new Set([...user.profile.skills || [], ...parsedData.skills])];
    user.profile.profileComplete = true;

    await user.save();

    res.json({
      success: true,
      message: 'Resume uploaded and parsed successfully',
      parsedData: parsedData
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({ message: 'Failed to process resume' });
  }
});

// Analyze skill gap
router.post('/analyze-skills', auth, async (req, res) => {
  try {
    const { desiredRole } = req.body;
    const user = await User.findById(req.user.id);

    if (!user.profile.skills || user.profile.skills.length === 0) {
      return res.status(400).json({ message: 'Please upload your resume first' });
    }

    // Perform skill gap analysis
    const analysis = analyzeSkillGap(user.profile.skills, desiredRole);

    // Save or update skill gap analysis
    let skillGap = await SkillGap.findOne({ userId: req.user.id });
    
    if (skillGap) {
      skillGap.currentRole = user.profile.currentRole;
      skillGap.desiredRole = desiredRole;
      skillGap.requiredSkills = analysis.requiredSkills;
      skillGap.currentSkills = analysis.currentSkills;
      skillGap.missingSkills = analysis.missingSkills;
      skillGap.matchPercentage = analysis.matchPercentage;
      skillGap.analysisDate = new Date();
    } else {
      skillGap = new SkillGap({
        userId: req.user.id,
        currentRole: user.profile.currentRole,
        desiredRole: desiredRole,
        requiredSkills: analysis.requiredSkills,
        currentSkills: analysis.currentSkills,
        missingSkills: analysis.missingSkills,
        matchPercentage: analysis.matchPercentage
      });
    }

    await skillGap.save();

    // Update user profile
    user.profile.desiredRole = desiredRole;
    await user.save();

    res.json({
      success: true,
      analysis: {
        matchPercentage: analysis.matchPercentage,
        matchingSkills: analysis.matchingSkills,
        missingSkills: analysis.missingSkills,
        requiredSkills: analysis.requiredSkills
      }
    });
  } catch (error) {
    console.error('Skill analysis error:', error);
    res.status(500).json({ message: 'Failed to analyze skills' });
  }
});

// Get skill gap analysis
router.get('/skill-gap', auth, async (req, res) => {
  try {
    const skillGap = await SkillGap.findOne({ userId: req.user.id });
    
    if (!skillGap) {
      return res.status(404).json({ message: 'No skill gap analysis found' });
    }

    res.json({
      success: true,
      skillGap: skillGap
    });
  } catch (error) {
    console.error('Get skill gap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;