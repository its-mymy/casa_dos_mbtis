const SUPABASE_URL = "https://lhhoqahzpuohhhnbwgfp.supabase.co";
const SUPABASE_KEY = "sb_publishable_FTie2ELWKBc4Tz9r5fZuTw_izSaEHao";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

let usuarioAtual = null;
let perfilAtual = null;

let avatarSelecionado = null;
let avatarPresetSelecionado = null;
let bannerSelecionado = null;

let corSelecionada = "primary";
let arrastandoRoda = false;
let colorWheelContext = null;

const profileCard = document.getElementById("profile-card");
const profileBanner = document.getElementById("profile-banner");
const bannerImage = document.getElementById("banner-image");


const avatar = document.getElementById("avatar");

const profileName = document.getElementById("profile-name");
const profileUsername = document.getElementById("profile-username");
const profileBadge = document.getElementById("profile-badge");

const becomeVipButton =
    document.getElementById("become-vip-button");

const adminMenuLink =
    document.getElementById("admin-menu-link");

const profileStatusCloud = document.getElementById("profile-status-cloud");
const profileStatus = document.getElementById("profile-status");

const profileMbti = document.getElementById("profile-mbti");
const profileEneagrama = document.getElementById("profile-eneagrama");
const profileTritype = document.getElementById("profile-tritype");

const profileBio = document.getElementById("profile-bio");

const infoMbti = document.getElementById("info-mbti");
const infoEneagrama = document.getElementById("info-eneagrama");
const infoTritype = document.getElementById("info-tritype");
const infoSubtipo = document.getElementById("info-subtipo");
const infoGrupo = document.getElementById("info-grupo");
const infoPronomes = document.getElementById("info-pronomes");

const vipPreviewSection = document.getElementById("vip-preview-section");
const vipPreviewDescription = document.getElementById("vip-preview-description");

const vipStatus = document.getElementById("vip-status");
const vipTemperamento = document.getElementById("vip-temperamento");
const vipBigFive = document.getElementById("vip-big-five");
const vipMusic = document.getElementById("vip-music");
const vipHobby = document.getElementById("vip-hobby");
const vipCharacter = document.getElementById("vip-character");

const aestheticsSection = document.querySelector(".aesthetics-section");

const showPrimary = document.getElementById("show-primary");
const showSecondary = document.getElementById("show-secondary");
const showAccent = document.getElementById("show-accent");

const colorPrimary = document.getElementById("color-primary");
const colorSecondary = document.getElementById("color-secondary");
const colorAccent = document.getElementById("color-accent");

const editProfileButton = document.getElementById("edit-profile");
const viewProfileButton = document.getElementById("view-profile-button");
const logoutButton = document.getElementById("logout-button");
const logoutMenuButton = document.getElementById("logout-menu-button");

const editModal = document.getElementById("edit-modal");
const editModalBackdrop = document.querySelector(".edit-modal-backdrop");
const closeEditModal = document.getElementById("close-edit-modal");

const editForm = document.getElementById("edit-form");
const editMessage = document.getElementById("edit-message");

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

const vipEditSection = document.getElementById("vip-edit-section");
const vipVisualSection = document.getElementById("vip-visual-section");

const editTemperamento = document.getElementById("edit-temperamento");
const editSocionics = document.getElementById("edit-socionics");
const editBigFive = document.getElementById("edit-big-five");
const editHobby = document.getElementById("edit-hobby");
const editMusic = document.getElementById("edit-music");
const editArtist = document.getElementById("edit-artist");
const editGame = document.getElementById("edit-game");
const editSeries = document.getElementById("edit-series");
const editCharacter = document.getElementById("edit-character");
const editStatus = document.getElementById("edit-status");

const editBannerInput = document.getElementById("edit-banner-input");
const editBackground = document.getElementById("edit-background");

const editPrimary = document.getElementById("edit-primary");
const editSecondary = document.getElementById("edit-secondary");
const editAccent = document.getElementById("edit-accent");

const colorWheelCanvas = document.getElementById("color-wheel");
const colorPickerDot = document.getElementById("color-picker-dot");
const selectedColorHex = document.getElementById("selected-color-hex");
const selectedColorPreview = document.getElementById("selected-color-preview");
const colorModeButtons = document.querySelectorAll(".color-mode");

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

let isPrivilegiado = false;

async function iniciar() {
    configurarEventos();
    desenharRodaDeCores();
    await carregarPerfil();
}

function configurarEventos() {
    editProfileButton?.addEventListener(
        "click",
        abrirEdicaoPerfil
    );

    becomeVipButton?.addEventListener(
        "click",
        () => {
            if (!usuarioAtual) {
                irParaLogin();
                return;
            }

            if (perfilAtual?.vip === true) {
                mostrarToast(
                    "Você já possui VIP. 💎"
                );

                return;
            }

            mostrarToast(
                "Para ativar seu VIP, entre em contato com a administração. 💎"
            );
        }
    );

    closeEditModal?.addEventListener(
        "click",
        fecharEdicaoPerfil
    );

    editModalBackdrop?.addEventListener(
        "click",
        fecharEdicaoPerfil
    );

    editForm?.addEventListener(
        "submit",
        salvarPerfil
    );

    chooseAvatarButton?.addEventListener(
        "click",
        () => editAvatarInput?.click()
    );

    editAvatarInput?.addEventListener(
        "change",
        selecionarAvatarArquivo
    );

    presetAvatars.forEach(
        button => {
            button.addEventListener(
                "click",
                () => selecionarAvatarPreset(button)
            );
        }
    );

    editBannerInput?.addEventListener(
        "change",
        selecionarBanner
    );

    colorModeButtons.forEach(
        button => {
            button.addEventListener(
                "click",
                () => {
                    corSelecionada =
                        button.dataset.color || "primary";

                    colorModeButtons.forEach(
                        item => {
                            item.classList.toggle(
                                "active",
                                item === button
                            );
                        }
                    );

                    atualizarCorSelecionadaPreview();
                }
            );
        }
    );

    colorWheelCanvas?.addEventListener(
        "pointerdown",
        event => {
            arrastandoRoda = true;

            colorWheelCanvas.setPointerCapture(
                event.pointerId
            );

            selecionarCorDaRoda(event);
        }
    );

    colorWheelCanvas?.addEventListener(
        "pointermove",
        event => {
            if (!arrastandoRoda) {
                return;
            }

            selecionarCorDaRoda(event);
        }
    );

    colorWheelCanvas?.addEventListener(
        "pointerup",
        () => {
            arrastandoRoda = false;
        }
    );

    colorWheelCanvas?.addEventListener(
        "pointercancel",
        () => {
            arrastandoRoda = false;
        }
    );

    menuButton?.addEventListener(
        "click",
        abrirMenu
    );

    closeMenuButton?.addEventListener(
        "click",
        fecharMenu
    );

    memberMenuOverlay?.addEventListener(
        "click",
        fecharMenu
    );

    logoutButton?.addEventListener(
        "click",
        sair
    );

    logoutMenuButton?.addEventListener(
        "click",
        sair
    );

    miniProfile?.addEventListener(
        "click",
        () => {
            fecharMenu();
        }
    );

    profileMenuLink?.addEventListener(
        "click",
        () => {
            fecharMenu();
        }
    );

    myCardButton?.addEventListener(
        "click",
        event => {
            if (!usuarioAtual) {
                event.preventDefault();
                irParaLogin();
            }
        }
    );

    myVipButton?.addEventListener(
        "click",
        event => {
            if (!usuarioAtual) {
                event.preventDefault();
                irParaLogin();
                return;
            }

            if (!isPrivilegiado) {
                event.preventDefault();
                mostrarToast(
                    "Seu perfil ainda não possui acesso VIP."
                );
            }
        }
    );

    document.addEventListener(
        "keydown",
        event => {
            if (event.key === "Escape") {
                fecharEdicaoPerfil();
                fecharMenu();
            }
        }
    );
}

async function verificarExpiracaoVip(perfil) {
    const isAdm =
        String(perfil.cargo || "")
            .toLowerCase()
            .trim() === "adm";

    if (isAdm) {
        return perfil;
    }

    const expiracao =
        perfil.vip_expira_em
            ? new Date(
                perfil.vip_expira_em
            ).getTime()
            : null;

    if (
        perfil.vip === true &&
        expiracao &&
        expiracao <= Date.now()
    ) {
        const {
            data,
            error
        } = await supabaseClient
            .from("profiles")
            .update({
                vip: false
            })
            .eq(
                "id",
                perfil.id
            )
            .select()
            .single();

        if (error) {
            console.error(
                "Erro ao expirar VIP:",
                error
            );

            return {
                ...perfil,
                vip: false
            };
        }

        return data;
    }

    return perfil;
}

function configurarAcessoAdmin(perfil) {
    const ehYu =
        String(perfil.username || "")
            .replace(/^@/, "")
            .toLowerCase()
            .trim() === "yu";

    const ehAdm =
        String(perfil.cargo || "")
            .toLowerCase()
            .trim() === "adm";

    adminMenuLink?.classList.toggle(
        "hidden",
        !(ehYu && ehAdm)
    );
}

async function carregarPerfil() {
    try {
        const {
            data: authData,
            error: authError
        } = await supabaseClient.auth.getUser();

        if (authError) {
            throw authError;
        }

        usuarioAtual =
            authData?.user || null;

        if (!usuarioAtual) {
            irParaLogin();
            return;
        }

        const {
            data: perfil,
            error
        } = await supabaseClient
            .from("profiles")
            .select("*")
            .eq(
                "id",
                usuarioAtual.id
            )
            .single();

        if (error) {
            throw error;
        }

        if (!perfil) {
            throw new Error(
                "Perfil não encontrado."
            );
        }

        perfilAtual =
            await verificarExpiracaoVip(
                perfil
            );

            configurarAcessoAdmin(
    perfilAtual
);

        const isAdm =
            String(
                perfilAtual.cargo || ""
            )
                .toLowerCase()
                .trim() === "adm";

        const isVip =
            perfilAtual.vip === true;

        isPrivilegiado =
            isAdm || isVip;

        aplicarVisualPerfil(
            perfilAtual
        );

        preencherPerfil(
            perfilAtual
        );

        configurarAcessoVip();

        preencherFormulario(
            perfilAtual
        );

        atualizarTopo(
            perfilAtual
        );

        atualizarLinks(
            perfilAtual
        );

    } catch (error) {
        console.error(
            "Erro ao carregar perfil:",
            error
        );

        document.body.innerHTML = `
            <div style="min-height:100vh;display:grid;place-items:center;padding:30px;color:white;background:#08070D;font-family:Arial,sans-serif;text-align:center;">
                <div>
                    <h2>Não foi possível carregar seu perfil.</h2>
                    <p style="margin-top:10px;color:#AAA;">${escaparHTML(error?.message || "Erro desconhecido.")}</p>
                </div>
            </div>
        `;
    }
}

function preencherPerfil(perfil) {
    profileName.textContent =
        perfil.nome ||
        "Sem nome";

    const username =
        normalizarUsername(
            perfil.username
        );

    profileUsername.textContent =
        username
            ? `@${username}`
            : "@usuario";

    profileMbti.textContent =
        perfil.mbti ||
        "MBTI";

    profileEneagrama.textContent =
        perfil.eneagrama ||
        "Eneagrama";

    profileTritype.textContent =
        perfil.tritype ||
        "Tritype";

    profileBio.textContent =
        perfil.bio ||
        "Nenhuma bio adicionada ainda.";

    infoMbti.textContent =
        perfil.mbti ||
        "—";

    infoEneagrama.textContent =
        perfil.eneagrama ||
        "—";

    infoTritype.textContent =
        perfil.tritype ||
        "—";

    infoSubtipo.textContent =
        perfil.subtipo ||
        "—";

    infoGrupo.textContent =
        perfil.grupo_casa ||
        "—";

    infoPronomes.textContent =
        perfil.pronomes ||
        "—";

    mostrarAvatar(
        perfil
    );

    mostrarBanner(
        perfil
    );

    mostrarBadge(
        perfil
    );

    if (
        isPrivilegiado &&
        profileStatusCloud &&
        profileStatus
    ) {
        const status = String(
            perfil.status_perfil || ""
        ).trim();

        if (status) {
            profileStatus.textContent =
                status;

            profileStatusCloud.classList.remove(
                "hidden"
            );
        } else {
            profileStatusCloud.classList.add(
                "hidden"
            );
        }
    }

    if (isPrivilegiado) {
        if (vipStatus) {
            vipStatus.textContent =
                "💎 VIP";
        }

        if (vipTemperamento) {
            vipTemperamento.textContent =
                perfil.temperamento ||
                "—";
        }

        if (vipBigFive) {
            vipBigFive.textContent =
                perfil.big_five ||
                "—";
        }

        if (vipMusic) {
            vipMusic.textContent =
                perfil.musica_favorita ||
                "—";
        }

        if (vipHobby) {
            vipHobby.textContent =
                perfil.hobby ||
                "—";
        }

        if (vipCharacter) {
            vipCharacter.textContent =
                perfil.personagem_favorito ||
                "—";
        }
    }
}

function configurarAcessoVip() {
    vipPreviewSection?.classList.toggle(
        "hidden",
        !isPrivilegiado
    );

    vipEditSection?.classList.toggle(
        "hidden",
        !isPrivilegiado
    );

    vipVisualSection?.classList.toggle(
        "hidden",
        !isPrivilegiado
    );

    myVipButton?.classList.toggle(
        "hidden",
        !isPrivilegiado
    );

    if (aestheticsSection) {
        aestheticsSection.classList.remove(
            "hidden"
        );
    }

    if (vipPreviewDescription) {
        vipPreviewDescription.textContent =
            isPrivilegiado
                ? "Seus recursos exclusivos estão liberados."
                : "Os recursos VIP aparecem aqui quando sua conta for liberada.";
    }
}

function aplicarVisualPerfil(perfil) {
    const primary =
        isPrivilegiado
            ? perfil.cor_principal || "#8B5CF6"
            : "#8B5CF6";

    const secondary =
        isPrivilegiado
            ? perfil.cor_secundaria || "#C084FC"
            : "#C084FC";

    const accent =
        isPrivilegiado
            ? perfil.cor_destaque || "#60A5FA"
            : "#60A5FA";

    document.documentElement.style.setProperty(
        "--primary",
        primary
    );

    document.documentElement.style.setProperty(
        "--secondary",
        secondary
    );

    document.documentElement.style.setProperty(
        "--accent",
        accent
    );

    document.documentElement.style.setProperty(
        "--profile-background",
        isPrivilegiado && perfil.background_perfil
            ? perfil.background_perfil
            : ""
    );

    if (showPrimary) {
        showPrimary.textContent =
            primary.toUpperCase();
    }

    if (showSecondary) {
        showSecondary.textContent =
            secondary.toUpperCase();
    }

    if (showAccent) {
        showAccent.textContent =
            accent.toUpperCase();
    }

    if (colorPrimary) {
        colorPrimary.style.background =
            primary;
    }

    if (colorSecondary) {
        colorSecondary.style.background =
            secondary;
    }

    if (colorAccent) {
        colorAccent.style.background =
            accent;
    }

    if (
        isPrivilegiado &&
        perfil.background_perfil
    ) {
        profileCard.style.background =
            perfil.background_perfil;
    } else {
        profileCard.style.background =
            "";
    }
}

function mostrarAvatar(perfil) {
    if (!avatar) {
        return;
    }

    if (perfil.avatar_url) {
        avatar.innerHTML = `
            <img src="${escaparAtributo(perfil.avatar_url)}" alt="Foto de perfil">
        `;

        return;
    }

    if (
        perfil.avatar_tipo?.startsWith(
            "preset:"
        )
    ) {
        avatar.innerHTML = `
            <div class="public-avatar-placeholder">
                ${escaparHTML(
                    perfil.avatar_tipo.replace(
                        "preset:",
                        ""
                    )
                )}
            </div>
        `;

        return;
    }

    avatar.innerHTML = `
        <div class="public-avatar-placeholder">
            👤
        </div>
    `;
}

function mostrarBanner(perfil) {
    if (!profileBanner || !bannerImage) {
        return;
    }

    if (
        isPrivilegiado &&
        perfil.banner_url
    ) {
        bannerImage.src =
            perfil.banner_url;

        bannerImage.style.display =
            "block";
        return;
    }

    bannerImage.style.display =
        "none";
}

function mostrarBadge(perfil) {
    if (!profileBadge) {
        return;
    }

    const isAdm =
        String(
            perfil.cargo || ""
        )
            .toLowerCase()
            .trim() === "adm";

    const isVip =
        perfil.vip === true;

    if (isAdm && isVip) {
        profileBadge.textContent =
            "🛡️ ADM · 💎 VIP";

        profileBadge.classList.remove(
            "hidden"
        );
    } else if (isAdm) {
        profileBadge.textContent =
            "🛡️ ADM";

        profileBadge.classList.remove(
            "hidden"
        );
    } else if (isVip) {
        profileBadge.textContent =
            "💎 VIP";

        profileBadge.classList.remove(
            "hidden"
        );
    } else {
        profileBadge.classList.add(
            "hidden"
        );
    }
}

function preencherFormulario(perfil) {
    if (editName) {
        editName.value =
            perfil.nome ||
            "";
    }

    if (editUsername) {
        editUsername.value =
            normalizarUsername(
                perfil.username
            );
    }

    if (editPronomes) {
        editPronomes.value =
            perfil.pronomes ||
            "";
    }

    if (editGrupo) {
        editGrupo.value =
            perfil.grupo_casa ||
            "";
    }

    if (editBio) {
        editBio.value =
            perfil.bio ||
            "";
    }

    if (editMbti) {
        editMbti.value =
            perfil.mbti ||
            "";
    }

    if (editEneagrama) {
        editEneagrama.value =
            perfil.eneagrama ||
            "";
    }

    if (editTritype) {
        editTritype.value =
            perfil.tritype ||
            "";
    }

    if (editSubtipo) {
        editSubtipo.value =
            perfil.subtipo ||
            "";
    }

    if (editTemperamento) {
        editTemperamento.value =
            perfil.temperamento ||
            "";
    }

    if (editSocionics) {
        editSocionics.value =
            perfil.socionics ||
            "";
    }

    if (editBigFive) {
        editBigFive.value =
            perfil.big_five ||
            "";
    }

    if (editHobby) {
        editHobby.value =
            perfil.hobby ||
            "";
    }

    if (editMusic) {
        editMusic.value =
            perfil.musica_favorita ||
            "";
    }

    if (editArtist) {
        editArtist.value =
            perfil.artista_favorito ||
            "";
    }

    if (editGame) {
        editGame.value =
            perfil.jogo_favorito ||
            "";
    }

    if (editSeries) {
        editSeries.value =
            perfil.serie_favorita ||
            "";
    }

    if (editCharacter) {
        editCharacter.value =
            perfil.personagem_favorito ||
            "";
    }

    if (editStatus) {
        editStatus.value =
            perfil.status_perfil ||
            "";
    }

    if (editBackground) {
        editBackground.value =
            perfil.background_perfil ||
            "";
    }

    if (editPrimary) {
        editPrimary.value =
            perfil.cor_principal ||
            "#8B5CF6";
    }

    if (editSecondary) {
        editSecondary.value =
            perfil.cor_secundaria ||
            "#C084FC";
    }

    if (editAccent) {
        editAccent.value =
            perfil.cor_destaque ||
            "#60A5FA";
    }

    avatarSelecionado =
        null;

    avatarPresetSelecionado =
        null;

    bannerSelecionado =
        null;

    if (editAvatarInput) {
        editAvatarInput.value =
            "";
    }

    if (editBannerInput) {
        editBannerInput.value =
            "";
    }

    mostrarAvatarEdicao(
        perfil
    );

    presetAvatars.forEach(
        button => {
            button.classList.toggle(
                "active",
                button.dataset.avatar ===
                avatarPresetSelecionado
            );
        }
    );

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
}

function mostrarAvatarEdicao(perfil) {
    if (!editAvatarPreview) {
        return;
    }

    if (perfil.avatar_url) {
        editAvatarPreview.innerHTML = `
            <img src="${escaparAtributo(perfil.avatar_url)}" alt="Foto de perfil">
        `;

        return;
    }

    if (
        perfil.avatar_tipo?.startsWith(
            "preset:"
        )
    ) {
        avatarPresetSelecionado =
            perfil.avatar_tipo.replace(
                "preset:",
                ""
            );

        editAvatarPreview.textContent =
            avatarPresetSelecionado;

        return;
    }

    editAvatarPreview.textContent =
        "👤";
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
        mostrarMensagemEdicao(
            "Escolha uma imagem válida."
        );

        editAvatarInput.value =
            "";

        return;
    }

    if (
        file.size >
        5 * 1024 * 1024
    ) {
        mostrarMensagemEdicao(
            "A foto deve ter no máximo 5 MB."
        );

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

    const previewUrl =
        URL.createObjectURL(
            file
        );

    editAvatarPreview.innerHTML = `
        <img src="${previewUrl}" alt="Prévia da foto">
    `;

    mostrarMensagemEdicao(
        ""
    );
}

function selecionarAvatarPreset(button) {
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

    mostrarMensagemEdicao(
        ""
    );
}

function selecionarBanner() {
    if (!isPrivilegiado) {
        editBannerInput.value =
            "";

        mostrarMensagemEdicao(
            "O banner é um recurso VIP."
        );

        return;
    }

    const file =
        editBannerInput?.files?.[0];

    if (!file) {
        return;
    }

    if (
        !file.type.startsWith(
            "image/"
        )
    ) {
        mostrarMensagemEdicao(
            "Escolha uma imagem válida."
        );

        editBannerInput.value =
            "";

        return;
    }

    if (
        file.size >
        8 * 1024 * 1024
    ) {
        mostrarMensagemEdicao(
            "O banner deve ter no máximo 8 MB."
        );

        editBannerInput.value =
            "";

        return;
    }

    bannerSelecionado =
        file;

    mostrarMensagemEdicao(
        "Banner selecionado."
    );
}

async function salvarPerfil(event) {
    event.preventDefault();

    if (
        !usuarioAtual ||
        !perfilAtual
    ) {
        return;
    }

    mostrarMensagemEdicao(
        "Salvando..."
    );

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
                editUsername?.value
            );

        const dadosAtualizacao = {
            nome:
                editName?.value.trim() ||
                null,

            username:
                username ||
                null,

            pronomes:
                editPronomes?.value.trim() ||
                null,

            grupo_casa:
                editGrupo?.value ||
                null,

            bio:
                editBio?.value.trim() ||
                null,

            mbti:
                editMbti?.value.trim() ||
                null,

            eneagrama:
                editEneagrama?.value.trim() ||
                null,

            tritype:
                editTritype?.value.trim() ||
                null,

            subtipo:
                editSubtipo?.value.trim() ||
                null,

            avatar_url:
                avatarUrl,

            avatar_tipo:
                avatarTipo
        };

        if (isPrivilegiado) {
            dadosAtualizacao.temperamento =
                editTemperamento?.value.trim() ||
                null;

            dadosAtualizacao.socionics =
                editSocionics?.value.trim() ||
                null;

            dadosAtualizacao.big_five =
                editBigFive?.value.trim() ||
                null;

            dadosAtualizacao.hobby =
                editHobby?.value.trim() ||
                null;

            dadosAtualizacao.musica_favorita =
                editMusic?.value.trim() ||
                null;

            dadosAtualizacao.artista_favorito =
                editArtist?.value.trim() ||
                null;

            dadosAtualizacao.jogo_favorito =
                editGame?.value.trim() ||
                null;

            dadosAtualizacao.serie_favorita =
                editSeries?.value.trim() ||
                null;

            dadosAtualizacao.personagem_favorito =
                editCharacter?.value.trim() ||
                null;

            dadosAtualizacao.status_perfil =
                editStatus?.value.trim() ||
                null;

            dadosAtualizacao.background_perfil =
                editBackground?.value.trim() ||
                null;

            dadosAtualizacao.cor_principal =
                editPrimary?.value ||
                "#8B5CF6";

            dadosAtualizacao.cor_secundaria =
                editSecondary?.value ||
                "#C084FC";

            dadosAtualizacao.cor_destaque =
                editAccent?.value ||
                "#60A5FA";
        }

        if (
            isPrivilegiado &&
            bannerSelecionado
        ) {
            dadosAtualizacao.banner_url =
                await enviarBanner(
                    bannerSelecionado
                );
        }

        const {
            data,
            error
        } = await supabaseClient
            .from("profiles")
            .update(
                dadosAtualizacao
            )
            .eq(
                "id",
                usuarioAtual.id
            )
            .select()
            .single();

        if (error) {
            throw error;
        }

        perfilAtual =
            data;

        const cargoAtual =
            String(
                perfilAtual.cargo || ""
            )
                .toLowerCase()
                .trim();

        isPrivilegiado =
            cargoAtual === "adm" ||
            perfilAtual.vip === true;

        aplicarVisualPerfil(
            perfilAtual
        );

        preencherPerfil(
            perfilAtual
        );

        configurarAcessoVip();

        preencherFormulario(
            perfilAtual
        );

        atualizarTopo(
            perfilAtual
        );

        atualizarLinks(
            perfilAtual
        );

        mostrarMensagemEdicao(
            "Perfil salvo!"
        );

        mostrarToast(
            "✅ Perfil atualizado!"
        );

        setTimeout(
            fecharEdicaoPerfil,
            700
        );

    } catch (error) {
        console.error(
            "Erro ao salvar perfil:",
            error
        );

        if (
            error?.code ===
            "23505"
        ) {
            mostrarMensagemEdicao(
                "Esse username já está sendo usado."
            );

            return;
        }

        mostrarMensagemEdicao(
            error?.message ||
            "Não foi possível salvar o perfil."
        );
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

    const {
        error
    } = await supabaseClient
        .storage
        .from("avatar")
        .upload(
            caminho,
            file,
            {
                upsert: true,
                contentType: file.type
            }
        );

    if (error) {
        throw error;
    }

    const {
        data
    } = supabaseClient
        .storage
        .from("avatar")
        .getPublicUrl(
            caminho
        );

    if (!data?.publicUrl) {
        throw new Error(
            "Não foi possível obter a URL da imagem."
        );
    }

    return data.publicUrl;
}

async function enviarBanner(file) {
    const extension =
        file.name
            .split(".")
            .pop()
            ?.toLowerCase() ||
        "jpg";

    const nomeArquivo =
        `banner-${crypto.randomUUID()}.${extension}`;

    const caminho =
        `${usuarioAtual.id}/${nomeArquivo}`;

    const {
        error
    } = await supabaseClient
        .storage
        .from("avatar")
        .upload(
            caminho,
            file,
            {
                upsert: true,
                contentType: file.type
            }
        );

    if (error) {
        throw error;
    }

    const {
        data
    } = supabaseClient
        .storage
        .from("avatar")
        .getPublicUrl(
            caminho
        );

    if (!data?.publicUrl) {
        throw new Error(
            "Não foi possível obter a URL do banner."
        );
    }

    return data.publicUrl;
}

function abrirEdicaoPerfil() {
    if (
        !usuarioAtual ||
        !perfilAtual
    ) {
        irParaLogin();
        return;
    }

    preencherFormulario(
        perfilAtual
    );

    editModal?.classList.remove(
        "hidden"
    );

    document.body.style.overflow =
        "hidden";
}

function fecharEdicaoPerfil() {
    editModal?.classList.add(
        "hidden"
    );

    document.body.style.overflow =
        "";
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
        editModal?.classList.contains(
            "hidden"
        )
    ) {
        document.body.style.overflow =
            "";
    }
}

function atualizarTopo(perfil) {
    const nome =
        perfil.nome ||
        "Membro";

    const username =
        normalizarUsername(
            perfil.username
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

    const avatarHtml =
        perfil.avatar_url
            ? `<img src="${escaparAtributo(perfil.avatar_url)}" alt="Perfil">`
            : null;

    if (avatarHtml) {
        if (miniAvatar) {
            miniAvatar.innerHTML =
                avatarHtml;
        }

        if (menuAvatar) {
            menuAvatar.innerHTML =
                avatarHtml;
        }
    } else if (
        perfil.avatar_tipo?.startsWith(
            "preset:"
        )
    ) {
        const emoji =
            perfil.avatar_tipo.replace(
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
            perfil.cargo || ""
        )
            .toLowerCase()
            .trim() === "adm";

    const isVip =
        perfil.vip === true;

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
}

function atualizarLinks(perfil) {
    if (
        viewProfileButton
    ) {
        viewProfileButton.href =
            `../membros/perfil.html?id=${encodeURIComponent(perfil.id)}`;
    }

    myVipButton?.classList.toggle(
        "hidden",
        !isPrivilegiado
    );
}

function mostrarMensagemEdicao(
    mensagem
) {
    if (editMessage) {
        editMessage.textContent =
            mensagem;
    }
}


function mostrarToast(mensagem) {
    let toast =
        document.getElementById(
            "toast"
        );

    if (!toast) {
        toast =
            document.createElement(
                "div"
            );

        toast.id =
            "toast";

        toast.className =
            "toast";

        document.body.appendChild(
            toast
        );
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

function irParaLogin() {
    sessionStorage.setItem(
        "retornoFeed",
        window.location.href
    );

    window.location.href =
        "../../login/index.html";
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

function normalizarUsername(username) {
    return String(
        username || ""
    )
        .trim()
        .replace(
            /^@/,
            ""
        );
}

function escaparHTML(valor) {
    return String(
        valor ?? ""
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
        tamanho / 2;

    const raio =
        tamanho / 2;

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
                ? editPrimary?.value
                : corSelecionada ===
                    "secondary"
                    ? editSecondary?.value
                    : editAccent?.value
        );

    if (!valor) {
        return;
    }

    if (selectedColorPreview) {
        selectedColorPreview.style.background =
            valor;
    }

    if (selectedColorHex) {
        selectedColorHex.textContent =
            valor.toUpperCase();
    }

    if (
        x !== null &&
        y !== null &&
        colorPickerDot &&
        colorWheelCanvas
    ) {
        colorPickerDot.style.left =
            `${(
                x /
                colorWheelCanvas.width
            ) * 100}%`;

        colorPickerDot.style.top =
            `${(
                y /
                colorWheelCanvas.height
            ) * 100}%`;

        colorPickerDot.style.background =
            valor;
    }
}

function rgbParaHex(r,g,b) {
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

function hslParaRgb(h,s,l) {
    s /= 100;
    l /= 100;
    h /= 360;

    if (s === 0) {
        const valor =
            Math.round(
                l * 255
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
        l < 0.5
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

iniciar();