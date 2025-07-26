import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Resume API
export const resumeAPI = {
  upload: (formData) => api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  analyzeSkills: (desiredRole) => api.post('/resume/analyze-skills', { desiredRole }),
  getSkillGap: () => api.get('/resume/skill-gap'),
};

// Quiz API
export const quizAPI = {
  getQuizzes: () => api.get('/quiz'),
  getQuiz: (id) => api.get(`/quiz/${id}`),
  submitQuiz: (id, answers, timeSpent) => api.post(`/quiz/${id}/submit`, { answers, timeSpent }),
  getResults: () => api.get('/quiz/results/me'),
};

// Learning API
export const learningAPI = {
  getModules: () => api.get('/learning/modules'),
  completeModule: (id) => api.post(`/learning/modules/${id}/complete`),
  getProgress: () => api.get('/learning/progress'),
};

// Interview API
export const interviewAPI = {
  startSession: (categories) => api.post('/interview/start', { categories }),
  submitResponses: (sessionId, responses) => api.post('/interview/submit', { sessionId, responses }),
  getHistory: () => api.get('/interview/history'),
};

// Admin API
export const adminAPI = {
  getAnalytics: () => api.get('/admin/analytics'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserDetails: (id) => api.get(`/admin/users/${id}`),
  generateReport: (type, params) => api.get(`/admin/reports/${type}`, { params }),
};

// Progress API
export const progressAPI = {
  getProgress: () => api.get('/progress'),
  updateSkillProgress: (skillName, data) => api.put(`/progress/skill/${skillName}`, data),
  addAchievement: (achievement) => api.post('/progress/achievement', achievement),
  getAnalytics: () => api.get('/progress/analytics'),
};

// Job Roles API
export const jobRoleAPI = {
  getJobRoles: (params) => api.get('/job-roles', { params }),
  getJobRole: (id) => api.get(`/job-roles/${id}`),
  getJobRoleSkills: (id) => api.get(`/job-roles/${id}/skills`),
  createJobRole: (data) => api.post('/job-roles', data),
  updateJobRole: (id, data) => api.put(`/job-roles/${id}`, data),
  deleteJobRole: (id) => api.delete(`/job-roles/${id}`),
};

export default api;