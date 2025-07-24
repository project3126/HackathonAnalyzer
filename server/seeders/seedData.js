const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const LearningModule = require('../models/LearningModule');
const connectDB = require('../config/database');

const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Quiz.deleteMany({});
    await LearningModule.deleteMany({});
    
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = new User({
      name: 'System Admin',
      email: 'admin@company.com',
      password: adminPassword,
      role: 'admin',
      profile: {
        currentRole: 'Administrator',
        desiredRole: 'Administrator',
        skills: ['Management', 'Analytics', 'Leadership'],
        profileComplete: true
      }
    });
    await admin.save();

    // Create sample employee
    const employeePassword = await bcrypt.hash('employee123', 12);
    const employee = new User({
      name: 'John Developer',
      email: 'employee@company.com',
      password: employeePassword,
      role: 'employee',
      profile: {
        currentRole: 'Junior Developer',
        desiredRole: 'Senior Full Stack Developer',
        skills: ['JavaScript', 'React', 'Node.js', 'HTML', 'CSS'],
        experience: 2,
        department: 'Engineering',
        profileComplete: true
      },
      learning: {
        xp: 1250,
        level: 3,
        badges: ['First Steps', 'Quiz Master'],
        currentStreak: 5
      }
    });
    await employee.save();

    console.log('👥 Created users');

    // Create sample quizzes
    const quizzes = [
      {
        title: 'JavaScript Fundamentals',
        description: 'Test your knowledge of JavaScript basics',
        skill: 'JavaScript',
        difficulty: 'easy',
        questions: [
          {
            question: 'What is the correct way to declare a variable in JavaScript?',
            options: ['var x = 5;', 'variable x = 5;', 'v x = 5;', 'declare x = 5;'],
            correctAnswer: 0,
            difficulty: 'easy',
            skill: 'JavaScript',
            explanation: 'var, let, and const are the correct ways to declare variables in JavaScript.'
          },
          {
            question: 'Which method is used to add an element to the end of an array?',
            options: ['push()', 'pop()', 'shift()', 'unshift()'],
            correctAnswer: 0,
            difficulty: 'easy',
            skill: 'JavaScript',
            explanation: 'push() adds elements to the end of an array.'
          },
          {
            question: 'What does "=== " operator do in JavaScript?',
            options: ['Assignment', 'Equality without type checking', 'Strict equality with type checking', 'Not equal'],
            correctAnswer: 2,
            difficulty: 'medium',
            skill: 'JavaScript',
            explanation: '=== checks for strict equality, comparing both value and type.'
          }
        ]
      },
      {
        title: 'React Components',
        description: 'Understanding React component lifecycle and hooks',
        skill: 'React',
        difficulty: 'medium',
        questions: [
          {
            question: 'Which hook is used for managing state in functional components?',
            options: ['useEffect', 'useState', 'useContext', 'useReducer'],
            correctAnswer: 1,
            difficulty: 'easy',
            skill: 'React',
            explanation: 'useState is the primary hook for managing state in functional components.'
          },
          {
            question: 'When does useEffect run by default?',
            options: ['Only on mount', 'Only on unmount', 'After every render', 'Never'],
            correctAnswer: 2,
            difficulty: 'medium',
            skill: 'React',
            explanation: 'useEffect runs after every render by default, unless dependencies are specified.'
          }
        ]
      },
      {
        title: 'Python Data Structures',
        description: 'Advanced Python data structures and algorithms',
        skill: 'Python',
        difficulty: 'hard',
        questions: [
          {
            question: 'What is the time complexity of accessing an element in a Python dictionary?',
            options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
            correctAnswer: 0,
            difficulty: 'medium',
            skill: 'Python',
            explanation: 'Dictionary access is O(1) average case due to hash table implementation.'
          },
          {
            question: 'Which data structure is best for implementing a queue in Python?',
            options: ['list', 'deque', 'set', 'tuple'],
            correctAnswer: 1,
            difficulty: 'hard',
            skill: 'Python',
            explanation: 'collections.deque provides O(1) append and pop operations from both ends.'
          }
        ]
      },
      {
        title: 'System Design Basics',
        description: 'Fundamental concepts of system design',
        skill: 'System Design',
        difficulty: 'hard',
        questions: [
          {
            question: 'What is the primary purpose of load balancing?',
            options: ['Data storage', 'Distribute traffic across servers', 'Encrypt data', 'Cache responses'],
            correctAnswer: 1,
            difficulty: 'medium',
            skill: 'System Design',
            explanation: 'Load balancing distributes incoming requests across multiple servers to prevent overload.'
          },
          {
            question: 'Which database type is best for handling complex relationships?',
            options: ['NoSQL', 'Relational (SQL)', 'Key-value store', 'Document database'],
            correctAnswer: 1,
            difficulty: 'hard',
            skill: 'System Design',
            explanation: 'Relational databases excel at handling complex relationships through foreign keys and joins.'
          }
        ]
      }
    ];

    await Quiz.insertMany(quizzes);
    console.log('📝 Created quizzes');

    // Create learning modules
    const learningModules = [
      {
        title: 'JavaScript ES6+ Features',
        description: 'Master modern JavaScript features including arrow functions, destructuring, and async/await',
        skill: 'JavaScript',
        difficulty: 'Intermediate',
        type: 'video',
        content: {
          url: 'https://www.youtube.com/watch?v=NCwa_xi0Uuc',
          duration: '45 minutes',
          provider: 'YouTube'
        },
        xpReward: 200,
        tags: ['ES6', 'Modern JavaScript', 'Async/Await']
      },
      {
        title: 'React Hooks Deep Dive',
        description: 'Advanced React hooks patterns and custom hook development',
        skill: 'React',
        difficulty: 'Advanced',
        type: 'course',
        content: {
          url: 'https://reactjs.org/docs/hooks-intro.html',
          duration: '2 hours',
          provider: 'React Docs'
        },
        xpReward: 300,
        tags: ['React', 'Hooks', 'Custom Hooks'],
        prerequisites: ['JavaScript', 'React Basics']
      },
      {
        title: 'Python Data Science Fundamentals',
        description: 'Introduction to data science with Python using pandas and numpy',
        skill: 'Python',
        difficulty: 'Intermediate',
        type: 'practice',
        content: {
          url: 'https://pandas.pydata.org/docs/getting_started/index.html',
          duration: '3 hours',
          provider: 'Pandas Documentation'
        },
        xpReward: 350,
        tags: ['Python', 'Data Science', 'Pandas', 'NumPy']
      },
      {
        title: 'Docker Containerization',
        description: 'Learn containerization with Docker from basics to advanced concepts',
        skill: 'Docker',
        difficulty: 'Intermediate',
        type: 'video',
        content: {
          url: 'https://www.youtube.com/watch?v=fqMOX6JJhGo',
          duration: '1.5 hours',
          provider: 'YouTube'
        },
        xpReward: 250,
        tags: ['Docker', 'Containerization', 'DevOps']
      },
      {
        title: 'AWS Cloud Fundamentals',
        description: 'Introduction to Amazon Web Services and cloud computing concepts',
        skill: 'AWS',
        difficulty: 'Beginner',
        type: 'course',
        content: {
          url: 'https://aws.amazon.com/training/digital/',
          duration: '4 hours',
          provider: 'AWS Training'
        },
        xpReward: 400,
        tags: ['AWS', 'Cloud Computing', 'Infrastructure'],
        isPremium: true
      },
      {
        title: 'System Design Interview Prep',
        description: 'Prepare for system design interviews with real-world examples',
        skill: 'System Design',
        difficulty: 'Advanced',
        type: 'article',
        content: {
          url: 'https://github.com/donnemartin/system-design-primer',
          duration: '6 hours',
          provider: 'GitHub'
        },
        xpReward: 500,
        tags: ['System Design', 'Interviews', 'Architecture'],
        prerequisites: ['Database Design', 'Networking Basics']
      },
      {
        title: 'Node.js Backend Development',
        description: 'Build scalable backend applications with Node.js and Express',
        skill: 'Node.js',
        difficulty: 'Intermediate',
        type: 'practice',
        content: {
          url: 'https://nodejs.org/en/docs/',
          duration: '2.5 hours',
          provider: 'Node.js Documentation'
        },
        xpReward: 300,
        tags: ['Node.js', 'Express', 'Backend', 'API Development']
      },
      {
        title: 'MongoDB Database Design',
        description: 'Learn NoSQL database design patterns and best practices',
        skill: 'MongoDB',
        difficulty: 'Intermediate',
        type: 'course',
        content: {
          url: 'https://university.mongodb.com/',
          duration: '3 hours',
          provider: 'MongoDB University'
        },
        xpReward: 280,
        tags: ['MongoDB', 'NoSQL', 'Database Design']
      }
    ];

    await LearningModule.insertMany(learningModules);
    console.log('📚 Created learning modules');

    console.log('✅ Seed data created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@company.com / admin123');
    console.log('Employee: employee@company.com / employee123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;