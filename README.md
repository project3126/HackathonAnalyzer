# SkillForge - Personalized Learning & Skill-Gap Analysis Platform

A comprehensive AI-powered learning platform that helps employees identify skill gaps, receive personalized learning recommendations, and track their progress through gamified experiences.

## 🚀 Features

### For Learners (Employees)
- **Resume Upload & Parsing**: Upload PDF/DOCX resumes for automatic skill extraction
- **Skill Gap Analysis**: Compare current skills with desired role requirements
- **Personalized Learning Paths**: Get customized roadmaps based on skill gaps
- **Adaptive Quiz Engine**: Take quizzes that adapt to your performance level
- **Mock Interview Arena**: Practice with AI-powered interview simulations
- **Gamified Progress Tracking**: Earn XP, levels, badges, and maintain learning streaks
- **Interactive Dashboard**: Duolingo-style interface with progress visualization

### For Administrators
- **User Management**: Monitor all users and their learning progress
- **Analytics Dashboard**: View platform-wide statistics and insights
- **Reporting System**: Generate detailed reports on user progress and skill gaps
- **System Settings**: Configure platform settings and manage content

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API communication
- **Vite** for build tooling

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **bcryptjs** for password hashing

### AI & Processing
- **PDF-Parse** for PDF resume parsing
- **Mammoth** for DOCX resume parsing
- **OpenAI API** integration ready for advanced features

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd skillforge-platform
```

### 2. Install Dependencies

#### Frontend Dependencies
```bash
npm install
```

#### Backend Dependencies
```bash
cd server
npm install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the root directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/skillforge

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:5173

# OpenAI (optional, for AI features)
OPENAI_API_KEY=your-openai-api-key-here

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### 4. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The application will create the database automatically

#### Option B: MongoDB Atlas (Cloud)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env` file

### 5. Seed Initial Data
```bash
npm run seed
```

This will create:
- Admin user: `admin@company.com` / `admin123`
- Sample employee: `employee@company.com` / `employee123`
- Sample quizzes and learning modules

### 6. Start the Application

#### Development Mode (Both Frontend & Backend)
```bash
npm run dev:full
```

#### Or start separately:

**Backend only:**
```bash
npm run dev:server
```

**Frontend only:**
```bash
npm run dev
```

### 7. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🔐 Default Login Credentials

### Admin Account
- **Email**: admin@company.com
- **Password**: admin123

### Employee Account
- **Email**: employee@company.com
- **Password**: employee123

## 📁 Project Structure

```
skillforge-platform/
├── src/                          # Frontend React application
│   ├── components/              # React components
│   │   ├── admin/              # Admin dashboard components
│   │   ├── auth/               # Authentication components
│   │   ├── common/             # Shared components
│   │   └── dashboard/          # Employee dashboard components
│   ├── contexts/               # React contexts
│   ├── services/               # API service functions
│   └── main.tsx               # Application entry point
├── server/                      # Backend Node.js application
│   ├── config/                 # Database configuration
│   ├── middleware/             # Express middleware
│   ├── models/                 # MongoDB models
│   ├── routes/                 # API routes
│   ├── seeders/                # Database seeders
│   ├── utils/                  # Utility functions
│   └── server.js              # Server entry point
├── uploads/                     # File upload directory
└── README.md                   # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Resume & Skills
- `POST /api/resume/upload` - Upload resume
- `POST /api/resume/analyze-skills` - Analyze skill gaps
- `GET /api/resume/skill-gap` - Get skill gap analysis

### Quizzes
- `GET /api/quiz` - Get all quizzes
- `GET /api/quiz/:id` - Get specific quiz
- `POST /api/quiz/:id/submit` - Submit quiz answers

### Learning
- `GET /api/learning/modules` - Get learning modules
- `POST /api/learning/modules/:id/complete` - Complete module
- `GET /api/learning/progress` - Get learning progress

### Interviews
- `POST /api/interview/start` - Start interview session
- `POST /api/interview/submit` - Submit interview responses
- `GET /api/interview/history` - Get interview history

### Admin
- `GET /api/admin/analytics` - Get platform analytics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/reports/:type` - Generate reports

## 🎯 Key Features Implementation

### 1. Resume Parsing
- Supports PDF and DOCX formats
- Extracts skills, experience, education, and projects
- Uses text processing to identify relevant technologies

### 2. Skill Gap Analysis
- Compares user skills with role requirements
- Calculates match percentage
- Prioritizes missing skills by importance

### 3. Adaptive Quiz System
- Questions adapt based on performance
- Tracks accuracy and time spent
- Provides detailed feedback and explanations

### 4. Gamification
- XP points and leveling system
- Achievement badges
- Learning streaks
- Progress visualization

### 5. Mock Interviews
- AI-generated questions
- Multiple response formats (text/audio/video)
- Performance scoring and feedback

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables for Production
Update your `.env` file with production values:
- Use a strong `JWT_SECRET`
- Set `NODE_ENV=production`
- Use production MongoDB URI
- Configure proper CORS origins

### Deployment Platforms
- **Frontend**: Vercel, Netlify, or any static hosting
- **Backend**: Heroku, Railway, DigitalOcean, or AWS
- **Database**: MongoDB Atlas (recommended for production)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include error logs and steps to reproduce

## 🔮 Future Enhancements

- [ ] Advanced AI interview analysis with emotion detection
- [ ] Integration with external learning platforms (Coursera, Udemy)
- [ ] Social learning features and leaderboards
- [ ] Mobile application
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Video-based learning modules
- [ ] Peer-to-peer learning features

---

**Built with ❤️ by the SkillForge Team**