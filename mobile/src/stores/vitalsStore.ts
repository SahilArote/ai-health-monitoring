import { create } from 'zustand';
import { VitalMetric, ActivityData, VitalTrend } from '../types/vitals';
import { mockLiveVitals, mockActivity, mockTrends } from '../data/mockData';

interface VitalsState {
  currentHeartRate: number;
  liveVitals: VitalMetric[];
  activity: ActivityData;
  trends: VitalTrend[];
  selectedTrendPeriod: '7D' | '14D' | '30D';
  setTrendPeriod: (period: '7D' | '14D' | '30D') => void;
  updateHeartRate: (newBpm: number) => void;
}

export const useVitalsStore = create<VitalsState>()((set: any) => ({
  currentHeartRate: 68,
  liveVitals: mockLiveVitals,
  activity: mockActivity,
  trends: mockTrends,
  selectedTrendPeriod: '7D',
  
  setTrendPeriod: (period: '7D' | '14D' | '30D') => set({ selectedTrendPeriod: period }),
  updateHeartRate: (newBpm: number) => set({ currentHeartRate: newBpm }),
}));
