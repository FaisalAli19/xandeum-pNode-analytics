/* eslint-disable @typescript-eslint/no-explicit-any */
// Vercel serverless function acting as a proxy to the pRPC backend.
// It receives browser requests at /api/rpc and forwards them to the
// upstream pRPC endpoint defined by the PRPC_TARGET environment variable.

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const target = process.env.PRPC_TARGET;
  console.log('🚀 ~ handler ~ target:', target);

  if (!target) {
    console.error('PRPC_TARGET environment variable is not configured');
    res.status(500).send('PRPC_TARGET not configured');
    return;
  }

  // Normalize body for both Vercel (req.body) and Web Request (req.text)
  const getBody = async () => {
    if (typeof req.text === 'function') {
      return await req.text();
    }
    if (typeof req.body === 'string') {
      return req.body;
    }
    if (req.body) {
      return JSON.stringify(req.body);
    }
    return '';
  };

  // Create an AbortController for timeout handling
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    const body = await getBody();

    // Forward the request to the upstream pRPC server
    const upstreamResponse = await fetch(target, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const text = await upstreamResponse.text();
    const contentType = upstreamResponse.headers.get('content-type') ?? 'application/json';

    res.status(upstreamResponse.status);
    res.setHeader('Content-Type', contentType);
    res.send(text);
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error('pRPC proxy error:', error);

    if (error?.name === 'TimeoutError' || error?.name === 'AbortError') {
      res.status(504).send('Request to upstream server timed out');
      return;
    }

    if (error?.message?.includes('fetch failed') || error?.code === 'ECONNREFUSED') {
      res.status(502).send('Cannot connect to upstream server. Check PRPC_TARGET configuration.');
      return;
    }

    res.status(502).send(`Upstream error: ${error?.message || 'Unknown error'}`);
  }
}
