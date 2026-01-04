import { decompressFromEncodedURIComponent } from 'lz-string';

import { Fragment } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import type { EloRatings, Song, UrlData } from '../types';
import { Scoreboard } from '../components/Scoreboard/Scoreboard';
import { YearBadge } from '../components/YearBadge/YearBadge';
import { SEO } from '../components/SEO/SEO';
import { useTheme } from '../context/ThemeContext';

export function ScoreboardPage() {
  const { currentTheme } = useTheme();

  if (!currentTheme) {
    // Redirect to landing page if no valid theme
    window.location.href = '/';
    return null;
  }
  const [isLoading, setIsLoading] = useState(true);
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [eloRatings, setEloRatings] = useState<EloRatings>({});
  const [name, setName] = useState<string>('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get('data');
    if (dataParam) {
      try {
        const decodedData = atob(dataParam);
        const decompressedData = decompressFromEncodedURIComponent(decodedData);
        const minifiedParsedData: UrlData = JSON.parse(decompressedData);

        const deMinifiedRatings: EloRatings = {};

        Object.entries(minifiedParsedData.ratings).forEach(([key, value]) => {
          if (typeof value === 'string' && value !== null) {
            let elo: number;

            if (typeof value === 'string') {
              elo = parseFloat(value as string);
            } else if (typeof value === 'number') {
              elo = value;
            } else {
              return;
            }

            deMinifiedRatings[key] = { elo, numberOfVotes: 0 };
          }
        });

        const ratings: EloRatings = deMinifiedRatings as EloRatings;

        setName(minifiedParsedData.name);
        setEloRatings(ratings);
      } catch (error) {
        console.error('Error parsing data from URL:', error);
      }
    } else {
      window.location.href = '/';
    }

    setAllSongs(currentTheme.songs);
    setIsLoading(false);
  }, [currentTheme]);

  if (isLoading) {
    return (
      <div class="loading-message">{`Initializing ${currentTheme.name.split(' ')[0]} Scoreboard...`}</div>
    );
  }

  return (
    <Fragment>
      <SEO
        title={`${currentTheme.name} ${currentTheme.year} Scoreboard${name ? ` | ${name}'s Rankings` : ''} | Song Rating Arena`}
        description={`View the complete song rankings for ${currentTheme.name} ${currentTheme.year}${name ? ` from ${name}` : ''}. See how songs are ranked using our ELO rating system and discover the top-rated performances.`}
        keywords={`${currentTheme.name}, ${currentTheme.name} ${currentTheme.year}, scoreboard, rankings, leaderboard, song ratings, ELO system, music competition results`}
        canonicalUrl={`https://songrating.linusromland.com/${currentTheme.id}/scoreboard`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: `${currentTheme.name} ${currentTheme.year} Scoreboard`,
          description: `Song rankings and scoreboard for ${currentTheme.name} ${currentTheme.year}`,
          url: `https://songrating.linusromland.com/${currentTheme.id}/scoreboard`,
          about: {
            '@type': 'MusicEvent',
            name: `${currentTheme.name} ${currentTheme.year}`,
            description: currentTheme.description,
          },
        }}
      />
      <div class="container">
        <header class="app-header">
          <div class="header-content">
            <div class="title-section">
              <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                <h1 style="margin: 0;">{currentTheme.name}</h1>
                <YearBadge year={currentTheme.year} />
              </div>
              <p>{currentTheme.description}</p>
            </div>
            <div class="navigation-buttons">
              <a href="/" class="back-button">
                ← Competitions
              </a>
              <a href={`/${currentTheme.id}`} class="home-button">
                Rate Songs
              </a>
            </div>
          </div>
        </header>

        <Scoreboard title={name} songs={allSongs} eloRatings={eloRatings} linkToOwnBoard />
      </div>
    </Fragment>
  );
}
