import { apiClient } from './client';

export const DevicesAPI = {
  connect: async (platform: string, deviceName: string) => {
    return apiClient.post('/devices/connect', { platform, deviceName });
  },

  list: async () => {
    return apiClient.get('/devices');
  },

  sync: async (deviceId: string) => {
    return apiClient.patch(`/devices/${deviceId}/sync`);
  },
};
