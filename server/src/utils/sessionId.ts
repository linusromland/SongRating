import crypto from 'crypto';

/**
 * Generate a unique session ID
 * Format: timestamp + random hex string
 */
export function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(8).toString('hex');
  return `${timestamp}-${random}`;
}

/**
 * Validate session ID format
 */
export function isValidSessionId(sessionId: string): boolean {
  return /^[a-z0-9]+-[a-f0-9]{16}$/.test(sessionId);
}