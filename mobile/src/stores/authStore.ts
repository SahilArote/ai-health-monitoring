import { create } from 'zustand';
import { UserProfile } from '../types/user';
import { mockUser } from '../data/mockData';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  login: (email: string) => void;
  register: (name: string, email: string) => void;
  verifyOtp: (code: string) => boolean;
  completeOnboarding: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set: any) => ({
  user: mockUser,
  isAuthenticated: true, // set to true for easy preview of main app
  isOnboarded: true,
  
  login: (email: string) => {
    set({
      user: { ...mockUser, email },
      isAuthenticated: true,
    });
  },
  
  register: (name: string, email: string) => {
    set({
      user: { ...mockUser, name, email },
      isAuthenticated: true,
    });
  },
  
  verifyOtp: (code: string) => {
    if (code.length === 6) {
      set({ isOnboarded: false });
      return true;
    }
    return false;
  },
  
  completeOnboarding: () => {
    set({ isOnboarded: true });
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false, isOnboarded: false });
  },
}));

