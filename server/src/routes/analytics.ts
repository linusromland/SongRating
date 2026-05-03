import express, { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';
import { Session, Vote, Event } from '../models';
import { generateSessionId } from '../utils/sessionId';

const router = express.Router();

// Rate limiting for analytics endpoints
const analyticsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per minute
  message: 'Too many analytics requests, please slow down',
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(analyticsLimiter);

// Types for request bodies
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
}

interface EventData {
  sessionId: string;
  type: 'theme_visit' | 'scoreboard_share' | 'page_view' | 'session_start';
  theme?: string;
  page?: string;
  data?: Record<string, any>;
  duration?: number;
}

interface BatchData {
  sessionId: string;
  events: (VoteData | EventData)[];
}

// Helper function to extract device info from user agent
function parseUserAgent(userAgent: string) {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();
  
  let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
  if (result.device.type === 'mobile') deviceType = 'mobile';
  else if (result.device.type === 'tablet') deviceType = 'tablet';
  
  return {
    type: deviceType,
    browser: `${result.browser.name} ${result.browser.version}`,
    os: `${result.os.name} ${result.os.version}`
  };
}

// Helper function to get location from IP
function getLocationFromIP(ip: string) {
  const geo = geoip.lookup(ip);
  return geo ? {
    country: geo.country,
    city: geo.city
  } : {};
}

// POST /api/analytics/session - Create or update session
router.post('/session', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId, consentGiven, theme }: SessionData = req.body;
    
    if (typeof consentGiven !== 'boolean') {
      return res.status(400).json({ error: 'consentGiven is required and must be boolean' });
    }
    
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';
    const device = parseUserAgent(userAgent);
    const location = getLocationFromIP(ip);
    
    let session;
    
    if (sessionId) {
      // Update existing session
      session = await Session.findOneAndUpdate(
        { sessionId },
        {
          $set: {
            consentGiven,
            lastActivity: new Date(),
            ...(theme && { currentTheme: theme })
          },
          ...(theme && { $addToSet: { themesVisited: theme } })
        },
        { new: true, upsert: false }
      );
      
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }
    } else {
      // Create new session
      const newSessionId = generateSessionId();
      session = new Session({
        sessionId: newSessionId,
        ipAddress: ip,
        userAgent,
        device,
        consentGiven,
        ...location,
        ...(theme && { 
          currentTheme: theme, 
          themesVisited: [theme] 
        })
      });
      await session.save();
    }
    
    res.json({ 
      sessionId: session.sessionId,
      consentGiven: session.consentGiven
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/analytics/vote - Track vote events
router.post('/vote', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const voteData: VoteData = req.body;
    
    const { sessionId, theme, winnerId, loserId } = voteData;
    
    if (!sessionId || !theme || !winnerId || !loserId) {
      return res.status(400).json({ 
        error: 'sessionId, theme, winnerId, and loserId are required' 
      });
    }
    
    // Check if session exists and has consent
    const session = await Session.findOne({ sessionId });
    if (!session || !session.consentGiven) {
      return res.status(403).json({ error: 'No consent given for data collection' });
    }
    
    // Create vote record
    const vote = new Vote(voteData);
    await vote.save();
    
    // Update session vote count
    await Session.updateOne(
      { sessionId },
      { 
        $inc: { totalVotes: 1 },
        $set: { lastActivity: new Date() }
      }
    );
    
    res.json({ success: true, voteId: vote._id });
  } catch (error) {
    next(error);
  }
});

// POST /api/analytics/event - Track general events
router.post('/event', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const eventData: EventData = req.body;
    
    const { sessionId, type } = eventData;
    
    if (!sessionId || !type) {
      return res.status(400).json({ error: 'sessionId and type are required' });
    }
    
    const validTypes = ['theme_visit', 'scoreboard_share', 'page_view', 'session_start'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        error: `Invalid event type. Must be one of: ${validTypes.join(', ')}` 
      });
    }
    
    // Check if session exists and has consent
    const session = await Session.findOne({ sessionId });
    if (!session || !session.consentGiven) {
      return res.status(403).json({ error: 'No consent given for data collection' });
    }
    
    // Create event record
    const event = new Event(eventData);
    await event.save();
    
    // Update session last activity and time spent
    const updateData: any = { lastActivity: new Date() };
    if (eventData.duration) {
      updateData.$inc = { totalTimeSpent: eventData.duration };
    }
    
    await Session.updateOne({ sessionId }, updateData);
    
    res.json({ success: true, eventId: event._id });
  } catch (error) {
    next(error);
  }
});

// POST /api/analytics/batch - Batch multiple events (for offline sync)
router.post('/batch', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId, events }: BatchData = req.body;
    
    if (!sessionId || !Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: 'sessionId and events array are required' });
    }
    
    if (events.length > 100) {
      return res.status(400).json({ error: 'Maximum 100 events per batch' });
    }
    
    // Check if session exists and has consent
    const session = await Session.findOne({ sessionId });
    if (!session || !session.consentGiven) {
      return res.status(403).json({ error: 'No consent given for data collection' });
    }
    
    const results = [];
    let totalVotes = 0;
    let totalTimeSpent = 0;
    
    for (const eventData of events) {
      try {
        if ('winnerId' in eventData && 'loserId' in eventData) {
          // It's a vote event
          const vote = new Vote({ ...eventData, sessionId });
          await vote.save();
          totalVotes++;
          results.push({ type: 'vote', id: vote._id, success: true });
        } else {
          // It's a general event
          const event = new Event({ ...eventData, sessionId });
          await event.save();
          if (event.duration) {
            totalTimeSpent += event.duration;
          }
          results.push({ type: 'event', id: event._id, success: true });
        }
      } catch (eventError) {
        results.push({ 
          success: false, 
          error: eventError instanceof Error ? eventError.message : 'Unknown error' 
        });
      }
    }
    
    // Update session stats
    const updateData: any = { lastActivity: new Date() };
    if (totalVotes > 0 || totalTimeSpent > 0) {
      updateData.$inc = {};
      if (totalVotes > 0) updateData.$inc.totalVotes = totalVotes;
      if (totalTimeSpent > 0) updateData.$inc.totalTimeSpent = totalTimeSpent;
    }
    
    await Session.updateOne({ sessionId }, updateData);
    
    res.json({ 
      success: true, 
      processed: results.length,
      results
    });
  } catch (error) {
    next(error);
  }
});

export { router as analyticsRouter };