import { supabase } from "../../core/supabase.js";
import { getCurrentUser } from "../../core/auth.js";
import { notify } from "../../shared/notifications.js";

const el = (tag, cls, text) => { const node = document.createElement(tag); if (cls) node.className = cls; if (text !== undefined) node.textContent = text; return node; };

export async function initializeModeration() {
    const list = document.querySelector("[data-admin-reports]");
    if (!list) return;
    list.replaceChildren();
    const { data: reports, error } = await supabase.from("community_reports")
        .select("id,reporter_id,topic_id,comment_id,reason,details,status,created_at")
        .in("status", ["pending","reviewing"]).order("created_at", { ascending: false }).limit(100);
    if (error) return list.append(el("p", "", "Não foi possível carregar as denúncias."));
    if (!reports?.length) return list.append(el("p", "", "Nenhuma denúncia pendente."));

    for (const report of reports) {
        const card = el("article", "admin-record");
        const targetTable = report.topic_id ? "community_topics" : "community_comments";
        const targetId = report.topic_id || report.comment_id;
        const { data: target } = await supabase.from(targetTable).select(report.topic_id ? "title,body" : "body").eq("id", targetId).maybeSingle();
        const heading = el("h3", "", report.topic_id ? (target?.title || "Discussão removida") : "Comentário denunciado");
        const content = el("p", "", target?.body || "O conteúdo denunciado não está mais disponível.");
        const meta = el("small", "", `Motivo: ${report.reason} · ${new Date(report.created_at).toLocaleString("pt-BR")}`);
        const details = el("p", "", report.details || "");
        const actions = el("div", "admin-toolbar");
        const updateStatus = async status => {
            const { error } = await supabase.from("community_reports").update({
                status, reviewed_by: getCurrentUser()?.id || null, reviewed_at: new Date().toISOString()
            }).eq("id", report.id);
            if (error) return notify("Não foi possível atualizar a denúncia.");
            notify("Denúncia atualizada.");
            await initializeModeration();
        };
        const actionButton = (label, fn) => {
            const button = el("button", "button button--secondary", label);
            button.type = "button";
            button.addEventListener("click", fn);
            return button;
        };
        actions.append(actionButton("Em análise", () => updateStatus("reviewing")));
        actions.append(actionButton("Encerrar", () => updateStatus("resolved")));
        actions.append(actionButton("Ignorar", () => updateStatus("dismissed")));
        actions.append(actionButton("Excluir conteúdo", async () => {
            if (!confirm("Excluir o conteúdo denunciado? Essa ação não pode ser desfeita.")) return;
            const { error } = await supabase.from(targetTable).delete().eq("id", targetId);
            if (error) return notify("Não foi possível excluir o conteúdo.");
            await updateStatus("resolved");
        }));
        card.append(heading, content, meta);
        if (report.details) card.append(details);
        card.append(actions);
        list.append(card);
    }
}