// =========================================================
// RPO ENGENHARIA — script.js
// Menu mobile, ano automático, animações de entrada (reveal),
// acordeão de serviços e geração do PDF a partir da própria página.
// =========================================================

document.addEventListener("DOMContentLoaded", function () {
  setCurrentYear();
  setupMobileMenu();
  setupRevealAnimations();
  setupServiceAccordion();
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
    ".card, .pillar-card, .about-point, .audience-card, .diff-check, .sector-chip, .commitment-block"
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

/* Mantém apenas uma frente de serviço aberta por vez (acordeão) */
function setupServiceAccordion() {
  var items = document.querySelectorAll(".service-item");

  items.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) {
        items.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });
}

/* Liga os botões de "Baixar PDF" (header, hero e CTA final) à mesma função */
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
   usar html2pdf().set(options).from(content).save().

   Antes de imprimir, abrimos todas as frentes de serviço (acordeão)
   para que apareçam completas no PDF, e restauramos o estado original
   depois que a janela de impressão é fechada ("afterprint"). */
function downloadPdf() {
  var serviceItems = document.querySelectorAll(".service-item");
  var previousState = Array.prototype.map.call(serviceItems, function (el) {
    return el.open;
  });
  serviceItems.forEach(function (el) {
    el.open = true;
  });

  function restoreAccordion() {
    serviceItems.forEach(function (el, i) {
      el.open = previousState[i];
    });
    window.removeEventListener("afterprint", restoreAccordion);
  }

  window.addEventListener("afterprint", restoreAccordion);
  window.print();
}
