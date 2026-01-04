import { Fragment } from 'preact';
import { getAllThemes } from '../config';
import styles from './LandingPage.module.css';

export function LandingPage() {
    const themes = getAllThemes();

    const handleThemeSelect = (themeId: string) => {
        window.location.href = `/${themeId}`;
    };

    return (
        <Fragment>
            <div class="container">
                <header class={styles.landingHeader}>
                    <h1>🎵 Song Rating App</h1>
                    <p>Choose your competition to start rating songs!</p>
                </header>
                
                <div class={styles.themeGrid}>
                    {themes.map(theme => (
                        <div 
                            key={theme.id} 
                            class={styles.themeCard}
                            onClick={() => handleThemeSelect(theme.id)}
                        >
                            <div class={styles.themeContent}>
                                <h2>{theme.name}</h2>
                                <p>{theme.year}</p>
                                <div class={styles.themeDescription}>
                                    {theme.description}
                                </div>
                                <div class={styles.themeButton}>
                                    Start Rating →
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Fragment>
    );
}