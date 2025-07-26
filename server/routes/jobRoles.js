const express = require('express');
const JobRole = require('../models/JobRole');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all job roles
router.get('/', auth, async (req, res) => {
  try {
    const { category, level, search } = req.query;
    let query = { isActive: true };

    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$text = { $search: search };
    }

    const jobRoles = await JobRole.find(query).sort({ title: 1 });

    res.json({
      success: true,
      jobRoles
    });
  } catch (error) {
    console.error('Get job roles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get job role by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const jobRole = await JobRole.findById(req.params.id);
    
    if (!jobRole) {
      return res.status(404).json({ message: 'Job role not found' });
    }

    res.json({
      success: true,
      jobRole
    });
  } catch (error) {
    console.error('Get job role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create job role (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const jobRole = new JobRole({
      ...req.body,
      createdBy: req.user.id
    });

    await jobRole.save();

    res.status(201).json({
      success: true,
      jobRole
    });
  } catch (error) {
    console.error('Create job role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update job role (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const jobRole = await JobRole.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!jobRole) {
      return res.status(404).json({ message: 'Job role not found' });
    }

    res.json({
      success: true,
      jobRole
    });
  } catch (error) {
    console.error('Update job role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete job role (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const jobRole = await JobRole.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!jobRole) {
      return res.status(404).json({ message: 'Job role not found' });
    }

    res.json({
      success: true,
      message: 'Job role deactivated successfully'
    });
  } catch (error) {
    console.error('Delete job role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get skill requirements for role comparison
router.get('/:id/skills', auth, async (req, res) => {
  try {
    const jobRole = await JobRole.findById(req.params.id);
    
    if (!jobRole) {
      return res.status(404).json({ message: 'Job role not found' });
    }

    const skillRequirements = jobRole.requiredSkills.map(skill => ({
      skill: skill.skill,
      importance: skill.importance,
      minimumLevel: skill.minimumLevel
    }));

    res.json({
      success: true,
      skills: skillRequirements,
      roleTitle: jobRole.title
    });
  } catch (error) {
    console.error('Get role skills error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;