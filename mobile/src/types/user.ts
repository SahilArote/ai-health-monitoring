export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  age: number;
  height: string;
  weight: string;
  bloodType: string;
  monitoringStatus: 'active' | 'paused' | 'offline';
  healthProfileStatus: string;
  activeGoalsCount: number;
  dataSharing: string;
  biometricLock: string;
  notificationsEnabled: boolean;
}
