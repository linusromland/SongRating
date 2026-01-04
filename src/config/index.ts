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
  description: string;
  year: string;
  style: ThemeStyle;
  songs: Song[];
}

export interface AppConfig {
  defaultTheme: string;
  themes: Record<string, ThemeConfig>;
}

import { eurovision2025Config } from './themes/eurovision2025';
import { melodifestivalen2025Config } from './themes/melodifestivalen2025';

export const appConfig: AppConfig = {
  defaultTheme: 'eurovision2025',
  themes: {
    eurovision2025: eurovision2025Config,
    melodifestivalen2025: melodifestivalen2025Config,
  },
};

// Get theme by ID (from URL)
export const getThemeById = (themeId: string): ThemeConfig | null => {
  return appConfig.themes[themeId] || null;
};

// Get current theme (keep for backward compatibility)
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
