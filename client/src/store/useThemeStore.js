import { create } from 'zustand'

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem('talkbridge-theme') || 'dark',
    setTheme: (theme) => {
        localStorage.setItem('talkbridge-theme', theme),
        set({theme})
    },
}))
