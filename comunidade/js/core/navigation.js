const publicViews = new Set(["inicio", "forum", "sugestoes", "avaliacoes"]);

function normalizeView(view, canAccessAdmin) {
    if (view === "admin") return canAccessAdmin ? "admin" : "forum";
    return publicViews.has(view) ? view : "forum";
}

function renderView(view, canAccessAdmin) {
    const activeView = normalizeView(view, canAccessAdmin);

    document.querySelectorAll("[data-view]").forEach(section => {
        section.hidden = section.dataset.view !== activeView;
    });

    document.querySelectorAll(".section-tab[data-route]").forEach(button => {
        const isActive = button.dataset.route === activeView;
        button.classList.toggle("is-active", isActive);

        if (isActive) button.setAttribute("aria-current", "page");
        else button.removeAttribute("aria-current");
    });

    window.lucide?.createIcons?.();
}

export function initializeNavigation({ canAccessAdmin = false } = {}) {
    document.addEventListener("click", event => {
        const target = event.target.closest("[data-route]");
        if (!target) return;

        event.preventDefault();
        const route = normalizeView(target.dataset.route, canAccessAdmin);
        window.location.hash = route;
        renderView(route, canAccessAdmin);
    });

    window.addEventListener("hashchange", () => {
        renderView(window.location.hash.slice(1), canAccessAdmin);
    });

    renderView(window.location.hash.slice(1) || "forum", canAccessAdmin);
}