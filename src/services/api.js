import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

export const questionsAPI = {
  getQuestions: (params) => api.get('/questions', { params }),
  getQuestion: (id) => api.get(`/questions/${id}`),
  createQuestion: (question) => api.post('/questions', question),
  updateQuestion: (id, question) => api.put(`/questions/${id}`, question),
  deleteQuestion: (id) => api.delete(`/questions/${id}`),
};

export const examsAPI = {
  getExams: () => api.get('/exams'),
  getExam: (id) => api.get(`/exams/${id}`),
  createExam: (exam) => api.post('/exams', exam),
  submitExam: (examId, answers) => api.post(`/exams/${examId}/submit`, { answers }),
  getResults: () => api.get('/exams/results'),
};

export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  getProgress: () => api.get('/users/progress'),
};

export const communityAPI = {
  getPosts: (params) => api.get('/community/posts', { params }),
  getPost: (id) => api.get(`/community/posts/${id}`),
  createPost: (post) => api.post('/community/posts', post),
  updatePost: (id, post) => api.put(`/community/posts/${id}`, post),
  deletePost: (id) => api.delete(`/community/posts/${id}`),
  getComments: (postId) => api.get(`/community/posts/${postId}/comments`),
  addComment: (postId, comment) => api.post(`/community/posts/${postId}/comments`, comment),
};

export const paymentsAPI = {
  getPlans: () => api.get('/payments/plans'),
  createSubscription: (planId) => api.post('/payments/subscribe', { planId }),
  getSubscription: () => api.get('/payments/subscription'),
};

export default api;
