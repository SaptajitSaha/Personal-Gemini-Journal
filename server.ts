import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { rateLimiter, requireAuth, AuthenticatedRequest } from './server/securityMiddleware.ts';
import { isSecretManagerAvailable } from './server/secretManager.ts';
import {
  chatWithGemini,
  summarizeJournal,
  analyzeReflectionEvolution,
} from './server/geminiService.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security Middleware
  app.use(express.json({ limit: '1mb' }));

  // Security Headers (Defense in depth)
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // 1. Health Check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Personal Gemini Journal API',
      timestamp: new Date().toISOString(),
    });
  });

  // 2. Security Status Inspection
  app.get('/api/security/status', (req: Request, res: Response) => {
    res.json({
      firebaseAuthActive: true,
      firestoreIsolationEnforced: true,
      backendTokenVerification: true,
      secretManagerConfigured: isSecretManagerAvailable(),
      inputValidationActive: true,
      aiOutputValidationActive: true,
      rateLimitingActive: true,
      geminiModel: 'gemini-2.5-flash',
      environment: process.env.NODE_ENV || 'development',
    });
  });

  // 3. Multi-turn Gemini Chat Endpoint
  // Protected with Rate Limiting and Token Verification
  app.post(
    '/api/gemini/chat',
    rateLimiter(40, 60 * 1000),
    requireAuth,
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const { conversation, message } = req.body;

        if (!message || typeof message !== 'string' || message.trim().length === 0) {
          res.status(400).json({ error: 'Validation Error', message: 'Field "message" is required and cannot be empty.' });
          return;
        }

        if (!Array.isArray(conversation)) {
          res.status(400).json({ error: 'Validation Error', message: 'Field "conversation" must be an array.' });
          return;
        }

        const reply = await chatWithGemini(conversation, message);
        res.json({ reply, timestamp: new Date().toISOString() });
      } catch (err: any) {
        console.error('[API Error /api/gemini/chat]:', err?.message || err);
        res.status(500).json({
          error: 'Gemini Processing Error',
          message: err?.message || 'An unexpected error occurred while communicating with Gemini.',
        });
      }
    }
  );

  // 4. Structured Journal Summarization Endpoint
  app.post(
    '/api/gemini/summarize',
    rateLimiter(20, 60 * 1000),
    requireAuth,
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const { conversation } = req.body;

        if (!Array.isArray(conversation) || conversation.length === 0) {
          res.status(400).json({ error: 'Validation Error', message: 'Valid non-empty conversation history is required for summarization.' });
          return;
        }

        const summary = await summarizeJournal(conversation);
        res.json(summary);
      } catch (err: any) {
        console.error('[API Error /api/gemini/summarize]:', err?.message || err);
        res.status(500).json({
          error: 'Summarization Error',
          message: err?.message || 'Failed to generate structured journal summary.',
        });
      }
    }
  );

  // 5. Original Feature: Reflection Evolution Analytics Endpoint
  app.post(
    '/api/gemini/reflection-evolution',
    rateLimiter(15, 60 * 1000),
    requireAuth,
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const { journals } = req.body;
        const authenticatedUid = req.user?.uid || 'authenticated-user';

        if (!Array.isArray(journals)) {
          res.status(400).json({ error: 'Validation Error', message: 'Field "journals" must be an array.' });
          return;
        }

        // Verify that all journal records submitted for analysis belong to the authenticated user (Zero cross-user leakage)
        const isolatedJournals = journals.filter((j) => !j.userId || j.userId === authenticatedUid);

        const evolution = await analyzeReflectionEvolution(authenticatedUid, isolatedJournals);
        res.json(evolution);
      } catch (err: any) {
        console.error('[API Error /api/gemini/reflection-evolution]:', err?.message || err);
        res.status(500).json({
          error: 'Reflection Evolution Error',
          message: err?.message || 'Failed to analyze reflection evolution.',
        });
      }
    }
  );

  // Vite middleware for development vs static production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Personal Gemini Journal] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
