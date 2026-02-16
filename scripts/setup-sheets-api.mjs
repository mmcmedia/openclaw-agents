#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import http from 'http';
import { URL } from 'url';

const CREDS_PATH = process.env.HOME + '/.clawdbot/credentials/gmail-oauth.json';
const TOKENS_PATH = process.env.HOME + '/.clawdbot/credentials/sheets-tokens.json';
const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file'
];
const PORT = 8765;

const raw = JSON.parse(readFileSync(CREDS_PATH, 'utf8'));
const creds = raw.installed || raw.web;

const authUrl = `https://accounts.google.com/o/oauth2/auth?` +
  `client_id=${creds.client_id}&` +
  `redirect_uri=http://localhost:${PORT}&` +
  `response_type=code&` +
  `scope=${encodeURIComponent(SCOPES.join(' '))}&` +
  `access_type=offline&` +
  `prompt=consent`;

console.log('\n🔗 Auth URL:\n');
console.log(authUrl);
console.log('\nWaiting for callback...\n');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const code = url.searchParams.get('code');
  if (!code) { res.end('No code'); return; }

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code, client_id: creds.client_id, client_secret: creds.client_secret,
      redirect_uri: `http://localhost:${PORT}`, grant_type: 'authorization_code'
    })
  });
  const tokens = await tokenRes.json();
  if (tokens.error) {
    console.error('❌ Error:', tokens.error, tokens.error_description);
  } else {
    writeFileSync(TOKENS_PATH, JSON.stringify(tokens, null, 2));
    console.log('✅ Tokens saved to', TOKENS_PATH);
  }
  res.end('✅ Done! You can close this window.');
  server.close();
});

server.listen(PORT);
