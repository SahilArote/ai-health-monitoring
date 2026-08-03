import { create } from 'zustand';
import { UserProfile } from '../types/user';
import { mockUser } from '../data/mockData';
import { AuthAPI } from '../api/auth.api';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string) => Promise<void>;
  register: (name: string, email: string) => Promise<void>;
  verifyOtp: (code: string) => boolean;
  fetchProfile: () => Promise<void>;
  completeOnboarding: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set: any, get: any) => ({
  user: mockUser,
  isAuthenticated: true,
  isOnboarded: true,
  loading: false,
  error: null,

  login: async (email: string) => {
    set({ loading: true, error: null });
    try {
      // Fetch dynamic profile from backend if server is up
      const profile: any = await AuthAPI.getProfile().catch(() => null);
      if (profile && profile.user) {
        set({
          user: {
            id: profile.id,
            name: profile.user.email.split('@')[0],
            email: profile.user.email,
            phone: profile.user.phone || '',
            patientId: profile.id,
            assignedDoctor: { id: 'd-1', name: 'Dr. Sarah Jenkins', hospital: 'Metro General Hospital' },
          },
          isAuthenticated: true,
          loading: false,
        });
      } else {
        // Fallback for easy preview
        set({
          user: { ...mockUser, email },
          isAuthenticated: true,
          loading: false,
        });
      }
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  register: async (name: string, email: string) => {
    set({ loading: true, error: null });
    try {
      await AuthAPI.registerProfile({
        dob: '1995-01-01',
        sex: 'male',
      }).catch(() => null);

      set({
        user: { ...mockUser, name, email },
        isAuthenticated: true,
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  verifyOtp: (code: string) => {
    if (code.length === 6) {
      set({ isOnboarded: false });
      return true;
    }
    return false;
  },

  fetchProfile: async () => {
    try {
      const profile: any = await AuthAPI.getProfile();
      if (profile && profile.user) {
        set({
          user: {
            id: profile.id,
            name: profile.user.email.split('@')[0],
            email: profile.user.email,
            phone: profile.user.phone || '',
            patientId: profile.id,
            assignedDoctor: { id: 'd-1', name: 'Dr. Sarah Jenkins', hospital: 'Metro General Hospital' },
          },
        });
      }
    } catch (err) {
      // Keep existing state on error
    }
  },

  completeOnboarding: () => {
    set({ isOnboarded: true });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, isOnboarded: false });
  },
}));
