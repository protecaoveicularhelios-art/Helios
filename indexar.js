const fs      = require('fs');
const https   = require('https');
const crypto  = require('crypto');

// Caminho do arquivo JSON baixado do Google Cloud
const KEY_FILE = 'C:\\Users\\SAMSUNG\\Downloads\\helios-protecao-veicular-693a6-e217030b05e7.json';
const key = JSON.parse(fs.readFileSync(KEY_FILE));

// ── URLs para indexar ──────────────────────────────────────────────────────
const URLS = [
  // Páginas principais
  'https://heliosprotecaoveicular.com.br/',
  'https://heliosprotecaoveicular.com.br/cotacao.html',
  'https://heliosprotecaoveicular.com.br/contato.html',
  'https://heliosprotecaoveicular.com.br/blog/',
  // Grande BH
  'https://heliosprotecaoveicular.com.br/belo-horizonte/',
  'https://heliosprotecaoveicular.com.br/contagem/',
  'https://heliosprotecaoveicular.com.br/betim/',
  'https://heliosprotecaoveicular.com.br/ribeirao-das-neves/',
  'https://heliosprotecaoveicular.com.br/santa-luzia/',
  'https://heliosprotecaoveicular.com.br/ibirite/',
  'https://heliosprotecaoveicular.com.br/vespasiano/',
  'https://heliosprotecaoveicular.com.br/sabara/',
  'https://heliosprotecaoveicular.com.br/nova-lima/',
  'https://heliosprotecaoveicular.com.br/lagoa-santa/',
  'https://heliosprotecaoveicular.com.br/pedro-leopoldo/',
  'https://heliosprotecaoveicular.com.br/brumadinho/',
  'https://heliosprotecaoveicular.com.br/esmeraldas/',
  'https://heliosprotecaoveicular.com.br/mario-campos/',
  'https://heliosprotecaoveicular.com.br/sarzedo/',
  'https://heliosprotecaoveicular.com.br/igarape/',
  'https://heliosprotecaoveicular.com.br/juatuba/',
  'https://heliosprotecaoveicular.com.br/mateus-leme/',
  'https://heliosprotecaoveicular.com.br/sao-joaquim-de-bicas/',
  // Interior MG - lote 1
  'https://heliosprotecaoveicular.com.br/ipatinga/',
  'https://heliosprotecaoveicular.com.br/juiz-de-fora/',
  'https://heliosprotecaoveicular.com.br/divinopolis/',
  'https://heliosprotecaoveicular.com.br/montes-claros/',
  'https://heliosprotecaoveicular.com.br/uberaba/',
  'https://heliosprotecaoveicular.com.br/governador-valadares/',
  'https://heliosprotecaoveicular.com.br/pocos-de-caldas/',
  // Interior MG - lote 2
  'https://heliosprotecaoveicular.com.br/uberlandia/',
  'https://heliosprotecaoveicular.com.br/sete-lagoas/',
  'https://heliosprotecaoveicular.com.br/teofilo-otoni/',
  'https://heliosprotecaoveicular.com.br/patos-de-minas/',
  'https://heliosprotecaoveicular.com.br/pouso-alegre/',
  'https://heliosprotecaoveicular.com.br/varginha/',
  'https://heliosprotecaoveicular.com.br/barbacena/',
  'https://heliosprotecaoveicular.com.br/conselheiro-lafaiete/',
  'https://heliosprotecaoveicular.com.br/coronel-fabriciano/',
  'https://heliosprotecaoveicular.com.br/muriae/',
  // Blog
  'https://heliosprotecaoveicular.com.br/blog/diferenca-entre-seguro-de-carro-e-protecao-veicular/',
  'https://heliosprotecaoveicular.com.br/blog/maiores-protecoes-veiculares-do-brasil/',
  'https://heliosprotecaoveicular.com.br/blog/seguro-moto-ou-protecao-veicular-qual-escolher/',
  'https://heliosprotecaoveicular.com.br/blog/protecao-veicular-e-confiavel/',
  'https://heliosprotecaoveicular.com.br/blog/protecao-veicular-para-motorista-de-aplicativo/',
];

// ── Funções internas ───────────────────────────────────────────────────────
function b64url(str) {
  return Buffer.from(str).toString('base64url');
}

function createJWT() {
  const now = Math.floor(Date.now() / 1000);
  const header  = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = b64url(JSON.stringify({
    iss: key.client_email,
    sub: key.client_email,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
    scope: 'https://www.googleapis.com/auth/indexing'
  }));
  const input = `${header}.${payload}`;
  const sign  = crypto.createSign('RSA-SHA256');
  sign.update(input);
  return `${input}.${sign.sign(key.private_key, 'base64url')}`;
}

function post(hostname, path, body, headers) {
  return new Promise((resolve, reject) => {
    const data = typeof body === 'string' ? body : JSON.stringify(body);
    const req  = https.request(
      { hostname, path, method: 'POST', headers: { 'Content-Length': Buffer.byteLength(data), ...headers } },
      res => { let d = ''; res.on('data', c => d += c); res.on('end', () => resolve({ status: res.statusCode, body: d })); }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function getToken() {
  const body = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${createJWT()}`;
  const res  = await post('oauth2.googleapis.com', '/token', body, { 'Content-Type': 'application/x-www-form-urlencoded' });
  const json = JSON.parse(res.body);
  if (!json.access_token) throw new Error('Falha no token: ' + res.body);
  return json.access_token;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  console.log('🔑 Obtendo token de acesso...');
  const token = await getToken();
  console.log('✅ Token obtido!\n');
  console.log(`📋 Enviando ${URLS.length} URLs para indexação...\n`);

  let ok = 0, erros = 0;

  for (const url of URLS) {
    const res = await post(
      'indexing.googleapis.com',
      '/v3/urlNotifications:publish',
      { url, type: 'URL_UPDATED' },
      { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    );

    if (res.status === 200) {
      console.log(`✅ ${url}`);
      ok++;
    } else {
      const err = JSON.parse(res.body);
      console.log(`❌ ${url}\n   → ${err?.error?.message || res.body}`);
      erros++;
    }

    await sleep(600); // respeita limite de ~100 req/min da API
  }

  console.log(`\n──────────────────────────────`);
  console.log(`✅ Enviadas com sucesso: ${ok}`);
  console.log(`❌ Erros: ${erros}`);
  console.log(`──────────────────────────────`);
  console.log('Pronto! O Google vai indexar as páginas nas próximas horas.');
}

main().catch(e => { console.error('Erro fatal:', e.message); process.exit(1); });
