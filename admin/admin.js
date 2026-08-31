const SUPABASE_URL = "https://lhhoqahzpuohhhnbwgfp.supabase.co";
const SUPABASE_KEY = "sb_publishable_FTie2ELWKBc4Tz9r5fZuTw_izSaEHao";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const memberSearch =
    document.getElementById("member-search");

const searchButton =
    document.getElementById("search-button");

const memberList =
    document.getElementById("member-list");

const adminMessage =
    document.getElementById("admin-message");

const toast =
    document.getElementById("toast");

let usuarioAdmin = null;

async function iniciar() {
    const autorizado =
        await verificarAdministrador();

    if (!autorizado) {
        return;
    }

    configurarEventos();
    buscarMembros();
}

async function verificarAdministrador() {
    try {
        const {
            data: authData,
            error: authError
        } = await supabaseClient.auth.getUser();

        if (authError) {
            throw authError;
        }

        const usuario =
            authData?.user || null;

        if (!usuario) {
            window.location.href =
                "../login/index.html";

            return false;
        }

        const {
            data: perfil,
            error
        } = await supabaseClient
            .from("profiles")
            .select("id, username, cargo")
            .eq(
                "id",
                usuario.id
            )
            .single();

        if (error) {
            throw error;
        }

        const ehYu =
            String(
                perfil?.username || ""
            )
                .replace(/^@/, "")
                .toLowerCase()
                .trim() === "yu";

        const ehAdm =
            String(
                perfil?.cargo || ""
            )
                .toLowerCase()
                .trim() === "adm";

        if (!ehYu || !ehAdm) {
            document.body.innerHTML = `
                <main style="min-height:100vh;display:grid;place-items:center;padding:25px;background:#08070D;color:white;text-align:center;font-family:Arial,sans-serif;">
                    <div>
                        <div style="font-size:3rem;">🔒</div>
                        <h1 style="margin-top:10px;">Acesso negado</h1>
                        <p style="margin-top:8px;color:#968C9F;">Esta área é exclusiva da administração.</p>
                    </div>
                </main>
            `;

            return false;
        }

        usuarioAdmin =
            usuario;

        return true;

    } catch (error) {
        console.error(
            "Erro ao verificar administrador:",
            error
        );

        document.body.innerHTML = `
            <main style="min-height:100vh;display:grid;place-items:center;padding:25px;background:#08070D;color:white;text-align:center;font-family:Arial,sans-serif;">
                <div>
                    <h1>Não foi possível verificar seu acesso.</h1>
                    <p style="margin-top:8px;color:#968C9F;">${escaparHTML(error?.message || "Erro desconhecido.")}</p>
                </div>
            </main>
        `;

        return false;
    }
}

function configurarEventos() {
    searchButton?.addEventListener(
        "click",
        buscarMembros
    );

    memberSearch?.addEventListener(
        "keydown",
        event => {
            if (event.key === "Enter") {
                buscarMembros();
            }
        }
    );
}

async function buscarMembros() {
    const termo =
        String(
            memberSearch?.value || ""
        )
            .trim()
            .replace(/^@/, "");

    adminMessage.textContent =
        "Carregando membros...";

    let query =
        supabaseClient
            .from("profiles")
            .select(
                "id, nome, username, vip, vip_expira_em, cargo"
            )
            .order(
                "nome",
                {
                    ascending: true
                }
            );

    if (termo) {
        const filtro =
            `%${termo}%`;

        query =
            query.or(
                `nome.ilike.${filtro},username.ilike.${filtro}`
            );
    }

    const {
        data,
        error
    } = await query;

    if (error) {
        console.error(
            "Erro ao buscar membros:",
            error
        );

        adminMessage.textContent =
            "Não foi possível carregar os membros.";

        memberList.innerHTML =
            "";

        return;
    }

    adminMessage.textContent =
        data?.length
            ? `${data.length} membro(s) encontrado(s).`
            : "Nenhum membro encontrado.";

    renderizarMembros(
        data || []
    );
}

function renderizarMembros(membros) {
    memberList.innerHTML =
        "";

    membros.forEach(
        membro => {
            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "member-card";

            const ehAdm =
                String(
                    membro.cargo || ""
                )
                    .toLowerCase()
                    .trim() === "adm";

            const ehVip =
                membro.vip === true;

            let statusClass =
                "";

            if (ehAdm) {
                statusClass =
                    "adm";
            } else if (ehVip) {
                statusClass =
                    "vip";
            }

            const statusTexto =
                ehAdm
                    ? "🛡️ ADM · ♾️"
                    : ehVip
                        ? "💎 VIP"
                        : "Sem VIP";

            const expiracao =
                membro.vip_expira_em
                    ? formatarData(
                        membro.vip_expira_em
                    )
                    : ehAdm
                        ? "Permanente"
                        : "Sem data";

            card.innerHTML = `
                <div class="member-top">
                    <div class="member-info">
                        <h2 class="member-name">${escaparHTML(membro.nome || "Sem nome")}</h2>
                        <p class="member-username">@${escaparHTML(normalizarUsername(membro.username))}</p>
                    </div>

                    <span class="member-status ${statusClass}">
                        ${statusTexto}
                    </span>
                </div>

                <p class="member-expiration">
                    VIP até:
                    <strong>${expiracao}</strong>
                </p>

                <div class="member-actions">
                    <button class="vip-action" data-id="${membro.id}" data-action="30_dias" type="button">💎 +30 DIAS</button>
                    <button class="vip-action" data-id="${membro.id}" data-action="3_meses" type="button">💎 +3 MESES</button>
                    <button class="vip-action" data-id="${membro.id}" data-action="6_meses" type="button">💎 +6 MESES</button>
                    <button class="vip-action" data-id="${membro.id}" data-action="12_meses" type="button">💎 +12 MESES</button>
                    <button class="vip-action permanent" data-id="${membro.id}" data-action="permanente" type="button">♾️ PERMANENTE</button>
                    <button class="vip-action remove" data-id="${membro.id}" data-action="remover" type="button">❌ REMOVER</button>
                </div>
            `;

            card.querySelectorAll(
                ".vip-action"
            ).forEach(
                button => {
                    button.addEventListener(
                        "click",
                        () => {
                            alterarVip(
                                button.dataset.id,
                                button.dataset.action
                            );
                        }
                    );
                }
            );

            memberList.appendChild(
                card
            );
        }
    );
}

async function alterarVip(
    usuarioId,
    acao
) {
    const mensagens = {
        "30_dias":
            "30 dias adicionados! 💎",

        "3_meses":
            "3 meses adicionados! 💎",

        "6_meses":
            "6 meses adicionados! 💎",

        "12_meses":
            "12 meses adicionados! 💎",

        "permanente":
            "VIP permanente ativado! ♾️",

        "remover":
            "VIP removido. ❌"
    };

    if (acao === "remover") {
        const confirmar =
            window.confirm(
                "Tem certeza que deseja remover o VIP deste membro?"
            );

        if (!confirmar) {
            return;
        }
    }

    const {
        data,
        error
    } =
        await supabaseClient.rpc(
            "gerenciar_vip_manual",
            {
                p_usuario_id:
                    usuarioId,

                p_acao:
                    acao
            }
        );

    if (error) {
        console.error(
            "Erro ao alterar VIP:",
            error
        );

        mostrarToast(
            "Não foi possível alterar o VIP."
        );

        return;
    }

    if (!data?.ok) {
        mostrarToast(
            data?.error ||
            "Não foi possível alterar o VIP."
        );

        return;
    }

    mostrarToast(
        mensagens[acao] ||
        "VIP atualizado."
    );

    buscarMembros();
}

function formatarData(
    valor
) {
    const data =
        new Date(
            valor
        );

    if (
        Number.isNaN(
            data.getTime()
        )
    ) {
        return "Data inválida";
    }

    return new Intl.DateTimeFormat(
        "pt-BR",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    ).format(
        data
    );
}

function normalizarUsername(
    username
) {
    return String(
        username || ""
    )
        .trim()
        .replace(
            /^@/,
            ""
        );
}

function escaparHTML(
    valor
) {
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

function mostrarToast(
    mensagem
) {
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

iniciar();