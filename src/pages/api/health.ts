import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      env: {
        hasBeehiivKey: !!import.meta.env.BEEHIIV_API_KEY,
        hasBeehiivPubId: !!import.meta.env.BEEHIIV_PUBLICATION_ID
      }
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};
