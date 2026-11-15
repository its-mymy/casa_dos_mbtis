import { initializeAuth } from "./core/auth.js";
import { initializeNavigation } from "./core/navigation.js";
import { initializeAdmin } from "./features/admin/index.js";
import { initializeFeedback } from "./features/feedback/index.js";
import { initializeForum } from "./features/forum/index.js";
import { initializeSuggestions } from "./features/suggestions/index.js";
import { notify } from "./shared/notifications.js";

async function startCommunityApp() {
    const authState = await initializeAuth();
    const adminAllowed = initializeAdmin(authState.profile);

    initializeNavigation({ canAccessAdmin: adminAllowed });
    initializeForum();
    initializeSuggestions();
    initializeFeedback();

    document.querySelectorAll("[data-requires-login]").forEach(button => {
        button.addEventListener("click", () => {
            if (!authState.user) {
                window.location.href = "../login/index.html";
                return;
            }

            notify("A criação de publicações será habilitada na próxima etapa.");
        });
    });

    window.lucide?.createIcons?.();
}

startCommunityApp();