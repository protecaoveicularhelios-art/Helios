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
    alternates: {
      canonical: url,
    },
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
        <section style={{ background: "linear-gradient(135deg, #0b1a35 0%, #1a2e50 100%)", color: "#fff", padding: "80px 40px", textAlign: "center" }}>
          <p style={{ color: "#f5c400", fontWeight: "700", fontSize: "14px", letterSpacing: "2px", marginBottom: "16px", textTransform: "uppercase" }}>
            {cidade.regiao}
          </p>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: "800", marginBottom: "20px", lineHeight: "1.2" }}>
            Proteção Veicular em {cidade.nome}
          </h1>
          <p style={{ fontSize: "18px", color: "#a0b4cc", maxWidth: "600px", margin: "0 auto 36px", lineHeight: "1.7" }}>
            {cidade.frase}
          </p>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            style={{ background: "#25d366", color: "#fff", fontWeight: "800", padding: "16px 40px", borderRadius: "10px", textDecoration: "none", fontSize: "16px", display: "inline-block" }}
          >
            💬 Falar no WhatsApp
          </a>
        </section>

        {/* NÚMEROS */}
        <section style={{ background: "#f5c400", padding: "40px" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", textAlign: "center" }}>
            {[
              { numero: "+10.000", label: "Veículos Protegidos" },
              { numero: "24h", label: "Assistência Disponível" },
              { numero: "98%", label: "Clientes Satisfeitos" },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ fontSize: "36px", fontWeight: "800", color: "#0b1a35" }}>{item.numero}</div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#0b1a35" }}>{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* COBERTURAS */}
        <section style={{ padding: "80px 40px", background: "#fff" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#0b1a35", textAlign: "center", marginBottom: "8px" }}>
              Coberturas disponíveis em {cidade.nome}
            </h2>
            <p style={{ textAlign: "center", color: "#6b7280", marginBottom: "48px" }}>
              Proteção completa para o seu veículo
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
              {coberturas.map((item) => (
                <div key={item.titulo} style={{ background: "#f8faff", border: "1px solid #e8eaf0", borderRadius: "12px", padding: "28px" }}>
                  <div style={{ fontSize: "36px", marginBottom: "12px" }}>{item.icon}</div>
                  <h3 style={{ fontWeight: "700", color: "#0b1a35", marginBottom: "8px" }}>{item.titulo}</h3>
                  <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: "1.6" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BAIRROS */}
        <section style={{ padding: "60px 40px", background: "#f8faff" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0b1a35", marginBottom: "8px" }}>
              Atendemos todos os bairros de {cidade.nome}
            </h2>
            <p style={{ color: "#6b7280", marginBottom: "32px" }}>
              Incluindo {cidade.bairros.join(", ")} e toda a região.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {cidade.bairros.map((bairro) => (
                <span key={bairro} style={{ background: "#0b1a35", color: "#f5c400", padding: "6px 16px", borderRadius: "20px", fontSize: "14px", fontWeight: "600" }}>
                  {bairro}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: "80px 40px", background: "#fff" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#0b1a35", textAlign: "center", marginBottom: "48px" }}>
              Perguntas Frequentes
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {faq.map((item) => (
                <div key={item.pergunta} style={{ border: "1px solid #e8eaf0", borderRadius: "12px", padding: "24px" }}>
                  <h3 style={{ fontWeight: "700", color: "#0b1a35", marginBottom: "8px", fontSize: "16px" }}>
                    {item.pergunta}
                  </h3>
                  <p style={{ color: "#6b7280", lineHeight: "1.7", fontSize: "14px" }}>{item.resposta}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section style={{ background: "#0b1a35", padding: "80px 40px", textAlign: "center" }}>
          <h2 style={{ color: "#fff", fontSize: "32px", fontWeight: "800", marginBottom: "16px" }}>
            Proteja seu veículo em {cidade.nome} agora
          </h2>
          <p style={{ color: "#a0b4cc", fontSize: "16px", marginBottom: "36px" }}>
            Solicite uma cotação gratuita e sem compromisso
          </p>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            style={{ background: "#25d366", color: "#fff", fontWeight: "800", padding: "16px 48px", borderRadius: "10px", textDecoration: "none", fontSize: "18px", display: "inline-block" }}
          >
            💬 Falar no WhatsApp
          </a>
        </section>

      </main>
      <Footer />
    </>
  )
}
