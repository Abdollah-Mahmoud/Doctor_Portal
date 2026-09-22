import api from './api';

const authService = {
  // Register doctor
  register: async (doctorData) => {
    const response = await api.post('/auth/register', doctorData);
    if (response.data.token) {
      localStorage.setItem('doctorToken', response.data.token);
      localStorage.setItem('doctorInfo', JSON.stringify(response.data.doctor));
    }
    return response.data;
  },

  // Login doctor
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('doctorToken', response.data.token);
      localStorage.setItem('doctorInfo', JSON.stringify(response.data.doctor));
    }
    return response.data;
  },

  // Logout doctor
  logout: () => {
    localStorage.removeItem('doctorToken');
    localStorage.removeItem('doctorInfo');
  },

  // Get current doctor profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data);
    if (response.data) {
      localStorage.setItem('doctorInfo', JSON.stringify(response.data));
    }
    return response.data;
  },

  // Get stored doctor info
  getCurrentDoctor: () => {
    const doctorStr = localStorage.getItem('doctorInfo');
    try {
      return doctorStr ? JSON.parse(doctorStr) : null;
    } catch {
      return null;
    }
  },

  // Check if authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('doctorToken');
  },
};

export default authService;
