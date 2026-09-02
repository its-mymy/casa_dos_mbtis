/* =========================================================
   CASA DOS MBTIs — PÁGINA E7
   Feed SP7 + Menu + Abas + Enquetes
   ========================================================= */

(() => {
    "use strict";

    const SUPABASE_URL = "https://lhhoqahzpuohhhnbwgfp.supabase.co";
    const SUPABASE_KEY = "sb_publishable_FTie2ELWKBc4Tz9r5fZuTw_izSaEHao";

    let supabaseClient = null;
    let usuarioAtual = null;
    let perfilAtual = null;
    let editandoPostId = null;

    const ADMINS_E7 = [
        "0be5c16f-5b0f-4ed6-9bc2-107a1f40cf57",
        "b5507317-72d9-46a1-d545-91b83a740390"
    ];

    /* =========================================================
       UTILIDADES
       ========================================================= */

    function $(id) {
        return document.getElementById(id);
    }

    function normalizar(valor) {
        return String(valor || "").trim().toLowerCase();
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

    function ehAdminE7() {
        return !!usuarioAtual && ADMINS_E7.includes(usuarioAtual.id);
    }

    function mostrar(elemento) {
        if (!elemento) return;
        elemento.classList.remove("hidden");
        elemento.style.display = "";
    }

    function esconder(elemento) {
        if (!elemento) return;
        elemento.classList.add("hidden");
    }

    function mostrarToast(mensagem) {
        let toast = $("e7-toast");

        if (!toast) {
            toast = document.createElement("div");
            toast.id = "e7-toast";
            toast.className = "e7-toast";
            document.body.appendChild(toast);
        }

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

        if (
            texto.startsWith("http://") ||
            texto.startsWith("https://")
        ) {
            return texto;
        }

        const { data } = supabaseClient
            .storage
            .from("avatar")
            .getPublicUrl(texto);

        return data?.publicUrl || null;
    }

    /* =========================================================
       SUPABASE
       ========================================================= */

    function iniciarSupabase() {
        if (!window.supabase) {
            console.error("Supabase JS não foi carregado.");
            mostrarToast("Erro: Supabase não carregou.");
            return false;
        }

        supabaseClient = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

        return true;
    }

    /* =========================================================
       MENU LATERAL
       ========================================================= */

    function abrirMenu() {
        const menu = $("member-menu");
        const overlay = $("member-menu-overlay");

        if (menu) menu.classList.add("open");
        if (overlay) overlay.classList.add("open");

        document.body.classList.add("menu-aberto");
    }

    function fecharMenu() {
        const menu = $("member-menu");
        const overlay = $("member-menu-overlay");

        if (menu) menu.classList.remove("open");
        if (overlay) overlay.classList.remove("open");

        document.body.classList.remove("menu-aberto");
    }

    function alternarMenu() {
        const menu = $("member-menu");

        if (!menu) return;

        if (menu.classList.contains("open")) {
            fecharMenu();
        } else {
            abrirMenu();
        }
    }

    function atualizarMenuPerfil() {
        const avatar = $("menu-avatar");
        const nome = $("menu-name");
        const username = $("menu-username");
        const badge = $("menu-badge");

        if (!perfilAtual) {
            if (avatar) {
                avatar.innerHTML = "👤";
            }

            if (nome) {
                nome.textContent = "Visitante";
            }

            if (username) {
                username.textContent = "Entrar";
            }

            if (badge) {
                badge.textContent = "";
                badge.classList.add("hidden");
            }

            return;
        }

        const avatarURL = resolverURLAvatar(perfilAtual.avatar_url);

        if (avatar) {
            if (avatarURL) {
                avatar.innerHTML = `
                    <img src="${avatarURL}" alt="Foto de perfil">
                `;
            } else {
                avatar.innerHTML = "👤";
            }
        }

        if (nome) {
            nome.textContent =
                perfilAtual.nome ||
                perfilAtual.username ||
                "Membro";
        }

        if (username) {
            username.textContent = perfilAtual.username
                ? `@${perfilAtual.username}`
                : "Membro";
        }

        if (badge) {
            const cargo = normalizar(perfilAtual.cargo);

            if (
                cargo === "adm" ||
                cargo === "administrador"
            ) {
                badge.textContent = "ADM";
                badge.classList.remove("hidden");
            } else if (perfilAtual.vip === true) {
                badge.textContent = "VIP";
                badge.classList.remove("hidden");
            } else {
                badge.textContent = "";
                badge.classList.add("hidden");
            }
        }
    }
function configurarMenu() {
    $("menu-button")?.addEventListener(
        "click",
        alternarMenu
    );

    $("close-menu-button")?.addEventListener(
        "click",
        fecharMenu
    );

    $("member-menu-overlay")?.addEventListener(
        "click",
        fecharMenu
    );

    $("login-menu-button")?.addEventListener(
        "click",
        () => {
            window.location.href = "../../login/";
        }
    );

    $("logout-button")?.addEventListener(
        "click",
        sair
    );

    const profileLink = $("profile-menu-link");

    if (profileLink) {
        profileLink.addEventListener(
            "click",
            (event) => {
                if (!usuarioAtual) {
                    event.preventDefault();
                    mostrarToast(
                        "Entre na sua conta primeiro."
                    );
                    return;
                }

                event.preventDefault();
                fecharMenu();
                window.location.href = "../FEED/perfil";
            }
        );
    }
}

async function atualizarEstadoLogin() {
    const loginButton = $("login-menu-button");
    const logoutButton = $("logout-button");

    if (usuarioAtual) {
        esconder(loginButton);
        mostrar(logoutButton);
    } else {
        mostrar(loginButton);
        esconder(logoutButton);
    }
}

async function sair() {
    if (!supabaseClient) return;

    const { error } =
        await supabaseClient.auth.signOut();

    if (error) {
        console.error(error);
        mostrarToast("Não foi possível sair.");
        return;
    }

    usuarioAtual = null;
    perfilAtual = null;

    atualizarMenuPerfil();
    atualizarEstadoLogin();
    atualizarAreaPublicacao();

    mostrarToast("Você saiu da conta.");
    fecharMenu();

    setTimeout(() => {
        window.location.reload();
    }, 500);
}
    /* =========================================================
       PERFIL
       ========================================================= */

    async function carregarSessao() {
        if (!supabaseClient) return;

        const {
            data,
            error
        } = await supabaseClient.auth.getSession();

        if (error) {
            console.error(
                "Erro ao pegar sessão:",
                error
            );
            return;
        }

        usuarioAtual =
            data?.session?.user || null;

        await carregarPerfil();
        await atualizarEstadoLogin();
    }

    async function carregarPerfil() {
        perfilAtual = null;

        if (!usuarioAtual) {
            atualizarMenuPerfil();
            atualizarAreaPublicacao();
            return;
        }

        const {
            data,
            error
        } = await supabaseClient
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
                banner_url,
                cargo,
                vip,
                feed_admin
            `)
            .eq("id", usuarioAtual.id)
            .maybeSingle();

        if (error) {
            console.error(
                "Erro ao carregar perfil:",
                error
            );
            atualizarMenuPerfil();
            atualizarAreaPublicacao();
            return;
        }

        perfilAtual = data || null;

        atualizarMenuPerfil();
        atualizarAreaPublicacao();
    }

    function atualizarAreaPublicacao() {
        const area = $("composer");
        const loginMessage = $("e7-login-message");

        if (!area) return;

        if (!usuarioAtual) {
            esconder(area);

            if (loginMessage) {
                mostrar(loginMessage);
            }

            return;
        }

        if (!ehAdminE7()) {
            esconder(area);

            if (loginMessage) {
                esconder(loginMessage);
            }

            return;
        }

        mostrar(area);

        if (loginMessage) {
            esconder(loginMessage);
        }

        area.classList.add("e7-admin");
    }

    /* =========================================================
       MEMBROS E7
       ========================================================= */

    let membrosE7 = [];
    let paginaMembrosE7 = 0;

    async function carregarMembrosE7() {
        const container = $("sp7-members");

        if (!container) {
            console.warn(
                "Container de membros E7 não encontrado."
            );
            return;
        }

        container.innerHTML = `
            <div class="loading-card">
                Carregando membros...
            </div>
        `;

        const {
            data,
            error
        } = await supabaseClient
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
            .ilike("eneagrama", "7%")
            .order("nome", {
                ascending: true
            });

        if (error) {
            console.error(
                "Erro ao carregar membros E7:",
                error
            );

            container.innerHTML = `
                <div class="loading-card">
                    ❌ Não foi possível carregar os membros E7.
                </div>
            `;

            return;
        }

        membrosE7 = data || [];
        paginaMembrosE7 = 0;

        renderizarMembrosE7();
    }

    function renderizarMembrosE7() {
        const container = $("sp7-members");

        if (!container) return;

        if (!membrosE7.length) {
            container.innerHTML = `
                <div class="loading-card">
                    Nenhum membro E7 encontrado.
                </div>
            `;

            return;
        }

        const porPagina = 4;
        const inicio =
            paginaMembrosE7 * porPagina;
        const fim = inicio + porPagina;

        const membrosVisiveis =
            membrosE7.slice(inicio, fim);

        const totalPaginas =
            Math.ceil(
                membrosE7.length / porPagina
            );

        container.innerHTML = `
            ${membrosVisiveis.map((membro) => {
                const avatarURL =
                    resolverURLAvatar(
                        membro.avatar_url
                    );

                let avatarHTML = "👤";

                if (avatarURL) {
                    avatarHTML = `
                        <img
                            src="${escaparHTML(avatarURL)}"
                            alt="Foto de perfil"
                            loading="lazy"
                        >
                    `;
                } else if (
                    membro.avatar_tipo?.startsWith(
                        "preset:"
                    )
                ) {
                    avatarHTML = escaparHTML(
                        membro.avatar_tipo.replace(
                            "preset:",
                            ""
                        )
                    );
                }

                const nome =
                    membro.nome ||
                    membro.username ||
                    "Membro";

                const username =
                    membro.username
                        ? `@${membro.username}`
                        : "";
const perfilURL = "../FEED/membros/";

                const cargo =
                    normalizar(membro.cargo);

                let selo = "";

                if (
                    cargo === "adm" ||
                    cargo === "administrador"
                ) {
                    selo = `
                        <span class="e7-member-badge">
                            🛡️ ADM
                        </span>
                    `;
                } else if (
                    membro.vip === true
                ) {
                    selo = `
                        <span class="e7-member-badge vip">
                            💎 VIP
                        </span>
                    `;
                }

                return `
                    <a
                        href="${perfilURL}"
                        class="e7-member-card"
                    >
                        <div class="e7-member-avatar">
                            ${avatarHTML}
                        </div>

                        <div class="e7-member-info">
                            <strong>
                                ${escaparHTML(nome)}
                            </strong>

                            <span>
                                ${escaparHTML(username)}
                            </span>

                            <div class="e7-member-tags">
                                ${
                                    membro.mbti
                                        ? `<small>${escaparHTML(
                                            membro.mbti
                                        )}</small>`
                                        : ""
                                }

                                ${
                                    membro.eneagrama
                                        ? `<small>${escaparHTML(
                                            membro.eneagrama
                                        )}</small>`
                                        : ""
                                }

                                ${
                                    membro.subtipo
                                        ? `<small>${escaparHTML(
                                            membro.subtipo
                                        )}</small>`
                                        : ""
                                }
                            </div>
                        </div>

                        ${selo}
                    </a>
                `;
            }).join("")}

            ${
                totalPaginas > 1
                    ? `
                        <div class="e7-members-pagination">

                            <button
                                type="button"
                                id="e7-members-prev"
                                ${
                                    paginaMembrosE7 === 0
                                        ? "disabled"
                                        : ""
                                }
                            >
                                ←
                            </button>

                            <span>
                                ${paginaMembrosE7 + 1}
                                /
                                ${totalPaginas}
                            </span>

                            <button
                                type="button"
                                id="e7-members-next"
                                ${
                                    paginaMembrosE7 >=
                                    totalPaginas - 1
                                        ? "disabled"
                                        : ""
                                }
                            >
                                →
                            </button>

                        </div>
                    `
                    : ""
            }
        `;

        const anterior =
            $("e7-members-prev");

        const proximo =
            $("e7-members-next");

        if (anterior) {
            anterior.addEventListener(
                "click",
                () => {
                    if (paginaMembrosE7 <= 0) {
                        return;
                    }

                    paginaMembrosE7--;
                    renderizarMembrosE7();
                }
            );
        }

        if (proximo) {
            proximo.addEventListener(
                "click",
                () => {
                    if (
                        paginaMembrosE7 >=
                        totalPaginas - 1
                    ) {
                        return;
                    }

                    paginaMembrosE7++;
                    renderizarMembrosE7();
                }
            );
        }
    }

    /* =========================================================
       ABAS
       ========================================================= */

    function trocarAba(
        aba,
        botao = null
    ) {
        trocarAbaPorId(aba);

        if (botao) {
            document
                .querySelectorAll(".e7-tab")
                .forEach((item) =>
                    item.classList.remove(
                        "active"
                    )
                );

            botao.classList.add("active");

        } else {
            document
                .querySelectorAll(".e7-tab")
                .forEach((item) => {
                    const onclick =
                        item.getAttribute(
                            "onclick"
                        ) || "";

                    item.classList.toggle(
                        "active",
                        onclick.includes(
                            `'${aba}'`
                        ) ||
                        onclick.includes(
                            `"${aba}"`
                        )
                    );
                });
        }
    }

    function trocarAbaPorId(aba) {
        const sobre = $("tab-sobre");
        const feed = $("tab-feed");

        if (!sobre || !feed) {
            console.warn(
                "Abas E7 não encontradas."
            );
            return;
        }

        const mostrarFeed =
            aba === "feed";

        sobre.classList.toggle(
            "active",
            !mostrarFeed
        );

        feed.classList.toggle(
            "active",
            mostrarFeed
        );

        sobre.style.display =
            mostrarFeed ? "none" : "";

        feed.style.display =
            mostrarFeed ? "" : "none";

        document
            .querySelectorAll(".e7-tab")
            .forEach((tab) => {
                const texto =
                    normalizar(
                        tab.textContent
                    );

                tab.classList.toggle(
                    "active",
                    mostrarFeed
                        ? texto.includes("feed")
                        : texto.includes("sobre")
                );
            });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        if (mostrarFeed) {
            carregarFeed();
        }
    }

    function irParaFeed() {
        trocarAbaPorId("feed");
        fecharMenu();

        setTimeout(() => {
            const feed = $("tab-feed");

            if (feed) {
                feed.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        }, 100);
    }

    function irParaSobre(
        idSecao = null
    ) {
        trocarAbaPorId("sobre");
        fecharMenu();

        if (!idSecao) return;

        setTimeout(() => {
            const alvo = $(idSecao);

            if (alvo) {
                alvo.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        }, 200);
    }

    /* =========================================================
       BOTÕES DO MENU
       ========================================================= */

    function configurarAtalhosMenu() {
        const feedLink =
            document.querySelector(
                '[data-e7-action="feed"], #menu-feed-link'
            );

        if (feedLink) {
            feedLink.addEventListener(
                "click",
                (event) => {
                    event.preventDefault();
                    irParaFeed();
                }
            );
        }

        document
            .querySelectorAll("[data-e7-sobre]")
            .forEach((botao) => {
                botao.addEventListener(
                    "click",
                    (event) => {
                        event.preventDefault();

                        const id =
                            botao.dataset.e7Sobre;

                        irParaSobre(id);
                    }
                );
            });
    }

    /* =========================================================
       FEED
       ========================================================= */

    async function carregarFeed() {
        const container =
            $("e7-feed-list") ||
            $("feed-list") ||
            $("posts-container");

        if (!container) return;

        container.innerHTML = `
            <div class="e7-loading">
                Carregando o feed...
            </div>
        `;

        const {
            data: posts,
            error
        } = await supabaseClient
            .from("e7_posts")
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
                    mbti,
                    eneagrama,
                    subtipo,
                    cargo,
                    vip
                ),
                e7_polls (
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
            console.error(
                "Erro no feed E7:",
                error
            );

            container.innerHTML = `
                <div class="e7-empty">
                    ❌ Não foi possível carregar
                    o feed.
                    <small>
                        ${escaparHTML(
                            error.message
                        )}
                    </small>
                </div>
            `;

            return;
        }

        if (
            !posts ||
            posts.length === 0
        ) {
            container.innerHTML = `
                <div class="e7-empty">
                    Ainda não há publicações
                    no Feed SP7.
                </div>
            `;

            return;
        }

        const pollIds =
            posts
                .flatMap(
                    (post) =>
                        post.e7_polls || []
                )
                .map(
                    (poll) => poll.id
                );

        let votosDoUsuario = [];

        if (
            pollIds.length &&
            usuarioAtual
        ) {
            const {
                data,
                error: votoError
            } = await supabaseClient
                .from("e7_poll_votes")
                .select(
                    "poll_id, option_index"
                )
                .eq(
                    "user_id",
                    usuarioAtual.id
                )
                .in(
                    "poll_id",
                    pollIds
                );

            if (votoError) {
                console.error(
                    "Erro ao carregar votos:",
                    votoError
                );
            } else {
                votosDoUsuario =
                    data || [];
            }
        }

        const votosMap = {};

        votosDoUsuario.forEach(
            (voto) => {
                votosMap[voto.poll_id] =
                    voto.option_index;
            }
        );

        container.innerHTML =
            posts
                .map(
                    (post) =>
                        renderizarPost(
                            post,
                            votosMap
                        )
                )
                .join("");

        configurarBotoesPostagens();
    }

    function renderizarPost(
        post,
        votosMap
    ) {
        const perfil =
            post.profiles || {};

        const nome =
            perfil.nome ||
            perfil.username ||
            "Membro";

        const username =
            perfil.username
                ? `@${perfil.username}`
                : "";

        const avatarURL =
            resolverURLAvatar(
                perfil.avatar_url
            );

        const avatarHTML =
            avatarURL
                ? `
                    <img
                        src="${avatarURL}"
                        alt="Avatar de ${escaparHTML(
                            nome
                        )}"
                    >
                `
                : "👤";

        const souAutor =
            usuarioAtual &&
            usuarioAtual.id ===
                post.author_id;

        const podeEditarExcluir =
            souAutor &&
            ehAdminE7();

        const textoHTML =
            post.content
                ? `
                    <div class="e7-post-text">
                        ${formatarTexto(
                            post.content
                        )}
                    </div>
                `
                : "";

        const imagemHTML =
            post.image_url
                ? `
                    <div class="e7-post-image-wrap">
                        <img
                            class="e7-post-image"
                            src="${escaparHTML(
                                post.image_url
                            )}"
                            alt="Imagem da publicação"
                            loading="lazy"
                        >
                    </div>
                `
                : "";

        const enqueteHTML =
            post.e7_polls?.length
                ? renderizarEnquete(
                    post.e7_polls[0],
                    votosMap[
                        post.e7_polls[0].id
                    ]
                )
                : "";

        const acoesHTML =
            podeEditarExcluir
                ? `
                    <div class="e7-post-actions">

                        <button
                            type="button"
                            class="e7-edit-post"
                            data-post-id="${post.id}"
                        >
                            ✏️ Editar
                        </button>

                        <button
                            type="button"
                            class="e7-delete-post"
                            data-post-id="${post.id}"
                        >
                            🗑️ Excluir
                        </button>

                    </div>
                `
                : "";

        return `
            <article
                class="e7-post"
                data-post-id="${post.id}"
            >
                <header class="e7-post-header">

                    <div class="e7-post-avatar">
                        ${avatarHTML}
                    </div>

                    <div class="e7-post-author">

                        <strong>
                            ${escaparHTML(nome)}
                        </strong>

                        <span>
                            ${escaparHTML(username)}
                            ${
                                perfil.subtipo
                                    ? ` · ${escaparHTML(
                                        perfil.subtipo
                                    )}`
                                    : ""
                            }
                        </span>

                        <small>
                            ${formatarData(
                                post.created_at
                            )}
                        </small>

                    </div>

                    ${acoesHTML}

                </header>

                <div class="e7-post-body">
                    ${textoHTML}
                    ${imagemHTML}
                    ${enqueteHTML}
                </div>

            </article>
        `;
    }

    /* =========================================================
       ENQUETES DO FEED
       ========================================================= */

    function renderizarEnquete(
        poll,
        votoEscolhido
    ) {
        let opcoes =
            poll.options;

        if (
            typeof opcoes ===
            "string"
        ) {
            try {
                opcoes =
                    JSON.parse(
                        opcoes
                    );
            } catch {
                opcoes = [];
            }
        }

        if (
            !Array.isArray(opcoes)
        ) {
            opcoes = [];
        }

        const jaVotou =
            votoEscolhido !==
                undefined &&
            votoEscolhido !== null;

        return `
            <div
                class="e7-poll"
                data-poll-id="${poll.id}"
            >

                <div class="e7-poll-title">
                    📊 ${formatarTexto(
                        poll.question ||
                        "Enquete"
                    )}
                </div>

                <div class="e7-poll-options">

                    ${opcoes.map(
                        (
                            opcao,
                            index
                        ) => `
                            <button
                                type="button"
                                class="e7-poll-option ${
                                    jaVotou &&
                                    Number(
                                        votoEscolhido
                                    ) === index
                                        ? "voted"
                                        : ""
                                }"
                                data-poll-id="${
                                    poll.id
                                }"
                                data-option-index="${
                                    index
                                }"
                                ${
                                    jaVotou
                                        ? "disabled"
                                        : ""
                                }
                            >
                                <span>
                                    ${escaparHTML(
                                        opcao
                                    )}
                                </span>
                            </button>
                        `
                    ).join("")}

                </div>

                ${
                    jaVotou
                        ? `
                            <small class="e7-poll-voted">
                                Você já votou
                                nesta enquete.
                            </small>
                        `
                        : ""
                }

            </div>
        `;
    }

    function abrirCriadorEnquete() {
        const box =
            $("poll-builder");

        if (!box) {
            mostrarToast(
                "Área de enquete não encontrada."
            );
            return;
        }

        box.classList.remove(
            "hidden"
        );
    }

    function alternarEnquete() {
        const box =
            $("poll-builder");

        if (!box) {
            mostrarToast(
                "Área de enquete não encontrada."
            );
            return;
        }

        box.classList.toggle(
            "hidden"
        );
    }

    function cancelarEnquete() {
        const box =
            $("poll-builder");

        const pergunta =
            $("poll-question");

        if (pergunta) {
            pergunta.value = "";
        }

        const opcoes =
            $("poll-options");

        if (opcoes) {
            opcoes.innerHTML = `
                <div class="poll-input-row">
                    <input
                        class="poll-option-input"
                        type="text"
                        maxlength="200"
                        placeholder="Opção 1"
                    >
                </div>

                <div class="poll-input-row">
                    <input
                        class="poll-option-input"
                        type="text"
                        maxlength="200"
                        placeholder="Opção 2"
                    >
                </div>
            `;
        }

        if (box) {
            box.classList.add(
                "hidden"
            );
        }
    }

    function adicionarOpcao() {
        const container =
            $("poll-options");

        if (!container) {
            mostrarToast(
                "Área de opções não encontrada."
            );
            return;
        }

        const quantidade =
            container.querySelectorAll(
                "input"
            ).length;

        if (quantidade >= 6) {
            mostrarToast(
                "Máximo de 6 opções."
            );
            return;
        }

        const wrapper =
            document.createElement(
                "div"
            );

        wrapper.className =
            "poll-input-row";

        wrapper.innerHTML = `
            <input
                class="poll-option-input"
                type="text"
                maxlength="200"
                placeholder="Opção ${
                    quantidade + 1
                }"
            >
        `;

        container.appendChild(
            wrapper
        );
    }

    function coletarOpcoesEnquete() {
        const container =
            $("poll-options");

        if (!container) {
            return [];
        }

        return [
            ...container.querySelectorAll(
                "input"
            )
        ]
            .map(
                (input) =>
                    input.value.trim()
            )
            .filter(Boolean);
    }

    async function criarEnquete() {
        if (
            !usuarioAtual ||
            !ehAdminE7()
        ) {
            mostrarToast(
                "Apenas YU e Berry podem criar enquetes."
            );
            return false;
        }

        const perguntaInput =
            $("poll-question");

        const pergunta =
            perguntaInput?.value.trim() ||
            "";

        const opcoes =
            coletarOpcoesEnquete();

        if (!pergunta) {
            mostrarToast(
                "Digite a pergunta da enquete."
            );
            return false;
        }

        if (opcoes.length < 2) {
            mostrarToast(
                "A enquete precisa de pelo menos 2 opções."
            );
            return false;
        }

        if (opcoes.length > 6) {
            mostrarToast(
                "A enquete pode ter no máximo 6 opções."
            );
            return false;
        }

        try {
            const {
                data: post,
                error: postError
            } =
                await supabaseClient
                    .from("e7_posts")
                    .insert({
                        author_id:
                            usuarioAtual.id,
                        content:
                            pergunta
                    })
                    .select("id")
                    .single();

            if (postError) {
                throw postError;
            }

            const {
                error: pollError
            } =
                await supabaseClient
                    .from("e7_polls")
                    .insert({
                        post_id: post.id,
                        question:
                            pergunta,
                        options:
                            opcoes
                    });

            if (pollError) {
                await supabaseClient
                    .from("e7_posts")
                    .delete()
                    .eq(
                        "id",
                        post.id
                    );

                throw pollError;
            }

            cancelarEnquete();

            mostrarToast(
                "Enquete criada! 📊"
            );

            await carregarFeed();

            return true;

        } catch (error) {
            console.error(
                "Erro ao criar enquete:",
                error
            );

            mostrarToast(
                error?.message ||
                "Não foi possível criar a enquete."
            );

            return false;
        }
    }

    async function votarEnquete(
        pollId,
        optionIndex,
        button
    ) {
        if (!usuarioAtual) {
            mostrarToast(
                "Entre na conta para votar."
            );
            return;
        }

        if (
            !pollId &&
            pollId !== 0
        ) {
            return;
        }

        if (button) {
            button.disabled = true;
        }

        const {
            error
        } =
            await supabaseClient
                .from("e7_poll_votes")
                .insert({
                    poll_id:
                        Number(
                            pollId
                        ),
                    user_id:
                        usuarioAtual.id,
                    option_index:
                        Number(
                            optionIndex
                        )
                });

        if (error) {
            console.error(
                "Erro ao votar:",
                error
            );

            if (
                error.code ===
                    "23505" ||
                normalizar(
                    error.message
                ).includes(
                    "duplicate"
                )
            ) {
                mostrarToast(
                    "Você já votou nesta enquete."
                );
            } else {
                mostrarToast(
                    "Não foi possível registrar seu voto."
                );
            }

            if (button) {
                button.disabled =
                    false;
            }

            return;
        }

        mostrarToast(
            "Voto registrado! 🗳️"
        );

        await carregarFeed();
    }

    /* =========================================================
       PUBLICAÇÃO
       ========================================================= */

    function obterCampoTexto() {
        return (
            $("post-content") ||
            $("e7-content") ||
            $("e7-post-content") ||
            $("feed-content")
        );
    }

    function obterCampoImagem() {
        return (
            $("post-image") ||
            $("e7-image") ||
            $("e7-post-image") ||
            $("feed-image")
        );
    }

    function configurarPreviewImagem() {
        const campoImagem =
            $("post-image");

        const preview =
            $("image-preview");

        if (
            !campoImagem ||
            !preview
        ) {
            return;
        }

        if (
            campoImagem.dataset
                .previewConfigurado
        ) {
            return;
        }

        campoImagem.dataset
            .previewConfigurado =
            "true";

        campoImagem.addEventListener(
            "change",
            () => {
                const arquivo =
                    campoImagem
                        .files?.[0] ||
                    null;

                preview.innerHTML =
                    "";

                if (!arquivo) {
                    preview.classList.add(
                        "hidden"
                    );
                    return;
                }

                if (
                    !arquivo.type.startsWith(
                        "image/"
                    )
                ) {
                    campoImagem.value =
                        "";

                    preview.classList.add(
                        "hidden"
                    );

                    mostrarToast(
                        "Escolha uma imagem válida."
                    );

                    return;
                }

                if (
                    arquivo.size >
                    10 * 1024 * 1024
                ) {
                    campoImagem.value =
                        "";

                    preview.classList.add(
                        "hidden"
                    );

                    mostrarToast(
                        "A imagem deve ter no máximo 10 MB."
                    );

                    return;
                }

                const url =
                    URL.createObjectURL(
                        arquivo
                    );

                preview.innerHTML = `
                    <img
                        src="${url}"
                        alt="Pré-visualização da imagem"
                    >
                `;

                preview.classList.remove(
                    "hidden"
                );
            }
        );
    }

    function limparPreviewImagem() {
        const campoImagem =
            $("post-image");

        const preview =
            $("image-preview");

        if (campoImagem) {
            campoImagem.value = "";
        }

        if (preview) {
            preview.innerHTML = "";
            preview.classList.add(
                "hidden"
            );
        }
    }

    function configurarBotoesPostagens() {
        document
            .querySelectorAll(
                ".e7-poll-option"
            )
            .forEach(
                (button) => {
                    button.addEventListener(
                        "click",
                        () => {
                            votarEnquete(
                                button.dataset
                                    .pollId,
                                button.dataset
                                    .optionIndex,
                                button
                            );
                        }
                    );
                }
            );

        document
            .querySelectorAll(
                ".e7-edit-post"
            )
            .forEach(
                (button) => {
                    button.addEventListener(
                        "click",
                        () => {
                            editarPost(
                                Number(
                                    button
                                        .dataset
                                        .postId
                                )
                            );
                        }
                    );
                }
            );

        document
            .querySelectorAll(
                ".e7-delete-post"
            )
            .forEach(
                (button) => {
                    button.addEventListener(
                        "click",
                        () => {
                            excluirPost(
                                Number(
                                    button
                                        .dataset
                                        .postId
                                )
                            );
                        }
                    );
                }
            );
    }

    async function publicarPost() {
        if (!usuarioAtual) {
            mostrarToast(
                "Você precisa estar logado."
            );
            return;
        }

        if (!ehAdminE7()) {
            mostrarToast(
                "Apenas YU e Berry podem publicar no Feed SP7."
            );
            return;
        }

        const pollBuilder =
            $("poll-builder");

        const enqueteAberta =
            pollBuilder &&
            !pollBuilder.classList.contains(
                "hidden"
            );

        if (enqueteAberta) {
            await criarEnquete();
            return;
        }

        const campoTexto =
            obterCampoTexto();

        const campoImagem =
            obterCampoImagem();

        const texto =
            campoTexto
                ? campoTexto.value.trim()
                : "";

        const arquivo =
            campoImagem?.files?.[0] ||
            null;

        if (!texto) {
            mostrarToast(
                "Escreva alguma coisa antes de publicar."
            );
            return;
        }

        if (
            texto.length >
            5000
        ) {
            mostrarToast(
                "O texto pode ter no máximo 5000 caracteres."
            );
            return;
        }

        const botao =
            $("publish-button") ||
            $("e7-publish-button") ||
            $("publish-post-button") ||
            $("post-publish-button");

        if (botao) {
            botao.disabled = true;
            botao.dataset.originalText =
                botao.textContent;
            botao.textContent =
                "Publicando...";
        }

        try {
            let imageURL =
                null;

            let imagePath =
                null;

            if (arquivo) {
                if (
                    !arquivo.type.startsWith(
                        "image/"
                    )
                ) {
                    throw new Error(
                        "Escolha uma imagem válida."
                    );
                }

                if (
                    arquivo.size >
                    10 * 1024 * 1024
                ) {
                    throw new Error(
                        "A imagem deve ter no máximo 10 MB."
                    );
                }

                const extensao =
                    arquivo.name
                        .split(".")
                        .pop()
                        ?.toLowerCase() ||
                    "jpg";

                const nomeArquivo =
                    `${crypto.randomUUID()}.${extensao}`;

                imagePath =
                    `e7-posts/${usuarioAtual.id}/${nomeArquivo}`;

                const {
                    error: uploadError
                } =
                    await supabaseClient
                        .storage
                        .from("avatar")
                        .upload(
                            imagePath,
                            arquivo,
                            {
                                cacheControl:
                                    "3600",
                                upsert:
                                    false,
                                contentType:
                                    arquivo.type
                            }
                        );

                if (uploadError) {
                    throw uploadError;
                }

                const {
                    data: urlData
                } =
                    supabaseClient
                        .storage
                        .from("avatar")
                        .getPublicUrl(
                            imagePath
                        );

                imageURL =
                    urlData?.publicUrl ||
                    null;
            }

            const {
                error
            } =
                await supabaseClient
                    .from("e7_posts")
                    .insert({
                        author_id:
                            usuarioAtual.id,
                        content:
                            texto,
                        image_url:
                            imageURL,
                        image_path:
                            imagePath
                    });

            if (error) {
                if (imagePath) {
                    await supabaseClient
                        .storage
                        .from("avatar")
                        .remove([
                            imagePath
                        ]);
                }

                throw error;
            }

            if (campoTexto) {
                campoTexto.value =
                    "";
            }

            limparPreviewImagem();

            mostrarToast(
                "Publicação criada! ✨"
            );

            await carregarFeed();

        } catch (error) {
            console.error(
                "Erro ao publicar:",
                error
            );

            mostrarToast(
                error?.message ||
                "Não foi possível publicar."
            );

        } finally {
            if (botao) {
                botao.disabled =
                    false;

                botao.textContent =
                    botao.dataset
                        .originalText ||
                    "Publicar";
            }
        }
    }

    /* =========================================================
       EDITAR POST
       ========================================================= */

    async function editarPost(
        postId
    ) {
        if (
            !usuarioAtual ||
            !ehAdminE7()
        ) {
            mostrarToast(
                "Você não pode editar esta publicação."
            );
            return;
        }

        const {
            data,
            error
        } =
            await supabaseClient
                .from("e7_posts")
                .select(
                    "id, author_id, content, image_url"
                )
                .eq("id", postId)
                .maybeSingle();

        if (error) {
            console.error(error);

            mostrarToast(
                "Não foi possível carregar a publicação."
            );

            return;
        }

        if (!data) {
            mostrarToast(
                "Publicação não encontrada."
            );
            return;
        }

        if (
            data.author_id !==
            usuarioAtual.id
        ) {
            mostrarToast(
                "Você só pode editar suas próprias publicações."
            );
            return;
        }

        const novoTexto =
            window.prompt(
                "Edite sua publicação:",
                data.content || ""
            );

        if (
            novoTexto ===
            null
        ) {
            return;
        }

        const texto =
            novoTexto.trim();

        if (!texto) {
            mostrarToast(
                "A publicação não pode ficar vazia."
            );
            return;
        }

        if (
            texto.length >
            5000
        ) {
            mostrarToast(
                "O texto pode ter no máximo 5000 caracteres."
            );
            return;
        }

        const {
            error: updateError
        } =
            await supabaseClient
                .from("e7_posts")
                .update({
                    content:
                        texto,
                    updated_at:
                        new Date().toISOString()
                })
                .eq(
                    "id",
                    postId
                )
                .eq(
                    "author_id",
                    usuarioAtual.id
                );

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

    async function excluirPost(
        postId
    ) {
        if (
            !usuarioAtual ||
            !ehAdminE7()
        ) {
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

        const {
            data: post,
            error: selectError
        } =
            await supabaseClient
                .from("e7_posts")
                .select(
                    "id, author_id, image_path"
                )
                .eq(
                    "id",
                    postId
                )
                .maybeSingle();

        if (selectError) {
            console.error(
                selectError
            );

            mostrarToast(
                "Não foi possível localizar a publicação."
            );

            return;
        }

        if (!post) {
            mostrarToast(
                "Publicação não encontrada."
            );
            return;
        }

        if (
            post.author_id !==
            usuarioAtual.id
        ) {
            mostrarToast(
                "Você só pode excluir suas próprias publicações."
            );
            return;
        }

        const {
            error
        } =
            await supabaseClient
                .from("e7_posts")
                .delete()
                .eq(
                    "id",
                    postId
                )
                .eq(
                    "author_id",
                    usuarioAtual.id
                );

        if (error) {
            console.error(
                error
            );

            mostrarToast(
                "Não foi possível excluir."
            );

            return;
        }

        if (post.image_path) {
            const {
                error: storageError
            } =
                await supabaseClient
                    .storage
                    .from("avatar")
                    .remove([
                        post.image_path
                    ]);

            if (storageError) {
                console.warn(
                    "Não foi possível remover a imagem do Storage:",
                    storageError
                );
            }
        }

        mostrarToast(
            "Publicação excluída. 🗑️"
        );

        await carregarFeed();
    }

    /* =========================================================
       EVENTOS DO COMPOSER
       ========================================================= */

    function configurarComposer() {
        configurarPreviewImagem();
    }

    /* =========================================================
       NAVEGAÇÃO "SOBRE"
       ========================================================= */

    function configurarBotoesSobre() {
        document
            .querySelectorAll(
                "[data-e7-target]"
            )
            .forEach(
                (botao) => {
                    botao.addEventListener(
                        "click",
                        (event) => {
                            event.preventDefault();

                            irParaSobre(
                                botao.dataset
                                    .e7Target
                            );
                        }
                    );
                }
            );
    }

    /* =========================================================
       ATALHOS GLOBAIS PARA O HTML
       ========================================================= */

    window.carregarMembrosE7 =
        carregarMembrosE7;

    window.abrirMenu =
        abrirMenu;

    window.fecharMenu =
        fecharMenu;

    window.alternarMenu =
        alternarMenu;

    window.trocarAba =
        trocarAba;

    window.trocarAbaPorId =
        trocarAbaPorId;

    window.irParaFeed =
        irParaFeed;

    window.irParaSobre =
        irParaSobre;

    window.publicarPost =
        publicarPost;

    window.editarPost =
        editarPost;

    window.excluirPost =
        excluirPost;

    window.votarEnquete =
        votarEnquete;

    window.criarEnquete =
        criarEnquete;

    window.abrirCriadorEnquete =
        abrirCriadorEnquete;

    window.alternarEnquete =
        alternarEnquete;

    window.cancelarEnquete =
        cancelarEnquete;

    window.adicionarOpcao =
        adicionarOpcao;

    /* =========================================================
       EVENTOS INICIAIS
       ========================================================= */

    async function iniciar() {
        console.log(
            "✅ e7.js carregado."
        );

        if (!iniciarSupabase()) {
            return;
        }

        configurarMenu();
        configurarAtalhosMenu();
        configurarBotoesSobre();
        configurarComposer();

        await carregarSessao();
        await atualizarAreaPublicacao();
        await carregarMembrosE7();

        const abaInicial =
            window.location.hash ===
            "#feed"
                ? "feed"
                : "sobre";

        trocarAbaPorId(
            abaInicial
        );

        supabaseClient.auth.onAuthStateChange(
            async (
                _event,
                session
            ) => {
                usuarioAtual =
                    session?.user ||
                    null;

                await carregarPerfil();
                await atualizarEstadoLogin();
                await atualizarAreaPublicacao();
                await carregarMembrosE7();

                if (document.body) {
                    carregarFeed();
                }
            }
        );
    }

    /* =========================================================
       DOM READY
       ========================================================= */

    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            iniciar
        );
    } else {
        iniciar();
    }
})();