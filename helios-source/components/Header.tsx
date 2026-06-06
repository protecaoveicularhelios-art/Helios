import Image from "next/image"

export default function Header() {
  const whatsapp = "https://wa.me/5531993728984"

  return (
    <header>
      <div style={{ background: "#0b1a35", borderBottom: "1px solid #1a2e50", padding: "0 40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" style={{ color: "#f5c400", fontSize: "13px", textDecoration: "none" }}>
          📞 (31) 99372-8984
        </a>
        <span style={{ color: "#ccc", fontSize: "13px" }}>Atendimento: Seg–Sex 8h–18h | Sáb 8h–12h</span>
      </div>
      <nav style={{ background: "#0b1a35", padding: "0 40px", height: "70px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="https://heliosprotecaoveicular.com.br" style={{ textDecoration: "none" }}>
          <Image
            src="https://heliosprotecaoveicular.com.br/assets/images/logo-helios.png"
            alt="Hélios Proteção Veicular"
            width={120}
            height={50}
            style={{ objectFit: "contain" }}
          />
        </a>
        <div style={{ display: "flex", gap: "32px" }}>
          {[
            { label: "Home", href: "https://heliosprotecaoveicular.com.br" },
            { label: "Quem Somos", href: "https://heliosprotecaoveicular.com.br/#sobre" },
            { label: "Serviços", href: "https://heliosprotecaoveicular.com.br/servicos" },
            { label: "Contato", href: "https://heliosprotecaoveicular.com.br/#contato" },
          ].map((item) => (
            <a key={item.label} href={item.href} style={{ color: "#fff", textDecoration: "none", fontWeight: "600", fontSize: "14px" }}>
              {item.label}
            </a>
          ))}
        </div>
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          style={{ background: "#f5c400", color: "#0b1a35", fontWeight: "700", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontSize: "14px" }}
        >
          Faça sua Cotação
        </a>
      </nav>
    </header>
  )
}
