import { supabase } from "../../core/supabase.js";
import { notify } from "../../shared/notifications.js";

const categoryLabel = value => ({ "sugestão": "Sugestão", "crítica": "Crítica", problema: "Problema", elogio: "Elogio" }[value] || value);
export function initializeFeedbackTracking() {
    const input = document.querySelector("[data-feedback-code]");
    const button = document.querySelector("[data-feedback-lookup]");
    const panel = document.querySelector("[data-feedback-tracking]");
    if (!input || !button || !panel) return;

    button.addEventListener("click", async () => {
        const code = input.value.trim().toUpperCase();
        if (!/^CASA-[0-9A-F]{8}-[0-9A-F]{8}-[0-9A-F]{4}$/.test(code)) {
            notify("Confira o código de acompanhamento.");
            input.focus();
            return;
        }
        button.disabled = true;
        try {
            const { data, error } = await supabase.rpc("community_lookup_feedback", { p_code: code });
            if (error) throw error;
            panel.replaceChildren();
            if (!data) {
                panel.textContent = "Não encontramos uma avaliação com esse código.";
                return;
            }
            const heading = document.createElement("strong");
            heading.textContent = data.subject || categoryLabel(data.category);
            const status = document.createElement("p");
            status.textContent = `Categoria: ${categoryLabel(data.category)} · Status: ${data.status === "resolved" ? "Resolvida" : data.status === "archived" ? "Arquivada" : "Pendente"}`;
            const message = document.createElement("p");
            message.textContent = data.message;
            panel.append(heading, status, message);
            (data.replies || []).forEach(reply => {
                const item = document.createElement("article");
                const label = document.createElement("strong");
                label.textContent = "Resposta da administração";
                const content = document.createElement("p");
                content.textContent = reply.message;
                item.append(label, content);
                panel.append(item);
            });
        } catch (error) {
            console.error("Falha ao consultar avaliação:", error);
            notify("Não foi possível consultar o código agora.");
        } finally {
            button.disabled = false;
        }
    });
}