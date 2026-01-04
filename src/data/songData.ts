import type { Song } from '../types';
import { getCurrentTheme } from '../config';

export const K_FACTOR = 32;
export const INITIAL_ELO = 1500;
export const SCOREBOARD_INITIAL_LIMIT = 5;

export const getInitialSongsData = (): Song[] => {
    return getCurrentTheme().songs;
};