// Role-based skill requirements database
const roleSkillsDatabase = {
  'Frontend Developer': [
    'HTML', 'CSS', 'JavaScript', 'React', 'Vue.js', 'Angular', 'TypeScript',
    'SASS', 'Bootstrap', 'Tailwind CSS', 'Webpack', 'Git'
  ],
  'Backend Developer': [
    'Node.js', 'Python', 'Java', 'Express.js', 'Django', 'Spring Boot',
    'MongoDB', 'MySQL', 'PostgreSQL', 'REST API', 'GraphQL', 'Docker'
  ],
  'Full Stack Developer': [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express.js', 'MongoDB',
    'MySQL', 'HTML', 'CSS', 'REST API', 'Git', 'Docker', 'AWS'
  ],
  'Senior Full Stack Developer': [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express.js', 'MongoDB',
    'MySQL', 'PostgreSQL', 'REST API', 'GraphQL', 'Docker', 'Kubernetes',
    'AWS', 'Microservices', 'System Design', 'Team Leadership'
  ],
  'DevOps Engineer': [
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'Jenkins', 'Git', 'Linux',
    'Python', 'Bash', 'Terraform', 'Ansible', 'Monitoring', 'CI/CD'
  ],
  'Data Scientist': [
    'Python', 'R', 'SQL', 'Machine Learning', 'TensorFlow', 'PyTorch',
    'Pandas', 'NumPy', 'Matplotlib', 'Jupyter', 'Statistics', 'Data Visualization'
  ],
  'AI Engineer': [
    'Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch',
    'OpenCV', 'NLP', 'Computer Vision', 'MLOps', 'Docker', 'Kubernetes', 'AWS'
  ],
  'Product Manager': [
    'Product Strategy', 'Market Research', 'User Research', 'Analytics',
    'Agile', 'Scrum', 'JIRA', 'Figma', 'A/B Testing', 'SQL', 'Communication'
  ],
  'UI/UX Designer': [
    'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'Prototyping',
    'User Research', 'Wireframing', 'Design Systems', 'HTML', 'CSS'
  ],
  'QA Engineer': [
    'Manual Testing', 'Automation Testing', 'Selenium', 'Jest', 'Cypress',
    'API Testing', 'Performance Testing', 'Bug Tracking', 'JIRA', 'SQL'
  ]
};

const analyzeSkillGap = (currentSkills, desiredRole) => {
  const requiredSkills = roleSkillsDatabase[desiredRole] || [];
  const currentSkillsLower = currentSkills.map(skill => skill.toLowerCase());
  
  const matchingSkills = requiredSkills.filter(skill => 
    currentSkillsLower.includes(skill.toLowerCase())
  );
  
  const missingSkills = requiredSkills.filter(skill => 
    !currentSkillsLower.includes(skill.toLowerCase())
  ).map(skill => ({
    skill,
    priority: getPriority(skill, desiredRole),
    estimatedLearningTime: getEstimatedLearningTime(skill)
  }));
  
  const matchPercentage = Math.round((matchingSkills.length / requiredSkills.length) * 100);
  
  return {
    requiredSkills,
    currentSkills,
    matchingSkills,
    missingSkills,
    matchPercentage
  };
};

const getPriority = (skill, role) => {
  // Core skills for each role get high priority
  const coreSkills = {
    'Frontend Developer': ['HTML', 'CSS', 'JavaScript', 'React'],
    'Backend Developer': ['Node.js', 'Python', 'MongoDB', 'REST API'],
    'Full Stack Developer': ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    'Senior Full Stack Developer': ['JavaScript', 'TypeScript', 'System Design', 'Team Leadership'],
    'DevOps Engineer': ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    'Data Scientist': ['Python', 'Machine Learning', 'SQL', 'Statistics'],
    'AI Engineer': ['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow'],
    'Product Manager': ['Product Strategy', 'Analytics', 'Agile'],
    'UI/UX Designer': ['Figma', 'User Research', 'Prototyping'],
    'QA Engineer': ['Manual Testing', 'Automation Testing', 'API Testing']
  };
  
  const roleCore = coreSkills[role] || [];
  if (roleCore.includes(skill)) return 'high';
  
  // Advanced/specialized skills get medium priority
  const advancedSkills = ['System Design', 'Microservices', 'Kubernetes', 'Machine Learning'];
  if (advancedSkills.includes(skill)) return 'medium';
  
  return 'low';
};

const getEstimatedLearningTime = (skill) => {
  const timeEstimates = {
    'HTML': '1-2 weeks',
    'CSS': '2-3 weeks',
    'JavaScript': '2-3 months',
    'TypeScript': '3-4 weeks',
    'React': '1-2 months',
    'Node.js': '1-2 months',
    'Python': '2-3 months',
    'MongoDB': '3-4 weeks',
    'MySQL': '3-4 weeks',
    'Docker': '2-3 weeks',
    'Kubernetes': '1-2 months',
    'AWS': '2-3 months',
    'System Design': '3-6 months',
    'Machine Learning': '6-12 months',
    'Deep Learning': '6-12 months'
  };
  
  return timeEstimates[skill] || '1-2 months';
};

const getRecommendedLearningPath = (missingSkills) => {
  // Sort by priority and create learning sequence
  const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
  
  return missingSkills
    .sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
    .slice(0, 8); // Limit to top 8 skills
};

module.exports = {
  analyzeSkillGap,
  getRecommendedLearningPath,
  roleSkillsDatabase
};