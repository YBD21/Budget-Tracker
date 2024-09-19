import { create } from 'zustand';
import { SearchState, ThemeState, UserState } from './types/Store';

export const useThemeStore = create<ThemeState>((set) => ({
  theme: '', // initial
  updateTheme: (newTheme: string) => set({ theme: newTheme }),
}));

export const useUserStore = create<UserState>((set) => ({
  userData: null, // initial
  setUserData: (newData: any) => {
    set({ userData: newData });
  },
}));

export const useSearchStore = create<SearchState>((set) => ({
  searchData: '', // initial
  setSearchData: (newData: string) => set({ searchData: newData }),
}));
