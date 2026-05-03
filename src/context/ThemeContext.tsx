import { createContext } from 'preact';
import { useState, useEffect, useContext } from 'preact/hooks';
import type { ThemeConfig } from '../config';
import { getThemeById, getAllThemes } from '../config';
import { trackEvent, initializeSession } from '../utils/analytics';

interface ThemeContextType {
  currentTheme: ThemeConfig | null;
  availableThemes: ThemeConfig[];
}

const ThemeContext = createContext<ThemeContextType | null>(null);

function getThemeFromUrl(): ThemeConfig | null {
  const path = window.location.pathname;
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) return null; // Landing page
  const themeId = segments[0]; // Get first segment as theme ID
  return getThemeById(themeId);
}

export function ThemeProvider({ children }: { children: any }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig | null>(getThemeFromUrl());
  const availableThemes = getAllThemes();

  useEffect(() => {
    const updateThemeFromUrl = () => {
      setCurrentTheme(getThemeFromUrl());
    };

    // Listen for URL changes
    window.addEventListener('popstate', updateThemeFromUrl);
    return () => window.removeEventListener('popstate', updateThemeFromUrl);
  }, []);

  useEffect(() => {
    if (currentTheme) {
      // Update document title
      document.title = `${currentTheme.name} Song Rating`;

      // Apply theme styles to CSS custom properties
      const root = document.documentElement;
      const style = currentTheme.style;

      root.style.setProperty('--primary-bg', style.primaryBg);
      root.style.setProperty('--secondary-bg', style.secondaryBg);
      root.style.setProperty('--card-bg', style.cardBg);
      root.style.setProperty('--text-color', style.textColor);
      root.style.setProperty('--header-text-color', style.headerTextColor);
      root.style.setProperty('--accent-color-1', style.accentColor1);
      root.style.setProperty('--accent-color-2', style.accentColor2);
      root.style.setProperty('--gold-accent', style.goldAccent);
      
      // Track theme visit for analytics
      trackEvent({
        type: 'theme_visit',
        theme: currentTheme.id,
        data: {
          themeName: currentTheme.name,
          themeYear: currentTheme.year,
          songCount: currentTheme.songs.length
        }
      }).catch(error => {
        console.warn('Failed to track theme visit:', error);
      });
      
      // Update analytics session with current theme
      initializeSession(true, currentTheme.id).catch(error => {
        console.warn('Failed to update session theme:', error);
      });
    } else {
      // Apply neutral landing page styles
      document.title = 'Song Rating App';
      const root = document.documentElement;

      root.style.setProperty('--primary-bg', '#1a1a2e');
      root.style.setProperty('--secondary-bg', '#16213e');
      root.style.setProperty('--card-bg', '#2c3e50');
      root.style.setProperty('--text-color', '#e0e0e0');
      root.style.setProperty('--header-text-color', '#ffffff');
      root.style.setProperty('--accent-color-1', '#667eea');
      root.style.setProperty('--accent-color-2', '#764ba2');
      root.style.setProperty('--gold-accent', '#f9d71c');
      
      // Track landing page visit for analytics
      trackEvent({
        type: 'page_view',
        page: 'landing'
      }).catch(error => {
        console.warn('Failed to track landing page visit:', error);
      });
    }
  }, [currentTheme]);
  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        availableThemes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
