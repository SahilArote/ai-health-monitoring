import { apiClient } from './client';

export const VitalsAPI = {
  ingest: async (deviceId: string, readings: any[]) => {
    return apiClient.post('/vitals/ingest', { deviceId, readings });
  },

  query: async (patientId: string, metric?: string, from?: string, to?: string) => {
    const params = new URLSearchParams();
    if (metric) params.append('metric', metric);
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    return apiClient.get(`/vitals/${patientId}?${params.toString()}`);
  },

  getTrends: async (patientId: string, metric: string = 'heart_rate', period: string = '7D') => {
    return apiClient.get(`/vitals/${patientId}/trends?metric=${metric}&period=${period}`);
  },
};
