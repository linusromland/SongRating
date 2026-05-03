import mongoose, { Schema, Document } from 'mongoose';

export interface IVote extends Document {
  sessionId: string;
  theme: string;
  winnerId: string;
  loserId: string;
  timestamp: Date;
  winnerElo?: number;
  loserElo?: number;
  winnerPreviousElo?: number;
  loserPreviousElo?: number;
}

const voteSchema = new Schema<IVote>({
  sessionId: { type: String, required: true, index: true },
  theme: { type: String, required: true, index: true },
  winnerId: { type: String, required: true },
  loserId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  winnerElo: { type: Number },
  loserElo: { type: Number },
  winnerPreviousElo: { type: Number },
  loserPreviousElo: { type: Number }
}, {
  timestamps: false, // Using custom timestamp field
  collection: 'votes'
});

// Compound indexes for analytics queries
voteSchema.index({ theme: 1, timestamp: 1 });
voteSchema.index({ sessionId: 1, timestamp: 1 });
voteSchema.index({ winnerId: 1, theme: 1 });
voteSchema.index({ timestamp: 1 });

export const Vote = mongoose.model<IVote>('Vote', voteSchema);