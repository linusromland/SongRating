import { Fragment } from 'preact';
import { Router } from './router/Router';
import { ThemeProvider } from './context/ThemeContext';
import { ConsentBanner } from './components/ConsentBanner/ConsentBanner';
import { initializeSession } from './utils/analytics';

export function App() {  
  const handleConsentChange = (consent: boolean) => {
    // Initialize analytics session with consent choice
    initializeSession(consent);
  };
  
  return (
    <ThemeProvider>
      <Fragment>
        <Router />
        <ConsentBanner onConsentChange={handleConsentChange} />
      </Fragment>
    </ThemeProvider>
  );
}
