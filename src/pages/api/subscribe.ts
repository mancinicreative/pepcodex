import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const email = body?.email;
    const source = body?.source;

    // Validate environment variables
    const apiKey = import.meta.env.BEEHIIV_API_KEY;
    const publicationId = import.meta.env.BEEHIIV_PUBLICATION_ID;

    if (!apiKey || !publicationId) {
      console.error('Missing Beehiiv credentials:', {
        hasApiKey: !!apiKey,
        hasPubId: !!publicationId,
      });
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Newsletter service not configured.',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate email
    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ success: false, message: 'Email is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Please enter a valid email.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Call Beehiiv API
    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
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
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Already subscribed
    if (response.status === 409) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'You are already subscribed!',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
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
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Subscribe error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Server error. Please try again.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
