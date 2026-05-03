import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  country?: string;
  city?: string;
  device?: {
    type: 'mobile' | 'tablet' | 'desktop';
    browser: string;
    os: string;
  };
  consentGiven: boolean;
  firstVisit: Date;
  lastActivity: Date;
  themesVisited: string[];
  currentTheme?: string;
  totalVotes: number;
  totalTimeSpent: number; // milliseconds
}

const sessionSchema = new Schema<ISession>({
  sessionId: { type: String, required: true, unique: true, index: true },
  ipAddress: { type: String, required: true },
  userAgent: { type: String, required: true },
  country: { type: String },
  city: { type: String },
  device: {
    type: { type: String, enum: ['mobile', 'tablet', 'desktop'] },
    browser: String,
    os: String
  },
  consentGiven: { type: Boolean, required: true, default: false },
  firstVisit: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now },
  themesVisited: [{ type: String }],
  currentTheme: { type: String },
  totalVotes: { type: Number, default: 0 },
  totalTimeSpent: { type: Number, default: 0 }
}, {
  timestamps: true,
  collection: 'sessions'
});

// Indexes for better query performance
sessionSchema.index({ firstVisit: 1 });
sessionSchema.index({ consentGiven: 1 });
sessionSchema.index({ country: 1 });
sessionSchema.index({ 'device.type': 1 });

export const Session = mongoose.model<ISession>('Session', sessionSchema);