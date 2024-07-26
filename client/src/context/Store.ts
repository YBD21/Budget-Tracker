import { create } from 'zustand';

type ThemeState = {
  theme: string;
  updateTheme: (newTheme: string) => void;
};

type UserState = {
  userData: any;
  setUserData: (newData: any) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: '', // initial
  updateTheme: (newTheme: string) => set({ theme: newTheme }),
}));

export const useUserStore = create<UserState>((set) => ({
  userData: null, // initial
  setUserData: (newData: any) => set({ userData: newData }),
}));
