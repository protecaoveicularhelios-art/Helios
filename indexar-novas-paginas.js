// Envia 200 URLs/dia para o Google Indexing API
// Lê os sitemaps para pegar todas as URLs indexáveis
// Salva progresso em indexar-progresso.json para continuar no dia seguinte
const fs     = require('fs');
const https  = require('https');
const crypto = require('crypto');
const path   = require('path');

const KEY_FILE    = 'C:\\Users\\SAMSUNG\\Downloads\\helios-protecao-veicular-693a6-e217030b05e7.json';
const PROGRESS    = path.join(__dirname, 'indexar-progresso.json');
const SITE_ROOT   = path.join(__dirname, 'novo-site');
const LIMIT       = 200;

const key = JSON.parse(fs.readFileSync(KEY_FILE));

// ── Coleta URLs dos sitemaps ──────────────────────────────────────────────────
const SITEMAPS = [
  'sitemap-cidades.xml',
  'sitemap-motoristas-app.xml',
  'sitemap-motos.xml',
  'sitemap-veiculos.xml',
  'sitemap-segmentos.xml',
  'sitemap-servicos.xml',
];

function extrairUrls(xml) {
  const matches = xml.match(/<loc>([^<]+)<\/loc>/g) || [];
  return matches.map(m => m.replace(/<\/?loc>/g, '').trim());
}

const TODAS_URLS = [];
for (const sitemap of SITEMAPS) {
  const file = path.join(SITE_ROOT, sitemap);
  if (!fs.existsSync(file)) { console.warn(`⚠️  Não encontrou ${sitemap}`); continue; }
  const urls = extrairUrls(fs.readFileSync(file, 'utf8'));
  console.log(`📄 ${sitemap}: ${urls.length} URLs`);
  TODAS_URLS.push(...urls);
}

// ── Progresso ─────────────────────────────────────────────────────────────────
let progresso = { offset: 0, enviadas: 0, historico: [] };
if (fs.existsSync(PROGRESS)) {
  progresso = JSON.parse(fs.readFileSync(PROGRESS, 'utf8'));
}
const OFFSET = progresso.offset;
const LOTE   = TODAS_URLS.slice(OFFSET, OFFSET + LIMIT);

console.log(`\n📊 Total de URLs indexáveis: ${TODAS_URLS.length}`);
console.log(`✅ Já enviadas: ${OFFSET}`);
console.log(`📋 Restantes:  ${TODAS_URLS.length - OFFSET}`);
console.log(`📦 Este lote:  ${LOTE.length} URLs (offset ${OFFSET} → ${OFFSET + LOTE.length - 1})\n`);

if (LOTE.length === 0) {
  console.log('🎉 Todas as URLs já foram enviadas!');
  process.exit(0);
}

// ── JWT / OAuth ───────────────────────────────────────────────────────────────
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

function request(method, hostname, reqPath, body, headers) {
  return new Promise((resolve, reject) => {
    const data = body ? (typeof body === 'string' ? body : JSON.stringify(body)) : null;
    const opts = { hostname, path: reqPath, method, headers: { ...headers } };
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
  const res = await request('POST', 'oauth2.googleapis.com', '/token', body,
    { 'Content-Type': 'application/x-www-form-urlencoded' });
  const json = JSON.parse(res.body);
  if (!json.access_token) throw new Error('Falha no token: ' + res.body);
  return json.access_token;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🔑 Obtendo token...');
  const token = await getToken();
  console.log('✅ Token obtido!\n');

  let ok = 0, fail = 0;
  const falhas = [];

  for (const url of LOTE) {
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
      const msg = err?.error?.message || res.body;
      console.log(`❌ ${url}\n   Erro: ${msg}`);
      falhas.push({ url, erro: msg });
      fail++;
    }

    await sleep(300);
  }

  // Salva progresso
  const hoje = new Date().toISOString().split('T')[0];
  progresso.offset   = OFFSET + ok;
  progresso.enviadas = (progresso.enviadas || 0) + ok;
  progresso.historico.push({ data: hoje, lote: LOTE.length, ok, fail, offset_inicio: OFFSET });
  fs.writeFileSync(PROGRESS, JSON.stringify(progresso, null, 2));

  const restantes = TODAS_URLS.length - progresso.offset;

  console.log(`\n──────────────────────────────────────────────────────`);
  console.log(`✅ Enviadas com sucesso: ${ok}/${LOTE.length}`);
  if (fail) console.log(`❌ Falhas: ${fail}`);
  console.log(`📊 Total enviado até agora: ${progresso.offset}/${TODAS_URLS.length}`);
  console.log(`📋 Restam: ${restantes} URLs (${Math.ceil(restantes / LIMIT)} dias)`);
  console.log(`──────────────────────────────────────────────────────`);
  if (restantes > 0) {
    console.log(`\n⏰ Rode novamente amanhã após as 4h da manhã:`);
    console.log(`   node indexar-novas-paginas.js\n`);
  } else {
    console.log(`\n🎉 Indexação completa! Todas as ${TODAS_URLS.length} URLs foram enviadas.\n`);
  }
}

main().catch(e => { console.error('Erro fatal:', e.message); process.exit(1); });
