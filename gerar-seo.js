'use strict';
const fs   = require('fs');
const path = require('path');

// ── CONFIG ──────────────────────────────────────────────────────────────────
const SITE_ROOT = path.join(__dirname, 'novo-site');
const BASE_URL  = 'https://heliosprotecaoveicular.com.br';
const WPP_COT   = 'https://wa.me/5531992395859';
const WPP_ATEND = 'https://wa.me/5531993728984';
const TODAY     = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';

const SVG_WPP = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

const SVG_WPP_SM = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

// ── DADOS ───────────────────────────────────────────────────────────────────
const cidades = require('./data/cidades-mg-todas.json');

// ── TIPOS DE PÁGINA ─────────────────────────────────────────────────────────
const TIPOS = [
  {
    id: 'cidade',
    slugFn:     c => `protecao-veicular-${c.slug}-mg`,
    titleFn:    c => `Proteção Veicular em ${c.nome} MG | Hélios`,
    descFn:     c => `Proteção veicular em ${c.nome} sem carência: cobertura contra roubo, furto e colisão. 100% digital. Cotação grátis.`,
    h1Fn:       c => `Proteção Veicular em ${c.nome}`,
    emphFn:     c => `simples, digital e sem burocracia`,
    heroSubFn:  c => `Proteção veicular em ${c.nome} sem complicação: fale no WhatsApp, assine pelo celular e sua cobertura começa no mesmo dia — sem carência, sem papelada, sem burocracia.`,
    canonicalFn: (c, slug) => null,
    sitemap:    'cidades',
    badge:      'COBERTURA COMPLETA',
    seoNoteFn:  null,
    seoLabel:   'Proteção Veicular',
    faqExtra:   (c) => ({ q: c.faqEspecifico.q, a: c.faqEspecifico.a }),
    priority:   '0.9',
  },
  {
    id: 'uber',
    slugFn:     c => `protecao-veicular-uber-${c.slug}-mg`,
    titleFn:    c => `Proteção Veicular Uber em ${c.nome} | Hélios`,
    descFn:     c => `Motorista Uber em ${c.nome}? Proteção veicular sem carência para uso profissional. Ativo no 1° dia. Cotação grátis.`,
    h1Fn:       c => `Proteção Veicular para Uber em ${c.nome}`,
    emphFn:     c => `uso profissional sem carência`,
    heroSubFn:  c => `Motorista Uber em ${c.nome}? A Hélios oferece proteção veicular específica para quem usa o veículo profissionalmente — sem carência, sem burocracia, ativo no 1° dia.`,
    canonicalFn: (c, slug) => null,
    sitemap:    'apps',
    badge:      'PARA MOTORISTAS UBER',
    seoNoteFn:  c => `Buscou por <em>"seguro Uber em ${c.nome}"</em>? A solução correta é a <strong>proteção veicular</strong> — oferecida por associações como a Hélios, com cobertura completa para uso profissional, custo até 70% menor e sem as exigências do seguro tradicional.`,
    seoLabel:   'Proteção Veicular Uber',
    faqExtra:   () => ({ q: 'A proteção cobre meu veículo enquanto estou trabalhando como Uber?', a: 'Sim! A proteção veicular da Hélios cobre seu veículo durante o uso profissional como Uber, incluindo corridas, espera e deslocamentos. Nossa cobertura é válida 24h por dia, todos os dias da semana.' }),
    priority:   '0.8',
  },
  {
    id: '99',
    slugFn:     c => `protecao-veicular-99-${c.slug}-mg`,
    titleFn:    c => `Proteção Veicular 99 em ${c.nome} | Hélios`,
    descFn:     c => `Motorista 99 em ${c.nome}? Proteção veicular sem carência para uso profissional. Cotação grátis.`,
    h1Fn:       c => `Proteção Veicular para Motoristas 99 em ${c.nome}`,
    emphFn:     c => `cobertura para uso profissional`,
    heroSubFn:  c => `Motorista 99 em ${c.nome}? A Hélios protege seu veículo com cobertura completa para uso profissional, sem carência e com ativação imediata.`,
    canonicalFn: (c, slug) => `${BASE_URL}/protecao-veicular-uber-${c.slug}-mg/`,
    sitemap:    'apps',
    badge:      'PARA MOTORISTAS 99',
    seoNoteFn:  c => `Buscou por <em>"seguro 99 em ${c.nome}"</em>? A solução ideal é a <strong>proteção veicular</strong> — mais acessível e sem a burocracia do seguro tradicional, com cobertura específica para uso profissional.`,
    seoLabel:   'Proteção Veicular 99',
    faqExtra:   () => ({ q: 'A proteção cobre meu veículo enquanto estou trabalhando como motorista 99?', a: 'Sim! A cobertura da Hélios é válida durante o uso profissional como motorista 99, incluindo corridas, períodos de espera e deslocamentos. Cobertura nacional, 24h por dia.' }),
    priority:   '0.7',
  },
  {
    id: 'indriver',
    slugFn:     c => `protecao-veicular-indriver-${c.slug}-mg`,
    titleFn:    c => `Proteção Veicular InDriver em ${c.nome} | Hélios`,
    descFn:     c => `Motorista InDriver em ${c.nome}? Proteção veicular sem carência para uso profissional. Ativo no 1° dia. Cotação grátis.`,
    h1Fn:       c => `Proteção Veicular para InDriver em ${c.nome}`,
    emphFn:     c => `uso profissional sem carência`,
    heroSubFn:  c => `Motorista InDriver em ${c.nome}? A Hélios oferece a proteção certa para quem usa o veículo profissionalmente, sem carência e com ativação no mesmo dia.`,
    canonicalFn: (c, slug) => `${BASE_URL}/protecao-veicular-uber-${c.slug}-mg/`,
    sitemap:    'apps',
    badge:      'PARA MOTORISTAS INDRIVER',
    seoNoteFn:  c => `Buscou por <em>"seguro InDriver em ${c.nome}"</em>? A Hélios oferece <strong>proteção veicular</strong> — a alternativa correta para motoristas de aplicativo, com cobertura completa e sem a burocracia do seguro tradicional.`,
    seoLabel:   'Proteção Veicular InDriver',
    faqExtra:   () => ({ q: 'A proteção cobre meu veículo enquanto estou trabalhando pelo InDriver?', a: 'Sim! Nossa proteção veicular cobre o uso profissional no InDriver. A cobertura é válida durante corridas, períodos de espera e deslocamentos. 24h por dia, em todo o Brasil.' }),
    priority:   '0.7',
  },
  {
    id: 'motorista-app',
    slugFn:     c => `protecao-veicular-motorista-aplicativo-${c.slug}-mg`,
    titleFn:    c => `Proteção para Motorista de App em ${c.nome} | Hélios`,
    descFn:     c => `Motorista de app em ${c.nome}? Uber, 99, InDriver. Proteção completa sem carência para uso profissional. Cotação grátis.`,
    h1Fn:       c => `Proteção Veicular para Motorista de Aplicativo em ${c.nome}`,
    emphFn:     c => `Uber · 99 · InDriver`,
    heroSubFn:  c => `Seja Uber, 99 ou InDriver em ${c.nome}, a Hélios tem a proteção veicular ideal para quem usa o carro como ferramenta de trabalho — sem carência, ativo no 1° dia.`,
    canonicalFn: (c, slug) => null,
    sitemap:    'apps',
    badge:      'MOTORISTAS DE APLICATIVO',
    seoNoteFn:  c => `Buscou por <em>"seguro para motorista de aplicativo em ${c.nome}"</em>? Conheça a <strong>proteção veicular</strong> — solução oferecida por associações como a Hélios, com cobertura completa para uso profissional, custo acessível e sem carência.`,
    seoLabel:   'Proteção para Motoristas de App',
    faqExtra:   () => ({ q: 'A Hélios cobre motoristas de Uber, 99 e InDriver ao mesmo tempo?', a: 'Sim! A proteção da Hélios cobre o uso profissional em qualquer plataforma de transporte por aplicativo — Uber, 99, InDriver e outros. O importante é o uso do seu veículo, não qual aplicativo você usa.' }),
    priority:   '0.8',
  },
  {
    id: 'moto',
    slugFn:     c => `protecao-veicular-moto-${c.slug}-mg`,
    titleFn:    c => `Proteção Veicular Moto em ${c.nome} MG | Hélios`,
    descFn:     c => `Proteção para moto em ${c.nome}: roubo, furto e colisão sem carência. 100% digital. Cotação grátis.`,
    h1Fn:       c => `Proteção Veicular para Moto em ${c.nome}`,
    emphFn:     c => `sua moto protegida sem carência`,
    heroSubFn:  c => `Proteja sua moto em ${c.nome} com cobertura completa contra roubo, furto e colisão. Sem carência, processo 100% digital, ativo no mesmo dia da adesão.`,
    canonicalFn: (c, slug) => null,
    sitemap:    'motos',
    badge:      'PROTEÇÃO PARA MOTO',
    seoNoteFn:  c => `Buscou por <em>"seguro moto em ${c.nome}"</em>? A <strong>proteção veicular para moto</strong> da Hélios é a alternativa ideal — cobertura completa por muito menos do que o seguro tradicional, sem carência e com assistência 24h incluída.`,
    seoLabel:   'Proteção para Moto',
    faqExtra:   () => ({ q: 'A Hélios protege motos de delivery e motoboys?', a: 'Sim! Protegemos motocicletas de uso pessoal, profissional (motoboys, delivery) e recreativo. Atendemos scooters, motos de rua, trail e todos os tipos de motocicleta. Solicite sua cotação pelo WhatsApp.' }),
    priority:   '0.8',
  },
  {
    id: 'motocicleta',
    slugFn:     c => `protecao-veicular-motocicleta-${c.slug}-mg`,
    titleFn:    c => `Proteção para Motocicleta em ${c.nome} | Hélios`,
    descFn:     c => `Proteção veicular para motocicleta em ${c.nome}. Sem carência, 100% digital. Cotação grátis.`,
    h1Fn:       c => `Proteção Veicular para Motocicleta em ${c.nome}`,
    emphFn:     c => `cobertura completa sem carência`,
    heroSubFn:  c => `Sua motocicleta merece proteção completa em ${c.nome}. Sem carência, sem burocracia, ativo no mesmo dia da adesão.`,
    canonicalFn: (c, slug) => `${BASE_URL}/protecao-veicular-moto-${c.slug}-mg/`,
    sitemap:    'motos',
    badge:      'PROTEÇÃO PARA MOTOCICLETA',
    seoNoteFn:  null,
    seoLabel:   'Proteção para Motocicleta',
    faqExtra:   () => ({ q: 'Que tipos de motocicleta a Hélios protege?', a: 'Protegemos todos os tipos: motos de rua, scooters, trail, naked, esportivas e motos de entrega. A cobertura é personalizada para o modelo e uso do seu veículo. Solicite sua cotação.' }),
    priority:   '0.7',
  },
  {
    id: 'assistencia',
    slugFn:     c => `assistencia-24-horas-${c.slug}-mg`,
    titleFn:    c => `Assistência 24h em ${c.nome} MG | Hélios`,
    descFn:     c => `Assistência 24h em ${c.nome}: guincho, chaveiro, pane seca e socorro mecânico incluídos. Cotação grátis.`,
    h1Fn:       c => `Assistência 24 Horas em ${c.nome}`,
    emphFn:     c => `guincho, chaveiro e socorro a qualquer hora`,
    heroSubFn:  c => `Com a Hélios em ${c.nome}, você tem assistência 24h real incluída na sua proteção: guincho, chaveiro, pane seca, troca de pneu e muito mais — sem custo adicional.`,
    canonicalFn: (c, slug) => null,
    sitemap:    'servicos',
    badge:      'ASSISTÊNCIA 24 HORAS',
    seoNoteFn:  null,
    seoLabel:   'Assistência 24h',
    faqExtra:   () => ({ q: 'Qual o tempo médio de atendimento da assistência 24h?', a: 'Nossa central de assistência funciona 24 horas por dia, todos os dias do ano. O tempo de atendimento varia conforme a localização e disponibilidade na sua região, mas nos comprometemos com agilidade e eficiência em todos os acionamentos.' }),
    priority:   '0.8',
  },
  {
    id: 'guincho',
    slugFn:     c => `guincho-24-horas-${c.slug}-mg`,
    titleFn:    c => `Guincho 24h em ${c.nome} MG | Hélios`,
    descFn:     c => `Guincho 24h em ${c.nome} incluso na proteção Hélios. Atendimento rápido via WhatsApp. Sem custo adicional.`,
    h1Fn:       c => `Guincho 24 Horas em ${c.nome}`,
    emphFn:     c => `incluído na proteção veicular Hélios`,
    heroSubFn:  c => `Precisou de guincho em ${c.nome}? A Hélios atende 24h com guincho já incluído na proteção veicular. Solicite agora pelo WhatsApp.`,
    canonicalFn: (c, slug) => `${BASE_URL}/protecao-veicular-${c.slug}-mg/`,
    sitemap:    'servicos',
    badge:      'GUINCHO 24 HORAS',
    seoNoteFn:  null,
    seoLabel:   'Guincho 24h',
    faqExtra:   () => ({ q: 'O guincho 24h está incluso na proteção veicular?', a: 'Sim! O serviço de guincho 24h é incluso na proteção veicular Hélios, sem custo adicional. Em caso de colisão, pane ou roubo, basta acionar nossa central de assistência pelo WhatsApp ou telefone.' }),
    priority:   '0.7',
  },
  {
    id: 'reboque',
    slugFn:     c => `reboque-24-horas-${c.slug}-mg`,
    titleFn:    c => `Reboque 24h em ${c.nome} MG | Hélios`,
    descFn:     c => `Reboque 24h em ${c.nome} incluso na proteção Hélios. Atendimento imediato. Cotação grátis.`,
    h1Fn:       c => `Reboque 24 Horas em ${c.nome}`,
    emphFn:     c => `incluído na proteção veicular`,
    heroSubFn:  c => `Precisa de reboque em ${c.nome}? Com a Hélios, o reboque já está incluído na sua proteção veicular. Atendimento 24h imediato, basta acionar pelo WhatsApp.`,
    canonicalFn: (c, slug) => `${BASE_URL}/protecao-veicular-${c.slug}-mg/`,
    sitemap:    'servicos',
    badge:      'REBOQUE 24 HORAS',
    seoNoteFn:  null,
    seoLabel:   'Reboque 24h',
    faqExtra:   () => ({ q: 'O serviço de reboque está incluso na minha proteção?', a: 'Sim! O reboque é parte da assistência 24h incluída na proteção veicular Hélios. Você não paga nada além da sua mensalidade para acionar o serviço de reboque em caso de necessidade.' }),
    priority:   '0.7',
  },

  // ── 25 NOVOS TIPOS ──────────────────────────────────────────────────────────

  // 11. DELIVERY (self-canonical)
  {
    id: 'delivery',
    slugFn:     c => `protecao-veicular-delivery-${c.slug}-mg`,
    titleFn:    c => `Proteção para Delivery em ${c.nome} | Hélios`,
    descFn:     c => `Motorista de delivery em ${c.nome}? iFood, Rappi, Loggi. Proteção veicular sem carência para uso profissional. Cotação grátis.`,
    h1Fn:       c => `Proteção Veicular para Delivery em ${c.nome}`,
    emphFn:     c => `iFood · Rappi · Loggi · sem carência`,
    heroSubFn:  c => `Trabalha com delivery em ${c.nome}? A Hélios oferece proteção veicular completa para motoristas de iFood, Rappi, Loggi e outros apps — sem carência, ativo no 1° dia.`,
    canonicalFn: () => null,
    sitemap:    'apps',
    badge:      'PARA DELIVERY',
    seoNoteFn:  c => `Buscou por <em>"seguro para delivery em ${c.nome}"</em>? A solução certa é a <strong>proteção veicular</strong> — mais acessível que o seguro tradicional e com cobertura para uso profissional no delivery.`,
    seoLabel:   'Proteção para Delivery',
    faqExtra:   () => ({ q: 'A proteção cobre meu veículo durante as entregas de delivery?', a: 'Sim! A proteção veicular da Hélios cobre seu veículo durante todo o uso profissional no delivery — seja iFood, Rappi, Loggi ou qualquer outro aplicativo. Cobertura 24h por dia, todos os dias.' }),
    priority:   '0.8',
  },

  // 12. TÁXI (self-canonical)
  {
    id: 'taxi',
    slugFn:     c => `protecao-veicular-taxi-${c.slug}-mg`,
    titleFn:    c => `Proteção Veicular Táxi em ${c.nome} | Hélios`,
    descFn:     c => `Taxista em ${c.nome}? Proteção veicular para táxi sem carência, uso profissional. 100% digital. Cotação grátis.`,
    h1Fn:       c => `Proteção Veicular para Táxi em ${c.nome}`,
    emphFn:     c => `cobertura para taxistas`,
    heroSubFn:  c => `Taxista em ${c.nome}? A Hélios oferece proteção veicular específica para táxi com cobertura completa, sem carência e ativação no mesmo dia da adesão.`,
    canonicalFn: () => null,
    sitemap:    'apps',
    badge:      'PARA TAXISTAS',
    seoNoteFn:  c => `Buscou por <em>"seguro táxi em ${c.nome}"</em>? A <strong>proteção veicular para táxi</strong> da Hélios é mais acessível que o seguro obrigatório, com cobertura completa para uso profissional e sem carência.`,
    seoLabel:   'Proteção para Táxi',
    faqExtra:   () => ({ q: 'A proteção veicular cobre táxi durante o trabalho?', a: 'Sim! A proteção da Hélios cobre seu táxi durante o uso profissional, incluindo corridas, pontos de táxi e deslocamentos. Cobertura válida 24h por dia, 7 dias por semana.' }),
    priority:   '0.8',
  },

  // 13. MOTOBOY (self-canonical)
  {
    id: 'motoboy',
    slugFn:     c => `protecao-veicular-motoboy-${c.slug}-mg`,
    titleFn:    c => `Proteção para Motoboy em ${c.nome} | Hélios`,
    descFn:     c => `Motoboy em ${c.nome}? Proteção veicular para moto sem carência no trabalho. Cotação grátis.`,
    h1Fn:       c => `Proteção Veicular para Motoboy em ${c.nome}`,
    emphFn:     c => `sua moto protegida no trabalho`,
    heroSubFn:  c => `Motoboy em ${c.nome}? A Hélios protege sua moto com cobertura completa para uso profissional — entregas, delivery e trabalho diário. Sem carência, ativo no 1° dia.`,
    canonicalFn: () => null,
    sitemap:    'motos',
    badge:      'PARA MOTOBOYS',
    seoNoteFn:  c => `Buscou por <em>"seguro motoboy em ${c.nome}"</em>? A <strong>proteção veicular para motoboy</strong> da Hélios é a alternativa certa — cobertura para uso profissional, sem carência e até 70% mais barata que o seguro tradicional.`,
    seoLabel:   'Proteção para Motoboy',
    faqExtra:   () => ({ q: 'A proteção cobre minha moto durante o trabalho como motoboy?', a: 'Sim! A Hélios oferece cobertura específica para motoboys e entregadores de moto. Sua moto fica protegida durante todas as entregas, 24h por dia. Protegemos iFood, Rappi, 99Food e outros apps.' }),
    priority:   '0.8',
  },

  // 14. CAMINHONETE (self-canonical)
  {
    id: 'caminhonete',
    slugFn:     c => `protecao-veicular-caminhonete-${c.slug}-mg`,
    titleFn:    c => `Proteção Veicular Caminhonete em ${c.nome} | Hélios`,
    descFn:     c => `Proteção para caminhonete e picape em ${c.nome}. Sem carência, 100% digital. Cotação grátis.`,
    h1Fn:       c => `Proteção Veicular para Caminhonete em ${c.nome}`,
    emphFn:     c => `caminhonete protegida sem carência`,
    heroSubFn:  c => `Tem uma caminhonete ou picape em ${c.nome}? A Hélios oferece proteção veicular completa — sem carência, processo 100% digital, ativo no 1° dia da adesão.`,
    canonicalFn: () => null,
    sitemap:    'veiculos',
    badge:      'PARA CAMINHONETES',
    seoNoteFn:  c => `Buscou por <em>"seguro caminhonete em ${c.nome}"</em>? A <strong>proteção veicular para caminhonete</strong> da Hélios cobre sua picape contra roubo, furto e colisão, com assistência 24h incluída.`,
    seoLabel:   'Proteção para Caminhonete',
    faqExtra:   () => ({ q: 'A Hélios protege caminhonetes e picapes?', a: 'Sim! Protegemos todos os modelos — Hilux, S10, Ranger, L200, Amarok, Frontier e outros. A cobertura inclui roubo, furto, colisão e assistência 24h.' }),
    priority:   '0.8',
  },

  // 15. VAN (self-canonical)
  {
    id: 'van',
    slugFn:     c => `protecao-veicular-van-${c.slug}-mg`,
    titleFn:    c => `Proteção para Van em ${c.nome} | Hélios`,
    descFn:     c => `Proteção para van em ${c.nome}: roubo, furto e colisão sem carência. Hélios protege sua van. Cotação grátis.`,
    h1Fn:       c => `Proteção Veicular para Van em ${c.nome}`,
    emphFn:     c => `van protegida sem carência`,
    heroSubFn:  c => `Tem uma van em ${c.nome}? A Hélios oferece proteção veicular completa para vans — transporte escolar, passageiros ou carga — sem carência e sem burocracia.`,
    canonicalFn: () => null,
    sitemap:    'veiculos',
    badge:      'PARA VANS',
    seoNoteFn:  c => `Buscou por <em>"seguro van em ${c.nome}"</em>? A <strong>proteção veicular para van</strong> da Hélios cobre sua van contra roubo, furto e colisão, com assistência 24h incluída.`,
    seoLabel:   'Proteção para Van',
    faqExtra:   () => ({ q: 'A Hélios protege vans de transporte escolar e passageiros?', a: 'Sim! Protegemos vans de transporte escolar, vans de passageiros, vans utilitárias e minivans. Nossa cobertura é adaptada ao uso do veículo. Consulte nossa equipe pelo WhatsApp.' }),
    priority:   '0.7',
  },

  // 16. FROTA (self-canonical)
  {
    id: 'frota',
    slugFn:     c => `protecao-veicular-frota-${c.slug}-mg`,
    titleFn:    c => `Proteção para Frota em ${c.nome} | Hélios`,
    descFn:     c => `Proteção para frota empresarial em ${c.nome}. Condições especiais para múltiplos veículos. Sem carência. Cotação grátis.`,
    h1Fn:       c => `Proteção Veicular para Frota em ${c.nome}`,
    emphFn:     c => `condições especiais para empresas`,
    heroSubFn:  c => `Tem frota de veículos em ${c.nome}? A Hélios oferece proteção veicular para frotas empresariais com condições especiais, cobertura completa e gestão simplificada.`,
    canonicalFn: () => null,
    sitemap:    'veiculos',
    badge:      'PROTEÇÃO PARA FROTA',
    seoNoteFn:  c => `Buscou por <em>"seguro frota em ${c.nome}"</em>? A <strong>proteção veicular para frota</strong> da Hélios oferece cobertura completa para a frota da sua empresa, com condições especiais para múltiplos veículos.`,
    seoLabel:   'Proteção para Frota',
    faqExtra:   () => ({ q: 'A Hélios oferece condições especiais para frotas?', a: 'Sim! Para frotas com 3 ou mais veículos, oferecemos condições especiais e gestão centralizada. Entre em contato pelo WhatsApp para uma cotação personalizada para a sua empresa.' }),
    priority:   '0.7',
  },

  // 17. PCD (self-canonical)
  {
    id: 'pcd',
    slugFn:     c => `protecao-veicular-pcd-${c.slug}-mg`,
    titleFn:    c => `Proteção para PCD em ${c.nome} | Hélios`,
    descFn:     c => `Proteção para PCD em ${c.nome}. Aceitamos veículos adaptados, sem carência. 100% digital. Cotação grátis.`,
    h1Fn:       c => `Proteção Veicular para PCD em ${c.nome}`,
    emphFn:     c => `aceitamos veículos adaptados`,
    heroSubFn:  c => `É PCD e tem veículo adaptado em ${c.nome}? A Hélios oferece proteção veicular completa sem carência e sem discriminação — protegemos veículos adaptados para pessoas com deficiência.`,
    canonicalFn: () => null,
    sitemap:    'segmentos',
    badge:      'PROTEÇÃO PARA PCD',
    seoNoteFn:  c => `Buscou por <em>"seguro PCD em ${c.nome}"</em>? A <strong>proteção veicular para PCD</strong> da Hélios é a alternativa ideal — sem carência, aceitamos veículos adaptados e oferecemos cobertura completa pelo preço justo.`,
    seoLabel:   'Proteção para PCD',
    faqExtra:   () => ({ q: 'A Hélios aceita veículos adaptados para PCD?', a: 'Sim! Protegemos veículos com adaptações para pessoas com deficiência — câmbio automático adaptado, hand controls, rampa para cadeirante e outros. Nossa proteção não discrimina o tipo de adaptação.' }),
    priority:   '0.7',
  },

  // 18. MULHER (self-canonical)
  {
    id: 'mulher',
    slugFn:     c => `protecao-veicular-mulher-${c.slug}-mg`,
    titleFn:    c => `Proteção para Mulher em ${c.nome} | Hélios`,
    descFn:     c => `Proteção para mulher em ${c.nome}. Sem carência, 100% digital. Cobertura contra roubo, furto e colisão. Cotação grátis.`,
    h1Fn:       c => `Proteção Veicular para Mulher em ${c.nome}`,
    emphFn:     c => `proteção feita para você`,
    heroSubFn:  c => `Mulher motorista em ${c.nome}? A Hélios oferece proteção veicular completa — sem carência, sem burocracia e com o atendimento humanizado que você merece.`,
    canonicalFn: () => null,
    sitemap:    'segmentos',
    badge:      'PARA MULHERES MOTORISTAS',
    seoNoteFn:  c => `Buscou por <em>"seguro carro mulher em ${c.nome}"</em>? A <strong>proteção veicular para mulher</strong> da Hélios oferece cobertura completa com preço justo — sem a burocracia do seguro tradicional.`,
    seoLabel:   'Proteção para Mulher',
    faqExtra:   () => ({ q: 'A proteção veicular da Hélios tem condições especiais para mulheres?', a: 'A Hélios oferece proteção veicular justa e acessível para todos os associados. Acreditamos que toda mulher merece proteção completa sem burocracia e sem pagar mais por isso.' }),
    priority:   '0.7',
  },

  // 19. JOVEM (self-canonical)
  {
    id: 'jovem',
    slugFn:     c => `protecao-veicular-jovem-${c.slug}-mg`,
    titleFn:    c => `Proteção para Jovem em ${c.nome} | Hélios`,
    descFn:     c => `Proteção para jovem em ${c.nome}. Sem restrição de idade, sem carência. Mais barato que seguro tradicional. Cotação grátis.`,
    h1Fn:       c => `Proteção Veicular para Jovem em ${c.nome}`,
    emphFn:     c => `sem restrição de idade`,
    heroSubFn:  c => `Jovem motorista em ${c.nome}? O seguro tradicional cobra muito mais para jovens. A Hélios não — sem restrição de idade, sem carência, com cobertura completa pelo preço justo.`,
    canonicalFn: () => null,
    sitemap:    'segmentos',
    badge:      'PARA JOVENS MOTORISTAS',
    seoNoteFn:  c => `Buscou por <em>"seguro jovem em ${c.nome}"</em>? A <strong>proteção veicular para jovem</strong> da Hélios não tem restrição de idade nem sobretaxa para motoristas novatos.`,
    seoLabel:   'Proteção para Jovem',
    faqExtra:   () => ({ q: 'A Hélios aceita jovens com menos de 25 anos?', a: 'Sim! Diferente do seguro tradicional que cobra até 200% a mais para jovens, a Hélios aceita motoristas de qualquer idade sem sobretaxa. Cobertura completa independente da sua experiência ao volante.' }),
    priority:   '0.7',
  },

  // 20. FINANCIADO (self-canonical)
  {
    id: 'financiado',
    slugFn:     c => `protecao-veicular-financiado-${c.slug}-mg`,
    titleFn:    c => `Carro Financiado em ${c.nome} | Hélios`,
    descFn:     c => `Proteção para carro financiado em ${c.nome}. Aceita alienação fiduciária, sem carência. 100% digital. Cotação grátis.`,
    h1Fn:       c => `Proteção Veicular para Carro Financiado em ${c.nome}`,
    emphFn:     c => `aceitamos veículo alienado`,
    heroSubFn:  c => `Seu carro está financiado em ${c.nome}? A Hélios aceita veículos com alienação fiduciária. Proteja seu carro mesmo financiado — sem carência e sem burocracia.`,
    canonicalFn: () => null,
    sitemap:    'segmentos',
    badge:      'CARRO FINANCIADO',
    seoNoteFn:  c => `Buscou por <em>"seguro carro financiado em ${c.nome}"</em>? A <strong>proteção veicular para financiado</strong> da Hélios aceita veículos alienados — sem a burocracia do seguro bancário e por um custo muito menor.`,
    seoLabel:   'Proteção para Financiado',
    faqExtra:   () => ({ q: 'A Hélios aceita veículos com alienação fiduciária (financiados)?', a: 'Sim! Aceitamos veículos financiados e alienados. A proteção veicular da Hélios não exige que o veículo seja quitado. Oferecemos cobertura completa para carros financiados em qualquer banco ou financeira.' }),
    priority:   '0.7',
  },

  // 21. SEM CARÊNCIA (self-canonical)
  {
    id: 'sem-carencia',
    slugFn:     c => `protecao-veicular-sem-carencia-${c.slug}-mg`,
    titleFn:    c => `Proteção sem Carência em ${c.nome} | Hélios`,
    descFn:     c => `Proteção sem carência em ${c.nome}. Ativa no 1° dia. Sem espera, cobertura completa desde o início. Cotação grátis.`,
    h1Fn:       c => `Proteção Veicular sem Carência em ${c.nome}`,
    emphFn:     c => `ativa no 1° dia, sem espera`,
    heroSubFn:  c => `Não quer esperar para ter proteção? Em ${c.nome}, a Hélios ativa sua proteção veicular no 1° dia — sem carência, sem período de espera, cobertura completa desde o primeiro momento.`,
    canonicalFn: () => null,
    sitemap:    'segmentos',
    badge:      'SEM CARÊNCIA',
    seoNoteFn:  c => `Buscou por <em>"proteção veicular sem carência em ${c.nome}"</em>? A Hélios é conhecida por ativar a cobertura no mesmo dia da adesão — sem nenhum período de carência ou espera.`,
    seoLabel:   'Proteção sem Carência',
    faqExtra:   () => ({ q: 'A proteção realmente começa no primeiro dia sem carência?', a: 'Sim! A Hélios ativa sua cobertura no mesmo dia da adesão, sem qualquer período de carência. Isso inclui cobertura contra roubo e furto — não apenas danos materiais.' }),
    priority:   '0.8',
  },

  // 22. ASSOCIAÇÃO VEICULAR (self-canonical)
  {
    id: 'associacao',
    slugFn:     c => `associacao-veicular-${c.slug}-mg`,
    titleFn:    c => `Associação Veicular em ${c.nome} | Hélios`,
    descFn:     c => `Associação veicular em ${c.nome} MG. Modelo mutualista de proteção sem carência. Hélios é a associação de confiança. Cotação grátis.`,
    h1Fn:       c => `Proteção Veicular em ${c.nome}`,
    emphFn:     c => `pelo modelo associativo e mutualista`,
    heroSubFn:  c => `Proteção veicular em ${c.nome} pelo modelo associativo. A Hélios é uma associação mutualista onde os membros protegem uns aos outros — cobertura completa por um custo muito menor que o seguro tradicional.`,
    canonicalFn: () => null,
    sitemap:    'segmentos',
    badge:      'PROTEÇÃO VEICULAR',
    seoNoteFn:  c => `Buscou por <em>"associação veicular em ${c.nome}"</em>? A Hélios oferece <strong>proteção veicular</strong> pelo modelo mutualista — diferente do seguro tradicional, com mais vantagens e custo menor.`,
    seoLabel:   'Proteção Veicular',
    faqExtra:   () => ({ q: 'Qual a diferença entre associação veicular e seguro?', a: 'Uma associação veicular como a Hélios funciona pelo sistema mutualista: os associados contribuem mensalmente e formam um fundo coletivo para cobrir sinistros. É mais acessível, com menos burocracia e sem as exigências das seguradoras.' }),
    priority:   '0.8',
  },

  // 23. CARRO RESERVA (self-canonical)
  {
    id: 'carro-reserva',
    slugFn:     c => `carro-reserva-${c.slug}-mg`,
    titleFn:    c => `Carro Reserva em ${c.nome} | Hélios`,
    descFn:     c => `Carro reserva em ${c.nome} incluso na proteção Hélios. Sem transporte em sinistro? A gente resolve. Cotação grátis.`,
    h1Fn:       c => `Carro Reserva em ${c.nome}`,
    emphFn:     c => `incluído na sua proteção veicular`,
    heroSubFn:  c => `Ficou sem carro em ${c.nome}? Com a Hélios, o carro reserva está incluído na sua proteção veicular — você não fica sem transporte em caso de sinistro. Ativo 24h por dia.`,
    canonicalFn: () => null,
    sitemap:    'servicos',
    badge:      'CARRO RESERVA INCLUSO',
    seoNoteFn:  null,
    seoLabel:   'Carro Reserva',
    faqExtra:   () => ({ q: 'Como funciona o carro reserva da Hélios?', a: 'Em caso de sinistro (colisão, roubo ou furto), a Hélios disponibiliza um carro reserva enquanto seu veículo está em reparo ou processo de indenização. O serviço está incluído no plano, sem custo adicional.' }),
    priority:   '0.8',
  },

  // 24. PROTEÇÃO DE VIDROS (self-canonical)
  {
    id: 'vidros',
    slugFn:     c => `protecao-vidros-${c.slug}-mg`,
    titleFn:    c => `Proteção de Vidros em ${c.nome} | Hélios`,
    descFn:     c => `Proteção de vidros em ${c.nome}: para-brisa, vidros laterais e traseiro incluídos. Sem carência. Cotação grátis.`,
    h1Fn:       c => `Proteção de Vidros em ${c.nome}`,
    emphFn:     c => `para-brisa e vidros cobertos`,
    heroSubFn:  c => `Quebrou um vidro em ${c.nome}? A Hélios cobre a troca de para-brisa, vidros laterais e traseiro — sem carência e sem custo adicional na proteção completa.`,
    canonicalFn: () => null,
    sitemap:    'servicos',
    badge:      'PROTEÇÃO DE VIDROS',
    seoNoteFn:  null,
    seoLabel:   'Proteção de Vidros',
    faqExtra:   () => ({ q: 'A proteção de vidros cobre o para-brisa?', a: 'Sim! A proteção de vidros da Hélios cobre para-brisa, vidros laterais e traseiro. A troca é feita por parceiros credenciados em toda a rede nacional, sem custo adicional para o associado.' }),
    priority:   '0.7',
  },

  // 25. SOCORRO MECÂNICO (self-canonical)
  {
    id: 'socorro',
    slugFn:     c => `socorro-mecanico-24h-${c.slug}-mg`,
    titleFn:    c => `Socorro Mecânico 24h em ${c.nome} | Hélios`,
    descFn:     c => `Socorro 24h em ${c.nome}: pane seca, bateria, pneu e chaveiro incluídos. Proteção Hélios. Cotação grátis.`,
    h1Fn:       c => `Socorro Mecânico 24h em ${c.nome}`,
    emphFn:     c => `pane, bateria, pneu e chaveiro`,
    heroSubFn:  c => `Seu veículo deu pane em ${c.nome}? A Hélios oferece socorro mecânico 24h incluso — pane seca, bateria descarregada, troca de pneu e chaveiro. Basta acionar pelo WhatsApp.`,
    canonicalFn: () => null,
    sitemap:    'servicos',
    badge:      'SOCORRO MECÂNICO 24H',
    seoNoteFn:  null,
    seoLabel:   'Socorro Mecânico 24h',
    faqExtra:   () => ({ q: 'O socorro mecânico 24h está incluso na proteção?', a: 'Sim! O socorro mecânico é parte da assistência 24h incluída na proteção veicular Hélios. Cobre pane seca, bateria descarregada, troca de pneu, chaveiro e pequenos reparos na estrada. Sem custo adicional.' }),
    priority:   '0.8',
  },

  // 26–29. ALIASES DELIVERY
  {
    id: 'ifood',
    slugFn:     c => `protecao-veicular-ifood-${c.slug}-mg`,
    titleFn:    c => `Proteção para iFood em ${c.nome} | Hélios`,
    descFn:     c => `Entregador iFood em ${c.nome}? Proteção veicular completa sem carência para uso profissional. Cotação grátis.`,
    h1Fn:       c => `Proteção Veicular para Entregador iFood em ${c.nome}`,
    emphFn:     c => `cobertura para entregadores iFood`,
    heroSubFn:  c => `Entregador iFood em ${c.nome}? A Hélios oferece proteção veicular para quem usa o veículo no iFood — sem carência, ativo no 1° dia.`,
    canonicalFn: c => `${BASE_URL}/protecao-veicular-delivery-${c.slug}-mg/`,
    sitemap:    'apps',
    badge:      'PARA ENTREGADORES IFOOD',
    seoNoteFn:  c => `Buscou por <em>"seguro iFood em ${c.nome}"</em>? A solução certa é a <strong>proteção veicular para delivery</strong> — cobertura para uso profissional no iFood.`,
    seoLabel:   'Proteção para iFood',
    faqExtra:   () => ({ q: 'A proteção cobre meu veículo enquanto entrego pelo iFood?', a: 'Sim! A proteção da Hélios cobre uso profissional no iFood, seja de carro ou moto. Cobertura válida 24h.' }),
    priority:   '0.6',
  },
  {
    id: 'rappi',
    slugFn:     c => `protecao-veicular-rappi-${c.slug}-mg`,
    titleFn:    c => `Proteção para Rappi em ${c.nome} | Hélios`,
    descFn:     c => `Entregador Rappi em ${c.nome}? Proteção veicular sem carência para uso profissional. Cotação grátis.`,
    h1Fn:       c => `Proteção Veicular para Entregador Rappi em ${c.nome}`,
    emphFn:     c => `cobertura para entregadores Rappi`,
    heroSubFn:  c => `Entregador Rappi em ${c.nome}? A Hélios protege seu veículo durante o trabalho no Rappi — sem carência e com ativação imediata.`,
    canonicalFn: c => `${BASE_URL}/protecao-veicular-delivery-${c.slug}-mg/`,
    sitemap:    'apps',
    badge:      'PARA ENTREGADORES RAPPI',
    seoNoteFn:  c => `Buscou por <em>"seguro Rappi em ${c.nome}"</em>? A <strong>proteção veicular para delivery</strong> da Hélios é a solução certa para entregadores Rappi.`,
    seoLabel:   'Proteção para Rappi',
    faqExtra:   () => ({ q: 'A Hélios cobre meu veículo enquanto entrego pelo Rappi?', a: 'Sim! Cobertura válida para uso profissional no Rappi, 24h por dia.' }),
    priority:   '0.6',
  },
  {
    id: 'shopper',
    slugFn:     c => `protecao-veicular-shopper-${c.slug}-mg`,
    titleFn:    c => `Proteção para Shopper em ${c.nome} | Hélios`,
    descFn:     c => `Shopper e entregador em ${c.nome}? Proteção veicular sem carência para uso profissional. Cotação grátis.`,
    h1Fn:       c => `Proteção Veicular para Shopper em ${c.nome}`,
    emphFn:     c => `cobertura para shoppers`,
    heroSubFn:  c => `Trabalha como shopper em ${c.nome}? A Hélios oferece proteção veicular completa para uso profissional — sem carência, ativo no 1° dia.`,
    canonicalFn: c => `${BASE_URL}/protecao-veicular-delivery-${c.slug}-mg/`,
    sitemap:    'apps',
    badge:      'PARA SHOPPERS',
    seoNoteFn:  c => `Buscou por <em>"seguro shopper em ${c.nome}"</em>? A <strong>proteção veicular para shopper</strong> da Hélios é a solução para quem faz compras e entregas profissionalmente.`,
    seoLabel:   'Proteção para Shopper',
    faqExtra:   () => ({ q: 'A Hélios protege veículos de shoppers?', a: 'Sim! Protegemos veículos usados profissionalmente por shoppers, incluindo compras e entregas.' }),
    priority:   '0.6',
  },
  {
    id: 'loggi',
    slugFn:     c => `protecao-veicular-loggi-${c.slug}-mg`,
    titleFn:    c => `Proteção para Loggi em ${c.nome} | Hélios`,
    descFn:     c => `Entregador Loggi em ${c.nome}? Proteção veicular sem carência para uso profissional. Cotação grátis.`,
    h1Fn:       c => `Proteção Veicular para Entregador Loggi em ${c.nome}`,
    emphFn:     c => `cobertura para entregadores Loggi`,
    heroSubFn:  c => `Entregador Loggi em ${c.nome}? A Hélios protege seu veículo durante as entregas — sem carência e com ativação imediata.`,
    canonicalFn: c => `${BASE_URL}/protecao-veicular-delivery-${c.slug}-mg/`,
    sitemap:    'apps',
    badge:      'PARA ENTREGADORES LOGGI',
    seoNoteFn:  c => `Buscou por <em>"seguro Loggi em ${c.nome}"</em>? A <strong>proteção veicular para delivery</strong> da Hélios é a solução para entregadores Loggi.`,
    seoLabel:   'Proteção para Loggi',
    faqExtra:   () => ({ q: 'A Hélios cobre entregas pelo Loggi?', a: 'Sim! A proteção da Hélios cobre uso profissional no Loggi, para carro e moto.' }),
    priority:   '0.6',
  },

  // 30–31. ALIASES CAMINHONETE
  {
    id: 'suv',
    slugFn:     c => `protecao-veicular-suv-${c.slug}-mg`,
    titleFn:    c => `Proteção para SUV em ${c.nome} | Hélios`,
    descFn:     c => `Proteção veicular para SUV e 4x4 em ${c.nome}. Cobertura completa sem carência. Hélios protege seu SUV. Cotação grátis.`,
    h1Fn:       c => `Proteção Veicular para SUV em ${c.nome}`,
    emphFn:     c => `SUV e 4x4 protegidos`,
    heroSubFn:  c => `Tem um SUV ou 4x4 em ${c.nome}? A Hélios oferece proteção veicular completa — sem carência, cobertura total contra roubo, furto e colisão.`,
    canonicalFn: c => `${BASE_URL}/protecao-veicular-caminhonete-${c.slug}-mg/`,
    sitemap:    'veiculos',
    badge:      'PARA SUV E 4X4',
    seoNoteFn:  c => `Buscou por <em>"seguro SUV em ${c.nome}"</em>? A <strong>proteção veicular para SUV</strong> da Hélios cobre seu veículo completo.`,
    seoLabel:   'Proteção para SUV',
    faqExtra:   () => ({ q: 'A Hélios protege SUVs e veículos 4x4?', a: 'Sim! Protegemos todos os modelos de SUV — Jeep Compass, Renegade, Corolla Cross, HR-V, Tracker e outros. Cobertura completa sem carência.' }),
    priority:   '0.6',
  },
  {
    id: 'picape',
    slugFn:     c => `protecao-veicular-picape-${c.slug}-mg`,
    titleFn:    c => `Proteção para Picape em ${c.nome} | Hélios`,
    descFn:     c => `Proteção veicular para picape em ${c.nome}. Cobertura completa sem carência. Hilux, S10, Ranger e todas as picapes. Cotação grátis.`,
    h1Fn:       c => `Proteção Veicular para Picape em ${c.nome}`,
    emphFn:     c => `picape protegida sem carência`,
    heroSubFn:  c => `Tem uma picape em ${c.nome}? A Hélios protege sua picape com cobertura completa — Hilux, S10, Ranger, L200, Amarok e outras — sem carência e sem burocracia.`,
    canonicalFn: c => `${BASE_URL}/protecao-veicular-caminhonete-${c.slug}-mg/`,
    sitemap:    'veiculos',
    badge:      'PARA PICAPES',
    seoNoteFn:  c => `Buscou por <em>"seguro picape em ${c.nome}"</em>? A <strong>proteção veicular para picape</strong> da Hélios cobre sua caminhonete por muito menos que o seguro tradicional.`,
    seoLabel:   'Proteção para Picape',
    faqExtra:   () => ({ q: 'A Hélios protege picapes e caminhonetes?', a: 'Sim! Protegemos todos os modelos de picape: Hilux, S10, Ranger, L200, Amarok, Frontier e outras. Cobertura contra roubo, furto, colisão e assistência 24h incluída.' }),
    priority:   '0.6',
  },

  // 32–33. ALIASES ASSISTÊNCIA
  {
    id: 'pane-seca',
    slugFn:     c => `pane-seca-${c.slug}-mg`,
    titleFn:    c => `Pane Seca em ${c.nome} | Socorro 24h | Hélios`,
    descFn:     c => `Pane seca em ${c.nome}? Incluso na proteção veicular Hélios. Atendimento 24h imediato. Basta acionar pelo WhatsApp. Cotação grátis.`,
    h1Fn:       c => `Pane Seca em ${c.nome}`,
    emphFn:     c => `incluso na proteção veicular`,
    heroSubFn:  c => `Ficou sem combustível em ${c.nome}? A Hélios resolve pane seca 24h. Serviço incluído na proteção veicular, sem custo adicional.`,
    canonicalFn: c => `${BASE_URL}/assistencia-24-horas-${c.slug}-mg/`,
    sitemap:    'servicos',
    badge:      'PANE SECA 24H',
    seoNoteFn:  null,
    seoLabel:   'Pane Seca',
    faqExtra:   () => ({ q: 'O serviço de pane seca está incluso na proteção?', a: 'Sim! A pane seca é coberta pela assistência 24h incluída na proteção veicular Hélios, sem custo adicional.' }),
    priority:   '0.6',
  },
  {
    id: 'chaveiro',
    slugFn:     c => `chaveiro-24h-${c.slug}-mg`,
    titleFn:    c => `Chaveiro 24h em ${c.nome} | Hélios`,
    descFn:     c => `Chaveiro 24h em ${c.nome}. Incluso na proteção Hélios. Atendimento imediato por WhatsApp. Cotação grátis.`,
    h1Fn:       c => `Chaveiro 24h em ${c.nome}`,
    emphFn:     c => `incluso na proteção veicular`,
    heroSubFn:  c => `Quebrou a chave ou ficou trancado em ${c.nome}? A Hélios resolve com chaveiro 24h — serviço incluído na sua proteção veicular, sem custo extra.`,
    canonicalFn: c => `${BASE_URL}/assistencia-24-horas-${c.slug}-mg/`,
    sitemap:    'servicos',
    badge:      'CHAVEIRO 24H',
    seoNoteFn:  null,
    seoLabel:   'Chaveiro 24h',
    faqExtra:   () => ({ q: 'O chaveiro 24h está incluso na proteção?', a: 'Sim! O serviço de chaveiro é parte da assistência 24h incluída na proteção veicular Hélios. Atendemos situações de chave quebrada, esquecida no carro ou porta travada.' }),
    priority:   '0.6',
  },

  // 34–35. ALIAS RASTREAMENTO + COTAÇÃO
  {
    id: 'rastreamento',
    slugFn:     c => `rastreamento-veicular-${c.slug}-mg`,
    titleFn:    c => `Rastreamento Veicular em ${c.nome} | Hélios`,
    descFn:     c => `Rastreamento veicular em ${c.nome} incluso na proteção Hélios. Monitore seu veículo em tempo real. Sem custo adicional. Cotação grátis.`,
    h1Fn:       c => `Rastreamento Veicular em ${c.nome}`,
    emphFn:     c => `rastreamento incluso na proteção`,
    heroSubFn:  c => `Sabia que a proteção veicular Hélios inclui rastreamento em ${c.nome}? Monitore seu veículo em tempo real — sem custo adicional, incluso no seu plano.`,
    canonicalFn: c => `${BASE_URL}/protecao-veicular-${c.slug}-mg/`,
    sitemap:    'servicos',
    badge:      'RASTREAMENTO INCLUSO',
    seoNoteFn:  null,
    seoLabel:   'Rastreamento Veicular',
    faqExtra:   () => ({ q: 'O rastreamento veicular está incluso na proteção?', a: 'Sim! O rastreamento veicular está disponível nos planos da Hélios. Consulte nossa equipe pelo WhatsApp para saber mais sobre a disponibilidade do serviço na sua região.' }),
    priority:   '0.6',
  },
  {
    id: 'cotacao',
    slugFn:     c => `cotacao-protecao-veicular-${c.slug}-mg`,
    titleFn:    c => `Cotação Veicular em ${c.nome} | Hélios`,
    descFn:     c => `Cotação de proteção veicular em ${c.nome}. Grátis, rápido e sem compromisso. Hélios responde em minutos. Cotação grátis.`,
    h1Fn:       c => `Cotação de Proteção Veicular em ${c.nome}`,
    emphFn:     c => `grátis e sem compromisso`,
    heroSubFn:  c => `Quer cotar proteção veicular em ${c.nome}? A Hélios faz sua cotação grátis em minutos pelo WhatsApp — sem compromisso, sem burocracia.`,
    canonicalFn: c => `${BASE_URL}/protecao-veicular-${c.slug}-mg/`,
    sitemap:    'segmentos',
    badge:      'COTAÇÃO GRÁTIS',
    seoNoteFn:  c => `Buscou por <em>"cotação proteção veicular ${c.nome}"</em>? Solicite agora pelo WhatsApp e receba sua cotação personalizada em minutos.`,
    seoLabel:   'Cotação Proteção Veicular',
    faqExtra:   () => ({ q: 'Como faço a cotação da proteção veicular?', a: 'É simples! Basta enviar uma mensagem pelo WhatsApp com o modelo do seu veículo, ano e cidade. Nossa equipe responde em minutos com os valores e coberturas disponíveis para o seu perfil.' }),
    priority:   '0.7',
  },
];

// ── CSS ─────────────────────────────────────────────────────────────────────
function css() {
  return `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --navy:   #0b1a35;
      --navy2:  #0d2250;
      --yellow: #f5c400;
      --yellow2:#e6b800;
      --green:  #25d366;
      --green2: #1ebe5d;
      --white:  #ffffff;
      --gray:   #f4f6f9;
      --text:   #1a2332;
      --mid:    #4a5568;
      --light:  rgba(255,255,255,.8);
    }
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
    .seo-note { background: #eff6ff; border: 1px solid #bfdbfe; border-left: 4px solid #3b82f6; padding: 16px 24px; margin: 0; }
    .seo-note-inner { max-width: 1060px; margin: 0 auto; font-size: .82rem; color: #1e40af; line-height: 1.6; }
    .seo-note-inner strong { font-weight: 800; }
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
    @media (max-width: 768px) {
      .sitenav-links { display: none; }
      .topbar span { display: none; }
      .topbar, .sitenav { padding: 0 16px; }
      .steps { grid-template-columns: 1fr; max-width: 400px; margin: 0 auto; }
      .services-grid { grid-template-columns: repeat(2, 1fr); }
      .benefits-grid { grid-template-columns: 1fr; }
      .testimonials { grid-template-columns: 1fr; }
      .compare-table th, .compare-table td { padding: 10px 12px; font-size: .78rem; }
    }
    @media (max-width: 480px) {
      .hero { padding: 48px 20px 56px; }
      .btn-wpp { padding: 14px 28px; font-size: .92rem; width: 100%; justify-content: center; }
      .services-grid { grid-template-columns: 1fr; }
    }
  `;
}

// ── SERVIÇOS POR TIPO ────────────────────────────────────────────────────────
function servicos(tipoId) {
  const base = [
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

  const moto = [
    { icon: '🔒', title: 'Roubo e Furto de Moto', desc: 'Indenização pela tabela FIPE em caso de roubo ou furto da sua motocicleta.' },
    { icon: '💥', title: 'Colisão', desc: 'Proteção para a sua moto em caso de batidas e acidentes.' },
    { icon: '🚗', title: 'Guincho 24h', desc: 'Guincho específico para moto, disponível a qualquer hora.' },
    { icon: '🔑', title: 'Chaveiro', desc: 'Socorro imediato em caso de chave quebrada ou perdida.' },
    { icon: '⛽', title: 'Pane Seca', desc: 'Assistência em caso de falta de combustível durante o trajeto.' },
    { icon: '🛞', title: 'Troca de Pneu', desc: 'Serviço de troca de pneu para sua moto, quando precisar.' },
    { icon: '🪟', title: 'Cobertura de Vidros', desc: 'Proteção para carenagens e viseira do capacete (conforme plano).' },
    { icon: '🏍️', title: 'Moto Reserva', desc: 'Moto substituta disponível enquanto sua motocicleta está em reparo.' },
    { icon: '📡', title: 'Rastreamento', desc: 'Rastreamento 24h para recuperação rápida da sua moto.' },
    { icon: '🛡️', title: 'Cobertura Nacional', desc: 'Proteção válida em todo o Brasil, inclusive em viagens longas.' },
  ];

  const assistencia = [
    { icon: '🚗', title: 'Guincho 24h', desc: 'Guincho para remoção do veículo em qualquer situação, a qualquer hora.' },
    { icon: '🔑', title: 'Chaveiro 24h', desc: 'Serviço de chaveiro imediato para emergências com chave e fechadura.' },
    { icon: '⛽', title: 'Pane Seca', desc: 'Abastecimento de emergência quando o combustível acaba no meio do caminho.' },
    { icon: '🛞', title: 'Troca de Pneu', desc: 'Assistência completa para troca de pneu furado, onde quer que esteja.' },
    { icon: '🔧', title: 'Socorro Mecânico', desc: 'Mecânico no local para reparos simples que permitam seguir viagem.' },
    { icon: '🪟', title: 'Substituição de Vidros', desc: 'Para-brisa e vidros cobertos sem custo adicional.' },
    { icon: '📱', title: 'Carro Reserva', desc: 'Veículo reserva disponível enquanto o seu está em manutenção.' },
    { icon: '🏥', title: 'Táxi Emergência', desc: 'Táxi ou app custeado para deslocamento em casos de imobilização do veículo.' },
    { icon: '🏨', title: 'Hotel em Viagem', desc: 'Custeio de hospedagem em caso de acidente longe de casa (conforme plano).' },
    { icon: '📡', title: 'Central 24/7', desc: 'Central de atendimento disponível 24 horas, 7 dias por semana, 365 dias no ano.' },
  ];

  if (['moto', 'motocicleta'].includes(tipoId)) return moto;
  if (['assistencia', 'guincho', 'reboque'].includes(tipoId)) return assistencia;
  return base;
}

// ── FAQs GENÉRICOS ───────────────────────────────────────────────────────────
const faqsGenericos = [
  { q: 'O que significa "sem carência"?', a: 'Significa que sua proteção começa a valer no mesmo dia da adesão. Diferente do seguro tradicional, que tem um período de espera antes de você poder acionar a cobertura. Com a Hélios, você está protegido desde o 1° dia.' },
  { q: 'Qual o valor da mensalidade?', a: 'O valor varia de acordo com o modelo, ano, cidade e tipo de uso do seu veículo. É possível ter cobertura completa por muito menos do que um seguro tradicional. Fale conosco pelo WhatsApp para receber sua cotação gratuita em minutos.' },
  { q: 'Como é feita a vistoria do veículo?', a: 'Nosso processo é 100% digital e simplificado. A vistoria é feita por você mesmo, em vídeo, de onde estiver — sem agendamento, sem deslocamento, em poucos minutos. Simples assim.' },
  { q: 'A cobertura é válida em todo o Brasil?', a: 'Sim! A proteção veicular da Hélios é válida em todo o território nacional. Seja em viagem para outro estado, em outra cidade ou no seu trajeto diário, você está sempre protegido.' },
  { q: 'Como funciona em caso de roubo ou colisão?', a: 'Basta entrar em contato com nossa central de assistência 24h pelo WhatsApp ou telefone. Nossa equipe orienta todos os passos. O processo é simples, transparente e sem burocracia excessiva.' },
];

// ── SCHEMA JSON-LD ───────────────────────────────────────────────────────────
function schemas(cidade, tipo, pageUrl, title, faqs) {
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
      { '@type': 'ListItem', position: 3, name: cidade.nome, item: BASE_URL + `/${cidade.slug}/` },
      { '@type': 'ListItem', position: 4, name: tipo.seoLabel, item: pageUrl },
    ],
  };

  return [localBusiness, faqSchema, breadcrumb].map(s =>
    `<script type="application/ld+json">${JSON.stringify(s)}</script>`
  ).join('\n  ');
}

// ── TEMPLATE HTML ────────────────────────────────────────────────────────────
function gerarHTML(cidade, tipo) {
  const slug       = tipo.slugFn(cidade);
  const pageUrl    = `${BASE_URL}/${slug}/`;
  const canonical  = tipo.canonicalFn(cidade, slug) || pageUrl;
  const title      = tipo.titleFn(cidade);
  const desc       = tipo.descFn(cidade);
  const h1         = tipo.h1Fn(cidade);
  const emph       = tipo.emphFn(cidade);
  const heroSub    = tipo.heroSubFn(cidade);
  const seoNote    = tipo.seoNoteFn ? tipo.seoNoteFn(cidade) : null;
  const svcs       = servicos(tipo.id);
  const extra      = tipo.faqExtra(cidade);
  const faqCidade  = {
    q: `Como funciona a proteção veicular em ${cidade.nome}?`,
    a: `A proteção veicular em ${cidade.nome} funciona pelo modelo associativo mutualista: você se torna associado da Hélios, contribui mensalmente e tem cobertura completa contra roubo, furto e colisão. O processo é 100% digital — cotação pelo WhatsApp, assinatura digital e vistoria rápida por vídeo de onde você estiver. Sem carência, sem papelada, sem precisar sair de casa.`,
  };
  const faqs       = [faqCidade, ...faqsGenericos, extra];
  const schemasHtml = schemas(cidade, tipo, pageUrl, title, faqs);

  const wppMsg     = encodeURIComponent(`Olá! Vi o anúncio e quero fazer uma cotação para meu veículo em ${cidade.nome}.`);

  // links internos: outras páginas desta cidade + cidades vizinhas
  const outrasPaginas = TIPOS
    .filter(t => t.id !== tipo.id && !tipo.canonicalFn(cidade, slug) && !t.canonicalFn(cidade, slug))
    .slice(0, 5)
    .map(t => `<a href="${BASE_URL}/${t.slugFn(cidade)}/">${t.seoLabel} em ${cidade.nome}</a>`)
    .join('\n            ');

  const cidadesVizinhas = cidade.vizinhas
    .map(v => {
      const cv = cidades.find(c => c.nome === v);
      if (!cv) return '';
      return `<a href="${BASE_URL}/protecao-veicular-${cv.slug}-mg/">Proteção Veicular em ${v}</a>`;
    })
    .filter(Boolean)
    .join('\n            ');

  const servicosHtml = svcs.map(s => `
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

  const bairrosStr = cidade.bairros.slice(0, 8).join(', ');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="canonical" href="${canonical}">
  <meta name="description" content="${desc}">
  <meta name="robots" content="${canonical === pageUrl ? 'index, follow' : 'noindex, follow'}">
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

<!-- TOPBAR -->
<div class="topbar">
  <a href="${WPP_ATEND}" target="_blank" rel="noopener noreferrer">📞 (31) 99372-8984</a>
  <span>Atendimento: Seg–Sex 8h–18h | Sáb 8h–12h</span>
</div>

<!-- NAVBAR -->
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

<!-- BREADCRUMBS -->
<nav class="breadcrumbs" aria-label="Breadcrumb">
  <ol class="breadcrumb-list">
    <li><a href="${BASE_URL}/">Início</a></li>
    <li><a href="${BASE_URL}/belo-horizonte/">Proteção Veicular MG</a></li>
    <li><a href="${BASE_URL}/${cidade.slug}/">${cidade.nome}</a></li>
    <li aria-current="page">${tipo.seoLabel}</li>
  </ol>
</nav>

<!-- NOTA ESTRATÉGICA (aparece só em páginas com intenção de busca por "seguro") -->
${seoNote ? `<div class="seo-note"><div class="seo-note-inner">💡 ${seoNote}</div></div>` : ''}

<!-- HERO -->
<section class="hero">
  <div class="hero-inner">
    <div class="hero-badge">
      <span>${tipo.badge}</span> Proteção ativa desde o 1° dia
    </div>
    <h1>${h1}<br><em>${emph}</em></h1>
    <p class="hero-sub">${heroSub}</p>
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

<!-- URGÊNCIA -->
<div class="urgency-bar">
  <p>⚠️ <strong>${cidade.urgency}</strong> Não espere acontecer para se proteger.</p>
</div>

<!-- COMO FUNCIONA -->
<section class="section">
  <div class="container">
    <div class="section-head">
      <span class="label">Simples assim</span>
      <h2>Como funciona a proteção veicular em ${cidade.nome}</h2>
      <p>Sem letras miúdas, sem pegadinhas. Proteção real em 3 passos para quem está em ${cidade.nome}.</p>
    </div>
    <div class="steps">
      <div class="step-card" data-step="1">
        <div class="step-icon">💬</div>
        <h3>Fale conosco</h3>
        <p>Entre em contato pelo WhatsApp. Nosso time responde em minutos — seja você de ${cidade.bairros.slice(0,3).join(', ')} ou qualquer bairro de ${cidade.nome}.</p>
      </div>
      <div class="step-card" data-step="2">
        <div class="step-icon">📋</div>
        <h3>Assine e ative</h3>
        <p>Processo 100% digital. Sem burocracia, sem papelada. Vistoria rápida por vídeo, de onde você estiver.</p>
      </div>
      <div class="step-card" data-step="3">
        <div class="step-icon">🛡️</div>
        <h3>Dirija tranquilo</h3>
        <p>Com a Hélios você conta com assistência 24h e cobertura completa onde estiver em ${cidade.nome} e em todo o Brasil.</p>
      </div>
    </div>
  </div>
</section>

<!-- SERVIÇOS -->
<section class="section section-alt">
  <div class="container">
    <div class="section-head">
      <span class="label">Cobertura completa</span>
      <h2>${tipo.id === 'assistencia' || tipo.id === 'guincho' || tipo.id === 'reboque' ? 'Serviços de assistência incluídos' : tipo.id === 'moto' || tipo.id === 'motocicleta' ? 'Cobertura completa para sua moto' : 'Tudo que seu veículo precisa'}</h2>
      <p>A proteção veicular em ${cidade.nome} oferece cobertura completa pelo preço que cabe no seu bolso.</p>
    </div>
    <div class="services-grid">
      ${servicosHtml}
    </div>
    <p style="text-align:center; margin-top: 24px; font-size: .82rem; color: var(--mid); max-width: 680px; margin-left: auto; margin-right: auto;">
      💡 Cobertura disponível para associados de ${cidade.bairros.slice(0,3).join(', ')} e todos os demais bairros de ${cidade.nome} — sem sair de casa, pelo WhatsApp.
    </p>
    <div style="text-align:center; margin-top: 32px;">
      <a class="btn-wpp" href="${WPP_COT}?text=${wppMsg}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;">
        ${SVG_WPP_SM}
        Solicite uma simulação sem compromisso
      </a>
    </div>
  </div>
</section>

<!-- BAIRROS ATENDIDOS -->
<section class="section">
  <div class="container">
    <div class="section-head">
      <span class="label">Onde atuamos</span>
      <h2>Atendemos toda ${cidade.nome}</h2>
      <p>A proteção veicular em ${cidade.nome} cobre todos os bairros e toda a ${cidade.regiao}.</p>
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
    <div style="margin-top: 32px; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(11,26,53,.1);">
      <iframe
        src="https://maps.google.com/maps?q=${encodeURIComponent(cidade.nome + ', MG')}&output=embed"
        width="100%" height="350" style="border:0; display:block;"
        loading="lazy"
        title="Mapa de ${cidade.nome}, MG"
        referrerpolicy="no-referrer-when-downgrade">
      </iframe>
    </div>
  </div>
</section>

<!-- CTA MEIO -->
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

<!-- COMPARAÇÃO -->
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
        <tr>
          <td>Sem carência</td>
          <td class="col-seg"><span class="cross">✗</span> Período de carência</td>
          <td class="col-helios"><span class="check">✓</span> Ativo no 1° dia</td>
        </tr>
        <tr>
          <td>Preço acessível</td>
          <td class="col-seg"><span class="cross">✗</span> Alto custo mensal</td>
          <td class="col-helios"><span class="check">✓</span> Até 70% mais barato</td>
        </tr>
        <tr>
          <td>Vistoria</td>
          <td class="col-seg"><span class="cross">✗</span> Vistoria presencial obrigatória</td>
          <td class="col-helios"><span class="check">✓</span> Vistoria rápida por vídeo</td>
        </tr>
        <tr>
          <td>Assistência 24h</td>
          <td class="col-seg"><span class="check">✓</span> Inclusa</td>
          <td class="col-helios"><span class="check">✓</span> Inclusa</td>
        </tr>
        <tr>
          <td>Carro reserva</td>
          <td class="col-seg"><span class="cross">✗</span> Geralmente extra</td>
          <td class="col-helios"><span class="check">✓</span> Incluso</td>
        </tr>
        <tr>
          <td>Processo 100% digital</td>
          <td class="col-seg"><span class="cross">✗</span> Muita burocracia</td>
          <td class="col-helios"><span class="check">✓</span> Tudo pelo celular</td>
        </tr>
        <tr>
          <td>Atendimento local</td>
          <td class="col-seg"><span class="cross">✗</span> Requer agente presencial</td>
          <td class="col-helios"><span class="check">✓</span> Atende ${cidade.bairros[0]} e toda ${cidade.nome} via WhatsApp</td>
        </tr>
      </tbody>
    </table>
  </div>
</section>

<!-- DEPOIMENTOS -->
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

<!-- FAQ -->
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

<!-- LINKS INTERNOS -->
<div class="internal-links">
  <div class="internal-links-inner">
    <h3>Mais proteção veicular em ${cidade.nome}:</h3>
    <div class="links-grid">
      ${outrasPaginas}
    </div>
    ${cidadesVizinhas ? `<h3 style="margin-top:16px;">Cidades próximas:</h3><div class="links-grid">${cidadesVizinhas}</div>` : ''}
  </div>
</div>

<!-- CTA FINAL -->
<section class="cta-final">
  <div class="container">
    <h2>Seu veículo protegido em ${cidade.nome} <em>ainda hoje</em></h2>
    <p>Sem carência · Processo 100% digital · Sem papelada · Resposta em minutos</p>
    <a class="btn-wpp" href="${WPP_COT}?text=${wppMsg}" target="_blank" rel="noopener noreferrer">
      ${SVG_WPP}
      Fazer cotação gratuita agora
    </a>
  </div>
</section>

<!-- FOOTER -->
<footer class="lp-footer">
  <p>
    © 2025 Hélios Proteção Veicular — ${cidade.nome} e região<br>
    <a href="tel:08004900190">0800 490 0190</a> · <a href="tel:+5531972593075">(31) 97259-3075</a><br>
    <a href="${BASE_URL}">Site principal</a> · <a href="${BASE_URL}/privacidade.html">Política de Privacidade</a>
  </p>
</footer>

<!-- FAB WHATSAPP -->
<a class="fab" href="${WPP_COT}?text=${wppMsg}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
  <div class="fab-pulse"></div>
  <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
</a>

<!-- GTM / Analytics -->
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

// ── GERADOR DE SITEMAPS ──────────────────────────────────────────────────────
function gerarSitemap(nome, urls) {
  const urlsXml = urls.map(({ loc, priority }) => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;
}

function gerarSitemapIndex(sitemaps) {
  const items = sitemaps.map(s => `
  <sitemap>
    <loc>${BASE_URL}/${s}</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</sitemapindex>`;
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
function main() {
  const sitemapUrls = { cidades: [], apps: [], motos: [], veiculos: [], segmentos: [], servicos: [] };
  let total = 0;

  for (const cidade of cidades) {
    for (const tipo of TIPOS) {
      const slug    = tipo.slugFn(cidade);
      const dir     = path.join(SITE_ROOT, slug);
      const file    = path.join(dir, 'index.html');
      const pageUrl = `${BASE_URL}/${slug}/`;

      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(file, gerarHTML(cidade, tipo), 'utf8');

      // apenas páginas com self-canonical entram no sitemap indexável
      if (!tipo.canonicalFn(cidade, slug)) {
        sitemapUrls[tipo.sitemap].push({ loc: pageUrl, priority: tipo.priority });
      }

      total++;
      process.stdout.write(`\r  Gerado: ${total} páginas...`);
    }
  }

  console.log(`\n\n✅ ${total} páginas HTML geradas!\n`);

  // Sitemaps
  const sitemapFiles = {
    'sitemap-cidades.xml':        sitemapUrls.cidades,
    'sitemap-motoristas-app.xml': sitemapUrls.apps,
    'sitemap-motos.xml':          sitemapUrls.motos,
    'sitemap-veiculos.xml':       sitemapUrls.veiculos,
    'sitemap-segmentos.xml':      sitemapUrls.segmentos,
    'sitemap-servicos.xml':       sitemapUrls.servicos,
  };

  for (const [filename, urls] of Object.entries(sitemapFiles)) {
    fs.writeFileSync(path.join(SITE_ROOT, filename), gerarSitemap(filename, urls), 'utf8');
    console.log(`  📄 ${filename} (${urls.length} URLs)`);
  }

  // Sitemap index
  const allSitemaps = ['sitemap.xml', ...Object.keys(sitemapFiles)];
  fs.writeFileSync(
    path.join(SITE_ROOT, 'sitemap-index.xml'),
    gerarSitemapIndex(allSitemaps),
    'utf8'
  );
  console.log(`  📑 sitemap-index.xml (${allSitemaps.length} sitemaps)`);

  const totalIndexed = Object.values(sitemapUrls).reduce((a, b) => a + b.length, 0);
  console.log(`\n  Total indexável: ${totalIndexed} páginas`);
  console.log(`  Total gerado: ${total} páginas (inclui variações com canonical)\n`);
}

main();
