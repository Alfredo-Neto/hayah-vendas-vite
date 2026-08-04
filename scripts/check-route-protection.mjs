#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { request } from 'node:http';
import { once } from 'node:events';

const appUrl = process.env.APP_URL ?? 'http://127.0.0.1:5188';
const supabaseUrl = process.env.VITE_SUPABASE_URL;

if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is required. Load .env.local without printing it.');
}

const projectRef = new URL(supabaseUrl).hostname.split('.')[0];
const storageKey = `sb-${projectRef}-auth-token`;
const debuggingPort = 9229;
const chrome = spawn('google-chrome', [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  `--remote-debugging-port=${debuggingPort}`,
  '--user-data-dir=/tmp/hayah-route-protection-regression-chrome',
  'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });

async function httpGetJson(url) {
  return new Promise((resolve, reject) => {
    request(url, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve(JSON.parse(body)));
    }).on('error', reject).end();
  });
}

async function waitForWebSocketUrl() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const pages = await httpGetJson(`http://127.0.0.1:${debuggingPort}/json`);
      const page = pages.find((entry) => entry.type === 'page');
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {
      // Chrome is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error('Chrome debugging endpoint did not start.');
}

let nextId = 1;
const pending = new Map();

function send(ws, method, params = {}) {
  const id = nextId;
  nextId += 1;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
  });
}

try {
  const wsUrl = await waitForWebSocketUrl();
  const ws = new WebSocket(wsUrl);
  ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    }
  });
  await once(ws, 'open');

  await send(ws, 'Page.enable');
  await send(ws, 'Runtime.enable');
  await send(ws, 'Page.navigate', { url: appUrl });
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const fakeSession = {
    access_token: 'invalid-local-session-token',
    refresh_token: 'invalid-local-refresh-token',
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    expires_in: 3600,
    token_type: 'bearer',
    user: {
      id: '00000000-0000-4000-8000-000000000000',
      aud: 'authenticated',
      role: 'authenticated',
      email: 'stale-session@example.test',
      app_metadata: {},
      user_metadata: {},
      created_at: new Date().toISOString(),
    },
  };

  await send(ws, 'Runtime.evaluate', {
    expression: `localStorage.setItem(${JSON.stringify(storageKey)}, ${JSON.stringify(JSON.stringify(fakeSession))})`,
  });
  await send(ws, 'Page.navigate', { url: `${appUrl}/dashboard` });
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const result = await send(ws, 'Runtime.evaluate', {
    expression: 'JSON.stringify({ path: location.pathname, text: document.body.innerText })',
    returnByValue: true,
  });
  const page = JSON.parse(result.result.value);

  if (page.text.includes('Dashboard')) {
    throw new Error('Expected stale/invalid local Supabase session to redirect away from /dashboard, but Dashboard rendered.');
  }
  if (page.path !== '/auth' && !page.text.includes('Autenticação')) {
    throw new Error(`Expected redirect to /auth for invalid local session, got path ${page.path}.`);
  }
  console.log('route protection regression passed');
  ws.close();
} finally {
  chrome.kill();
  await Promise.race([
    once(chrome, 'exit'),
    new Promise((resolve) => setTimeout(resolve, 1000)),
  ]);
}
