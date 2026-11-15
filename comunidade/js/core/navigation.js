const validViews = new Set(["inicio", "forum", "sugestoes", "avaliacoes", "admin"]);

function normalizeView(view) {
    return validViews.has(view) ? view : "forum";
}

function renderView(view) {
    const activeView = normalizeView(view);

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

export function initializeNavigation() {
    document.addEventListener("click", event => {
        const target = event.target.closest("[data-route]");
        if (!target) return;

        event.preventDefault();
        const route = normalizeView(target.dataset.route);
        window.location.hash = route;
        renderView(route);
    });

    window.addEventListener("hashchange", () => {
        renderView(window.location.hash.slice(1));
    });

    renderView(window.location.hash.slice(1) || "forum");
}