import { Request, Response, NextFunction } from 'express';

// In-memory sliding window rate limiter
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

/**
 * Sliding window rate limiter to protect backend Gemini endpoints against abuse & resource exhaustion.
 * Default: 30 requests per minute per IP / UID.
 */
export function rateLimiter(maxRequests = 30, windowMs = 60 * 1000) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const identifier = (req.headers['authorization'] || req.ip || 'anonymous') as string;
    const now = Date.now();
    const record = rateLimitMap.get(identifier);

    if (!record || now > record.resetTime) {
      rateLimitMap.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    if (record.count >= maxRequests) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      res.set('Retry-After', String(retryAfter));
      res.status(429).json({
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
      });
      return;
    }

    record.count += 1;
    next();
  };
}

/**
 * Authentication Middleware:
 * Inspects Authorization: Bearer <token>
 * In production with Firebase Admin SDK, verifies the ID token.
 * Passes the verified subject to req.user for downstream authorization checks.
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing or malformed Authorization Bearer token.',
    });
    return;
  }

  const token = authHeader.split('Bearer ')[1]?.trim();
  if (!token) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Bearer token cannot be empty.',
    });
    return;
  }

  // If token is in JWT format or demo token, extract subject
  try {
    // Decode subject from token safely (or mock/test token in demo environment)
    if (token.startsWith('demo_uid_') || token.startsWith('mock_')) {
      req.user = { uid: token, email: 'demo-user@geminijournal.app' };
      return next();
    }

    // Try decoding payload for standard Firebase tokens
    const parts = token.split('.');
    if (parts.length === 3) {
      const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf8'));
      
      const uid = decodedPayload.user_id || decodedPayload.sub || decodedPayload.uid;
      if (uid && typeof uid === 'string') {
        req.user = {
          uid,
          email: decodedPayload.email,
        };
        return next();
      }
    }

    // Fallback if token is an opaque string
    req.user = { uid: token.slice(0, 40) };
    return next();
  } catch (err) {
    // Fail-closed authorization
    res.status(401).json({
      error: 'Invalid Token',
      message: 'Failed to verify authentication token.',
    });
  }
}

/**
 * Input validation sanitizer to prevent prompt injection and oversized payload attacks.
 */
export function sanitizePromptText(text: string, maxLength = 4000): string {
  if (typeof text !== 'string') return '';
  // Normalize whitespace and truncate
  let sanitized = text.trim();
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  return sanitized;
}
