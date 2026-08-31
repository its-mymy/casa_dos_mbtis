const SUPABASE_URL = "https://lhhoqahzpuohhhnbwgfp.supabase.co";
const SUPABASE_KEY = "sb_publishable_FTie2ELWKBc4Tz9r5fZuTw_izSaEHao";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

let usuarioAtual = null;
let perfilAtual = null;

const memberCard = document.getElementById("member-card");
const memberAvatar = document.getElementById("member-avatar");
const memberName = document.getElementById("member-name");
const memberUsername = document.getElementById("member-username");
const memberMbti = document.getElementById("member-mbti");
const memberEneagrama = document.getElementById("member-eneagrama");
const memberTritype = document.getElementById("member-tritype");
const memberGroup = document.getElementById("member-group");
const memberSince = document.getElementById("member-since");

const downloadCard = document.getElementById("download-card");
const cardMessage = document.getElementById("card-message");

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
            mbti,
            eneagrama,
            tritype,
            grupo_casa,
            avatar_url,
            avatar_tipo,
            created_at
        `)
        .eq(
            "id",
            usuario.id
        )
        .single();

    if (error || !perfil) {
        console.error(
            "Erro ao carregar perfil:",
            error
        );

        mostrarMensagem(
            "Não foi possível carregar sua carteirinha."
        );

        return;
    }

    perfilAtual =
        perfil;

    preencherCarteirinha(
        perfil
    );
}

function preencherCarteirinha(perfil) {
    memberName.textContent =
        perfil.nome ||
        "Sem nome";

    const username =
        normalizarUsername(
            perfil.username
        );

    memberUsername.textContent =
        username
            ? `@${username}`
            : "@usuario";

    memberMbti.textContent =
        perfil.mbti ||
        "—";

    memberEneagrama.textContent =
        perfil.eneagrama ||
        "—";

    memberTritype.textContent =
        perfil.tritype ||
        "—";

    memberGroup.textContent =
        perfil.grupo_casa ||
        "CASA DOS MBTIs";

    memberSince.textContent =
        `MEMBRO DESDE ${formatarData(
            perfil.created_at
        )}`;

    mostrarAvatar(
        perfil
    );
}

function mostrarAvatar(perfil) {
    if (!memberAvatar) {
        return;
    }

    if (perfil.avatar_url) {
        memberAvatar.innerHTML = `
            <img src="${escaparAtributo(perfil.avatar_url)}" alt="Foto de perfil">
        `;

        return;
    }

    if (
        perfil.avatar_tipo?.startsWith(
            "preset:"
        )
    ) {
        memberAvatar.innerHTML = `
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

    memberAvatar.innerHTML = `
        <span>👤</span>
    `;
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

async function baixarCarteirinha() {
    if (
        !memberCard ||
        typeof html2canvas === "undefined"
    ) {
        mostrarMensagem(
            "Não foi possível gerar a carteirinha."
        );

        return;
    }

    try {
        if (downloadCard) {
            downloadCard.disabled =
                true;

            downloadCard.textContent =
                "GERANDO...";
        }

        mostrarMensagem(
            "Preparando sua carteirinha..."
        );

        const canvas =
            await html2canvas(
                memberCard,
                {
                    scale:
                        Math.min(
                            window.devicePixelRatio || 1,
                            2
                        ),
                    useCORS: true,
                    allowTaint: false,
                    backgroundColor: null,
                    logging: false
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
                "membro"
            );

        link.download =
            `carteirinha-${nome}.png`;

        link.href =
            canvas.toDataURL(
                "image/png"
            );

        link.click();

        mostrarMensagem(
            "✅ Carteirinha baixada!"
        );

    } catch (error) {
        console.error(
            "Erro ao gerar carteirinha:",
            error
        );

        mostrarMensagem(
            "Não foi possível baixar a carteirinha."
        );

    } finally {
        if (downloadCard) {
            downloadCard.disabled =
                false;

            downloadCard.textContent =
                "↓ BAIXAR CARTEIRINHA";
        }
    }
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
        "membro"
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
        "membro";
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

function mostrarMensagem(mensagem) {
    if (!cardMessage) {
        return;
    }

    cardMessage.textContent =
        mensagem;
}

function redirecionarLogin() {
    sessionStorage.setItem(
        "retornoFeed",
        window.location.href
    );

    window.location.href =
        "../../../login/index.html";
}

if (downloadCard) {
    downloadCard.addEventListener(
        "click",
        baixarCarteirinha
    );
}

iniciar();