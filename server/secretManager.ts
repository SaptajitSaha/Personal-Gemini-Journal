/**
 * Security-First Secret Manager Service
 * Manages privileged server-side credentials with defense in depth.
 * 
 * In production Google Cloud deployments (Cloud Run / GKE), secrets like GEMINI_API_KEY
 * can be resolved directly from Google Cloud Secret Manager or runtime container environment.
 * Privileged keys are NEVER returned or exposed to the client application.
 */

let cachedGeminiApiKey: string | null = null;

export async function getGeminiApiKey(): Promise<string> {
  if (cachedGeminiApiKey) {
    return cachedGeminiApiKey;
  }

  // 1. Check direct environment variable injected securely by Google Cloud Run / AI Studio
  const envKey = process.env.GEMINI_API_KEY;
  if (envKey && envKey.trim().length > 0 && envKey !== 'MY_GEMINI_API_KEY') {
    cachedGeminiApiKey = envKey.trim();
    return cachedGeminiApiKey;
  }

  // 2. Fallback check for alternate environment secret naming
  const altKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_KEY;
  if (altKey && altKey.trim().length > 0) {
    cachedGeminiApiKey = altKey.trim();
    return cachedGeminiApiKey;
  }

  // 3. If Secret Manager is explicitly configured with a secret path
  const gcpProject = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT;
  const secretName = process.env.GEMINI_SECRET_NAME || 'gemini-api-key';

  if (gcpProject && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    try {
      // Dynamic import to avoid dependency issues if optional
      // @ts-ignore
      const { SecretManagerServiceClient } = await import('@google-cloud/secret-manager');
      const client = new SecretManagerServiceClient();
      const name = `projects/${gcpProject}/secrets/${secretName}/versions/latest`;
      const [version] = await client.accessSecretVersion({ name });
      const payload = version.payload?.data?.toString();
      if (payload) {
        cachedGeminiApiKey = payload.trim();
        return cachedGeminiApiKey;
      }
    } catch (err) {
      console.warn('[SecretManager] Unable to access Secret Manager, checking environment variables.');
    }
  }

  if (envKey) {
    return envKey;
  }

  throw new Error('GEMINI_API_KEY is not configured on the server. Please configure it in your deployment settings.');
}

export function isSecretManagerAvailable(): boolean {
  return Boolean(
    process.env.GEMINI_API_KEY || 
    process.env.GOOGLE_CLOUD_PROJECT || 
    process.env.GCP_PROJECT_ID
  );
}
