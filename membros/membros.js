const SUPABASE_URL = "https://lhhoqahzpuohhhnbwgfp.supabase.co";
const SUPABASE_KEY = "sb_publishable_FTie2ELWKBc4Tz9r5fZuTw_izSaEHao";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const membersGrid = document.getElementById("members-grid");
const membersMessage = document.getElementById("members-message");
const searchInput = document.getElementById("search-members");

let membros = [];

async function carregarMembros() {

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
            avatar_url,
            avatar_tipo,
            cor_principal,
            cor_secundaria,
            cor_destaque
        `)
        .order("nome", { ascending: true });

    if (error) {
        console.error("Erro ao carregar membros:", error);
        membersMessage.textContent =
            "Não foi possível carregar os membros.";
        return;
    }

    membros = data || [];
    renderizarMembros(membros);
}

function obterAvatarHTML(membro) {
    if (
        membro.avatar_tipo &&
        membro.avatar_tipo.startsWith("preset:")
    ) {
        return `
            <div class="member-avatar">
                <div class="member-avatar-placeholder">
                    ${membro.avatar_tipo.replace("preset:", "")}
                </div>
            </div>
        `;
    }

    if (membro.avatar_url) {
        return `
            <div class="member-avatar">
                <img
                    src="${membro.avatar_url}"
                    alt="Foto de ${escaparHTML(membro.nome || "membro")}"
                    style="display:block"
                >
            </div>
        `;
    }

    return `
        <div class="member-avatar">
            <div class="member-avatar-placeholder">
                👤
            </div>
        </div>
    `;
}

function escaparHTML(valor) {
    return String(valor)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function renderizarMembros(lista) {
    membersGrid.innerHTML = "";

    if (!lista.length) {
        membersMessage.textContent =
            "Nenhum membro encontrado.";
        return;
    }

    membersMessage.textContent =
        `${lista.length} membro(s) encontrado(s).`;

    lista.forEach(membro => {
        const article =
            document.createElement("article");

        article.className = "member-card";

        const primary =
            membro.cor_principal || "#8B5CF6";

        const secondary =
            membro.cor_secundaria || "#C084FC";

        const accent =
            membro.cor_destaque || "#60A5FA";

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

        const isAdm = membro.cargo === "adm";
        const isVip = membro.vip === true;

        let badgeHTML = "";

        if (isAdm && isVip) {
            badgeHTML = `
                <div class="member-admin-badge">
                    🛡️ ADM · 💎 VIP
                </div>
            `;
        } else if (isAdm) {
            badgeHTML = `
                <div class="member-admin-badge">
                    🛡️ ADM
                </div>
            `;
        } else if (isVip) {
            badgeHTML = `
                <div class="member-admin-badge">
                    💎 VIP
                </div>
            `;
        }

        article.innerHTML = `
            ${badgeHTML}

            <div class="member-card-top"></div>

            <div class="member-card-content">
                ${obterAvatarHTML(membro)}

                <h2 class="member-name">
                    ${escaparHTML(membro.nome || "Sem nome")}
                </h2>

                <p class="member-username">
                    ${membro.username
                        ? "@" + escaparHTML(
                            membro.username.replace(/^@/, "")
                        )
                        : "@usuario"
                    }
                </p>

                <div class="member-tags">
                    <span>${escaparHTML(membro.mbti || "MBTI")}</span>
                    <span>${escaparHTML(membro.eneagrama || "Eneagrama")}</span>
                    <span>${escaparHTML(membro.tritype || "Tritype")}</span>
                </div>

                <a
                    href="perfil.html?id=${encodeURIComponent(membro.id)}"
                    class="view-profile"
                >
                    VER PERFIL
                </a>
            </div>
        `;

        membersGrid.appendChild(article);
    });
}

searchInput.addEventListener("input", function () {
    const termo =
        this.value.trim().toLowerCase();

    const filtrados =
        membros.filter(membro => {
            const nome =
                (membro.nome || "").toLowerCase();

            const username =
                (membro.username || "").toLowerCase();

            return (
                nome.includes(termo) ||
                username.includes(termo)
            );
        });

    renderizarMembros(filtrados);
});

carregarMembros();