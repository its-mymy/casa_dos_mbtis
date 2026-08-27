const SUPABASE_URL = "https://lhhoqahzpuohhhnbwgfp.supabase.co";
const SUPABASE_KEY = "sb_publishable_FTie2ELWKBc4Tz9r5fZuTw_izSaEHao";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

let usuarioAtual = null;
let perfilAtual = null;
let avatarSelecionado = null;
let avatarSelecionadoPreset = null;
let bannerSelecionado = null;

const profileAvatar = document.getElementById("profile-avatar");
const avatarPlaceholder = document.getElementById("avatar-placeholder");

const profileBanner = document.getElementById("profile-banner");
const banner = document.getElementById("banner");
const bannerEditButton = document.getElementById("banner-edit");
const bannerInput = document.getElementById("banner-input");

const profileName = document.getElementById("profile-name");
const profileUsername = document.getElementById("profile-username");
const profileBadge = document.getElementById("profile-badge");

const profileMbti = document.getElementById("profile-mbti");
const profileEneagrama = document.getElementById("profile-eneagrama");
const profileTritype = document.getElementById("profile-tritype");

const profileBio = document.getElementById("profile-bio");

const infoMbti = document.getElementById("info-mbti");
const infoEneagrama = document.getElementById("info-eneagrama");
const infoTritype = document.getElementById("info-tritype");
const infoSubtipo = document.getElementById("info-subtipo");
const infoTemperamento = document.getElementById("info-temperamento");
const infoSocionics = document.getElementById("info-socionics");
const infoBigFive = document.getElementById("info-big-five");
const infoGrupo = document.getElementById("info-grupo");
const infoPronomes = document.getElementById("info-pronomes");

const profileMusic = document.getElementById("profile-music");
const profileArtist = document.getElementById("profile-artist");
const profileGame = document.getElementById("profile-game");
const profileSeries = document.getElementById("profile-series");
const profileCharacter = document.getElementById("profile-character");

const showPrimary = document.getElementById("show-primary");
const showSecondary = document.getElementById("show-secondary");
const showAccent = document.getElementById("show-accent");

const editModal = document.getElementById("edit-modal");
const editProfileButton = document.getElementById("edit-profile");
const closeModalButton = document.getElementById("close-modal");
const editForm = document.getElementById("edit-form");
const logoutButton = document.getElementById("logout-button");

const editAvatarInput = document.getElementById("edit-avatar-input");
const chooseAvatarButton = document.getElementById("choose-avatar");
const editAvatarPreview = document.getElementById("edit-avatar-preview");
const editAvatarPlaceholder = document.getElementById("edit-avatar-placeholder");

const avatarOptions = document.querySelectorAll(".avatar-option");

const editMessage = document.getElementById("edit-message");

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

let colorWheelContext = null;
let corSelecionada = "primary";
let arrastandoRoda = false;

if (colorWheelCanvas) {
    colorWheelContext = colorWheelCanvas.getContext("2d");
}

function rgbParaHex(r, g, b) {
    return "#" + [r, g, b]
        .map(valor =>
            Math.max(0, Math.min(255, Math.round(valor)))
                .toString(16)
                .padStart(2, "0")
        )
        .join("")
        .toUpperCase();
}

function hslParaRgb(h, s, l) {
    s /= 100;
    l /= 100;
    h /= 360;

    if (s === 0) {
        const valor = Math.round(l * 255);

        return {
            r: valor,
            g: valor,
            b: valor
        };
    }

    const hueToRgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;

        if (t < 1 / 6) {
            return p + (q - p) * 6 * t;
        }

        if (t < 1 / 2) {
            return q;
        }

        if (t < 2 / 3) {
            return p + (q - p) * (2 / 3 - t) * 6;
        }

        return p;
    };

    const q =
        l < 0.5
            ? l * (1 + s)
            : l + s - l * s;

    const p = 2 * l - q;

    return {
        r: Math.round(hueToRgb(p, q, h + 1 / 3) * 255),
        g: Math.round(hueToRgb(p, q, h) * 255),
        b: Math.round(hueToRgb(p, q, h - 1 / 3) * 255)
    };
}

function desenharRodaDeCores() {
    if (!colorWheelCanvas || !colorWheelContext) {
        return;
    }

    const tamanho = colorWheelCanvas.width;
    const centro = tamanho / 2;
    const raio = tamanho / 2;

    const imagem = colorWheelContext.createImageData(
        tamanho,
        tamanho
    );

    for (let y = 0; y < tamanho; y++) {
        for (let x = 0; x < tamanho; x++) {
            const dx = x - centro;
            const dy = y - centro;

            const distancia =
                Math.sqrt(dx * dx + dy * dy);

            const indice =
                (y * tamanho + x) * 4;

            if (distancia > raio) {
                imagem.data[indice + 3] = 0;
                continue;
            }

            const hue =
                (
                    Math.atan2(dy, dx) * 180 / Math.PI +
                    360 +
                    90
                ) % 360;

            const saturacao =
                Math.min(
                    100,
                    distancia / raio * 100
                );

            const rgb =
                hslParaRgb(
                    hue,
                    saturacao,
                    50
                );

            imagem.data[indice] = rgb.r;
            imagem.data[indice + 1] = rgb.g;
            imagem.data[indice + 2] = rgb.b;
            imagem.data[indice + 3] = 255;
        }
    }

    colorWheelContext.putImageData(
        imagem,
        0,
        0
    );
}

function aplicarCoresPagina(
    primary,
    secondary,
    accent
) {
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
}

function definirCorSelecionada(
    hex,
    x = null,
    y = null
) {
    if (corSelecionada === "primary") {
        editPrimary.value = hex;
    }

    if (corSelecionada === "secondary") {
        editSecondary.value = hex;
    }

    if (corSelecionada === "accent") {
        editAccent.value = hex;
    }

    aplicarCoresPagina(
        editPrimary.value,
        editSecondary.value,
        editAccent.value
    );

    if (selectedColorPreview) {
        selectedColorPreview.style.background = hex;
    }

    if (selectedColorHex) {
        selectedColorHex.textContent =
            hex.toUpperCase();
    }

    if (
        colorPickerDot &&
        colorWheelCanvas &&
        x !== null &&
        y !== null
    ) {
        colorPickerDot.style.left =
            `${(x / colorWheelCanvas.width) * 100}%`;

        colorPickerDot.style.top =
            `${(y / colorWheelCanvas.height) * 100}%`;

        colorPickerDot.style.background =
            hex;
    }
}

function selecionarCorDaRoda(event) {
    if (!colorWheelCanvas) {
        return;
    }

    const rect =
        colorWheelCanvas.getBoundingClientRect();

    const escalaX =
        colorWheelCanvas.width / rect.width;

    const escalaY =
        colorWheelCanvas.height / rect.height;

    const x =
        (event.clientX - rect.left) * escalaX;

    const y =
        (event.clientY - rect.top) * escalaY;

    const centro =
        colorWheelCanvas.width / 2;

    const dx = x - centro;
    const dy = y - centro;

    const distancia =
        Math.sqrt(dx * dx + dy * dy);

    const raio =
        colorWheelCanvas.width / 2;

    if (distancia > raio) {
        return;
    }

    const hue =
        (
            Math.atan2(dy, dx) * 180 / Math.PI +
            360 +
            90
        ) % 360;

    const saturacao =
        Math.min(
            100,
            distancia / raio * 100
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

    definirCorSelecionada(
        hex,
        x,
        y
    );
}

function mostrarAvatar(url, tipo = "foto") {
    if (tipo && tipo.startsWith("preset:")) {
        profileAvatar.style.display = "none";
        avatarPlaceholder.style.display = "flex";
        avatarPlaceholder.textContent =
            tipo.replace("preset:", "");
        return;
    }

    if (url) {
        profileAvatar.src = url;
        profileAvatar.style.display = "block";
        avatarPlaceholder.style.display = "none";
        avatarPlaceholder.textContent = "👤";
    } else {
        profileAvatar.style.display = "none";
        avatarPlaceholder.style.display = "flex";
        avatarPlaceholder.textContent = "👤";
    }
}

function mostrarAvatarEdicao(
    url,
    tipo = "foto"
) {
    if (tipo && tipo.startsWith("preset:")) {
        editAvatarPreview.style.display = "none";
        editAvatarPlaceholder.style.display = "flex";
        editAvatarPlaceholder.textContent =
            tipo.replace("preset:", "");
        return;
    }

    if (url) {
        editAvatarPreview.src = url;
        editAvatarPreview.style.display = "block";
        editAvatarPlaceholder.style.display = "none";
        editAvatarPlaceholder.textContent = "👤";
    } else {
        editAvatarPreview.style.display = "none";
        editAvatarPlaceholder.style.display = "flex";
        editAvatarPlaceholder.textContent = "👤";
    }
}

function mostrarBanner(url) {
    if (!banner) {
        return;
    }

    if (url && profileBanner) {
        profileBanner.src = url;
        profileBanner.style.display = "block";
        banner.style.background = "#08070d";
    } else {
        if (profileBanner) {
            profileBanner.style.display = "none";
        }

        banner.style.background = `
            linear-gradient(
                135deg,
                color-mix(in srgb, var(--primary) 75%, #09070d),
                color-mix(in srgb, var(--secondary) 45%, #0a0710),
                color-mix(in srgb, var(--accent) 45%, #08070d)
            )
        `;
    }
}

function mostrarPerfil(perfil) {
    profileName.textContent =
        perfil.nome || "Sem nome";

    profileUsername.textContent =
        perfil.username
            ? `@${perfil.username.replace(/^@/, "")}`
            : "@usuario";

    if (profileBadge) {
        const cargo = String(perfil.cargo || "membro").toLowerCase().trim();
        profileBadge.hidden = cargo !== "adm";
    }

    profileMbti.textContent =
        perfil.mbti || "MBTI";

    profileEneagrama.textContent =
        perfil.eneagrama || "Eneagrama";

    profileTritype.textContent =
        perfil.tritype || "Tritype";

    profileBio.textContent =
        perfil.bio ||
        "Nenhuma bio adicionada ainda.";

    infoMbti.textContent =
        perfil.mbti || "—";

    infoEneagrama.textContent =
        perfil.eneagrama || "—";

    infoTritype.textContent =
        perfil.tritype || "—";

    infoSubtipo.textContent =
        perfil.subtipo || "—";

    infoTemperamento.textContent =
        perfil.temperamento || "—";

    infoSocionics.textContent =
        perfil.socionics || "—";

    infoBigFive.textContent =
        perfil.big_five || "—";

    infoGrupo.textContent =
        perfil.grupo_casa || "—";

    infoPronomes.textContent =
        perfil.pronomes || "—";

    profileMusic.textContent =
        perfil.musica_favorita ||
        "Nenhuma música adicionada";

    profileArtist.textContent =
        perfil.artista_favorito || "—";

    profileGame.textContent =
        perfil.jogo_favorito || "—";

    profileSeries.textContent =
        perfil.serie_favorita || "—";

    profileCharacter.textContent =
        perfil.personagem_favorito || "—";

    const primary =
        perfil.cor_principal || "#8B5CF6";

    const secondary =
        perfil.cor_secundaria || "#C084FC";

    const accent =
        perfil.cor_destaque || "#60A5FA";

    aplicarCoresPagina(
        primary,
        secondary,
        accent
    );

    mostrarAvatar(
        perfil.avatar_url,
        perfil.avatar_tipo || "foto"
    );

    mostrarBanner(
        perfil.banner_url
    );
}

function preencherFormulario(perfil) {
    editName.value =
        perfil.nome || "";

    editUsername.value =
        perfil.username || "";

    editPronomes.value =
        perfil.pronomes || "";

    editGrupo.value =
        perfil.grupo_casa || "";

    editBio.value =
        perfil.bio || "";

    editMbti.value =
        perfil.mbti || "";

    editEneagrama.value =
        perfil.eneagrama || "";

    editTritype.value =
        perfil.tritype || "";

    editSubtipo.value =
        perfil.subtipo || "";

    editTemperamento.value =
        perfil.temperamento || "";

    editSocionics.value =
        perfil.socionics || "";

    editBigFive.value =
        perfil.big_five || "";

    editMusic.value =
        perfil.musica_favorita || "";

    editArtist.value =
        perfil.artista_favorito || "";

    editGame.value =
        perfil.jogo_favorito || "";

    editSeries.value =
        perfil.serie_favorita || "";

    editCharacter.value =
        perfil.personagem_favorito || "";

    editPrimary.value =
        perfil.cor_principal || "#8B5CF6";

    editSecondary.value =
        perfil.cor_secundaria || "#C084FC";

    editAccent.value =
        perfil.cor_destaque || "#60A5FA";

    aplicarCoresPagina(
        editPrimary.value,
        editSecondary.value,
        editAccent.value
    );

    if (selectedColorPreview) {
        selectedColorPreview.style.background =
            editPrimary.value;
    }

    if (selectedColorHex) {
        selectedColorHex.textContent =
            editPrimary.value.toUpperCase();
    }

    avatarSelecionado = null;

    avatarSelecionadoPreset = null;

    if (editAvatarInput) {
        editAvatarInput.value = "";
    }

    const tipoAvatar =
        perfil.avatar_tipo || "";

    if (tipoAvatar.startsWith("preset:")) {
        avatarSelecionadoPreset =
            tipoAvatar.replace("preset:", "");
    }

    mostrarAvatarEdicao(
        perfil.avatar_url,
        tipoAvatar
    );

    avatarOptions.forEach(
        option => {
            option.classList.toggle(
                "active",
                option.dataset.avatar ===
                avatarSelecionadoPreset
            );
        }
    );

    bannerSelecionado = null;

    if (bannerInput) {
        bannerInput.value = "";
    }
}

async function carregarPerfil() {
    const {
        data: { user },
        error: userError
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
        window.location.href =
            "../login/index.html";
        return;
    }

    usuarioAtual = user;

    const {
        data: perfil,
        error: perfilError
    } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (perfilError) {
        console.error(
            "Erro ao carregar perfil:",
            perfilError
        );

        document.body.innerHTML = `
            <div style="
                padding:40px;
                color:white;
                text-align:center;
            ">
                Não foi possível carregar seu perfil.
            </div>
        `;

        return;
    }

    perfilAtual = perfil;

    mostrarPerfil(perfil);
}

if (editProfileButton) {
    editProfileButton.addEventListener(
        "click",
        function () {
            preencherFormulario(
                perfilAtual
            );

            editMessage.textContent = "";

            editModal.classList.remove(
                "hidden"
            );
        }
    );
}

if (closeModalButton) {
    closeModalButton.addEventListener(
        "click",
        function () {
            editModal.classList.add(
                "hidden"
            );
        }
    );
}

if (editModal) {
    editModal.addEventListener(
        "click",
        function (event) {
            if (event.target === editModal) {
                editModal.classList.add(
                    "hidden"
                );
            }
        }
    );
}

if (chooseAvatarButton) {
    chooseAvatarButton.addEventListener(
        "click",
        function () {
            editAvatarInput.click();
        }
    );
}

if (editAvatarInput) {
    editAvatarInput.addEventListener(
        "change",
        function () {
            const file = this.files[0];

            if (!file) {
                return;
            }

            if (!file.type.startsWith("image/")) {
                editMessage.textContent =
                    "Escolha uma imagem válida.";
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                editMessage.textContent =
                    "A imagem deve ter no máximo 5 MB.";
                return;
            }

            avatarSelecionado = file;
            avatarSelecionadoPreset = null;

            avatarOptions.forEach(
                option => {
                    option.classList.remove(
                        "active"
                    );
                }
            );

            const previewUrl =
                URL.createObjectURL(file);

            editAvatarPreview.src =
                previewUrl;

            editAvatarPreview.style.display =
                "block";

            editAvatarPlaceholder.style.display =
                "none";
        }
    );
}

avatarOptions.forEach(
    option => {
        option.addEventListener(
            "click",
            function () {
                avatarSelecionado = null;

                avatarSelecionadoPreset =
                    option.dataset.avatar;

                if (editAvatarInput) {
                    editAvatarInput.value = "";
                }

                avatarOptions.forEach(
                    item => {
                        item.classList.remove(
                            "active"
                        );
                    }
                );

                option.classList.add(
                    "active"
                );

                editAvatarPreview.style.display =
                    "none";

                editAvatarPlaceholder.style.display =
                    "flex";

                editAvatarPlaceholder.textContent =
                    avatarSelecionadoPreset;

                editMessage.textContent = "";
            }
        );
    }
);

if (bannerEditButton && bannerInput) {
    bannerEditButton.addEventListener(
        "click",
        function () {
            bannerInput.click();
        }
    );
}

if (bannerInput) {
    bannerInput.addEventListener(
        "change",
        function () {
            const file = this.files[0];

            if (!file) {
                return;
            }

            if (!file.type.startsWith("image/")) {
                editMessage.textContent =
                    "Escolha uma imagem válida.";

                this.value = "";
                return;
            }

            if (file.size > 8 * 1024 * 1024) {
                editMessage.textContent =
                    "O banner deve ter no máximo 8 MB.";

                this.value = "";
                return;
            }

            bannerSelecionado = file;

            const previewUrl =
                URL.createObjectURL(file);

            if (profileBanner) {
                profileBanner.src =
                    previewUrl;

                profileBanner.style.display =
                    "block";
            }

            if (banner) {
                banner.style.background =
                    "#08070d";
            }

            if (editModal) {
                editModal.classList.remove(
                    "hidden"
                );
            }

            editMessage.textContent =
                "Banner selecionado. Clique em SALVAR PERFIL.";
        }
    );
}

colorModeButtons.forEach(
    button => {
        button.addEventListener(
            "click",
            function () {
                colorModeButtons.forEach(
                    item => {
                        item.classList.remove(
                            "active"
                        );
                    }
                );

                button.classList.add(
                    "active"
                );

                corSelecionada =
                    button.dataset.color;

                const valorAtual =
                    corSelecionada === "primary"
                        ? editPrimary.value
                        : corSelecionada === "secondary"
                            ? editSecondary.value
                            : editAccent.value;

                if (selectedColorPreview) {
                    selectedColorPreview.style.background =
                        valorAtual;
                }

                if (selectedColorHex) {
                    selectedColorHex.textContent =
                        valorAtual.toUpperCase();
                }
            }
        );
    }
);

if (colorWheelCanvas) {
    colorWheelCanvas.addEventListener(
        "pointerdown",
        function (event) {
            arrastandoRoda = true;

            colorWheelCanvas.setPointerCapture(
                event.pointerId
            );

            selecionarCorDaRoda(event);
        }
    );

    colorWheelCanvas.addEventListener(
        "pointermove",
        function (event) {
            if (!arrastandoRoda) {
                return;
            }

            selecionarCorDaRoda(event);
        }
    );

    colorWheelCanvas.addEventListener(
        "pointerup",
        function () {
            arrastandoRoda = false;
        }
    );

    colorWheelCanvas.addEventListener(
        "pointercancel",
        function () {
            arrastandoRoda = false;
        }
    );
}

async function enviarAvatar(file) {
    const extension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();

    const nomeArquivo =
        `${crypto.randomUUID()}.${extension}`;

    const caminho =
        `${usuarioAtual.id}/${nomeArquivo}`;

    const {
        error: uploadError
    } = await supabaseClient.storage
        .from("avatar")
        .upload(
            caminho,
            file,
            {
                upsert: true,
                contentType: file.type
            }
        );

    if (uploadError) {
        console.error(
            "Erro no upload da foto:",
            uploadError
        );

        throw uploadError;
    }

    const { data } =
        supabaseClient.storage
            .from("avatar")
            .getPublicUrl(
                caminho
            );

    if (!data?.publicUrl) {
        throw new Error(
            "Não foi possível gerar a URL da foto."
        );
    }

    return data.publicUrl;
}

async function enviarBanner(file) {
    const extension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();

    const nomeArquivo =
        `banner-${crypto.randomUUID()}.${extension}`;

    const caminho =
        `${usuarioAtual.id}/${nomeArquivo}`;

    const {
        error: uploadError
    } = await supabaseClient.storage
        .from("avatar")
        .upload(
            caminho,
            file,
            {
                upsert: true,
                contentType: file.type
            }
        );

    if (uploadError) {
        console.error(
            "Erro no upload do banner:",
            uploadError
        );

        throw uploadError;
    }

    const { data } =
        supabaseClient.storage
            .from("avatar")
            .getPublicUrl(
                caminho
            );

    if (!data?.publicUrl) {
        throw new Error(
            "Não foi possível gerar a URL do banner."
        );
    }

    return data.publicUrl;
}

if (editForm) {
    editForm.addEventListener(
        "submit",
        async function (event) {
            event.preventDefault();

            editMessage.textContent =
                "Salvando...";

            try {
                let avatarUrl =
                    perfilAtual.avatar_url || null;

                let avatarTipo =
                    perfilAtual.avatar_tipo || "avatar";

                if (avatarSelecionado) {
                    avatarUrl =
                        await enviarAvatar(
                            avatarSelecionado
                        );

                    avatarTipo =
                        "foto";
                } else if (avatarSelecionadoPreset) {
                    avatarUrl = null;

                    avatarTipo =
                        `preset:${avatarSelecionadoPreset}`;
                }

                let bannerUrl =
                    perfilAtual.banner_url || null;

                if (bannerSelecionado) {
                    bannerUrl =
                        await enviarBanner(
                            bannerSelecionado
                        );
                }

                const username =
                    editUsername.value
                        .trim()
                        .replace(/^@/, "");

                const {
                    data,
                    error
                } = await supabaseClient
                    .from("profiles")
                    .update({
                        nome:
                            editName.value.trim(),

                        username:
                            username || null,

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

                        banner_url:
                            bannerUrl,

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

                    if (error.code === "23505") {
                        editMessage.textContent =
                            "Esse username já está sendo usado.";
                    } else {
                        editMessage.textContent =
                            "Não foi possível salvar o perfil.";
                    }

                    return;
                }

                perfilAtual = data;

                mostrarPerfil(data);

                editMessage.textContent =
                    "Perfil salvo!";

                avatarSelecionado = null;
                avatarSelecionadoPreset = null;
                bannerSelecionado = null;

                if (editAvatarInput) {
                    editAvatarInput.value = "";
                }

                if (bannerInput) {
                    bannerInput.value = "";
                }

                setTimeout(
                    function () {
                        editModal.classList.add(
                            "hidden"
                        );

                        editMessage.textContent =
                            "";
                    },
                    700
                );

            } catch (error) {
                console.error(
                    "Erro ao salvar perfil:",
                    error
                );

                editMessage.textContent =
                    error?.message ||
                    "Ocorreu um erro ao salvar o perfil.";
            }
        }
    );
}

if (logoutButton) {
    logoutButton.addEventListener(
        "click",
        async function () {
            const {
                error
            } = await supabaseClient.auth.signOut();

            if (error) {
                console.error(
                    "Erro ao sair:",
                    error
                );

                return;
            }

            window.location.href =
                "../login/index.html";
        }
    );
}

desenharRodaDeCores();
carregarPerfil();