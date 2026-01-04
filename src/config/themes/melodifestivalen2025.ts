import type { ThemeConfig } from '../index';

const melodifestivalen2025Songs = [
    {
        "id": "scarlet",
        "artist": "SCARLET",
        song: "Sweet N' Psycho",
        "youtubeUrl": "https://youtu.be/5dGLh8CCRtE"
    },
     {
        "id": "vilhelmBuchaus",
        "artist": "Vilhelm Buchaus",
        song: "I’m Yours",
        "youtubeUrl": "https://youtu.be/OAhZrpDhliM"
    },
     {
        "id": "victoriaSilvstedt",
        "artist": "Victoria Silvstedt",
        song: "Love It!",
        "youtubeUrl": "https://youtu.be/Q_b1t8YweZI"
    }
    // ADD MORE...
];

export const melodifestivalen2025Config: ThemeConfig = {
    id: 'melodifestivalen2025',
    name: 'Melodifestivalen',
    description: 'Which song will win your heart? Compare songs from Melodifestivalen 2025 and build your ranking!',
    year: '2025',
    style: {
        primaryBg: '#0f1419',
        secondaryBg: '#1a2332',
        cardBg: '#2d3748',
        textColor: '#e2e8f0',
        headerTextColor: '#ffffff',
        accentColor1: '#3182ce',
        accentColor2: '#63b3ed',
        goldAccent: '#ecc94b'
    },
    songs: melodifestivalen2025Songs
};