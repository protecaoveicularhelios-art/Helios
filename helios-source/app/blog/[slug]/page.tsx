import { artigos } from "@/data/artigos"
import { notFound } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export async function generateStaticParams() {
  return artigos.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const artigo = artigos.find((a) => a.slug === slug)
  if (!artigo) return {}

  const url = `https://heliosprotecaoveicular.com.br/blog/${artigo.slug}/`
  return {
    title: `${artigo.titulo} | Blog Hélios`,
    description: artigo.descricao,
    alternates: { canonical: url },
    openGraph: {
      title: artigo.titulo,
      description: artigo.descricao,
      url,
      siteName: "Hélios Proteção Veicular",
      locale: "pt_BR",
      type: "article",
    },
  }
}

function formatarData(data: string) {
  return new Date(data).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })
}

export default async function ArtigoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const artigo = artigos.find((a) => a.slug === slug)
  if (!artigo) notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: artigo.titulo,
    description: artigo.descricao,
    datePublished: artigo.data,
    author: { "@type": "Organization", name: "Hélios Proteção Veicular" },
    publisher: {
      "@type": "Organization",
      name: "Hélios Proteção Veicular",
      url: "https://heliosprotecaoveicular.com.br",
    },
    url: `https://heliosprotecaoveicular.com.br/blog/${artigo.slug}/`,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main style={{ fontFamily: "'Montserrat', sans-serif" }}>

        {/* HERO */}
        <section
          className="py-12 md:py-16 px-4 md:px-10"
          style={{ background: "linear-gradient(135deg, #0b1a35 0%, #1a2e50 100%)", color: "#fff" }}
        >
          <div className="max-w-[800px] mx-auto">
            <a href="/blog/" className="text-[#f5c400] text-sm font-semibold no-underline mb-4 inline-block">
              ← Voltar ao Blog
            </a>
            <span className="block text-[#f5c400] text-xs font-bold tracking-widest uppercase mb-3">
              {artigo.categoria}
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold leading-tight mb-4">
              {artigo.titulo}
            </h1>
            <div className="flex gap-4 text-[#a0b4cc] text-sm">
              <span>{formatarData(artigo.data)}</span>
              <span>·</span>
              <span>{artigo.tempoLeitura} de leitura</span>
            </div>
          </div>
        </section>

        {/* CONTEÚDO */}
        <section className="py-12 md:py-16 px-4 md:px-10 bg-white">
          <div className="max-w-[800px] mx-auto">
            <div
              className="prose-helios"
              dangerouslySetInnerHTML={{ __html: artigo.conteudo }}
            />

            {/* CTA */}
            <div className="mt-12 bg-[#f8faff] border border-[#e8eaf0] rounded-xl p-6 md:p-8 text-center">
              <h3 className="text-[#0b1a35] text-xl font-extrabold mb-2">
                Quer proteger seu veículo em BH ou Grande BH?
              </h3>
              <p className="text-[#6b7280] text-sm mb-6">
                Fale com nossa equipe agora e receba uma cotação gratuita e sem compromisso.
              </p>
              <a
                href="https://wa.me/5531993728984"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#25d366] text-white font-extrabold px-8 py-3 rounded-xl no-underline text-base"
              >
                💬 Falar no WhatsApp
              </a>
            </div>

            {/* OUTROS ARTIGOS */}
            <div className="mt-12">
              <h3 className="text-[#0b1a35] text-lg font-bold mb-5">Outros artigos</h3>
              <div className="flex flex-col gap-3">
                {artigos.filter((a) => a.slug !== artigo.slug).slice(0, 3).map((a) => (
                  <a
                    key={a.slug}
                    href={`/blog/${a.slug}/`}
                    className="flex items-center gap-3 p-4 border border-[#e8eaf0] rounded-xl no-underline hover:bg-[#f8faff] transition-colors"
                  >
                    <span className="text-[#0b1a35] font-semibold text-sm leading-snug flex-1">{a.titulo}</span>
                    <span className="text-[#f5c400] text-lg">→</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
