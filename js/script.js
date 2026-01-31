// ✅ Scroll reveal
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) e.target.classList.add("show");
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

// ✅ Tabs (abas) com efeito + hash
const tabButtons = document.querySelectorAll("[data-tab-btn]");
const panels = document.querySelectorAll("[data-tab-panel]");

function setActiveTab(tabId, pushHash = true){
  // Buttons
  tabButtons.forEach(btn => {
    const isActive = btn.getAttribute("data-tab-btn") === tabId;
    btn.classList.toggle("active", isActive);
  });

  // Panels
  panels.forEach(p => {
    const active = p.id === tabId;
    p.classList.toggle("active", active);
    p.setAttribute("aria-hidden", active ? "false" : "true");

    // reaplica animação “reveal” dentro da aba ativa (opcional)
    if (active) {
      p.querySelectorAll(".reveal").forEach(el => {
        // força re-animação leve ao entrar na aba
        el.classList.remove("show");
        requestAnimationFrame(() => el.classList.add("show"));
      });
    }
  });

  // Sobe suavemente para o começo do conteúdo
  const top = document.querySelector(".tabs-nav")?.offsetTop ?? 0;
  window.scrollTo({ top: Math.max(0, top - 10), behavior: "smooth" });

  if (pushHash) {
    history.replaceState(null, "", `#${tabId}`);
  }
}

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const tabId = btn.getAttribute("data-tab-btn");
    setActiveTab(tabId, true);
  });
});

// Ao abrir com link #tab-xxx, já vai na aba certa
const hash = (location.hash || "").replace("#", "");
if (hash && document.getElementById(hash)) {
  setActiveTab(hash, false);
} else {
  setActiveTab("tab-resumo", false);
}

// ✅ Lightbox (Guibbor)
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lbClose = document.getElementById("lbClose");

document.querySelectorAll("[data-lightbox]").forEach((a) => {
    a.addEventListener("click", (e) => {
        e.preventDefault();
            const src = a.getAttribute("data-lightbox");
            lightboxImg.src = src;
            lightbox.classList.add("show");
            lightbox.setAttribute("aria-hidden", "false");
    });
});

function closeLightbox(){
    lightboxImg.src = "";
    lightbox.classList.remove("show");
    lightbox.setAttribute("aria-hidden", "true");
}
lbClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

// ✅ Imprimir / Salvar PDF do currículo
const btnPrint = document.getElementById("btnPrintCv");
const btnSave = document.getElementById("btnSaveCv");
const cvFrame = document.getElementById("cvFrame");

function tryPrintIframe(){
    try {
    cvFrame?.contentWindow?.focus();
    cvFrame?.contentWindow?.print();
    } catch (err) {
        // fallback: abre PDF e usuário imprime por lá
        window.open("assets/docs/CVEdvanFigueredo.pdf", "_blank", "noopener");
    }
}

btnPrint?.addEventListener("click", () => {
    tryPrintIframe();
});

btnSave?.addEventListener("click", () => {
  // "Salvar em PDF" é o mesmo fluxo da impressão: usuário escolhe "Salvar como PDF"
    tryPrintIframe();
});