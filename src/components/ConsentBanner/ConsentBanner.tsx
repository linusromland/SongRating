import { useEffect, useState } from 'preact/hooks';
import styles from './ConsentBanner.module.css';

interface ConsentBannerProps {
  onConsentChange: (consent: boolean) => void;
}

const CONSENT_STORAGE_KEY = 'eurovision-data-consent';
const CONSENT_SHOWN_KEY = 'eurovision-consent-shown';

type ConsentChoice = 'accepted' | 'declined' | null;

function getStoredConsent(): ConsentChoice {
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored === 'true') return 'accepted';
    if (stored === 'false') return 'declined';
    return null;
  } catch {
    return null;
  }
}

function storeConsent(consent: boolean): void {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, consent.toString());
    localStorage.setItem(CONSENT_SHOWN_KEY, 'true');
  } catch (error) {
    console.warn('Failed to store consent preference:', error);
  }
}

export function ConsentBanner({ onConsentChange }: ConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  useEffect(() => {
    const existingConsent = getStoredConsent();
    
    if (existingConsent === null) {
      // No consent given yet, show banner
      setIsVisible(true);
    } else {
      // Consent already given, notify parent
      onConsentChange(existingConsent === 'accepted');
    }
  }, [onConsentChange]);
  
  const handleAccept = () => {
    storeConsent(true);
    onConsentChange(true);
    setIsVisible(false);
  };
  
  const handleDecline = () => {
    storeConsent(false);
    onConsentChange(false);
    setIsVisible(false);
  };
  
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };
  
  if (!isVisible) {
    return null;
  }
  
  return (
    <div className={styles.consentOverlay}>
      <div className={styles.consentModal}>
        <div className={styles.consentHeader}>
          <h2 className={styles.consentTitle}>🎵 Welcome to Song Rating Arena</h2>
          <p className={styles.consentSubtitle}>Help us improve your experience</p>
        </div>
        
        <div className={styles.consentBody}>
          <div className={styles.consentIcon}>📊</div>
          <p className={styles.consentText}>
            We'd love to collect anonymous data about how you use this app to better understand
            user preferences and improve the experience. This includes your votes, competition participation,
            and basic usage statistics.
          </p>
          
          {showDetails && (
            <div className={styles.consentDetails}>
              <h3>What we collect:</h3>
              <ul>
                <li>🗳️ Voting patterns (which songs you compare and prefer)</li>
                <li>🎪 Competition themes you visit</li>
                <li>📤 Scoreboard sharing activity</li>
                <li>⏱️ Session duration and usage patterns</li>
                <li>🌍 General location (country level only)</li>
              </ul>
              <div className={styles.privacyNote}>
                <strong>Privacy first:</strong> All data is completely anonymous and cannot be traced back to you personally. 
                You can change your mind at any time by clearing your browser data.
              </div>
            </div>
          )}
        </div>
        
        <div className={styles.consentFooter}>
          <button 
            className={styles.learnMoreButton}
            onClick={toggleDetails}
            type="button"
          >
            {showDetails ? '▲ Show Less' : '▼ Learn More'}
          </button>
          
          <div className={styles.consentActions}>
            <button 
              className={`${styles.consentButton} ${styles.declineButton}`}
              onClick={handleDecline}
              type="button"
            >
              No Thanks
            </button>
            <button 
              className={`${styles.consentButton} ${styles.acceptButton}`}
              onClick={handleAccept}
              type="button"
            >
              ✨ Accept & Help Improve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility functions for other components to use
export function hasConsentBeenGiven(): boolean {
  return getStoredConsent() !== null;
}

export function hasUserConsented(): boolean {
  return getStoredConsent() === 'accepted';
}

export function getUserConsentChoice(): ConsentChoice {
  return getStoredConsent();
}