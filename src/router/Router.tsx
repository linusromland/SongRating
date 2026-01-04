import { useState, useEffect } from 'preact/hooks';
import { LandingPage } from '../pages/LandingPage';
import { CompetitionPage } from '../pages/CompetitionPage';
import { ScoreboardPage } from '../pages/ScoreboardPage';
import { getThemeById } from '../config';

export function Router() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', onLocationChange);

    return () => {
      window.removeEventListener('popstate', onLocationChange);
    };
  }, []);

  // Parse the current path
  const segments = currentPath.split('/').filter(Boolean);

  if (segments.length === 0) {
    // Landing page (/)
    return <LandingPage />;
  }

  if (segments.length === 1) {
    // Theme home page (/:themeId)
    const themeId = segments[0];
    const theme = getThemeById(themeId);

    if (theme) {
      return <CompetitionPage />;
    }
  }

  if (segments.length === 2 && segments[1] === 'scoreboard') {
    // Scoreboard page (/:themeId/scoreboard)
    const themeId = segments[0];
    const theme = getThemeById(themeId);

    if (theme) {
      return <ScoreboardPage />;
    }
  }

  // 404 page
  return (
    <div class="container" style={{ textAlign: 'center', paddingTop: '50px' }}>
      <header class="app-header">
        <h1>404 - Page Not Found</h1>
      </header>
      <p>Sorry, the page you are looking for does not exist.</p>
      <a href="/" style={{ color: 'var(--accent-color-2)' }}>
        Go to Homepage
      </a>
    </div>
  );
}
