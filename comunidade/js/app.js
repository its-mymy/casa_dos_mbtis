import { initializeAuth } from "./core/auth.js";
import { initializeNavigation } from "./core/navigation.js";
import { notify } from "./shared/notifications.js";
import { validateRequiredText } from "./shared/validation.js";

async function startCommunityApp() {
    await initializeAuth();
    initializeNavigation();

    const feedbackForm = document.querySelector("[data-feedback-form]");

    feedbackForm?.addEventListener("submit", event => {
        event.preventDefault();

        const message = feedbackForm.elements.namedItem("message");
        const result = validateRequiredText(message?.value, 10, 3000);

        if (!result.valid) {
            notify("Escreva uma mensagem com pelo menos 10 caracteres.");
            message?.focus();
            return;
        }

        notify("A Central de avaliações ainda está em preparação. Sua mensagem não foi enviada.");
    });

    document.querySelectorAll("[data-requires-login]").forEach(button => {
        button.addEventListener("click", () => {
            window.location.href = "../login/index.html";
        });
    });

    window.lucide?.createIcons?.();
}

startCommunityApp();