import api from './api';

const patientService = {
  // Get all patients with optional search
  getAll: async (search = '') => {
    const params = {};
    if (search && search.trim() !== '') {
      params.search = search.trim();
    }
    const response = await api.get('/patients', { params });
    return response.data;
  },

  // Get single patient with appointments
  getById: async (id) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  // Create new patient
  create: async (patientData) => {
    const response = await api.post('/patients', patientData);
    return response.data;
  },

  // Update existing patient
  update: async (id, patientData) => {
    const response = await api.put(`/patients/${id}`, patientData);
    return response.data;
  },

  // Delete patient
  delete: async (id) => {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  },
};

export default patientService;
