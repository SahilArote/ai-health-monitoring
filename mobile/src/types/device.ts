export interface DeviceInfo {
  id: string;
  name: string;
  model?: string;
  battery?: number;
  batteryLevel?: number;
  signalBars?: number;
  firmware?: string;
  isConnected?: boolean;
  status?: 'connected' | 'disconnected' | 'error';
  lastSynced?: string;
}

export type ConnectedDevice = DeviceInfo;
