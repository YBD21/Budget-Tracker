import { create } from 'zustand';

type ThemeState = {
  theme: string;
  updateTheme: (newTheme: string) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: '', // initial
  updateTheme: (newTheme: string) => set({ theme: newTheme }),
}));
