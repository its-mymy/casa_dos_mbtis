(() => {
    "use strict";

    // Esta é a chave pública publishable/anon já usada pelo site.
    // Nunca coloque service_role ou uma chave secreta no frontend.
    const SUPABASE_URL = "https://lhhoqahzpuohhhnbwgfp.supabase.co";
    const SUPABASE_KEY = "sb_publishable_FTie2ELWKBc4Tz9r5fZuTw_izSaEHao";
    const LOGIN_URL = "../../login/index.html";
    const MAX_MENSAGEM = 500;
    const LIMITE_CARREGAMENTO = 100;

    const el = (id) => document.getElementById(id);
    const lockedState = el("locked-state");
    const chatContent = el("chat-content");
    const messagesBox = el("messages");
    const statusText = el("chat-status");
    const messageForm = el("message-form");
    const messageInput = el("message-input");
    const sendButton = el("send-button");
    const characterCount = el("character-count");
    const topLogin = el("top-login");
    const miniProfile = el("mini-profile");
    const miniAvatar = el("mini-avatar");
    const miniName = el("mini-name");
    const miniUsername = el("mini-username");

    let client = null;
    let currentUser = null;
    let currentProfile = null;
    let channel = null;
    let messageIds = new Set();

   function showLocked() {
    lockedState.classList.remove("hidden");
    chatContent.classList.add("hidden");
    statusText.textContent = "Acesso exclusivo para membros";

    topLogin.classList.remove("hidden");
    miniProfile.classList.add("hidden");
}

function showChat() {
    lockedState.classList.add("hidden");
    chatContent.classList.remove("hidden");

    statusText.textContent = currentProfile?.nome
        ? `Conectado como ${currentProfile.nome}`
        : "Você está conectado";

    topLogin.classList.add("hidden");
    miniProfile.classList.remove("hidden");

    miniAvatar.innerHTML = avatarMarkup(currentProfile);

    miniName.textContent =
        currentProfile?.nome ||
        currentProfile?.username ||
        "Membro";

    const username = normalizeUsername(
        currentProfile?.username
    );

    miniUsername.textContent = username
        ? `@${username}`
        : "@usuario";
}


    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
        })[char]);
    }

    function normalizeUsername(value) {
        return String(value || "").replace(/^@/, "").trim();
    }

    function avatarMarkup(profile) {
        const url = profile?.avatar_url;
        if (url) return `<img src="${escapeHTML(url)}" alt="" loading="lazy">`;
        const preset = String(profile?.avatar_tipo || "");
        if (preset.startsWith("preset:")) return escapeHTML(preset.slice(7));
        return "👤";
    }

    function formatTime(value) {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "";
        return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    }

    function renderMessage(row) {
        if (!row || messageIds.has(row.id)) return;
        messageIds.add(row.id);

        const profile = row.profiles || {};
        const own = row.user_id === currentUser?.id;
        const name = profile.nome || profile.username || "Membro";
        const username = normalizeUsername(profile.username);
        const safeText = window.ChatFiltro
            ? window.ChatFiltro.limpar(row.content)
            : row.content;

        const article = document.createElement("article");
        article.className = `message${own ? " own" : ""}`;
        article.dataset.messageId = row.id;

        const avatar = document.createElement("div");
        avatar.className = "avatar";
        avatar.innerHTML = avatarMarkup(profile);

        const body = document.createElement("div");
        body.className = "message-body";
        body.innerHTML = `
            <div class="message-meta">
                <span class="message-name">${escapeHTML(name)}</span>
                ${username ? `<span class="message-user">@${escapeHTML(username)}</span>` : ""}
                <time class="message-time" datetime="${escapeHTML(row.created_at)}">${formatTime(row.created_at)}</time>
            </div>
            <p class="message-text">${escapeHTML(safeText)}</p>
        `;
        article.append(avatar, body);
        messagesBox.appendChild(article);
    }

    async function getProfile(userId) {
        const { data, error } = await client
            .from("profiles")
            .select("id,nome,username,avatar_url,avatar_tipo")
            .eq("id", userId)
            .maybeSingle();
        if (error) throw error;
        return data || null;
    }

    async function hydrateProfiles(rows) {
        // Busca perfis individualmente para não depender de nomes de relações implícitas.
        const userIds = [...new Set(rows.map(row => row.user_id).filter(Boolean))];
        if (!userIds.length) return rows;

        const { data, error } = await client
            .from("profiles")
            .select("id,nome,username,avatar_url,avatar_tipo")
            .in("id", userIds);
        if (error) throw error;

        const byId = new Map((data || []).map(profile => [profile.id, profile]));
        return rows.map(row => ({ ...row, profiles: byId.get(row.user_id) || {} }));
    }

    async function loadMessages() {
        messagesBox.innerHTML = '<div class="empty-state">Carregando mensagens...</div>';
        messageIds = new Set();

        const { data, error } = await client
            .from("chat_messages")
            .select("id,user_id,content,created_at")
            .order("created_at", { ascending: false })
            .limit(LIMITE_CARREGAMENTO);

        if (error) {
            console.error("Erro ao carregar chat:", error);
            messagesBox.innerHTML = '<div class="empty-state">Não foi possível carregar as mensagens. Confira a configuração SQL e as permissões do Supabase.</div>';
            return;
        }

        const rows = await hydrateProfiles([...(data || [])].reverse());
        messagesBox.innerHTML = "";
        if (!rows.length) {
            messagesBox.innerHTML = '<div class="empty-state">Ainda não há mensagens. Que tal começar a conversa? ✨</div>';
            return;
        }
        rows.forEach(renderMessage);
        scrollToBottom();
    }

    function scrollToBottom() {
        messagesBox.scrollTop = messagesBox.scrollHeight;
    }

    async function sendMessage(event) {
        event.preventDefault();
        const content = messageInput.value.trim();
        if (!currentUser || !content) return;
        if (content.length > MAX_MENSAGEM) {
            alert(`A mensagem pode ter no máximo ${MAX_MENSAGEM} caracteres.`);
            return;
        }

        sendButton.disabled = true;
        try {
            const { data, error } = await client
                .from("chat_messages")
                .insert({ user_id: currentUser.id, content })
                .select("id,user_id,content,created_at")
                .single();

            if (error) throw error;
            const row = { ...data, profiles: currentProfile || {} };
            if (messagesBox.querySelector(".empty-state")) messagesBox.innerHTML = "";
            renderMessage(row);
            messageInput.value = "";
            updateCounter();
            scrollToBottom();
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            alert(error?.message || "Não foi possível enviar. Verifique a configuração do chat.");
        } finally {
            sendButton.disabled = false;
            messageInput.focus();
        }
    }

    function updateCounter() {
        characterCount.textContent = `${messageInput.value.length}/${MAX_MENSAGEM} · sem palavrões pesados ou conteúdo sexual explícito`;
    }

    function subscribeToMessages() {
        if (channel) client.removeChannel(channel);
        channel = client
            .channel("chat-geral-messages")
            .on("postgres_changes", {
                event: "INSERT",
                schema: "public",
                table: "chat_messages"
            }, async payload => {
                try {
                    const [row] = await hydrateProfiles([payload.new]);
                    if (messagesBox.querySelector(".empty-state")) messagesBox.innerHTML = "";
                    renderMessage(row);
                    scrollToBottom();
                } catch (error) {
                    console.error("Erro ao atualizar mensagem:", error);
                }
            })
            .subscribe((status) => {
                if (status === "SUBSCRIBED") statusText.textContent = "Conectado · mensagens em tempo real";
                if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") statusText.textContent = "Reconectando ao chat...";
            });
    }

    async function initialize() {
        if (!window.supabase) {
            statusText.textContent = "Não foi possível iniciar o Supabase";
            lockedState.querySelector("p").textContent = "A biblioteca do Supabase não carregou. Atualize a página e tente novamente.";
            return;
        }

        client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        const { data: { session }, error } = await client.auth.getSession();
        if (error) console.warn("Erro ao recuperar sessão:", error);

        if (!session?.user) {
            showLocked();
            return;
        }

        currentUser = session.user;
        try {
            currentProfile = await getProfile(currentUser.id);
        } catch (error) {
            console.warn("Não foi possível carregar perfil:", error);
            currentProfile = null;
        }

        showChat();
        messageForm.addEventListener("submit", sendMessage);
        messageInput.addEventListener("input", updateCounter);
        await loadMessages();
        subscribeToMessages();

        client.auth.onAuthStateChange((_event, nextSession) => {
            if (!nextSession?.user) {
                if (channel) client.removeChannel(channel);
                window.location.href = LOGIN_URL;
            }
        });
    }

    initialize().catch(error => {
        console.error("Erro ao iniciar chat-geral:", error);
        statusText.textContent = "Erro ao iniciar o chat";
        messagesBox.innerHTML = '<div class="empty-state">O chat não conseguiu iniciar. Confira se o SQL de configuração já foi executado no Supabase.</div>';
    });
})();
