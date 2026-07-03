// =========================================================
// ALAVANCA — script.js
// Menu mobile, ano automático, animações de entrada (reveal)
// e geração do PDF a partir da própria página.
// =========================================================

document.addEventListener("DOMContentLoaded", function () {
  setCurrentYear();
  setupMobileMenu();
  setupRevealAnimations();
  setupPdfButtons();
});

/* Atualiza o ano no rodapé automaticamente */
function setCurrentYear() {
  var yearEl = document.getElementById("ano-atual");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* Abre/fecha o menu mobile e fecha automaticamente ao clicar em um link */
function setupMobileMenu() {
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("mobileMenu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", function () {
    menu.classList.toggle("is-open");
  });

  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      menu.classList.remove("is-open");
    });
  });
}

/* Anima seções e cards ao entrarem na viewport */
function setupRevealAnimations() {
  var targets = document.querySelectorAll(
    ".card, .diff-item, .timeline-step, .benefit-card, .pillar-card, .about-point, .model-card, .audience-card"
  );

  targets.forEach(function (el) {
    el.classList.add("reveal");
  });

  if (!("IntersectionObserver" in window)) {
    targets.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach(function (el) {
    observer.observe(el);
  });
}

/* Liga os 3 botões de "Baixar PDF" (header, hero e CTA final) à mesma função */
function setupPdfButtons() {
  var buttons = [
    document.getElementById("btnDownloadPdfTop"),
    document.getElementById("btnDownloadPdfHero"),
    document.getElementById("btnDownloadPdfCta"),
  ];

  buttons.forEach(function (btn) {
    if (btn) btn.addEventListener("click", downloadPdf);
  });
}

/* Gera o PDF usando a impressão nativa do navegador (window.print()).
   As regras de @media print do style.css cuidam de remover o menu,
   separar cada seção em uma página e preservar as cores do design.
   Na janela de impressão, basta escolher o destino "Salvar como PDF".

   Observação: optamos por window.print() em vez de uma biblioteca de
   captura de tela (ex.: html2pdf.js) porque essas bibliotecas ignoram
   as regras de @media print e geram margens brancas e cortes de texto
   no meio dos cards. Se quiser reativar html2pdf.js no futuro, adicione
   de volta o <script> da CDN no index.html e troque esta função para
   usar html2pdf().set(options).from(content).save(). */
function downloadPdf() {
  window.print();
}
