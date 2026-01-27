export default async function handler(req, res) {
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

  try {
    // Parse body - Vercel should handle this automatically but let's be safe
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }

    const email = body?.email;
    const source = body?.source;

    // Validate environment variables
    const apiKey = process.env.BEEHIIV_API_KEY;
    const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

    if (!apiKey || !publicationId) {
      console.error('Missing Beehiiv credentials:', {
        hasApiKey: !!apiKey,
        hasPubId: !!publicationId,
        envKeys: Object.keys(process.env).filter(k => k.startsWith('BEEHIIV'))
      });
      return res.status(500).json({
        success: false,
        message: 'Newsletter service not configured.',
      });
    }

    // Validate email
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email.' });
    }

    // Call Beehiiv API
    const beehiivUrl = `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`;

    const response = await fetch(beehiivUrl, {
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
    });

    // Success
    if (response.ok) {
      return res.status(200).json({
        success: true,
        message: 'Successfully subscribed! Check your email.',
      });
    }

    // Already subscribed
    if (response.status === 409) {
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed!',
      });
    }

    // Other errors
    const errorText = await response.text();
    console.error('Beehiiv API error:', response.status, errorText);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  } catch (error) {
    console.error('Subscribe error:', error.message, error.stack);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
    });
  }
}
