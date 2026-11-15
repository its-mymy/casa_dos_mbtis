import { supabase } from "../../core/supabase.js";
import { getCurrentUser, getCurrentProfile } from "../../core/auth.js";
import { notify } from "../../shared/notifications.js";

const categories = ["MBTI", "Eneagrama", "Socionics", "Big Five", "Temperamentos", "Outros", "Geral"];
const dateLabel = value => new Date(value).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
};
const button = (label, action, className = "button button--secondary") => {
    const node = el("button", className, label);
    node.type = "button";
    node.addEventListener("click", action);
    return node;
};
const isAdmin = () => String(getCurrentProfile()?.cargo || "").trim().toLowerCase() === "adm";

async function authors(ids) {
    if (!ids.length) return {};
    const { data } = await supabase.from("profiles").select("id,nome,username").in("id", [...new Set(ids)]);
    return Object.fromEntries((data || []).map(profile => [profile.id, profile]));
}
function authorName(profile) {
    return profile?.nome || (profile?.username ? "@" + profile.username : "Membro");
}

export function initializeTopicComposer(container, reload) {
    const form = el("form", "panel community-composer");
    form.hidden = true;
    form.innerHTML = `
      <div class="form-heading"><div><h3>Nova discussão</h3><p>Compartilhe uma ideia com a comunidade.</p></div></div>
      <label class="form-field"><span>Categoria</span><select name="category" required><option value="">Selecione</option>${categories.map(item => `<option value="${item}">${item}</option>`).join("")}</select></label>
      <label class="form-field"><span>Título</span><input name="title" maxlength="160" minlength="3" required placeholder="Qual é o assunto?"></label>
      <label class="form-field"><span>Texto</span><textarea name="body" rows="5" maxlength="12000" required placeholder="Escreva sua discussão..."></textarea></label>
      <div class="composer-actions"><button class="button button--primary" type="submit">Publicar discussão</button><button class="button button--secondary" type="button" data-cancel>Cancelar</button></div>`;
    form.querySelector("[data-cancel]").addEventListener("click", () => form.hidden = true);
    form.addEventListener("submit", async event => {
        event.preventDefault();
        const user = getCurrentUser();
        if (!user) return notify("Entre na sua conta para publicar.");
        const data = Object.fromEntries(new FormData(form));
        const { error } = await supabase.from("community_topics").insert({ ...data, author_id: user.id });
        if (error) return notify("Não foi possível publicar a discussão.");
        form.reset();
        form.hidden = true;
        notify("Discussão publicada.");
        await reload();
    });
    container.prepend(form);
    return () => { form.hidden = !form.hidden; form.scrollIntoView({ behavior: "smooth", block: "center" }); };
}

export async function loadTopics(list, search = "") {
    list.replaceChildren();
    const { data, error } = await supabase.from("community_topics")
        .select("id,author_id,category,title,body,is_pinned,is_locked,created_at")
        .order("is_pinned", { ascending: false }).order("created_at", { ascending: false }).limit(100);
    if (error) {
        list.append(el("p", "empty-state", "Não foi possível carregar as discussões."));
        return;
    }
    const filtered = (data || []).filter(topic => !search || (topic.title + " " + topic.body + " " + topic.category).toLowerCase().includes(search.toLowerCase()));
    if (!filtered.length) {
        list.append(el("div", "empty-state", search ? "Nenhuma discussão encontrada." : "Ainda não há discussões. Que tal começar?"));
        return;
    }
    const profileMap = await authors(filtered.map(item => item.author_id));
    for (const topic of filtered) {
        const card = el("article", "forum-topic");
        const meta = el("div", "forum-topic__meta", `${topic.category} · ${authorName(profileMap[topic.author_id])} · ${dateLabel(topic.created_at)}`);
        const title = el("h3", "", topic.title);
        const body = el("p", "forum-topic__body", topic.body);
        const actions = el("div", "community-actions");
        const detail = el("div", "forum-topic__discussion");
        detail.hidden = true;
        const open = button("Ver conversa", async () => {
            detail.hidden = !detail.hidden;
            if (!detail.hidden && !detail.dataset.loaded) {
                detail.dataset.loaded = "1";
                await loadComments(topic, detail);
            }
            open.textContent = detail.hidden ? "Ver conversa" : "Ocultar conversa";
        });
        actions.append(open);
        if (getCurrentUser()) actions.append(button("Curtir", () => toggleReaction(topic.id, null, actions), "button button--secondary"));
        if (getCurrentUser()) actions.append(button("Denunciar", () => reportContent(topic.id, null), "button button--secondary"));
        if (getCurrentUser() && (getCurrentUser().id === topic.author_id || isAdmin())) {
            actions.append(button("Editar", async () => {
                const next = prompt("Editar título:", topic.title);
                if (next === null) return;
                const text = prompt("Editar texto:", topic.body);
                if (text === null) return;
                const { error } = await supabase.from("community_topics").update({ title: next.trim(), body: text.trim() }).eq("id", topic.id);
                if (error) return notify("Não foi possível editar.");
                notify("Discussão atualizada.");
                await loadTopics(list, search);
            }));
            actions.append(button("Excluir", async () => {
                if (!confirm("Excluir esta discussão e seus comentários?")) return;
                const { error } = await supabase.from("community_topics").delete().eq("id", topic.id);
                if (error) return notify("Não foi possível excluir.");
                notify("Discussão excluída.");
                await loadTopics(list, search);
            }));
        }
        card.append(meta, title, body, actions, detail);
        list.append(card);
    }
    window.lucide?.createIcons?.();
}

async function toggleReaction(topicId, commentId, actions) {
    const user = getCurrentUser();
    if (!user) return notify("Entre na sua conta para curtir.");
    let query = supabase.from("community_reactions").select("id").eq("user_id", user.id).eq("reaction_type", "like");
    query = commentId ? query.eq("comment_id", commentId) : query.eq("topic_id", topicId);
    const { data } = await query.maybeSingle();
    const result = data
        ? await supabase.from("community_reactions").delete().eq("id", data.id)
        : await supabase.from("community_reactions").insert({ topic_id: topicId, comment_id: commentId, user_id: user.id });
    if (result.error) return notify("Não foi possível atualizar a curtida.");
    notify(data ? "Curtida removida." : "Você curtiu.");
    actions?.querySelectorAll("button")[1]?.blur();
}

async function reportContent(topicId, commentId) {
    const reason = prompt("Motivo da denúncia: spam, assédio, discurso de ódio, conteúdo impróprio, desinformação ou outro.");
    if (!reason) return;
    const normalized = ["spam","assédio","discurso de ódio","conteúdo impróprio","desinformação","outro"].find(item => item === reason.trim().toLowerCase());
    if (!normalized) return notify("Informe uma das categorias sugeridas.");
    const { error } = await supabase.from("community_reports").insert({
        reporter_id: getCurrentUser().id, topic_id: topicId, comment_id: commentId, reason: normalized
    });
    notify(error ? "Não foi possível enviar a denúncia." : "Denúncia enviada à administração.");
}

async function loadComments(topic, target) {
    const { data, error } = await supabase.from("community_comments").select("id,topic_id,author_id,parent_id,body,created_at").eq("topic_id", topic.id).order("created_at");
    if (error) return target.append(el("p", "", "Não foi possível carregar os comentários."));
    const profileMap = await authors((data || []).map(item => item.author_id));
    const comments = data || [];
    const composer = el("form", "comment-composer");
    composer.innerHTML = '<textarea name="body" rows="2" maxlength="6000" required placeholder="Escreva um comentário..."></textarea><button class="button button--primary" type="submit">Comentar</button>';
    composer.addEventListener("submit", async event => {
        event.preventDefault();
        if (!getCurrentUser()) return notify("Entre na sua conta para comentar.");
        const body = composer.elements.namedItem("body").value.trim();
        const { error } = await supabase.from("community_comments").insert({ topic_id: topic.id, author_id: getCurrentUser().id, body });
        if (error) return notify("Não foi possível comentar. Talvez o tópico esteja bloqueado.");
        await loadComments(topic, target);
    });
    const thread = el("div", "forum-comments");
    for (const comment of comments) {
        const item = el("article", "forum-comment");
        item.append(el("div", "forum-topic__meta", `${authorName(profileMap[comment.author_id])} · ${dateLabel(comment.created_at)}`), el("p", "", comment.body));
        const tools = el("div", "community-actions");
        if (getCurrentUser()) tools.append(button("Responder", () => {
            const area = el("form", "comment-composer");
            area.innerHTML = '<textarea name="body" rows="2" maxlength="6000" required placeholder="Sua resposta..."></textarea><button class="button button--primary" type="submit">Enviar resposta</button>';
            area.addEventListener("submit", async event => {
                event.preventDefault();
                const { error } = await supabase.from("community_comments").insert({ topic_id: topic.id, parent_id: comment.id, author_id: getCurrentUser().id, body: area.elements.namedItem("body").value.trim() });
                if (error) return notify("Não foi possível responder.");
                await loadComments(topic, target);
            });
            item.append(area);
        }));
        if (getCurrentUser() && (getCurrentUser().id === comment.author_id || isAdmin())) {
            tools.append(button("Excluir", async () => {
                if (!confirm("Excluir este comentário?")) return;
                const { error } = await supabase.from("community_comments").delete().eq("id", comment.id);
                if (error) return notify("Não foi possível excluir.");
                await loadComments(topic, target);
            }));
        }
        if (getCurrentUser()) {
            tools.append(button("Curtir", () => toggleReaction(null, comment.id, tools)));
            tools.append(button("Denunciar", () => reportContent(null, comment.id)));
        }
        item.append(tools);
        thread.append(item);
    }
    target.replaceChildren(thread, composer);
}
