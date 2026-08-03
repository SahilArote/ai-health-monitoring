import { create } from 'zustand';
import { DeviceInfo } from '../types/device';
import { mockDevice } from '../data/mockData';
import { DevicesAPI } from '../api/devices.api';

interface DeviceState {
  device: DeviceInfo | null;
  connectedDevice: DeviceInfo | null;
  isConnected: boolean;
  loading: boolean;
  isScanning: boolean;
  availableDevices: Array<DeviceInfo>;
  connectDevice: (platformOrId: string, name?: string) => Promise<void>;
  startScan: () => void;
  syncDevice: () => Promise<void>;
  fetchDevices: () => Promise<void>;
  disconnect: () => void;
}

export const useDeviceStore = create<DeviceState>()((set: any, get: any) => ({
  device: mockDevice,
  connectedDevice: mockDevice,
  isConnected: true,
  loading: false,
  isScanning: false,
  availableDevices: [
    { id: 'd-ble-1', name: 'Galaxy Watch 6', model: 'SM-R930', battery: 85, batteryLevel: 85, signalBars: 4, firmware: 'v2.4.1', isConnected: false },
    { id: 'd-ble-2', name: 'Apple Watch Series 9', model: 'A2980', battery: 92, batteryLevel: 92, signalBars: 3, firmware: 'v10.3', isConnected: false },
  ],

  startScan: () => {
    set({ isScanning: true });
    setTimeout(() => {
      set({ isScanning: false });
    }, 3000);
  },

  fetchDevices: async () => {
    set({ loading: true });
    try {
      const devices: any = await DevicesAPI.list();
      const firstDevice = Array.isArray(devices) && devices.length > 0 ? devices[0] : null;

      if (firstDevice) {
        const mapped: DeviceInfo = {
          id: firstDevice.id,
          name: firstDevice.deviceName,
          model: firstDevice.deviceName,
          battery: 88,
          batteryLevel: 88,
          signalBars: 4,
          firmware: 'v2.1.0',
          isConnected: firstDevice.status === 'connected',
          status: firstDevice.status === 'connected' ? 'connected' : 'disconnected',
          lastSynced: firstDevice.lastSyncAt
            ? new Date(firstDevice.lastSyncAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'Just now',
        };
        set({
          device: mapped,
          connectedDevice: mapped,
          isConnected: firstDevice.status === 'connected',
          loading: false,
        });
      } else {
        set({ loading: false });
      }
    } catch (err) {
      set({ loading: false });
    }
  },

  connectDevice: async (platformOrId: string, name?: string) => {
    set({ loading: true });
    const deviceName = name || platformOrId || 'Smartwatch';
    const platform = platformOrId.includes('Apple') ? 'healthkit' : 'synthetic';

    try {
      const newDev: any = await DevicesAPI.connect(platform, deviceName).catch(() => null);

      const mapped: DeviceInfo = {
        id: newDev?.id || 'd-new',
        name: deviceName,
        model: deviceName,
        battery: 100,
        batteryLevel: 100,
        signalBars: 4,
        firmware: 'v1.0.0',
        isConnected: true,
        status: 'connected',
        lastSynced: 'Just now',
      };

      set({
        device: mapped,
        connectedDevice: mapped,
        isConnected: true,
        loading: false,
      });
    } catch (err) {
      set({ loading: false });
    }
  },

  syncDevice: async () => {
    const dev = get().device;
    if (dev) {
      try {
        await DevicesAPI.sync(dev.id).catch(() => null);
        const mapped = { ...dev, lastSynced: 'Just now' };
        set({
          device: mapped,
          connectedDevice: mapped,
        });
      } catch (err) {
        // Fallback
      }
    }
  },

  disconnect: () => {
    set({ device: null, connectedDevice: null, isConnected: false });
  },
}));
