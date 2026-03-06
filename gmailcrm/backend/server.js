const express = require('express');
const cors = require('cors');
const { supabase, checkSupabaseHealth } = require('./db/database');
const { authenticateJwt } = require('./middleware/auth');

const app = express();
const PORT = Number(process.env.PORT || 3001);

const corsOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (origin.startsWith('chrome-extension://')) return callback(null, true);
      if (corsOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json());

app.get('/health', async (_req, res) => {
  const health = await checkSupabaseHealth();
  if (!health.healthy) {
    return res.status(503).json({ status: 'degraded', db: 'supabase', ...health });
  }
  return res.status(200).json({ status: 'ok', db: 'supabase', configured: true, healthy: true });
});

app.get('/api/protected/ping', authenticateJwt, (req, res) => {
  res.json({ ok: true, tokenPreview: String(req.user.token).slice(0, 8) });
});

app.get('/track/open/:pixelToken.png', async (req, res) => {
  const { pixelToken } = req.params;

  if (supabase) {
    const { data: track } = await supabase
      .from('email_tracks')
      .select('id, opens_count')
      .eq('pixel_token', pixelToken)
      .maybeSingle();

    if (track) {
      await supabase
        .from('email_tracks')
        .update({
          opens_count: (track.opens_count || 0) + 1,
          last_opened_at: new Date().toISOString(),
        })
        .eq('id', track.id);
    }
  }

  const transparentGif = Buffer.from(
    'R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
    'base64',
  );

  res.set('Content-Type', 'image/gif');
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  return res.status(200).send(transparentGif);
});

app.get('/track/click/:linkToken', async (req, res) => {
  const { linkToken } = req.params;

  if (!supabase) {
    return res.status(503).json({ error: 'Supabase is not configured' });
  }

  const { data: link, error } = await supabase
    .from('tracked_links')
    .select('id, original_url, clicks_count')
    .eq('link_token', linkToken)
    .maybeSingle();

  if (error || !link) {
    return res.status(404).json({ error: 'Tracking link not found' });
  }

  await supabase
    .from('tracked_links')
    .update({
      clicks_count: (link.clicks_count || 0) + 1,
      last_clicked_at: new Date().toISOString(),
    })
    .eq('id', link.id);

  return res.redirect(302, link.original_url);
});

if (require.main === module) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`GmailCRM backend listening at http://localhost:${PORT}`);
  });
}

module.exports = app;
