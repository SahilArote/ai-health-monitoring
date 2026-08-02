import { create } from 'zustand';
import { AlertItem, AlertSeverity } from '../types/alerts';
import { mockAlerts } from '../data/mockData';

interface AlertState {
  alerts: AlertItem[];
  filter: 'ALL' | AlertSeverity;
  setFilter: (filter: 'ALL' | AlertSeverity) => void;
  markAsRead: (alertId: string) => void;
  unreadCount: number;
}

export const useAlertStore = create<AlertState>()((set: any, get: any) => ({
  alerts: mockAlerts,
  filter: 'ALL',
  unreadCount: mockAlerts.filter((a: AlertItem) => !a.isRead).length,
  
  setFilter: (filter: 'ALL' | AlertSeverity) => set({ filter }),
  
  markAsRead: (alertId: string) => {
    const updated = get().alerts.map((a: AlertItem) =>
      a.id === alertId ? { ...a, isRead: true } : a
    );
    set({
      alerts: updated,
      unreadCount: updated.filter((a: AlertItem) => !a.isRead).length,
    });
  },
}));
