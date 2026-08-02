import { VitalMetric, ActivityData, VitalTrend } from '../types/vitals';
import { AlertItem } from '../types/alerts';
import { DeviceInfo } from '../types/device';
import { UserProfile } from '../types/user';

export const mockUser: UserProfile = {
  id: 'usr_123',
  name: 'Sarah Chen',
  email: 's.chen@hospital.org',
  age: 34,
  height: `5'7"`,
  weight: '138 lb',
  bloodType: 'A+',
  monitoringStatus: 'active',
  healthProfileStatus: 'Complete',
  activeGoalsCount: 4,
  dataSharing: 'Care team only',
  biometricLock: 'Face ID',
  notificationsEnabled: true,
};

export const mockDevice: DeviceInfo = {
  id: 'dev_hg_pro',
  name: 'HealthGuard Pro',
  model: 'HG-Pro Series 4',
  battery: 84,
  signalBars: 3,
  firmware: 'v4.2.1',
  isConnected: true,
};

export const mockAvailableDevices: DeviceInfo[] = [
  {
    id: 'dev_hg_pro',
    name: 'HealthGuard Pro',
    model: 'HG-Pro Series 4',
    battery: 84,
    signalBars: 3,
    firmware: 'v4.2.1',
    isConnected: false,
  },
  {
    id: 'dev_hg_air',
    name: 'HealthGuard Air',
    model: 'HG-Air Series 2',
    battery: 61,
    signalBars: 2,
    firmware: 'v3.1.0',
    isConnected: false,
  },
];

export const mockLiveVitals: VitalMetric[] = [
  {
    id: 'v1',
    type: 'spo2',
    name: 'SpO₂',
    value: '98',
    unit: '%',
    status: 'normal',
    lastUpdated: 'Just now',
  },
  {
    id: 'v2',
    type: 'blood_pressure',
    name: 'Blood Pressure',
    value: '118/76',
    unit: 'mmHg',
    status: 'normal',
    lastUpdated: 'Just now',
  },
  {
    id: 'v3',
    type: 'hrv',
    name: 'HRV',
    value: '42',
    unit: 'ms',
    status: 'normal',
    lastUpdated: 'Just now',
  },
  {
    id: 'v4',
    type: 'temperature',
    name: 'Body Temp',
    value: '98.4',
    unit: '°F',
    status: 'normal',
    lastUpdated: 'Just now',
  },
];

export const mockActivity: ActivityData = {
  steps: {
    current: 8234,
    goal: 10000,
  },
  sleep: {
    hours: 7,
    minutes: 23,
    goalHours: 8,
  },
  calories: {
    current: 1847,
    goal: 2200,
  },
};

export const mockAlerts: AlertItem[] = [
  {
    id: 'alt_1',
    title: 'Elevated Heart Rate',
    description: 'Heart rate reached 112 BPM during rest at 2:34 PM.',
    severity: 'caution',
    metricType: 'Heart Rate',
    metricValue: '112 BPM',
    timestamp: '2:34 PM',
    dateGroup: 'TODAY',
    isRead: false,
  },
  {
    id: 'alt_2',
    title: 'Daily Step Goal Reached',
    description: "You've achieved your 8,000-step goal for the day.",
    severity: 'normal',
    metricType: 'Steps',
    metricValue: '8,234',
    timestamp: '1:15 PM',
    dateGroup: 'TODAY',
    isRead: true,
  },
  {
    id: 'alt_3',
    title: 'Low SpO₂ Detected',
    description: 'Blood oxygen dropped to 91% for 3 minutes during sleep.',
    severity: 'critical',
    metricType: 'SpO₂',
    metricValue: '91%',
    timestamp: '3:17 AM',
    dateGroup: 'JUL 29',
    isRead: true,
  },
  {
    id: 'alt_4',
    title: 'HRV Recovery',
    description: 'Heart rate variability returned to baseline after restful sleep.',
    severity: 'normal',
    metricType: 'HRV',
    metricValue: '48 ms',
    timestamp: '7:02 AM',
    dateGroup: 'JUL 28',
    isRead: true,
  },
  {
    id: 'alt_5',
    title: 'Body Temperature Normal',
    description: 'Core body temperature stabilized after mild elevation.',
    severity: 'normal',
    metricType: 'Temp',
    metricValue: '98.4 °F',
    timestamp: '9:45 PM',
    dateGroup: 'JUL 28',
    isRead: true,
  },
];

export const mockTrends: VitalTrend[] = [
  {
    type: 'heart_rate',
    title: 'Heart Rate',
    currentValue: '69',
    unit: 'bpm',
    status: 'normal',
    delta: '±1',
    data: [
      { day: 'Mon', value: 65 },
      { day: 'Tue', value: 68 },
      { day: 'Wed', value: 66 },
      { day: 'Thu', value: 71 },
      { day: 'Fri', value: 69 },
      { day: 'Sat', value: 72 },
      { day: 'Sun', value: 68 },
    ],
  },
  {
    type: 'spo2',
    title: 'Blood Oxygen (SpO₂)',
    currentValue: '97.4',
    unit: '%',
    status: 'normal',
    delta: '±0.5%',
    data: [
      { day: 'Mon', value: 98 },
      { day: 'Tue', value: 97 },
      { day: 'Wed', value: 98.5 },
      { day: 'Thu', value: 96 },
      { day: 'Fri', value: 98 },
      { day: 'Sat', value: 97 },
      { day: 'Sun', value: 98.2 },
    ],
  },
  {
    type: 'hrv',
    title: 'Heart Rate Variability',
    currentValue: '41',
    unit: 'ms',
    status: 'caution',
    delta: '-3 ms',
    data: [
      { day: 'Mon', value: 45 },
      { day: 'Tue', value: 44 },
      { day: 'Wed', value: 46 },
      { day: 'Thu', value: 39 },
      { day: 'Fri', value: 42 },
      { day: 'Sat', value: 40 },
      { day: 'Sun', value: 41 },
    ],
  },
];
