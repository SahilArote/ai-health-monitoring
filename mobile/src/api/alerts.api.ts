import { apiClient } from './client';

export const AlertsAPI = {
  list: async (status?: string, severity?: string, page: number = 1, limit: number = 20) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (severity) params.append('severity', severity);
    params.append('page', `${page}`);
    params.append('limit', `${limit}`);
    return apiClient.get(`/alerts?${params.toString()}`);
  },

  acknowledge: async (alertId: string) => {
    return apiClient.patch(`/alerts/${alertId}/acknowledge`);
  },

  feedback: async (alertId: string, label: 'true_positive' | 'false_positive') => {
    return apiClient.patch(`/alerts/${alertId}/feedback`, { label });
  },

  triggerSOS: async (location?: { latitude?: number; longitude?: number }) => {
    return apiClient.post('/alerts/sos', location || {});
  },
};
