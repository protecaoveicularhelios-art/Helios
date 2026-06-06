import Image from "next/image"

export default function Header() {
  const whatsapp = "https://wa.me/5531993728984"

  return (
    <header>
      <div className="bg-[#0b1a35] border-b border-[#1a2e50] px-4 md:px-10 h-10 flex items-center justify-between">
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="text-[#f5c400] text-xs no-underline">
          📞 (31) 99372-8984
        </a>
        <span className="hidden md:block text-[#ccc] text-xs">Atendimento: Seg–Sex 8h–18h | Sáb 8h–12h</span>
      </div>
      <nav className="bg-[#0b1a35] px-4 md:px-10 h-[70px] flex items-center justify-between">
        <a href="https://heliosprotecaoveicular.com.br" className="no-underline">
          <Image
            src="https://heliosprotecaoveicular.com.br/assets/images/logo-helios.png"
            alt="Hélios Proteção Veicular"
            width={120}
            height={50}
            className="object-contain"
          />
        </a>
        <div className="hidden md:flex gap-8">
          {[
            { label: "Home", href: "https://heliosprotecaoveicular.com.br" },
            { label: "Quem Somos", href: "https://heliosprotecaoveicular.com.br/#sobre" },
            { label: "Serviços", href: "https://heliosprotecaoveicular.com.br/servicos" },
            { label: "Blog", href: "https://heliosprotecaoveicular.com.br/blog/" },
            { label: "Contato", href: "https://heliosprotecaoveicular.com.br/#contato" },
          ].map((item) => (
            <a key={item.label} href={item.href} className="text-white no-underline font-semibold text-sm">
              {item.label}
            </a>
          ))}
        </div>
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#f5c400] text-[#0b1a35] font-bold px-4 md:px-6 py-2 rounded-lg no-underline text-xs md:text-sm whitespace-nowrap"
        >
          Faça sua Cotação
        </a>
      </nav>
    </header>
  )
}
