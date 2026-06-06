import { Metadata } from "next"
import { artigos } from "@/data/artigos"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: "Blog Hélios | Proteção Veicular, Dicas e Comparativos",
  description: "Artigos sobre proteção veicular, diferença entre seguro e proteção, dicas para motoristas de aplicativo e muito mais.",
  alternates: { canonical: "https://heliosprotecaoveicular.com.br/blog/" },
  openGraph: {
    title: "Blog Hélios | Proteção Veicular, Dicas e Comparativos",
    description: "Artigos sobre proteção veicular, diferença entre seguro e proteção, dicas para motoristas de aplicativo e muito mais.",
    url: "https://heliosprotecaoveicular.com.br/blog/",
    siteName: "Hélios Proteção Veicular",
    locale: "pt_BR",
    type: "website",
  },
}

const categoriasCores: Record<string, string> = {
  "Educação Financeira": "bg-blue-100 text-blue-800",
  "Comparativos": "bg-purple-100 text-purple-800",
  "Motos": "bg-orange-100 text-orange-800",
  "Dúvidas Frequentes": "bg-green-100 text-green-800",
  "Motoristas de App": "bg-yellow-100 text-yellow-800",
}

function formatarData(data: string) {
  return new Date(data).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })
}

export default function BlogPage() {
  return (
    <>
      <Header />
      <main style={{ fontFamily: "'Montserrat', sans-serif" }}>

        {/* HERO */}
        <section
          className="py-14 md:py-20 px-4 md:px-10 text-center"
          style={{ background: "linear-gradient(135deg, #0b1a35 0%, #1a2e50 100%)", color: "#fff" }}
        >
          <p className="text-[#f5c400] font-bold text-xs tracking-widest mb-3 uppercase">Hélios Proteção Veicular</p>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Blog</h1>
          <p className="text-[#a0b4cc] text-base md:text-lg max-w-xl mx-auto">
            Dicas, comparativos e tudo o que você precisa saber antes de proteger o seu veículo.
          </p>
        </section>

        {/* ARTIGOS */}
        <section className="py-14 md:py-20 px-4 md:px-10 bg-[#f8faff]">
          <div className="max-w-[1100px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artigos.map((artigo) => (
                <a
                  key={artigo.slug}
                  href={`/blog/${artigo.slug}/`}
                  className="bg-white border border-[#e8eaf0] rounded-xl p-6 no-underline flex flex-col hover:shadow-md transition-shadow"
                >
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full self-start mb-4 ${categoriasCores[artigo.categoria] ?? "bg-gray-100 text-gray-700"}`}>
                    {artigo.categoria}
                  </span>
                  <h2 className="text-[#0b1a35] font-bold text-lg leading-snug mb-3 flex-1">
                    {artigo.titulo}
                  </h2>
                  <p className="text-[#6b7280] text-sm leading-relaxed mb-4">
                    {artigo.descricao}
                  </p>
                  <div className="flex items-center justify-between text-xs text-[#9ca3af] mt-auto">
                    <span>{formatarData(artigo.data)}</span>
                    <span>{artigo.tempoLeitura} de leitura</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#0b1a35] py-14 md:py-16 px-4 md:px-10 text-center">
          <h2 className="text-white text-2xl md:text-3xl font-extrabold mb-4">
            Pronto para proteger o seu veículo?
          </h2>
          <p className="text-[#a0b4cc] text-base mb-8">
            Fale com nossa equipe e receba uma cotação gratuita agora.
          </p>
          <a
            href="https://wa.me/5531993728984"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#25d366] text-white font-extrabold px-10 py-4 rounded-xl no-underline text-lg"
          >
            💬 Falar no WhatsApp
          </a>
        </section>

      </main>
      <Footer />
    </>
  )
}
