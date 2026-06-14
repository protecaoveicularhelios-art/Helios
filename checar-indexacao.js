const fs     = require('fs');
const https  = require('https');
const crypto = require('crypto');

const KEY_FILE = 'C:\\Users\\SAMSUNG\\Downloads\\helios-protecao-veicular-693a6-e217030b05e7.json';
const key = JSON.parse(fs.readFileSync(KEY_FILE));

const URLS = [
  'https://heliosprotecaoveicular.com.br/',
  'https://heliosprotecaoveicular.com.br/cotacao.html',
  'https://heliosprotecaoveicular.com.br/contato.html',
  'https://heliosprotecaoveicular.com.br/blog/',
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
  'https://heliosprotecaoveicular.com.br/ipatinga/',
  'https://heliosprotecaoveicular.com.br/juiz-de-fora/',
  'https://heliosprotecaoveicular.com.br/divinopolis/',
  'https://heliosprotecaoveicular.com.br/montes-claros/',
  'https://heliosprotecaoveicular.com.br/uberaba/',
  'https://heliosprotecaoveicular.com.br/governador-valadares/',
  'https://heliosprotecaoveicular.com.br/pocos-de-caldas/',
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
  'https://heliosprotecaoveicular.com.br/blog/diferenca-entre-seguro-de-carro-e-protecao-veicular/',
  'https://heliosprotecaoveicular.com.br/blog/maiores-protecoes-veiculares-do-brasil/',
  'https://heliosprotecaoveicular.com.br/blog/seguro-moto-ou-protecao-veicular-qual-escolher/',
  'https://heliosprotecaoveicular.com.br/blog/protecao-veicular-e-confiavel/',
  'https://heliosprotecaoveicular.com.br/blog/protecao-veicular-para-motorista-de-aplicativo/',
];

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
  console.log('🔑 Obtendo token...');
  const token = await getToken();
  console.log('✅ Token obtido!\n');
  console.log('Verificando status de notificação de cada URL...\n');

  let notificadas = 0, semRegistro = 0;

  for (const url of URLS) {
    const encoded = encodeURIComponent(url);
    const res = await request(
      'GET', 'indexing.googleapis.com',
      `/v3/urlNotifications/metadata?url=${encoded}`,
      null,
      { 'Authorization': `Bearer ${token}` }
    );

    if (res.status === 200) {
      const data = JSON.parse(res.body);
      const ts = data.latestUpdate?.notifyTime;
      const hora = ts ? new Date(ts).toLocaleString('pt-BR') : '?';
      console.log(`✅ ${url}\n   Notificada em: ${hora}`);
      notificadas++;
    } else if (res.status === 404) {
      console.log(`⚠️  ${url}\n   Sem registro (ainda não foi rastreada pelo Google)`);
      semRegistro++;
    } else {
      const err = JSON.parse(res.body);
      console.log(`❌ ${url}\n   Erro: ${err?.error?.message}`);
    }

    await sleep(400);
  }

  console.log(`\n──────────────────────────────────────────`);
  console.log(`✅ Com registro de notificação: ${notificadas}`);
  console.log(`⚠️  Sem registro (Google ainda não rastreou): ${semRegistro}`);
  console.log(`──────────────────────────────────────────`);
  console.log(`\n⚠️  IMPORTANTE: "notificada" ≠ "indexada"`);
  console.log(`   O Google recebeu o aviso e vai rastrear. A indexação`);
  console.log(`   real aparece no Search Console em 1-7 dias.`);
}

main().catch(e => { console.error('Erro fatal:', e.message); process.exit(1); });
