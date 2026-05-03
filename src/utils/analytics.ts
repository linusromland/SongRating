import { hasUserConsented } from '../components/ConsentBanner/ConsentBanner';

// Types matching backend API
interface SessionData {
  sessionId?: string;
  consentGiven: boolean;
  theme?: string;
}

interface VoteData {
  sessionId: string;
  theme: string;
  winnerId: string;
  loserId: string;
  winnerElo?: number;
  loserElo?: number;
  winnerPreviousElo?: number;
  loserPreviousElo?: number;
  timestamp?: Date;
}

interface EventData {
  sessionId: string;
  type: 'theme_visit' | 'scoreboard_share' | 'page_view' | 'session_start';
  theme?: string;
  page?: string;
  data?: Record<string, any>;
  duration?: number;
  timestamp?: Date;
}

interface BatchData {
  sessionId: string;
  events: (VoteData | EventData)[];
}

// Local storage keys
const SESSION_ID_KEY = 'eurovision-session-id';
const PENDING_EVENTS_KEY = 'eurovision-pending-events';
const LAST_SYNC_KEY = 'eurovision-last-sync';

class AnalyticsService {
  private sessionId: string | null = null;
  private pendingEvents: (VoteData | EventData)[] = [];
  private isOnline: boolean = navigator.onLine;
  private syncInProgress: boolean = false;
  private apiBaseUrl: string;
  
  constructor() {
    // Set API base URL based on environment
    this.apiBaseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000/api' 
      : '/api';
    
    // Initialize session ID
    this.initSession();
    
    // Load pending events from localStorage
    this.loadPendingEvents();
    
    // Set up online/offline event listeners
    this.setupNetworkListeners();
    
    // Set up periodic sync
    this.setupPeriodicSync();
  }
  
  private initSession(): void {
    try {
      this.sessionId = localStorage.getItem(SESSION_ID_KEY);
    } catch (error) {
      console.warn('Failed to load session ID from localStorage:', error);
    }
  }
  
  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncPendingEvents();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
    
    // Sync when page becomes visible (user returns to tab)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isOnline && hasUserConsented()) {
        this.syncPendingEvents();
      }
    });
  }
  
  private setupPeriodicSync(): void {
    // Sync every 30 seconds if online and has consent
    setInterval(() => {
      if (this.isOnline && hasUserConsented() && this.pendingEvents.length > 0) {
        this.syncPendingEvents();
      }
    }, 30000);
  }
  
  private loadPendingEvents(): void {
    try {
      const stored = localStorage.getItem(PENDING_EVENTS_KEY);
      if (stored) {
        this.pendingEvents = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load pending events:', error);
      this.pendingEvents = [];
    }
  }
  
  private savePendingEvents(): void {
    try {
      localStorage.setItem(PENDING_EVENTS_KEY, JSON.stringify(this.pendingEvents));
    } catch (error) {
      console.warn('Failed to save pending events:', error);
    }
  }
  
  private async makeRequest(endpoint: string, data: any): Promise<any> {
    const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  // Initialize or update session with consent information
  async initializeSession(consentGiven: boolean, theme?: string): Promise<void> {
    try {
      const sessionData: SessionData = {
        sessionId: this.sessionId || undefined,
        consentGiven,
        theme
      };
      
      const response = await this.makeRequest('/analytics/session', sessionData);
      
      if (response.sessionId) {
        this.sessionId = response.sessionId;
        if (this.sessionId) {
          localStorage.setItem(SESSION_ID_KEY, this.sessionId);
        }
      }
      
      // If consent is given and we have pending events, sync them
      if (consentGiven && this.pendingEvents.length > 0) {
        await this.syncPendingEvents();
      }
    } catch (error) {
      console.warn('Failed to initialize session:', error);
    }
  }
  
  // Track a vote event
  async trackVote(data: Omit<VoteData, 'sessionId' | 'timestamp'>): Promise<void> {
    if (!this.sessionId) {
      console.warn('No session ID available for tracking vote');
      return;
    }
    
    const voteEvent: VoteData = {
      ...data,
      sessionId: this.sessionId,
      timestamp: new Date()
    };
    
    if (hasUserConsented() && this.isOnline) {
      try {
        await this.makeRequest('/analytics/vote', voteEvent);
        return;
      } catch (error) {
        console.warn('Failed to send vote immediately, queuing:', error);
      }
    }
    
    // Add to pending events if offline or no consent
    this.pendingEvents.push(voteEvent);
    this.savePendingEvents();
  }
  
  // Track a general event
  async trackEvent(data: Omit<EventData, 'sessionId' | 'timestamp'>): Promise<void> {
    if (!this.sessionId) {
      console.warn('No session ID available for tracking event');
      return;
    }
    
    const event: EventData = {
      ...data,
      sessionId: this.sessionId,
      timestamp: new Date()
    };
    
    if (hasUserConsented() && this.isOnline) {
      try {
        await this.makeRequest('/analytics/event', event);
        return;
      } catch (error) {
        console.warn('Failed to send event immediately, queuing:', error);
      }
    }
    
    // Add to pending events if offline or no consent
    this.pendingEvents.push(event);
    this.savePendingEvents();
  }
  
  // Sync pending events to backend
  private async syncPendingEvents(): Promise<void> {
    if (!hasUserConsented() || !this.sessionId || this.pendingEvents.length === 0 || this.syncInProgress) {
      return;
    }
    
    this.syncInProgress = true;
    
    try {
      const batchData: BatchData = {
        sessionId: this.sessionId,
        events: this.pendingEvents.slice() // Copy array
      };
      
      await this.makeRequest('/analytics/batch', batchData);
      
      // Clear pending events on successful sync
      this.pendingEvents = [];
      this.savePendingEvents();
      
      // Update last sync time
      localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
      
    } catch (error) {
      console.warn('Failed to sync pending events:', error);
    } finally {
      this.syncInProgress = false;
    }
  }
  
  // Get current session info
  getSessionInfo() {
    return {
      sessionId: this.sessionId,
      pendingEventsCount: this.pendingEvents.length,
      isOnline: this.isOnline,
      lastSync: localStorage.getItem(LAST_SYNC_KEY)
    };
  }
  
  // Clear all data (for privacy)
  clearAllData(): void {
    this.sessionId = null;
    this.pendingEvents = [];
    
    try {
      localStorage.removeItem(SESSION_ID_KEY);
      localStorage.removeItem(PENDING_EVENTS_KEY);
      localStorage.removeItem(LAST_SYNC_KEY);
    } catch (error) {
      console.warn('Failed to clear analytics data:', error);
    }
  }
}

// Create singleton instance
export const analytics = new AnalyticsService();

// Convenience functions
export const trackVote = analytics.trackVote.bind(analytics);
export const trackEvent = analytics.trackEvent.bind(analytics);
export const initializeSession = analytics.initializeSession.bind(analytics);
export const getSessionInfo = analytics.getSessionInfo.bind(analytics);