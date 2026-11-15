import { getCurrentUser } from "../../core/auth.js";
import { notify } from "../../shared/notifications.js";
import { initializeTopicComposer, loadTopics } from "./topics.js";

export function initializeForum() {
    const view = document.querySelector('[data-view="forum"]');
    const list = document.querySelector("[data-forum-list]");
    const create = view?.querySelector("[data-forum-create]");
    const search = view?.querySelector("[data-forum-search]");
    if (!view || !list || !create) return;

    const toggleComposer = initializeTopicComposer(list, () => loadTopics(list, search?.value || ""));
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