const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

// Skills database for matching
const skillsDatabase = [
  // Programming Languages
  'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'TypeScript',
  // Frontend
  'React', 'Vue.js', 'Angular', 'HTML', 'CSS', 'SASS', 'Bootstrap', 'Tailwind CSS',
  // Backend
  'Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'Ruby on Rails',
  // Databases
  'MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'SQLite', 'Oracle', 'Cassandra',
  // Cloud & DevOps
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'GitHub',
  // Tools & Frameworks
  'REST API', 'GraphQL', 'Microservices', 'Agile', 'Scrum', 'JIRA', 'Figma', 'Photoshop'
];

const parseResume = async (filePath, originalName) => {
  try {
    const fileExtension = path.extname(originalName).toLowerCase();
    let text = '';

    if (fileExtension === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      text = data.text;
    } else if (fileExtension === '.docx' || fileExtension === '.doc') {
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
    }

    // Extract information from text
    const parsedData = {
      skills: extractSkills(text),
      experience: extractExperience(text),
      education: extractEducation(text),
      projects: extractProjects(text)
    };

    return parsedData;
  } catch (error) {
    console.error('Resume parsing error:', error);
    throw new Error('Failed to parse resume');
  }
};

const extractSkills = (text) => {
  const foundSkills = [];
  const lowerText = text.toLowerCase();
  
  skillsDatabase.forEach(skill => {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });
  
  return [...new Set(foundSkills)]; // Remove duplicates
};

const extractExperience = (text) => {
  const experiencePatterns = [
    /experience[:\s]*([^\n]+)/gi,
    /work[:\s]*([^\n]+)/gi,
    /employment[:\s]*([^\n]+)/gi
  ];
  
  const experiences = [];
  experiencePatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      experiences.push(...matches);
    }
  });
  
  return experiences.slice(0, 5); // Limit to 5 entries
};

const extractEducation = (text) => {
  const educationPatterns = [
    /education[:\s]*([^\n]+)/gi,
    /degree[:\s]*([^\n]+)/gi,
    /university[:\s]*([^\n]+)/gi,
    /college[:\s]*([^\n]+)/gi
  ];
  
  const education = [];
  educationPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      education.push(...matches);
    }
  });
  
  return education.slice(0, 3); // Limit to 3 entries
};

const extractProjects = (text) => {
  const projectPatterns = [
    /project[s]?[:\s]*([^\n]+)/gi,
    /built[:\s]*([^\n]+)/gi,
    /developed[:\s]*([^\n]+)/gi
  ];
  
  const projects = [];
  projectPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      projects.push(...matches);
    }
  });
  
  return projects.slice(0, 5); // Limit to 5 entries
};

module.exports = { parseResume };