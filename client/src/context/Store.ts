import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useThemeName = create(
  persist(
    (set) => ({
      theme: '', // initial
      updateTheme: (newTheme) => set({ theme: newTheme }),
      removeTheme: () => set({ theme: '' }),
    }),
    {
      name: 'theme',
    },
  ),
)
