import { readFileSync, writeFileSync, existsSync } from 'fs';
import { createServer } from 'http';
import open from 'open';

const CREDS_PATH = process.env.HOME + '/.clawdbot/credentials/ga4-oauth.json';
const TOKENS_DIR = process.env.HOME + '/.clawdbot/credentials';
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const PORT = 3847;

const accountEmail = process.argv[2] || 'hello@weheartthis.com';
const tokenFile = `${TOKENS_DIR}/gmail-tokens-${accountEmail.replace(/[@.]/g, '-')}.json`;

const raw = JSON.parse(readFileSync(CREDS_PATH, 'utf8'));
const creds = raw.installed || raw.web;
const { client_id, client_secret, redirect_uris } = creds;

// Use localhost redirect
const redirect_uri = `http://localhost:${PORT}/callback`;

const authUrl = new URL(creds.auth_uri);
authUrl.searchParams.set('client_id', client_id);
authUrl.searchParams.set('redirect_uri', redirect_uri);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('scope', SCOPES.join(' '));
authUrl.searchParams.set('access_type', 'offline');
authUrl.searchParams.set('prompt', 'consent');
authUrl.searchParams.set('login_hint', accountEmail);

console.log(`\n🔐 Gmail Read-Only Authorization for: ${accountEmail}`);
console.log(`\nAuthorize URL:\n${authUrl.toString()}\n`);
console.log('Waiting for callback on port', PORT, '...\n');

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.pathname !== '/callback') {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const code = url.searchParams.get('code');
  if (!code) {
    res.writeHead(400);
    res.end('No code received');
    return;
  }

  // Exchange code for tokens
  const tokenRes = await fetch(creds.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id,
      client_secret,
      redirect_uri,
      grant_type: 'authorization_code'
    })
  });

  const tokens = await tokenRes.json();
  if (tokens.error) {
    res.writeHead(500);
    res.end(`Error: ${tokens.error_description || tokens.error}`);
    console.error('Token error:', tokens);
    server.close();
    return;
  }

  writeFileSync(tokenFile, JSON.stringify(tokens, null, 2));
  console.log(`✅ Tokens saved to: ${tokenFile}`);

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <h1>✅ Gmail Read-Only Access Authorized!</h1>
    <p>Account: ${accountEmail}</p>
    <p>Scope: gmail.readonly (read only — cannot send, delete, or modify)</p>
    <p>You can close this window.</p>
  `);

  server.close();
  process.exit(0);
});

server.listen(PORT);
