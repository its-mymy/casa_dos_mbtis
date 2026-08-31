const SUPABASE_URL = "https://lhhoqahzpuohhhnbwgfp.supabase.co";
const SUPABASE_KEY = "sb_publishable_FTie2ELWKBc4Tz9r5fZuTw_izSaEHao";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

let usuarioAtual = null;
let perfilAtual = null;

const vipIdentityCard = document.getElementById("vip-identity-card");

const identityBanner = document.getElementById("identity-banner");
const identityBannerImage = document.getElementById("identity-banner-image");

const identityAvatar = document.getElementById("identity-avatar");
const identityBadge = document.getElementById("identity-badge");

const identityName = document.getElementById("identity-name");
const identityUsername = document.getElementById("identity-username");

const identityMbti = document.getElementById("identity-mbti");
const identityEneagrama = document.getElementById("identity-eneagrama");
const identityTritype = document.getElementById("identity-tritype");

const identityStatus = document.getElementById("identity-status");

const identitySubtipo = document.getElementById("identity-subtipo");
const identityTemperamento = document.getElementById("identity-temperamento");
const identitySocionics = document.getElementById("identity-socionics");
const identityBigFive = document.getElementById("identity-big-five");

const identityMusic = document.getElementById("identity-music");
const identityArtist = document.getElementById("identity-artist");
const identityGame = document.getElementById("identity-game");
const identitySeries = document.getElementById("identity-series");
const identityCharacter = document.getElementById("identity-character");
const identityHobby = document.getElementById("identity-hobby");

const identityPrimary = document.getElementById("identity-primary");
const identitySecondary = document.getElementById("identity-secondary");
const identityAccent = document.getElementById("identity-accent");

const identityPrimaryColor = document.getElementById("identity-primary-color");
const identitySecondaryColor = document.getElementById("identity-secondary-color");
const identityAccentColor = document.getElementById("identity-accent-color");

const identityGroup = document.getElementById("identity-group");
const identitySince = document.getElementById("identity-since");

const downloadVipCard = document.getElementById("download-vip-card");
const vipCardMessage = document.getElementById("vip-card-message");

async function iniciar() {
    const usuario = await carregarUsuario();

    if (!usuario) {
        return;
    }

    await carregarPerfil(usuario);
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
            redirecionarLogin();
            return null;
        }

        return usuarioAtual;

    } catch (error) {
        console.error(
            "Erro ao verificar usuário:",
            error
        );

        redirecionarLogin();

        return null;
    }
}

async function carregarPerfil(usuario) {
    const {
        data: perfil,
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
            temperamento,
            socionics,
            big_five,
            grupo_casa,
            musica_favorita,
            artista_favorito,
            jogo_favorito,
            serie_favorita,
            personagem_favorito,
            hobby,
            status_perfil,
            avatar_url,
            avatar_tipo,
            banner_url,
            cor_principal,
            cor_secundaria,
            cor_destaque,
            created_at
        `)
        .eq(
            "id",
            usuario.id
        )
        .single();

    if (error) {
        console.error(
            "Erro ao carregar perfil:",
            error
        );

        mostrarMensagem(
            "Não foi possível carregar sua identidade VIP."
        );

        return;
    }

    if (!perfil) {
        mostrarMensagem(
            "Seu perfil não foi encontrado."
        );

        return;
    }

    perfilAtual =
        perfil;

    const isAdm =
        String(
            perfil.cargo || ""
        )
            .toLowerCase()
            .trim() === "adm";

    const isVip =
        perfil.vip === true;

    if (
        !isVip &&
        !isAdm
    ) {
        bloquearAcesso();
        return;
    }

    preencherIdentidade(
        perfil
    );
}

function preencherIdentidade(perfil) {
    const primary =
        perfil.cor_principal ||
        "#8B5CF6";

    const secondary =
        perfil.cor_secundaria ||
        "#C084FC";

    const accent =
        perfil.cor_destaque ||
        "#60A5FA";

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

    if (identityName) {
        identityName.textContent =
            perfil.nome ||
            "Sem nome";
    }

    if (identityUsername) {
        const username =
            normalizarUsername(
                perfil.username
            );

        identityUsername.textContent =
            username
                ? `@${username}`
                : "@usuario";
    }

    if (identityMbti) {
        identityMbti.textContent =
            perfil.mbti ||
            "MBTI";
    }

    if (identityEneagrama) {
        identityEneagrama.textContent =
            perfil.eneagrama ||
            "Eneagrama";
    }

    if (identityTritype) {
        identityTritype.textContent =
            perfil.tritype ||
            "Tritype";
    }

    if (identitySubtipo) {
        identitySubtipo.textContent =
            perfil.subtipo ||
            "—";
    }

    if (identityTemperamento) {
        identityTemperamento.textContent =
            perfil.temperamento ||
            "—";
    }

    if (identitySocionics) {
        identitySocionics.textContent =
            perfil.socionics ||
            "—";
    }

    if (identityBigFive) {
        identityBigFive.textContent =
            perfil.big_five ||
            "—";
    }

    if (identityMusic) {
        identityMusic.textContent =
            perfil.musica_favorita ||
            "—";
    }

    if (identityArtist) {
        identityArtist.textContent =
            perfil.artista_favorito ||
            "—";
    }

    if (identityGame) {
        identityGame.textContent =
            perfil.jogo_favorito ||
            "—";
    }

    if (identitySeries) {
        identitySeries.textContent =
            perfil.serie_favorita ||
            "—";
    }

    if (identityCharacter) {
        identityCharacter.textContent =
            perfil.personagem_favorito ||
            "—";
    }

    if (identityHobby) {
        identityHobby.textContent =
            perfil.hobby ||
            "—";
    }

    if (identityStatus) {
        identityStatus.textContent =
            perfil.status_perfil ||
            "Nenhum status adicionado.";
    }

    if (identityGroup) {
        identityGroup.textContent =
            perfil.grupo_casa ||
            "CASA DOS MBTIs";
    }

    if (identitySince) {
        identitySince.textContent =
            `MEMBRO DESDE ${formatarData(
                perfil.created_at
            )}`;
    }

    if (identityPrimary) {
        identityPrimary.textContent =
            primary.toUpperCase();
    }

    if (identitySecondary) {
        identitySecondary.textContent =
            secondary.toUpperCase();
    }

    if (identityAccent) {
        identityAccent.textContent =
            accent.toUpperCase();
    }

    if (identityPrimaryColor) {
        identityPrimaryColor.style.background =
            primary;
    }

    if (identitySecondaryColor) {
        identitySecondaryColor.style.background =
            secondary;
    }

    if (identityAccentColor) {
        identityAccentColor.style.background =
            accent;
    }

    mostrarAvatar(
        perfil
    );

    mostrarBanner(
        perfil
    );

    configurarBadge(
        perfil
    );

    aplicarBackground(
        perfil
    );
}

function mostrarAvatar(perfil) {
    if (!identityAvatar) {
        return;
    }

    if (perfil.avatar_url) {
        identityAvatar.innerHTML = `
            <img src="${escaparAtributo(perfil.avatar_url)}" alt="Foto de perfil">
        `;

        return;
    }

    if (
        perfil.avatar_tipo?.startsWith(
            "preset:"
        )
    ) {
        identityAvatar.innerHTML = `
            <span>
                ${escaparHTML(
                    perfil.avatar_tipo.replace(
                        "preset:",
                        ""
                    )
                )}
            </span>
        `;

        return;
    }

    identityAvatar.innerHTML = `
        <span>👤</span>
    `;
}

function mostrarBanner(perfil) {
    if (!identityBanner || !identityBannerImage) {
        return;
    }

    if (perfil.banner_url) {
        identityBannerImage.src =
            perfil.banner_url;

        identityBannerImage.style.display =
            "block";

        return;
    }

    identityBannerImage.style.display =
        "none";
}

function configurarBadge(perfil) {
    if (!identityBadge) {
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
        identityBadge.textContent =
            "🛡️ ADM · 💎 VIP";
    } else if (isAdm) {
        identityBadge.textContent =
            "🛡️ ADM";
    } else {
        identityBadge.textContent =
            "💎 VIP";
    }
}

function aplicarBackground(perfil) {
    if (
        !vipIdentityCard ||
        !perfil.background_perfil
    ) {
        return;
    }

    const background =
        String(
            perfil.background_perfil
        ).trim();

    if (!background) {
        return;
    }

    if (
        background.startsWith(
            "#"
        ) ||
        background.startsWith(
            "rgb"
        ) ||
        background.startsWith(
            "hsl"
        ) ||
        background.startsWith(
            "linear-gradient"
        ) ||
        background.startsWith(
            "radial-gradient"
        )
    ) {
        vipIdentityCard.style.background =
            background;

        return;
    }

    if (
        background.startsWith(
            "http://"
        ) ||
        background.startsWith(
            "https://"
        )
    ) {
        vipIdentityCard.style.backgroundImage =
            `url("${escaparAtributo(background)}")`;

        vipIdentityCard.style.backgroundSize =
            "cover";

        vipIdentityCard.style.backgroundPosition =
            "center";
    }
}

function bloquearAcesso() {
    if (!vipIdentityCard) {
        return;
    }

    vipIdentityCard.innerHTML = `
        <div style="min-height:420px;display:grid;place-items:center;padding:30px;text-align:center;background:#100C17;color:white;">
            <div>
                <div style="font-size:3rem;">💎</div>

                <h2 style="margin-top:10px;font-family:Fredoka,sans-serif;">
                    Identidade VIP
                </h2>

                <p style="margin-top:8px;color:#AAA1B5;">
                    Esta área é exclusiva para membros VIP e administradores.
                </p>

                <a href="../" style="display:inline-flex;margin-top:18px;padding:10px 15px;border-radius:10px;background:linear-gradient(135deg,#8B5CF6,#C084FC);color:white;font-weight:700;">
                    ← VOLTAR
                </a>
            </div>
        </div>
    `;

    if (downloadVipCard) {
        downloadVipCard.style.display =
            "none";
    }

    mostrarMensagem(
        "Seu perfil ainda não possui acesso à Identidade VIP."
    );
}

async function baixarIdentidadeVip() {
    if (
        !vipIdentityCard ||
        typeof html2canvas === "undefined"
    ) {
        mostrarMensagem(
            "Não foi possível gerar sua identidade."
        );

        return;
    }

    try {
        if (downloadVipCard) {
            downloadVipCard.disabled =
                true;

            downloadVipCard.textContent =
                "GERANDO...";
        }

        mostrarMensagem(
            "Preparando sua identidade VIP..."
        );

      const canvas =
    await html2canvas(
        vipIdentityCard,
        {
            scale: 2,
            useCORS: true,
            allowTaint: false,
            backgroundColor: "#14101D",
            logging: false,
            foreignObjectRendering: false
        }
    );

        const link =
            document.createElement(
                "a"
            );

        const nome =
            normalizarNomeArquivo(
                perfilAtual?.username ||
                perfilAtual?.nome ||
                "vip"
            );

        link.download =
            `identidade-vip-${nome}.png`;

        link.href =
            canvas.toDataURL(
                "image/png"
            );

        link.click();

        mostrarMensagem(
            "✅ Identidade VIP baixada!"
        );

    } catch (error) {
        console.error(
            "Erro ao gerar identidade VIP:",
            error
        );

        mostrarMensagem(
            "Não foi possível baixar sua identidade VIP."
        );

    } finally {
        if (downloadVipCard) {
            downloadVipCard.disabled =
                false;

            downloadVipCard.textContent =
                "↓ BAIXAR IDENTIDADE VIP";
        }
    }
}

function formatarData(data) {
    if (!data) {
        return "—";
    }

    const dataFormatada =
        new Date(data);

    if (
        Number.isNaN(
            dataFormatada.getTime()
        )
    ) {
        return "—";
    }

    return dataFormatada.toLocaleDateString(
        "pt-BR",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
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

function normalizarNomeArquivo(valor) {
    return String(
        valor ||
        "vip"
    )
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .replace(
            /[^a-zA-Z0-9_-]+/g,
            "-"
        )
        .replace(
            /^-+|-+$/g,
            ""
        )
        .toLowerCase() ||
        "vip";
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

function mostrarMensagem(mensagem) {
    if (vipCardMessage) {
        vipCardMessage.textContent =
            mensagem;
    }
}

function redirecionarLogin() {
    sessionStorage.setItem(
        "retornoFeed",
        window.location.href
    );

    window.location.href =
        "../../../../login/index.html";
}

if (downloadVipCard) {
    downloadVipCard.addEventListener(
        "click",
        baixarIdentidadeVip
    );
}

iniciar();