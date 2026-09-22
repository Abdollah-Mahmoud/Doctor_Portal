import api from './api';

const appointmentService = {
  // Get all appointments
  getAll: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },

  // Get upcoming appointments
  getUpcoming: async () => {
    const response = await api.get('/appointments/upcoming');
    return response.data;
  },

  // Get dashboard metrics
  getStats: async () => {
    const response = await api.get('/appointments/stats');
    return response.data;
  },

  // Create appointment
  create: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  // Update appointment (e.g. status or details)
  update: async (id, appointmentData) => {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },

  // Delete appointment
  delete: async (id) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  },
};

export default appointmentService;
