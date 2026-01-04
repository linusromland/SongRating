import { createContext } from 'preact';
import { useState, useEffect, useContext } from 'preact/hooks';
import type { ThemeConfig } from '../config';
import { getCurrentTheme, setCurrentTheme, getAllThemes } from '../config';

interface ThemeContextType {
    currentTheme: ThemeConfig;
    switchTheme: (themeId: string) => void;
    availableThemes: ThemeConfig[];
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: any }) {
    const [currentTheme, setCurrentThemeState] = useState<ThemeConfig>(getCurrentTheme());
    const availableThemes = getAllThemes();

    const switchTheme = (themeId: string) => {
        setCurrentTheme(themeId);
        setCurrentThemeState(getCurrentTheme());
        // Trigger a page reload to reset all state
        window.location.reload();
    };

    useEffect(() => {
        // Update document title
        document.title = currentTheme.title;
        
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
    }, [currentTheme]);

    return (
        <ThemeContext.Provider value={{
            currentTheme,
            switchTheme,
            availableThemes
        }}>
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