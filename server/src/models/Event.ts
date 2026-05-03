import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  sessionId: string;
  type: 'theme_visit' | 'scoreboard_share' | 'page_view' | 'session_start';
  theme?: string;
  page?: string;
  data?: Record<string, any>;
  timestamp: Date;
  duration?: number; // For time-based events like page views
}

const eventSchema = new Schema<IEvent>({
  sessionId: { type: String, required: true, index: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['theme_visit', 'scoreboard_share', 'page_view', 'session_start'],
    index: true 
  },
  theme: { type: String },
  page: { type: String },
  data: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
  duration: { type: Number } // milliseconds
}, {
  timestamps: false, // Using custom timestamp field
  collection: 'events'
});

// Indexes for analytics queries
eventSchema.index({ type: 1, timestamp: 1 });
eventSchema.index({ sessionId: 1, timestamp: 1 });
eventSchema.index({ theme: 1, type: 1, timestamp: 1 });
eventSchema.index({ timestamp: 1 });

export const Event = mongoose.model<IEvent>('Event', eventSchema);