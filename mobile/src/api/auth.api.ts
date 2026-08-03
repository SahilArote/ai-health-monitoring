import { apiClient } from './client';

export const AuthAPI = {
  getProfile: async () => {
    return apiClient.get('/patients/me');
  },

  getSummary: async () => {
    return apiClient.get('/patients/me/summary');
  },

  registerProfile: async (data: {
    dob: string;
    sex: string;
    heightCm?: number;
    weightKg?: number;
    phone?: string;
  }) => {
    return apiClient.post('/patients', data);
  },

  updateProfile: async (data: Partial<{
    dob: string;
    sex: string;
    heightCm: number;
    weightKg: number;
    phone: string;
  }>) => {
    return apiClient.patch('/patients/me', data);
  },

  addEmergencyContact: async (data: { name: string; phone: string; relation: string }) => {
    return apiClient.post('/patients/me/emergency-contacts', data);
  },

  getEmergencyContacts: async () => {
    return apiClient.get('/patients/me/emergency-contacts');
  },
};
