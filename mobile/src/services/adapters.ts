import { VitalMetric, MetricStatus, VitalTrend, ActivityData } from '../types/vitals';
import { AlertItem, AlertSeverity } from '../types/alerts';
import { UserProfile } from '../types/user';
import { ConnectedDevice } from '../types/device';

/**
 * Maps Backend Alert record -> Frontend UI AlertItem
 */
export function adaptAlertToUI(backendAlert: any): AlertItem {
  const isCritical = backendAlert.severity === 'critical';
  const severity: AlertSeverity = isCritical ? 'critical' : 'caution';
  const metricName = (backendAlert.metricType || 'vital').replace('_', ' ');

  const title = isCritical
    ? `Critical ${metricName.toUpperCase()} Alert`
    : `Warning: Abnormal ${metricName}`;

  const description =
    backendAlert.metricType === 'sos'
      ? 'Emergency SOS triggered from mobile app. Help dispatched.'
      : `Measured value: ${backendAlert.value} breaching safety thresholds.`;

  const dateObj = new Date(backendAlert.createdAt);
  const now = new Date();
  const isToday = dateObj.toDateString() === now.toDateString();
  const dateGroup = isToday
    ? 'TODAY'
    : dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();

  return {
    id: backendAlert.id,
    title,
    description,
    severity,
    metricType: backendAlert.metricType,
    metricValue: `${backendAlert.value}`,
    timestamp: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    dateGroup,
    isRead: backendAlert.status === 'acknowledged' || backendAlert.status === 'resolved',
  };
}

/**
 * Maps Backend Patient Summary -> Frontend UI Home State
 */
export function adaptSummaryToHomeUI(summary: any): {
  user: UserProfile;
  liveVitals: VitalMetric[];
  activity: ActivityData;
  connectedDevice: ConnectedDevice | null;
  overallStatus: MetricStatus;
} {
  const p = summary.patient || {};
  const v = summary.latestVitals || {};
  const d = summary.device;

  const user: UserProfile = {
    id: p.id || 'p-1',
    name: p.email ? p.email.split('@')[0] : 'Patient',
    email: p.email || '',
    phone: p.phone || '',
    patientId: p.id || '',
    assignedDoctor: {
      id: 'd-1',
      name: p.doctorName || 'Dr. Sarah Jenkins',
      hospital: 'Metro General Hospital',
    },
  };

  const getStatus = (val: number, metric: string): MetricStatus => {
    if (metric === 'heart_rate') return val > 130 || val < 40 ? 'critical' : val > 110 ? 'caution' : 'normal';
    if (metric === 'spo2') return val < 92 ? 'critical' : val < 95 ? 'caution' : 'normal';
    if (metric === 'temperature') return val > 39.5 ? 'critical' : val > 38.0 ? 'caution' : 'normal';
    return 'normal';
  };

  const liveVitals: VitalMetric[] = [
    {
      id: 'v-1',
      type: 'heart_rate',
      name: 'Heart Rate',
      value: v.heart_rate ? `${v.heart_rate.value}` : '72',
      unit: 'bpm',
      status: v.heart_rate ? getStatus(v.heart_rate.value, 'heart_rate') : 'normal',
      lastUpdated: v.heart_rate ? new Date(v.heart_rate.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
    },
    {
      id: 'v-2',
      type: 'spo2',
      name: 'SpO₂ Level',
      value: v.spo2 ? `${v.spo2.value}` : '98',
      unit: '%',
      status: v.spo2 ? getStatus(v.spo2.value, 'spo2') : 'normal',
      lastUpdated: v.spo2 ? new Date(v.spo2.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
    },
    {
      id: 'v-3',
      type: 'temperature',
      name: 'Body Temp',
      value: v.temperature ? `${v.temperature.value}` : '36.8',
      unit: '°C',
      status: v.temperature ? getStatus(v.temperature.value, 'temperature') : 'normal',
      lastUpdated: v.temperature ? new Date(v.temperature.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
    },
  ];

  const activity: ActivityData = {
    steps: {
      current: v.steps ? v.steps.value : 4320,
      goal: 8000,
    },
    sleep: {
      hours: v.sleep ? Math.floor(v.sleep.value) : 7,
      minutes: v.sleep ? Math.round((v.sleep.value % 1) * 60) : 30,
      goalHours: 8,
    },
    calories: {
      current: 420,
      goal: 600,
    },
  };

  const connectedDevice: ConnectedDevice | null = d
    ? {
        id: d.id,
        name: d.deviceName,
        status: d.status === 'connected' ? 'connected' : 'disconnected',
        batteryLevel: 85,
        lastSynced: d.lastSyncAt ? new Date(d.lastSyncAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
      }
    : null;

  return {
    user,
    liveVitals,
    activity,
    connectedDevice,
    overallStatus: summary.overallStatus || 'normal',
  };
}

/**
 * Maps Backend Trends Payload -> Frontend UI VitalTrend
 */
export function adaptTrendsToUI(backendTrendData: any): VitalTrend {
  const metric = backendTrendData.metric || 'heart_rate';
  const period = backendTrendData.period || '7D';
  const points = backendTrendData.trends || [];

  const typeMap: Record<string, 'heart_rate' | 'spo2' | 'hrv'> = {
    heart_rate: 'heart_rate',
    spo2: 'spo2',
    temperature: 'hrv',
  };

  const titleMap: Record<string, string> = {
    heart_rate: 'Resting Heart Rate',
    spo2: 'Blood Oxygen (SpO₂)',
    temperature: 'Body Temperature',
  };

  const unitMap: Record<string, string> = {
    heart_rate: 'bpm',
    spo2: '%',
    temperature: '°C',
  };

  const chartData = points.map((p: any) => {
    const d = new Date(p.date);
    const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2);
    return {
      day: dayStr,
      value: p.avg,
    };
  });

  const latestVal = points.length > 0 ? points[points.length - 1].value : 72;

  return {
    type: typeMap[metric] || 'heart_rate',
    title: titleMap[metric] || 'Vital Trend',
    currentValue: `${latestVal}`,
    unit: unitMap[metric] || '',
    status: 'normal',
    delta: '-2.4%',
    data: chartData,
  };
}
