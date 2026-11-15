import { supabase } from "../../core/supabase.js";
import { notify } from "../../shared/notifications.js";

export function initializeFeedbackForm() {
    const form = document.querySelector("[data-feedback-form]");
    if (!form) return;

    form.addEventListener("submit", async event => {
        event.preventDefault();
        const submitButton = form.querySelector('[type="submit"]');
        const message = String(form.elements.namedItem("message")?.value || "").trim();

        if (message.length < 5 || message.length > 10000) {
            notify("A mensagem precisa ter entre 5 e 10.000 caracteres.");
            form.elements.namedItem("message")?.focus();
            return;
        }

        submitButton.disabled = true;
        try {
            const { data, error } = await supabase.rpc("community_submit_feedback", {
                p_category: form.elements.namedItem("category").value,
                p_subject: form.elements.namedItem("subject").value.trim() || null,
                p_message: message,
                p_sender_name: form.elements.namedItem("sender_name").value.trim() || null
            });
            if (error) throw error;

            let result = form.querySelector("[data-feedback-result]");
            if (!result) {
                result = document.createElement("div");
                result.className = "form-notice feedback-result";
                result.dataset.feedbackResult = "";
                form.append(result);
            }

            result.replaceChildren();
            const title = document.createElement("strong");
            title.textContent = "Avaliação enviada.";
            const description = document.createElement("p");
            description.textContent = "Guarde este código. Ele é a única forma de consultar a resposta depois.";
            const code = document.createElement("code");
            code.textContent = data;
            const copy = document.createElement("button");
            copy.type = "button";
            copy.className = "button button--secondary";
            copy.textContent = "Copiar código";
            copy.addEventListener("click", async () => {
                try {
                    await navigator.clipboard.writeText(data);
                    notify("Código copiado.");
                } catch {
                    notify("Selecione e copie o código manualmente.");
                }
            });
            result.append(title, description, code, copy);
            form.reset();
            notify("Sua avaliação foi enviada.");
        } catch (error) {
            console.error("Falha ao enviar avaliação:", error);
            notify("Não foi possível enviar agora. Tente novamente mais tarde.");
        } finally {
            submitButton.disabled = false;
        }
    });
}