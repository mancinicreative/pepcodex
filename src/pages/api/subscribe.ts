import type { APIRoute } from 'astro';

export const prerender = false;

const ALLOWED_ORIGIN = 'https://pepcodex.com';

// Simple in-memory rate limiter (per serverless instance)
// Not perfect across cold starts, but catches most abuse within a warm instance
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return true;
  }

  return false;
}

// Periodic cleanup to prevent memory leaks in long-running instances
function cleanupRateLimitMap() {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}

function corsHeaders(origin?: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Only set CORS headers for the allowed origin
  if (origin === ALLOWED_ORIGIN) {
    headers['Access-Control-Allow-Origin'] = ALLOWED_ORIGIN;
    headers['Vary'] = 'Origin';
  }

  return headers;
}

export const POST: APIRoute = async ({ request }) => {
  const origin = request.headers.get('origin');

  // Cleanup stale rate limit entries periodically
  if (rateLimitMap.size > 1000) {
    cleanupRateLimitMap();
  }

  // Rate limiting
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  if (isRateLimited(ip)) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Too many requests. Please try again later.',
      }),
      { status: 429, headers: corsHeaders(origin) }
    );
  }

  try {
    const body = await request.json();
    const email = body?.email;
    const source = body?.source;

    // Honeypot check — if the hidden field has a value, it's a bot
    if (body?.website) {
      // Silently accept to not tip off bots, but don't actually subscribe
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Successfully subscribed! Check your email.',
        }),
        { status: 200, headers: corsHeaders(origin) }
      );
    }

    // Validate environment variables
    const apiKey = import.meta.env.BEEHIIV_API_KEY;
    const publicationId = import.meta.env.BEEHIIV_PUBLICATION_ID;

    if (!apiKey || !publicationId) {
      console.error('Missing Beehiiv credentials');
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Newsletter service not configured.',
        }),
        { status: 500, headers: corsHeaders(origin) }
      );
    }

    // Validate email
    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ success: false, message: 'Email is required.' }),
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Please enter a valid email.' }),
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    // Call Beehiiv API
    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: source || 'website',
          utm_medium: 'organic',
          utm_campaign: 'pepcodex',
          referring_site: 'https://pepcodex.com',
        }),
      }
    );

    // Success
    if (response.ok) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Successfully subscribed! Check your email.',
        }),
        { status: 200, headers: corsHeaders(origin) }
      );
    }

    // Already subscribed
    if (response.status === 409) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'You are already subscribed!',
        }),
        { status: 200, headers: corsHeaders(origin) }
      );
    }

    // Other errors
    const errorText = await response.text();
    console.error('Beehiiv API error:', response.status, errorText);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Something went wrong. Please try again.',
      }),
      { status: 500, headers: corsHeaders(origin) }
    );
  } catch (error) {
    console.error('Subscribe error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Server error. Please try again.',
      }),
      { status: 500, headers: corsHeaders(origin) }
    );
  }
};

export const OPTIONS: APIRoute = async ({ request }) => {
  const origin = request.headers.get('origin');
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (origin === ALLOWED_ORIGIN) {
    headers['Access-Control-Allow-Origin'] = ALLOWED_ORIGIN;
    headers['Vary'] = 'Origin';
  }

  return new Response(null, { status: 200, headers });
};
