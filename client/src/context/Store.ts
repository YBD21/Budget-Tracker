import { create } from 'zustand';
import { ThemeState, UserState } from './types/Store';

export const useThemeStore = create<ThemeState>((set) => ({
  theme: '', // initial
  updateTheme: (newTheme: string) => set({ theme: newTheme }),
}));

export const useUserStore = create<UserState>((set) => ({
  userData: null, // initial
  setUserData: (newData: any) => set({ userData: newData }),
}));
