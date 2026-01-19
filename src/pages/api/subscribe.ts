import type { APIRoute } from 'astro';
import { subscribeEmail } from '../../lib/beehiiv';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  // Validate content type
  const contentType = request.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Invalid content type. Expected application/json.',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const body = await request.json();
    const { email, source } = body;

    // Validate email presence
    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Email is required.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Subscribe to Beehiiv
    const result = await subscribeEmail(email, source);

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Subscribe API error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Invalid request body.',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
