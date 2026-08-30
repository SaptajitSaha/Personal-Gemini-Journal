import { JournalMessage, JournalSummary, ReflectionEvolution, SecurityStatus } from '../types.ts';
import { getAuthToken } from './firebase.ts';

/**
 * Backend API Client for Personal Gemini Journal
 * Communicates strictly with our secure server-side Express endpoints.
 * Never calls Gemini API directly from browser.
 */

async function getHeaders(): Promise<HeadersInit> {
  const token = await getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

export async function sendChatMessage(
  conversation: Array<{ sender: 'user' | 'gemini'; text: string }>,
  message: string
): Promise<string> {
  const headers = await getHeaders();
  const res = await fetch('/api/gemini/chat', {
    method: 'POST',
    headers,
    body: JSON.stringify({ conversation, message }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Server returned ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  return data.reply;
}

export async function summarizeConversation(
  conversation: JournalMessage[]
): Promise<JournalSummary> {
  const headers = await getHeaders();
  const res = await fetch('/api/gemini/summarize', {
    method: 'POST',
    headers,
    body: JSON.stringify({ conversation }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Summarization failed (${res.status})`);
  }

  return await res.json();
}

export async function fetchReflectionEvolution(
  journals: any[]
): Promise<ReflectionEvolution> {
  const headers = await getHeaders();
  const res = await fetch('/api/gemini/reflection-evolution', {
    method: 'POST',
    headers,
    body: JSON.stringify({ journals }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Reflection Evolution analysis failed (${res.status})`);
  }

  return await res.json();
}

export async function getSecurityStatus(): Promise<SecurityStatus> {
  const res = await fetch('/api/security/status');
  if (!res.ok) {
    throw new Error('Failed to retrieve security status');
  }
  return await res.json();
}
