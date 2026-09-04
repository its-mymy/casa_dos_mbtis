const SUPABASE_URL = "https://lhhoqahzpuohhhnbwgfp.supabase.co";
const SUPABASE_KEY = "sb_publishable_FTie2ELWKBc4Tz9r5fZuTw_izSaEHao";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

let membros = [];
let usuarioAtual = null;
let perfilAtual = null;

const membersGrid = document.getElementById("members-grid");
const membersMessage = document.getElementById("members-message");
const searchInput = document.getElementById("search-members");

const miniProfile = document.getElementById("mini-profile");
const miniAvatar = document.getElementById("mini-avatar");
const miniName = document.getElementById("mini-name");
const miniUsername = document.getElementById("mini-username");

const menuButton = document.getElementById("menu-button");
const closeMenuButton = document.getElementById("close-menu-button");
const memberMenu = document.getElementById("member-menu");
const memberMenuOverlay = document.getElementById("member-menu-overlay");

const menuAvatar = document.getElementById("menu-avatar");
const menuName = document.getElementById("menu-name");
const menuUsername = document.getElementById("menu-username");
const menuBadge = document.getElementById("menu-badge");

const profileMenuLink = document.getElementById("profile-menu-link");
const myCardButton = document.getElementById("my-card-button");
const myVipButton = document.getElementById("my-vip-button");

const loginMenuButton = document.getElementById("login-menu-button");
const logoutButton = document.getElementById("logout-button");

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
    let toast = document.getElementById("toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "toast";
        document.body.appendChild(toast);
    }

    toast.textContent = mensagem;
    toast.classList.add("show");

    clearTimeout(mostrarToast.timer);

    mostrarToast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}

async function iniciar() {
    configurarEventos();
    await carregarUsuario();
    await carregarMembros();
}

function configurarEventos() {
    if (searchInput) {
        searchInput.addEventListener(
            "input",
            renderizarMembros
        );
    }

    if (miniProfile) {
        miniProfile.addEventListener(
            "click",
            abrirMeuPerfil
        );
    }

    if (profileMenuLink) {
        profileMenuLink.addEventListener(
            "click",
            verificarAcessoPerfil
        );
    }

    if (myCardButton) {
        myCardButton.addEventListener(
            "click",
            verificarAcessoCarteirinha
        );
    }

    if (myVipButton) {
        myVipButton.addEventListener(
            "click",
            verificarAcessoVip
        );
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

    document.addEventListener(
        "keydown",
        event => {
            if (event.key === "Escape") {
                fecharMenu();
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
                avatar_tipo
            `)
            .eq(
                "id",
                usuarioAtual.id
            )
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

        atualizarTopo();

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
        miniAvatar.textContent =
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
        menuAvatar.textContent =
            "👤";
    }

    menuBadge?.classList.add(
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

function atualizarTopo() {
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
            <img src="${escaparAtributo(avatarUrl)}" alt="Perfil">
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

    if (menuBadge) {
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

    if (myVipButton) {
        myVipButton.classList.toggle(
            "hidden",
            !isVip
        );
    }

    loginMenuButton?.classList.add(
        "hidden"
    );

    logoutButton?.classList.remove(
        "hidden"
    );
}

async function carregarMembros() {
    if (!membersGrid || !membersMessage) {
        return;
    }

    membersMessage.textContent =
        "Carregando membros...";

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
            mbti,
            eneagrama,
            tritype,
            subtipo,
            avatar_url,
            avatar_tipo,
            cor_principal,
            cor_secundaria,
            cor_destaque,
            borda_neon
        `)
        .order(
            "nome",
            {
                ascending: true
            }
        );

    if (error) {
        console.error(
            "Erro ao carregar membros:",
            error
        );

        membersMessage.textContent =
            "Não foi possível carregar os membros.";

        membersGrid.innerHTML =
            "";

        return;
    }

    membros =
        data || [];

    renderizarMembros();
}

function renderizarMembros() {
    if (!membersGrid || !membersMessage) {
        return;
    }

    const termo =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";

    const filtrados =
        membros.filter(
            membro => {

                const nome =
                    String(
                        membro.nome || ""
                    )
                        .toLowerCase();

                const username =
                    normalizarUsername(
                        membro.username
                    )
                        .toLowerCase();

                return (
                    nome.includes(termo) ||
                    username.includes(termo)
                );
            }
        );

    membersGrid.innerHTML =
        "";

    if (!filtrados.length) {
        membersMessage.textContent =
            "Nenhum membro encontrado.";

        return;
    }

    membersMessage.textContent =
        `${filtrados.length} membro(s) encontrado(s).`;

    filtrados.forEach(
        membro => {
            membersGrid.appendChild(
                criarCardMembro(membro)
            );
        }
    );
}

function criarCardMembro(membro) {
    const article =
        document.createElement(
            "article"
        );

    article.className =
        "member-card";
        

    const primary =
        membro.cor_principal ||
        "#8B5CF6";

    const secondary =
        membro.cor_secundaria ||
        "#C084FC";

    const accent =
        membro.cor_destaque ||
        "#60A5FA";

    article.style.setProperty(
        "--primary",
        primary
    );

    article.style.setProperty(
        "--secondary",
        secondary
    );

    article.style.setProperty(
        "--accent",
        accent
    );

    const isAdm =
        String(
            membro.cargo || ""
        )
            .toLowerCase()
            .trim() === "adm";

    const isVip =
        membro.vip === true;

    const bordaNeon =
    (isAdm || isVip)
        ? membro.borda_neon || ""
        : "";

if (bordaNeon) {
    article.style.setProperty(
        "--borda-neon",
        bordaNeon
    );

    article.classList.add(
        "borda-neon-personalizada"
    );
}

    const isFundadora =
        normalizarUsername(
            membro.username
        )
            .toLowerCase() === "yu";

    let badges = "";

    if (isAdm) {
        badges += `
            <span>🛡️ ADM</span>
        `;
    }

    if (isVip) {
        badges += `
            <span>💎 VIP</span>
        `;
    }

    badges += `
        <span>${escaparHTML(membro.mbti || "MBTI")}</span>
        <span>${escaparHTML(membro.eneagrama || "Eneagrama")}</span>
        <span>${escaparHTML(membro.tritype || "Tritype")}</span>
    `;

    const founderBadge =
        isFundadora
            ? `<span class="founder-badge">🃏 FUNDADORA</span>`
            : "";

    article.innerHTML = `
        <div class="member-card-top"></div>

        <div class="member-card-content">
            ${criarAvatarHTML(membro)}

            <h3 class="member-name">
                ${escaparHTML(membro.nome || "Sem nome")}
            </h3>

            <div class="member-username-row">
                <p class="member-username">
                    ${
                        membro.username
                            ? `@${escaparHTML(normalizarUsername(membro.username))}`
                            : "@usuario"
                    }
                </p>

                ${founderBadge}
            </div>

            <div class="member-badges">
                ${badges}
            </div>

            <button class="member-card-button" type="button">
                VER PERFIL
            </button>
        </div>
    `;

    const button =
        article.querySelector(
            ".member-card-button"
        );

    if (button) {
        button.addEventListener(
            "click",
            () => {
                abrirPerfilMembro(
                    membro.id
                );
            }
        );
    }

    return article;
}

function criarAvatarHTML(membro) {
    const isAdm =
        String(
            membro.cargo || ""
        )
            .toLowerCase()
            .trim() === "adm";
const isVip =
    membro.vip === true;

const classeAvatar =
    isAdm
        ? "avatar-frame-adm"
        : isVip
            ? "avatar-frame-vip"
            : "";
    if (membro.avatar_url) {
        return `
            <div class="member-avatar ${classeAvatar}">
                <img src="${escaparAtributo(membro.avatar_url)}" alt="Foto de perfil">
            </div>
        `;
    }

    if (
        membro.avatar_tipo?.startsWith(
            "preset:"
        )
    ) {
        return `
            <div class="member-avatar ${classeAvatar}">
                <div class="member-avatar-placeholder">
                    ${escaparHTML(
                        membro.avatar_tipo.replace(
                            "preset:",
                            ""
                        )
                    )}
                </div>
            </div>
        `;
    }

    return `
        <div class="member-avatar ${classeAvatar}">
            <div class="member-avatar-placeholder">
                👤
            </div>
        </div>
    `;
}

function abrirPerfilMembro(id) {
    if (!id) {
        console.error("ID do membro não informado.");
        return;
    }

    window.location.href =
        `perfil.html?id=${encodeURIComponent(id)}`;
}

function abrirMeuPerfil() {
    if (!usuarioAtual) {
        irParaLogin();
        return;
    }

    window.location.href =
        "../perfil/";
}

function verificarAcessoPerfil(event) {
    if (!usuarioAtual) {
        event.preventDefault();
        irParaLogin();
    }
}

function verificarAcessoCarteirinha(event) {
    if (!usuarioAtual) {
        event.preventDefault();
        irParaLogin();
    }
}

function verificarAcessoVip(event) {
    if (!usuarioAtual) {
        event.preventDefault();
        irParaLogin();
    }
}

function irParaLogin() {
    sessionStorage.setItem(
        "retornoFeed",
        window.location.href
    );

    window.location.href =
        "../../login/index.html";
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

    document.body.style.overflow =
        "";
}

async function sair() {
    try {
        const {
            error
        } = await supabaseClient.auth.signOut();

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