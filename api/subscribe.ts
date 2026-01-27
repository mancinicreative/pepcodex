import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Validate content type
  const contentType = req.headers['content-type'];
  if (!contentType?.includes('application/json')) {
    return res.status(400).json({ success: false, message: 'Invalid content type' });
  }

  try {
    const { email, source } = req.body;

    // Validate environment variables
    const apiKey = process.env.BEEHIIV_API_KEY;
    const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

    if (!apiKey || !publicationId) {
      console.error('Missing Beehiiv credentials:', {
        hasApiKey: !!apiKey,
        hasPubId: !!publicationId,
      });
      return res.status(500).json({
        success: false,
        message: 'Newsletter service not configured. Please try again later.',
      });
    }

    // Validate email
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
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

    // Handle success (201 Created)
    if (response.ok) {
      const data = await response.json();
      return res.status(200).json({
        success: true,
        message: 'Successfully subscribed! Check your email to confirm.',
        subscriberId: data.data?.id,
      });
    }

    // Handle already subscribed (409 Conflict)
    if (response.status === 409) {
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed!',
      });
    }

    // Handle bad request (400)
    if (response.status === 400) {
      const errorData = await response.json();
      const errorMessage = errorData.errors?.[0]?.message || 'Invalid request';
      return res.status(400).json({ success: false, message: errorMessage });
    }

    // Handle auth errors (401, 403)
    if (response.status === 401 || response.status === 403) {
      console.error('Beehiiv API authentication failed:', response.status);
      return res.status(500).json({
        success: false,
        message: 'Newsletter service error. Please try again later.',
      });
    }

    // Handle rate limit (429)
    if (response.status === 429) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please wait a moment and try again.',
      });
    }

    // Handle other errors
    console.error(`Beehiiv API error: ${response.status}`);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  } catch (error) {
    console.error('Subscribe handler error:', error);
    return res.status(500).json({
      success: false,
      message: 'Network error. Please check your connection and try again.',
    });
  }
}
