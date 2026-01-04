import { Fragment } from 'preact';
import { Router } from './router/Router';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function AppContent() {
    const { currentTheme, switchTheme, availableThemes } = useTheme();
    
    return (
        <Fragment>
            <div class="container">
                <header class="app-header">
                    <div class="header-content">
                        <div class="title-section">
                            <h1>{currentTheme.title}</h1>
                            <p>{currentTheme.description}</p>
                        </div>
                        {availableThemes.length > 1 && (
                            <div class="theme-selector">
                                <select 
                                    value={currentTheme.id} 
                                    onChange={(e) => switchTheme((e.target as HTMLSelectElement).value)}
                                    class="theme-dropdown"
                                >
                                    {availableThemes.map(theme => (
                                        <option key={theme.id} value={theme.id}>
                                            {theme.name} {theme.year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </header>
                <Router />
            </div>
        </Fragment>
    );
}

export function App() {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
}
