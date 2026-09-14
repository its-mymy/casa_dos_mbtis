
(() => {
    "use strict";

    const supabaseClient = window.supabaseClient;

    const NTP_EDITORES = [
        "yu",
        "uriel"
    ];

    let usuarioAtual = null;
    let perfilAtual = null;
    let membrosNTP = [];
    let seguindoIds = new Set();

    function $(id) {
        return document.getElementById(id);
    }

    function normalizar(valor) {
        return String(valor || "").trim().replace(/^@/, "").toLowerCase();
    }

    function escaparHTML(valor) {
        return String(valor ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function formatarTexto(valor) {
        return escaparHTML(valor).replace(/\n/g, "<br>");
    }

    function formatarData(data) {
        if (!data) return "";

        const d = new Date(data);

        return d.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }) + " às " + d.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    function mostrar(elemento) {
        if (!elemento) return;
        elemento.classList.remove("hidden");
    }

    function esconder(elemento) {
        if (!elemento) return;
        elemento.classList.add("hidden");
    }

    function mostrarToast(mensagem) {
        const toast = $("toast");

        if (!toast) return;

        toast.textContent = mensagem;
        toast.classList.add("mostrar");

        clearTimeout(toast._timer);

        toast._timer = setTimeout(() => {
            toast.classList.remove("mostrar");
        }, 3000);
    }

    function resolverURLAvatar(url) {
        if (!url) return null;

        const texto = String(url).trim();

        if (!texto) return null;

        if (texto.startsWith("http://") || texto.startsWith("https://")) {
            return texto;
        }

        const { data } = supabaseClient.storage
            .from("avatar")
            .getPublicUrl(texto);

        return data?.publicUrl || null;
    }

    function podePublicar() {
        if (!usuarioAtual || !perfilAtual) {
            return false;
        }

        return NTP_EDITORES.includes(
            normalizar(perfilAtual.username)
        );
    }


    /* =========================================================
       SESSÃO
    ========================================================= */

    async function carregarSessao() {
        const { data, error } = await supabaseClient.auth.getSession();

        if (error) {
            console.error("Erro ao carregar sessão:", error);
            return;
        }

        usuarioAtual = data?.session?.user || null;

        await carregarPerfil();
        atualizarAreaPublicacao();
    }

    async function carregarPerfil() {
        perfilAtual = null;

        if (!usuarioAtual) {
            atualizarMiniPerfil();
            atualizarAreaPublicacao();
            return;
        }

        const { data, error } = await supabaseClient
            .from("profiles")
            .select(`
                id,
                nome,
                username,
                mbti,
                eneagrama,
                tritype,
                subtipo,
                avatar_url,
                avatar_tipo,
                cargo,
                vip,
                feed_admin
            `)
            .eq("id", usuarioAtual.id)
            .maybeSingle();

        if (error) {
            console.error("Erro ao carregar perfil:", error);
            atualizarMiniPerfil();
            atualizarAreaPublicacao();
            return;
        }

        perfilAtual = data || null;

        atualizarMiniPerfil();
        atualizarAreaPublicacao();
    }


    /* =========================================================
       PERFIL DO TOPO
    ========================================================= */

    function atualizarMiniPerfil() {
        const avatar = $("mini-avatar");
        const nome = $("mini-name");
        const username = $("mini-username");

        if (!perfilAtual) {
            if (avatar) avatar.innerHTML = "👤";
            if (nome) nome.textContent = "Visitante";
            if (username) username.textContent = "Entrar";
            return;
        }

        const nomeFinal = perfilAtual.nome || perfilAtual.username || "Membro";
        const usernameFinal = normalizar(perfilAtual.username);

        if (nome) {
            nome.textContent = nomeFinal;
        }

        if (username) {
            username.textContent = usernameFinal ? `@${usernameFinal}` : "Membro";
        }

        if (avatar) {
            const url = resolverURLAvatar(perfilAtual.avatar_url);

            if (url) {
                avatar.innerHTML = `
                    <img src="${escaparHTML(url)}" alt="Foto de perfil">
                `;
            } else if (perfilAtual.avatar_tipo?.startsWith("preset:")) {
                avatar.textContent = perfilAtual.avatar_tipo.replace("preset:", "");
            } else {
                avatar.textContent = "👤";
            }
        }
    }

    $("mini-profile")?.addEventListener("click", event => {
        if (!usuarioAtual) {
            event.preventDefault();
            window.location.href = "../login/";
        }
    });


    /* =========================================================
       PUBLICAÇÃO
    ========================================================= */

    function atualizarAreaPublicacao() {
        const composer = $("composer");
        const loginMessage = $("login-message");

        if (!composer) return;

        if (!usuarioAtual) {
            esconder(composer);
            mostrar(loginMessage);
            return;
        }

        esconder(loginMessage);

        if (podePublicar()) {
            mostrar(composer);
        } else {
            esconder(composer);
        }
    }


    /* =========================================================
       NAVEGAÇÃO FEED / MEMBROS
    ========================================================= */

    const feedNav = $("feed-nav");
    const membersNav = $("members-nav");
    const feedView = $("feed-view");
    const membersView = $("members-view");

    function trocarView(view) {
        const mostrarFeed = view === "feed";

        feedView?.classList.toggle("active-view", mostrarFeed);
        membersView?.classList.toggle("active-view", !mostrarFeed);

        feedNav?.classList.toggle("ativo", mostrarFeed);
        membersNav?.classList.toggle("ativo", !mostrarFeed);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        if (mostrarFeed) {
            carregarFeed();
        } else {
            carregarMembrosNTP();
        }
    }

    feedNav?.addEventListener("click", () => {
        trocarView("feed");
    });

    membersNav?.addEventListener("click", () => {
        trocarView("members");
    });


    /* =========================================================
       MEMBROS NTP
    ========================================================= */

    async function carregarMembrosNTP() {
        const grid = $("members-grid");
        const message = $("members-message");

        if (!grid) return;

        grid.innerHTML = `
            <div class="loading-card">
                Carregando membros NTPs...
            </div>
        `;

        const { data, error } = await supabaseClient
            .from("profiles")
            .select(`
                id,
                nome,
                username,
                mbti,
                eneagrama,
                tritype,
                subtipo,
                avatar_url,
                avatar_tipo,
                cargo,
                vip
            `)
            .in("mbti", ["ENTP", "INTP"])
            .order("nome", {
                ascending: true
            });

        if (error) {
            console.error("Erro ao carregar NTPs:", error);

            grid.innerHTML = `
                <div class="empty-card">
                    Não foi possível carregar os membros NTPs.
                </div>
            `;

            if (message) {
                message.textContent = "Erro ao carregar.";
            }

            return;
        }

        membrosNTP = data || [];

        if (message) {
            message.textContent = `${membrosNTP.length} membro(s)`;
        }

        renderizarMembrosNTP();
    }

    function renderizarMembrosNTP() {
        const grid = $("members-grid");

        if (!grid) return;

        if (!membrosNTP.length) {
            grid.innerHTML = `
                <div class="empty-card">
                    Nenhum membro ENTP ou INTP encontrado.
                </div>
            `;

            return;
        }

        grid.innerHTML = membrosNTP.map(criarCardMembro).join("");

        configurarBotoesMembros();
    }

    function criarCardMembro(membro) {
        const avatarURL = resolverURLAvatar(membro.avatar_url);

        let avatarHTML = `
            <div class="member-avatar-placeholder">
                👤
            </div>
        `;

        if (avatarURL) {
            avatarHTML = `
                <img src="${escaparHTML(avatarURL)}" alt="Foto de perfil" loading="lazy">
            `;
        } else if (membro.avatar_tipo?.startsWith("preset:")) {
            avatarHTML = `
                <div class="member-avatar-placeholder">
                    ${escaparHTML(
                        membro.avatar_tipo.replace("preset:", "")
                    )}
                </div>
            `;
        }

        const nome = membro.nome || membro.username || "Membro";

        const username = membro.username
            ? `@${normalizar(membro.username)}`
            : "";

        const badges = [
            membro.mbti,
            membro.eneagrama,
            membro.tritype,
            membro.subtipo
        ]
            .filter(Boolean)
            .map(valor => `
                <span class="member-badge">
                    ${escaparHTML(valor)}
                </span>
            `)
            .join("");

        const seguindo = seguindoIds.has(membro.id);

        return `
            <article class="member-card" data-member-id="${escaparHTML(membro.id)}">

                <div class="member-card-content">

                    <div class="member-avatar">
                        ${avatarHTML}
                    </div>

                    <h3 class="member-name">
                        ${escaparHTML(nome)}
                    </h3>

                    <p class="member-username">
                        ${escaparHTML(username)}
                    </p>

                    <div class="member-badges">
                        ${badges}
                    </div>

                    <div class="member-actions">

                        <a href="./perfis/?id=${encodeURIComponent(membro.id)}" class="member-action profile-action">
                            VER PERFIL
                        </a>

                        ${
                            usuarioAtual && usuarioAtual.id !== membro.id
                                ? `
                                    <button type="button" class="member-action follow-action ${seguindo ? "seguindo" : ""}" data-follow-id="${escaparHTML(membro.id)}">
                                        ${seguindo ? "✓ SEGUINDO" : "+ SEGUIR"}
                                    </button>
                                `
                                : ""
                        }

                    </div>

                </div>

            </article>
        `;
    }

    function configurarBotoesMembros() {
        document.querySelectorAll(".follow-action").forEach(button => {
            button.addEventListener("click", () => {
                alternarFollow(
                    button.dataset.followId,
                    button
                );
            });
        });
    }


    /* =========================================================
       FOLLOW
    ========================================================= */

    async function carregarSeguindo() {
        seguindoIds = new Set();

        if (!usuarioAtual) return;

        const { data, error } = await supabaseClient
            .from("follows")
            .select("following_id")
            .eq("follower_id", usuarioAtual.id);

        if (error) {
            console.warn("Não foi possível carregar follows:", error);
            return;
        }

        (data || []).forEach(item => {
            seguindoIds.add(item.following_id);
        });
    }

    async function alternarFollow(targetId, button) {
        if (!usuarioAtual) {
            sessionStorage.setItem("retornoNTP", window.location.href);
            window.location.href = "../login/";
            return;
        }

        if (!targetId || targetId === usuarioAtual.id) {
            return;
        }

        const jaSegue = seguindoIds.has(targetId);

        button.disabled = true;

        try {
            if (jaSegue) {
                const { error } = await supabaseClient
                    .from("follows")
                    .delete()
                    .eq("follower_id", usuarioAtual.id)
                    .eq("following_id", targetId);

                if (error) throw error;

                seguindoIds.delete(targetId);

                button.textContent = "+ SEGUIR";
                button.classList.remove("seguindo");

            } else {
                const { error } = await supabaseClient
                    .from("follows")
                    .insert({
                        follower_id: usuarioAtual.id,
                        following_id: targetId
                    });

                if (error) throw error;

                seguindoIds.add(targetId);

                button.textContent = "✓ SEGUINDO";
                button.classList.add("seguindo");
            }

        } catch (error) {
            console.error("Erro no follow:", error);
            mostrarToast("Não foi possível alterar o follow.");
        } finally {
            button.disabled = false;
        }
    }


    /* =========================================================
       IMAGEM
    ========================================================= */

    $("post-image")?.addEventListener("change", () => {
        const input = $("post-image");
        const preview = $("image-preview");

        if (!input || !preview) return;

        preview.innerHTML = "";

        const arquivo = input.files?.[0];

        if (!arquivo) {
            esconder(preview);
            return;
        }

        if (!arquivo.type.startsWith("image/")) {
            input.value = "";
            esconder(preview);
            mostrarToast("Escolha uma imagem válida.");
            return;
        }

        if (arquivo.size > 10 * 1024 * 1024) {
            input.value = "";
            esconder(preview);
            mostrarToast("A imagem deve ter no máximo 10 MB.");
            return;
        }

        const url = URL.createObjectURL(arquivo);

        preview.innerHTML = `
            <img src="${url}" alt="Pré-visualização">
        `;

        mostrar(preview);
    });


    /* =========================================================
       ENQUETE
    ========================================================= */

    $("toggle-poll-button")?.addEventListener("click", () => {
        $("poll-builder")?.classList.toggle("hidden");
    });

    $("cancel-poll-button")?.addEventListener("click", limparEnquete);

    $("add-poll-option")?.addEventListener("click", () => {
        const container = $("poll-options");

        if (!container) return;

        const quantidade = container.querySelectorAll("input").length;

        if (quantidade >= 6) {
            mostrarToast("Máximo de 6 opções.");
            return;
        }

        const linha = document.createElement("div");

        linha.className = "poll-input-row";

        linha.innerHTML = `
            <input class="poll-option-input" type="text" maxlength="200" placeholder="Opção ${quantidade + 1}">
        `;

        container.appendChild(linha);
    });

    function limparEnquete() {
        const builder = $("poll-builder");
        const question = $("poll-question");
        const options = $("poll-options");

        if (question) {
            question.value = "";
        }

        if (options) {
            options.innerHTML = `
                <div class="poll-input-row">
                    <input class="poll-option-input" type="text" maxlength="200" placeholder="Opção 1">
                </div>

                <div class="poll-input-row">
                    <input class="poll-option-input" type="text" maxlength="200" placeholder="Opção 2">
                </div>
            `;
        }

        esconder(builder);
    }

    function coletarOpcoes() {
        return [...document.querySelectorAll(".poll-option-input")]
            .map(input => input.value.trim())
            .filter(Boolean);
    }


    /* =========================================================
       PUBLICAR
    ========================================================= */

    $("publish-button")?.addEventListener("click", publicarPost);

    async function publicarPost() {
        if (!usuarioAtual) {
            mostrarToast("Você precisa estar logado.");
            return;
        }

        if (!podePublicar()) {
            mostrarToast("Você não tem permissão para publicar.");
            return;
        }

        const texto = $("post-content")?.value.trim() || "";
        const arquivo = $("post-image")?.files?.[0] || null;

        const pollBuilder = $("poll-builder");

        const enqueteAberta =
            pollBuilder &&
            !pollBuilder.classList.contains("hidden");

        if (enqueteAberta) {
            await publicarEnquete();
            return;
        }

        if (!texto && !arquivo) {
            mostrarToast("Escreva algo ou escolha uma foto.");
            return;
        }

        if (texto.length > 5000) {
            mostrarToast("O texto pode ter no máximo 5000 caracteres.");
            return;
        }

        const button = $("publish-button");

        if (button) {
            button.disabled = true;
            button.textContent = "Publicando...";
        }

        let imageURL = null;
        let imagePath = null;

        try {
            if (arquivo) {
                if (!arquivo.type.startsWith("image/")) {
                    throw new Error("Escolha uma imagem válida.");
                }

                if (arquivo.size > 10 * 1024 * 1024) {
                    throw new Error("A imagem deve ter no máximo 10 MB.");
                }

                const extensao =
                    arquivo.name.split(".").pop()?.toLowerCase() || "jpg";

                const nomeArquivo =
                    `${crypto.randomUUID()}.${extensao}`;

                imagePath =
                    `ntp-posts/${usuarioAtual.id}/${nomeArquivo}`;

                const { error: uploadError } =
                    await supabaseClient
                        .storage
                        .from("avatar")
                        .upload(
                            imagePath,
                            arquivo,
                            {
                                cacheControl: "3600",
                                upsert: false,
                                contentType: arquivo.type
                            }
                        );

                if (uploadError) {
                    throw uploadError;
                }

                const { data: publicData } =
                    supabaseClient
                        .storage
                        .from("avatar")
                        .getPublicUrl(imagePath);

                imageURL = publicData?.publicUrl || null;
            }

            const { error } =
                await supabaseClient
                    .from("ntp_posts")
                    .insert({
                        author_id: usuarioAtual.id,
                        content: texto,
                        image_url: imageURL,
                        image_path: imagePath
                    });

            if (error) {
                if (imagePath) {
                    await supabaseClient
                        .storage
                        .from("avatar")
                        .remove([imagePath]);
                }

                throw error;
            }

            $("post-content").value = "";
            $("post-image").value = "";

            esconder($("image-preview"));

            mostrarToast("Publicação criada! ✨");

            await carregarFeed();

        } catch (error) {
            console.error("Erro ao publicar:", error);

            mostrarToast(
                error?.message ||
                "Não foi possível publicar."
            );

        } finally {
            if (button) {
                button.disabled = false;
                button.textContent = "Publicar";
            }
        }
    }


    /* =========================================================
       PUBLICAR ENQUETE
    ========================================================= */

    async function publicarEnquete() {
        const question =
            $("poll-question")?.value.trim() || "";

        const options = coletarOpcoes();

        if (!question) {
            mostrarToast("Digite a pergunta da enquete.");
            return;
        }

        if (options.length < 2) {
            mostrarToast("A enquete precisa de pelo menos 2 opções.");
            return;
        }

        if (options.length > 6) {
            mostrarToast("Máximo de 6 opções.");
            return;
        }

        try {
            const { data: post, error: postError } =
                await supabaseClient
                    .from("ntp_posts")
                    .insert({
                        author_id: usuarioAtual.id,
                        content: ""
                    })
                    .select("id")
                    .single();

            if (postError) {
                throw postError;
            }

            const { error: pollError } =
                await supabaseClient
                    .from("ntp_polls")
                    .insert({
                        post_id: post.id,
                        question: question,
                        options: options
                    });

            if (pollError) {
                await supabaseClient
                    .from("ntp_posts")
                    .delete()
                    .eq("id", post.id);

                throw pollError;
            }

            limparEnquete();

            mostrarToast("Enquete criada! 📊");

            await carregarFeed();

        } catch (error) {
            console.error("Erro ao criar enquete:", error);

            mostrarToast(
                error?.message ||
                "Não foi possível criar a enquete."
            );
        }
    }


    /* =========================================================
       CARREGAR FEED
    ========================================================= */

    async function carregarFeed() {
        const container = $("feed-list");

        if (!container) return;

        container.innerHTML = `
            <div class="loading-card">
                Carregando o Feed...
            </div>
        `;

        const { data: posts, error } =
            await supabaseClient
                .from("ntp_posts")
                .select(`
                    id,
                    author_id,
                    content,
                    image_url,
                    image_path,
                    created_at,
                    updated_at,
                    profiles:author_id (
                        id,
                        nome,
                        username,
                        avatar_url,
                        avatar_tipo,
                        mbti,
                        eneagrama,
                        subtipo,
                        cargo,
                        vip
                    ),
                    ntp_polls (
                        id,
                        post_id,
                        question,
                        options,
                        created_at
                    )
                `)
                .order("created_at", {
                    ascending: false
                });

        if (error) {
            console.error("Erro no Feed NTP:", error);

            container.innerHTML = `
                <div class="empty-card">
                    Não foi possível carregar o Feed.
                </div>
            `;

            return;
        }

        if (!posts?.length) {
            container.innerHTML = `
                <div class="empty-card">
                    Ainda não há publicações na Casa dos NTPs.
                </div>
            `;

            return;
        }

        const postIds = posts.map(post => post.id);

        const likes = await carregarLikes(postIds);
        const votos = await carregarVotos(posts);

        container.innerHTML =
            posts
                .map(post =>
                    renderizarPost(
                        post,
                        likes,
                        votos
                    )
                )
                .join("");

        configurarEventosPosts();
    }


    /* =========================================================
       LIKES
    ========================================================= */

    async function carregarLikes(postIds) {
        if (!postIds.length) {
            return {};
        }

        const { data, error } =
            await supabaseClient
                .from("ntp_post_likes")
                .select("post_id, user_id")
                .in("post_id", postIds);

        if (error) {
            console.warn("Erro ao carregar likes:", error);
            return {};
        }

        const mapa = {};

        (data || []).forEach(like => {
            if (!mapa[like.post_id]) {
                mapa[like.post_id] = [];
            }

            mapa[like.post_id].push(like.user_id);
        });

        return mapa;
    }


    /* =========================================================
       VOTOS
    ========================================================= */

    async function carregarVotos(posts) {
        const pollIds = posts
            .flatMap(post =>
                Array.isArray(post.ntp_polls)
                    ? post.ntp_polls
                    : post.ntp_polls
                        ? [post.ntp_polls]
                        : []
            )
            .map(poll => poll.id);

        if (!pollIds.length || !usuarioAtual) {
            return {};
        }

        const { data, error } =
            await supabaseClient
                .from("ntp_poll_votes")
                .select("poll_id, option_index")
                .eq("user_id", usuarioAtual.id)
                .in("poll_id", pollIds);

        if (error) {
            console.warn("Erro ao carregar votos:", error);
            return {};
        }

        const mapa = {};

        (data || []).forEach(voto => {
            mapa[voto.poll_id] =
                voto.option_index;
        });

        return mapa;
    }


    /* =========================================================
       RENDER POST
    ========================================================= */

    function renderizarPost(
        post,
        likes,
        votos
    ) {
        const perfil = post.profiles || {};

        const nome =
            perfil.nome ||
            perfil.username ||
            "Membro";

        const username =
            perfil.username
                ? `@${normalizar(perfil.username)}`
                : "";

        const avatarURL =
            resolverURLAvatar(
                perfil.avatar_url
            );

        const avatarHTML =
            avatarURL
                ? `
                    <img src="${escaparHTML(avatarURL)}" alt="Foto de perfil" loading="lazy">
                `
                : "👤";

        const souAutor =
            usuarioAtual &&
            usuarioAtual.id === post.author_id;

        const totalLikes =
            likes[post.id]?.length || 0;

        const euCurti =
            usuarioAtual &&
            likes[post.id]?.includes(
                usuarioAtual.id
            );

        const poll =
            Array.isArray(post.ntp_polls)
                ? post.ntp_polls[0]
                : post.ntp_polls;

        let controls = "";

        if (
            souAutor &&
            podePublicar()
        ) {
            controls = `
                <div class="post-controls">
                    <button type="button" class="post-control edit-post" data-post-id="${escaparHTML(post.id)}">✏️</button>
                    <button type="button" class="post-control delete-post" data-post-id="${escaparHTML(post.id)}">🗑️</button>
                </div>
            `;
        }

        const textoHTML =
            post.content
                ? `
                    <div class="post-text">
                        ${formatarTexto(post.content)}
                    </div>
                `
                : "";

        const imagemHTML =
            post.image_url
                ? `
                    <div class="post-image-wrap">
                        <img class="post-image" src="${escaparHTML(post.image_url)}" alt="Imagem da publicação" loading="lazy">
                    </div>
                `
                : "";

        const pollHTML =
            poll
                ? renderizarEnquete(
                    poll,
                    votos[poll.id]
                )
                : "";

        return `
            <article class="ntp-post" data-post-id="${escaparHTML(post.id)}">

                <header class="post-header">

                    <div class="post-avatar">
                        ${avatarHTML}
                    </div>

                    <div class="post-author">
                        <strong>${escaparHTML(nome)}</strong>

                        <span>
                            ${escaparHTML(username)}
                            ${perfil.mbti ? ` · ${escaparHTML(perfil.mbti)}` : ""}
                        </span>

                        <small>
                            ${formatarData(post.created_at)}
                            ${
                                post.updated_at &&
                                post.updated_at !== post.created_at
                                    ? " · editado"
                                    : ""
                            }
                        </small>
                    </div>

                    ${controls}

                </header>

                <div class="post-body">
                    ${textoHTML}
                    ${imagemHTML}
                    ${pollHTML}
                </div>

                <footer class="post-footer">

                    <button type="button" class="post-like-button ${euCurti ? "liked" : ""}" data-like-post="${escaparHTML(post.id)}">
                        ${euCurti ? "♥ Curtido" : "♡ Curtir"}
                    </button>

                    <span class="like-count">
                        ${totalLikes}
                    </span>

                </footer>

            </article>
        `;
    }


    /* =========================================================
       ENQUETE NO FEED
    ========================================================= */

    function renderizarEnquete(
        poll,
        votoEscolhido
    ) {
        let options =
            poll.options;

        if (typeof options === "string") {
            try {
                options = JSON.parse(options);
            } catch {
                options = [];
            }
        }

        if (!Array.isArray(options)) {
            options = [];
        }

        const jaVotou =
            votoEscolhido !== undefined &&
            votoEscolhido !== null;

        return `
            <div class="ntp-poll" data-poll-id="${escaparHTML(poll.id)}">

                <div class="poll-question">
                    📊 ${formatarTexto(poll.question || "Enquete")}
                </div>

                <div class="poll-options">

                    ${
                        options
                            .map((opcao, index) => `
                                <button type="button" class="poll-option ${jaVotou && Number(votoEscolhido) === index ? "voted" : ""}" data-poll-id="${escaparHTML(poll.id)}" data-option-index="${index}" ${jaVotou ? "disabled" : ""}>
                                    <span>${escaparHTML(opcao)}</span>
                                </button>
                            `)
                            .join("")
                    }

                </div>

                ${
                    jaVotou
                        ? `
                            <small class="poll-voted">
                                Você já votou nesta enquete.
                            </small>
                        `
                        : ""
                }

            </div>
        `;
    }


    /* =========================================================
       EVENTOS DO FEED
    ========================================================= */

    function configurarEventosPosts() {

        document
            .querySelectorAll(".post-like-button")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        alternarLike(
                            button.dataset.likePost
                        );

                    }
                );
            });


        document
            .querySelectorAll(".poll-option")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        votarEnquete(
                            button.dataset.pollId,
                            button.dataset.optionIndex
                        );

                    }
                );
            });


        document
            .querySelectorAll(".edit-post")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        editarPost(
                            button.dataset.postId
                        );

                    }
                );
            });


        document
            .querySelectorAll(".delete-post")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        excluirPost(
                            button.dataset.postId
                        );

                    }
                );
            });
    }


    /* =========================================================
       CURTIR
    ========================================================= */

    async function alternarLike(postId) {

        if (!usuarioAtual) {

            mostrarToast(
                "Entre na sua conta para curtir."
            );

            return;
        }

        const { data: existente, error: buscaError } =
            await supabaseClient
                .from("ntp_post_likes")
                .select("post_id")
                .eq("post_id", postId)
                .eq("user_id", usuarioAtual.id)
                .maybeSingle();

        if (buscaError) {

            console.error(
                buscaError
            );

            mostrarToast(
                "Não foi possível verificar o like."
            );

            return;
        }

        try {

            if (existente) {

                const { error } =
                    await supabaseClient
                        .from("ntp_post_likes")
                        .delete()
                        .eq("post_id", postId)
                        .eq("user_id", usuarioAtual.id);

                if (error) {
                    throw error;
                }

            } else {

                const { error } =
                    await supabaseClient
                        .from("ntp_post_likes")
                        .insert({
                            post_id: postId,
                            user_id: usuarioAtual.id
                        });

                if (error) {
                    throw error;
                }
            }

            await carregarFeed();

        } catch (error) {

            console.error(
                "Erro ao curtir:",
                error
            );

            mostrarToast(
                "Não foi possível alterar o like."
            );
        }
    }


    /* =========================================================
       VOTAR
    ========================================================= */

    async function votarEnquete(
        pollId,
        optionIndex
    ) {

        if (!usuarioAtual) {

            mostrarToast(
                "Entre na sua conta para votar."
            );

            return;
        }

        try {

            const { error } =
                await supabaseClient
                    .from("ntp_poll_votes")
                    .insert({
                        poll_id: pollId,
                        user_id: usuarioAtual.id,
                        option_index: Number(optionIndex)
                    });

            if (error) {

                if (error.code === "23505") {

                    mostrarToast(
                        "Você já votou nesta enquete."
                    );

                    return;
                }

                throw error;
            }

            mostrarToast(
                "Voto registrado! 🗳️"
            );

            await carregarFeed();

        } catch (error) {

            console.error(
                "Erro ao votar:",
                error
            );

            mostrarToast(
                "Não foi possível registrar a enquete."
            );
        }
    }


    /* =========================================================
       EDITAR POST
    ========================================================= */

    async function editarPost(postId) {

        if (!usuarioAtual || !podePublicar()) {

            mostrarToast(
                "Você não pode editar esta publicação."
            );

            return;
        }

        const { data: post, error } =
            await supabaseClient
                .from("ntp_posts")
                .select("id, author_id, content")
                .eq("id", postId)
                .maybeSingle();

        if (error || !post) {

            mostrarToast(
                "Não foi possível encontrar a publicação."
            );

            return;
        }

        if (post.author_id !== usuarioAtual.id) {

            mostrarToast(
                "Você só pode editar suas próprias publicações."
            );

            return;
        }

        const novoTexto =
            window.prompt(
                "Editar publicação:",
                post.content || ""
            );

        if (novoTexto === null) {
            return;
        }

        const texto =
            novoTexto.trim();

        if (texto.length > 5000) {

            mostrarToast(
                "O texto pode ter no máximo 5000 caracteres."
            );

            return;
        }

        const { error: updateError } =
            await supabaseClient
                .from("ntp_posts")
                .update({
                    content: texto,
                    updated_at: new Date().toISOString()
                })
                .eq("id", postId)
                .eq("author_id", usuarioAtual.id);

        if (updateError) {

            console.error(
                updateError
            );

            mostrarToast(
                "Não foi possível editar."
            );

            return;
        }

        mostrarToast(
            "Publicação editada. ✏️"
        );

        await carregarFeed();
    }


    /* =========================================================
       EXCLUIR POST
    ========================================================= */

    async function excluirPost(postId) {

        if (!usuarioAtual || !podePublicar()) {

            mostrarToast(
                "Você não pode excluir esta publicação."
            );

            return;
        }

        const confirmar =
            window.confirm(
                "Tem certeza que deseja excluir esta publicação?"
            );

        if (!confirmar) {
            return;
        }

        const { data: post, error: selectError } =
            await supabaseClient
                .from("ntp_posts")
                .select("id, author_id, image_path")
                .eq("id", postId)
                .maybeSingle();

        if (selectError || !post) {

            mostrarToast(
                "Não foi possível encontrar a publicação."
            );

            return;
        }

        if (post.author_id !== usuarioAtual.id) {

            mostrarToast(
                "Você só pode excluir suas próprias publicações."
            );

            return;
        }

        const { error } =
            await supabaseClient
                .from("ntp_posts")
                .delete()
                .eq("id", postId)
                .eq("author_id", usuarioAtual.id);

        if (error) {

            console.error(error);

            mostrarToast(
                "Não foi possível excluir."
            );

            return;
        }

        if (post.image_path) {

            await supabaseClient
                .storage
                .from("avatar")
                .remove([
                    post.image_path
                ]);
        }

        mostrarToast(
            "Publicação excluída. 🗑️"
        );

        await carregarFeed();
    }


    /* =========================================================
       AUTH
    ========================================================= */

    supabaseClient.auth.onAuthStateChange(
        async (_event, session) => {

            usuarioAtual =
                session?.user || null;

            await carregarPerfil();

            await carregarSeguindo();

            atualizarAreaPublicacao();

            await carregarFeed();

            if (
                membersView?.classList.contains(
                    "active-view"
                )
            ) {

                await carregarMembrosNTP();
            }
        }
    );


    /* =========================================================
       INICIAR
    ========================================================= */

    async function iniciar() {

        await carregarSessao();

        await carregarSeguindo();

        await carregarFeed();

        await carregarMembrosNTP();
    }


    iniciar();

})();