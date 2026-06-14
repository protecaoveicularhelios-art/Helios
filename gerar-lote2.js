'use strict';
const fs   = require('fs');
const path = require('path');

const SITE_ROOT = path.join(__dirname, 'novo-site');
const BASE_URL  = 'https://heliosprotecaoveicular.com.br';
const WPP_COT   = 'https://wa.me/5531992395859';
const WPP_ATEND = 'https://wa.me/5531993728984';
const TODAY     = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';

const SVG_WPP = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
const SVG_WPP_SM = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

const lote2    = require('./data/cidades-mg-lote2.json');
const todasCidades = [
  ...require('./data/cidades-mg.json'),
  ...lote2,
];

function css() {
  return `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root { --navy: #0b1a35; --navy2: #0d2250; --yellow: #f5c400; --yellow2: #e6b800; --green: #25d366; --green2: #1ebe5d; --white: #ffffff; --gray: #f4f6f9; --text: #1a2332; --mid: #4a5568; --light: rgba(255,255,255,.8); }
    html { scroll-behavior: smooth; overflow-x: hidden; }
    body { font-family: 'Montserrat', sans-serif; color: var(--text); background: #fff; overflow-x: hidden; }
    .topbar { background: var(--navy); border-bottom: 1px solid #1a2e50; padding: 0 40px; height: 40px; display: flex; align-items: center; justify-content: space-between; }
    .topbar a { color: var(--yellow); font-size: .72rem; text-decoration: none; }
    .topbar span { color: #ccc; font-size: .72rem; }
    .sitenav { background: var(--navy); padding: 0 40px; height: 70px; display: flex; align-items: center; justify-content: space-between; }
    .sitenav-logo img { height: 48px; object-fit: contain; }
    .sitenav-links { display: flex; gap: 32px; }
    .sitenav-links a { color: #fff; text-decoration: none; font-weight: 600; font-size: .85rem; transition: color .2s; }
    .sitenav-links a:hover { color: var(--yellow); }
    .sitenav-cta { background: var(--yellow); color: var(--navy); font-weight: 800; padding: 8px 22px; border-radius: 8px; text-decoration: none; font-size: .82rem; white-space: nowrap; transition: background .2s; }
    .sitenav-cta:hover { background: var(--yellow2); }
    .breadcrumbs { background: var(--gray); padding: 10px 24px; border-bottom: 1px solid #e2e8f0; }
    .breadcrumb-list { list-style: none; display: flex; flex-wrap: wrap; gap: 6px; max-width: 1060px; margin: 0 auto; font-size: .72rem; color: var(--mid); }
    .breadcrumb-list li::after { content: '›'; margin-left: 6px; color: #cbd5e0; }
    .breadcrumb-list li:last-child::after { display: none; }
    .breadcrumb-list a { color: var(--navy); text-decoration: none; font-weight: 600; }
    .breadcrumb-list a:hover { color: var(--yellow2); }
    .hero { background: linear-gradient(135deg, #00122b 0%, #0b1a35 55%, #0d2250 100%); padding: 64px 24px 72px; text-align: center; position: relative; overflow: hidden; }
    .hero::after { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 50% -10%, rgba(245,196,0,.1) 0%, transparent 65%); pointer-events: none; }
    .hero-inner { max-width: 760px; margin: 0 auto; position: relative; z-index: 1; }
    .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(245,196,0,.12); border: 1px solid rgba(245,196,0,.3); color: var(--yellow); font-size: .68rem; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; padding: 5px 14px; border-radius: 50px; margin-bottom: 20px; }
    .hero-badge span { background: var(--yellow); color: var(--navy); padding: 2px 8px; border-radius: 50px; font-size: .62rem; }
    .hero h1 { font-size: clamp(1.7rem, 5vw, 3rem); font-weight: 900; color: #fff; line-height: 1.12; margin-bottom: 18px; }
    .hero h1 em { color: var(--yellow); font-style: normal; }
    .hero-sub { color: var(--light); font-size: clamp(.88rem, 2vw, 1.05rem); line-height: 1.65; margin-bottom: 32px; max-width: 580px; margin-left: auto; margin-right: auto; }
    .hero-cta { display: flex; flex-direction: column; align-items: center; gap: 12px; }
    .btn-wpp { background: var(--green); color: #fff; padding: 16px 36px; border-radius: 50px; font-weight: 900; font-size: 1rem; text-decoration: none; letter-spacing: .3px; transition: transform .2s, box-shadow .2s; box-shadow: 0 6px 24px rgba(37,211,102,.45); display: inline-flex; align-items: center; gap: 10px; }
    .btn-wpp:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(37,211,102,.6); }
    .btn-wpp svg { flex-shrink: 0; }
    .hero-note { color: rgba(255,255,255,.45); font-size: .72rem; font-weight: 600; }
    .hero-stats { display: flex; justify-content: center; gap: 32px; flex-wrap: wrap; margin-top: 48px; padding-top: 32px; border-top: 1px solid rgba(255,255,255,.1); }
    .hero-stat { text-align: center; }
    .hero-stat .num { font-size: 1.6rem; font-weight: 900; color: var(--yellow); display: block; }
    .hero-stat .lbl { font-size: .7rem; font-weight: 600; color: rgba(255,255,255,.5); text-transform: uppercase; letter-spacing: 1px; }
    .urgency-bar { background: var(--yellow); padding: 12px 24px; display: flex; align-items: center; justify-content: center; gap: 10px; text-align: center; }
    .urgency-bar p { font-size: .82rem; font-weight: 800; color: var(--navy); }
    .section { padding: 72px 24px; }
    .section-alt { background: var(--gray); }
    .container { max-width: 1060px; margin: 0 auto; }
    .section-head { text-align: center; margin-bottom: 48px; }
    .section-head .label { font-size: .65rem; font-weight: 800; letter-spacing: 2.5px; text-transform: uppercase; color: var(--yellow2); display: block; margin-bottom: 8px; }
    .section-head h2 { font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 900; color: var(--navy); }
    .section-head p { color: var(--mid); font-size: .9rem; margin-top: 10px; }
    .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
    .step-card { background: #fff; border-radius: 16px; padding: 32px 24px; text-align: center; box-shadow: 0 4px 20px rgba(11,26,53,.07); position: relative; }
    .step-card::before { content: attr(data-step); position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: var(--yellow); color: var(--navy); width: 28px; height: 28px; border-radius: 50%; font-size: .8rem; font-weight: 900; display: flex; align-items: center; justify-content: center; }
    .step-icon { font-size: 2.2rem; margin-bottom: 14px; }
    .step-card h3 { font-size: .95rem; font-weight: 800; color: var(--navy); margin-bottom: 8px; }
    .step-card p { font-size: .8rem; color: var(--mid); line-height: 1.6; }
    .services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 16px; }
    .service-card { background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 3px 14px rgba(11,26,53,.06); border-top: 3px solid var(--yellow); text-align: center; }
    .service-icon { font-size: 2rem; margin-bottom: 10px; }
    .service-card h4 { font-size: .88rem; font-weight: 800; color: var(--navy); margin-bottom: 6px; }
    .service-card p { font-size: .76rem; color: var(--mid); line-height: 1.5; }
    .benefits-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .benefit { display: flex; align-items: flex-start; gap: 14px; background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 3px 14px rgba(11,26,53,.06); border-left: 3px solid var(--yellow); }
    .benefit-icon { font-size: 1.6rem; flex-shrink: 0; margin-top: 2px; }
    .benefit h4 { font-size: .88rem; font-weight: 800; color: var(--navy); margin-bottom: 4px; }
    .benefit p { font-size: .78rem; color: var(--mid); line-height: 1.5; }
    .cta-mid { background: var(--navy); padding: 48px 24px; text-align: center; }
    .cta-mid h2 { font-size: clamp(1.2rem, 3vw, 1.8rem); font-weight: 900; color: #fff; margin-bottom: 8px; }
    .cta-mid h2 em { color: var(--yellow); font-style: normal; }
    .cta-mid p { color: var(--light); font-size: .88rem; margin-bottom: 24px; }
    .compare-table { width: 100%; border-collapse: collapse; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(11,26,53,.1); }
    .compare-table th { padding: 16px 20px; font-size: .82rem; font-weight: 800; text-transform: uppercase; letter-spacing: .5px; }
    .compare-table th:first-child { background: var(--gray); color: var(--mid); text-align: left; }
    .compare-table th.col-seg { background: #e8eaf0; color: #666; }
    .compare-table th.col-helios { background: var(--navy); color: var(--yellow); }
    .compare-table td { padding: 14px 20px; font-size: .85rem; border-bottom: 1px solid #eee; }
    .compare-table td:first-child { font-weight: 700; color: var(--navy); background: #fafbfc; }
    .compare-table td.col-seg { text-align: center; background: #fff; color: #666; }
    .compare-table td.col-helios { text-align: center; background: rgba(11,26,53,.03); font-weight: 700; color: var(--navy); }
    .check { color: var(--green); font-size: 1.1rem; font-weight: 900; }
    .cross { color: #e53e3e; font-size: 1rem; }
    .compare-table tr:last-child td { border-bottom: none; }
    .testimonials { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .testimonial { background: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(11,26,53,.07); }
    .stars { color: var(--yellow); font-size: 1rem; margin-bottom: 12px; letter-spacing: 2px; }
    .testimonial p { font-size: .82rem; color: var(--mid); line-height: 1.65; margin-bottom: 16px; font-style: italic; }
    .testimonial-author { display: flex; align-items: center; gap: 10px; }
    .avatar { width: 38px; height: 38px; border-radius: 50%; background: var(--navy); color: var(--yellow); font-weight: 900; font-size: .9rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .author-name { font-size: .8rem; font-weight: 800; color: var(--navy); }
    .author-city { font-size: .72rem; color: var(--mid); }
    .faq-list { max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; gap: 12px; }
    .faq-item { background: #fff; border-radius: 12px; box-shadow: 0 3px 14px rgba(11,26,53,.06); overflow: hidden; }
    .faq-q { padding: 18px 20px; font-size: .88rem; font-weight: 800; color: var(--navy); cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 12px; user-select: none; }
    .faq-q::after { content: '+'; font-size: 1.2rem; font-weight: 900; color: var(--yellow); flex-shrink: 0; transition: transform .2s; }
    .faq-item.open .faq-q::after { transform: rotate(45deg); }
    .faq-a { display: none; padding: 0 20px 18px; font-size: .82rem; color: var(--mid); line-height: 1.7; }
    .faq-item.open .faq-a { display: block; }
    .internal-links { padding: 40px 24px; background: #fff; border-top: 1px solid #e2e8f0; }
    .internal-links-inner { max-width: 1060px; margin: 0 auto; }
    .internal-links h3 { font-size: .9rem; font-weight: 800; color: var(--navy); margin-bottom: 16px; }
    .links-grid { display: flex; flex-wrap: wrap; gap: 10px; }
    .links-grid a { background: var(--gray); color: var(--navy); padding: 7px 16px; border-radius: 50px; font-size: .76rem; font-weight: 700; text-decoration: none; border: 1px solid #e2e8f0; transition: background .2s, color .2s; }
    .links-grid a:hover { background: var(--navy); color: var(--yellow); }
    .cta-final { background: linear-gradient(135deg, #00122b 0%, #0b1a35 100%); padding: 80px 24px; text-align: center; }
    .cta-final h2 { font-size: clamp(1.5rem, 4vw, 2.4rem); font-weight: 900; color: #fff; margin-bottom: 12px; }
    .cta-final h2 em { color: var(--yellow); font-style: normal; }
    .cta-final p { color: var(--light); font-size: .92rem; margin-bottom: 32px; }
    .lp-footer { background: #060f20; padding: 24px; text-align: center; }
    .lp-footer p { color: rgba(255,255,255,.3); font-size: .72rem; line-height: 1.7; }
    .lp-footer a { color: rgba(255,255,255,.4); text-decoration: none; }
    .lp-footer a:hover { color: var(--yellow); }
    .fab { position: fixed; bottom: 20px; right: 20px; z-index: 999; background: var(--green); color: #fff; width: 58px; height: 58px; border-radius: 50%; display: flex; align-items: center; justify-content: center; text-decoration: none; box-shadow: 0 6px 24px rgba(37,211,102,.5); transition: transform .2s; }
    .fab:hover { transform: scale(1.1); }
    .fab-pulse { position: absolute; width: 100%; height: 100%; border-radius: 50%; background: var(--green); opacity: .4; animation: pulse 2s ease-out infinite; }
    @keyframes pulse { 0% { transform: scale(1); opacity: .4; } 100% { transform: scale(1.7); opacity: 0; } }
    @media (max-width: 768px) { .sitenav-links { display: none; } .topbar span { display: none; } .topbar, .sitenav { padding: 0 16px; } .steps { grid-template-columns: 1fr; max-width: 400px; margin: 0 auto; } .services-grid { grid-template-columns: repeat(2, 1fr); } .benefits-grid { grid-template-columns: 1fr; } .testimonials { grid-template-columns: 1fr; } .compare-table th, .compare-table td { padding: 10px 12px; font-size: .78rem; } }
    @media (max-width: 480px) { .hero { padding: 48px 20px 56px; } .btn-wpp { padding: 14px 28px; font-size: .92rem; width: 100%; justify-content: center; } .services-grid { grid-template-columns: 1fr; } }
  `;
}

const SERVICOS = [
  { icon: '🔒', title: 'Roubo e Furto', desc: 'Indenização pelo valor da tabela FIPE em caso de roubo ou furto do seu veículo.' },
  { icon: '💥', title: 'Colisão', desc: 'Proteção contra batidas, capotamentos e danos causados por terceiros.' },
  { icon: '🚗', title: 'Guincho 24h', desc: 'Guincho incluído para remoção do veículo em caso de sinistro ou pane.' },
  { icon: '🔑', title: 'Chaveiro', desc: 'Serviço de chaveiro 24h para situações de chave quebrada, esquecida ou perdida.' },
  { icon: '⛽', title: 'Pane Seca', desc: 'Socorro em caso de falta de combustível no meio do caminho.' },
  { icon: '🛞', title: 'Troca de Pneu', desc: 'Assistência para troca de pneu furado, onde quer que você esteja.' },
  { icon: '🪟', title: 'Cobertura de Vidros', desc: 'Para-brisa, vidros laterais e traseiros cobertos sem custo adicional.' },
  { icon: '🏗️', title: 'Funilaria e Lanternagem', desc: 'Reparo de lataria e pintura em casos de colisão cobertos pelo plano.' },
  { icon: '📱', title: 'Carro Reserva', desc: 'Veículo reserva disponível enquanto o seu está em reparo.' },
  { icon: '📡', title: 'Rastreamento', desc: 'Monitoramento 24h para localização e recuperação rápida do veículo.' },
];

const FAQS_GENERICOS = [
  { q: 'O que significa "sem carência"?', a: 'Significa que sua proteção começa a valer no mesmo dia da adesão. Diferente do seguro tradicional, que tem um período de espera antes de você poder acionar a cobertura. Com a Hélios, você está protegido desde o 1° dia.' },
  { q: 'Qual o valor da mensalidade?', a: 'O valor varia de acordo com o modelo, ano, cidade e tipo de uso do seu veículo. É possível ter cobertura completa por muito menos do que um seguro tradicional. Fale conosco pelo WhatsApp para receber sua cotação gratuita em minutos.' },
  { q: 'Preciso fazer vistoria do veículo?', a: 'Não. O processo na Hélios é 100% digital e sem necessidade de vistoria prévia. Você assina tudo pelo celular e sua proteção fica ativa no mesmo dia, sem burocracia.' },
  { q: 'A cobertura é válida em todo o Brasil?', a: 'Sim! A proteção veicular da Hélios é válida em todo o território nacional. Seja em viagem para outro estado, em outra cidade ou no seu trajeto diário, você está sempre protegido.' },
  { q: 'Como funciona em caso de roubo ou colisão?', a: 'Basta entrar em contato com nossa central de assistência 24h pelo WhatsApp ou telefone. Nossa equipe orienta todos os passos. O processo é simples, transparente e sem burocracia excessiva.' },
];

function schemas(cidade, pageUrl, title, faqs) {
  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'InsuranceAgency',
    name: 'Hélios Proteção Veicular',
    description: `Proteção veicular em ${cidade.nome} MG. Cobertura completa contra roubo, furto e colisão sem carência.`,
    url: pageUrl,
    telephone: '+5531993728984',
    areaServed: { '@type': 'City', name: cidade.nome, addressRegion: cidade.estado },
    address: { '@type': 'PostalAddress', addressLocality: cidade.nome, addressRegion: cidade.estado, addressCountry: 'BR' },
    sameAs: ['https://wa.me/5531993728984'],
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '08:00', closes: '18:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '08:00', closes: '12:00' },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: BASE_URL + '/' },
      { '@type': 'ListItem', position: 2, name: 'Proteção Veicular MG', item: BASE_URL + '/belo-horizonte/' },
      { '@type': 'ListItem', position: 3, name: cidade.nome, item: pageUrl },
    ],
  };

  return [localBusiness, faqSchema, breadcrumb]
    .map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
    .join('\n  ');
}

function gerarHTML(cidade) {
  const slug      = `protecao-veicular-${cidade.slug}-mg`;
  const pageUrl   = `${BASE_URL}/${slug}/`;
  const title     = `Proteção Veicular em ${cidade.nome} MG sem Carência | Hélios`;
  const desc      = `Proteção veicular em ${cidade.nome} com cobertura completa contra roubo, furto e colisão. Sem carência, sem vistoria, ativo no 1° dia. Hélios atende toda a ${cidade.regiao}. Cotação grátis.`;
  const faqs      = [...FAQS_GENERICOS, { q: cidade.faqEspecifico.q, a: cidade.faqEspecifico.a }];
  const schemasHtml = schemas(cidade, pageUrl, title, faqs);
  const wppMsg    = encodeURIComponent(`Olá! Vi o anúncio e quero fazer uma cotação para meu veículo em ${cidade.nome}.`);
  const bairrosStr = cidade.bairros.slice(0, 8).join(', ');

  const servicosHtml = SERVICOS.map(s => `
            <div class="service-card">
              <div class="service-icon">${s.icon}</div>
              <h4>${s.title}</h4>
              <p>${s.desc}</p>
            </div>`).join('');

  const faqsHtml = faqs.map(f => `
          <div class="faq-item">
            <div class="faq-q">${f.q}</div>
            <div class="faq-a">${f.a}</div>
          </div>`).join('');

  const testemunhosHtml = cidade.testimonials.map(t => `
          <div class="testimonial">
            <div class="stars">★★★★★</div>
            <p>"${t.text}"</p>
            <div class="testimonial-author">
              <div class="avatar">${t.initials}</div>
              <div>
                <div class="author-name">${t.name}</div>
                <div class="author-city">${t.bairro}</div>
              </div>
            </div>
          </div>`).join('');

  const cidadesVizinhas = cidade.vizinhas
    .map(v => {
      const cv = todasCidades.find(c => c.nome === v);
      if (!cv) return '';
      return `<a href="${BASE_URL}/protecao-veicular-${cv.slug}-mg/">Proteção Veicular em ${v}</a>`;
    })
    .filter(Boolean)
    .join('\n            ');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="canonical" href="${pageUrl}">
  <meta name="description" content="${desc}">
  <meta name="robots" content="index, follow">
  <link rel="icon" href="/assets/images/helios_ico.png" type="image/png">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:image" content="${BASE_URL}/assets/images/og-helios.jpg">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="Hélios Proteção Veicular">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${desc}">

  <!-- Schemas -->
  ${schemasHtml}

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>${css()}</style>
</head>
<body>

<div class="topbar">
  <a href="${WPP_ATEND}" target="_blank" rel="noopener noreferrer">📞 (31) 99372-8984</a>
  <span>Atendimento: Seg–Sex 8h–18h | Sáb 8h–12h</span>
</div>

<nav class="sitenav">
  <a class="sitenav-logo" href="${BASE_URL}">
    <img src="/assets/images/logo-helios.png" alt="Hélios Proteção Veicular" loading="lazy">
  </a>
  <div class="sitenav-links">
    <a href="${BASE_URL}">Home</a>
    <a href="${BASE_URL}/#sobre">Quem Somos</a>
    <a href="${BASE_URL}/servicos">Serviços</a>
    <a href="${BASE_URL}/blog/">Blog</a>
    <a href="${BASE_URL}/#contato">Contato</a>
  </div>
  <a class="sitenav-cta" href="${WPP_ATEND}" target="_blank" rel="noopener noreferrer">Faça sua Cotação</a>
</nav>

<nav class="breadcrumbs" aria-label="Breadcrumb">
  <ol class="breadcrumb-list">
    <li><a href="${BASE_URL}/">Início</a></li>
    <li><a href="${BASE_URL}/belo-horizonte/">Proteção Veicular MG</a></li>
    <li aria-current="page">Proteção Veicular ${cidade.nome}</li>
  </ol>
</nav>

<section class="hero">
  <div class="hero-inner">
    <div class="hero-badge">
      <span>COBERTURA COMPLETA</span> Proteção ativa desde o 1° dia
    </div>
    <h1>Proteção Veicular em ${cidade.nome}<br><em>sem carência e sem burocracia</em></h1>
    <p class="hero-sub">${cidade.heroSub}</p>
    <div class="hero-cta">
      <a class="btn-wpp" href="${WPP_COT}?text=${wppMsg}" target="_blank" rel="noopener noreferrer">
        ${SVG_WPP}
        Quero minha cotação grátis
      </a>
      <span class="hero-note">✓ Resposta em minutos · ✓ Sem compromisso</span>
    </div>
    <div class="hero-stats">
      <div class="hero-stat"><span class="num">+1.000</span><span class="lbl">Associados</span></div>
      <div class="hero-stat"><span class="num">24h</span><span class="lbl">Assistência</span></div>
      <div class="hero-stat"><span class="num">0 dias</span><span class="lbl">de carência</span></div>
      <div class="hero-stat"><span class="num">100%</span><span class="lbl">Tabela FIPE</span></div>
    </div>
  </div>
</section>

<div class="urgency-bar">
  <p>⚠️ <strong>${cidade.urgency}</strong> Não espere acontecer para se proteger.</p>
</div>

<section class="section">
  <div class="container">
    <div class="section-head">
      <span class="label">Simples assim</span>
      <h2>Como funciona a proteção Hélios</h2>
      <p>Sem letras miúdas, sem pegadinhas. Proteção real em 3 passos.</p>
    </div>
    <div class="steps">
      <div class="step-card" data-step="1">
        <div class="step-icon">💬</div>
        <h3>Fale conosco</h3>
        <p>Entre em contato pelo WhatsApp. Nosso time responde em minutos e faz a cotação do seu veículo gratuitamente.</p>
      </div>
      <div class="step-card" data-step="2">
        <div class="step-icon">📋</div>
        <h3>Assine e ative</h3>
        <p>Processo 100% digital. Sem burocracia, sem vistoria demorada. Sua proteção fica ativa no mesmo dia.</p>
      </div>
      <div class="step-card" data-step="3">
        <div class="step-icon">🛡️</div>
        <h3>Dirija tranquilo</h3>
        <p>Com a Hélios você conta com assistência 24h e cobertura completa onde estiver em ${cidade.nome} e em todo o Brasil.</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <div class="section-head">
      <span class="label">Cobertura completa</span>
      <h2>Tudo que seu veículo precisa em ${cidade.nome}</h2>
      <p>Proteção real com cobertura completa pelo preço que cabe no seu bolso.</p>
    </div>
    <div class="services-grid">
      ${servicosHtml}
    </div>
    <div style="text-align:center; margin-top: 32px;">
      <a class="btn-wpp" href="${WPP_COT}?text=${wppMsg}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;">
        ${SVG_WPP_SM}
        Solicite uma simulação sem compromisso
      </a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head">
      <span class="label">Onde atuamos</span>
      <h2>Atendemos toda ${cidade.nome}</h2>
      <p>Nossa cobertura alcança todos os bairros de ${cidade.nome} e toda a ${cidade.regiao}.</p>
    </div>
    <div class="benefits-grid">
      <div class="benefit">
        <div class="benefit-icon">📍</div>
        <div>
          <h4>Bairros em ${cidade.nome}</h4>
          <p>${bairrosStr} e todos os demais bairros de ${cidade.nome}.</p>
        </div>
      </div>
      <div class="benefit">
        <div class="benefit-icon">🗺️</div>
        <div>
          <h4>Cidades próximas</h4>
          <p>Também atendemos ${cidade.vizinhas.join(', ')} e toda a ${cidade.regiao}.</p>
        </div>
      </div>
      <div class="benefit">
        <div class="benefit-icon">🇧🇷</div>
        <div>
          <h4>Cobertura nacional</h4>
          <p>Sua proteção é válida em todo o território brasileiro, não apenas em ${cidade.nome}.</p>
        </div>
      </div>
      <div class="benefit">
        <div class="benefit-icon">⏰</div>
        <div>
          <h4>Ativo no 1° dia</h4>
          <p>Sem período de carência. Sua proteção começa a valer no mesmo dia da adesão à associação.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<div class="cta-mid">
  <div class="container">
    <h2>Proteja seu veículo em ${cidade.nome} <em>agora mesmo</em></h2>
    <p>Fale agora com um consultor e receba sua cotação em minutos — sem compromisso.</p>
    <a class="btn-wpp" href="${WPP_COT}?text=${wppMsg}" target="_blank" rel="noopener noreferrer">
      ${SVG_WPP}
      Fale agora com um consultor
    </a>
  </div>
</div>

<section class="section">
  <div class="container">
    <div class="section-head">
      <span class="label">Compare</span>
      <h2>Hélios vs Seguro Tradicional em ${cidade.nome}</h2>
      <p>Veja por que cada vez mais motoristas de ${cidade.nome} escolheram a proteção veicular.</p>
    </div>
    <table class="compare-table">
      <thead>
        <tr>
          <th></th>
          <th class="col-seg">Seguro Tradicional</th>
          <th class="col-helios">Hélios Proteção</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Sem carência</td><td class="col-seg"><span class="cross">✗</span> Período de carência</td><td class="col-helios"><span class="check">✓</span> Ativo no 1° dia</td></tr>
        <tr><td>Preço acessível</td><td class="col-seg"><span class="cross">✗</span> Alto custo mensal</td><td class="col-helios"><span class="check">✓</span> Até 70% mais barato</td></tr>
        <tr><td>Sem vistoria prévia</td><td class="col-seg"><span class="cross">✗</span> Vistoria obrigatória</td><td class="col-helios"><span class="check">✓</span> Sem vistoria</td></tr>
        <tr><td>Assistência 24h</td><td class="col-seg"><span class="check">✓</span> Inclusa</td><td class="col-helios"><span class="check">✓</span> Inclusa</td></tr>
        <tr><td>Carro reserva</td><td class="col-seg"><span class="cross">✗</span> Geralmente extra</td><td class="col-helios"><span class="check">✓</span> Incluso</td></tr>
        <tr><td>Processo 100% digital</td><td class="col-seg"><span class="cross">✗</span> Muita burocracia</td><td class="col-helios"><span class="check">✓</span> Tudo pelo celular</td></tr>
      </tbody>
    </table>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <div class="section-head">
      <span class="label">Quem já protegeu</span>
      <h2>O que nossos associados de ${cidade.nome} dizem</h2>
    </div>
    <div class="testimonials">
      ${testemunhosHtml}
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head">
      <span class="label">Dúvidas frequentes</span>
      <h2>Perguntas e respostas sobre proteção veicular em ${cidade.nome}</h2>
    </div>
    <div class="faq-list">
      ${faqsHtml}
    </div>
  </div>
</section>

${cidadesVizinhas ? `
<div class="internal-links">
  <div class="internal-links-inner">
    <h3>Cidades próximas a ${cidade.nome}:</h3>
    <div class="links-grid">
      ${cidadesVizinhas}
    </div>
  </div>
</div>` : ''}

<section class="cta-final">
  <div class="container">
    <h2>Seu veículo protegido em ${cidade.nome} <em>ainda hoje</em></h2>
    <p>Sem carência · Sem vistoria · Processo 100% digital · Resposta em minutos</p>
    <a class="btn-wpp" href="${WPP_COT}?text=${wppMsg}" target="_blank" rel="noopener noreferrer">
      ${SVG_WPP}
      Fazer cotação gratuita agora
    </a>
  </div>
</section>

<footer class="lp-footer">
  <p>
    © 2025 Hélios Proteção Veicular — ${cidade.nome} e região<br>
    <a href="tel:08004900190">0800 490 0190</a> · <a href="tel:+5531972593075">(31) 97259-3075</a><br>
    <a href="${BASE_URL}">Site principal</a> · <a href="${BASE_URL}/privacidade.html">Política de Privacidade</a>
  </p>
</footer>

<a class="fab" href="${WPP_COT}?text=${wppMsg}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
  <div class="fab-pulse"></div>
  <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
</a>

<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NSQ5MDW2');</script>

<script>
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a[href*="wa.me"]');
    if (link) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'whatsapp_click', whatsapp_page: window.location.pathname });
    }
  });
</script>
</body>
</html>`;
}

function main() {
  const newUrls = [];
  let total = 0;

  for (const cidade of lote2) {
    const slug  = `protecao-veicular-${cidade.slug}-mg`;
    const dir   = path.join(SITE_ROOT, slug);
    const file  = path.join(dir, 'index.html');

    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, gerarHTML(cidade), 'utf8');
    newUrls.push(`${BASE_URL}/${slug}/`);
    total++;
    process.stdout.write(`\r  Gerado: ${total}/${lote2.length} — ${cidade.nome}...`);
  }

  console.log(`\n\n✅ ${total} páginas HTML geradas!\n`);

  // Regenerar sitemap-cidades.xml com lote1 + lote2
  const lote1 = require('./data/cidades-mg.json');
  const todasCidadesSitemap = [...lote1, ...lote2];
  const urlsXml = todasCidadesSitemap.map(c => `
  <url>
    <loc>${BASE_URL}/protecao-veicular-${c.slug}-mg/</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`).join('');

  const sitemapCidades = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;

  fs.writeFileSync(path.join(SITE_ROOT, 'sitemap-cidades.xml'), sitemapCidades, 'utf8');
  console.log(`  📄 sitemap-cidades.xml atualizado (${todasCidadesSitemap.length} cidades = ${todasCidadesSitemap.length} URLs)`);

  console.log(`\n  Novas URLs geradas (${newUrls.length}):`);
  newUrls.forEach(u => console.log(`    ${u}`));

  console.log(`\n  ✅ Execute agora: node indexar-lote2.js para indexar no Google\n`);
}

main();
