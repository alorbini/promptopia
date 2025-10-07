import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import { I18nManager } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type State = {
    lang: 'ar' | 'en';
    theme: 'light' | 'dark';
    setLang: (lang: 'ar' | 'en') => void;
    toggleTheme: () => void;
};

const useGlobalStore = create<State>()(
    persist(
        (set) => ({
            lang: I18nManager.isRTL ? 'ar' : 'en',
            theme: 'dark', // Default to dark theme
            setLang: (lang) => {
                set({ lang });
                const isRTL = lang === 'ar';
                if (I18nManager.isRTL !== isRTL) {
                    I18nManager.forceRTL(isRTL);
                    // A manual reload is needed for RTL changes to apply fully.
                    Updates.reloadAsync();
                }
            },
            toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
        }),
        {
            name: 'prompt-library-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useGlobalStore;
