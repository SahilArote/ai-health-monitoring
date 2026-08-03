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
      const summaryPayload: any = await AuthAPI.getSummary().catch(() => null);
      const patientId = summaryPayload?.patient?.id || 'cmsd8m8va0001j9tl5on71rvz';

      // Fetch trends for all 3 metrics simultaneously
      const [hrData, spo2Data, tempData] = await Promise.all([
        VitalsAPI.getTrends(patientId, 'heart_rate', state.selectedTrendPeriod).catch(() => null),
        VitalsAPI.getTrends(patientId, 'spo2', state.selectedTrendPeriod).catch(() => null),
        VitalsAPI.getTrends(patientId, 'temperature', state.selectedTrendPeriod).catch(() => null),
      ]);

      const hrTrend = hrData ? adaptTrendsToUI(hrData) : mockTrends[0];
      const spo2Trend = spo2Data ? adaptTrendsToUI(spo2Data) : mockTrends[1];
      const tempTrend = tempData ? adaptTrendsToUI(tempData) : mockTrends[2];

      set({
        trends: [hrTrend, spo2Trend, tempTrend],
        loading: false,
      });
    } catch (err) {
      set({ loading: false });
    }
  },
}));
