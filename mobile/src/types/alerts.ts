export type AlertSeverity = 'critical' | 'caution' | 'normal';

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  metricType?: string;
  metricValue?: string;
  timestamp: string;
  dateGroup: 'TODAY' | 'JUL 29' | 'JUL 28' | string;
  isRead: boolean;
}
