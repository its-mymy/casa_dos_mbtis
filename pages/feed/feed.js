const SUPABASE_URL = "https://lhhoqahzpuohhhnbwgfp.supabase.co";
const SUPABASE_KEY = "sb_publishable_FTie2ELWKBc4Tz9r5fZuTw_izSaEHao";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let usuarioAtual = null;
let perfilAtual = null;
let membros = [];
let posts = [];
let filtroAtual = "todos";
let avatarSelecionado = null;
let avatarPresetSelecionado = null;
let corSelecionada = "primary";
let arrastandoRoda = false;
let colorWheelContext = null;
let tipoPublicacao = "texto";

const pageButtons = document.querySelectorAll("[data-page]");
const communitySections = document.querySelectorAll(".community-section");

const miniProfile = document.getElementById("mini-profile");
const miniAvatar = document.getElementById("mini-avatar");
const miniName = document.getElementById("mini-name");
const miniUsername = document.getElementById("mini-username");

const feedList = document.getElementById("feed-list");
const feedSearch = document.getElementById("feed-search");
const filterButtons = document.querySelectorAll(".filter-button");
const newPostButton = document.getElementById("new-post-button");

const membersGrid = document.getElementById("members-grid");
const membersMessage = document.getElementById("members-message");
const membersSearch = document.getElementById("members-search");

const myProfileContainer = document.getElementById("my-profile-container");

const menuButton = document.getElementById("menu-button");
const closeMenuButton = document.getElementById("close-menu-button");
const memberMenu = document.getElementById("member-menu");
const memberMenuOverlay = document.getElementById("member-menu-overlay");

const menuAvatar = document.getElementById("menu-avatar");
const menuName = document.getElementById("menu-name");
const menuUsername = document.getElementById("menu-username");
const menuBadge = document.getElementById("menu-badge");

const adminMenuLink = document.getElementById("admin-menu-link");
const editProfileMenuButton = document.getElementById("edit-profile-menu-button");
const logoutButton = document.getElementById("logout-button");

const profileOverlay = document.getElementById("member-profile-overlay");
const profileOverlayBackdrop = document.querySelector(".profile-overlay-backdrop");
const closeMemberProfile = document.getElementById("close-member-profile");
const memberProfileContent = document.getElementById("member-profile-content");

const editModal = document.getElementById("edit-modal");
const editModalBackdrop = document.querySelector(".edit-modal-backdrop");
const closeEditModal = document.getElementById("close-edit-modal");
const editForm = document.getElementById("edit-form");

const editAvatarInput = document.getElementById("edit-avatar-input");
const chooseAvatarButton = document.getElementById("choose-avatar-button");
const editAvatarPreview = document.getElementById("edit-avatar-preview");
const presetAvatars = document.querySelectorAll(".preset-avatar");

const editName = document.getElementById("edit-name");
const editUsername = document.getElementById("edit-username");
const editPronomes = document.getElementById("edit-pronomes");
const editGrupo = document.getElementById("edit-grupo");
const editBio = document.getElementById("edit-bio");

const editMbti = document.getElementById("edit-mbti");
const editEneagrama = document.getElementById("edit-eneagrama");
const editTritype = document.getElementById("edit-tritype");
const editSubtipo = document.getElementById("edit-subtipo");
const editTemperamento = document.getElementById("edit-temperamento");
const editSocionics = document.getElementById("edit-socionics");
const editBigFive = document.getElementById("edit-big-five");

const editMusic = document.getElementById("edit-music");
const editArtist = document.getElementById("edit-artist");
const editGame = document.getElementById("edit-game");
const editSeries = document.getElementById("edit-series");
const editCharacter = document.getElementById("edit-character");

const editPrimary = document.getElementById("edit-primary");
const editSecondary = document.getElementById("edit-secondary");
const editAccent = document.getElementById("edit-accent");

const colorWheelCanvas = document.getElementById("color-wheel");
const colorPickerDot = document.getElementById("color-picker-dot");
const selectedColorPreview = document.getElementById("selected-color-preview");
const selectedColorHex = document.getElementById("selected-color-hex");
const colorModeButtons = document.querySelectorAll(".color-mode");

const editMessage = document.getElementById("edit-message");

const myCardButton = document.getElementById("my-card-button");
const myVipButton = document.getElementById("my-vip-button");

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

async function iniciar() {
    configurarEventos();
    desenharRodaDeCores();
    await carregarUsuario();
    await carregarMembros();
    await carregarFeed();
}

function irParaLogin() {
    sessionStorage.setItem("retornoFeed", window.location.href);
    window.location.href = "../../login/index.html";
}

function configurarEventos() {
    pageButtons.forEach(button => {
        button.addEventListener("click", () => {
            const pagina = button.dataset.page;

            if (pagina === "perfil" && !usuarioAtual) {
                irParaLogin();
                return;
            }

            trocarPagina(pagina);
        });
    });

    if (miniProfile) {
        miniProfile.addEventListener("click", () => {
            if (!usuarioAtual) {
                irParaLogin();
                return;
            }

            trocarPagina("perfil");
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

    if (feedSearch) {
        feedSearch.addEventListener("input", renderizarFeed);
    }

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filtroAtual = button.dataset.filter || "todos";

            filterButtons.forEach(item => {
                item.classList.toggle("ativo", item === button);
            });

            renderizarFeed();
        });
    });

    if (membersSearch) {
        membersSearch.addEventListener("input", renderizarMembros);
    }

    if (menuButton) {
        menuButton.addEventListener("click", abrirMenu);
    }

    if (closeMenuButton) {
        closeMenuButton.addEventListener("click", fecharMenu);
    }

    if (memberMenuOverlay) {
        memberMenuOverlay.addEventListener("click", fecharMenu);
    }

    if (editProfileMenuButton) {
        editProfileMenuButton.addEventListener("click", () => {
            fecharMenu();

            if (!usuarioAtual) {
                irParaLogin();
                return;
            }

            abrirEdicaoPerfil();
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", sair);
    }

    if (closeMemberProfile) {
        closeMemberProfile.addEventListener("click", fecharPerfilMembro);
    }

    if (profileOverlayBackdrop) {
        profileOverlayBackdrop.addEventListener("click", fecharPerfilMembro);
    }

    if (closeEditModal) {
        closeEditModal.addEventListener("click", fecharEdicaoPerfil);
    }

    if (editModalBackdrop) {
        editModalBackdrop.addEventListener("click", fecharEdicaoPerfil);
    }

    if (chooseAvatarButton && editAvatarInput) {
        chooseAvatarButton.addEventListener("click", () => {
            editAvatarInput.click();
        });
    }

    if (editAvatarInput) {
        editAvatarInput.addEventListener("change", selecionarAvatarArquivo);
    }

    presetAvatars.forEach(button => {
        button.addEventListener("click", () => {
            selecionarAvatarPreset(button);
        });
    });

    if (editForm) {
        editForm.addEventListener("submit", salvarPerfil);
    }

    colorModeButtons.forEach(button => {
        button.addEventListener("click", () => {
            corSelecionada = button.dataset.color || "primary";

            colorModeButtons.forEach(item => {
                item.classList.toggle("active", item === button);
            });

            atualizarCorSelecionadaPreview();
        });
    });

    if (colorWheelCanvas) {
        colorWheelCanvas.addEventListener("pointerdown", event => {
            arrastandoRoda = true;
            colorWheelCanvas.setPointerCapture(event.pointerId);
            selecionarCorDaRoda(event);
        });

        colorWheelCanvas.addEventListener("pointermove", event => {
            if (!arrastandoRoda) {
                return;
            }

            selecionarCorDaRoda(event);
        });

        colorWheelCanvas.addEventListener("pointerup", () => {
            arrastandoRoda = false;
        });

        colorWheelCanvas.addEventListener("pointercancel", () => {
            arrastandoRoda = false;
        });
    }

    if (newPostButton) {
        newPostButton.addEventListener("click", abrirModalPublicacao);
    }

    if (closePostModal) {
        closePostModal.addEventListener("click", fecharModalPublicacao);
    }

    if (postModalBackdrop) {
        postModalBackdrop.addEventListener("click", fecharModalPublicacao);
    }

    postTypeButtons.forEach(button => {
        button.addEventListener("click", () => {
            tipoPublicacao = button.dataset.postType || "texto";

            postTypeButtons.forEach(item => {
                item.classList.toggle("active", item === button);
            });

            if (tipoPublicacao === "texto") {
                textPostFields?.classList.remove("hidden");
                pollPostFields?.classList.add("hidden");
            } else {
                textPostFields?.classList.add("hidden");
                pollPostFields?.classList.remove("hidden");
            }
        });
    });

    if (addPollOption) {
        addPollOption.addEventListener("click", adicionarOpcaoEnquete);
    }

    if (postForm) {
        postForm.addEventListener("submit", publicarPost);
    }


    ///ENQUETE
    if (newPostButton) {
    newPostButton.addEventListener("click", abrirModalPublicacao);
}

if (closePostModal) {
    closePostModal.addEventListener("click", fecharModalPublicacao);
}

if (postModalBackdrop) {
    postModalBackdrop.addEventListener("click", fecharModalPublicacao);
}

postTypeButtons.forEach(button => {
    button.addEventListener("click", () => {
        postTipoAtual = button.dataset.postType || "texto";

        postTypeButtons.forEach(item => {
            item.classList.toggle("active", item === button);
        });

        if (postTipoAtual === "enquete") {
            textPostFields?.classList.add("hidden");
            pollPostFields?.classList.remove("hidden");
            postContent?.removeAttribute("required");
        } else {
            textPostFields?.classList.remove("hidden");
            pollPostFields?.classList.add("hidden");
            postContent?.setAttribute("required", "required");
        }
    });
});

if (addPollOption) {
    addPollOption.addEventListener("click", adicionarOpcaoEnquete);
}

if (postForm) {
    postForm.addEventListener("submit", publicarPost);
}

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            fecharMenu();
            fecharPerfilMembro();
            fecharEdicaoPerfil();
            fecharModalPublicacao();
        }
    });
}

function trocarPagina(pagina) {
    if (!pagina) {
        return;
    }

    if (pagina === "perfil" && !usuarioAtual) {
        irParaLogin();
        return;
    }

    communitySections.forEach(section => {
        section.classList.toggle("ativo", section.id === `page-${pagina}`);
    });

    pageButtons.forEach(button => {
        button.classList.toggle("ativo", button.dataset.page === pagina);
    });

    fecharMenu();

    if (pagina === "membros") {
        renderizarMembros();
    }

    if (pagina === "perfil") {
        renderizarMeuPerfil();
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

async function carregarUsuario() {
    try {
        const { data, error } = await supabaseClient.auth.getUser();

        if (error) {
            throw error;
        }

        usuarioAtual = data?.user || null;

        if (!usuarioAtual) {
            configurarVisitante();
            return;
        }

        const { data: perfil, error: perfilError } = await supabaseClient
            .from("profiles")
            .select("*")
            .eq("id", usuarioAtual.id)
            .maybeSingle();

        if (perfilError) {
            throw perfilError;
        }

        perfilAtual = perfil || null;

        if (!perfilAtual) {
            configurarVisitante();
            return;
        }

        atualizarIdentidadeTopo();

        if (perfilAtual.feed_admin === true) {
            newPostButton?.classList.remove("hidden");
            adminMenuLink?.classList.remove("hidden");
        } else {
            newPostButton?.classList.add("hidden");
            adminMenuLink?.classList.add("hidden");
        }

        renderizarMeuPerfil();
    } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        configurarVisitante();
    }
}

function configurarVisitante() {
    usuarioAtual = null;
    perfilAtual = null;

    if (miniName) {
        miniName.textContent = "Visitante";
    }

    if (miniUsername) {
        miniUsername.textContent = "Entrar";
    }

    if (miniAvatar) {
        miniAvatar.textContent = "👤";
    }

    if (menuName) {
        menuName.textContent = "Visitante";
    }

    if (menuUsername) {
        menuUsername.textContent = "Faça login para participar";
    }

    if (menuAvatar) {
        menuAvatar.textContent = "👤";
    }

    menuBadge?.classList.add("hidden");
    adminMenuLink?.classList.add("hidden");
    newPostButton?.classList.add("hidden");

    if (myProfileContainer) {
        myProfileContainer.innerHTML = `
            <div class="loading-card">
                <span>🔐 Faça login ou cadastre-se para criar seu perfil.</span>
                <button type="button" class="new-post-button" style="margin-top:10px;" onclick="irParaLogin()">
                    ENTRAR / CADASTRAR
                </button>
            </div>
        `;
    }
}

function atualizarIdentidadeTopo() {
    if (!perfilAtual) {
        return;
    }

    const nome = perfilAtual.nome || "Membro";
    const username = normalizarUsername(perfilAtual.username);

    if (miniName) {
        miniName.textContent = nome;
    }

    if (miniUsername) {
        miniUsername.textContent = username ? `@${username}` : "@usuario";
    }

    if (menuName) {
        menuName.textContent = nome;
    }

    if (menuUsername) {
        menuUsername.textContent = username ? `@${username}` : "@usuario";
    }

    if (perfilAtual.avatar_url) {
        if (miniAvatar) {
            miniAvatar.innerHTML = `<img src="${escaparAtributo(perfilAtual.avatar_url)}" alt="Perfil">`;
        }

        if (menuAvatar) {
            menuAvatar.innerHTML = `<img src="${escaparAtributo(perfilAtual.avatar_url)}" alt="Perfil">`;
        }
    } else if (perfilAtual.avatar_tipo?.startsWith("preset:")) {
        const emoji = perfilAtual.avatar_tipo.replace("preset:", "");

        if (miniAvatar) {
            miniAvatar.textContent = emoji;
        }

        if (menuAvatar) {
            menuAvatar.textContent = emoji;
        }
    } else {
        if (miniAvatar) {
            miniAvatar.textContent = "👤";
        }

        if (menuAvatar) {
            menuAvatar.textContent = "👤";
        }
    }

    const isAdm = String(perfilAtual.cargo || "").toLowerCase().trim() === "adm";
    const isVip = perfilAtual.vip === true;
    const podeApagar = usuarioAtual && perfilAtual && perfilAtual.feed_admin === true;

    if (!menuBadge) {
        return;
    }

    if (isAdm && isVip) {
        menuBadge.textContent = "🛡️ ADM · 💎 VIP";
        menuBadge.classList.remove("hidden");
    } else if (isAdm) {
        menuBadge.textContent = "🛡️ ADM";
        menuBadge.classList.remove("hidden");
    } else if (isVip) {
        menuBadge.textContent = "💎 VIP";
        menuBadge.classList.remove("hidden");
    } else {
        menuBadge.classList.add("hidden");
    }
}

async function carregarMembros() {
    if (!membersGrid || !membersMessage) {
        return;
    }

    membersMessage.textContent = "Carregando membros...";

    const { data, error } = await supabaseClient
        .from("profiles")
        .select(`
            id,
            nome,
            username,
            cargo,
            vip,
            mbti,
            eneagrama,
            tritype,
            subtipo,
            temperamento,
            socionics,
            big_five,
            grupo_casa,
            bio,
            pronomes,
            musica_favorita,
            artista_favorito,
            jogo_favorito,
            serie_favorita,
            personagem_favorito,
            avatar_url,
            avatar_tipo,
            banner_url,
            cor_principal,
            cor_secundaria,
            cor_destaque
        `)
        .order("nome", { ascending: true });

    if (error) {
        console.error("Erro ao carregar membros:", error);
        membersMessage.textContent = "Não foi possível carregar os membros.";
        membersGrid.innerHTML = "";
        return;
    }

    membros = data || [];
    renderizarMembros();
}

function renderizarMembros() {
    if (!membersGrid || !membersMessage) {
        return;
    }

    const termo = membersSearch ? membersSearch.value.trim().toLowerCase() : "";

    const filtrados = membros.filter(membro => {
        const nome = String(membro.nome || "").toLowerCase();
        const username = normalizarUsername(membro.username).toLowerCase();

        return nome.includes(termo) || username.includes(termo);
    });

    if (!filtrados.length) {
        membersGrid.innerHTML = "";
        membersMessage.textContent = "Nenhum membro encontrado.";
        return;
    }

    membersMessage.textContent = `${filtrados.length} membro(s) encontrado(s).`;
    membersGrid.innerHTML = "";

    filtrados.forEach(membro => {
        membersGrid.appendChild(criarCardMembro(membro));
    });
}

function criarCardMembro(membro) {
    const article = document.createElement("article");
    article.className = "member-card";

    const primary = membro.cor_principal || "#8B5CF6";
    const secondary = membro.cor_secundaria || "#C084FC";
    const accent = membro.cor_destaque || "#60A5FA";

    article.style.setProperty("--primary", primary);
    article.style.setProperty("--secondary", secondary);
    article.style.setProperty("--accent", accent);

    const isAdm = String(membro.cargo || "").toLowerCase().trim() === "adm";
    const isFundadora = normalizarUsername(membro.username).toLowerCase() === "yu";
    const isVip = membro.vip === true;

    let badges = "";

    if (isAdm) {
        badges += "<span>🛡️ ADM</span>";
    }

    if (isVip) {
        badges += "<span>💎 VIP</span>";
    }

    article.innerHTML = `
        <div class="member-card-top"></div>

        <div class="member-card-content">
            ${criarAvatarMembroHTML(membro)}

            <h3 class="member-name">
                ${escaparHTML(membro.nome || "Sem nome")}
            </h3>

           <div class="member-username-row">
    <p class="member-username">${membro.username ? `@${escaparHTML(normalizarUsername(membro.username))}` : "@usuario"}</p>
    ${isFundadora ? `<span class="founder-badge">🃏 FUNDADORA</span>` : ""}
</div>

            <div class="member-badges">
                ${badges}
                <span>${escaparHTML(membro.mbti || "MBTI")}</span>
                <span>${escaparHTML(membro.eneagrama || "Eneagrama")}</span>
                <span>${escaparHTML(membro.tritype || "Tritype")}</span>
            </div>

            <button class="member-card-button" type="button">
                VER PERFIL
            </button>
        </div>
    `;

    const deleteButton = article.querySelector(".delete-post-button");

if (deleteButton) {
    deleteButton.addEventListener("click", async () => {
        const confirmar = confirm("Tem certeza que deseja apagar esta publicação?");

        if (!confirmar) {
            return;
        }

        deleteButton.disabled = true;
        deleteButton.textContent = "APAGANDO...";

        try {
            const { error } = await supabaseClient
                .from("feed_posts")
                .delete()
                .eq("id", post.id);

            if (error) {
                throw error;
            }

            posts = posts.filter(item => item.id !== post.id);
            renderizarFeed();
            mostrarToast("🗑️ Publicação apagada!");

        } catch (error) {
            console.error("Erro ao apagar publicação:", error);

            deleteButton.disabled = false;
            deleteButton.textContent = "🗑️ APAGAR";

            mostrarToast("Não foi possível apagar a publicação.");
        }
    });
}

    const button = article.querySelector(".member-card-button");

    if (button) {
        button.addEventListener("click", () => {
            abrirPerfilMembro(membro.id);
        });
    }

    return article;
}

function criarAvatarMembroHTML(membro) {
    const isAdm = String(membro.cargo || "").toLowerCase().trim() === "adm";
    const classeAvatar = isAdm ? "avatar-frame-adm" : "";

    if (membro.avatar_url) {
        return `<div class="member-avatar ${classeAvatar}"><img src="${escaparAtributo(membro.avatar_url)}" alt="Foto de perfil"></div>`;
    }

    if (membro.avatar_tipo?.startsWith("preset:")) {
        return `<div class="member-avatar ${classeAvatar}"><div class="member-avatar-placeholder">${escaparHTML(membro.avatar_tipo.replace("preset:", ""))}</div></div>`;
    }

    return `<div class="member-avatar ${classeAvatar}"><div class="member-avatar-placeholder">👤</div></div>`;
}

async function abrirPerfilMembro(id) {
    if (!profileOverlay || !memberProfileContent) {
        return;
    }

    profileOverlay.classList.add("open");
    document.body.style.overflow = "hidden";

    memberProfileContent.innerHTML = `
        <div class="loading-card">
            <div class="loading-spinner"></div>
            <span>Carregando perfil...</span>
        </div>
    `;

    try {
        let membro = membros.find(item => item.id === id);

        if (!membro) {
            const { data, error } = await supabaseClient
                .from("profiles")
                .select(`
                    id,
                    nome,
                    username,
                    cargo,
                    vip,
                    mbti,
                    eneagrama,
                    tritype,
                    subtipo,
                    temperamento,
                    socionics,
                    big_five,
                    grupo_casa,
                    bio,
                    pronomes,
                    musica_favorita,
                    artista_favorito,
                    jogo_favorito,
                    serie_favorita,
                    personagem_favorito,
                    avatar_url,
                    avatar_tipo,
                    banner_url,
                    cor_principal,
                    cor_secundaria,
                    cor_destaque
                `)
                .eq("id", id)
                .single();

            if (error) {
                throw error;
            }

            membro = data;
        }

        const primary = membro.cor_principal || "#8B5CF6";
        const secondary = membro.cor_secundaria || "#C084FC";
        const accent = membro.cor_destaque || "#60A5FA";

        const isAdm = String(membro.cargo || "").toLowerCase().trim() === "adm";
        const isVip = membro.vip === true;

        let badge = "";

        if (isAdm && isVip) {
            badge = "🛡️ ADM · 💎 VIP";
        } else if (isAdm) {
            badge = "🛡️ ADM";
        } else if (isVip) {
            badge = "💎 VIP";
        }

        const username = normalizarUsername(membro.username);

        let avatarHtml = "";

        if (membro.avatar_url) {
            avatarHtml = `
                <img src="${escaparAtributo(membro.avatar_url)}" alt="Foto de perfil">
            `;
        } else if (membro.avatar_tipo?.startsWith("preset:")) {
            avatarHtml = `
                <div class="profile-avatar-placeholder-large">
                    ${escaparHTML(membro.avatar_tipo.replace("preset:", ""))}
                </div>
            `;
        } else {
            avatarHtml = `
                <div class="profile-avatar-placeholder-large">
                    👤
                </div>
            `;
        }

        let bannerHtml = "";

        if (membro.banner_url) {
            bannerHtml = `
                <img src="${escaparAtributo(membro.banner_url)}" alt="Banner do perfil">
            `;
        }

        memberProfileContent.innerHTML = `
            <div class="profile-view-banner" style="--profile-primary:${primary}; --profile-secondary:${secondary}; --profile-accent:${accent};">
                ${bannerHtml}
            </div>

            <div class="profile-view-content">

                <div class="profile-view-top">

                    <div class="profile-view-avatar" style="--profile-primary:${primary}; --profile-secondary:${secondary}; --profile-accent:${accent};">
                        ${avatarHtml}
                    </div>

                    <div class="profile-view-info">

                        <h2>
                            ${escaparHTML(membro.nome || "Sem nome")}
                        </h2>

                        <p>
                            ${username ? `@${escaparHTML(username)}` : "@usuario"}
                        </p>

                        <div class="profile-view-tags">
                            ${badge ? `<span>${badge}</span>` : ""}

                            <span>
                                ${escaparHTML(membro.mbti || "MBTI")}
                            </span>

                            <span>
                                ${escaparHTML(membro.eneagrama || "Eneagrama")}
                            </span>

                            <span>
                                ${escaparHTML(membro.tritype || "Tritype")}
                            </span>
                        </div>

                    </div>

                </div>

                <div id="profile-follow-area" class="profile-view-actions"></div>

                <div class="profile-stats">

                    <div class="profile-stat">
                        <strong id="profile-followers-count">0</strong>
                        <span>Seguidores</span>
                    </div>

                    <div class="profile-stat">
                        <strong id="profile-following-count">0</strong>
                        <span>Seguindo</span>
                    </div>

                </div>

                <div class="profile-view-grid">

                    <section class="profile-view-section full">

                        <h3>✦ Sobre mim</h3>

                        <p>
                            ${escaparHTML(membro.bio || "Nenhuma bio adicionada ainda.")}
                        </p>

                    </section>

                    <section class="profile-view-section">

                        <h3>🧠 Tipologia</h3>

                        <div class="profile-info-grid">
                            ${criarInfoPerfil("MBTI", membro.mbti)}
                            ${criarInfoPerfil("Eneagrama", membro.eneagrama)}
                            ${criarInfoPerfil("Tritype", membro.tritype)}
                            ${criarInfoPerfil("Subtipo", membro.subtipo)}
                            ${criarInfoPerfil("Temperamento", membro.temperamento)}
                            ${criarInfoPerfil("Socionics", membro.socionics)}
                            ${criarInfoPerfil("Big Five", membro.big_five)}
                            ${criarInfoPerfil("Grupo", membro.grupo_casa)}
                            ${criarInfoPerfil("Pronomes", membro.pronomes)}
                        </div>

                    </section>

                    <section class="profile-view-section">

                        <h3>🎵 Gostos</h3>

                        <div class="profile-info-grid">
                            ${criarInfoPerfil("Música", membro.musica_favorita)}
                            ${criarInfoPerfil("Artista", membro.artista_favorito)}
                            ${criarInfoPerfil("Jogo", membro.jogo_favorito)}
                            ${criarInfoPerfil("Série", membro.serie_favorita)}
                            ${criarInfoPerfil("Personagem", membro.personagem_favorito)}
                        </div>

                    </section>

                    <section class="profile-view-section full">

                        <h3>🎨 Estética</h3>

                        <div class="profile-info-grid">
                            ${criarInfoPerfil("Principal", primary)}
                            ${criarInfoPerfil("Secundária", secondary)}
                            ${criarInfoPerfil("Destaque", accent)}
                        </div>

                    </section>

                </div>

            </div>
        `;

        await configurarFollowPerfil(membro.id);

    } catch (error) {
        console.error("Erro ao carregar perfil:", error);

        memberProfileContent.innerHTML = `
            <div class="loading-card">
                <span>❌ Não foi possível carregar esse perfil.</span>
            </div>
        `;
    }
}

function criarInfoPerfil(label, valor) {
    return `
        <div class="profile-info-box">
            <span>${escaparHTML(label)}</span>
            <strong>${escaparHTML(valor || "—")}</strong>
        </div>
    `;
}

async function configurarFollowPerfil(perfilId) {
    const followArea = document.getElementById("profile-follow-area");
    const followersElement = document.getElementById("profile-followers-count");
    const followingElement = document.getElementById("profile-following-count");

    if (!followArea) {
        return;
    }

    followArea.innerHTML = "";

    try {
        const [
            seguidoresResponse,
            seguindoResponse
        ] = await Promise.all([
            supabaseClient
                .from("follows")
                .select("*", { count: "exact", head: true })
                .eq("following_id", perfilId),

            supabaseClient
                .from("follows")
                .select("*", { count: "exact", head: true })
                .eq("follower_id", perfilId)
        ]);

        if (seguidoresResponse.error) {
            console.error("Erro ao carregar seguidores:", seguidoresResponse.error);
        }

        if (seguindoResponse.error) {
            console.error("Erro ao carregar seguindo:", seguindoResponse.error);
        }

        if (followersElement) {
            followersElement.textContent = seguidoresResponse.count || 0;
        }

        if (followingElement) {
            followingElement.textContent = seguindoResponse.count || 0;
        }

        if (!usuarioAtual) {
            const button = document.createElement("button");

            button.type = "button";
            button.className = "profile-follow-button";
            button.textContent = "SEGUIR";

            button.addEventListener("click", irParaLogin);
            followArea.appendChild(button);

            return;
        }

        if (usuarioAtual.id === perfilId) {
            return;
        }

        const {
            data: followData,
            error: followError
        } = await supabaseClient
            .from("follows")
            .select("id")
            .eq("follower_id", usuarioAtual.id)
            .eq("following_id", perfilId)
            .maybeSingle();

        if (followError) {
            console.error("Erro ao verificar follow:", followError);
        }

        let seguindoEssePerfil = !!followData;

        const button = document.createElement("button");

        button.type = "button";
        button.className = "profile-follow-button";

        atualizarEstadoBotaoFollow(
            button,
            seguindoEssePerfil
        );

        button.addEventListener("click", async () => {
            if (!usuarioAtual) {
                irParaLogin();
                return;
            }

            button.disabled = true;

            try {
                if (seguindoEssePerfil) {
                    const { error } = await supabaseClient
                        .from("follows")
                        .delete()
                        .eq("follower_id", usuarioAtual.id)
                        .eq("following_id", perfilId);

                    if (error) {
                        throw error;
                    }

                    seguindoEssePerfil = false;

                    atualizarEstadoBotaoFollow(
                        button,
                        false
                    );

                    if (followersElement) {
                        const atual = Number(followersElement.textContent) || 0;
                        followersElement.textContent = Math.max(0, atual - 1);
                    }
                } else {
                    const { error } = await supabaseClient
                        .from("follows")
                        .insert({
                            follower_id: usuarioAtual.id,
                            following_id: perfilId
                        });

                    if (error) {
                        throw error;
                    }

                    seguindoEssePerfil = true;

                    atualizarEstadoBotaoFollow(
                        button,
                        true
                    );

                    if (followersElement) {
                        const atual = Number(followersElement.textContent) || 0;
                        followersElement.textContent = atual + 1;
                    }
                }

            } catch (error) {
                console.error("Erro ao alterar follow:", error);
                mostrarToast("Não foi possível alterar o follow.");
            } finally {
                button.disabled = false;
            }
        });

        followArea.appendChild(button);

    } catch (error) {
        console.error("Erro ao configurar follow:", error);
    }
}

function atualizarEstadoBotaoFollow(button, seguindo) {
    if (seguindo) {
        button.textContent = "SEGUINDO";
        button.classList.add("following");
    } else {
        button.textContent = "SEGUIR";
        button.classList.remove("following");
    }
}

//publicação enquete

function abrirModalPublicacao() {
    if (!usuarioAtual || !perfilAtual || perfilAtual.feed_admin !== true) {
        irParaLogin();
        return;
    }

    if (!postModal) {
        return;
    }

    postModal.classList.remove("hidden");
    postTipoAtual = "texto";

    postTypeButtons.forEach(button => {
        button.classList.toggle("active", button.dataset.postType === "texto");
    });

    textPostFields?.classList.remove("hidden");
    pollPostFields?.classList.add("hidden");

    postContent?.setAttribute("required", "required");

    if (postTitle) {
        postTitle.value = "";
    }

    if (postContent) {
        postContent.value = "";
    }

    if (pollQuestion) {
        pollQuestion.value = "";
    }

    if (pollOptionsInputs) {
        pollOptionsInputs.innerHTML = `
            <input class="poll-option-input" type="text" maxlength="100" placeholder="Opção 1">
            <input class="poll-option-input" type="text" maxlength="100" placeholder="Opção 2">
        `;
    }

    if (postMessage) {
        postMessage.textContent = "";
    }

    document.body.style.overflow = "hidden";
}

function fecharModalPublicacao() {
    if (!postModal) {
        return;
    }

    postModal.classList.add("hidden");
    document.body.style.overflow = "";
}

function adicionarOpcaoEnquete() {
    if (!pollOptionsInputs) {
        return;
    }

    const quantidade = pollOptionsInputs.querySelectorAll(".poll-option-input").length;

    if (quantidade >= 6) {
        mostrarToast("Máximo de 6 opções.");
        return;
    }

    const input = document.createElement("input");
    input.className = "poll-option-input";
    input.type = "text";
    input.maxLength = 100;
    input.placeholder = `Opção ${quantidade + 1}`;

    pollOptionsInputs.appendChild(input);
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
        const { data, error } = await supabaseClient
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
            .order("created_at", { ascending: false });

        if (error) {
            throw error;
        }

        posts = data || [];

        await carregarVotos();
        renderizarFeed();

    } catch (error) {
        console.error("Erro ao carregar feed:", error);

        feedList.innerHTML = `
            <div class="loading-card">
                <span>❌ Não foi possível carregar o feed.</span>
            </div>
        `;
    }
}

async function carregarVotos() {
    for (const post of posts) {
        if (post.tipo !== "enquete") {
            continue;
        }

        const { data, error } = await supabaseClient
            .from("feed_poll_votes")
            .select("id,post_id,option_id,user_id")
            .eq("post_id", post.id);

        if (error) {
            console.error("Erro ao carregar votos:", error);
            post.votes = [];
            continue;
        }

        post.votes = data || [];
    }
}

function renderizarFeed() {
    if (!feedList) {
        return;
    }

    const termo = feedSearch
        ? feedSearch.value.trim().toLowerCase()
        : "";

    const filtrados = posts.filter(post => {
        const correspondeFiltro =
            filtroAtual === "todos" ||
            post.tipo === filtroAtual;

        const textoPesquisa = [
            post.titulo || "",
            post.conteudo || "",
            post.profiles?.nome || "",
            post.profiles?.username || ""
        ].join(" ").toLowerCase();

        const correspondeBusca =
            !termo ||
            textoPesquisa.includes(termo);

        return correspondeFiltro && correspondeBusca;
    });

    if (!filtrados.length) {
        feedList.innerHTML = `
            <div class="loading-card">
                <span>Nenhuma publicação encontrada.</span>
            </div>
        `;

        return;
    }

    feedList.innerHTML = "";

    filtrados.forEach(post => {
        feedList.appendChild(criarPost(post));
    });
}

function criarPost(post) {
    const article = document.createElement("article");

    article.className = `post-card ${
        post.tipo === "enquete"
            ? "poll"
            : ""
    }`;

    const autor = post.profiles || {};
    const nome = autor.nome || autor.username || "Membro";
    const username = normalizarUsername(autor.username);
    const avatar = autor.avatar_url || "";
    const isAdm =
        String(autor.cargo || "").toLowerCase().trim() === "adm";
    const podeApagar = usuarioAtual && perfilAtual && perfilAtual.feed_admin === true;

    article.innerHTML = `
        <div class="post-top">

            <div class="post-author">

                <div class="author-avatar">
                    ${
                        avatar
                            ? `<img src="${escaparAtributo(avatar)}" alt="Perfil">`
                            : autor.avatar_tipo?.startsWith("preset:")
                                ? escaparHTML(
                                    autor.avatar_tipo.replace(
                                        "preset:",
                                        ""
                                    )
                                )
                                : "👤"
                    }
                </div>
${podeApagar ? `<button class="delete-post-button" type="button">🗑️ APAGAR</button>` : ""}
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
                                ? `<span class="admin-badge">👑 ADM</span>`
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

    if (post.tipo === "enquete") {
        article.appendChild(
            criarPostEnquete(post)
        );
    } else {
        article.appendChild(
            criarPostTexto(post)
        );
    }

    const bottom = document.createElement("div");
    bottom.className = "post-bottom";

    const time = document.createElement("span");
    time.className = "post-time";
    time.textContent = formatarData(post.created_at);

    bottom.appendChild(time);
    article.appendChild(bottom);

    const deleteButton = article.querySelector(".delete-post-button");

if (deleteButton) {
    deleteButton.addEventListener("click", async () => {
        const confirmar = confirm("Tem certeza que deseja apagar esta publicação?");

        if (!confirmar) {
            return;
        }

        deleteButton.disabled = true;
        deleteButton.textContent = "APAGANDO...";

        try {
            const { error } = await supabaseClient.from("feed_posts").delete().eq("id", post.id);

            if (error) {
                throw error;
            }

            posts = posts.filter(item => item.id !== post.id);
            renderizarFeed();
            mostrarToast("🗑️ Publicação apagada!");
        } catch (error) {
            console.error("Erro ao apagar publicação:", error);
            deleteButton.disabled = false;
            deleteButton.textContent = "🗑️ APAGAR";
            mostrarToast("Não foi possível apagar a publicação.");
        }
    });
}

    return article;
}

function criarPostTexto(post) {
    const content = document.createElement("div");
    content.className = "post-content";

    if (post.titulo) {
        const title = document.createElement("div");
        title.className = "post-title";
        title.textContent = post.titulo;
        content.appendChild(title);
    }

    const text = document.createElement("div");
    text.className = "post-text";
    text.textContent = post.conteudo || "";

    content.appendChild(text);

    return content;
}

function criarPostEnquete(post) {
    const content = document.createElement("div");
    content.className = "post-content";

    const question = document.createElement("div");
    question.className = "poll-question";
    question.textContent = post.conteudo || "Enquete";

    content.appendChild(question);

    const options = document.createElement("div");
    options.className = "poll-options";

    const votes = post.votes || [];
    const totalVotes = votes.length;

    const sortedOptions = [
        ...(post.feed_poll_options || [])
    ].sort(
        (a, b) =>
            (a.ordem || 0) -
            (b.ordem || 0)
    );

    let meuVoto = null;

    if (usuarioAtual) {
        meuVoto =
            votes.find(
                vote =>
                    vote.user_id ===
                    usuarioAtual.id
            ) || null;
    }

    sortedOptions.forEach(option => {
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
                    ) *
                    100
                )
                : 0;

        const button =
            document.createElement("button");

        button.type = "button";
        button.className = "poll-option";

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
                    ${escaparHTML(option.texto)}
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
    });

    content.appendChild(options);

    const footer =
        document.createElement("div");

    footer.className =
        "poll-footer";

    const total =
        document.createElement("span");

    total.className =
        "poll-total";

    total.textContent =
        `${totalVotes} ${
            totalVotes === 1
                ? "voto"
                : "votos"
        }`;

    footer.appendChild(total);

    const voteButton =
        document.createElement("button");

    voteButton.type = "button";
    voteButton.className = "vote-button";

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

    const { error } =
        await supabaseClient
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

        if (error.code === "23505") {
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
    if (!usuarioAtual || !perfilAtual?.feed_admin) {
        mostrarToast("Você não tem permissão para publicar.");
        return;
    }

    tipoPublicacao = "texto";

    if (postForm) {
        postForm.reset();
    }

    postTypeButtons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.postType === "texto"
        );
    });

    textPostFields?.classList.remove("hidden");
    pollPostFields?.classList.add("hidden");

    if (pollOptionsInputs) {
        pollOptionsInputs.innerHTML = `
            <input class="poll-option-input" type="text" maxlength="100" placeholder="Opção 1">
            <input class="poll-option-input" type="text" maxlength="100" placeholder="Opção 2">
        `;
    }

    if (postMessage) {
        postMessage.textContent = "";
    }

    postModal?.classList.remove("hidden");
    postModal?.classList.add("open");

    document.body.style.overflow = "hidden";
}

function fecharModalPublicacao() {
    if (!postModal) {
        return;
    }

    postModal.classList.add("hidden");
    postModal.classList.remove("open");

    if (
        !profileOverlay?.classList.contains("open") &&
        !editModal?.classList.contains("open") &&
        !memberMenu?.classList.contains("open")
    ) {
        document.body.style.overflow = "";
    }
}

function adicionarOpcaoEnquete() {
    if (!pollOptionsInputs) {
        return;
    }

    const quantidade =
        pollOptionsInputs.querySelectorAll(
            ".poll-option-input"
        ).length;

    if (quantidade >= 6) {
        mostrarToast(
            "A enquete pode ter no máximo 6 opções."
        );

        return;
    }

    const input =
        document.createElement("input");

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

    if (!usuarioAtual || !perfilAtual?.feed_admin) {
        mostrarToast(
            "Você não tem permissão para publicar."
        );

        return;
    }

    if (postMessage) {
    postMessage.textContent = "Publicando...";
}

try {
    if (postTipoAtual === "texto") {
        const titulo = postTitle ? postTitle.value.trim() : "";
        const conteudo = postContent ? postContent.value.trim() : "";

        if (!conteudo) {
            if (postMessage) postMessage.textContent = "Digite o texto da publicação.";
            return;
        }

        const { error } = await supabaseClient.from("feed_posts").insert({
            author_id: usuarioAtual.id,
            tipo: "texto",
            titulo: titulo || null,
            conteudo: conteudo
        });

        if (error) {
            throw error;
        }

        mostrarToast("✅ Publicação publicada!");

        if (postForm) {
            postForm.reset();
        }

        fecharModalPublicacao();
        await carregarFeed();
        return;
    }

    if (postTipoAtual === "enquete") {
        const pergunta = pollQuestion ? pollQuestion.value.trim() : "";
        const inputs = pollOptionsInputs ? [...pollOptionsInputs.querySelectorAll(".poll-option-input")] : [];
        const opcoes = inputs.map(input => input.value.trim()).filter(Boolean);

        if (!pergunta) {
            if (postMessage) postMessage.textContent = "Digite a pergunta da enquete.";
            return;
        }

        if (opcoes.length < 2) {
            if (postMessage) postMessage.textContent = "A enquete precisa ter pelo menos 2 opções.";
            return;
        }

        const { data: novoPost, error: postError } = await supabaseClient.from("feed_posts").insert({
            author_id: usuarioAtual.id,
            tipo: "enquete",
            titulo: null,
            conteudo: pergunta
        }).select().single();

        if (postError) {
            throw postError;
        }

        const opcoesParaInserir = opcoes.map((texto, index) => ({
            post_id: novoPost.id,
            texto: texto,
            ordem: index
        }));

        const { error: opcoesError } = await supabaseClient.from("feed_poll_options").insert(opcoesParaInserir);

        if (opcoesError) {
            await supabaseClient.from("feed_posts").delete().eq("id", novoPost.id);
            throw opcoesError;
        }

        mostrarToast("📊 Enquete publicada!");

        if (postForm) {
            postForm.reset();
        }

        fecharModalPublicacao();
        await carregarFeed();
    }
} catch (error) {
    console.error("Erro ao publicar:", error);

    if (postMessage) {
        postMessage.textContent = error?.message || "Não foi possível publicar.";
    }
}

    if (postMessage) {
        postMessage.textContent =
            "Publicando...";
    }

    try {
        if (tipoPublicacao === "texto") {
            const titulo =
                postTitle?.value.trim() || "";

            const conteudo =
                postContent?.value.trim() || "";

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

            if (postMessage) {
                postMessage.textContent =
                    "✅ Publicação criada!";
            }

            await carregarFeed();

            setTimeout(
                () => {
                    fecharModalPublicacao();
                },
                600
            );

            return;
        }

        const pergunta =
            pollQuestion?.value.trim() || "";

        const opcoes =
            [
                ...document.querySelectorAll(
                    ".poll-option-input"
                )
            ]
                .map(
                    input =>
                        input.value.trim()
                )
                .filter(Boolean);

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
            data: post,
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
                        post.id,
                    texto:
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
                .eq("id", post.id);

            throw optionsError;
        }

        if (postMessage) {
            postMessage.textContent =
                "✅ Enquete criada!";
        }

        await carregarFeed();

        setTimeout(
            () => {
                fecharModalPublicacao();
            },
            600
        );

    } catch (error) {
        console.error(
            "Erro ao publicar:",
            error
        );

        if (postMessage) {
            postMessage.textContent =
                "❌ Não foi possível publicar.";
        }
    }
}

function renderizarMeuPerfil() {
    if (!myProfileContainer) {
        return;
    }

    if (!perfilAtual) {
        myProfileContainer.innerHTML = `
            <div class="loading-card">

                <span>
                    🔐 Faça login ou cadastre-se para criar seu perfil.
                </span>

                <button
                    type="button"
                    class="new-post-button"
                    style="margin-top:10px;"
                    onclick="irParaLogin()"
                >
                    ENTRAR / CADASTRAR
                </button>

            </div>
        `;

        return;
    }

    const primary =
        perfilAtual.cor_principal ||
        "#8B5CF6";

    const secondary =
        perfilAtual.cor_secundaria ||
        "#C084FC";

    const accent =
        perfilAtual.cor_destaque ||
        "#60A5FA";

    const isAdm =
        String(
            perfilAtual.cargo ||
            ""
        ).toLowerCase().trim() ===
        "adm";

    const isVip =
        perfilAtual.vip === true;

    let badge = "";

    if (
        isAdm &&
        isVip
    ) {
        badge =
            `<span class="profile-badge-large">🛡️ ADM · 💎 VIP</span>`;
    } else if (isAdm) {
        badge =
            `<span class="profile-badge-large">🛡️ ADM</span>`;
    } else if (isVip) {
        badge =
            `<span class="profile-badge-large">💎 VIP</span>`;
    }

    let avatarHtml = "";

    if (perfilAtual.avatar_url) {
        avatarHtml = `
            <img
                src="${escaparAtributo(
                    perfilAtual.avatar_url
                )}"
                alt="Foto de perfil"
            >
        `;
    } else if (
        perfilAtual.avatar_tipo?.startsWith(
            "preset:"
        )
    ) {
        avatarHtml = `
            <div class="profile-avatar-placeholder-large">
                ${escaparHTML(
                    perfilAtual.avatar_tipo.replace(
                        "preset:",
                        ""
                    )
                )}
            </div>
        `;
    } else {
        avatarHtml = `
            <div class="profile-avatar-placeholder-large">
                👤
            </div>
        `;
    }

    let bannerHtml = "";

    if (
        perfilAtual.banner_url
    ) {
        bannerHtml = `
            <img
                src="${escaparAtributo(
                    perfilAtual.banner_url
                )}"
                alt="Banner do perfil"
            >
        `;
    }

    myProfileContainer.innerHTML = `
        <article
            class="social-profile-card"
            style="
                --profile-primary:${primary};
                --profile-secondary:${secondary};
                --profile-accent:${accent};
            "
        >

            <div class="social-profile-banner">
                ${bannerHtml}
            </div>

            <div class="social-profile-body">

                <div class="social-profile-header">

                    <div class="social-avatar-area">

                        <div class="social-profile-avatar">
                            ${avatarHtml}
                        </div>

                    </div>

                    <div class="social-profile-main">

                        <h2>
                            ${escaparHTML(
                                perfilAtual.nome ||
                                "Sem nome"
                            )}
                        </h2>

                        <div class="social-username-row">

                            <span>
                                @${escaparHTML(
                                    normalizarUsername(
                                        perfilAtual.username
                                    ) ||
                                    "usuario"
                                )}
                            </span>

                            ${badge}

                        </div>

                        <div class="social-profile-tags">

                            <span>
                                ${escaparHTML(
                                    perfilAtual.mbti ||
                                    "MBTI"
                                )}
                            </span>

                            <span>
                                ${escaparHTML(
                                    perfilAtual.eneagrama ||
                                    "Eneagrama"
                                )}
                            </span>

                            <span>
                                ${escaparHTML(
                                    perfilAtual.tritype ||
                                    "Tritype"
                                )}
                            </span>

                        </div>

                    </div>

                </div>

                <div class="social-profile-actions">

                    <button
                        id="open-edit-profile"
                        class="primary-profile-button"
                        type="button"
                    >
                        ✏️ EDITAR PERFIL
                    </button>

                    <button
                        id="open-public-profile"
                        class="secondary-profile-button"
                        type="button"
                    >
                        👀 VER COMO OS OUTROS VEEM
                    </button>

                </div>

                <section class="social-profile-section full">

                    <div class="social-section-title">

                        <span>
                            ✦
                        </span>

                        <h3>
                            Sobre mim
                        </h3>

                    </div>

                    <p>
                        ${escaparHTML(
                            perfilAtual.bio ||
                            "Nenhuma bio adicionada ainda."
                        )}
                    </p>

                </section>

                <div class="social-profile-grid">

                    <section class="social-profile-section">

                        <div class="social-section-title">

                            <span>
                                🧠
                            </span>

                            <h3>
                                Tipologia
                            </h3>

                        </div>

                        <div class="social-info-grid">

                            ${criarInfoPerfil(
                                "MBTI",
                                perfilAtual.mbti
                            )}

                            ${criarInfoPerfil(
                                "Eneagrama",
                                perfilAtual.eneagrama
                            )}

                            ${criarInfoPerfil(
                                "Tritype",
                                perfilAtual.tritype
                            )}

                            ${criarInfoPerfil(
                                "Subtipo",
                                perfilAtual.subtipo
                            )}

                            ${criarInfoPerfil(
                                "Temperamento",
                                perfilAtual.temperamento
                            )}

                            ${criarInfoPerfil(
                                "Socionics",
                                perfilAtual.socionics
                            )}

                            ${criarInfoPerfil(
                                "Big Five",
                                perfilAtual.big_five
                            )}

                            ${criarInfoPerfil(
                                "Grupo da Casa",
                                perfilAtual.grupo_casa
                            )}

                            ${criarInfoPerfil(
                                "Pronomes",
                                perfilAtual.pronomes
                            )}

                        </div>

                    </section>

                    <section class="social-profile-section">

                        <div class="social-section-title">

                            <span>
                                🎵
                            </span>

                            <h3>
                                Gostos
                            </h3>

                        </div>

                        <div class="social-info-grid">

                            ${criarInfoPerfil(
                                "Música",
                                perfilAtual.musica_favorita
                            )}

                            ${criarInfoPerfil(
                                "Artista",
                                perfilAtual.artista_favorito
                            )}

                            ${criarInfoPerfil(
                                "Jogo",
                                perfilAtual.jogo_favorito
                            )}

                            ${criarInfoPerfil(
                                "Série",
                                perfilAtual.serie_favorita
                            )}

                            ${criarInfoPerfil(
                                "Personagem",
                                perfilAtual.personagem_favorito
                            )}

                        </div>

                    </section>

                    <section class="social-profile-section full">

                        <div class="social-section-title">

                            <span>
                                🎨
                            </span>

                            <h3>
                                Minha estética
                            </h3>

                        </div>

                        <div class="social-colors">

                            <div class="social-color">

                                <span>
                                    Principal
                                </span>

                                <strong>
                                    ${primary.toUpperCase()}
                                </strong>

                                <i
                                    style="background:${primary};"
                                ></i>

                            </div>

                            <div class="social-color">

                                <span>
                                    Secundária
                                </span>

                                <strong>
                                    ${secondary.toUpperCase()}
                                </strong>

                                <i
                                    style="background:${secondary};"
                                ></i>

                            </div>

                            <div class="social-color">

                                <span>
                                    Destaque
                                </span>

                                <strong>
                                    ${accent.toUpperCase()}
                                </strong>

                                <i
                                    style="background:${accent};"
                                ></i>

                            </div>

                        </div>

                    </section>

                </div>

            </div>

        </article>
    `;

    const editButton =
        document.getElementById(
            "open-edit-profile"
        );

    if (editButton) {
        editButton.addEventListener(
            "click",
            abrirEdicaoPerfil
        );
    }

    const publicButton =
        document.getElementById(
            "open-public-profile"
        );

    if (publicButton) {
        publicButton.addEventListener(
            "click",
            () => {
                abrirPerfilMembro(
                    perfilAtual.id
                );
            }
        );
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
        !profileOverlay?.classList.contains(
            "open"
        ) &&
        !editModal?.classList.contains(
            "open"
        ) &&
        !postModal?.classList.contains(
            "open"
        )
    ) {
        document.body.style.overflow =
            "";
    }
}

function fecharPerfilMembro() {
    profileOverlay?.classList.remove(
        "open"
    );

    if (
        !editModal?.classList.contains(
            "open"
        ) &&
        !memberMenu?.classList.contains(
            "open"
        ) &&
        !postModal?.classList.contains(
            "open"
        )
    ) {
        document.body.style.overflow =
            "";
    }
}

function abrirEdicaoPerfil() {
    if (
        !usuarioAtual ||
        !perfilAtual
    ) {
        irParaLogin();
        return;
    }

    preencherFormularioPerfil();

    if (editModal) {
        editModal.classList.remove(
            "hidden"
        );

        editModal.classList.add(
            "open"
        );
    }

    document.body.style.overflow =
        "hidden";
}

function fecharEdicaoPerfil() {
    if (!editModal) {
        return;
    }

    editModal.classList.add(
        "hidden"
    );

    editModal.classList.remove(
        "open"
    );

    if (
        !profileOverlay?.classList.contains(
            "open"
        ) &&
        !memberMenu?.classList.contains(
            "open"
        ) &&
        !postModal?.classList.contains(
            "open"
        )
    ) {
        document.body.style.overflow =
            "";
    }
}

function preencherFormularioPerfil() {
    if (!perfilAtual) {
        return;
    }

    if (editName) {
        editName.value =
            perfilAtual.nome ||
            "";
    }

    if (editUsername) {
        editUsername.value =
            normalizarUsername(
                perfilAtual.username
            );
    }

    if (editPronomes) {
        editPronomes.value =
            perfilAtual.pronomes ||
            "";
    }

    if (editGrupo) {
        editGrupo.value =
            perfilAtual.grupo_casa ||
            "";
    }

    if (editBio) {
        editBio.value =
            perfilAtual.bio ||
            "";
    }

    if (editMbti) {
        editMbti.value =
            perfilAtual.mbti ||
            "";
    }

    if (editEneagrama) {
        editEneagrama.value =
            perfilAtual.eneagrama ||
            "";
    }

    if (editTritype) {
        editTritype.value =
            perfilAtual.tritype ||
            "";
    }

    if (editSubtipo) {
        editSubtipo.value =
            perfilAtual.subtipo ||
            "";
    }

    if (editTemperamento) {
        editTemperamento.value =
            perfilAtual.temperamento ||
            "";
    }

    if (editSocionics) {
        editSocionics.value =
            perfilAtual.socionics ||
            "";
    }

    if (editBigFive) {
        editBigFive.value =
            perfilAtual.big_five ||
            "";
    }

    if (editMusic) {
        editMusic.value =
            perfilAtual.musica_favorita ||
            "";
    }

    if (editArtist) {
        editArtist.value =
            perfilAtual.artista_favorito ||
            "";
    }

    if (editGame) {
        editGame.value =
            perfilAtual.jogo_favorito ||
            "";
    }

    if (editSeries) {
        editSeries.value =
            perfilAtual.serie_favorita ||
            "";
    }

    if (editCharacter) {
        editCharacter.value =
            perfilAtual.personagem_favorito ||
            "";
    }

    if (editPrimary) {
        editPrimary.value =
            perfilAtual.cor_principal ||
            "#8B5CF6";
    }

    if (editSecondary) {
        editSecondary.value =
            perfilAtual.cor_secundaria ||
            "#C084FC";
    }

    if (editAccent) {
        editAccent.value =
            perfilAtual.cor_destaque ||
            "#60A5FA";
    }

    avatarSelecionado = null;
    avatarPresetSelecionado = null;

    if (editAvatarInput) {
        editAvatarInput.value =
            "";
    }

    presetAvatars.forEach(
        button => {
            button.classList.remove(
                "active"
            );
        }
    );

    if (perfilAtual.avatar_url) {
        editAvatarPreview.innerHTML = `
            <img
                src="${escaparAtributo(
                    perfilAtual.avatar_url
                )}"
                alt="Foto de perfil"
            >
        `;
    } else if (
        perfilAtual.avatar_tipo?.startsWith(
            "preset:"
        )
    ) {
        const emoji =
            perfilAtual.avatar_tipo.replace(
                "preset:",
                ""
            );

        avatarPresetSelecionado =
            emoji;

        if (editAvatarPreview) {
            editAvatarPreview.textContent =
                emoji;
        }

        presetAvatars.forEach(
            button => {
                button.classList.toggle(
                    "active",
                    button.dataset.avatar ===
                    emoji
                );
            }
        );
    } else if (
        editAvatarPreview
    ) {
        editAvatarPreview.textContent =
            "👤";
    }

    corSelecionada =
        "primary";

    colorModeButtons.forEach(
        button => {
            button.classList.toggle(
                "active",
                button.dataset.color ===
                "primary"
            );
        }
    );

    atualizarCorSelecionadaPreview();

    if (editMessage) {
        editMessage.textContent =
            "";
    }
}

function selecionarAvatarArquivo() {
    const file =
        editAvatarInput?.files?.[0];

    if (!file) {
        return;
    }

    if (
        !file.type.startsWith(
            "image/"
        )
    ) {
        editMessage.textContent =
            "Escolha uma imagem válida.";

        editAvatarInput.value =
            "";

        return;
    }

    if (
        file.size >
        5 * 1024 * 1024
    ) {
        editMessage.textContent =
            "A imagem deve ter no máximo 5 MB.";

        editAvatarInput.value =
            "";

        return;
    }

    avatarSelecionado =
        file;

    avatarPresetSelecionado =
        null;

    presetAvatars.forEach(
        button => {
            button.classList.remove(
                "active"
            );
        }
    );

    const url =
        URL.createObjectURL(
            file
        );

    editAvatarPreview.innerHTML = `
        <img
            src="${url}"
            alt="Prévia da foto"
        >
    `;

    editMessage.textContent =
        "";
}

function selecionarAvatarPreset(
    button
) {
    avatarSelecionado =
        null;

    avatarPresetSelecionado =
        button.dataset.avatar ||
        null;

    if (editAvatarInput) {
        editAvatarInput.value =
            "";
    }

    presetAvatars.forEach(
        item => {
            item.classList.toggle(
                "active",
                item === button
            );
        }
    );

    if (editAvatarPreview) {
        editAvatarPreview.textContent =
            avatarPresetSelecionado ||
            "👤";
    }

    if (editMessage) {
        editMessage.textContent =
            "";
    }
}

async function salvarPerfil(event) {
    event.preventDefault();

    if (
        !usuarioAtual ||
        !perfilAtual
    ) {
        return;
    }

    if (editMessage) {
        editMessage.textContent =
            "Salvando...";
    }

    try {
        let avatarUrl =
            perfilAtual.avatar_url ||
            null;

        let avatarTipo =
            perfilAtual.avatar_tipo ||
            "foto";

        if (avatarSelecionado) {
            avatarUrl =
                await enviarArquivo(
                    avatarSelecionado
                );

            avatarTipo =
                "foto";
        } else if (
            avatarPresetSelecionado
        ) {
            avatarUrl =
                null;

            avatarTipo =
                `preset:${avatarPresetSelecionado}`;
        }

        const username =
            normalizarUsername(
                editUsername.value
            );

        const {
            data,
            error
        } =
            await supabaseClient
                .from(
                    "profiles"
                )
                .update({
                    nome:
                        editName.value.trim(),

                    username:
                        username ||
                        null,

                    pronomes:
                        editPronomes.value.trim() ||
                        null,

                    grupo_casa:
                        editGrupo.value ||
                        null,

                    bio:
                        editBio.value.trim() ||
                        null,

                    mbti:
                        editMbti.value.trim() ||
                        null,

                    eneagrama:
                        editEneagrama.value.trim() ||
                        null,

                    tritype:
                        editTritype.value.trim() ||
                        null,

                    subtipo:
                        editSubtipo.value.trim() ||
                        null,

                    temperamento:
                        editTemperamento.value.trim() ||
                        null,

                    socionics:
                        editSocionics.value.trim() ||
                        null,

                    big_five:
                        editBigFive.value.trim() ||
                        null,

                    musica_favorita:
                        editMusic.value.trim() ||
                        null,

                    artista_favorito:
                        editArtist.value.trim() ||
                        null,

                    jogo_favorito:
                        editGame.value.trim() ||
                        null,

                    serie_favorita:
                        editSeries.value.trim() ||
                        null,

                    personagem_favorito:
                        editCharacter.value.trim() ||
                        null,

                    avatar_url:
                        avatarUrl,

                    avatar_tipo:
                        avatarTipo,

                    cor_principal:
                        editPrimary.value,

                    cor_secundaria:
                        editSecondary.value,

                    cor_destaque:
                        editAccent.value
                })
                .eq(
                    "id",
                    usuarioAtual.id
                )
                .select()
                .single();

        if (error) {
            console.error(
                "Erro ao salvar perfil:",
                error
            );

            if (
                editMessage
            ) {
                editMessage.textContent =
                    error.code === "23505"
                        ? "Esse username já está sendo usado."
                        : "Não foi possível salvar o perfil.";
            }

            return;
        }

        perfilAtual =
            data;

        atualizarIdentidadeTopo();
        renderizarMeuPerfil();
        renderizarMembros();

        if (editMessage) {
            editMessage.textContent =
                "Perfil salvo!";
        }

        mostrarToast(
            "✅ Perfil atualizado!"
        );

        setTimeout(
            () => {
                fecharEdicaoPerfil();
            },
            700
        );

    } catch (error) {
        console.error(
            "Erro ao salvar perfil:",
            error
        );

        if (editMessage) {
            editMessage.textContent =
                error?.message ||
                "Ocorreu um erro ao salvar o perfil.";
        }
    }
}

async function enviarArquivo(file) {
    const extension =
        file.name
            .split(".")
            .pop()
            ?.toLowerCase() ||
        "jpg";

    const nomeArquivo =
        `${crypto.randomUUID()}.${extension}`;

    const caminho =
        `${usuarioAtual.id}/${nomeArquivo}`;

    const { error } =
        await supabaseClient
            .storage
            .from("avatar")
            .upload(
                caminho,
                file,
                {
                    upsert:
                        true,

                    contentType:
                        file.type
                }
            );

    if (error) {
        throw error;
    }

    const { data } =
        supabaseClient
            .storage
            .from("avatar")
            .getPublicUrl(
                caminho
            );

    if (
        !data?.publicUrl
    ) {
        throw new Error(
            "Não foi possível obter a URL da imagem."
        );
    }

    return data.publicUrl;
}

function desenharRodaDeCores() {
    if (!colorWheelCanvas) {
        return;
    }

    colorWheelContext =
        colorWheelCanvas.getContext(
            "2d"
        );

    if (!colorWheelContext) {
        return;
    }

    const tamanho =
        colorWheelCanvas.width;

    const centro =
        tamanho /
        2;

    const raio =
        tamanho /
        2;

    const imagem =
        colorWheelContext.createImageData(
            tamanho,
            tamanho
        );

    for (
        let y = 0;
        y < tamanho;
        y++
    ) {
        for (
            let x = 0;
            x < tamanho;
            x++
        ) {
            const dx =
                x -
                centro;

            const dy =
                y -
                centro;

            const distancia =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            const indice =
                (
                    y *
                    tamanho +
                    x
                ) *
                4;

            if (
                distancia >
                raio
            ) {
                imagem.data[
                    indice + 3
                ] = 0;

                continue;
            }

            const hue =
                (
                    Math.atan2(
                        dy,
                        dx
                    ) *
                    180 /
                    Math.PI +
                    360 +
                    90
                ) %
                360;

            const saturacao =
                Math.min(
                    100,
                    (
                        distancia /
                        raio
                    ) *
                    100
                );

            const rgb =
                hslParaRgb(
                    hue,
                    saturacao,
                    50
                );

            imagem.data[
                indice
            ] =
                rgb.r;

            imagem.data[
                indice + 1
            ] =
                rgb.g;

            imagem.data[
                indice + 2
            ] =
                rgb.b;

            imagem.data[
                indice + 3
            ] =
                255;
        }
    }

    colorWheelContext.putImageData(
        imagem,
        0,
        0
    );
}

function selecionarCorDaRoda(event) {
    if (!colorWheelCanvas) {
        return;
    }

    const rect =
        colorWheelCanvas.getBoundingClientRect();

    const escalaX =
        colorWheelCanvas.width /
        rect.width;

    const escalaY =
        colorWheelCanvas.height /
        rect.height;

    const x =
        (
            event.clientX -
            rect.left
        ) *
        escalaX;

    const y =
        (
            event.clientY -
            rect.top
        ) *
        escalaY;

    const centro =
        colorWheelCanvas.width /
        2;

    const dx =
        x -
        centro;

    const dy =
        y -
        centro;

    const distancia =
        Math.sqrt(
            dx * dx +
            dy * dy
        );

    const raio =
        colorWheelCanvas.width /
        2;

    if (
        distancia >
        raio
    ) {
        return;
    }

    const hue =
        (
            Math.atan2(
                dy,
                dx
            ) *
            180 /
            Math.PI +
            360 +
            90
        ) %
        360;

    const saturacao =
        Math.min(
            100,
            (
                distancia /
                raio
            ) *
            100
        );

    const rgb =
        hslParaRgb(
            hue,
            saturacao,
            50
        );

    const hex =
        rgbParaHex(
            rgb.r,
            rgb.g,
            rgb.b
        );

    if (
        corSelecionada ===
        "primary"
    ) {
        editPrimary.value =
            hex;
    } else if (
        corSelecionada ===
        "secondary"
    ) {
        editSecondary.value =
            hex;
    } else {
        editAccent.value =
            hex;
    }

    atualizarCorSelecionadaPreview(
        x,
        y,
        hex
    );
}

function atualizarCorSelecionadaPreview(
    x = null,
    y = null,
    hex = null
) {
    const valor =
        hex ||
        (
            corSelecionada ===
            "primary"
                ? editPrimary.value
                : corSelecionada ===
                    "secondary"
                    ? editSecondary.value
                    : editAccent.value
        );

    if (
        selectedColorPreview
    ) {
        selectedColorPreview.style.background =
            valor;
    }

    if (
        selectedColorHex
    ) {
        selectedColorHex.textContent =
            valor.toUpperCase();
    }

    if (
        x !== null &&
        y !== null &&
        colorWheelCanvas &&
        colorPickerDot
    ) {
        colorPickerDot.style.left =
            `${
                (
                    x /
                    colorWheelCanvas.width
                ) *
                100
            }%`;

        colorPickerDot.style.top =
            `${
                (
                    y /
                    colorWheelCanvas.height
                ) *
                100
            }%`;

        colorPickerDot.style.background =
            valor;
    }
}

function rgbParaHex(r, g, b) {
    return "#" +
        [
            r,
            g,
            b
        ]
            .map(
                valor =>
                    Math
                        .max(
                            0,
                            Math.min(
                                255,
                                Math.round(
                                    valor
                                )
                            )
                        )
                        .toString(
                            16
                        )
                        .padStart(
                            2,
                            "0"
                        )
            )
            .join("")
            .toUpperCase();
}

function hslParaRgb(h, s, l) {
    s /= 100;
    l /= 100;
    h /= 360;

    if (s === 0) {
        const valor =
            Math.round(
                l *
                255
            );

        return {
            r: valor,
            g: valor,
            b: valor
        };
    }

    const hueToRgb =
        (
            p,
            q,
            t
        ) => {
            if (t < 0) {
                t += 1;
            }

            if (t > 1) {
                t -= 1;
            }

            if (t < 1 / 6) {
                return (
                    p +
                    (
                        q -
                        p
                    ) *
                    6 *
                    t
                );
            }

            if (t < 1 / 2) {
                return q;
            }

            if (t < 2 / 3) {
                return (
                    p +
                    (
                        q -
                        p
                    ) *
                    (
                        2 / 3 -
                        t
                    ) *
                    6
                );
            }

            return p;
        };

    const q =
        l <
        0.5
            ? l *
              (
                  1 +
                  s
              )
            : l +
              s -
              l *
              s;

    const p =
        2 *
        l -
        q;

    return {
        r: Math.round(
            hueToRgb(
                p,
                q,
                h +
                    1 / 3
            ) *
            255
        ),

        g: Math.round(
            hueToRgb(
                p,
                q,
                h
            ) *
            255
        ),

        b: Math.round(
            hueToRgb(
                p,
                q,
                h -
                    1 / 3
            ) *
            255
        )
    };
}

function formatarData(data) {
    const date =
        new Date(
            data
        );

    const agora =
        new Date();

    const diff =
        agora -
        date;

    const minuto =
        60 *
        1000;

    const hora =
        60 *
        minuto;

    const dia =
        24 *
        hora;

    if (
        diff <
        minuto
    ) {
        return "agora";
    }

    if (
        diff <
        hora
    ) {
        const minutos =
            Math.floor(
                diff /
                minuto
            );

        return `há ${minutos} ${
            minutos === 1
                ? "minuto"
                : "minutos"
        }`;
    }

    if (
        diff <
        dia
    ) {
        const horas =
            Math.floor(
                diff /
                hora
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
            day:
                "2-digit",
            month:
                "2-digit",
            year:
                "numeric"
        }
    );
}

function normalizarUsername(username) {
    return String(
        username ||
        ""
    )
        .trim()
        .replace(
            /^@/,
            ""
        );
}

function escaparHTML(valor) {
    return String(
        valor ??
        ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}

function escaparAtributo(valor) {
    return escaparHTML(
        valor
    );
}

function mostrarToast(mensagem) {
    const toast =
        document.getElementById(
            "toast"
        );

    if (!toast) {
        return;
    }

    toast.textContent =
        mensagem;

    toast.classList.add(
        "show"
    );

    clearTimeout(
        mostrarToast.timer
    );

    mostrarToast.timer =
        setTimeout(
            () => {
                toast.classList.remove(
                    "show"
                );
            },
            2600
        );
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
            "../../login/index.html";

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

iniciar();