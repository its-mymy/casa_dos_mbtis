import { supabase } from "../../core/supabase.js";
import { getCurrentUser, getCurrentProfile } from "../../core/auth.js";
import { notify } from "../../shared/notifications.js";

const statuses = ["Em análise","Planejado","Em desenvolvimento","Implementado","Não aprovado"];
const el = (tag, cls, text) => { const node = document.createElement(tag); if (cls) node.className = cls; if (text !== undefined) node.textContent = text; return node; };
const isAdmin = () => String(getCurrentProfile()?.cargo || "").trim().toLowerCase() === "adm";
const name = profile => profile?.nome || (profile?.username ? "@" + profile.username : "Membro");
const date = value => new Date(value).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

export async function initializeSuggestions() {
    const view = document.querySelector('[data-view="sugestoes"]');
    const list = view?.querySelector("[data-suggestion-list]");
    const create = view?.querySelector("[data-suggestion-create]");
    const filter = view?.querySelector("[data-suggestion-filter]");
    if (!view || !list || !create) return;

    const composer = el("form", "panel community-composer");
    composer.hidden = true;
    composer.innerHTML = `
      <div class="form-heading"><div><h3>Nova sugestão</h3><p>Descreva uma melhoria para a Casa.</p></div></div>
      <label class="form-field"><span>Título</span><input name="title" minlength="3" maxlength="160" required></label>
      <label class="form-field"><span>Descrição</span><textarea name="body" rows="4" maxlength="8000" required></textarea></label>
      ${isAdmin() ? '<label class="form-field form-check"><input type="checkbox" name="is_official"><span>Publicação oficial da administração</span></label>' : ""}
      <div class="composer-actions"><button class="button button--primary" type="submit">Publicar sugestão</button><button class="button button--secondary" type="button" data-cancel>Cancelar</button></div>`;
    composer.querySelector("[data-cancel]").addEventListener("click", () => composer.hidden = true);
    composer.addEventListener("submit", async event => {
        event.preventDefault();
        const user = getCurrentUser();
        if (!user) return notify("Entre na sua conta para sugerir.");
        const values = Object.fromEntries(new FormData(composer));
        const { error } = await supabase.from("community_suggestions").insert({
            author_id: user.id, title: values.title.trim(), body: values.body.trim(), is_official: isAdmin() && values.is_official === "on"
        });
        if (error) return notify("Não foi possível publicar a sugestão.");
        composer.reset();
        composer.hidden = true;
        notify("Sugestão publicada.");
        await load();
    });
    list.before(composer);
    create.addEventListener("click", () => {
        if (!getCurrentUser()) return window.location.href = "../login/index.html";
        composer.hidden = !composer.hidden;
        composer.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    async function load() {
        list.replaceChildren();
        const { data, error } = await supabase.from("community_suggestions")
            .select("id,author_id,title,body,is_official,created_at,updated_at")
            .order("created_at", { ascending: false }).limit(100);
        if (error) return list.append(el("div", "empty-state", "Não foi possível carregar as sugestões."));
        const suggestions = data || [];
        if (!suggestions.length) return list.append(el("div", "empty-state", "Ainda não há sugestões publicadas."));
        const ids = suggestions.map(item => item.id);
        const [statusResult, voteResult, profileResult] = await Promise.all([
            supabase.from("community_suggestion_status").select("suggestion_id,status,reason,updated_by,updated_at").in("suggestion_id", ids),
            supabase.from("community_suggestion_votes").select("suggestion_id,user_id").in("suggestion_id", ids),
            supabase.from("profiles").select("id,nome,username").in("id", [...new Set(suggestions.map(item => item.author_id))])
        ]);
        const statusMap = Object.fromEntries((statusResult.data || []).map(item => [item.suggestion_id, item]));
        const voteRows = voteResult.data || [];
        const profileMap = Object.fromEntries((profileResult.data || []).map(item => [item.id, item]));
        const filtered = suggestions.filter(item => !filter?.value || (statusMap[item.id]?.status || "Em análise") === filter.value);
        if (!filtered.length) return list.append(el("div", "empty-state", "Nenhuma sugestão neste status."));
        for (const suggestion of filtered) {
            const status = statusMap[suggestion.id] || { status: "Em análise" };
            const votes = voteRows.filter(item => item.suggestion_id === suggestion.id);
            const card = el("article", "suggestion-card");
            const meta = el("div", "forum-topic__meta", `${suggestion.is_official ? "Oficial da administração · " : ""}${name(profileMap[suggestion.author_id])} · ${date(suggestion.created_at)}`);
            const heading = el("h3", "", suggestion.title);
            const body = el("p", "", suggestion.body);
            const state = el("span", "status-pill", status.status);
            const footer = el("div", "suggestion-card__footer");
            const vote = el("button", "button button--secondary", `Apoiar · ${votes.length}`);
            vote.type = "button";
            const voted = votes.some(item => item.user_id === getCurrentUser()?.id);
            if (voted) vote.classList.add("is-voted");
            vote.addEventListener("click", async () => {
                if (!getCurrentUser()) return notify("Entre na sua conta para votar.");
                const existing = votes.find(item => item.user_id === getCurrentUser().id);
                const result = existing
                    ? await supabase.from("community_suggestion_votes").delete().eq("suggestion_id", suggestion.id).eq("user_id", getCurrentUser().id)
                    : await supabase.from("community_suggestion_votes").insert({ suggestion_id: suggestion.id, user_id: getCurrentUser().id });
                if (result.error) return notify("Não foi possível registrar seu voto.");
                await load();
            });
            footer.append(vote, state);
            card.append(meta, heading, body, footer);

            if (getCurrentUser() && (getCurrentUser().id === suggestion.author_id || isAdmin())) {
                const actions = el("div", "community-actions");
                const edit = el("button", "button button--secondary", "Editar");
                edit.type = "button";
                edit.addEventListener("click", async () => {
                    const title = prompt("Editar título:", suggestion.title);
                    if (title === null) return;
                    const text = prompt("Editar descrição:", suggestion.body);
                    if (text === null) return;
                    const result = await supabase.from("community_suggestions").update({ title: title.trim(), body: text.trim() }).eq("id", suggestion.id);
                    if (result.error) return notify("Não foi possível editar.");
                    await load();
                });
                const remove = el("button", "button button--secondary", "Excluir");
                remove.type = "button";
                remove.addEventListener("click", async () => {
                    if (!confirm("Excluir esta sugestão?")) return;
                    const result = await supabase.from("community_suggestions").delete().eq("id", suggestion.id);
                    if (result.error) return notify("Não foi possível excluir.");
                    await load();
                });
                actions.append(edit, remove);
                card.append(actions);
            }
            if (isAdmin()) {
                const admin = el("div", "suggestion-admin");
                const select = el("select", "suggestion-status-select");
                select.setAttribute("aria-label", "Atualizar status da sugestão");
                statuses.forEach(value => {
                    const option = el("option", "", value);
                    option.value = value;
                    option.selected = value === status.status;
                    select.append(option);
                });
                const reason = el("input", "suggestion-reason");
                reason.placeholder = "Motivo ou atualização (opcional)";
                reason.maxLength = 2000;
                const save = el("button", "button button--secondary", "Atualizar status");
                save.type = "button";
                save.addEventListener("click", async () => {
                    const result = await supabase.rpc("community_admin_set_suggestion_status", {
                        p_suggestion_id: suggestion.id, p_status: select.value, p_reason: reason.value.trim() || null
                    });
                    if (result.error) return notify("Não foi possível atualizar o status.");
                    notify("Status atualizado.");
                    await load();
                });
                admin.append(select, reason, save);
                card.append(admin);
                if (status.updated_at) card.append(el("small", "suggestion-updated", `Atualizado em ${date(status.updated_at)}${status.reason ? " · " + status.reason : ""}`));
            }
            list.append(card);
        }
    }
    filter?.addEventListener("change", load);
    await load();
}