
const SUPABASE_URL = "https://lhhoqahzpuohhhnbwgfp.supabase.co";
const SUPABASE_KEY = "sb_publishable_FTie2ELWKBc4Tz9r5fZuTw_izSaEHao";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* =========================================================
   PUBLICAÇÕES
========================================================= */

const PUBLICACOES = [
    {
        id: "mii-001",
        autor: "Mii",
        username: "mii",
        tipo: "arte",
        titulo: "Criação da Mii",
        descricao: "Uma das artes compartilhadas pela comunidade.",
        imagem: "../img/artistas-da-comunidade/mii.jpg",
        data: "2026-08-20",
        vencedor: true
    },

    {
        id: "emily-001",
        autor: "Emily Luana",
        username: "emilyluana",
        tipo: "arte",
        titulo: "Criação da Emily Luana",
        descricao: "Arte da comunidade Casa dos MBTIs.",
        imagem: "../img/artistas-da-comunidade/EmilyLuana.jpg",
        data: "2026-08-20",
        vencedor: true
    },

    {
        id: "sam-001",
        autor: "Sam",
        username: "sam",
        tipo: "arte",
        titulo: "Criação do Sam",
        descricao: "Uma criação compartilhada no Ateliê.",
        imagem: "../img/artistas-da-comunidade/Sam.jpg",
        data: "2026-08-20",
        vencedor: true
    },

    {
        id: "poema-001",
        autor: "Membro da Casa",
        username: "teste",
        tipo: "poema TESTE",
        titulo: "Entre pensamentos",
        texto: "Às vezes a mente fala baixo,\nenquanto o mundo grita alto.\n\nE no silêncio entre os dois,\na gente finalmente se encontra.",
        assinatura: "— poema teste",
        data: "2026-08-21",
        vencedor: false
    }
];


/* =========================================================
   ESTADO
========================================================= */

let usuarioAtual = null;
let perfilAtual = null;
let curtidas = {};
let filtroAtual = "todos";


/* =========================================================
   ELEMENTOS
========================================================= */

const sidebar = document.getElementById("sidebar");
const menuOverlay = document.getElementById("menu-overlay");
const menuButton = document.getElementById("menu-button");
const closeMenuButton = document.getElementById("close-menu");

const menuProfileLogged =
    document.getElementById("menu-profile-logged");

const menuProfileVisitor =
    document.getElementById("menu-profile-visitor");

const menuProfileAvatar =
    document.getElementById("menu-profile-avatar");

const menuProfileName =
    document.getElementById("menu-profile-name");

const menuProfileUsername =
    document.getElementById("menu-profile-username");

const feed =
    document.getElementById("feed-artistas");

const emptyFeed =
    document.getElementById("empty-feed");

const feedCounter =
    document.getElementById("feed-counter");


/* =========================================================
   UTILITÁRIOS
========================================================= */

function normalizarUsername(username) {
    return String(username || "")
        .trim()
        .replace(/^@/, "");
}

function escaparHTML(valor) {
    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatarData(data) {
    if (!data) {
        return "";
    }

    const dataObj =
        new Date(`${data}T12:00:00`);

    if (Number.isNaN(dataObj.getTime())) {
        return data;
    }

    return dataObj
        .toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
        .replace(".", "");
}

function avatarHTML(url, avatarTipo) {
    if (url) {
        return `
            <img
                src="${escaparHTML(url)}"
                alt="Foto de perfil"
                loading="lazy"
            >
        `;
    }

    if (
        avatarTipo &&
        String(avatarTipo).startsWith("preset:")
    ) {
        const preset =
            String(avatarTipo)
                .replace("preset:", "")
                .trim();

        if (preset) {
            return `
                <div class="avatar-preset">
                    ${escaparHTML(preset)}
                </div>
            `;
        }
    }

    return "👤";
}


/* =========================================================
   MENU
========================================================= */

function abrirMenu() {
    sidebar?.classList.add("ativo");
    menuOverlay?.classList.add("ativo");

    document.body.style.overflow = "hidden";
}

function fecharMenu() {
    sidebar?.classList.remove("ativo");
    menuOverlay?.classList.remove("ativo");

    document.body.style.overflow = "";
}

menuButton?.addEventListener(
    "click",
    abrirMenu
);

closeMenuButton?.addEventListener(
    "click",
    fecharMenu
);

menuOverlay?.addEventListener(
    "click",
    fecharMenu
);


/* =========================================================
   SESSÃO
========================================================= */

async function carregarSessao() {
    try {
        const {
            data,
            error
        } = await supabaseClient.auth.getUser();

        if (error) {
            console.error(
                "Erro ao verificar usuário:",
                error
            );

            usuarioAtual = null;
            perfilAtual = null;

            mostrarVisitante();

            return;
        }

        usuarioAtual =
            data?.user || null;

        if (!usuarioAtual) {
            perfilAtual = null;
            mostrarVisitante();
            return;
        }
await carregarPerfilUsuario();

mostrarUsuarioLogado();

    } catch (error) {
        console.error(
            "Erro ao carregar sessão:",
            error
        );

        usuarioAtual = null;
        perfilAtual = null;

        mostrarVisitante();
    }
}


/* =========================================================
   PERFIL DO USUÁRIO
========================================================= */

async function carregarPerfilUsuario() {
    if (!usuarioAtual) {
        return;
    }

    try {
        const {
            data: perfil,
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
                cargo,
                vip,
                avatar_url,
                avatar_tipo
            `)
            .eq(
                "id",
                usuarioAtual.id
            )
            .maybeSingle();

        if (error) {
            console.error(
                "Erro ao carregar perfil:",
                error
            );

            atualizarMenuPerfil();
            return;
        }

        perfilAtual =
            perfil || null;

        atualizarMenuPerfil();

    } catch (error) {
        console.error(
            "Erro no perfil:",
            error
        );

        atualizarMenuPerfil();
    }
}
function mostrarUsuarioLogado() {
    menuProfileLogged?.classList.remove("hidden");
    menuProfileVisitor?.classList.add("hidden");

    const nome =
        perfilAtual?.nome ||
        "Membro";

    const username =
        normalizarUsername(
            perfilAtual?.username
        );

    if (menuProfileName) {
        menuProfileName.textContent = nome;
    }

    if (menuProfileUsername) {
        menuProfileUsername.textContent =
            username ? `@${username}` : "";
    }

    if (menuProfileAvatar) {
        menuProfileAvatar.innerHTML =
            avatarHTML(
                perfilAtual?.avatar_url,
                perfilAtual?.avatar_tipo
            );
    }
}

function mostrarVisitante() {
    if (menuProfileLogged) {
        menuProfileLogged.classList.add(
            "hidden"
        );
    }

    if (menuProfileVisitor) {
        menuProfileVisitor.classList.remove(
            "hidden"
        );
    }

    if (menuProfileName) {
        menuProfileName.textContent =
            "";
    }

    if (menuProfileUsername) {
        menuProfileUsername.textContent =
            "";
    }

    if (menuProfileAvatar) {
        menuProfileAvatar.innerHTML =
            "👤";
    }

    atualizarBotoesCurtidas();
}

function atualizarMenuPerfil() {
    if (!usuarioAtual) {
        mostrarVisitante();
        return;
    }

    menuProfileLogged?.classList.remove(
        "hidden"
    );

    menuProfileVisitor?.classList.add(
        "hidden"
    );

    const nome =
        perfilAtual?.nome ||
        usuarioAtual?.user_metadata?.nome ||
        usuarioAtual?.user_metadata?.name ||
        usuarioAtual?.email?.split("@")[0] ||
        "Membro";

    const username =
        normalizarUsername(
            perfilAtual?.username
        ) ||
        normalizarUsername(
            usuarioAtual?.user_metadata?.username
        );

    if (menuProfileName) {
        menuProfileName.textContent =
            nome;
    }

    if (menuProfileUsername) {
        menuProfileUsername.textContent =
            username
                ? `@${username}`
                : "";
    }

    if (menuProfileAvatar) {
        menuProfileAvatar.innerHTML =
            avatarHTML(
                perfilAtual?.avatar_url,
                perfilAtual?.avatar_tipo
            );
    }

    atualizarBotoesCurtidas();
}


/* =========================================================
   AUTENTICAÇÃO
========================================================= */

function observarAutenticacao() {
    supabaseClient.auth.onAuthStateChange(
        async (_event, session) => {
            const novoUsuario =
                session?.user || null;

            const usuarioAnterior =
                usuarioAtual?.id || null;

            usuarioAtual =
                novoUsuario;

            if (!novoUsuario) {
                perfilAtual = null;

                mostrarVisitante();

                return;
            }

            mostrarUsuarioLogado();

            if (
                usuarioAnterior !==
                novoUsuario.id
            ) {
                perfilAtual = null;

                atualizarBotoesCurtidas();

                setTimeout(async () => {
                    await Promise.all([
                        carregarPerfilUsuario(),
                        carregarCurtidas()
                    ]);

                    renderizarFeed();
                }, 0);
            }
        }
    );
}


/* =========================================================
   AUTORES
========================================================= */

async function carregarPerfisAutores() {
    const usernames = [
        ...new Set(
            PUBLICACOES
                .map(post =>
                    normalizarUsername(
                        post.username
                    )
                )
                .filter(Boolean)
        )
    ];

    if (!usernames.length) {
        return;
    }

    try {
        const {
            data,
            error
        } = await supabaseClient
            .from("profiles")
            .select(`
                id,
                nome,
                username,
                cargo,
                vip,
                avatar_url,
                avatar_tipo
            `)
            .in(
                "username",
                usernames
            );

        if (error) {
            console.error(
                "Erro ao carregar autores:",
                error
            );

            return;
        }

        for (const perfil of data || []) {
            const username =
                normalizarUsername(
                    perfil.username
                );

            PUBLICACOES.forEach(
                post => {
                    if (
                        normalizarUsername(
                            post.username
                        ) === username
                    ) {
                        post.perfil =
                            perfil;
                    }
                }
            );
        }

        renderizarFeed();

    } catch (error) {
        console.error(
            "Erro nos autores:",
            error
        );
    }
}


/* =========================================================
   CURTIDAS
========================================================= */

async function carregarCurtidas() {
    try {
        const {
            data,
            error
        } = await supabaseClient
            .from("artistas_curtidas")
            .select(
                "post_id, user_id"
            );

        if (error) {
            console.error(
                "Erro ao carregar curtidas:",
                error
            );

            return;
        }

        const novoEstado = {};

        for (const item of data || []) {
            if (!novoEstado[item.post_id]) {
                novoEstado[item.post_id] = {
                    total: 0,
                    usuarios: new Set()
                };
            }

            novoEstado[item.post_id].total++;

            novoEstado[item.post_id]
                .usuarios
                .add(item.user_id);
        }

        curtidas =
            novoEstado;

        atualizarBotoesCurtidas();

    } catch (error) {
        console.error(
            "Erro nas curtidas:",
            error
        );
    }
}

function obterCurtidas(postId) {
    if (!curtidas[postId]) {
        curtidas[postId] = {
            total: 0,
            usuarios: new Set()
        };
    }

    return curtidas[postId];
}

function usuarioCurtiu(postId) {
    if (!usuarioAtual) {
        return false;
    }

    return obterCurtidas(postId)
        .usuarios
        .has(usuarioAtual.id);
}

function atualizarBotaoCurtida(
    button,
    postId
) {
    if (!button) {
        return;
    }

    const estado =
        obterCurtidas(postId);

    const curtiu =
        usuarioCurtiu(postId);

    button.classList.toggle(
        "curtiu",
        curtiu
    );

    button.classList.toggle(
        "bloqueado",
        !usuarioAtual
    );

    button.innerHTML = `
        <span class="like-icon">
            ${curtiu ? "♥" : "♡"}
        </span>
        <span>
            ${estado.total}
        </span>
    `;
}

function atualizarBotoesCurtidas() {
    document
        .querySelectorAll(
            "[data-like-post]"
        )
        .forEach(button => {
            atualizarBotaoCurtida(
                button,
                button.dataset.likePost
            );
        });
}

async function alternarCurtida(
    postId,
    button
) {
    if (!usuarioAtual) {
        alert(
            "Você precisa estar logado como membro para curtir uma publicação."
        );

        return;
    }

    if (button.disabled) {
        return;
    }

    const estado =
        obterCurtidas(postId);

    const jaCurtiu =
        estado.usuarios.has(
            usuarioAtual.id
        );

    button.disabled = true;

    try {
        if (jaCurtiu) {
            const {
                error
            } = await supabaseClient
                .from(
                    "artistas_curtidas"
                )
                .delete()
                .eq(
                    "post_id",
                    postId
                )
                .eq(
                    "user_id",
                    usuarioAtual.id
                );

            if (error) {
                throw error;
            }

            estado.usuarios.delete(
                usuarioAtual.id
            );

            estado.total =
                Math.max(
                    0,
                    estado.total - 1
                );

        } else {
            const {
                error
            } = await supabaseClient
                .from(
                    "artistas_curtidas"
                )
                .insert({
                    post_id:
                        postId,
                    user_id:
                        usuarioAtual.id
                });

            if (
                error &&
                error.code !== "23505"
            ) {
                throw error;
            }

            estado.usuarios.add(
                usuarioAtual.id
            );

            if (!error) {
                estado.total++;
            }
        }

        atualizarBotaoCurtida(
            button,
            postId
        );

    } catch (error) {
        console.error(
            "Erro ao alterar curtida:",
            error
        );

        alert(
            "Não foi possível atualizar sua curtida."
        );

    } finally {
        button.disabled =
            false;
    }
}


/* =========================================================
   DADOS DO AUTOR
========================================================= */

function dadosAutor(post) {
    const perfil =
        post.perfil;

    const nome =
        perfil?.nome ||
        post.autor ||
        perfil?.username ||
        "Membro da Casa";

    const username =
        normalizarUsername(
            perfil?.username ||
            post.username ||
            ""
        );

    const avatar =
        perfil?.avatar_url ||
        "";

    const avatarTipo =
        perfil?.avatar_tipo ||
        "";

    const cargo =
        String(
            perfil?.cargo || ""
        )
            .toLowerCase()
            .trim();

    const isAdm =
        cargo === "adm" ||
        cargo === "admin" ||
        cargo === "administrador";

    const isVip =
        perfil?.vip === true;

    return {
        nome,
        username,
        avatar,
        avatarTipo,
        isAdm,
        isVip
    };
}

function criarCabecalhoPost(post) {
    const autor =
        dadosAutor(post);

    let badges = "";

    if (autor.isAdm) {
        badges += `
            <span class="author-badge">
                ADM
            </span>
        `;
    }

    if (
        !autor.isAdm &&
        autor.isVip
    ) {
        badges += `
            <span class="author-badge">
                VIP
            </span>
        `;
    }

    const usernameHTML =
        autor.username
            ? `
                <span class="username">
                    @${escaparHTML(
                        autor.username
                    )}
                </span>
            `
            : "";

    return `
        <div class="post-top">

            <div class="post-author">

                <div class="author-avatar">
                    ${avatarHTML(
                        autor.avatar,
                        autor.avatarTipo
                    )}
                </div>

                <div class="author-info">

                    <strong>
                        ${escaparHTML(
                            autor.nome
                        )}
                    </strong>

                    <div class="author-meta">
                        ${usernameHTML}
                        ${badges}
                    </div>

                </div>

            </div>

            <span class="post-date">
                ${escaparHTML(
                    formatarData(
                        post.data
                    )
                )}
            </span>

        </div>
    `;
}


/* =========================================================
   BOTÃO DE CURTIDA
========================================================= */

function criarBotaoCurtida(post) {
    const estado =
        obterCurtidas(post.id);

    const curtiu =
        usuarioCurtiu(post.id);

    return `
        <button
            class="like-button ${
                curtiu
                    ? "curtiu"
                    : ""
            } ${
                !usuarioAtual
                    ? "bloqueado"
                    : ""
            }"
            type="button"
            data-like-post="${escaparHTML(
                post.id
            )}"
        >
            <span class="like-icon">
                ${
                    curtiu
                        ? "♥"
                        : "♡"
                }
            </span>

            <span>
                ${estado.total}
            </span>
        </button>

        ${
            !usuarioAtual
                ? `
                    <span class="login-hint">
                        Entre para curtir
                    </span>
                `
                : ""
        }
    `;
}


/* =========================================================
   CARD DE ARTE
========================================================= */

function criarCardImagem(post) {
    return `
        <article class="artista-card">

            ${criarCabecalhoPost(post)}

            <div class="post-image-wrap">

                <img
                    class="post-image"
                    src="${escaparHTML(
                        post.imagem
                    )}"
                    alt="${escaparHTML(
                        post.titulo ||
                        "Arte da comunidade"
                    )}"
                    loading="lazy"
                >

                ${
                    post.vencedor
                        ? `
                            <div class="winner-badge">
                                ♛ VENCEDOR
                            </div>
                        `
                        : ""
                }

            </div>

            <div class="post-content">

                ${
                    post.titulo
                        ? `
                            <h3 class="post-title">
                                ${escaparHTML(
                                    post.titulo
                                )}
                            </h3>
                        `
                        : ""
                }

                ${
                    post.descricao
                        ? `
                            <p class="post-description">
                                ${escaparHTML(
                                    post.descricao
                                )}
                            </p>
                        `
                        : ""
                }

                <div class="post-actions">
                    ${criarBotaoCurtida(post)}
                </div>

            </div>

        </article>
    `;
}


/* =========================================================
   CARD DE POEMA
========================================================= */

function criarCardPoema(post) {
    return `
        <article
            class="artista-card poema-card"
            data-poem-id="${escaparHTML(post.id)}"
        >

            ${criarCabecalhoPost(post)}

            <div
                class="poema-preview"
                data-poem-id="${escaparHTML(post.id)}"
                role="button"
                tabindex="0"
                aria-label="Abrir poema"
            >

                <div class="poema-preview-title">
                    ${escaparHTML(
                        post.titulo ||
                        "Poema"
                    )}
                </div>

                <div class="poema-text">
                    ${escaparHTML(
                        post.texto
                    )}
                </div>

                ${
                    post.assinatura
                        ? `
                            <div class="poema-signature">
                                ${escaparHTML(
                                    post.assinatura
                                )}
                            </div>
                        `
                        : ""
                }

                <div class="poema-expand-hint">
                    Toque para ler
                </div>

            </div>

            <div class="post-content poema-actions-content">

                <div class="post-actions">
                    ${criarBotaoCurtida(post)}
                </div>

            </div>

        </article>
    `;
}


/* =========================================================
   MODAL DO POEMA
========================================================= */

function criarModalPoema() {
    if (
        document.getElementById(
            "poema-lightbox"
        )
    ) {
        return;
    }

    const modal =
        document.createElement("div");

    modal.id =
        "poema-lightbox";

    modal.className =
        "poema-lightbox";

    modal.innerHTML = `
        <div
            class="poema-lightbox-box"
            role="dialog"
            aria-modal="true"
            aria-label="Poema ampliado"
        >

            <button
                class="poema-lightbox-close"
                type="button"
                aria-label="Fechar poema"
            >
                ×
            </button>

            <div class="poema-lightbox-scroll">

                <div
                    class="poema-lightbox-title"
                    data-poem-modal-title
                ></div>

                <div
                    class="poema-lightbox-text"
                    data-poem-modal-text
                ></div>

                <div
                    class="poema-lightbox-signature"
                    data-poem-modal-signature
                ></div>

            </div>

        </div>
    `;

    document.body.appendChild(modal);

    const botaoFechar =
        modal.querySelector(
            ".poema-lightbox-close"
        );

    botaoFechar?.addEventListener(
        "click",
        fecharPoema
    );

    modal.addEventListener(
        "click",
        event => {
            if (
                event.target ===
                modal
            ) {
                fecharPoema();
            }
        }
    );
}

function abrirPoema(postId) {
    const post =
        PUBLICACOES.find(
            item =>
                item.id === postId &&
                item.tipo === "poema"
        );

    if (!post) {
        return;
    }

    criarModalPoema();

    const modal =
        document.getElementById(
            "poema-lightbox"
        );

    const titulo =
        modal.querySelector(
            "[data-poem-modal-title]"
        );

    const texto =
        modal.querySelector(
            "[data-poem-modal-text]"
        );

    const assinatura =
        modal.querySelector(
            "[data-poem-modal-signature]"
        );

    titulo.textContent =
        post.titulo || "Poema";

    texto.textContent =
        post.texto || "";

    assinatura.textContent =
        post.assinatura || "";

    assinatura.hidden =
        !post.assinatura;

    modal.classList.add(
        "ativo"
    );

    document.body.style.overflow =
        "hidden";
}

function fecharPoema() {
    const modal =
        document.getElementById(
            "poema-lightbox"
        );

    if (!modal) {
        return;
    }

    modal.classList.remove(
        "ativo"
    );

    if (
        !document.querySelector(
            ".image-lightbox.ativo"
        )
    ) {
        document.body.style.overflow =
            "";
    }
}

function configurarPoemas() {
    if (
        document.body.dataset.poemasConfigurados ===
        "true"
    ) {
        return;
    }

    document.body.dataset.poemasConfigurados =
        "true";

    document.addEventListener(
        "click",
        event => {
            const preview =
                event.target.closest(
                    ".poema-preview"
                );

            if (!preview) {
                return;
            }

            /*
             * Se o toque foi dentro da área
             * rolável do texto, não abrimos
             * o modal.
             */
            if (
                event.target.closest(
                    ".poema-text"
                )
            ) {
                return;
            }

            abrirPoema(
                preview.dataset.poemId
            );
        }
    );

    document.addEventListener(
        "keydown",
        event => {
            const preview =
                event.target.closest(
                    ".poema-preview"
                );

            if (
                !preview ||
                (
                    event.key !== "Enter" &&
                    event.key !== " "
                )
            ) {
                return;
            }

            event.preventDefault();

            abrirPoema(
                preview.dataset.poemId
            );
        }
    );
}


/* =========================================================
   FILTROS
========================================================= */

function publicacoesFiltradas() {
    let lista =
        [...PUBLICACOES];

    if (
        filtroAtual === "arte"
    ) {
        lista =
            lista.filter(
                post =>
                    post.tipo ===
                    "arte"
            );
    }

    if (
        filtroAtual === "fotografia" ||
        filtroAtual === "foto"
    ) {
        lista =
            lista.filter(
                post =>
                    post.tipo ===
                        "fotografia" ||
                    post.tipo ===
                        "foto"
            );
    }

    if (
        filtroAtual === "poema"
    ) {
        lista =
            lista.filter(
                post =>
                    post.tipo ===
                    "poema"
            );
    }

    if (
        filtroAtual ===
        "vencedores"
    ) {
        lista =
            lista.filter(
                post =>
                    post.vencedor
            );
    }

    if (
        filtroAtual ===
        "curtidos"
    ) {
        lista.sort(
            (a, b) =>
                obterCurtidas(
                    b.id
                ).total -
                obterCurtidas(
                    a.id
                ).total
        );
    }

    return lista;
}

function configurarFiltros() {
    document
        .querySelectorAll(
            ".filtro-link"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".filtro-link"
                        )
                        .forEach(item => {
                            item.classList.remove(
                                "ativo"
                            );
                        });

                    button.classList.add(
                        "ativo"
                    );

                    filtroAtual =
                        button.dataset.filtro ||
                        "todos";

                    renderizarFeed();

                    fecharMenu();
                }
            );
        }
    );
}


/* =========================================================
   RENDERIZAÇÃO
========================================================= */

function renderizarFeed() {
    if (!feed) {
        return;
    }

    const lista =
        publicacoesFiltradas();

    feed.innerHTML =
        "";

    if (!lista.length) {
        if (emptyFeed) {
            emptyFeed.hidden =
                false;
        }

        if (feedCounter) {
            feedCounter.textContent =
                "0 publicações";
        }

        return;
    }

    if (emptyFeed) {
        emptyFeed.hidden =
            true;
    }

    lista.forEach(post => {

        if (
            post.tipo ===
            "poema"
        ) {
            feed.insertAdjacentHTML(
                "beforeend",
                criarCardPoema(
                    post
                )
            );

            return;
        }

        feed.insertAdjacentHTML(
            "beforeend",
            criarCardImagem(
                post
            )
        );
    });

    if (feedCounter) {
        feedCounter.textContent =
            `${lista.length} ${
                lista.length === 1
                    ? "publicação"
                    : "publicações"
            }`;
    }

    configurarBotoesCurtida();
}

function configurarBotoesCurtida() {
    document
        .querySelectorAll(
            "[data-like-post]"
        )
        .forEach(button => {

            if (
                button.dataset
                    .likeConfigured ===
                "true"
            ) {
                return;
            }

            button.dataset
                .likeConfigured =
                "true";

            button.addEventListener(
                "click",
                event => {
                    event.stopPropagation();

                    alternarCurtida(
                        button.dataset
                            .likePost,
                        button
                    );
                }
            );
        }
    );
}


/* =========================================================
   ZOOM DAS IMAGENS
========================================================= */

function criarLightboxImagem() {
    let lightbox =
        document.getElementById(
            "image-lightbox"
        );

    if (lightbox) {
        return lightbox;
    }

    lightbox =
        document.createElement("div");

    lightbox.id =
        "image-lightbox";

    lightbox.className =
        "image-lightbox";

    lightbox.innerHTML = `
        <button
            class="image-lightbox-close"
            type="button"
            aria-label="Fechar"
        >
            ×
        </button>

        <img
            src=""
            alt=""
        >
    `;

    document.body.appendChild(
        lightbox
    );

    const botaoFechar =
        lightbox.querySelector(
            ".image-lightbox-close"
        );

    botaoFechar?.addEventListener(
        "click",
        event => {
            event.stopPropagation();
            fecharZoom();
        }
    );

    lightbox.addEventListener(
        "click",
        event => {
            if (
                event.target ===
                lightbox
            ) {
                fecharZoom();
            }
        }
    );

    return lightbox;
}

function abrirZoom(imagem) {
    if (
        !imagem ||
        !imagem.src
    ) {
        return;
    }

    const lightbox =
        criarLightboxImagem();

    const imagemZoom =
        lightbox.querySelector(
            "img"
        );

    imagemZoom.src =
        imagem.src;

    imagemZoom.alt =
        imagem.alt ||
        "Imagem ampliada";

    lightbox.classList.add(
        "ativo"
    );
}

function fecharZoom() {
    const lightbox =
        document.getElementById(
            "image-lightbox"
        );

    if (!lightbox) {
        return;
    }

    lightbox.classList.remove(
        "ativo"
    );

    const imagemZoom =
        lightbox.querySelector(
            "img"
        );

    if (imagemZoom) {
        imagemZoom.src = "";
        imagemZoom.alt = "";
    }
}

function configurarZoomImagens() {
    if (
        document.body.dataset.zoomConfigurado ===
        "true"
    ) {
        return;
    }

    document.body.dataset.zoomConfigurado =
        "true";

    document.addEventListener(
        "click",
        event => {
            const imagem =
                event.target.closest(
                    ".post-image"
                );

            /*
             * O zoom só existe para imagens.
             * Poemas são completamente ignorados.
             */
            if (!imagem) {
                return;
            }

            if (
                imagem.closest(
                    ".poema-card"
                )
            ) {
                return;
            }

            event.stopPropagation();

            abrirZoom(imagem);
        }
    );

    document.addEventListener(
        "keydown",
        event => {
            if (
                event.key ===
                "Escape"
            ) {
                fecharZoom();
            }
        }
    );
}


/* =========================================================
   TECLAS GLOBAIS
========================================================= */

document.addEventListener(
    "keydown",
    event => {
        if (
            event.key ===
            "Escape"
        ) {
            fecharMenu();
            fecharPoema();
            fecharZoom();
        }
    }
);


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

async function iniciarAtelie() {
    renderizarFeed();

    configurarFiltros();
    configurarPoemas();
    configurarZoomImagens();

    await carregarSessao();

    await Promise.all([
        carregarCurtidas(),
        carregarPerfisAutores()
    ]);

    renderizarFeed();
}

observarAutenticacao();

iniciarAtelie();