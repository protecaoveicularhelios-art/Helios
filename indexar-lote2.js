const fs     = require('fs');
const https  = require('https');
const crypto = require('crypto');

const KEY_FILE = 'C:\\Users\\SAMSUNG\\Downloads\\helios-protecao-veicular-693a6-e217030b05e7.json';
const key = JSON.parse(fs.readFileSync(KEY_FILE));

const lote2 = require('./data/cidades-mg-lote2.json');

const URLS = lote2.map(c =>
  `https://heliosprotecaoveicular.com.br/protecao-veicular-${c.slug}-mg/`
);

function b64url(s) { return Buffer.from(s).toString('base64url'); }

function createJWT() {
  const now = Math.floor(Date.now() / 1000);
  const h = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const p = b64url(JSON.stringify({
    iss: key.client_email, sub: key.client_email,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now, exp: now + 3600,
    scope: 'https://www.googleapis.com/auth/indexing'
  }));
  const input = `${h}.${p}`;
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(input);
  return `${input}.${sign.sign(key.private_key, 'base64url')}`;
}

function request(method, hostname, path, body, headers) {
  return new Promise((resolve, reject) => {
    const data = body ? (typeof body === 'string' ? body : JSON.stringify(body)) : null;
    const opts = { hostname, path, method, headers: { ...headers } };
    if (data) opts.headers['Content-Length'] = Buffer.byteLength(data);
    const req = https.request(opts, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function getToken() {
  const body = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${createJWT()}`;
  const res = await request('POST', 'oauth2.googleapis.com', '/token', body, { 'Content-Type': 'application/x-www-form-urlencoded' });
  const json = JSON.parse(res.body);
  if (!json.access_token) throw new Error('Falha no token: ' + res.body);
  return json.access_token;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  console.log(`📋 Total de URLs a indexar: ${URLS.length}`);
  console.log('🔑 Obtendo token...');
  const token = await getToken();
  console.log('✅ Token obtido!\n');

  let ok = 0, fail = 0;

  for (const url of URLS) {
    const res = await request(
      'POST', 'indexing.googleapis.com',
      '/v3/urlNotifications:publish',
      { url, type: 'URL_UPDATED' },
      { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    );

    if (res.status === 200) {
      console.log(`✅ ${url}`);
      ok++;
    } else {
      const err = JSON.parse(res.body);
      console.log(`❌ ${url}\n   Erro: ${err?.error?.message}`);
      fail++;
    }

    await sleep(300);
  }

  console.log(`\n──────────────────────────────────────────`);
  console.log(`✅ Enviadas com sucesso: ${ok}/${URLS.length}`);
  if (fail) console.log(`❌ Falhas: ${fail}`);
  console.log(`──────────────────────────────────────────`);
  console.log(`\n⏱️  Google vai rastrear e indexar em 1–7 dias.`);
  console.log(`   Acompanhe no Search Console: https://search.google.com/search-console\n`);
}

main().catch(e => { console.error('Erro fatal:', e.message); process.exit(1); });
