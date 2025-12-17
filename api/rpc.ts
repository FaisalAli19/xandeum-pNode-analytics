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

  if (!target) {
    res.status(500).send('PRPC_TARGET not configured');
    return;
  }

  try {
    // req.body is already parsed JSON in Vercel Node functions for application/json
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? {});

    const upstreamResponse = await fetch(target, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    const text = await upstreamResponse.text();
    const contentType = upstreamResponse.headers.get('content-type') ?? 'application/json';

    res.status(upstreamResponse.status);
    res.setHeader('Content-Type', contentType);
    res.send(text);
  } catch (error) {
    console.error('pRPC proxy error', error);
    res.status(502).send('Upstream error');
  }
}
