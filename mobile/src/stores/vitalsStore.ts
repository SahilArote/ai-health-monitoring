import { create } from 'zustand';
import { VitalMetric, ActivityData, VitalTrend } from '../types/vitals';
import { mockLiveVitals, mockActivity, mockTrends } from '../data/mockData';
import { AuthAPI } from '../api/auth.api';
import { VitalsAPI } from '../api/vitals.api';
import { adaptSummaryToHomeUI, adaptTrendsToUI } from '../services/adapters';

interface VitalsState {
  currentHeartRate: number;
  liveVitals: VitalMetric[];
  activity: ActivityData;
  trends: VitalTrend[];
  selectedTrendPeriod: '7D' | '14D' | '30D';
  selectedMetric: 'heart_rate' | 'spo2' | 'temperature';
  loading: boolean;
  setTrendPeriod: (period: '7D' | '14D' | '30D') => void;
  setSelectedMetric: (metric: 'heart_rate' | 'spo2' | 'temperature') => void;
  updateHeartRate: (newBpm: number) => void;
  fetchSummary: () => Promise<void>;
  fetchTrends: () => Promise<void>;
}

export const useVitalsStore = create<VitalsState>()((set: any, get: any) => ({
  currentHeartRate: 68,
  liveVitals: mockLiveVitals,
  activity: mockActivity,
  trends: mockTrends,
  selectedTrendPeriod: '7D',
  selectedMetric: 'heart_rate',
  loading: false,

  setTrendPeriod: (period: '7D' | '14D' | '30D') => {
    set({ selectedTrendPeriod: period });
    get().fetchTrends();
  },

  setSelectedMetric: (metric: 'heart_rate' | 'spo2' | 'temperature') => {
    set({ selectedMetric: metric });
    get().fetchTrends();
  },

  updateHeartRate: (newBpm: number) => set({ currentHeartRate: newBpm }),

  fetchSummary: async () => {
    set({ loading: true });
    try {
      const summaryPayload = await AuthAPI.getSummary();
      const adapted = adaptSummaryToHomeUI(summaryPayload);
      const hrMetric = adapted.liveVitals.find((v) => v.type === 'heart_rate');

      set({
        liveVitals: adapted.liveVitals,
        activity: adapted.activity,
        currentHeartRate: hrMetric ? parseInt(hrMetric.value, 10) || 68 : 68,
        loading: false,
      });
    } catch (err) {
      // Keep mock baseline if server is offline during development
      set({ loading: false });
    }
  },

  fetchTrends: async () => {
    set({ loading: true });
    try {
      const state = get();
      const patientId = 'cmsd8m8va0001j9tl5on71rvz'; // Will be dynamic from authStore or config
      const trendData = await VitalsAPI.getTrends(patientId, state.selectedMetric, state.selectedTrendPeriod);
      const adaptedTrend = adaptTrendsToUI(trendData);

      set({
        trends: [adaptedTrend],
        loading: false,
      });
    } catch (err) {
      set({ loading: false });
    }
  },
}));
