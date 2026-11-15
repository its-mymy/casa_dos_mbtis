import { supabase } from "../../core/supabase.js";
import { getCurrentUser } from "../../core/auth.js";
import { notify } from "../../shared/notifications.js";

const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
};
const labelStatus = value => ({ pending: "Pendente", resolved: "Resolvida", archived: "Arquivada" }[value] || value);
const labelCategory = value => ({ "sugestão": "Sugestão", critica: "Crítica", problema: "Problema", elogio: "Elogio" }[value] || value);
const date = value => new Date(value).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

export async function initializeAdminFeedback() {
    const list = document.querySelector("[data-admin-feedback-list]");
    const filter = document.querySelector("[data-admin-feedback-filter]");
    if (!list) return;

    async function load() {
        list.replaceChildren(el("p", "admin-loading", "Carregando avaliações..."));
        const { data, error } = await supabase.rpc("community_admin_list_feedback", {
            p_status: filter?.value || "all"
        });
        list.replaceChildren();
        if (error) {
            console.error("Falha ao carregar avaliações administrativas:", error);
            list.append(el("p", "empty-state", "Não foi possível carregar as avaliações. Verifique se sua conta tem cargo adm."));
            return;
        }
        if (!Array.isArray(data) || !data.length) {
            list.append(el("p", "empty-state", "Nenhuma avaliação encontrada neste filtro."));
            return;
        }

        for (const item of data) {
            const card = el("article", "admin-record admin-feedback-record");
            const header = el("div", "admin-feedback-record__header");
            const titleGroup = el("div", "");
            titleGroup.append(el("span", "eyebrow", labelCategory(item.category)));
            titleGroup.append(el("h4", "", item.subject || "Sem assunto"));
            const status = el("span", "status-pill", labelStatus(item.status));
            header.append(titleGroup, status);

            const meta = el("p", "admin-feedback-record__meta",
                `Recebida em ${date(item.created_at)}${item.sender_name ? " · Nome informado: " + item.sender_name : " · Envio anônimo"}`);
            const message = el("p", "admin-feedback-record__message", item.message);
            card.append(header, meta, message);

            if (item.replies?.length) {
                const replies = el("div", "admin-feedback-replies");
                replies.append(el("strong", "", "Respostas enviadas"));
                item.replies.forEach(reply => {
                    const entry = el("article", "admin-feedback-reply");
                    entry.append(el("p", "", reply.message), el("small", "", date(reply.created_at)));
                    replies.append(entry);
                });
                card.append(replies);
            }

            const replyForm = el("form", "admin-feedback-reply-form");
            replyForm.innerHTML = '<label class="form-field"><span>Responder à avaliação</span><textarea name="message" rows="3" maxlength="5000" minlength="2" required placeholder="Escreva uma resposta que ficará disponível ao titular pelo código de acompanhamento..."></textarea></label><button class="button button--primary" type="submit">Enviar resposta</button>';
            replyForm.addEventListener("submit", async event => {
                event.preventDefault();
                if (!getCurrentUser()) return notify("Sua sessão expirou. Entre novamente.");
                const submit = replyForm.querySelector('[type="submit"]');
                const text = replyForm.elements.namedItem("message").value.trim();
                submit.disabled = true;
                const { error } = await supabase.rpc("community_admin_reply_feedback", {
                    p_feedback_id: item.id,
                    p_message: text
                });
                submit.disabled = false;
                if (error) {
                    console.error("Falha ao responder avaliação:", error);
                    return notify("Não foi possível enviar a resposta.");
                }
                notify("Resposta enviada. O titular poderá consultá-la com o código.");
                await load();
            });
            card.append(replyForm);

            const actions = el("div", "admin-toolbar");
            const addAction = (text, fn, cls = "button button--secondary") => {
                const button = el("button", cls, text);
                button.type = "button";
                button.addEventListener("click", fn);
                actions.append(button);
            };
            if (item.status !== "resolved") addAction("Marcar como resolvida", () => setStatus(item.id, "resolved"));
            if (item.status !== "archived") addAction("Arquivar", () => setStatus(item.id, "archived"));
            if (item.status !== "pending") addAction("Reabrir", () => setStatus(item.id, "pending"));
            addAction("Excluir avaliação", async () => {
                const reason = prompt("Motivo da exclusão (somente spam, insultos ou uso indevido):");
                if (reason === null) return;
                if (reason.trim().length < 8) return notify("Descreva um motivo com pelo menos 8 caracteres.");
                if (!confirm("Excluir permanentemente esta avaliação?")) return;
                const { error } = await supabase.rpc("community_admin_delete_feedback", {
                    p_feedback_id: item.id,
                    p_reason: reason.trim()
                });
                if (error) return notify("Não foi possível excluir a avaliação.");
                notify("Avaliação excluída.");
                await load();
            }, "button button--danger");
            card.append(actions);
            list.append(card);
        }
    }

    async function setStatus(id, status) {
        const { error } = await supabase.rpc("community_admin_set_feedback_status", {
            p_feedback_id: id,
            p_status: status
        });
        if (error) return notify("Não foi possível atualizar o status.");
        notify("Status atualizado.");
        await load();
    }

    filter?.addEventListener("change", load);
    await load();
}