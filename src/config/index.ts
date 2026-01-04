import type { Song } from '../types';

export interface ThemeStyle {
    primaryBg: string;
    secondaryBg: string;
    cardBg: string;
    textColor: string;
    headerTextColor: string;
    accentColor1: string;
    accentColor2: string;
    goldAccent: string;
}

export interface ThemeConfig {
    id: string;
    name: string;
    title: string;
    description: string;
    year: string;
    scoreboardTitle: string;
    loadingMessage: string;
    shareDialogPlaceholder: string;
    localStorageKey: string;
    style: ThemeStyle;
    songs: Song[];
}

export interface AppConfig {
    defaultTheme: string;
    themes: Record<string, ThemeConfig>;
}

import { eurovisionConfig } from './themes/eurovision';
import { melodifestivalen2025Config } from './themes/melodifestivalen2025';

export const appConfig: AppConfig = {
    defaultTheme: 'eurovision',
    themes: {
        eurovision: eurovisionConfig,
        melodifestivalen2025: melodifestivalen2025Config,
    }
};

export const getCurrentTheme = (): ThemeConfig => {
    const themeId = localStorage.getItem('selectedTheme') || appConfig.defaultTheme;
    return appConfig.themes[themeId] || appConfig.themes[appConfig.defaultTheme];
};

// Function to switch themes
export const setCurrentTheme = (themeId: string): void => {
    if (appConfig.themes[themeId]) {
        localStorage.setItem('selectedTheme', themeId);
    }
};

export const getAllThemes = (): ThemeConfig[] => {
    return Object.values(appConfig.themes);
};