import { cidades } from "@/data/cidades"
import { notFound } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export async function generateStaticParams() {
  return cidades.map((c) => ({ cidade: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ cidade: string }> }) {
  const { cidade: cidadeSlug } = await params
  const cidade = cidades.find((c) => c.slug === cidadeSlug)
  if (!cidade) return {}

  const url = `https://heliosprotecaoveicular.com.br/${cidade.slug}/`
  const title = `Proteção Veicular em ${cidade.nome} | Hélios Proteção Veicular`
  const description = `Proteção completa para seu veículo em ${cidade.nome} e ${cidade.regiao}. Cobertura contra roubo, furto e colisão. Confie na Hélios Proteção Veicular.`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Hélios Proteção Veicular",
      locale: "pt_BR",
      type: "website",
    },
  }
}

const whatsapp = "https://wa.me/5531993728984"

const coberturas = [
  { icon: "🔒", titulo: "Roubo e Furto", desc: "Indenização de 100% da Tabela FIPE em caso de roubo ou furto do veículo." },
  { icon: "🔧", titulo: "Assistência 24h", desc: "Chaveiro, troca de pneu, pane seca e elétrica — suporte completo a qualquer hora." },
  { icon: "🚗", titulo: "Carro Reserva", desc: "Veículo reserva disponível enquanto o seu está em reparo. Sua rotina não para." },
  { icon: "🪟", titulo: "Troca de Vidros", desc: "Cobertura para para-brisa, janelas laterais e vidro traseiro danificados." },
  { icon: "🚛", titulo: "Reboque 24h", desc: "Serviço de reboque disponível 24h em qualquer lugar do Brasil." },
  { icon: "🎨", titulo: "Lanternagem e Pintura", desc: "Reparos completos em funilaria e pintura em caso de colisão, sem custo adicional." },
  { icon: "📍", titulo: "Rastreamento", desc: "Tecnologia de rastreamento para localização e recuperação rápida do veículo." },
  { icon: "🌩️", titulo: "Fenômenos da Natureza", desc: "Cobertura contra danos causados por alagamentos, granizo, vendaval e outros." },
  { icon: "🎁", titulo: "Clube de Benefícios", desc: "Descontos exclusivos, telemedicina e vantagens para todos os associados Hélios." },
]

const faqBase = (nome: string) => [
  {
    pergunta: `A Hélios atende em ${nome}?`,
    resposta: `Sim! A Hélios Proteção Veicular atende em ${nome} e em toda a região da Grande BH. Nossa equipe está pronta para te atender.`,
  },
  {
    pergunta: "Qual a diferença entre proteção veicular e seguro?",
    resposta: "A proteção veicular é oferecida por associações e costuma ter mensalidades mais acessíveis que o seguro tradicional, com coberturas similares.",
  },
  {
    pergunta: "Como aciono a proteção em caso de sinistro?",
    resposta: "Basta ligar para nossa central 24h ou acessar nosso aplicativo. Nossa equipe te orienta em todos os passos do processo.",
  },
  {
    pergunta: "Existe carência para usar a proteção?",
    resposta: "Sim, existe um período de carência inicial após a contratação. Consulte nossos planos para saber os detalhes de cada cobertura.",
  },
  {
    pergunta: `Quais bairros de ${nome} são atendidos?`,
    resposta: `Atendemos todos os bairros de ${nome} e municípios vizinhos. Entre em contato para confirmar a cobertura na sua região.`,
  },
]

export default async function PaginaCidade({ params }: { params: Promise<{ cidade: string }> }) {
  const { cidade: cidadeSlug } = await params
  const cidade = cidades.find((c) => c.slug === cidadeSlug)
  if (!cidade) notFound()

  const faq = faqBase(cidade.nome)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Hélios Proteção Veicular",
    description: `Proteção veicular completa em ${cidade.nome}. Cobertura contra roubo, furto, colisão e assistência 24h.`,
    url: `https://heliosprotecaoveicular.com.br/${cidade.slug}/`,
    telephone: "+5531993728984",
    areaServed: cidade.nome,
    address: {
      "@type": "PostalAddress",
      addressLocality: cidade.nome,
      addressRegion: "MG",
      addressCountry: "BR",
    },
    sameAs: ["https://wa.me/5531993728984"],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main style={{ fontFamily: "'Montserrat', sans-serif", color: "#1a2332" }}>

        {/* HERO */}
        <section
          className="py-16 md:py-20 px-4 md:px-10 text-center"
          style={{ background: "linear-gradient(135deg, #0b1a35 0%, #1a2e50 100%)", color: "#fff" }}
        >
          <p className="text-[#f5c400] font-bold text-xs tracking-widest mb-4 uppercase">
            {cidade.regiao}
          </p>
          <h1 className="font-extrabold mb-5 leading-tight" style={{ fontSize: "clamp(26px, 5vw, 52px)" }}>
            Proteção Veicular em {cidade.nome}
          </h1>
          <p className="text-[#a0b4cc] text-base md:text-lg max-w-xl mx-auto mb-9 leading-relaxed">
            {cidade.frase}
          </p>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#25d366] text-white font-extrabold px-8 md:px-10 py-4 rounded-xl no-underline text-base"
          >
            💬 Falar no WhatsApp
          </a>
        </section>

        {/* NÚMEROS */}
        <section className="bg-[#f5c400] py-8 md:py-10 px-4 md:px-10">
          <div className="max-w-[1100px] mx-auto grid grid-cols-3 gap-4 text-center">
            {[
              { numero: "+10.000", label: "Veículos Protegidos" },
              { numero: "24h", label: "Assistência Disponível" },
              { numero: "98%", label: "Clientes Satisfeitos" },
            ].map((item) => (
              <div key={item.label}>
                <div className="text-2xl md:text-4xl font-extrabold text-[#0b1a35]">{item.numero}</div>
                <div className="text-xs md:text-sm font-semibold text-[#0b1a35] mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* COBERTURAS */}
        <section className="py-16 md:py-20 px-4 md:px-10 bg-white">
          <div className="max-w-[1100px] mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0b1a35] text-center mb-2">
              Coberturas disponíveis em {cidade.nome}
            </h2>
            <p className="text-center text-[#6b7280] mb-10 md:mb-12">
              Proteção completa para o seu veículo
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {coberturas.map((item) => (
                <div key={item.titulo} className="bg-[#f8faff] border border-[#e8eaf0] rounded-xl p-6 md:p-7">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-[#0b1a35] mb-2">{item.titulo}</h3>
                  <p className="text-[#6b7280] text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BAIRROS */}
        <section className="py-12 md:py-16 px-4 md:px-10 bg-[#f8faff]">
          <div className="max-w-[1100px] mx-auto">
            <h2 className="text-xl md:text-2xl font-extrabold text-[#0b1a35] mb-2">
              Atendemos todos os bairros de {cidade.nome}
            </h2>
            <p className="text-[#6b7280] mb-8">
              Incluindo {cidade.bairros.join(", ")} e toda a região.
            </p>
            <div className="flex flex-wrap gap-3">
              {cidade.bairros.map((bairro) => (
                <span key={bairro} className="bg-[#0b1a35] text-[#f5c400] px-4 py-1.5 rounded-full text-sm font-semibold">
                  {bairro}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-20 px-4 md:px-10 bg-white">
          <div className="max-w-[800px] mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0b1a35] text-center mb-10 md:mb-12">
              Perguntas Frequentes
            </h2>
            <div className="flex flex-col gap-4">
              {faq.map((item) => (
                <div key={item.pergunta} className="border border-[#e8eaf0] rounded-xl p-5 md:p-6">
                  <h3 className="font-bold text-[#0b1a35] mb-2 text-sm md:text-base">
                    {item.pergunta}
                  </h3>
                  <p className="text-[#6b7280] leading-relaxed text-sm">{item.resposta}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LEIA TAMBÉM */}
        <section className="py-12 md:py-16 px-4 md:px-10 bg-[#f8faff]">
          <div className="max-w-[1100px] mx-auto">
            <h2 className="text-xl md:text-2xl font-extrabold text-[#0b1a35] mb-8">
              Leia também
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  titulo: "Diferença entre seguro de carro e proteção veicular",
                  href: "/blog/diferenca-entre-seguro-de-carro-e-protecao-veicular/",
                  categoria: "Educação Financeira",
                },
                {
                  titulo: "Proteção veicular é confiável? Tire todas as suas dúvidas",
                  href: "/blog/protecao-veicular-e-confiavel/",
                  categoria: "Dúvidas Frequentes",
                },
                {
                  titulo: "Proteção veicular para motorista de app: Uber, 99 e iFood",
                  href: "/blog/protecao-veicular-para-motorista-de-aplicativo/",
                  categoria: "Motoristas de App",
                },
              ].map((artigo) => (
                <a
                  key={artigo.href}
                  href={artigo.href}
                  className="bg-white border border-[#e8eaf0] rounded-xl p-5 no-underline hover:shadow-md transition-shadow flex flex-col gap-2"
                >
                  <span className="text-xs font-semibold text-[#0b1a35] bg-[#f5c400] px-2 py-0.5 rounded-full self-start">
                    {artigo.categoria}
                  </span>
                  <span className="text-[#0b1a35] font-bold text-sm leading-snug flex-1">
                    {artigo.titulo}
                  </span>
                  <span className="text-[#f5c400] font-bold text-sm">Ler artigo →</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="bg-[#0b1a35] py-16 md:py-20 px-4 md:px-10 text-center">
          <h2 className="text-white text-2xl md:text-3xl font-extrabold mb-4">
            Proteja seu veículo em {cidade.nome} agora
          </h2>
          <p className="text-[#a0b4cc] text-base mb-9">
            Solicite uma cotação gratuita e sem compromisso
          </p>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#25d366] text-white font-extrabold px-10 md:px-12 py-4 rounded-xl no-underline text-lg"
          >
            💬 Falar no WhatsApp
          </a>
        </section>

      </main>
      <Footer />
    </>
  )
}
