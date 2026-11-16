/**
 * Saarthi AI Unified API Client & Network Resiliency Layer
 * 
 * Provides:
 * 1. Automatic base URL resolution supporting Next.js rewrites (same-origin relative URL)
 *    and explicit environment variable override (NEXT_PUBLIC_API_URL).
 * 2. Multi-tier automatic fallbacks:
 *    - Same-origin relative path (immune to CORS & IPv4/IPv6 mismatches)
 *    - Current hostname on port 4000 (e.g. localhost:4000 or 127.0.0.1:4000)
 *    - 127.0.0.1:4000
 *    - localhost:4000
 * 3. Safe response parsing that never throws SyntaxError on HTML/non-JSON error pages.
 */

export function getApiBase(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  }

  // In the browser, prefer same-origin relative URLs ('') so Next.js rewrites proxy directly,
  // preventing CORS, Private Network Access blocks, and localhost vs 127.0.0.1 mismatches.
  if (typeof window !== 'undefined') {
    return '';
  }

  // Server-side default
  return process.env.BACKEND_INTERNAL_URL || 'http://127.0.0.1:4000';
}

/**
 * Execute an API fetch with automatic fallback across local dev hosts if a network error occurs.
 */
export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const base = getApiBase();
  const primaryUrl = base ? `${base}${normalizedEndpoint}` : normalizedEndpoint;

  try {
    const res = await fetch(primaryUrl, options);

    // If relative request yielded 404 (e.g., if Next.js rewrite is not yet active in an un-restarted dev server),
    // immediately try direct port 4000 fallback
    if (res.status === 404 && !base && typeof window !== 'undefined') {
      const hostname = window.location.hostname || 'localhost';
      const fallbackCandidates = [
        `http://${hostname}:4000${normalizedEndpoint}`,
        `http://127.0.0.1:4000${normalizedEndpoint}`,
        `http://localhost:4000${normalizedEndpoint}`
      ];

      for (const fallbackUrl of fallbackCandidates) {
        try {
          const fallbackRes = await fetch(fallbackUrl, options);
          if (fallbackRes.status !== 404) {
            return fallbackRes;
          }
        } catch (_) {
          // Continue to next candidate
        }
      }
    }

    return res;
  } catch (primaryError) {
    // A network failure occurred (Failed to fetch, CORS block, port unreachable, etc.)
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname || 'localhost';
      const candidateUrls = [
        `http://${hostname}:4000${normalizedEndpoint}`,
        `http://127.0.0.1:4000${normalizedEndpoint}`,
        `http://localhost:4000${normalizedEndpoint}`,
        normalizedEndpoint // Attempt relative if primary was absolute
      ].filter((url) => url !== primaryUrl);

      for (const candidate of candidateUrls) {
        try {
          const res = await fetch(candidate, options);
          return res;
        } catch (_) {
          // Continue trying remaining endpoints
        }
      }
    }

    throw primaryError;
  }
}

/**
 * Safely parse API response JSON without throwing SyntaxError if the server returned HTML or plain text.
 */
export async function safeParseJson<T = any>(res: Response): Promise<{ data: T | null; text: string }> {
  let text = '';
  try {
    text = await res.text();
    const data = JSON.parse(text) as T;
    return { data, text };
  } catch {
    return { data: null, text };
  }
}

