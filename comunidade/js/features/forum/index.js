import { getCurrentUser } from "../../core/auth.js";
import { initializeTopicComposer, loadTopics } from "./topics.js";

export function initializeForum() {
    const view = document.querySelector('[data-view="forum"]');
    const list = view?.querySelector("[data-forum-list]");
    const create = view?.querySelector("[data-forum-create]");
    const search = view?.querySelector("[data-forum-search]");
    if (!view || !list || !create) return;

    // O formulário precisa ficar fora da lista, pois loadTopics() substitui
    // os filhos da lista a cada atualização.
    const composerHost = document.createElement("div");
    composerHost.className = "forum-composer-host";
    list.before(composerHost);

    const toggleComposer = initializeTopicComposer(composerHost, () => loadTopics(list, search?.value || ""));
    create.addEventListener("click", () => {
        if (!getCurrentUser()) {
            window.location.href = "../login/index.html";
            return;
        }
        toggleComposer();
    });
    search?.addEventListener("input", () => loadTopics(list, search.value));
    loadTopics(list);
}