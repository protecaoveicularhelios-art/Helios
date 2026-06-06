import Image from "next/image"

export default function Footer() {
  const whatsapp = "https://wa.me/5531993728984"

  return (
    <footer style={{ background: "#0b1a35", color: "#fff", padding: "48px 40px 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "40px", marginBottom: "40px" }}>
          <div>
            <Image
              src="https://heliosprotecaoveicular.com.br/assets/images/logo-helios.png"
              alt="Hélios Proteção Veicular"
              width={130}
              height={55}
              style={{ objectFit: "contain", marginBottom: "16px" }}
            />
            <p style={{ color: "#a0aec0", fontSize: "14px", lineHeight: "1.7" }}>
              Confiança, Proteção e Tranquilidade ao seu alcance.
            </p>
          </div>
          <div>
            <h4 style={{ color: "#fff", fontWeight: "700", marginBottom: "16px" }}>Navegação</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { label: "Home", href: "https://heliosprotecaoveicular.com.br" },
                { label: "Quem Somos", href: "https://heliosprotecaoveicular.com.br/#sobre" },
                { label: "Serviços", href: "https://heliosprotecaoveicular.com.br/servicos" },
                { label: "Contato", href: "https://heliosprotecaoveicular.com.br/#contato" },
              ].map((item) => (
                <a key={item.label} href={item.href} style={{ color: "#a0aec0", textDecoration: "none", fontSize: "14px" }}>{item.label}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ color: "#fff", fontWeight: "700", marginBottom: "16px" }}>Serviços</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {["Roubo e Furto", "Assistência 24h", "Carro Reserva", "Rastreamento", "Reboque 24h"].map((s) => (
                <span key={s} style={{ color: "#a0aec0", fontSize: "14px" }}>{s}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ color: "#fff", fontWeight: "700", marginBottom: "16px" }}>Contato</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", color: "#a0aec0", fontSize: "14px" }}>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" style={{ color: "#a0aec0", textDecoration: "none" }}>
                📞 (31) 99372-8984
              </a>
              <span>📍 Belo Horizonte, MG</span>
              <span>⏰ Seg–Sex 8h–18h</span>
              <span>⏰ Sáb 8h–12h</span>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #1a2e50", paddingTop: "24px", textAlign: "center", color: "#4a5568", fontSize: "13px" }}>
          © {new Date().getFullYear()} <strong style={{ color: "#f5c400" }}>Hélios Proteção Veicular</strong>. Todos os direitos reservados. &nbsp;|&nbsp; heliosprotecaoveicular.com.br
        </div>
      </div>
    </footer>
  )
}
