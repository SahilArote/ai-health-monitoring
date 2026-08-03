import { create } from 'zustand';
import { DeviceInfo } from '../types/device';
import { mockDevice, mockAvailableDevices } from '../data/mockData';

interface DeviceState {
  connectedDevice: DeviceInfo | null;
  availableDevices: DeviceInfo[];
  isScanning: boolean;
  connectDevice: (deviceId: string) => void;
  disconnectDevice: () => void;
  startScan: () => void;
}

export const useDeviceStore = create<DeviceState>()((set: any) => ({
  connectedDevice: mockDevice,
  availableDevices: mockAvailableDevices,
  isScanning: false,
  
  connectDevice: (deviceId: string) => {
    const device = mockAvailableDevices.find((d) => d.id === deviceId) || mockDevice;
    set({
      connectedDevice: { ...device, isConnected: true },
      isScanning: false,
    });
  },
  
  disconnectDevice: () => {
    set({ connectedDevice: null });
  },
  
  startScan: () => {
    set({ isScanning: true });
    setTimeout(() => {
      set({ isScanning: false, availableDevices: mockAvailableDevices });
    }, 2000);
  },
}));
