// Vercel serverless function — /api/subscribe
// Proxies newsletter signups to Beehiiv. The API key never touches the client.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  // Parse body (Vercel parses JSON automatically when Content-Type is application/json)
  const { email } = req.body ?? {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId  = process.env.BEEHIIV_PUB_ID;

  if (!apiKey || !pubId) {
    console.error('Missing BEEHIIV_API_KEY or BEEHIIV_PUB_ID env vars');
    return res.status(500).json({ error: 'Newsletter not configured.' });
  }

  try {
    const upstream = await fetch(
      `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: 'noctua-website',
          utm_medium: 'organic',
        }),
      }
    );

    if (!upstream.ok) {
      const text = await upstream.text();
      console.error('Beehiiv error:', upstream.status, text);
      return res.status(502).json({ error: 'Could not subscribe. Please try again.' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Subscribe handler error:', err);
    return res.status(500).json({ error: 'Unexpected error. Please try again.' });
  }
}
