import { Fragment } from 'preact';
import { getAllThemes } from '../config';
import { YearBadge } from '../components/YearBadge/YearBadge';
import { SEO } from '../components/SEO/SEO';
import styles from './LandingPage.module.css';

export function LandingPage() {
  const themes = getAllThemes();

  const handleThemeSelect = (themeId: string) => {
    window.location.href = `/${themeId}`;
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Song Rating Arena',
    description: 'Battle your favorite songs from music competitions using ELO rating system',
    url: 'https://songrating.linusromland.com',
    applicationCategory: 'Entertainment',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
  };

  return (
    <Fragment>
      <SEO
        title={`Song Rating Arena | ${themes.map((t) => t.name).join(', ')} Song Battle`}
        description={`Battle your favorite songs from ${themes.map((t) => t.name).join(', ')} using our ELO rating system. Create personalized rankings and discover the best songs from various music competitions.`}
        keywords={
          themes.map((t) => `${t.name}, ${t.name} ${t.year}`).join(', ') +
          ', song rating, ELO system, music competition, ranking, battle, vote'
        }
        canonicalUrl="https://songrating.linusromland.com/"
        structuredData={structuredData}
      />
      <div class={styles.landingContainer}>
        <div class={styles.container}>
          <div class={styles.heroSection}>
            <div class={styles.heroContent}>
              <h1 class={styles.heroTitle}>Song Rating Arena</h1>
              <p class={styles.heroSubtitle}>
                Battle songs, build rankings, discover your favorites
              </p>
              <div class={styles.heroStats}>
                <div class={styles.statItem}>
                  <span class={styles.statNumber}>{themes.length}</span>
                  <span class={styles.statLabel}>Competitions</span>
                </div>
                <div class={styles.statItem}>
                  <span class={styles.statNumber}>ELO</span>
                  <span class={styles.statLabel}>Rating System</span>
                </div>
              </div>
            </div>
            <div class={styles.heroGraphic}>
              <div class={styles.musicNote}>♪</div>
              <div class={styles.musicNote}>♫</div>
              <div class={styles.musicNote}>♪</div>
            </div>
          </div>
        </div>

        <div class={styles.container}>
          <div class={styles.competitionsSection}>
            <h2 class={styles.sectionTitle}>Choose Your Competition</h2>
            <div class={styles.themeGrid}>
              {themes.map((theme) => (
                <div
                  key={theme.id}
                  class={styles.themeCard}
                  onClick={() => handleThemeSelect(theme.id)}
                >
                  <div class={styles.cardGlow}></div>
                  <div class={styles.themeContent}>
                    <div class={styles.cardIcon}>
                      {theme.id.includes('eurovision') ? '🇪🇺' : '🇸🇪'}
                    </div>
                    <h3 class={styles.themeName}>{theme.name}</h3>
                    <YearBadge year={theme.year} className={styles.themeYearOverride} />
                    <p class={styles.themeDescription}>{theme.description}</p>
                    <div class={styles.themeButton}>
                      <span>Start Rating</span>
                      <span class={styles.buttonIcon}>→</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
