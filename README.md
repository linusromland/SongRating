# Song Rating App

Create your own personal song ranking for Eurovision, Melodifestivalen, or any music competition! This application lets you compare songs head-to-head and builds a scoreboard based on your votes using an ELO rating system.

## How It Works

Compare two songs, vote for your favorite, and watch as their ELO ratings adjust. Over time, this builds a personalized scoreboard reflecting your musical tastes.

## Features

* **Multi-Theme Support:** Switch between Eurovision, Melodifestivalen, and other music competitions
* **Compare & Vote:** Watch song previews and vote for your favorites in matchups
* **ELO-Powered Ranking:** Songs are ranked dynamically based on your preferences
* **Persistent Scoreboard:** Your personal rankings are saved in your browser (per theme)
* **Share Your Rankings:** Generate shareable links to show others your personal scoreboard

## Available Themes

* **Eurovision Song Contest 2025** - Compare the Eurovision 2025 entries
* **Melodifestivalen 2025** - Compare the Swedish Eurovision selection songs

## Adding New Themes

To add a new theme:

1. Create a new theme configuration file in `src/config/themes/`
2. Create the corresponding song data JSON file 
3. Add the theme to the `appConfig.themes` object in `src/config/index.ts`

### Theme Configuration Example

```typescript
export const myThemeConfig: ThemeConfig = {
    id: 'mytheme',
    name: 'My Music Competition',
    title: 'My Competition Song Rating',
    description: 'Compare songs from My Competition and build your ranking!',
    year: '2025',
    scoreboardTitle: 'My Competition 2025 Personal Scoreboard',
    loadingMessage: 'Initializing My Competition Scoreboard...',
    shareDialogPlaceholder: 'E.g., My Top 10',
    localStorageKey: 'myCompetitionEloRatings',
    songs: myCompetitionSongs
};
```

## Running Locally

### Prerequisites

* Node.js
* npm (or yarn/pnpm)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/linusromland/EurovisionSongRating.git
    cd EurovisionSongRating
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will typically be available at `http://localhost:5173`.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
