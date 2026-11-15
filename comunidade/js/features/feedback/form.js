import { notify } from "../../shared/notifications.js";
import { validateRequiredText } from "../../shared/validation.js";

export function initializeFeedbackForm() {
    const form = document.querySelector("[data-feedback-form]");
    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();
        const messageField = form.elements.namedItem("message");
        const result = validateRequiredText(messageField?.value, 10, 3000);

        if (!result.valid) {
            notify("Escreva uma mensagem com pelo menos 10 caracteres.");
            messageField?.focus();
            return;
        }

        notify("A Central de avaliações ainda está em preparação. Sua mensagem não foi enviada.");
    });
}