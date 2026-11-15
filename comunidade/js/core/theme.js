const STORAGE_KEY = "casa-comunidade-theme";
const root = document.documentElement;
function applyTheme(theme) {
    const light = theme === "light";
    root.dataset.theme = light ? "light" : "dark";
    const button = document.querySelector("[data-theme-toggle]");
    if (!button) return;
    button.innerHTML = light ? '<i data-lucide="moon"></i><span>Modo escuro</span>' : '<i data-lucide="sun"></i><span>Modo claro</span>';
    button.setAttribute("aria-label", light ? "Ativar modo escuro" : "Ativar modo claro");
    button.title = light ? "Ativar modo escuro" : "Ativar modo claro";
    window.lucide?.createIcons?.();
}
export function initializeTheme() {
    let saved = "dark";
    try { saved = localStorage.getItem(STORAGE_KEY) || "dark"; } catch {}
    applyTheme(saved);
    document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
        const next = root.dataset.theme === "light" ? "dark" : "light";
        applyTheme(next);
        try { localStorage.setItem(STORAGE_KEY, next); } catch {}
    });
}