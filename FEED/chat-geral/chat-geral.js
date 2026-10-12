
(() => {
    "use strict";

    const SUPABASE_URL = "https://lhhoqahzpuohhhnbwgfp.supabase.co";
    const SUPABASE_KEY = "sb_publishable_FTie2ELWKBc4Tz9r5fZuTw_izSaEHao";
    const LOGIN_URL = "../../login/index.html";
    const MAX_MENSAGEM = 500;
    const LIMITE_CARREGAMENTO = 100;

    const el = id => document.getElementById(id);

    const lockedState = el("locked-state");
    const chatContent = el("chat-content");
    const messagesBox = el("messages");
    const statusText = el("chat-status");
    const messageForm = el("message-form");
    const messageInput = el("message-input");
    const sendButton = el("send-button");
    const characterCount = el("character-count");
    const topLogin = el("top-login");

    const chatAdminControls = el("chat-admin-controls");
    const chatAdminState = el("chat-admin-state");
    const toggleChatStateButton = el("toggle-chat-state");
    const chatClosedNotice = el("chat-closed-notice");

    const openMutedMembersButton = el("open-muted-members");
    const closeMutedMembersButton = el("close-muted-members");
    const mutedMembersPanel = el("muted-members-panel");
    const mutedMembersList = el("muted-members-list");
    const mutedCount = el("muted-count");

    const moderationModal = el("moderation-modal");
    const moderationModalIcon = el("moderation-modal-icon");
    const moderationModalTitle = el("moderation-modal-title");
    const moderationModalDescription = el("moderation-modal-description");
    const confirmModerationButton = el("confirm-moderation");
    const cancelModerationButton = el("cancel-moderation");
    const moderationModalBackdrop = el("moderation-modal-backdrop");

    const miniProfile = el("mini-profile");
    const miniAvatar = el("mini-avatar");
    const miniName = el("mini-name");
    const miniUsername = el("mini-username");

    let client = null;
    let currentUser = null;
    let currentProfile = null;

    let channel = null;
    let settingsChannel = null;
    let muteChannel = null;

    let messageIds = new Set();
    let mutedUserIds = new Set();
    let chatIsOpen = true;
    let settingsVerified = false;
    let moderationResolver = null;

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }

    function normalizeUsername(value) {
        return String(value || "").replace(/^@/, "").trim();
    }

    function isAdmin(profile = currentProfile) {
        return String(profile?.cargo || "")
            .trim()
            .toLowerCase() === "adm";
    }

    function avatarMarkup(profile) {
        const url = profile?.avatar_url;

        if (url) {
            return `<img src="${escapeHTML(url)}" alt="" loading="lazy">`;
        }

        const preset = String(profile?.avatar_tipo || "");

        if (preset.startsWith("preset:")) {
            return escapeHTML(preset.slice(7));
        }

        return "👤";
    }

    function formatTime(value) {
        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        return date.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    function showLocked() {
        lockedState?.classList.remove("hidden");
        chatContent?.classList.add("hidden");
        topLogin?.classList.remove("hidden");
        miniProfile?.classList.add("hidden");
        chatAdminControls?.classList.add("hidden");
        chatClosedNotice?.classList.add("hidden");
        mutedMembersPanel?.classList.add("hidden");

        if (statusText) {
            statusText.textContent = "Acesso exclusivo para membros";
        }
    }

    function showChat() {
        lockedState?.classList.add("hidden");
        chatContent?.classList.remove("hidden");
        topLogin?.classList.add("hidden");
        miniProfile?.classList.remove("hidden");

        if (statusText) {
            statusText.textContent = currentProfile?.nome
                ? `Conectado como ${currentProfile.nome}`
                : "Você está conectado";
        }

        if (miniAvatar) {
            miniAvatar.innerHTML = avatarMarkup(currentProfile);
        }

        if (miniName) {
            miniName.textContent =
                currentProfile?.nome ||
                currentProfile?.username ||
                "Membro";
        }

        const username = normalizeUsername(currentProfile?.username);

        if (miniUsername) {
            miniUsername.textContent = username
                ? `@${username}`
                : "@usuario";
        }
    }

    function applyMuteStatus() {
        const admin = isAdmin();
        const silenciado = !admin &&
            !!currentUser &&
            mutedUserIds.has(currentUser.id);

        const bloqueado = silenciado ||
            (!admin && (!chatIsOpen || !settingsVerified));

        if (messageInput) {
            messageInput.disabled = bloqueado;

            if (silenciado) {
                messageInput.placeholder = "Sua escrita foi suspensa pela administração.";
            } else if (!settingsVerified) {
                messageInput.placeholder = "Não foi possível verificar o estado do chat.";
            } else if (!chatIsOpen && !admin) {
                messageInput.placeholder = "O chat está fechado.";
            } else {
                messageInput.placeholder = "Escreva uma mensagem...";
            }
        }

        if (sendButton) {
            sendButton.disabled = bloqueado;
        }

        if (characterCount) {
            if (silenciado) {
                characterCount.textContent = "Sua escrita foi suspensa pela administração.";
            } else if (!settingsVerified) {
                characterCount.textContent = "Envio temporariamente bloqueado.";
            } else if (!chatIsOpen && !admin) {
                characterCount.textContent = "O chat está fechado para novas mensagens.";
            } else {
                characterCount.textContent =
                    `${messageInput?.value.length || 0}/${MAX_MENSAGEM} · sem palavrões pesados ou conteúdo sexual explícito`;
            }
        }
    }

    async function getProfile(userId) {
        const { data, error } = await client
            .from("profiles")
            .select("id,nome,username,avatar_url,avatar_tipo,cargo")
            .eq("id", userId)
            .maybeSingle();

        if (error) {
            throw error;
        }

        return data || null;
    }

    async function loadMuteState() {
        const { data, error } = await client
            .from("chat_user_mutes")
            .select("user_id")
            .eq("is_muted", true);

        if (error) {
            throw error;
        }

        mutedUserIds = new Set((data || []).map(item => item.user_id));

        applyMuteStatus();
        syncMuteButtons();
        updateMutedCount();
    }

    async function loadChatSettings() {
        const { data, error } = await client
            .from("chat_settings")
            .select("id,is_open")
            .eq("id", 1)
            .maybeSingle();

        if (error) {
            throw error;
        }

        if (!data) {
            throw new Error("Configuração do chat não encontrada.");
        }

        chatIsOpen = data.is_open === true;
        settingsVerified = true;
    }

    function applyChatState() {
        const admin = isAdmin();

        chatAdminControls?.classList.toggle("hidden", !admin);
        chatClosedNotice?.classList.toggle("hidden", chatIsOpen || admin);

        if (chatAdminState) {
            chatAdminState.textContent = chatIsOpen
                ? "O chat está aberto para os membros."
                : "O chat está fechado para os membros.";
        }

        if (toggleChatStateButton) {
            toggleChatStateButton.textContent = chatIsOpen
                ? "🔒 Fechar chat"
                : "🔓 Reabrir chat";
        }

        applyMuteStatus();
    }

    async function toggleChatState() {
        if (!isAdmin() || !currentUser || !settingsVerified) {
            return;
        }

        toggleChatStateButton.disabled = true;

        try {
            const { data, error } = await client
                .from("chat_settings")
                .update({
                    is_open: !chatIsOpen,
                    updated_at: new Date().toISOString(),
                    updated_by: currentUser.id
                })
                .eq("id", 1)
                .select("id,is_open")
                .single();

            if (error) {
                throw error;
            }

            chatIsOpen = data.is_open === true;
            applyChatState();
        } catch (error) {
            console.error("Erro ao alterar estado do chat:", error);
            showModerationMessage(
                "Não foi possível alterar o chat",
                error?.message || "Verifique as permissões do Supabase.",
                "⚠️"
            );
        } finally {
            toggleChatStateButton.disabled = false;
        }
    }

    function subscribeToChatSettings() {
        if (settingsChannel) {
            client.removeChannel(settingsChannel);
        }

        settingsChannel = client
            .channel("chat-settings-state")
            .on("postgres_changes", {
                event: "UPDATE",
                schema: "public",
                table: "chat_settings",
                filter: "id=eq.1"
            }, payload => {
                chatIsOpen = payload.new.is_open === true;
                settingsVerified = true;
                applyChatState();
            })
            .subscribe();
    }

    function syncMuteButtons() {
        document.querySelectorAll(".mute-member-button").forEach(button => {
            const userId = button.dataset.userId;

            button.textContent = mutedUserIds.has(userId)
                ? "🔊 Retirar punição"
                : "🔇 Silenciar";
        });
    }

    function updateMutedCount() {
        if (mutedCount) {
            mutedCount.textContent = isAdmin()
                ? String(mutedUserIds.size)
                : "0";
        }
    }

    function openModerationModal(options = {}) {
        if (!moderationModal) {
            return Promise.resolve(false);
        }

        if (moderationResolver) {
            moderationResolver(false);
            moderationResolver = null;
        }

        moderationModalIcon.textContent = options.icon || "🔇";
        moderationModalTitle.textContent = options.title || "Confirmar ação";
        moderationModalDescription.textContent =
            options.description || "Deseja realmente realizar esta ação?";
        confirmModerationButton.textContent = options.confirmText || "Confirmar";

        confirmModerationButton.classList.toggle(
            "danger",
            options.danger === true
        );

        moderationModal.classList.remove("hidden");

        return new Promise(resolve => {
            moderationResolver = resolve;
            confirmModerationButton.focus();
        });
    }

    function closeModerationModal(confirmed) {
        moderationModal?.classList.add("hidden");

        if (moderationResolver) {
            const resolve = moderationResolver;
            moderationResolver = null;
            resolve(confirmed);
        }
    }

    function showModerationMessage(title, description, icon = "✅") {
        return openModerationModal({
            icon,
            title,
            description,
            confirmText: "Entendi"
        });
    }

    function setupModerationModal() {
        confirmModerationButton?.addEventListener("click", () => {
            closeModerationModal(true);
        });

        cancelModerationButton?.addEventListener("click", () => {
            closeModerationModal(false);
        });

        moderationModalBackdrop?.addEventListener("click", () => {
            closeModerationModal(false);
        });

        document.addEventListener("keydown", event => {
            if (
                event.key === "Escape" &&
                !moderationModal?.classList.contains("hidden")
            ) {
                closeModerationModal(false);
            }
        });
    }

    async function deleteChatMessage(row, article) {
        if (!isAdmin() || !row?.id) {
            return;
        }

        const confirmed = await openModerationModal({
            icon: "🗑️",
            title: "Apagar mensagem?",
            description: "Esta mensagem será removida do chat para todos os participantes. Essa ação não pode ser desfeita.",
            confirmText: "Apagar mensagem",
            danger: true
        });

        if (!confirmed) {
            return;
        }

        try {
            const { data, error } = await client
                .from("chat_messages")
                .delete()
                .eq("id", row.id)
                .select("id")
                .maybeSingle();

            if (error) {
                throw error;
            }

            if (!data) {
                throw new Error("A mensagem não foi removida. Confira suas permissões.");
            }

            article.remove();
            messageIds.delete(row.id);
            showEmptyStateIfNeeded();

            chatAdminState.textContent = "Mensagem removida com sucesso.";
        } catch (error) {
            console.error("Erro ao apagar mensagem:", error);
            await showModerationMessage(
                "Não foi possível apagar",
                error?.message || "Verifique as permissões do Supabase.",
                "⚠️"
            );
        }
    }

    async function toggleMemberMute(userId, name) {
        if (!isAdmin() || !currentUser || !userId) {
            return;
        }

        if (userId === currentUser.id) {
            await showModerationMessage(
                "Ação não permitida",
                "Você não pode aplicar uma punição à própria conta.",
                "⚠️"
            );
            return;
        }

        const jaSilenciado = mutedUserIds.has(userId);
        const confirmed = await openModerationModal({
            icon: jaSilenciado ? "🔊" : "🔇",
            title: jaSilenciado ? "Retirar punição?" : "Silenciar membro?",
            description: jaSilenciado
                ? `Deseja liberar novamente a escrita de ${name}?`
                : `Deseja impedir ${name} de enviar mensagens até que a administração retire a punição? As mensagens antigas serão mantidas.`,
            confirmText: jaSilenciado ? "Retirar punição" : "Aplicar punição",
            danger: !jaSilenciado
        });

        if (!confirmed) {
            return;
        }

        try {
            let result;

            if (jaSilenciado) {
                result = await client
                    .from("chat_user_mutes")
                    .update({ is_muted: false })
                    .eq("user_id", userId)
                    .select("user_id")
                    .maybeSingle();
            } else {
                result = await client
                    .from("chat_user_mutes")
                    .upsert({
                        user_id: userId,
                        reason: "Decisão da administração",
                        created_by: currentUser.id,
                        is_muted: true
                    }, { onConflict: "user_id" })
                    .select("user_id")
                    .single();
            }

            if (result.error) {
                throw result.error;
            }

            if (!result.data) {
                throw new Error("A alteração da punição não foi confirmada.");
            }

            await loadMuteState();

            if (isAdmin()) {
                await loadMutedMembers();
            }

            await showModerationMessage(
                jaSilenciado ? "Punição retirada" : "Membro silenciado",
                jaSilenciado
                    ? `${name} pode voltar a enviar mensagens, desde que o chat esteja aberto.`
                    : `${name} não poderá enviar mensagens até que um ADM retire a punição.`,
                jaSilenciado ? "✅" : "🔇"
            );
        } catch (error) {
            console.error("Erro ao alterar punição:", error);
            await showModerationMessage(
                "Não foi possível alterar a punição",
                error?.message || "Verifique as permissões do Supabase.",
                "⚠️"
            );
        }
    }

    async function loadMutedMembers() {
        if (!isAdmin()) {
            return;
        }

        mutedMembersList.innerHTML =
            '<p class="muted-members-empty">Carregando membros...</p>';

        const { data: mutes, error } = await client
            .from("chat_user_mutes")
            .select("user_id,reason,created_at")
            .eq("is_muted", true)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Erro ao carregar silenciados:", error);
            mutedMembersList.innerHTML =
                '<p class="muted-members-empty">Não foi possível carregar a lista. Confira as permissões do Supabase.</p>';
            return;
        }

        const activeMutes = mutes || [];
        mutedCount.textContent = String(activeMutes.length);

        if (!activeMutes.length) {
            mutedMembersList.innerHTML =
                '<p class="muted-members-empty">Nenhum membro está silenciado no momento. ✨</p>';
            return;
        }

        const userIds = activeMutes.map(item => item.user_id);
        const { data: profiles, error: profilesError } = await client
            .from("profiles")
            .select("id,nome,username,avatar_url,avatar_tipo")
            .in("id", userIds);

        if (profilesError) {
            console.error("Erro ao carregar perfis dos silenciados:", profilesError);
        }

        const profilesById = new Map(
            (profiles || []).map(profile => [profile.id, profile])
        );

        mutedMembersList.innerHTML = "";

        activeMutes.forEach(mute => {
            const profile = profilesById.get(mute.user_id) || {};
            const name = profile.nome || profile.username || "Membro";
            const username = normalizeUsername(profile.username);

            const item = document.createElement("div");
            item.className = "muted-member-item";

            const avatar = document.createElement("div");
            avatar.className = "muted-member-avatar";
            avatar.innerHTML = avatarMarkup(profile);

            const info = document.createElement("div");
            info.className = "muted-member-info";

            const memberName = document.createElement("strong");
            memberName.textContent = name;

            const memberUsername = document.createElement("span");
            memberUsername.textContent = username ? `@${username}` : "Sem username";

            const memberStatus = document.createElement("small");
            memberStatus.textContent = mute.reason || "Punição administrativa";

            info.append(memberName, memberUsername, memberStatus);

            const unmuteButton = document.createElement("button");
            unmuteButton.type = "button";
            unmuteButton.className = "message-admin-button unmute-member-button";
            unmuteButton.textContent = "🔊 Retirar punição";
            unmuteButton.addEventListener("click", () => {
                toggleMemberMute(mute.user_id, name);
            });

            item.append(avatar, info, unmuteButton);
            mutedMembersList.appendChild(item);
        });
    }

    function setupMutedMembersPanel() {
        openMutedMembersButton?.addEventListener("click", async () => {
            if (!isAdmin()) {
                return;
            }

            mutedMembersPanel.classList.toggle("hidden");

            if (!mutedMembersPanel.classList.contains("hidden")) {
                await loadMutedMembers();
            }
        });

        closeMutedMembersButton?.addEventListener("click", () => {
            mutedMembersPanel.classList.add("hidden");
        });
    }

    function subscribeToMuteChanges() {
        if (muteChannel) {
            client.removeChannel(muteChannel);
        }

        const config = {
            event: "*",
            schema: "public",
            table: "chat_user_mutes"
        };

        if (!isAdmin()) {
            config.filter = `user_id=eq.${currentUser.id}`;
        }

        muteChannel = client
            .channel(`chat-mutes-${currentUser.id}`)
            .on("postgres_changes", config, async () => {
                try {
                    await loadMuteState();

                    if (
                        isAdmin() &&
                        !mutedMembersPanel.classList.contains("hidden")
                    ) {
                        await loadMutedMembers();
                    }
                } catch (error) {
                    console.error("Erro ao sincronizar punições:", error);

                    if (!isAdmin()) {
                        mutedUserIds.add(currentUser.id);
                        applyMuteStatus();
                    }
                }
            })
            .subscribe();
    }

    
function renderMessage(row) {
    if (!row || messageIds.has(row.id)) {
        return;
    }

    messageIds.add(row.id);

    const profile = row.profiles || {};
    const own = row.user_id === currentUser?.id;

    const safeText = window.ChatFiltro
        ? window.ChatFiltro.limpar(row.content)
        : row.content;

    const article = document.createElement("article");
    article.className = `message${own ? " own" : ""}`;
    article.dataset.messageId = row.id;

    const perfil = window.ChatPerfilMensagem.criarCabecalho({
        userId: row.user_id,
        profile,
        createdAt: row.created_at
    });

    const body = document.createElement("div");
    body.className = "message-body";

    body.appendChild(perfil.meta);

    const text = document.createElement("p");
    text.className = "message-text";
    text.textContent = safeText;
    body.appendChild(text);

    article.append(perfil.avatar, body);

    if (isAdmin() && !own && row.user_id) {
        const actions = document.createElement("div");
        actions.className = "message-admin-actions";

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "message-admin-button delete-message-button";
        deleteButton.textContent = "🗑️ Apagar";
        deleteButton.addEventListener("click", () => {
            deleteChatMessage(row, article);
        });

        actions.appendChild(deleteButton);

        if (!isAdmin(profile)) {
            const muteButton = document.createElement("button");
            muteButton.type = "button";
            muteButton.className = "message-admin-button mute-member-button";
            muteButton.dataset.userId = row.user_id;
            muteButton.textContent = mutedUserIds.has(row.user_id)
                ? "🔊 Retirar punição"
                : "🔇 Silenciar";

            muteButton.addEventListener("click", () => {
                toggleMemberMute(row.user_id, profile.nome || profile.username || "Membro");
            });

            actions.appendChild(muteButton);
        }

        article.appendChild(actions);
    }

    messagesBox.appendChild(article);
}

    async function hydrateProfiles(rows) {
        const userIds = [...new Set(rows.map(row => row.user_id).filter(Boolean))];

        if (!userIds.length) {
            return rows;
        }

        const { data, error } = await client
            .from("profiles")
            .select("id,nome,username,avatar_url,avatar_tipo,cargo")
            .in("id", userIds);

        if (error) {
            throw error;
        }

        const profilesById = new Map(
            (data || []).map(profile => [profile.id, profile])
        );

        return rows.map(row => ({
            ...row,
            profiles: profilesById.get(row.user_id) || {}
        }));
    }

    function showEmptyStateIfNeeded() {
        if (!messagesBox.querySelector(".message")) {
            messagesBox.innerHTML =
                '<div class="empty-state">Ainda não há mensagens. Que tal começar a conversa? ✨</div>';
        }
    }

    function removeMessageFromView(messageId) {
        if (!messageId) {
            return;
        }

        messagesBox.querySelectorAll(".message").forEach(article => {
            if (article.dataset.messageId === String(messageId)) {
                article.remove();
            }
        });

        messageIds.delete(messageId);
        showEmptyStateIfNeeded();
    }

    async function loadMessages() {
        messagesBox.innerHTML =
            '<div class="empty-state">Carregando mensagens...</div>';

        messageIds = new Set();

        const { data, error } = await client
            .from("chat_messages")
            .select("id,user_id,content,created_at")
            .order("created_at", { ascending: false })
            .limit(LIMITE_CARREGAMENTO);

        if (error) {
            console.error("Erro ao carregar chat:", error);
            messagesBox.innerHTML =
                '<div class="empty-state">Não foi possível carregar as mensagens. Confira as permissões do Supabase.</div>';
            return;
        }

        const rows = await hydrateProfiles([...(data || [])].reverse());

        messagesBox.innerHTML = "";

        if (!rows.length) {
            showEmptyStateIfNeeded();
            return;
        }

      rows.forEach(renderMessage);
scrollToBottom(true);
    }

   function isNearBottom() {
    return messagesBox.scrollHeight -
        messagesBox.scrollTop -
        messagesBox.clientHeight <= 120;
}

function scrollToBottom(force = false) {
    if (!messagesBox) {
        return;
    }

    if (!force && !isNearBottom()) {
        return;
    }

    messagesBox.scrollTop = messagesBox.scrollHeight;
}
    async function sendMessage(event) {
        event.preventDefault();

        const content = messageInput.value.trim();

        if (!currentUser || !content) {
            return;
        }

        const admin = isAdmin();

        if (!settingsVerified) {
            await showModerationMessage(
                "Chat indisponível",
                "Não foi possível verificar se o chat está aberto.",
                "⚠️"
            );
            applyMuteStatus();
            return;
        }

        if (!admin && !chatIsOpen) {
            await showModerationMessage(
                "Chat fechado",
                "A administração fechou o chat para novas mensagens.",
                "🔒"
            );
            applyMuteStatus();
            return;
        }

        if (!admin && mutedUserIds.has(currentUser.id)) {
            await showModerationMessage(
                "Escrita suspensa",
                "Sua conta está impedida de enviar mensagens até que um ADM retire a punição.",
                "🔇"
            );
            applyMuteStatus();
            return;
        }

        if (content.length > MAX_MENSAGEM) {
            await showModerationMessage(
                "Mensagem muito longa",
                `A mensagem pode ter no máximo ${MAX_MENSAGEM} caracteres.`,
                "⚠️"
            );
            return;
        }

        sendButton.disabled = true;

        try {
            const { data, error } = await client
                .from("chat_messages")
                .insert({ user_id: currentUser.id, content })
                .select("id,user_id,content,created_at")
                .single();

            if (error) {
                throw error;
            }

            const row = { ...data, profiles: currentProfile || {} };

            if (messagesBox.querySelector(".empty-state")) {
                messagesBox.innerHTML = "";
            }

            renderMessage(row);
            messageInput.value = "";
            updateCounter();
            scrollToBottom(true);
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);

            await showModerationMessage(
                "Não foi possível enviar",
                error?.message || "Confira se o chat está aberto e se sua conta pode escrever.",
                "⚠️"
            );
        } finally {
            applyMuteStatus();

            if (!messageInput.disabled) {
                messageInput.focus();
            }
        }
    }

    function updateCounter() {
        applyMuteStatus();
    }

  function subscribeToMessages() {
    if (channel) {
        client.removeChannel(channel);
    }

    channel = client
        .channel("chat-geral-messages")
        .on("postgres_changes", {
            event: "INSERT",
            schema: "public",
            table: "chat_messages"
        }, async payload => {
            try {
                const shouldFollow = isNearBottom();
                const [row] = await hydrateProfiles([payload.new]);

                if (messagesBox.querySelector(".empty-state")) {
                    messagesBox.innerHTML = "";
                }

                renderMessage(row);

                if (shouldFollow) {
                    scrollToBottom(true);
                }
            } catch (error) {
                console.error("Erro ao receber mensagem:", error);
            }
        })
        .on("postgres_changes", {
            event: "DELETE",
            schema: "public",
            table: "chat_messages"
        }, payload => {
            removeMessageFromView(payload.old?.id);
        })
        .subscribe(status => {
            if (status === "SUBSCRIBED") {
                statusText.textContent =
                    "Conectado · mensagens em tempo real";
            }

            if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
                statusText.textContent = "Reconectando ao chat...";
            }
        });
}

    async function initialize() {
        if (!window.supabase) {
            statusText.textContent = "Não foi possível iniciar o Supabase";
            lockedState.querySelector("p").textContent =
                "A biblioteca do Supabase não carregou. Atualize a página e tente novamente.";
            return;
        }

        client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

        const { data: { session }, error } = await client.auth.getSession();

        if (error) {
            console.warn("Erro ao recuperar sessão:", error);
        }

        if (!session?.user) {
            showLocked();
            return;
        }

        currentUser = session.user;

        try {
            currentProfile = await getProfile(currentUser.id);
        } catch (error) {
            console.warn("Não foi possível carregar o perfil:", error);
            currentProfile = null;
        }

        try {
            await loadChatSettings();
        } catch (error) {
            console.error("Não foi possível verificar o estado do chat:", error);
            chatIsOpen = false;
            settingsVerified = false;
        }

        try {
            await loadMuteState();
        } catch (error) {
            console.error("Não foi possível verificar as punições:", error);
            showChat();

            messageInput.disabled = true;
            sendButton.disabled = true;
            characterCount.textContent =
                "Não foi possível verificar suas permissões. O envio foi bloqueado.";
            return;
        }

        setupModerationModal();
        setupMutedMembersPanel();

        showChat();
        applyChatState();

        toggleChatStateButton?.addEventListener("click", toggleChatState);

        messageForm.addEventListener("submit", sendMessage);
        messageInput.addEventListener("input", updateCounter);

        await loadMessages();

        subscribeToMessages();
        subscribeToChatSettings();
        subscribeToMuteChanges();

        client.auth.onAuthStateChange((_event, nextSession) => {
            if (!nextSession?.user) {
                if (channel) client.removeChannel(channel);
                if (settingsChannel) client.removeChannel(settingsChannel);
                if (muteChannel) client.removeChannel(muteChannel);

                window.location.href = LOGIN_URL;
            }
        });
    }

    initialize().catch(error => {
        console.error("Erro ao iniciar chat-geral:", error);

        statusText.textContent = "Erro ao iniciar o chat";
        messageInput.disabled = true;
        sendButton.disabled = true;

        messagesBox.innerHTML =
            '<div class="empty-state">O chat não conseguiu iniciar. Confira a configuração SQL e as permissões do Supabase.</div>';
    });
})();
