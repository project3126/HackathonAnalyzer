const mongoose = require('mongoose');
const JobRole = require('../models/JobRole');
const connectDB = require('../config/database');

const jobRolesData = [
  {
    title: 'Frontend Developer',
    category: 'Frontend',
    level: 'Junior',
    requiredSkills: [
      { skill: 'HTML', importance: 'critical', minimumLevel: 8 },
      { skill: 'CSS', importance: 'critical', minimumLevel: 8 },
      { skill: 'JavaScript', importance: 'critical', minimumLevel: 7 },
      { skill: 'React', importance: 'important', minimumLevel: 6 },
      { skill: 'Git', importance: 'important', minimumLevel: 5 },
      { skill: 'Responsive Design', importance: 'important', minimumLevel: 6 },
      { skill: 'TypeScript', importance: 'nice-to-have', minimumLevel: 4 }
    ],
    description: 'Develop user-facing web applications with modern frontend technologies',
    responsibilities: [
      'Build responsive web interfaces',
      'Implement UI/UX designs',
      'Optimize applications for performance',
      'Collaborate with backend developers'
    ],
    qualifications: [
      'Bachelor\'s degree in Computer Science or related field',
      '1-2 years of frontend development experience',
      'Strong understanding of web technologies'
    ],
    experienceRequired: { min: 1, max: 3 }
  },
  {
    title: 'Senior Full Stack Developer',
    category: 'Full Stack',
    level: 'Senior',
    requiredSkills: [
      { skill: 'JavaScript', importance: 'critical', minimumLevel: 9 },
      { skill: 'TypeScript', importance: 'critical', minimumLevel: 8 },
      { skill: 'React', importance: 'critical', minimumLevel: 8 },
      { skill: 'Node.js', importance: 'critical', minimumLevel: 8 },
      { skill: 'MongoDB', importance: 'important', minimumLevel: 7 },
      { skill: 'PostgreSQL', importance: 'important', minimumLevel: 6 },
      { skill: 'Docker', importance: 'important', minimumLevel: 6 },
      { skill: 'AWS', importance: 'important', minimumLevel: 6 },
      { skill: 'System Design', importance: 'critical', minimumLevel: 7 },
      { skill: 'GraphQL', importance: 'nice-to-have', minimumLevel: 5 },
      { skill: 'Microservices', importance: 'important', minimumLevel: 6 }
    ],
    description: 'Lead full-stack development projects and mentor junior developers',
    responsibilities: [
      'Design and implement scalable web applications',
      'Lead technical architecture decisions',
      'Mentor junior developers',
      'Code review and quality assurance'
    ],
    qualifications: [
      'Bachelor\'s degree in Computer Science',
      '5+ years of full-stack development experience',
      'Experience with cloud platforms',
      'Strong leadership skills'
    ],
    experienceRequired: { min: 5, max: 8 }
  },
  {
    title: 'DevOps Engineer',
    category: 'DevOps',
    level: 'Mid',
    requiredSkills: [
      { skill: 'Docker', importance: 'critical', minimumLevel: 8 },
      { skill: 'Kubernetes', importance: 'critical', minimumLevel: 7 },
      { skill: 'AWS', importance: 'critical', minimumLevel: 8 },
      { skill: 'Jenkins', importance: 'important', minimumLevel: 6 },
      { skill: 'Terraform', importance: 'important', minimumLevel: 6 },
      { skill: 'Linux', importance: 'critical', minimumLevel: 8 },
      { skill: 'Python', importance: 'important', minimumLevel: 6 },
      { skill: 'Bash', importance: 'important', minimumLevel: 7 },
      { skill: 'Monitoring', importance: 'important', minimumLevel: 6 }
    ],
    description: 'Manage infrastructure and deployment pipelines',
    responsibilities: [
      'Design and maintain CI/CD pipelines',
      'Manage cloud infrastructure',
      'Monitor system performance',
      'Implement security best practices'
    ],
    qualifications: [
      'Bachelor\'s degree in Computer Science or related field',
      '3-5 years of DevOps experience',
      'Cloud platform certifications preferred'
    ],
    experienceRequired: { min: 3, max: 5 }
  },
  {
    title: 'Data Scientist',
    category: 'Data Science',
    level: 'Mid',
    requiredSkills: [
      { skill: 'Python', importance: 'critical', minimumLevel: 8 },
      { skill: 'Machine Learning', importance: 'critical', minimumLevel: 8 },
      { skill: 'SQL', importance: 'critical', minimumLevel: 7 },
      { skill: 'Pandas', importance: 'critical', minimumLevel: 7 },
      { skill: 'NumPy', importance: 'critical', minimumLevel: 7 },
      { skill: 'Scikit-learn', importance: 'important', minimumLevel: 6 },
      { skill: 'TensorFlow', importance: 'important', minimumLevel: 6 },
      { skill: 'Statistics', importance: 'critical', minimumLevel: 8 },
      { skill: 'Data Visualization', importance: 'important', minimumLevel: 6 }
    ],
    description: 'Analyze data and build predictive models',
    responsibilities: [
      'Develop machine learning models',
      'Analyze large datasets',
      'Create data visualizations',
      'Present findings to stakeholders'
    ],
    qualifications: [
      'Master\'s degree in Data Science, Statistics, or related field',
      '3-5 years of data science experience',
      'Strong analytical skills'
    ],
    experienceRequired: { min: 3, max: 5 }
  },
  {
    title: 'AI Engineer',
    category: 'AI/ML',
    level: 'Senior',
    requiredSkills: [
      { skill: 'Python', importance: 'critical', minimumLevel: 9 },
      { skill: 'Machine Learning', importance: 'critical', minimumLevel: 9 },
      { skill: 'Deep Learning', importance: 'critical', minimumLevel: 8 },
      { skill: 'TensorFlow', importance: 'critical', minimumLevel: 8 },
      { skill: 'PyTorch', importance: 'critical', minimumLevel: 8 },
      { skill: 'NLP', importance: 'important', minimumLevel: 7 },
      { skill: 'Computer Vision', importance: 'important', minimumLevel: 7 },
      { skill: 'MLOps', importance: 'important', minimumLevel: 6 },
      { skill: 'Docker', importance: 'important', minimumLevel: 6 },
      { skill: 'Kubernetes', importance: 'nice-to-have', minimumLevel: 5 }
    ],
    description: 'Design and implement AI solutions and models',
    responsibilities: [
      'Develop AI/ML models and algorithms',
      'Implement production AI systems',
      'Research new AI techniques',
      'Optimize model performance'
    ],
    qualifications: [
      'Master\'s or PhD in AI, ML, or related field',
      '5+ years of AI/ML experience',
      'Published research preferred'
    ],
    experienceRequired: { min: 5, max: 10 }
  }
];

const seedJobRoles = async () => {
  try {
    await connectDB();
    
    // Clear existing job roles
    await JobRole.deleteMany({});
    console.log('🗑️  Cleared existing job roles');

    // Insert new job roles
    await JobRole.insertMany(jobRolesData);
    console.log('💼 Created job roles');

    console.log('✅ Job roles seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding job roles:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedJobRoles();
}

module.exports = seedJobRoles;