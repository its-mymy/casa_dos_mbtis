let ranking = [];
let rankingGuestSelectedId = null;
let membrosAvulsosRanking = [];
let membrosRanking = [];


/* ========================================
   RANKING: ELEMENTOS HTML
======================================== */

const rankingList =
    document.getElementById("ranking-list");

const rankingManageButton =
    document.getElementById("ranking-manage-button");

const rankingManager =
    document.getElementById("ranking-manager");

const closeRankingManager =
    document.getElementById("close-ranking-manager");

const rankingMemberType =
    document.getElementById("ranking-member-type");

const rankingRegisteredGroup =
    document.getElementById("ranking-registered-group");

const rankingGuestGroup =
    document.getElementById("ranking-guest-group");

const rankingGuestName =
    document.getElementById("ranking-guest-name");

const rankingPointsInput =
    document.getElementById("ranking-points-input");

const rankingAddPoints =
    document.getElementById("ranking-add-points");

const rankingSetPoints =
    document.getElementById("ranking-set-points");

const rankingTotalInput =
    document.getElementById("ranking-total-input");

const rankingMemberSelect =
    document.getElementById("ranking-member-select");

const rankingGuestResults =
    document.getElementById("ranking-guest-results");

const rankingSelectedGuest =
    document.getElementById("ranking-selected-guest");

const rankingRemovePoints =
    document.getElementById("ranking-remove-points");

const rankingRemoveMember =
    document.getElementById("ranking-remove-member");

const rankingMemberSearch =
    document.getElementById("ranking-member-search");

const rankingMemberResults =
    document.getElementById("ranking-member-results");

const rankingSelectedMember =
    document.getElementById("ranking-selected-member");


    async function carregarMembrosAvulsosRanking() {

    if (!rankingGuestResults) return;

    try {

        const { data, error } = await supabaseClient
            .from("ranking_membros")
            .select(`
                id,
                nome_exibicao,
                pontuacao
            `)
            .is("user_id", null)
            .order("nome_exibicao", {
                ascending: true
            });

        if (error) {
            throw error;
        }

        membrosAvulsosRanking = data || [];

    } catch (error) {

        console.error(
            "Erro ao carregar participantes avulsos:",
            error
        );

        membrosAvulsosRanking = [];
    }
}

function renderizarResultadosAvulsosRanking(termo = "") {
    if (!rankingGuestResults) return;

    const busca =
        normalizarTextoBusca(termo);

    if (!busca) {
        rankingGuestResults.innerHTML = "";
        rankingGuestResults.classList.add("hidden");
        return;
    }

    const resultados =
        membrosAvulsosRanking
            .filter(membro => {

                const nome =
                    normalizarTextoBusca(
                        membro.nome_exibicao
                    );

                return nome.includes(busca);
            })
            .slice(0, 15);

    rankingGuestResults.innerHTML = "";

    if (!resultados.length) {

        rankingGuestResults.innerHTML = `
            <div class="ranking-member-no-results">
                Nenhuma pessoa encontrada no ranking.
            </div>
        `;

        rankingGuestResults.classList.remove("hidden");

        return;
    }

    resultados.forEach(membro => {

        const button =
            document.createElement("button");

        button.type = "button";
        button.className =
            "ranking-member-result";

        button.innerHTML = `
            <span class="ranking-member-result-name">
                ${escaparHTML(
                    membro.nome_exibicao || "Pessoa"
                )}
            </span>

            <span class="ranking-member-result-username">
                ${membro.pontuacao} pontos
            </span>
        `;

        button.addEventListener(
            "click",
            () => selecionarMembroAvulsoRanking(membro)
        );

        rankingGuestResults.appendChild(button);
    });

    rankingGuestResults.classList.remove("hidden");
}

function selecionarMembroAvulsoRanking(membro) {

    rankingGuestSelectedId = membro.id;

    if (rankingGuestName) {
        rankingGuestName.value =
            membro.nome_exibicao || "";
    }

    if (rankingSelectedGuest) {

        rankingSelectedGuest.innerHTML = `
            <span class="ranking-selected-icon">
                ✓
            </span>

            <span>
                <strong>
                    ${escaparHTML(
                        membro.nome_exibicao || "Pessoa"
                    )}
                </strong>

                <small>
                    ${membro.pontuacao} pontos
                </small>
            </span>

            <button
                type="button"
                class="ranking-clear-member"
                aria-label="Remover seleção"
            >
                ×
            </button>
        `;

        rankingSelectedGuest.classList.remove(
            "hidden"
        );

        const clearButton =
            rankingSelectedGuest.querySelector(
                ".ranking-clear-member"
            );

        clearButton?.addEventListener(
            "click",
            limparMembroAvulsoRanking
        );
    }

    rankingGuestResults?.classList.add("hidden");
}

function limparMembroAvulsoRanking() {

    rankingGuestSelectedId = null;

    if (rankingGuestName) {
        rankingGuestName.value = "";
    }

    if (rankingSelectedGuest) {
        rankingSelectedGuest.innerHTML = "";

        rankingSelectedGuest.classList.add(
            "hidden"
        );
    }

    rankingGuestResults?.classList.add(
        "hidden"
    );

    rankingGuestName?.focus();
}

async function removerMembroRanking() {

    if (
        !usuarioAtual ||
        perfilAtual?.ranking_admin !== true
    ) {
        mostrarToast(
            "Você não tem permissão para alterar o ranking."
        );

        return;
    }

    const tipo =
        rankingMemberType?.value || "cadastrado";

    let userId = null;
    let nomeExibicao = null;

    if (tipo === "cadastrado") {

        userId =
            rankingMemberSelect?.value || null;

        if (!userId) {
            mostrarToast(
                "Selecione um membro."
            );

            return;
        }

    } else {

        nomeExibicao =
            rankingGuestName?.value.trim() || "";

        if (!nomeExibicao) {
            mostrarToast(
                "Digite o nome da pessoa."
            );

            return;
        }
    }

    const nome =
        tipo === "cadastrado"
            ? (
                membrosRanking.find(
                    membro => membro.id === userId
                )?.nome || "este membro"
            )
            : nomeExibicao;

    const confirmar = confirm(
        `Tem certeza que deseja remover ${nome} do ranking?`
    );

    if (!confirmar) {
        return;
    }

    rankingRemoveMember.disabled = true;
    rankingRemoveMember.textContent = "REMOVENDO...";

    try {

        let query = supabaseClient
            .from("ranking_membros")
            .delete();

        if (tipo === "cadastrado") {

            query = query.eq(
                "user_id",
                userId
            );

        } else {

            query = query
                .is("user_id", null)
                .eq(
                    "nome_exibicao",
                    nomeExibicao
                );
        }

        const { error } = await query;

        if (error) {
            throw error;
        }

        limparMembroRanking();

        if (rankingGuestName) {
            rankingGuestName.value = "";
        }

        await carregarRanking();

        mostrarToast(
            `${nome} foi removido do ranking!`
        );

    } catch (error) {

        console.error(
            "Erro ao remover membro do ranking:",
            error
        );

        mostrarToast(
            error?.message ||
            "Não foi possível remover o membro do ranking."
        );

    } finally {

        rankingRemoveMember.disabled = false;

        rankingRemoveMember.textContent =
            "🗑️ REMOVER DO RANKING";
    }
}

async function carregarRanking() {

    if (!rankingList) {
        return;
    }

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("ranking_membros")
            .select(`
                id,
                user_id,
                nome_exibicao,
                pontuacao,
                profiles:user_id (
                    id,
                    nome,
                    username,
                    avatar_url,
                    avatar_tipo
                )
            `)
            .order("pontuacao", {
                ascending: false
            });

        if (error) {
            throw error;
        }

        ranking = data || [];
        renderizarRanking();

        if (perfilAtual?.ranking_admin === true) {
    await carregarMembrosRanking();
}

    } catch (error) {

        console.error(
            "Erro ao carregar ranking:",
            error
        );

        ranking = [];
    }
}


function renderizarRanking() {

    if (!rankingList) {
        return;
    }

    if (!ranking.length) {
        rankingList.innerHTML = `
            <div class="ranking-empty">
                🌟 O ranking ainda está vazio.
            </div>
        `;
        return;
    }

    rankingList.innerHTML = "";

    ranking.forEach((item, index) => {

        const posicao = index + 1;
        const perfil = item.profiles || {};

       const nome =
    item.nome_exibicao ||
    perfil.nome ||
    perfil.username ||
    "Membro";

        const username =
            normalizarUsername(
                perfil.username
            );

        const avatar =
            perfil.avatar_url ||
            "";

        const avatarHtml =
            avatar
                ? `
                    <img
                        src="${escaparAtributo(avatar)}"
                        alt="Perfil"
                    >
                `
                : perfil.avatar_tipo?.startsWith("preset:")
                    ? escaparHTML(
                        perfil.avatar_tipo.replace(
                            "preset:",
                            ""
                        )
                    )
                    : "👤";

        const itemElement =
            document.createElement("div");

        itemElement.className =
            `ranking-item ranking-position-${posicao}`;

        if (posicao <= 3) {
            itemElement.classList.add("top-three");
        }

        let medalha = `${posicao}º`;

        if (posicao === 1) {
            medalha = "🥇";
        } else if (posicao === 2) {
            medalha = "🥈";
        } else if (posicao === 3) {
            medalha = "🥉";
        }

        itemElement.innerHTML = `
            <div class="ranking-position">
                ${medalha}
            </div>

            <div class="ranking-avatar">
                ${avatarHtml}
            </div>

            <div class="ranking-member-info">
                <strong>
                    ${escaparHTML(nome)}
                </strong>

                <span>
                    ${
                        username
                            ? `@${escaparHTML(username)}`
                            : "Membro da Casa"
                    }
                </span>
            </div>

            <div class="ranking-score">
                <strong>
                    ${Number(item.pontuacao || 0).toLocaleString("pt-BR")}
                </strong>

                <span>PTS</span>
            </div>
        `;

        rankingList.appendChild(itemElement);
    });
}

function abrirGerenciadorRanking() {

    if (
        !usuarioAtual ||
        perfilAtual?.ranking_admin !== true
    ) {
        mostrarToast(
            "Você não tem permissão para gerenciar o ranking."
        );

        return;
    }

    rankingManager?.classList.remove(
        "hidden"
    );
}

function fecharGerenciadorRanking() {

    rankingManager?.classList.add(
        "hidden"
    );
}

function alternarTipoParticipanteRanking() {

    const tipo =
        rankingMemberType?.value || "cadastrado";

    const ehAvulso =
        tipo === "avulso";

    rankingRegisteredGroup?.classList.toggle(
        "hidden",
        ehAvulso
    );

    rankingGuestGroup?.classList.toggle(
        "hidden",
        !ehAvulso
    );

    if (ehAvulso) {
        rankingMemberSelect.value = "";
        rankingGuestName?.focus();
    } else if (rankingGuestName) {
        rankingGuestName.value = "";
    }
}

async function adicionarPontosRanking() {

    if (
        !usuarioAtual ||
        perfilAtual?.ranking_admin !== true
    ) {
        mostrarToast(
            "Você não tem permissão para alterar o ranking."
        );

        return;
    }

    const tipo =
        rankingMemberType?.value || "cadastrado";

    const pontos =
        Number(rankingPointsInput?.value);

    if (!Number.isInteger(pontos) || pontos <= 0) {
        mostrarToast(
            "Digite uma quantidade de pontos válida."
        );

        return;
    }

    let userId = null;
    let nomeExibicao = null;

    if (tipo === "cadastrado") {

        userId =
            rankingMemberSelect?.value || null;

        if (!userId) {
            mostrarToast(
                "Selecione um membro."
            );

            return;
        }

    } else {

        nomeExibicao =
            rankingGuestName?.value.trim() || "";

        if (!nomeExibicao) {
            mostrarToast(
                "Digite o nome da pessoa."
            );

            return;
        }
    }

    rankingAddPoints.disabled = true;
    rankingAddPoints.textContent = "ADICIONANDO...";

    try {

        const {
            error
        } = await supabaseClient.rpc(
            "adicionar_pontos_ranking",
            {
                p_user_id: userId,
                p_pontos: pontos,
                p_nome_exibicao: nomeExibicao
            }
        );

        if (error) {
            throw error;
        }

        rankingPointsInput.value = "";

        if (rankingGuestName) {
            rankingGuestName.value = "";
        }

        if (rankingMemberSelect) {
            rankingMemberSelect.value = "";
        }

        await carregarRanking();

        mostrarToast(
            `🏆 +${pontos} pontos adicionados!`
        );

    } catch (error) {

        console.error(
            "Erro ao adicionar pontos:",
            error
        );

        mostrarToast(
            error?.message ||
            "Não foi possível adicionar os pontos."
        );

    } finally {

        rankingAddPoints.disabled = false;
        rankingAddPoints.textContent = "＋ ADICIONAR";
    }
}
async function removerPontosRanking() {

    if (
        !usuarioAtual ||
        perfilAtual?.ranking_admin !== true
    ) {
        mostrarToast(
            "Você não tem permissão para alterar o ranking."
        );

        return;
    }

    const tipo =
        rankingMemberType?.value || "cadastrado";

    if (tipo !== "cadastrado") {
        mostrarToast(
            "A remoção de pontos por enquanto é apenas para membros cadastrados."
        );

        return;
    }

    const userId =
        rankingMemberSelect?.value || null;

    const pontos =
        Number(rankingPointsInput?.value);

    if (!userId) {
        mostrarToast(
            "Selecione um membro."
        );

        return;
    }

    if (
        !Number.isInteger(pontos) ||
        pontos <= 0
    ) {
        mostrarToast(
            "Digite uma quantidade de pontos válida."
        );

        return;
    }

    rankingRemovePoints.disabled = true;
    rankingRemovePoints.textContent =
        "REMOVENDO...";

    try {

        const {
            error
        } = await supabaseClient.rpc(
            "adicionar_pontos_ranking",
            {
                p_user_id: userId,
                p_pontos: -pontos,
                p_nome_exibicao: null
            }
        );

        if (error) {
            throw error;
        }

        rankingPointsInput.value = "";

        await carregarRanking();

        mostrarToast(
            `−${pontos} pontos removidos!`
        );

    } catch (error) {

        console.error(
            "Erro ao remover pontos:",
            error
        );

        mostrarToast(
            error?.message ||
            "Não foi possível remover os pontos."
        );

    } finally {

        rankingRemovePoints.disabled = false;
        rankingRemovePoints.textContent =
            "− REMOVER";
    }
}

async function carregarMembrosRanking() {

    if (!rankingMemberSelect) {
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
                username
            `)
            .order("nome", {
                ascending: true
            });

        if (error) {
            throw error;
        }

        membrosRanking = data || [];

        rankingMemberSelect.innerHTML = `
            <option value="">Selecione um membro...</option>
        `;

        membrosRanking.forEach(membro => {

            const option =
                document.createElement("option");

            option.value =
                membro.id;

            const username =
                normalizarUsername(
                    membro.username
                );

            option.textContent =
                username
                    ? `${membro.nome || "Membro"} (@${username})`
                    : membro.nome || "Membro";

            rankingMemberSelect.appendChild(
                option
            );
        });

    } catch (error) {

        console.error(
            "Erro ao carregar membros:",
            error
        );

        mostrarToast(
            "Não foi possível carregar os membros."
        );
    }
}

function normalizarTextoBusca(valor) {

    return String(valor || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function renderizarResultadosMembrosRanking(termo = "") {

    if (
        !rankingMemberResults ||
        !rankingMemberSearch
    ) {
        return;
    }

    const busca =
        normalizarTextoBusca(termo);

    if (!busca) {

        rankingMemberResults.innerHTML = "";

        rankingMemberResults.classList.add(
            "hidden"
        );

        return;
    }

    const resultados =
        membrosRanking.filter(membro => {

            const nome =
                normalizarTextoBusca(
                    membro.nome
                );

            const username =
                normalizarTextoBusca(
                    normalizarUsername(
                        membro.username
                    )
                );

            return (
                nome.includes(busca) ||
                username.includes(busca)
            );
        }).slice(0, 15);

    rankingMemberResults.innerHTML = "";

    if (!resultados.length) {

        rankingMemberResults.innerHTML = `
            <div class="ranking-member-no-results">
                Nenhum membro encontrado.
            </div>
        `;

        rankingMemberResults.classList.remove(
            "hidden"
        );

        return;
    }

    resultados.forEach(membro => {

        const username =
            normalizarUsername(
                membro.username
            );

        const button =
            document.createElement("button");

        button.type = "button";
        button.className =
            "ranking-member-result";

        button.innerHTML = `
            <span class="ranking-member-result-name">
                ${escaparHTML(
                    membro.nome || "Membro"
                )}
            </span>

            ${
                username
                    ? `
                        <span class="ranking-member-result-username">
                            @${escaparHTML(username)}
                        </span>
                    `
                    : ""
            }
        `;

        button.addEventListener(
            "click",
            () => selecionarMembroRanking(membro)
        );

        rankingMemberResults.appendChild(
            button
        );
    });

    rankingMemberResults.classList.remove(
        "hidden"
    );
}


function selecionarMembroRanking(membro) {

    if (!rankingMemberSelect) {
        return;
    }

    rankingMemberSelect.value =
        membro.id;

    const username =
        normalizarUsername(
            membro.username
        );

    if (rankingMemberSearch) {

        rankingMemberSearch.value =
            membro.nome || "";
    }

    if (rankingSelectedMember) {

        rankingSelectedMember.innerHTML = `
            <span class="ranking-selected-icon">
                ✓
            </span>

            <span>
                <strong>
                    ${escaparHTML(
                        membro.nome || "Membro"
                    )}
                </strong>

                ${
                    username
                        ? `
                            <small>
                                @${escaparHTML(username)}
                            </small>
                        `
                        : ""
                }
            </span>

            <button
                type="button"
                class="ranking-clear-member"
                aria-label="Remover membro selecionado"
            >
                ×
            </button>
        `;

        rankingSelectedMember.classList.remove(
            "hidden"
        );

        const clearButton =
            rankingSelectedMember.querySelector(
                ".ranking-clear-member"
            );

        clearButton?.addEventListener(
            "click",
            limparMembroRanking
        );
    }

    rankingMemberResults?.classList.add(
        "hidden"
    );
}
function limparMembroRanking() {

    if (rankingMemberSelect) {
        rankingMemberSelect.value = "";
    }

    if (rankingMemberSearch) {
        rankingMemberSearch.value = "";
    }

    if (rankingSelectedMember) {

        rankingSelectedMember.innerHTML = "";

        rankingSelectedMember.classList.add(
            "hidden"
        );
    }

    rankingMemberResults?.classList.add(
        "hidden"
    );

    rankingMemberSearch?.focus();
}


function configurarBuscaMembrosRanking() {

    if (!rankingMemberSearch) {
        return;
    }

    rankingMemberSearch.addEventListener(
        "input",
        () => {

            rankingMemberSelect.value = "";

            if (rankingSelectedMember) {

                rankingSelectedMember.innerHTML = "";

                rankingSelectedMember.classList.add(
                    "hidden"
                );
            }

            renderizarResultadosMembrosRanking(
                rankingMemberSearch.value
            );
        }
    );

    rankingMemberSearch.addEventListener(
        "focus",
        () => {

            if (
                rankingMemberSearch.value.trim()
            ) {
                renderizarResultadosMembrosRanking(
                    rankingMemberSearch.value
                );
            }
        }
    );
        if (rankingGuestName) {

        rankingGuestName.addEventListener(
            "input",
            () => {

                renderizarResultadosAvulsosRanking(
                    rankingGuestName.value
                );
            }
        );

        rankingGuestName.addEventListener(
            "focus",
            async () => {

                await carregarMembrosAvulsosRanking();

                renderizarResultadosAvulsosRanking(
                    rankingGuestName.value
                );
            }
        );
    }

    document.addEventListener(
        "click",
        event => {

            if (
                !rankingMemberResults ||
                !rankingMemberSearch
            ) {
                return;
            }

            if (
                rankingMemberSearch.contains(
                    event.target
                ) ||
                rankingMemberResults.contains(
                    event.target
                )
            ) {
                return;
            }

            rankingMemberResults.classList.add(
                "hidden"
            );
        }
    );
}
function configurarEventosRanking() {
    configurarBuscaMembrosRanking();

    if (rankingManageButton) {
        rankingManageButton.addEventListener(
            "click",
            abrirGerenciadorRanking
        );
    }

    if (closeRankingManager) {
        closeRankingManager.addEventListener(
            "click",
            fecharGerenciadorRanking
        );
    }

    if (rankingMemberType) {
        rankingMemberType.addEventListener(
            "change",
            alternarTipoParticipanteRanking
        );
    }

    if (rankingAddPoints) {
        rankingAddPoints.addEventListener(
            "click",
            adicionarPontosRanking
        );
    }

    if (rankingRemovePoints) {
        rankingRemovePoints.addEventListener(
            "click",
            removerPontosRanking
        );
    }

    if (rankingRemoveMember) {
        rankingRemoveMember.addEventListener(
            "click",
            removerMembroRanking
        );
    }
}