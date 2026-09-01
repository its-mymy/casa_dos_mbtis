
const SUPABASE_URL = "https://lhhoqahzpuohhhnbwgfp.supabase.co";
const SUPABASE_KEY = "sb_publishable_FTie2ELWKBc4Tz9r5fZuTw_izSaEHao";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

let usuarioAtual = null;
let perfilAtual = null;

let TIPAGENS_IS_LOGGED_IN = false;
let TIPAGENS_IS_ADMIN = false;
let TIPAGENS_IS_OWNER = false;

/* ESTADO */

const state = {
    categoriaAtual: "todos",
    tipagensFiltradas: [],
    tipagensRenderizadas: 0,
    quantidadePorCarregamento: 6,
    tipagemAtual: null,
    votosDoUsuario: {}
};



/* ELEMENTOS */


const grid = document.getElementById("tipagensGrid");
const resultsCounter = document.getElementById("resultsCounter");
const loadingArea = document.getElementById("loadingArea");
const emptyState = document.getElementById("emptyState");

const newTipagemButton = document.getElementById("newTipagemButton");

const adminTipagemModal = document.getElementById("adminTipagemModal");
const adminTipagemClose = document.getElementById("adminTipagemClose");

const tipagemForm = document.getElementById("tipagemForm");
const tipagemId = document.getElementById("tipagemId");

const tipagemImageFile = document.getElementById("tipagemImageFile");
const adminImagePreview = document.getElementById("adminImagePreview");

const tipagemPersonagem = document.getElementById("tipagemPersonagem");
const tipagemObra = document.getElementById("tipagemObra");
const tipagemCategoria = document.getElementById("tipagemCategoria");
const tipagemMbti = document.getElementById("tipagemMbti");
const tipagemEneagrama = document.getElementById("tipagemEneagrama");
const tipagemTritype = document.getElementById("tipagemTritype");
const tipagemSubtipo = document.getElementById("tipagemSubtipo");
const tipagemTemperamento = document.getElementById("tipagemTemperamento");
const tipagemSocionics = document.getElementById("tipagemSocionics");
const tipagemBigFive = document.getElementById("tipagemBigFive");
const tipagemDescricao = document.getElementById("tipagemDescricao");

const adminModalTitle = document.getElementById("adminModalTitle");
const adminFormMessage = document.getElementById("adminFormMessage");
const adminSaveButton = document.getElementById("adminSaveButton");

const modal = document.getElementById("tipagemModal");
const modalClose = document.getElementById("modalClose");

const modalImage = document.getElementById("modalImage");
const modalCharacterName = document.getElementById("modalCharacterName");
const modalWork = document.getElementById("modalWork");
const modalCategory = document.getElementById("modalCategory");

const modalMbti = document.getElementById("modalMbti");
const modalEnneagram = document.getElementById("modalEnneagram");
const modalTritype = document.getElementById("modalTritype");
const modalSubtype = document.getElementById("modalSubtype");
const modalTemperament = document.getElementById("modalTemperament");
const modalSocionics = document.getElementById("modalSocionics");
const modalBigFive = document.getElementById("modalBigFive");
const modalDescription = document.getElementById("modalDescription");

const deleteConfirmOverlay = document.getElementById("deleteConfirmOverlay");
const deleteConfirmCancel = document.getElementById("deleteConfirmCancel");
const deleteConfirmButton = document.getElementById("deleteConfirmButton");
const deleteConfirmText = document.getElementById("deleteConfirmText");

let tipagemPendenteExclusao = null;


const likeButton = document.getElementById("likeButton");
const dislikeButton = document.getElementById("dislikeButton");
const likeCount = document.getElementById("likeCount");
const dislikeCount = document.getElementById("dislikeCount");
const loginRequired = document.getElementById("loginRequired");

const commentInput = document.getElementById("commentInput");
const commentLinesCounter = document.getElementById("commentLinesCounter");
const sendCommentButton = document.getElementById("sendCommentButton");
const commentFormArea = document.getElementById("commentFormArea");
const vipCommentNotice = document.getElementById("vipCommentNotice");
const commentsList = document.getElementById("commentsList");
const commentsEmpty = document.getElementById("commentsEmpty");
const commentsCount = document.getElementById("commentsCount");

function usuarioPodeComentar() {
    if (!perfilAtual) {
        return false;
    }

    const isAdm =
        String(perfilAtual.cargo || "")
            .toLowerCase()
            .trim() === "adm";

    const isVip =
        perfilAtual.vip === true &&
        (
            !perfilAtual.vip_expira_em ||
            new Date(perfilAtual.vip_expira_em).getTime() > Date.now()
        );

    return isAdm || isVip;
}

function contarLinhasComentario(texto) {
    if (!texto.trim()) {
        return 0;
    }

    return texto.split(/\r?\n/).length;
}

function atualizarContadorComentario() {
    const linhas = contarLinhasComentario(
        commentInput.value
    );

    commentLinesCounter.textContent =
        `${linhas}/5 linhas`;

    commentLinesCounter.classList.toggle(
        "error",
        linhas > 5
    );

    sendCommentButton.disabled =
        linhas === 0 ||
        linhas > 5 ||
        !usuarioPodeComentar();
}

async function enviarComentario() {
    if (!state.tipagemAtual) {
        return;
    }

    if (!TIPAGENS_IS_LOGGED_IN) {
        abrirLoginModal();
        return;
    }

    if (!usuarioPodeComentar()) {
        vipCommentNotice.textContent =
            "Apenas membros VIP e ADMs podem comentar nas tipagens.";

        vipCommentNotice.style.display = "block";
        return;
    }

    const texto = commentInput.value
        .replace(/\r\n/g, "\n")
        .trim();

    const linhas = contarLinhasComentario(texto);

    if (!texto) {
        return;
    }

    if (linhas > 5) {
        commentLinesCounter.textContent =
            "Máximo de 5 linhas.";

        commentLinesCounter.classList.add("error");
        return;
    }

    sendCommentButton.disabled = true;
    sendCommentButton.textContent = "ENVIANDO...";

    const { error } = await supabaseClient
        .from("tipagem_comentarios")
        .insert({
            tipagem_id: state.tipagemAtual.id,
            usuario_id: usuarioAtual.id,
            comentario: texto
        });

    if (error) {
        console.error(
            "Erro ao publicar comentário:",
            error
        );

        alert(
            `Não foi possível publicar o comentário:\n${error.message}`
        );

        atualizarContadorComentario();

        sendCommentButton.textContent =
            "COMENTAR";

        return;
    }

    commentInput.value = "";

    commentLinesCounter.textContent =
        "0/5 linhas";

    commentLinesCounter.classList.remove("error");

    sendCommentButton.textContent =
        "COMENTAR";

    await carregarComentarios(
        state.tipagemAtual.id
    );
}

commentInput.addEventListener(
    "input",
    atualizarContadorComentario
);

const adminSection = document.getElementById("adminSection");
const editButton = document.getElementById("editButton");
const deleteButton = document.getElementById("deleteButton");

const loginModal = document.getElementById("loginModal");
const loginModalClose = document.getElementById("loginModalClose");

const menuButton = document.getElementById("menu-button");
const closeMenuButton = document.getElementById("close-menu-button");
const memberMenu = document.getElementById("member-menu");
const memberMenuOverlay = document.getElementById("member-menu-overlay");

const logoutMenuButton = document.getElementById("logout-menu-button");


/* CARREGAR TIPAGENS DO SUPABASE */
async function carregarTipagens() {
    try {
        loadingArea.classList.add("visible");
        emptyState.classList.remove("visible");

        const { data, error } = await supabaseClient
            .from("tipagens")
            .select("*")
            .order("created_at", {
                ascending: false
            });

        if (error) {
            throw error;
        }

        state.tipagensFiltradas = data || [];

        renderizarTipagens();

    } catch (error) {
        console.error(
            "Erro ao carregar tipagens:",
            error
        );

        state.tipagensFiltradas = [];

        grid.innerHTML = "";

        emptyState.classList.add("visible");

        resultsCounter.textContent = "0 tipagens";

    } finally {
        loadingArea.classList.remove("visible");
    }
}


/* FILTRAR CATEGORIA */

function atualizarTipagens() {
    const categoria = state.categoriaAtual;

    if (categoria === "todos") {
        state.tipagensFiltradas = state.tipagensFiltradas;
    }

    renderizarTipagens();
}


/* RENDERIZAR */

function renderizarTipagens() {
    grid.innerHTML = "";

    const categoria = state.categoriaAtual;

    const tipagens = categoria === "todos"
        ? state.tipagensFiltradas
        : state.tipagensFiltradas.filter(
            tipagem => tipagem.categoria === categoria
        );

    resultsCounter.textContent =
        `${tipagens.length} ${tipagens.length === 1 ? "tipagem" : "tipagens"}`;

    if (!tipagens.length) {
        emptyState.classList.add("visible");
        loadingArea.classList.remove("visible");
        state.tipagensRenderizadas = 0;
        return;
    }

    emptyState.classList.remove("visible");

    state.tipagensRenderizadas = 0;

    carregarMaisTipagens(tipagens);
}


/* CARD */

function criarCardTipagem(tipagem) {
    const card = document.createElement("article");

    card.className = "tipagem-card";

    card.innerHTML = `
        <button class="tipagem-card-button" type="button">
            <div class="tipagem-image">
                <img src="${escaparHtml(tipagem.imagem || "")}" alt="${escaparHtml(tipagem.personagem || "Personagem")}" loading="lazy">
            </div>

            <div class="tipagem-card-info">
                <h3>${escaparHtml(tipagem.personagem || "Personagem")}</h3>

                <p>
                    ${escaparHtml(tipagem.mbti || "—")}
                    =
                    ${escaparHtml(tipagem.eneagrama || "—")}
                </p>
            </div>
        </button>
    `;

    const button = card.querySelector(".tipagem-card-button");

    button.addEventListener("click", () => {
        abrirTipagem(tipagem);
    });

    grid.appendChild(card);
}


/* SEGURANÇA */

function escaparHtml(valor) {
    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* MENU */

function abrirMenu() {
    memberMenu.classList.add("open");
    memberMenuOverlay.classList.add("open");

    memberMenu.setAttribute("aria-hidden", "false");
    menuButton.setAttribute("aria-expanded", "true");
}

function fecharMenu() {
    memberMenu.classList.remove("open");
    memberMenuOverlay.classList.remove("open");

    memberMenu.setAttribute("aria-hidden", "true");
    menuButton.setAttribute("aria-expanded", "false");
}

menuButton.addEventListener("click", event => {
    event.stopPropagation();

    if (memberMenu.classList.contains("open")) {
        fecharMenu();
    } else {
        abrirMenu();
    }
});

closeMenuButton.addEventListener("click", event => {
    event.stopPropagation();
    fecharMenu();
});

memberMenuOverlay.addEventListener("click", fecharMenu);


function normalizarUsername(username) {
    if (!username) {
        return "@usuario";
    }

    const valor = String(username).trim();

    return valor.startsWith("@")
        ? valor
        : `@${valor}`;
}


function atualizarMenuUsuario(perfil) {
    const nome = perfil?.nome || "Membro";
    const username = normalizarUsername(perfil?.username);

    document.getElementById("menu-name").textContent = nome;
    document.getElementById("menu-username").textContent = username;

    document.getElementById("miniName").textContent = nome;
    document.getElementById("miniUsername").textContent = username;

    const menuBadge =
        document.getElementById("menu-badge");

    if (String(perfil?.cargo || "").toLowerCase().trim() === "adm") {
        menuBadge.textContent = "ADMIN";
        menuBadge.classList.remove("hidden");
    } else if (perfil?.vip === true) {
        menuBadge.textContent = "VIP";
        menuBadge.classList.remove("hidden");
    } else {
        menuBadge.textContent = "";
        menuBadge.classList.add("hidden");
    }

    aplicarAvatarMenu(
        perfil?.avatar_url,
        "menu-avatar"
    );

    aplicarAvatarMenu(
        perfil?.avatar_url,
        "miniAvatar"
    );
}


function atualizarMenuVisitante() {
    document.getElementById("menu-name").textContent = "Visitante";
    document.getElementById("menu-username").textContent = "Não conectado";

    document.getElementById("miniName").textContent = "Visitante";
    document.getElementById("miniUsername").textContent = "Não conectado";

    document.getElementById("menu-badge").textContent = "";
    document.getElementById("menu-badge").classList.add("hidden");
}


function aplicarAvatarMenu(url, elementId) {
    const elemento = document.getElementById(elementId);

    if (!elemento) {
        return;
    }

    elemento.innerHTML = "";

    if (!url) {
        elemento.textContent = "👤";
        return;
    }

    const imagem = document.createElement("img");

    imagem.src = url;
    imagem.alt = "Avatar";

    imagem.onerror = () => {
        elemento.innerHTML = "👤";
    };

    elemento.appendChild(imagem);
}

async function carregarUsuarioAtual() {
    try {
        const {
            data: authData,
            error: authError
        } = await supabaseClient.auth.getUser();

        if (authError) {
            throw authError;
        }

        usuarioAtual = authData?.user || null;

        if (!usuarioAtual) {
            TIPAGENS_IS_LOGGED_IN = false;
            TIPAGENS_IS_ADMIN = false;
            TIPAGENS_IS_OWNER = false;

            atualizarMenuVisitante();
            return;
        }

        TIPAGENS_IS_LOGGED_IN = true;

        const {
            data: perfil,
            error: perfilError
        } = await supabaseClient
            .from("profiles")
            .select("id, nome, username, avatar_url, vip, cargo, vip_expira_em")
            .eq("id", usuarioAtual.id)
            .single();

        if (perfilError) {
            throw perfilError;
        }

        if (!perfil) {
            throw new Error("Perfil não encontrado.");
        }

        perfilAtual = perfil;

        const isAdm =
            String(perfil.cargo || "")
                .toLowerCase()
                .trim() === "adm";

        const vipAtivo =
            perfil.vip === true &&
            (
                !perfil.vip_expira_em ||
                new Date(perfil.vip_expira_em).getTime() > Date.now()
            );

        TIPAGENS_IS_ADMIN = isAdm;

        TIPAGENS_IS_OWNER =
            usuarioAtual.id === "0be5c16f-5b0f-4ed6-9bc2-107a1f40cf57";

        newTipagemButton.classList.toggle(
            "hidden",
            !TIPAGENS_IS_ADMIN
        );

        atualizarMenuUsuario(perfil);

    } catch (error) {
        console.error(
            "Erro ao carregar usuário atual:",
            error
        );

        usuarioAtual = null;
        perfilAtual = null;

        TIPAGENS_IS_LOGGED_IN = false;
        TIPAGENS_IS_ADMIN = false;
        TIPAGENS_IS_OWNER = false;

        newTipagemButton.classList.add("hidden");

        atualizarMenuVisitante();
    }
}


/* LOGOUT */

logoutMenuButton.addEventListener("click", async () => {
    const confirmar = confirm(
        "Deseja realmente sair da sua conta?"
    );

    if (!confirmar) {
        return;
    }

    logoutMenuButton.disabled = true;
    logoutMenuButton.textContent = "Saindo...";

    try {
        const { error } = await supabaseClient.auth.signOut();

        if (error) {
            throw error;
        }

        usuarioAtual = null;
        perfilAtual = null;

        TIPAGENS_IS_LOGGED_IN = false;
        TIPAGENS_IS_ADMIN = false;
        TIPAGENS_IS_OWNER = false;

        window.location.reload();

    } catch (error) {
        console.error(
            "Erro ao sair da conta:",
            error
        );

        alert(
            "Não foi possível sair da conta."
        );

        logoutMenuButton.disabled = false;
        logoutMenuButton.textContent =
            "🚪 Sair da conta";
    }
});

/* CATEGORIAS */

function formatarCategoria(categoria) {
    const categorias = {
        anime: "ANIME",
        jogos: "JOGOS",
        filmes: "FILMES",
        series: "SÉRIES"
    };

    return categorias[categoria] || categoria.toUpperCase();
}

function atualizarContador() {
    const quantidade = state.tipagensFiltradas.length;

    resultsCounter.textContent =
        quantidade === 1
            ? "1 tipagem"
            : `${quantidade} tipagens`;
}

function obterTipagensFiltradas() {
    if (state.categoriaAtual === "todos") {
        return [...tipagensDemo];
    }

    return tipagensDemo.filter(
        tipagem => tipagem.categoria === state.categoriaAtual
    );
}


/* CARDS */

function criarCardTipagem(tipagem) {
    const card = document.createElement("article");

    card.className = "tipagem-card";
    card.dataset.id = tipagem.id;

    card.innerHTML = `
        <div class="card-image-wrap">
            <span class="card-category">
                ${formatarCategoria(tipagem.categoria)}
            </span>

            <img
                class="card-image"
                src="${tipagem.imagem_url || "https://placehold.co/700x700/14101D/A9D8FF?text=SEM+FOTO"}"
                alt="${tipagem.personagem || "Personagem"}"
                loading="lazy"
            >
        </div>

        <div class="card-info">
            <span class="card-character-name">
                ${tipagem.personagem || "Personagem"}
            </span>

            <span class="card-typing">
                ${tipagem.mbti || "—"} = ${tipagem.eneagrama || "—"}
            </span>

            <span class="card-work">
                ${tipagem.obra || "—"}
            </span>
        </div>
    `;

    card.addEventListener("click", () => {
        abrirTipagem(tipagem);
    });

    return card;
}

/* CARREGAMENTO */
function carregarMaisTipagens(tipagens = null) {
    const lista = tipagens || (
        state.categoriaAtual === "todos"
            ? state.tipagensFiltradas
            : state.tipagensFiltradas.filter(
                tipagem => tipagem.categoria === state.categoriaAtual
            )
    );

    if (state.tipagensRenderizadas >= lista.length) {
        loadingArea.classList.remove("visible");
        return;
    }

    loadingArea.classList.add("visible");

    const inicio = state.tipagensRenderizadas;

    const fim = Math.min(
        inicio + state.quantidadePorCarregamento,
        lista.length
    );

    const fragment = document.createDocumentFragment();

    lista
        .slice(inicio, fim)
        .forEach(tipagem => {
            fragment.appendChild(
                criarCardTipagem(tipagem)
            );
        });

    grid.appendChild(fragment);

    state.tipagensRenderizadas = fim;

    loadingArea.classList.remove("visible");
}

/* FILTROS */

document.querySelectorAll(".category-button").forEach(button => {
    button.addEventListener("click", () => {

        document
            .querySelectorAll(".category-button")
            .forEach(item => item.classList.remove("active"));

        button.classList.add("active");

        state.categoriaAtual = button.dataset.category;

        renderizarTipagens();

        window.scrollTo({
            top: document.querySelector(".tipagens-section").offsetTop - 25,
            behavior: "smooth"
        });
    });
});


/* INFINITE SCROLL */

let carregamentoEmAndamento = false;

window.addEventListener("scroll", () => {

    if (carregamentoEmAndamento) {
        return;
    }

    const distanciaDoFinal =
        document.documentElement.scrollHeight -
        (window.scrollY + window.innerHeight);

    if (distanciaDoFinal < 500) {

        if (state.tipagensRenderizadas >= state.tipagensFiltradas.length) {
            return;
        }

        carregamentoEmAndamento = true;

        carregarMaisTipagens();

        setTimeout(() => {
            carregamentoEmAndamento = false;
        }, 400);
    }
});


/* MODAL */

async function abrirTipagem(tipagem) {

    state.tipagemAtual = tipagem;

    modalImage.src = tipagem.imagem_url || "https://placehold.co/700x700/14101D/A9D8FF?text=SEM+FOTO";
    modalImage.alt = tipagem.personagem;

    modalCharacterName.textContent = tipagem.personagem;
    modalWork.textContent = tipagem.obra;
    modalCategory.textContent = formatarCategoria(tipagem.categoria);

    modalMbti.textContent = tipagem.mbti;
    modalEnneagram.textContent = tipagem.eneagrama;
    modalTritype.textContent = tipagem.tritype;
    modalSubtype.textContent = tipagem.subtipo;
    modalTemperament.textContent = tipagem.temperamento;
    modalSocionics.textContent = tipagem.socionics;
    modalBigFive.textContent = tipagem.bigFive;
    modalDescription.textContent = tipagem.descricao;

await carregarVotos(tipagem.id);

    if (TIPAGENS_IS_ADMIN || TIPAGENS_IS_OWNER) {
        adminSection.classList.add("visible");
    } else {
        adminSection.classList.remove("visible");
    }

   modal.style.display = "flex";
modal.classList.add("active");
modal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");
}

function fecharTipagem() {

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("modal-open");

    state.tipagemAtual = null;
}

modalClose.addEventListener("click", fecharTipagem);

modal.addEventListener("click", event => {
    if (event.target === modal) {
        fecharTipagem();
    }
});


/* LOGIN MODAL */

function abrirLoginModal() {
    loginModal.classList.add("active");
    loginModal.setAttribute("aria-hidden", "false");
}

function fecharLoginModal() {
    loginModal.classList.remove("active");
    loginModal.setAttribute("aria-hidden", "true");
}

loginModalClose.addEventListener("click", fecharLoginModal);

loginModal.addEventListener("click", event => {
    if (event.target === loginModal) {
        fecharLoginModal();
    }
});

/* VOTOS */

async function carregarVotos(tipagemId) {
    if (!tipagemId) {
        return;
    }

    const { data: votos, error } = await supabaseClient
        .from("tipagem_votos")
        .select("usuario_id, voto")
        .eq("tipagem_id", tipagemId);

    if (error) {
        console.error("Erro ao carregar votos:", error);
        return;
    }

    const votosLista = votos || [];

    const likes = votosLista.filter(
        item => item.voto === "like"
    ).length;

    const dislikes = votosLista.filter(
        item => item.voto === "dislike"
    ).length;

    if (usuarioAtual?.id) {
        const meuVoto = votosLista.find(
            item => item.usuario_id === usuarioAtual.id
        );

        if (meuVoto) {
            state.votosDoUsuario[tipagemId] = meuVoto.voto;
        } else {
            delete state.votosDoUsuario[tipagemId];
        }
    }

    likeCount.textContent = likes;
    dislikeCount.textContent = dislikes;

    atualizarEstadoDoVoto(tipagemId);
}

function atualizarEstadoDoVoto(tipagemId) {
    likeButton.classList.remove("selected");
    dislikeButton.classList.remove("selected");

    if (!TIPAGENS_IS_LOGGED_IN) {
        loginRequired.classList.remove("hidden");
        return;
    }

    loginRequired.classList.add("hidden");

    const voto = state.votosDoUsuario[tipagemId];

    if (voto === "like") {
        likeButton.classList.add("selected");
    }

    if (voto === "dislike") {
        dislikeButton.classList.add("selected");
    }
}

function exigirLogin() {
    if (TIPAGENS_IS_LOGGED_IN) {
        return true;
    }

    abrirLoginModal();

    return false;
}

async function votar(tipo) {
    if (!state.tipagemAtual?.id) {
        return;
    }

    if (!exigirLogin()) {
        return;
    }

    if (!usuarioAtual?.id) {
        return;
    }

    const tipagemId = state.tipagemAtual.id;

    const { data: votoAtual, error: buscaError } = await supabaseClient
        .from("tipagem_votos")
        .select("id, voto")
        .eq("tipagem_id", tipagemId)
        .eq("usuario_id", usuarioAtual.id)
        .maybeSingle();

    if (buscaError) {
        console.error("Erro ao buscar voto:", buscaError);
        return;
    }

    if (votoAtual?.voto === tipo) {
        const { error } = await supabaseClient
            .from("tipagem_votos")
            .delete()
            .eq("id", votoAtual.id);

        if (error) {
            console.error("Erro ao remover voto:", error);
            return;
        }

        delete state.votosDoUsuario[tipagemId];

    } else if (votoAtual) {
        const { error } = await supabaseClient
            .from("tipagem_votos")
            .update({
                voto: tipo
            })
            .eq("id", votoAtual.id);

        if (error) {
            console.error("Erro ao alterar voto:", error);
            return;
        }

        state.votosDoUsuario[tipagemId] = tipo;

    } else {
        const { error } = await supabaseClient
            .from("tipagem_votos")
            .insert({
                tipagem_id: tipagemId,
                usuario_id: usuarioAtual.id,
                voto: tipo
            });

        if (error) {
            console.error("Erro ao registrar voto:", error);
            return;
        }

        state.votosDoUsuario[tipagemId] = tipo;
    }

    await carregarVotos(tipagemId);
}

likeButton.addEventListener("click", () => {
    votar("like");
});

dislikeButton.addEventListener("click", () => {
    votar("dislike");
});


/* ADMIN */

editButton.addEventListener("click", () => {
    if (!state.tipagemAtual) {
        return;
    }

    if (!TIPAGENS_IS_ADMIN && !TIPAGENS_IS_OWNER) {
        return;
    }

    const tipagem = state.tipagemAtual;

    tipagemId.value = tipagem.id || "";

    tipagemPersonagem.value = tipagem.personagem || "";
    tipagemObra.value = tipagem.obra || "";
    tipagemCategoria.value = tipagem.categoria || "";
    tipagemMbti.value = tipagem.mbti || "";
    tipagemEneagrama.value = tipagem.eneagrama || "";
    tipagemTritype.value = tipagem.tritype || "";
    tipagemSubtipo.value = tipagem.subtipo || "";
    tipagemTemperamento.value = tipagem.temperamento || "";
    tipagemSocionics.value = tipagem.socionics || "";
    tipagemBigFive.value = tipagem.big_five || "";
    tipagemDescricao.value = tipagem.descricao || "";

    adminModalTitle.textContent = "Editar tipagem";
    adminFormMessage.textContent = "";

    if (adminImagePreview) {
        adminImagePreview.src =
            tipagem.imagem_url ||
            "https://placehold.co/700x700/14101D/A9D8FF?text=SEM+FOTO";
    }

    adminTipagemModal.classList.add("active");
    adminTipagemModal.setAttribute("aria-hidden", "false");
});
deleteButton.addEventListener("click", () => {
    if (!state.tipagemAtual?.id) {
        return;
    }

    if (!TIPAGENS_IS_OWNER) {
        alert("Somente o dono da Casa dos MBTIs pode apagar publicações.");
        return;
    }

    tipagemPendenteExclusao = state.tipagemAtual;

    deleteConfirmText.textContent =
        `A publicação de "${tipagemPendenteExclusao.personagem}" e os comentários dela serão removidos permanentemente.`;

    deleteConfirmOverlay.classList.add("active");
    deleteConfirmOverlay.setAttribute("aria-hidden", "false");
});

deleteConfirmCancel.addEventListener("click", () => {
    fecharConfirmacaoExclusao();
});

deleteConfirmOverlay.addEventListener("click", (event) => {
    if (event.target === deleteConfirmOverlay) {
        fecharConfirmacaoExclusao();
    }
});

function fecharConfirmacaoExclusao() {
    deleteConfirmOverlay.classList.remove("active");
    deleteConfirmOverlay.setAttribute("aria-hidden", "true");
    tipagemPendenteExclusao = null;
}

deleteConfirmButton.addEventListener("click", async () => {
    if (!tipagemPendenteExclusao?.id) {
        return;
    }

    if (!TIPAGENS_IS_OWNER) {
        fecharConfirmacaoExclusao();
        return;
    }

    const tipagem = tipagemPendenteExclusao;

    deleteConfirmButton.disabled = true;
    deleteConfirmButton.textContent = "🗑️ Apagando...";

    const { error } = await supabaseClient
        .from("tipagens")
        .delete()
        .eq("id", tipagem.id);

    if (error) {
        console.error("Erro ao apagar publicação:", error);

        alert(
            `Não foi possível apagar a publicação:\n${error.message}`
        );

        deleteConfirmButton.disabled = false;
        deleteConfirmButton.textContent = "🗑️ Apagar";

        return;
    }

    fecharConfirmacaoExclusao();

    state.tipagemAtual = null;

    fecharTipagem();

    await carregarTipagens();

    deleteConfirmButton.disabled = false;
    deleteConfirmButton.textContent = "🗑️ Apagar";
});


/* ADMIN — NOVA TIPAGEM / EDIÇÃO */

function usuarioPodeAdministrarTipagens() {
    return TIPAGENS_IS_ADMIN;
}


function abrirAdminTipagem(tipagem = null) {
    if (!usuarioPodeAdministrarTipagens()) {
        return;
    }

    tipagemForm.reset();
    tipagemId.value = "";
    adminFormMessage.textContent = "";

    adminImagePreview.innerHTML = "<span>🖼️</span>";

    if (tipagem) {
        adminModalTitle.textContent = "Editar tipagem";
        adminSaveButton.textContent = "Salvar alterações";

   tipagemId.value = tipagem.id;
   console.log("ID DA EDIÇÃO:", tipagemId.value);
tipagemPersonagem.value = tipagem.personagem || "";
tipagemObra.value = tipagem.obra || "";
tipagemCategoria.value = tipagem.categoria || "anime";
tipagemMbti.value = tipagem.mbti || "";
tipagemEneagrama.value = tipagem.eneagrama || "";
tipagemTritype.value = tipagem.tritype || "";
tipagemSubtipo.value = tipagem.subtipo || "";
tipagemTemperamento.value = tipagem.temperamento || "";
tipagemSocionics.value = tipagem.socionics || "";
tipagemBigFive.value = tipagem.big_five || "";
tipagemDescricao.value = tipagem.descricao || "";

if (tipagem.imagem_url) {
    adminImagePreview.innerHTML = `
        <img src="${escaparHtml(tipagem.imagem_url)}" alt="">
    `;
}
} else {
    adminModalTitle.textContent = "Nova tipagem";
    adminSaveButton.textContent = "Publicar tipagem";
}
adminTipagemModal.classList.add("active");
adminTipagemModal.setAttribute("aria-hidden", "false");
adminTipagemModal.style.display = "flex";

document.body.classList.add("modal-open");
}

function fecharAdminTipagem() {
    adminTipagemModal.classList.remove("active");
    adminTipagemModal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("modal-open");
}
newTipagemButton.addEventListener("click", () => {
    abrirAdminTipagem();
});


adminTipagemClose.addEventListener("click", () => {
    fecharAdminTipagem();
});


adminTipagemModal.addEventListener("click", event => {
    if (event.target === adminTipagemModal) {
        fecharAdminTipagem();
    }
});


tipagemImageFile.addEventListener("change", () => {
    const arquivo = tipagemImageFile.files?.[0];

    if (!arquivo) {
        return;
    }

    if (!arquivo.type.startsWith("image/")) {
        adminFormMessage.textContent =
            "Escolha um arquivo de imagem.";

        tipagemImageFile.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = event => {
        adminImagePreview.innerHTML = `
            <img src="${event.target.result}" alt="">
        `;
    };

    reader.readAsDataURL(arquivo);
});


async function enviarImagemTipagem(arquivo) {
    if (!arquivo) {
        return null;
    }

    const extensao =
        arquivo.name
            .split(".")
            .pop()
            ?.toLowerCase() || "jpg";

    const nomeSeguro =
        `${crypto.randomUUID()}.${extensao}`;

    const caminho =
        `${usuarioAtual.id}/${nomeSeguro}`;

    const { error } = await supabaseClient
        .storage
        .from("tipagens")
        .upload(caminho, arquivo, {
            cacheControl: "3600",
            upsert: false
        });

    if (error) {
        throw error;
    }

    const {
        data: publicUrlData
    } = supabaseClient
        .storage
        .from("tipagens")
        .getPublicUrl(caminho);

    return publicUrlData.publicUrl;
}

async function salvarTipagem(event) {
    event.preventDefault();

    if (!usuarioPodeAdministrarTipagens()) {
        adminFormMessage.textContent =
            "Você não tem permissão para administrar tipagens.";

        return;
    }

    if (!usuarioAtual) {
        adminFormMessage.textContent =
            "Sua sessão não foi encontrada.";

        return;
    }

    const personagem =
        tipagemPersonagem.value.trim();

    const obra =
        tipagemObra.value.trim();

    if (!personagem || !obra) {
        adminFormMessage.textContent =
            "Preencha o personagem e a obra.";

        return;
    }

    adminSaveButton.disabled = true;
    adminSaveButton.textContent = "Salvando...";
    adminFormMessage.textContent = "";

    try {
        const idEdicao =
            tipagemId.value.trim();

        const arquivo =
            tipagemImageFile.files?.[0];

        let imagemUrl = null;

        if (arquivo) {
            imagemUrl =
                await enviarImagemTipagem(arquivo);
        }

        const dados = {
            personagem,
            obra,
            categoria: tipagemCategoria.value,
            mbti: tipagemMbti.value.trim() || null,
            eneagrama: tipagemEneagrama.value.trim() || null,
            tritype: tipagemTritype.value.trim() || null,
            subtipo: tipagemSubtipo.value.trim() || null,
            temperamento: tipagemTemperamento.value.trim() || null,
            socionics: tipagemSocionics.value.trim() || null,
            big_five: tipagemBigFive.value.trim() || null,
            descricao: tipagemDescricao.value.trim() || null
        };

        if (imagemUrl) {
            dados.imagem_url = imagemUrl;
        }

        if (idEdicao) {
            const { error } = await supabaseClient
                .from("tipagens")
                .update(dados)
                .eq("id", idEdicao);

            if (error) {
                throw error;
            }

            adminFormMessage.textContent =
                "Tipagem atualizada com sucesso.";

        } else {
            const { error } = await supabaseClient
                .from("tipagens")
                .insert(dados);

            if (error) {
                throw error;
            }

            adminFormMessage.textContent =
                "Tipagem publicada com sucesso.";
        }

        await carregarTipagens();

        setTimeout(() => {
            fecharAdminTipagem();
        }, 700);

    } catch (error) {
        console.error(
            "Erro ao salvar tipagem:",
            error
        );

        adminFormMessage.textContent =
            error?.message ||
            "Não foi possível salvar a tipagem.";

    } finally {
        adminSaveButton.disabled = false;

        adminSaveButton.textContent =
            tipagemId.value
                ? "Salvar alterações"
                : "Publicar tipagem";
    }
}

tipagemForm.addEventListener(
    "submit",
    salvarTipagem
);


/* ESC */

document.addEventListener("keydown", event => {

    if (event.key !== "Escape") {
        return;
    }

    if (modal.classList.contains("active")) {
        fecharTipagem();
    }

    if (loginModal.classList.contains("active")) {
        fecharLoginModal();
    }

    if (memberMenu.classList.contains("open")) {
        fecharMenu();
    }
});

async function inicializarTipagens() {
    await carregarTipagens();

    await carregarUsuarioAtual();

    atualizarEstadoDoVoto(
        state.tipagemAtual?.id || null
    );
}

inicializarTipagens();


/* =========================================================
   COMENTÁRIOS DAS TIPAGENS
   Não altera as funções existentes.
========================================================= */

(() => {
    const commentInput = document.getElementById("commentInput");
    const commentLinesCounter = document.getElementById("commentLinesCounter");
    const sendCommentButton = document.getElementById("sendCommentButton");
    const commentFormArea = document.getElementById("commentFormArea");
    const vipCommentNotice = document.getElementById("vipCommentNotice");
    const commentsList = document.getElementById("commentsList");
    const commentsEmpty = document.getElementById("commentsEmpty");
    const commentsCount = document.getElementById("commentsCount");
    const modal = document.getElementById("tipagemModal");

    if (
        !commentInput ||
        !sendCommentButton ||
        !commentsList ||
        !modal
    ) {
        console.warn("Área de comentários não encontrada.");
        return;
    }

    function podeComentar() {
        if (!perfilAtual) {
            return false;
        }

        const isAdm =
            String(perfilAtual.cargo || "")
                .toLowerCase()
                .trim() === "adm";

        const isVip =
            perfilAtual.vip === true &&
            (
                !perfilAtual.vip_expira_em ||
                new Date(perfilAtual.vip_expira_em).getTime() > Date.now()
            );

        return isAdm || isVip;
    }

    function contarLinhas(texto) {
        if (!texto.trim()) {
            return 0;
        }

        return texto.split(/\r?\n/).length;
    }

    function atualizarInterface() {
        const pode = podeComentar();

        if (pode) {
            commentFormArea.style.display = "block";
            vipCommentNotice.style.display = "none";
        } else {
            commentFormArea.style.display = "none";
            vipCommentNotice.style.display = "block";

            vipCommentNotice.textContent =
                TIPAGENS_IS_LOGGED_IN
                    ? "Apenas membros VIP e ADMs podem comentar."
                    : "Apenas membros VIP e ADMs podem comentar.";
        }

        const linhas = contarLinhas(commentInput.value);

        commentLinesCounter.textContent =
            `${linhas}/5 linhas`;

        commentLinesCounter.classList.toggle(
            "error",
            linhas > 5
        );

        sendCommentButton.disabled =
            !pode ||
            !comentarioValido();
    }

    function comentarioValido() {
        const texto = commentInput.value.trim();
        const linhas = contarLinhas(commentInput.value);

        return texto.length > 0 && linhas <= 5;
    }

    function escaparHTML(texto) {
        return String(texto ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

  async function carregarComentarios() {
    const tipagem = state.tipagemAtual;

    if (!tipagem?.id) {
        return;
    }

    commentsList.innerHTML = "";
    commentsEmpty.classList.remove("visible");
    commentsCount.textContent = "0";

    const { data: comentarios, error } = await supabaseClient
        .from("tipagem_comentarios")
        .select("id, usuario_id, comentario, created_at")
        .eq("tipagem_id", tipagem.id)
        .order("created_at", {
            ascending: false
        });

    if (error) {
        console.error("Erro ao carregar comentários:", error);
        return;
    }

    if (!comentarios || comentarios.length === 0) {
        commentsEmpty.classList.add("visible");
        return;
    }

    commentsCount.textContent = comentarios.length;

    const ids = [
        ...new Set(
            comentarios.map(item => item.usuario_id)
        )
    ];

    let perfis = [];

    if (ids.length) {
        const {
            data: perfilData,
            error: perfilError
        } = await supabaseClient
            .from("profiles")
            .select("id, nome, username, avatar_url, vip, cargo")
            .in("id", ids);

        if (perfilError) {
            console.error(
                "Erro ao carregar autores:",
                perfilError
            );
        } else {
            perfis = perfilData || [];
        }
    }

    comentarios.forEach(comentario => {
        const perfil = perfis.find(
            item => item.id === comentario.usuario_id
        );

        const article = document.createElement("article");
        article.className = "comment-item";

        const nome = perfil?.nome || "Membro";

        const username = perfil?.username
            ? `@${String(perfil.username).replace(/^@/, "")}`
            : "@usuario";

        const isAdm =
            String(perfil?.cargo || "")
                .toLowerCase()
                .trim() === "adm";

        const isVip =
            perfil?.vip === true;

        const data = new Date(
            comentario.created_at
        ).toLocaleDateString("pt-BR");

        const avatar = perfil?.avatar_url
            ? `<img src="${escaparHTML(perfil.avatar_url)}" alt="">`
            : "👤";

        const badge = isAdm
            ? `<span class="comment-admin-badge">ADMIN</span>`
            : isVip
                ? `<span class="comment-vip-badge">VIP</span>`
                : "";

        /*
         * APAGAR COMENTÁRIO
         * Continua disponível somente para a dona.
         */
        const podeApagarComentario =
            TIPAGENS_IS_OWNER === true;

        article.innerHTML = `
            <div class="comment-top">

                <div class="comment-avatar">
                    ${avatar}
                </div>

                <div class="comment-user">

                    <strong>
                        ${escaparHTML(nome)}
                        ${badge}
                    </strong>

                    <span>
                        ${escaparHTML(username)} · ${data}
                    </span>

                </div>

                ${
                    podeApagarComentario
                        ? `
                            <button
                                class="comment-delete-button"
                                type="button"
                                data-comment-id="${comentario.id}"
                                title="Apagar comentário"
                            >
                                🗑
                            </button>
                        `
                        : ""
                }

            </div>

            <p class="comment-text">
                ${escaparHTML(comentario.comentario)}
            </p>
        `;

        /*
         * AÇÃO DO BOTÃO DE APAGAR COMENTÁRIO
         */
        const deleteCommentButton =
            article.querySelector(".comment-delete-button");

        if (deleteCommentButton) {
            deleteCommentButton.addEventListener(
                "click",
                async () => {

                    const confirmar = confirm(
                        "Deseja apagar este comentário?"
                    );

                    if (!confirmar) {
                        return;
                    }

                    deleteCommentButton.disabled = true;

                    const {
                        error: deleteError
                    } = await supabaseClient
                        .from("tipagem_comentarios")
                        .delete()
                        .eq("id", comentario.id);

                    if (deleteError) {
                        console.error(
                            "Erro ao apagar comentário:",
                            deleteError
                        );

                        alert(
                            `Não foi possível apagar o comentário:\n${deleteError.message}`
                        );

                        deleteCommentButton.disabled = false;

                        return;
                    }

                    await carregarComentarios();
                }
            );
        }

        commentsList.appendChild(article);
    });
}

    async function enviarComentario() {
        if (!usuarioAtual) {
            alert("Você precisa estar logado.");
            return;
        }

        if (!podeComentar()) {
            alert(
                "Apenas membros VIP e ADMs podem comentar."
            );

            return;
        }

        if (!state.tipagemAtual?.id) {
            return;
        }

        const texto =
            commentInput.value
                .replace(/\r\n/g, "\n")
                .trim();

        const linhas = contarLinhas(texto);

        if (!texto) {
            return;
        }

        if (linhas > 5) {
            alert(
                "O comentário pode ter no máximo 5 linhas."
            );

            return;
        }

        sendCommentButton.disabled = true;
        sendCommentButton.textContent = "ENVIANDO...";

        const { error } = await supabaseClient
            .from("tipagem_comentarios")
            .insert({
                tipagem_id: state.tipagemAtual.id,
                usuario_id: usuarioAtual.id,
                comentario: texto
            });

        if (error) {
            console.error(
                "Erro ao enviar comentário:",
                error
            );

            alert(
                `Não foi possível enviar:\n${error.message}`
            );

            atualizarInterface();
            sendCommentButton.textContent = "COMENTAR";

            return;
        }

        commentInput.value = "";
        sendCommentButton.textContent = "COMENTAR";

        atualizarInterface();

        await carregarComentarios();
    }

    commentInput.addEventListener(
        "input",
        atualizarInterface
    );

    sendCommentButton.addEventListener(
        "click",
        enviarComentario
    );

    /*
     * Observa apenas a abertura do modal.
     * Assim não precisamos tocar na sua abrirTipagem().
     */
    const observer = new MutationObserver(() => {
        if (
            modal.classList.contains("active") &&
            state.tipagemAtual?.id
        ) {
            atualizarInterface();
            carregarComentarios();
        }
    });

    observer.observe(modal, {
        attributes: true,
        attributeFilter: ["class"]
    });

    atualizarInterface();
})();
