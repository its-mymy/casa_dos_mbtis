const SUPABASE_URL = "https://lhhoqahzpuohhhnbwgfp.supabase.co";
const SUPABASE_KEY = "sb_publishable_FTie2ELWKBc4Tz9r5fZuTw_izSaEHao";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const LOGIN_URL = "../login/index.html";

let usuarioAtual = null;
let perfilAtual = null;
let posts = [];
let filtroAtual = "todos";
let tipoPublicacao = "texto";

const miniProfile = document.getElementById("mini-profile");
const miniAvatar = document.getElementById("mini-avatar");
const miniName = document.getElementById("mini-name");
const miniUsername = document.getElementById("mini-username");

const feedList = document.getElementById("feed-list");
const feedSearch = document.getElementById("feed-search");
const filterButtons = document.querySelectorAll(".filter-button");

const newPostButton = document.getElementById("new-post-button");

const menuButton = document.getElementById("menu-button");
const closeMenuButton = document.getElementById("close-menu-button");
const memberMenu = document.getElementById("member-menu");
const memberMenuOverlay = document.getElementById("member-menu-overlay");

const menuAvatar = document.getElementById("menu-avatar");
const menuName = document.getElementById("menu-name");
const menuUsername = document.getElementById("menu-username");
const menuBadge = document.getElementById("menu-badge");

const adminMenuLink = document.getElementById("admin-menu-link");
const myCardButton = document.getElementById("my-card-button");
const myVipButton = document.getElementById("my-vip-button");

const loginMenuButton = document.getElementById("login-menu-button");
const logoutButton = document.getElementById("logout-button");
const profileMenuLink = document.getElementById("profile-menu-link");

const postModal = document.getElementById("post-modal");
const postModalBackdrop = document.querySelector(".post-modal-backdrop");
const closePostModal = document.getElementById("close-post-modal");

const postForm = document.getElementById("post-form");
const postMessage = document.getElementById("post-message");

const postTypeButtons = document.querySelectorAll(".post-type-button");

const textPostFields = document.getElementById("text-post-fields");
const pollPostFields = document.getElementById("poll-post-fields");

const postTitle = document.getElementById("post-title");
const postContent = document.getElementById("post-content");

const pollQuestion = document.getElementById("poll-question");
const pollOptionsInputs = document.getElementById("poll-options-inputs");
const addPollOption = document.getElementById("add-poll-option");

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

function escaparAtributo(valor) {
    return escaparHTML(valor);
}

function mostrarToast(mensagem) {
    const toast = document.getElementById("toast");

    if (!toast) {
        return;
    }

    toast.textContent = mensagem;
    toast.classList.add("show");

    clearTimeout(mostrarToast.timer);

    mostrarToast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}

function irParaLogin() {
    sessionStorage.setItem(
        "retornoFeed",
        window.location.href
    );

    window.location.href = LOGIN_URL;
}

async function iniciar() {
    configurarEventos();
    await carregarUsuario();
    await carregarFeed();
}

function configurarEventos() {

    if (miniProfile) {
        miniProfile.addEventListener("click", () => {
            if (!usuarioAtual) {
                irParaLogin();
                return;
            }

            window.location.href = "./perfil/";
        });
    }

    if (profileMenuLink) {
        profileMenuLink.addEventListener("click", event => {
            if (!usuarioAtual) {
                event.preventDefault();
                irParaLogin();
            }
        });
    }

    if (myCardButton) {
        myCardButton.addEventListener("click", event => {
            if (!usuarioAtual) {
                event.preventDefault();
                irParaLogin();
            }
        });
    }

    if (myVipButton) {
        myVipButton.addEventListener("click", event => {
            if (!usuarioAtual) {
                event.preventDefault();
                irParaLogin();
            }
        });
    }

    if (loginMenuButton) {
        loginMenuButton.addEventListener(
            "click",
            irParaLogin
        );
    }

    if (logoutButton) {
        logoutButton.addEventListener(
            "click",
            sair
        );
    }

    if (feedSearch) {
        feedSearch.addEventListener(
            "input",
            renderizarFeed
        );
    }

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {

            filtroAtual =
                button.dataset.filter ||
                "todos";

            filterButtons.forEach(item => {
                item.classList.toggle(
                    "ativo",
                    item === button
                );
            });

            renderizarFeed();
        });
    });

    if (menuButton) {
        menuButton.addEventListener(
            "click",
            abrirMenu
        );
    }

    if (closeMenuButton) {
        closeMenuButton.addEventListener(
            "click",
            fecharMenu
        );
    }

    if (memberMenuOverlay) {
        memberMenuOverlay.addEventListener(
            "click",
            fecharMenu
        );
    }

    if (newPostButton) {
        newPostButton.addEventListener(
            "click",
            abrirModalPublicacao
        );
    }

    if (closePostModal) {
        closePostModal.addEventListener(
            "click",
            fecharModalPublicacao
        );
    }

    if (postModalBackdrop) {
        postModalBackdrop.addEventListener(
            "click",
            fecharModalPublicacao
        );
    }

    postTypeButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                tipoPublicacao =
                    button.dataset.postType ||
                    "texto";

                postTypeButtons.forEach(item => {
                    item.classList.toggle(
                        "active",
                        item === button
                    );
                });

                atualizarCamposPublicacao();
            }
        );

    });

    if (addPollOption) {
        addPollOption.addEventListener(
            "click",
            adicionarOpcaoEnquete
        );
    }

    if (postForm) {
        postForm.addEventListener(
            "submit",
            publicarPost
        );
    }

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {
                fecharMenu();
                fecharModalPublicacao();
            }

        }
    );
}

async function carregarUsuario() {

    try {

        const {
            data,
            error
        } = await supabaseClient.auth.getUser();

        if (error) {
            throw error;
        }

        usuarioAtual =
            data?.user || null;

        if (!usuarioAtual) {
            configurarVisitante();
            return;
        }

        const {
            data: perfil,
            error: perfilError
        } = await supabaseClient
            .from("profiles")
            .select(`
                id,
                nome,
                username,
                cargo,
                vip,
                avatar_url,
                avatar_tipo,
                feed_admin
            `)
            .eq("id", usuarioAtual.id)
            .maybeSingle();

        if (perfilError) {
            throw perfilError;
        }

        perfilAtual =
            perfil || null;

        if (!perfilAtual) {
            configurarVisitante();
            return;
        }

        atualizarIdentidadeTopo();
const podePublicar =
    perfilAtual.feed_admin === true;

newPostButton?.classList.toggle(
    "hidden",
    !podePublicar
);

const ehYu =
    String(
        perfilAtual.username || ""
    )
        .replace(/^@/, "")
        .toLowerCase()
        .trim() === "yu";

const ehAdm =
    String(
        perfilAtual.cargo || ""
    )
        .toLowerCase()
        .trim() === "adm";

adminMenuLink?.classList.toggle(
    "hidden",
    !(ehYu && ehAdm)
);

        loginMenuButton?.classList.add(
            "hidden"
        );

        logoutButton?.classList.remove(
            "hidden"
        );

        const isVip =
            perfilAtual.vip === true;

        myVipButton?.classList.toggle(
            "hidden",
            !isVip
        );

    } catch (error) {

        console.error(
            "Erro ao carregar usuário:",
            error
        );

        configurarVisitante();
    }
}

function configurarVisitante() {

    usuarioAtual = null;
    perfilAtual = null;

    if (miniName) {
        miniName.textContent =
            "Visitante";
    }

    if (miniUsername) {
        miniUsername.textContent =
            "Entrar";
    }

    if (miniAvatar) {
        miniAvatar.innerHTML =
            "👤";
    }

    if (menuName) {
        menuName.textContent =
            "Visitante";
    }

    if (menuUsername) {
        menuUsername.textContent =
            "Faça login para participar";
    }

    if (menuAvatar) {
        menuAvatar.innerHTML =
            "👤";
    }

    menuBadge?.classList.add(
        "hidden"
    );

    adminMenuLink?.classList.add(
        "hidden"
    );

    newPostButton?.classList.add(
        "hidden"
    );

    myVipButton?.classList.add(
        "hidden"
    );

    loginMenuButton?.classList.remove(
        "hidden"
    );

    logoutButton?.classList.add(
        "hidden"
    );
}

function atualizarIdentidadeTopo() {

    if (!perfilAtual) {
        return;
    }

    const nome =
        perfilAtual.nome ||
        "Membro";

    const username =
        normalizarUsername(
            perfilAtual.username
        );

    if (miniName) {
        miniName.textContent =
            nome;
    }

    if (miniUsername) {
        miniUsername.textContent =
            username
                ? `@${username}`
                : "@usuario";
    }

    if (menuName) {
        menuName.textContent =
            nome;
    }

    if (menuUsername) {
        menuUsername.textContent =
            username
                ? `@${username}`
                : "@usuario";
    }

    const avatarUrl =
        perfilAtual.avatar_url;

    const avatarTipo =
        perfilAtual.avatar_tipo;

    if (avatarUrl) {

        const imagem = `
            <img
                src="${escaparAtributo(avatarUrl)}"
                alt="Perfil"
            >
        `;

        if (miniAvatar) {
            miniAvatar.innerHTML =
                imagem;
        }

        if (menuAvatar) {
            menuAvatar.innerHTML =
                imagem;
        }

    } else if (
        avatarTipo?.startsWith("preset:")
    ) {

        const emoji =
            avatarTipo.replace(
                "preset:",
                ""
            );

        if (miniAvatar) {
            miniAvatar.textContent =
                emoji;
        }

        if (menuAvatar) {
            menuAvatar.textContent =
                emoji;
        }

    } else {

        if (miniAvatar) {
            miniAvatar.textContent =
                "👤";
        }

        if (menuAvatar) {
            menuAvatar.textContent =
                "👤";
        }
    }

    const isAdm =
        String(
            perfilAtual.cargo || ""
        )
            .toLowerCase()
            .trim() === "adm";

    const isVip =
        perfilAtual.vip === true;

        const ehYu =
    String(
        perfilAtual.username || ""
    )
        .replace(/^@/, "")
        .toLowerCase()
        .trim() === "yu";

adminMenuLink?.classList.toggle(
    "hidden",
    !(ehYu && isAdm)
);

    if (!menuBadge) {
        return;
    }

    if (isAdm && isVip) {

        menuBadge.textContent =
            "🛡️ ADM · 💎 VIP";

        menuBadge.classList.remove(
            "hidden"
        );

    } else if (isAdm) {

        menuBadge.textContent =
            "🛡️ ADM";

        menuBadge.classList.remove(
            "hidden"
        );

    } else if (isVip) {

        menuBadge.textContent =
            "💎 VIP";

        menuBadge.classList.remove(
            "hidden"
        );

    } else {

        menuBadge.classList.add(
            "hidden"
        );
    }
}

async function carregarFeed() {

    if (!feedList) {
        return;
    }

    feedList.innerHTML = `
        <div class="loading-card">
            <div class="loading-spinner"></div>
            <span>Carregando o feed...</span>
        </div>
    `;

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("feed_posts")
            .select(`
                id,
                author_id,
                tipo,
                titulo,
                conteudo,
                created_at,
                updated_at,
                profiles:author_id (
                    id,
                    nome,
                    username,
                    cargo,
                    vip,
                    avatar_url,
                    avatar_tipo
                ),
                feed_poll_options (
                    id,
                    post_id,
                    texto,
                    ordem
                )
            `)
            .order(
                "created_at",
                {
                    ascending: false
                }
            );

        if (error) {
            throw error;
        }

        posts =
            data || [];

        await carregarVotos();

        renderizarFeed();

    } catch (error) {

        console.error(
            "Erro ao carregar feed:",
            error
        );

        feedList.innerHTML = `
            <div class="loading-card">
                <span>
                    ❌ Não foi possível carregar o feed.
                </span>
            </div>
        `;
    }
}

async function carregarVotos() {

    for (const post of posts) {

        if (
            post.tipo !==
            "enquete"
        ) {
            continue;
        }

        const {
            data,
            error
        } = await supabaseClient
            .from("feed_poll_votes")
            .select(
                "id,post_id,option_id,user_id"
            )
            .eq(
                "post_id",
                post.id
            );

        if (error) {

            console.error(
                "Erro ao carregar votos:",
                error
            );

            post.votes =
                [];

            continue;
        }

        post.votes =
            data || [];
    }
}

function renderizarFeed() {

    if (!feedList) {
        return;
    }

    const termo =
        feedSearch
            ? feedSearch.value
                .trim()
                .toLowerCase()
            : "";

    const filtrados =
        posts.filter(post => {

            const correspondeFiltro =
                filtroAtual === "todos" ||
                post.tipo === filtroAtual;

            const textoPesquisa = [
                post.titulo || "",
                post.conteudo || "",
                post.profiles?.nome || "",
                post.profiles?.username || ""
            ]
                .join(" ")
                .toLowerCase();

            const correspondeBusca =
                !termo ||
                textoPesquisa.includes(
                    termo
                );

            return (
                correspondeFiltro &&
                correspondeBusca
            );
        });

    if (!filtrados.length) {

        feedList.innerHTML = `
            <div class="loading-card">
                <span>
                    Nenhuma publicação encontrada.
                </span>
            </div>
        `;

        return;
    }

    feedList.innerHTML = "";

    filtrados.forEach(
        post => {
            feedList.appendChild(
                criarPost(post)
            );
        }
    );
}

function criarPost(post) {

    const article =
        document.createElement(
            "article"
        );

    article.className =
        `post-card ${
            post.tipo === "enquete"
                ? "poll"
                : ""
        }`;

    const autor =
        post.profiles || {};

    const nome =
        autor.nome ||
        autor.username ||
        "Membro";

    const username =
        normalizarUsername(
            autor.username
        );

    const avatar =
        autor.avatar_url ||
        "";

    const isAdm =
        String(
            autor.cargo || ""
        )
            .toLowerCase()
            .trim() === "adm";

    const isVip =
        autor.vip === true;

    const podeApagar =
        !!(
            usuarioAtual &&
            perfilAtual?.feed_admin === true
        );

    const avatarHtml =
        avatar
            ? `
                <img
                    src="${escaparAtributo(avatar)}"
                    alt="Perfil"
                >
            `
            : autor.avatar_tipo?.startsWith(
                "preset:"
            )
                ? escaparHTML(
                    autor.avatar_tipo.replace(
                        "preset:",
                        ""
                    )
                )
                : "👤";

    article.innerHTML = `
        <div class="post-top">

            <div class="post-author">

                <div class="author-avatar">
                    ${avatarHtml}
                </div>

                <div class="author-info">

                    <strong>
                        ${escaparHTML(nome)}
                    </strong>

                    <div class="author-meta">

                        ${
                            username
                                ? `@${escaparHTML(username)}`
                                : ""
                        }

                        ${
                            isAdm
                                ? `
                                    <span class="admin-badge">
                                        👑 ADM
                                    </span>
                                `
                                : ""
                        }

                        ${
                            !isAdm && isVip
                                ? `
                                    <span class="vip-badge">
                                        💎 VIP
                                    </span>
                                `
                                : ""
                        }

                    </div>

                </div>

            </div>

            <div class="post-type-label">
                ${
                    post.tipo === "enquete"
                        ? "📊 ENQUETE"
                        : "📝 TEXTO"
                }
            </div>

        </div>
    `;

    if (podeApagar) {

        const deleteButton =
            document.createElement(
                "button"
            );

        deleteButton.type =
            "button";

        deleteButton.className =
            "delete-post-button";

        deleteButton.textContent =
            "🗑️ APAGAR";

        deleteButton.addEventListener(
            "click",
            () => apagarPost(
                post,
                deleteButton
            )
        );

        article
            .querySelector(".post-author")
            ?.appendChild(
                deleteButton
            );
    }

    if (
        post.tipo ===
        "enquete"
    ) {

        article.appendChild(
            criarPostEnquete(post)
        );

    } else {

        article.appendChild(
            criarPostTexto(post)
        );
    }

    const bottom =
        document.createElement(
            "div"
        );

    bottom.className =
        "post-bottom";

    const time =
        document.createElement(
            "span"
        );

    time.className =
        "post-time";

    time.textContent =
        formatarData(
            post.created_at
        );

    bottom.appendChild(
        time
    );

    article.appendChild(
        bottom
    );

    return article;
}

async function apagarPost(
    post,
    button
) {

    const confirmar =
        window.confirm(
            "Tem certeza que deseja apagar esta publicação?"
        );

    if (!confirmar) {
        return;
    }

    button.disabled =
        true;

    button.textContent =
        "APAGANDO...";

    try {

        const {
            error
        } = await supabaseClient
            .from("feed_posts")
            .delete()
            .eq(
                "id",
                post.id
            );

        if (error) {
            throw error;
        }

        posts =
            posts.filter(
                item =>
                    item.id !==
                    post.id
            );

        renderizarFeed();

        mostrarToast(
            "🗑️ Publicação apagada!"
        );

    } catch (error) {

        console.error(
            "Erro ao apagar publicação:",
            error
        );

        button.disabled =
            false;

        button.textContent =
            "🗑️ APAGAR";

        mostrarToast(
            "Não foi possível apagar a publicação."
        );
    }
}

function criarPostTexto(post) {

    const content =
        document.createElement(
            "div"
        );

    content.className =
        "post-content";

    if (post.titulo) {

        const title =
            document.createElement(
                "div"
            );

        title.className =
            "post-title";

        title.textContent =
            post.titulo;

        content.appendChild(
            title
        );
    }

    const text =
        document.createElement(
            "div"
        );

    text.className =
        "post-text";

    text.textContent =
        post.conteudo || "";

    content.appendChild(
        text
    );

    return content;
}

function criarPostEnquete(post) {

    const content =
        document.createElement(
            "div"
        );

    content.className =
        "post-content";

    const question =
        document.createElement(
            "div"
        );

    question.className =
        "poll-question";

    question.textContent =
        post.conteudo ||
        "Enquete";

    content.appendChild(
        question
    );

    const options =
        document.createElement(
            "div"
        );

    options.className =
        "poll-options";

    const votes =
        post.votes || [];

    const totalVotes =
        votes.length;

    const sortedOptions =
        [
            ...(post.feed_poll_options || [])
        ]
            .sort(
                (a, b) =>
                    (a.ordem || 0) -
                    (b.ordem || 0)
            );

    let meuVoto =
        null;

    if (usuarioAtual) {

        meuVoto =
            votes.find(
                vote =>
                    vote.user_id ===
                    usuarioAtual.id
            ) || null;
    }

    sortedOptions.forEach(
        option => {

            const optionVotes =
                votes.filter(
                    vote =>
                        vote.option_id ===
                        option.id
                ).length;

            const percent =
                totalVotes
                    ? Math.round(
                        (
                            optionVotes /
                            totalVotes
                        ) * 100
                    )
                    : 0;

            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.className =
                "poll-option";

            if (
                meuVoto?.option_id ===
                option.id
            ) {
                button.classList.add(
                    "voted"
                );
            }

            button.innerHTML = `
                <div
                    class="poll-option-bar"
                    style="width:${percent}%"
                ></div>

                <div class="poll-option-content">

                    <span class="poll-option-text">
                        ${escaparHTML(
                            option.texto
                        )}
                    </span>

                    <span class="poll-percent">
                        ${percent}%
                    </span>

                </div>
            `;

            button.addEventListener(
                "click",
                () => {
                    votarEnquete(
                        post,
                        option.id
                    );
                }
            );

            options.appendChild(
                button
            );
        }
    );

    content.appendChild(
        options
    );

    const footer =
        document.createElement(
            "div"
        );

    footer.className =
        "poll-footer";

    const total =
        document.createElement(
            "span"
        );

    total.className =
        "poll-total";

    total.textContent =
        `${totalVotes} ${
            totalVotes === 1
                ? "voto"
                : "votos"
        }`;

    footer.appendChild(
        total
    );

    const voteButton =
        document.createElement(
            "button"
        );

    voteButton.type =
        "button";

    voteButton.className =
        "vote-button";

    if (!usuarioAtual) {

        voteButton.textContent =
            "ENTRAR PARA VOTAR";

    } else if (meuVoto) {

        voteButton.textContent =
            "✓ VOTADO";

        voteButton.disabled =
            true;

    } else {

        voteButton.textContent =
            "ESCOLHER OPÇÃO";
    }

    voteButton.addEventListener(
        "click",
        () => {

            if (!usuarioAtual) {
                irParaLogin();
                return;
            }

            if (meuVoto) {
                return;
            }

            const primeiraOpcao =
                sortedOptions[0];

            if (primeiraOpcao) {
                votarEnquete(
                    post,
                    primeiraOpcao.id
                );
            }
        }
    );

    footer.appendChild(
        voteButton
    );

    content.appendChild(
        footer
    );

    return content;
}

async function votarEnquete(
    post,
    optionId
) {

    if (!usuarioAtual) {
        irParaLogin();
        return;
    }

    const jaVotou =
        (post.votes || []).some(
            vote =>
                vote.user_id ===
                usuarioAtual.id
        );

    if (jaVotou) {

        mostrarToast(
            "Você já votou nessa enquete."
        );

        return;
    }

    const {
        error
    } = await supabaseClient
        .from("feed_poll_votes")
        .insert({
            post_id:
                post.id,
            option_id:
                optionId,
            user_id:
                usuarioAtual.id
        });

    if (error) {

        console.error(
            "Erro ao votar:",
            error
        );

        if (
            error.code ===
            "23505"
        ) {

            mostrarToast(
                "Você já votou nessa enquete."
            );

        } else {

            mostrarToast(
                "Não foi possível registrar seu voto."
            );
        }

        return;
    }

    if (!post.votes) {
        post.votes = [];
    }

    post.votes.push({
        post_id:
            post.id,
        option_id:
            optionId,
        user_id:
            usuarioAtual.id
    });

    renderizarFeed();

    mostrarToast(
        "✅ Voto registrado!"
    );
}

function abrirModalPublicacao() {

    if (
        !usuarioAtual ||
        !perfilAtual?.feed_admin
    ) {

        mostrarToast(
            "Você não tem permissão para publicar."
        );

        return;
    }

    tipoPublicacao =
        "texto";

    postForm?.reset();

    atualizarCamposPublicacao();

    if (pollOptionsInputs) {

        pollOptionsInputs.innerHTML = `
            <input
                class="poll-option-input"
                type="text"
                maxlength="100"
                placeholder="Opção 1"
            >

            <input
                class="poll-option-input"
                type="text"
                maxlength="100"
                placeholder="Opção 2"
            >
        `;
    }

    if (postMessage) {
        postMessage.textContent =
            "";
    }

    postModal?.classList.remove(
        "hidden"
    );

    document.body.style.overflow =
        "hidden";
}

function atualizarCamposPublicacao() {

    postTypeButtons.forEach(
        button => {

            button.classList.toggle(
                "active",
                button.dataset.postType ===
                tipoPublicacao
            );
        }
    );

    if (
        tipoPublicacao ===
        "enquete"
    ) {

        textPostFields?.classList.add(
            "hidden"
        );

        pollPostFields?.classList.remove(
            "hidden"
        );

        postContent?.removeAttribute(
            "required"
        );

    } else {

        textPostFields?.classList.remove(
            "hidden"
        );

        pollPostFields?.classList.add(
            "hidden"
        );

        postContent?.setAttribute(
            "required",
            "required"
        );
    }
}

function fecharModalPublicacao() {

    if (!postModal) {
        return;
    }

    postModal.classList.add(
        "hidden"
    );

    document.body.style.overflow =
        "";
}

function adicionarOpcaoEnquete() {

    if (!pollOptionsInputs) {
        return;
    }

    const quantidade =
        pollOptionsInputs
            .querySelectorAll(
                ".poll-option-input"
            )
            .length;

    if (quantidade >= 6) {

        mostrarToast(
            "A enquete pode ter no máximo 6 opções."
        );

        return;
    }

    const input =
        document.createElement(
            "input"
        );

    input.className =
        "poll-option-input";

    input.type =
        "text";

    input.maxLength =
        100;

    input.placeholder =
        `Opção ${quantidade + 1}`;

    pollOptionsInputs.appendChild(
        input
    );
}

async function publicarPost(event) {

    event.preventDefault();

    if (
        !usuarioAtual ||
        !perfilAtual?.feed_admin
    ) {

        mostrarToast(
            "Você não tem permissão para publicar."
        );

        return;
    }

    if (postMessage) {
        postMessage.textContent =
            "Publicando...";
    }

    try {

        if (
            tipoPublicacao ===
            "texto"
        ) {

            const titulo =
                postTitle?.value
                    .trim() || "";

            const conteudo =
                postContent?.value
                    .trim() || "";

            if (!conteudo) {

                if (postMessage) {
                    postMessage.textContent =
                        "Escreva algo para publicar.";
                }

                return;
            }

            const {
                error
            } = await supabaseClient
                .from("feed_posts")
                .insert({
                    author_id:
                        usuarioAtual.id,
                    tipo:
                        "texto",
                    titulo:
                        titulo || null,
                    conteudo:
                        conteudo
                });

            if (error) {
                throw error;
            }

            mostrarToast(
                "✅ Publicação publicada!"
            );

        } else {

            const pergunta =
                pollQuestion?.value
                    .trim() || "";

            const opcoes =
                pollOptionsInputs
                    ? [
                        ...pollOptionsInputs
                            .querySelectorAll(
                                ".poll-option-input"
                            )
                    ]
                        .map(
                            input =>
                                input.value.trim()
                        )
                        .filter(Boolean)
                    : [];

            if (!pergunta) {

                if (postMessage) {
                    postMessage.textContent =
                        "Digite a pergunta da enquete.";
                }

                return;
            }

            if (opcoes.length < 2) {

                if (postMessage) {
                    postMessage.textContent =
                        "A enquete precisa ter pelo menos 2 opções.";
                }

                return;
            }

            const {
                data: novoPost,
                error: postError
            } = await supabaseClient
                .from("feed_posts")
                .insert({
                    author_id:
                        usuarioAtual.id,
                    tipo:
                        "enquete",
                    titulo:
                        null,
                    conteudo:
                        pergunta
                })
                .select()
                .single();

            if (postError) {
                throw postError;
            }

            const opcoesParaInserir =
                opcoes.map(
                    (texto, index) => ({
                        post_id:
                            novoPost.id,
                        texto,
                        ordem:
                            index
                    })
                );

            const {
                error: optionsError
            } = await supabaseClient
                .from("feed_poll_options")
                .insert(
                    opcoesParaInserir
                );

            if (optionsError) {

                await supabaseClient
                    .from("feed_posts")
                    .delete()
                    .eq(
                        "id",
                        novoPost.id
                    );

                throw optionsError;
            }

            mostrarToast(
                "📊 Enquete publicada!"
            );
        }

        postForm?.reset();

        fecharModalPublicacao();

        await carregarFeed();

    } catch (error) {

        console.error(
            "Erro ao publicar:",
            error
        );

        if (postMessage) {
            postMessage.textContent =
                error?.message ||
                "Não foi possível publicar.";
        }
    }
}

function abrirMenu() {

    memberMenu?.classList.add(
        "open"
    );

    memberMenuOverlay?.classList.add(
        "open"
    );

    document.body.style.overflow =
        "hidden";
}

function fecharMenu() {

    memberMenu?.classList.remove(
        "open"
    );

    memberMenuOverlay?.classList.remove(
        "open"
    );

    if (
        !postModal ||
        postModal.classList.contains(
            "hidden"
        )
    ) {
        document.body.style.overflow =
            "";
    }
}

async function sair() {

    try {

        const {
            error
        } =
            await supabaseClient.auth.signOut();

        if (error) {
            throw error;
        }

        window.location.href =
            LOGIN_URL;

    } catch (error) {

        console.error(
            "Erro ao sair:",
            error
        );

        mostrarToast(
            "Não foi possível sair da conta."
        );
    }
}

function formatarData(data) {

    const date =
        new Date(data);

    const agora =
        new Date();

    const diff =
        agora - date;

    const minuto =
        60 * 1000;

    const hora =
        60 * minuto;

    const dia =
        24 * hora;

    if (diff < minuto) {
        return "agora";
    }

    if (diff < hora) {

        const minutos =
            Math.floor(
                diff / minuto
            );

        return `há ${minutos} ${
            minutos === 1
                ? "minuto"
                : "minutos"
        }`;
    }

    if (diff < dia) {

        const horas =
            Math.floor(
                diff / hora
            );

        return `há ${horas} ${
            horas === 1
                ? "hora"
                : "horas"
        }`;
    }

    return date.toLocaleDateString(
        "pt-BR",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );
}

iniciar();