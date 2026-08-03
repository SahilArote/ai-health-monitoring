import { create } from 'zustand';
import { AlertItem, AlertSeverity } from '../types/alerts';
import { mockAlerts } from '../data/mockData';
import { AlertsAPI } from '../api/alerts.api';
import { adaptAlertToUI } from '../services/adapters';

interface AlertState {
  alerts: AlertItem[];
  filter: 'ALL' | AlertSeverity;
  unreadCount: number;
  loading: boolean;
  setFilter: (filter: 'ALL' | AlertSeverity) => void;
  markAsRead: (alertId: string) => Promise<void>;
  triggerSOS: (lat?: number, lng?: number) => Promise<void>;
  fetchAlerts: () => Promise<void>;
}

export const useAlertStore = create<AlertState>()((set: any, get: any) => ({
  alerts: mockAlerts,
  filter: 'ALL',
  unreadCount: mockAlerts.filter((a: AlertItem) => !a.isRead).length,
  loading: false,

  setFilter: (filter: 'ALL' | AlertSeverity) => set({ filter }),

  fetchAlerts: async () => {
    set({ loading: true });
    try {
      const res: any = await AlertsAPI.list();
      const rawAlerts = res?.alerts || (Array.isArray(res) ? res : []);

      if (rawAlerts.length > 0) {
        const adaptedAlerts = rawAlerts.map(adaptAlertToUI);
        set({
          alerts: adaptedAlerts,
          unreadCount: adaptedAlerts.filter((a: AlertItem) => !a.isRead).length,
          loading: false,
        });
      } else {
        set({ loading: false });
      }
    } catch (err) {
      set({ loading: false });
    }
  },

  markAsRead: async (alertId: string) => {
    try {
      await AlertsAPI.acknowledge(alertId).catch(() => null);

      const updated = get().alerts.map((a: AlertItem) =>
        a.id === alertId ? { ...a, isRead: true } : a
      );
      set({
        alerts: updated,
        unreadCount: updated.filter((a: AlertItem) => !a.isRead).length,
      });
    } catch (err) {
      // Keep optimistic update
    }
  },

  triggerSOS: async (lat?: number, lng?: number) => {
    try {
      await AlertsAPI.triggerSOS({ latitude: lat, longitude: lng });
      await get().fetchAlerts();
    } catch (err) {
      console.warn('SOS trigger network warning:', err);
    }
  },
}));
