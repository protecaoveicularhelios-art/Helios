import Image from "next/image"

export default function Footer() {
  const whatsapp = "https://wa.me/5531993728984"

  return (
    <footer className="bg-[#0b1a35] text-white px-4 md:px-10 pt-12 pb-6">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <Image
              src="https://heliosprotecaoveicular.com.br/assets/images/logo-helios.png"
              alt="Hélios Proteção Veicular"
              width={130}
              height={55}
              className="object-contain mb-4"
            />
            <p className="text-[#a0aec0] text-sm leading-relaxed">
              Confiança, Proteção e Tranquilidade ao seu alcance.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Navegação</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: "Home", href: "https://heliosprotecaoveicular.com.br" },
                { label: "Quem Somos", href: "https://heliosprotecaoveicular.com.br/#sobre" },
                { label: "Serviços", href: "https://heliosprotecaoveicular.com.br/servicos" },
                { label: "Contato", href: "https://heliosprotecaoveicular.com.br/#contato" },
              ].map((item) => (
                <a key={item.label} href={item.href} className="text-[#a0aec0] no-underline text-sm">{item.label}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Serviços</h4>
            <div className="flex flex-col gap-2">
              {["Roubo e Furto", "Assistência 24h", "Carro Reserva", "Rastreamento", "Reboque 24h"].map((s) => (
                <span key={s} className="text-[#a0aec0] text-sm">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Contato</h4>
            <div className="flex flex-col gap-2 text-[#a0aec0] text-sm">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="text-[#a0aec0] no-underline">
                📞 (31) 99372-8984
              </a>
              <span>📍 Belo Horizonte, MG</span>
              <span>⏰ Seg–Sex 8h–18h</span>
              <span>⏰ Sáb 8h–12h</span>
            </div>
          </div>
        </div>
        <div className="border-t border-[#1a2e50] pt-6 text-center text-[#4a5568] text-xs">
          © {new Date().getFullYear()} <strong className="text-[#f5c400]">Hélios Proteção Veicular</strong>. Todos os direitos reservados. &nbsp;|&nbsp; heliosprotecaoveicular.com.br
        </div>
      </div>
    </footer>
  )
}
