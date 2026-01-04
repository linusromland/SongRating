import { useState, useMemo, useCallback } from 'preact/hooks';
import type { Song, EloRatings } from '../../types';
import styles from './Scoreboard.module.css';
import { INITIAL_ELO, SCOREBOARD_INITIAL_LIMIT } from '../../data/songData';
import { useTheme } from '../../context/ThemeContext';

interface ScoreboardProps {
    title?: string
    songs: Song[];
    eloRatings: EloRatings;
    linkToOwnBoard?: boolean
    shareScoreboard?: () => void;
    clearScoreboard?: () => void;
}

export function Scoreboard({ title = "Your Personal Scoreboard", songs, eloRatings, linkToOwnBoard, clearScoreboard, shareScoreboard }: ScoreboardProps) {
    const [showAll, setShowAll] = useState(false);
    const { currentTheme } = useTheme();

    const sortedSongsFull = useMemo(() => {

        return Object.entries(eloRatings)
            .map(([songId, { elo }]) => {
                const song = songs.find(s => s.id === songId);
                if (!song || elo === INITIAL_ELO) return null;
                return {
                    ...song,
                    elo: elo,
                };
            }
            ).filter(Boolean).sort((a, b) => (b?.elo ?? INITIAL_ELO) - (a?.elo ?? INITIAL_ELO)) as Song[]
    }, [songs, eloRatings]);

    const songsToDisplay = useMemo(() => {
        if (showAll || sortedSongsFull.length <= SCOREBOARD_INITIAL_LIMIT) {
            return sortedSongsFull;
        }
        return sortedSongsFull.slice(0, SCOREBOARD_INITIAL_LIMIT);
    }, [sortedSongsFull, showAll]);

    const toggleShowAll = useCallback(() => {
        setShowAll(prev => !prev);
    }, []);

    if (songs.length === 0 && Object.keys(eloRatings).length === 0) {
        return <div class={styles.infoMessage}>The scoreboard is empty. Start voting!</div>;
    }
    if (songsToDisplay.length === 0) {
        return <div class={styles.infoMessage}>No songs to display in scoreboard yet.</div>;
    }

    const percentageRated = useMemo(() => {
        const totalSongs = songs.length;
        const ratedSongs = sortedSongsFull.length;
        return Math.round((ratedSongs / totalSongs) * 100);
    }, [sortedSongsFull, songs]);

    const showHeader = useMemo(() => {
        return songs.some(song => song.header || song.icon);
    }, [songs]);

    return (
        <section class={styles.scoreboard}>
            <div class={styles.scoreboardHeader}>
                <div class={styles.headerTitle}>
                    <h2>{title}</h2>
                    <p class={styles.headerSubtitle}>
                        {sortedSongsFull.length} of {songs.length} songs rated ({percentageRated}%)
                    </p>
                </div>
                <div class={styles.headerButtons}>

                    {linkToOwnBoard && currentTheme && (
                        <button class={styles.button} onClick={() => window.location.href = `/${currentTheme.id}`}>
                            Your Scoreboard
                        </button>
                    )}

                    {shareScoreboard && (
                        <button class={styles.button} onClick={shareScoreboard}>
                            Share Scoreboard
                        </button>
                    )}
                    {clearScoreboard && (
                        <button class={styles.button} onClick={clearScoreboard}>
                            Reset Scoreboard
                        </button>
                    )}
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        {showHeader && <th>Header</th>}
                        <th>Song</th>
                        <th>Artist</th>
                        <th>ELO Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {songsToDisplay.map((song, index) => (
                        <tr key={song.id} onClick={() => window.open(song.youtubeUrl, '_blank')}>
                            <td><span class={styles.rank}>{index + 1}</span></td>
                            {
                                (showHeader) && (
                            
                            <td>
                                <div class={styles.headerDetails}>
                                    <span class={styles.icon}>{song.icon}</span>
                                    <span class={styles.headerName}>{song.header}</span>
                                </div>
                            </td>
                                )}
                            <td>{song.song}</td>
                            <td>{song.artist}</td>
                            <td>{Math.round(song.elo ?? INITIAL_ELO)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {sortedSongsFull.length > SCOREBOARD_INITIAL_LIMIT && (
                <button class={styles.toggleScoreboardButton} onClick={toggleShowAll}>
                    {showAll ? `Show Top ${SCOREBOARD_INITIAL_LIMIT}` : `Show All ${sortedSongsFull.length} Results`}
                </button>
            )}
        </section>
    );
}