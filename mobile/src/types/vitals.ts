export type MetricStatus = 'normal' | 'caution' | 'critical';

export interface VitalMetric {
  id: string;
  type: 'heart_rate' | 'spo2' | 'blood_pressure' | 'hrv' | 'temperature';
  name: string;
  value: string;
  unit: string;
  status: MetricStatus;
  lastUpdated: string;
}

export interface ActivityData {
  steps: {
    current: number;
    goal: number;
  };
  sleep: {
    hours: number;
    minutes: number;
    goalHours: number;
  };
  calories: {
    current: number;
    goal: number;
  };
}

export interface ChartDataPoint {
  day: string;
  value: number;
}

export interface VitalTrend {
  type: 'heart_rate' | 'spo2' | 'hrv';
  title: string;
  currentValue: string;
  unit: string;
  status: MetricStatus;
  delta: string;
  data: ChartDataPoint[];
}
