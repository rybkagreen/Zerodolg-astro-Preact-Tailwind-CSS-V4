import type { APIRoute } from 'astro';

/**
 * Health check endpoint for Docker and monitoring systems
 * Returns 200 OK if the application is running
 */
export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'zerodolg-astro',
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
