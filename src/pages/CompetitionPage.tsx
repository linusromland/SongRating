import { Fragment } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import type { Song, EloRatings } from '../types';
import { K_FACTOR, INITIAL_ELO } from '../data/songData';
import { calculateExpectedScore } from '../utils/elo';
import { BattleZone } from '../components/BattleZone/BattleZone';
import { Scoreboard } from '../components/Scoreboard/Scoreboard';
import { ConfirmAction } from '../components/ConfirmAction/ConfirmAction';
import { ShareScoreboardDialog } from '../components/ShareScoreboardDialog/ShareScoreboardDialog';
import { YearBadge } from '../components/YearBadge/YearBadge';
import { SEO } from '../components/SEO/SEO';
import { useTheme } from '../context/ThemeContext';
import confirmActionStyles from '../components/ConfirmAction/ConfirmAction.module.css';

export function CompetitionPage() {
  const { currentTheme } = useTheme();

  if (!currentTheme) {
    // Redirect to landing page if no valid theme
    window.location.href = '/';
    return null;
  }
  const [eloRatings, setEloRatings] = useState<EloRatings>({});
  const [currentPair, setCurrentPair] = useState<[Song | null, Song | null]>([null, null]);
  const [isLoading, setIsLoading] = useState(true);
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  useEffect(() => {
    if (!currentTheme) return;

    const themeSongs = currentTheme.songs;
    setAllSongs(themeSongs);
    const loadedRatingsRaw = localStorage.getItem(`${currentTheme.id}EloRatings`);
    const loadedRatings = loadedRatingsRaw ? JSON.parse(loadedRatingsRaw) : {};
    const initialRatings: EloRatings = {};
    themeSongs.forEach((song) => {
      initialRatings[song.id] = loadedRatings[song.id] || {
        elo: INITIAL_ELO,
        numberOfVotes: 0,
      };
    });
    setEloRatings(initialRatings);
    setIsLoading(false);
  }, [currentTheme]);

  const selectNewPair = useCallback(() => {
    if (allSongs.length < 2) {
      setCurrentPair([null, null]);
      return;
    }

    const filteredSongs = allSongs
      .sort((a, b) => {
        const aVotes = eloRatings[a.id]?.numberOfVotes || 0;
        const bVotes = eloRatings[b.id]?.numberOfVotes || 0;
        return bVotes - aVotes;
      })
      .slice(Math.floor(allSongs.length / 2));

    let songAIndex = -1,
      songBIndex = -1;
    let attempts = 0;
    const maxAttempts = filteredSongs.length * (filteredSongs.length - 1);
    const [prevSongA, prevSongB] = currentPair;

    do {
      songAIndex = Math.floor(Math.random() * filteredSongs.length);
      songBIndex = Math.floor(Math.random() * filteredSongs.length);
      attempts++;
      if (filteredSongs.length > 2 && prevSongA && prevSongB && attempts < maxAttempts / 2) {
        const currentSelectionIdA = filteredSongs[songAIndex].id;
        const currentSelectionIdB = filteredSongs[songBIndex].id;
        if (
          (currentSelectionIdA === prevSongA.id && currentSelectionIdB === prevSongB.id) ||
          (currentSelectionIdA === prevSongB.id && currentSelectionIdB === prevSongA.id)
        ) {
          continue;
        }
      }
    } while (songAIndex === songBIndex && attempts < maxAttempts);

    if (songAIndex === songBIndex && filteredSongs.length > 1) {
      songBIndex = (songAIndex + 1) % filteredSongs.length;
    } else if (songAIndex === songBIndex && filteredSongs.length === 1) {
      setCurrentPair([filteredSongs[0], null]);
      return;
    }
    setCurrentPair([filteredSongs[songAIndex], filteredSongs[songBIndex]]);
  }, [allSongs, currentPair]);

  useEffect(() => {
    if (!isLoading && allSongs.length > 0 && currentPair[0] === null && currentPair[1] === null) {
      selectNewPair();
    }
  }, [isLoading, allSongs, currentPair, selectNewPair]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(`${currentTheme.id}EloRatings`, JSON.stringify(eloRatings));
    }
  }, [eloRatings, isLoading, currentTheme]);

  const handleVote = useCallback(
    (winnerId: string, loserId: string) => {
      setEloRatings((prevRatings) => {
        const winnerRating = prevRatings[winnerId]?.elo || INITIAL_ELO;
        const loserRating = prevRatings[loserId]?.elo || INITIAL_ELO;
        const expectedWinner = calculateExpectedScore(winnerRating, loserRating);
        const newWinnerRating = winnerRating + K_FACTOR * (1 - expectedWinner);
        const newLoserRating = loserRating + K_FACTOR * (0 - (1 - expectedWinner));
        return {
          ...prevRatings,
          [winnerId]: {
            elo: newWinnerRating,
            numberOfVotes: (prevRatings[winnerId]?.numberOfVotes || 0) + 1,
          },
          [loserId]: {
            elo: newLoserRating,
            numberOfVotes: (prevRatings[loserId]?.numberOfVotes || 0) + 1,
          },
        };
      });
      setCurrentPair([null, null]);
    },
    [setCurrentPair]
  );

  const openResetDialog = () => setIsResetConfirmOpen(true);
  const handleCancelReset = () => setIsResetConfirmOpen(false);

  const openShareDialog = () => setIsShareDialogOpen(true);
  const closeShareDialog = () => setIsShareDialogOpen(false);

  const handleConfirmReset = useCallback(async () => {
    setIsResetting(true);

    const resetRatings: EloRatings = {};
    allSongs.forEach((song) => {
      resetRatings[song.id] = {
        elo: INITIAL_ELO,
        numberOfVotes: 0,
      };
    });
    setEloRatings(resetRatings);
    localStorage.removeItem(`${currentTheme.id}EloRatings`);

    setIsResetting(false);
    setIsResetConfirmOpen(false);
  }, [allSongs, currentTheme]);

  if (isLoading) {
    return (
      <div class="loading-message">{`Initializing ${currentTheme.name.split(' ')[0]} Scoreboard...`}</div>
    );
  }
  if (allSongs.length < 2 && !isLoading) {
    return (
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
            <a href="/" class="back-button">
              ← Back to Competitions
            </a>
          </div>
        </header>
        <div class="error-message">
          Not enough songs. Add at least two songs to the theme configuration.
        </div>
      </div>
    );
  }

  const [songA, songB] = currentPair;

  return (
    <Fragment>
      <SEO
        title={`${currentTheme.name} ${currentTheme.year} | Song Battle Arena`}
        description={`Battle and rank songs from ${currentTheme.name} ${currentTheme.year} using our ELO rating system. ${currentTheme.description} Vote on your favorites and build your personal ranking!`}
        keywords={`${currentTheme.name}, ${currentTheme.name} ${currentTheme.year}, song battle, ELO rating, music competition, ranking, vote, ${currentTheme.songs
          .slice(0, 5)
          .map((s) => (s?.icon ?? "") + s.artist + " - " + s.song)
          .join(', ')}`}
        canonicalUrl={`https://songrating.linusromland.com/${currentTheme.id}`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: `${currentTheme.name} ${currentTheme.year} Song Battle`,
          description: `Battle and rank songs from ${currentTheme.name} ${currentTheme.year}`,
          url: `https://songrating.linusromland.com/${currentTheme.id}`,
          applicationCategory: 'Entertainment',
          operatingSystem: 'Web',
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
            <a href="/" class="back-button">
              ← Back to Competitions
            </a>
          </div>
        </header>

        {songA && songB ? (
          <BattleZone songA={songA} songB={songB} onVote={handleVote} />
        ) : (
          allSongs.length >= 2 && (
            <div class="loading-message">{`Initializing ${currentTheme.name.split(' ')[0]} Scoreboard...`}</div>
          )
        )}

        <Scoreboard
          songs={allSongs}
          eloRatings={eloRatings}
          shareScoreboard={openShareDialog}
          clearScoreboard={openResetDialog}
        />
      </div>

      <ConfirmAction
        isOpen={isResetConfirmOpen}
        title="Reset Scoreboard?"
        message="Are you sure you want to reset all song ratings and scores? This action cannot be undone."
        onConfirm={handleConfirmReset}
        onCancel={handleCancelReset}
        confirmText="Yes, Reset"
        cancelText="No, Keep"
        confirmButtonClass={confirmActionStyles.confirmButtonDestructive}
        isConfirming={isResetting}
      />

      <ShareScoreboardDialog
        isOpen={isShareDialogOpen}
        onClose={closeShareDialog}
        eloRatings={eloRatings}
      />
    </Fragment>
  );
}
