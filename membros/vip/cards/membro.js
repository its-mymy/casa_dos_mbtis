/* =========================================================
   CASA DOS MBTIs
   CARTEIRINHA DE MEMBRO
   ========================================================= */


/* =========================================================
   SUPABASE
   ========================================================= */

const SUPABASE_URL =
    "https://lhhoqahzpuohhhnbwgfp.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_FTie2ELWKBc4Tz9r5fZuTw_izSaEHao";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


/* =========================================================
   ELEMENTOS
   ========================================================= */

const membroCard =
    document.getElementById("membroCard");

const avatarMembro =
    document.getElementById("avatarMembro");

const avatarFallback =
    document.getElementById("avatarFallback");

const bannerMembro =
    document.getElementById("bannerMembro");

const bannerSemImagem =
    document.querySelector(
        ".banner-sem-imagem"
    );

const nomeMembro =
    document.getElementById("nomeMembro");

const nomeBanner =
    document.getElementById("nomeBanner");

const usernameMembro =
    document.getElementById("usernameMembro");

const cargoBanner =
    document.getElementById("cargoBanner");

const cargoBadge =
    document.getElementById("cargoBadge");

const vipBadge =
    document.getElementById("vipBadge");

const idMembro =
    document.getElementById("idMembro");

const mbti =
    document.getElementById("mbti");

const eneagrama =
    document.getElementById("eneagrama");

const tritype =
    document.getElementById("tritype");

const subtipo =
    document.getElementById("subtipo");

const temperamento =
    document.getElementById("temperamento");

const socionics =
    document.getElementById("socionics");

const bigFive =
    document.getElementById("bigFive");

const fraseMembro =
    document.getElementById("fraseMembro");

const statusMembro =
    document.getElementById("statusMembro");

const bannerInput =
    document.getElementById("bannerInput");

const avatarInput =
    document.getElementById("avatarInput");

const fraseInput =
    document.getElementById("fraseInput");

const salvarPersonalizacao =
    document.getElementById(
        "salvarPersonalizacao"
    );

const baixarCard =
    document.getElementById(
        "baixarCard"
    );

const mensagem =
    document.getElementById(
        "mensagem"
    );


/* =========================================================
   ELEMENTOS DAS DUAS CORES
   ========================================================= */

const corPrincipal =
    document.getElementById(
        "corPrincipal"
    );

const corSecundaria =
    document.getElementById(
        "corSecundaria"
    );

const hexPrincipal =
    document.getElementById(
        "hexPrincipal"
    );

const hexSecundaria =
    document.getElementById(
        "hexSecundaria"
    );


/* =========================================================
   MEMBRO ATUAL
   ========================================================= */

let usuarioAtual = null;

let perfilAtual = null;


/* =========================================================
   CORES PADRÃO
   ========================================================= */

const CORES_PADRAO = {

    principal: "#E85B9C",

    secundaria: "#F8F5F7"

};


/* =========================================================
   GERAR ID DO MEMBRO
   ========================================================= */

function gerarNumeroMembro(id) {

    if (!id) {
        return "#00000";
    }


    const numero =
        id.replace(
            /[^0-9]/g,
            ""
        );


    if (!numero) {
        return "#00000";
    }


    return (
        "#" +
        numero
            .slice(-5)
            .padStart(5, "0")
    );

}


/* =========================================================
   FORMATAR CARGO
   ========================================================= */

function formatarCargo(cargo) {

    if (!cargo) {
        return "MEMBRO";
    }


    return cargo
        .toString()
        .toUpperCase();

}


/* =========================================================
   VALIDAR HEX
   ========================================================= */

function validarHex(
    valor,
    fallback
) {

    if (
        !valor ||
        typeof valor !== "string"
    ) {

        return fallback;

    }


    const cor =
        valor
            .trim()
            .replace("#", "")
            .toUpperCase();


    if (
        !/^[0-9A-F]{6}$/.test(cor)
    ) {

        return fallback;

    }


    return "#" + cor;

}


/* =========================================================
   APLICAR AS DUAS CORES
   ========================================================= */

function aplicarCores() {

    if (!membroCard) {
        return;
    }


    const principal =
        validarHex(
            corPrincipal
                ? corPrincipal.value
                : null,

            CORES_PADRAO.principal
        );


    const secundaria =
        validarHex(
            corSecundaria
                ? corSecundaria.value
                : null,

            CORES_PADRAO.secundaria
        );


    /* -----------------------------------------
       COR PRINCIPAL
       ----------------------------------------- */

    membroCard.style.setProperty(
        "--cor-principal",
        principal
    );


    /* -----------------------------------------
       COR SECUNDÁRIA
       ----------------------------------------- */

    membroCard.style.setProperty(
        "--cor-secundaria",
        secundaria
    );


    /* -----------------------------------------
       ATUALIZA HEX
       ----------------------------------------- */

    if (hexPrincipal) {

        hexPrincipal.value =
            principal.toUpperCase();

    }


    if (hexSecundaria) {

        hexSecundaria.value =
            secundaria.toUpperCase();

    }

}


/* =========================================================
   CONFIGURAR CAMPO HEX
   ========================================================= */

function configurarHex(
    inputHex,
    inputColor
) {

    if (
        !inputHex ||
        !inputColor
    ) {

        return;

    }


    /* -----------------------------------------
       DIGITANDO HEX
       ----------------------------------------- */

    inputHex.addEventListener(
        "input",
        function () {

            let valor =
                inputHex.value
                    .replace(
                        "#",
                        ""
                    )
                    .replace(
                        /[^0-9a-fA-F]/g,
                        ""
                    )
                    .slice(
                        0,
                        6
                    );


            inputHex.value =
                valor
                    ? "#" +
                      valor.toUpperCase()
                    : "#";


            if (
                valor.length === 6
            ) {

                inputColor.value =
                    "#" +
                    valor.toUpperCase();


                aplicarCores();

            }

        }
    );


    /* -----------------------------------------
       AO SAIR DO CAMPO
       ----------------------------------------- */

    inputHex.addEventListener(
        "blur",
        function () {

            const valor =
                validarHex(
                    inputHex.value,
                    inputColor.value
                );


            inputColor.value =
                valor;


            inputHex.value =
                valor.toUpperCase();


            aplicarCores();

        }
    );

}


/* =========================================================
   CONFIGURAR OS DOIS HEX
   ========================================================= */

configurarHex(
    hexPrincipal,
    corPrincipal
);


configurarHex(
    hexSecundaria,
    corSecundaria
);


/* =========================================================
   COLOR PICKER — PRINCIPAL
   ========================================================= */

if (corPrincipal) {

    corPrincipal.addEventListener(
        "input",
        function () {

            aplicarCores();

        }
    );

}


/* =========================================================
   COLOR PICKER — SECUNDÁRIA
   ========================================================= */

if (corSecundaria) {

    corSecundaria.addEventListener(
        "input",
        function () {

            aplicarCores();

        }
    );

}


/* =========================================================
   CARREGAR PERFIL
   ========================================================= */

async function carregarMembro() {

    try {

        mostrarMensagem(
            "Carregando seu perfil..."
        );


        /* -----------------------------------------
           USUÁRIO LOGADO
           ----------------------------------------- */

        const {
            data: {
                user
            },
            error: erroUsuario
        } =
            await supabaseClient
                .auth
                .getUser();


        if (erroUsuario) {

            throw erroUsuario;

        }


        /* -----------------------------------------
           NÃO ESTÁ LOGADO
           ----------------------------------------- */

        if (!user) {

            mostrarMensagem(
                "Você precisa estar logado para acessar sua carteirinha."
            );

            return;

        }


        usuarioAtual =
            user;


        /* -----------------------------------------
           BUSCAR PERFIL
           ----------------------------------------- */

        const {
            data,
            error
        } =
            await supabaseClient
                .from("profiles")
                .select(`
                    id,
                    nome,
                    username,
                    cargo,
                    mbti,
                    eneagrama,
                    tritype,
                    subtipo,
                    temperamento,
                    socionics,
                    big_five,
                    avatar_url,
                    avatar_tipo,
                    vip,
                    cor_principal,
                    cor_secundaria
                `)
                .eq(
                    "id",
                    user.id
                )
                .single();


        if (error) {

            throw error;

        }


        if (!data) {

            throw new Error(
                "Perfil não encontrado."
            );

        }


        perfilAtual =
            data;


        preencherCard(
            data
        );


        mostrarMensagem(
            ""
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar membro:",
            erro
        );


        mostrarMensagem(
            "Não foi possível carregar seu perfil."
        );

    }

}


/* =========================================================
   PREENCHER CARD
   ========================================================= */

function preencherCard(
    perfil
) {


    /* -----------------------------------------
       IDENTIDADE
       ----------------------------------------- */

    nomeMembro.textContent =
        perfil.nome ||
        "Membro";


    nomeBanner.textContent =
        perfil.nome ||
        "MEMBRO";


    usernameMembro.textContent =
        perfil.username
            ? "@" +
              perfil.username
            : "@membro";


    /* -----------------------------------------
       CARGO
       ----------------------------------------- */

    const cargo =
        formatarCargo(
            perfil.cargo
        );


    cargoBanner.textContent =
        cargo;


    cargoBadge.textContent =
        cargo;


    /* -----------------------------------------
       VIP
       ----------------------------------------- */

    if (
        perfil.vip === true
    ) {

        vipBadge.style.display =
            "block";

    } else {

        vipBadge.style.display =
            "none";

    }


    /* -----------------------------------------
       ID
       ----------------------------------------- */

    idMembro.textContent =
        gerarNumeroMembro(
            perfil.id
        );


    /* -----------------------------------------
       DADOS
       ----------------------------------------- */

    mbti.textContent =
        perfil.mbti ||
        "—";


    eneagrama.textContent =
        perfil.eneagrama ||
        "—";


    tritype.textContent =
        perfil.tritype ||
        "—";


    subtipo.textContent =
        perfil.subtipo ||
        "—";


    temperamento.textContent =
        perfil.temperamento ||
        "—";


    socionics.textContent =
        perfil.socionics ||
        "—";


    bigFive.textContent =
        perfil.big_five ||
        "—";


    /* -----------------------------------------
       AVATAR
       ----------------------------------------- */

    if (
        perfil.avatar_url
    ) {

        avatarMembro.src =
            perfil.avatar_url;


        avatarMembro.style.display =
            "block";


        avatarFallback.style.display =
            "none";

    } else {

        avatarMembro.src =
            "";


        avatarMembro.style.display =
            "none";


        avatarFallback.style.display =
            "flex";

    }


    /* -----------------------------------------
       CORES SALVAS
       ----------------------------------------- */

    const principal =
        validarHex(
            perfil.cor_principal,
            CORES_PADRAO.principal
        );


    const secundaria =
        validarHex(
            perfil.cor_secundaria,
            CORES_PADRAO.secundaria
        );


    if (corPrincipal) {

        corPrincipal.value =
            principal;

    }


    if (corSecundaria) {

        corSecundaria.value =
            secundaria;

    }


    aplicarCores();

}


/* =========================================================
   IMAGEM TEMPORÁRIA
   ========================================================= */

function carregarImagemPreview(
    input,
    imagem,
    fallback
) {

    if (
        !input ||
        !imagem
    ) {

        return;

    }


    input.addEventListener(
        "change",
        function (evento) {

            const arquivo =
                evento.target
                    .files[0];


            if (!arquivo) {

                return;

            }


            /* -----------------------------------------
               VALIDAR IMAGEM
               ----------------------------------------- */

            if (
                !arquivo.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "Escolha uma imagem válida."
                );


                input.value =
                    "";


                return;

            }


            /* -----------------------------------------
               LER ARQUIVO
               ----------------------------------------- */

            const leitor =
                new FileReader();


            leitor.onload =
                function (
                    eventoLeitor
                ) {

                    imagem.src =
                        eventoLeitor
                            .target
                            .result;


                    imagem.style.display =
                        "block";


                    if (fallback) {

                        fallback.style.display =
                            "none";

                    }

                };


            leitor.readAsDataURL(
                arquivo
            );

        }
    );

}


/* =========================================================
   BANNER — NÃO SALVA
   ========================================================= */

carregarImagemPreview(
    bannerInput,
    bannerMembro,
    bannerSemImagem
);


/* =========================================================
   AVATAR — TEMPORÁRIO NESTA PÁGINA
   ========================================================= */

carregarImagemPreview(
    avatarInput,
    avatarMembro,
    avatarFallback
);


/* =========================================================
   FRASE — NÃO SALVA
   ========================================================= */

if (fraseInput) {

    fraseInput.addEventListener(
        "input",
        function () {

            const texto =
                fraseInput.value.trim();


            fraseMembro.textContent =
                texto
                    ? `"${texto}"`
                    : '"Membro oficial da Casa dos MBTIs."';

        }
    );

}


/* =========================================================
   MENSAGEM
   ========================================================= */

function mostrarMensagem(
    texto
) {

    if (!mensagem) {

        return;

    }


    mensagem.textContent =
        texto;

}


/* =========================================================
   SALVAR
   SOMENTE AS DUAS CORES
   ========================================================= */

if (
    salvarPersonalizacao
) {

    salvarPersonalizacao.addEventListener(
        "click",
        async function () {

            try {

                /* -----------------------------------------
                   VERIFICAR LOGIN
                   ----------------------------------------- */

                if (!usuarioAtual) {

                    throw new Error(
                        "Usuário não autenticado."
                    );

                }


                salvarPersonalizacao.disabled =
                    true;


                mostrarMensagem(
                    "Salvando suas cores..."
                );


                /* -----------------------------------------
                   PEGAR CORES
                   ----------------------------------------- */

                const principal =
                    validarHex(
                        corPrincipal.value,
                        CORES_PADRAO.principal
                    );


                const secundaria =
                    validarHex(
                        corSecundaria.value,
                        CORES_PADRAO.secundaria
                    );


                /* -----------------------------------------
                   ATUALIZAR INPUTS
                   ----------------------------------------- */

                corPrincipal.value =
                    principal;


                corSecundaria.value =
                    secundaria;


                aplicarCores();


                /* -----------------------------------------
                   SALVAR NO SUPABASE
                   SOMENTE DUAS COLUNAS
                   ----------------------------------------- */

                const {
                    error
                } =
                    await supabaseClient
                        .from("profiles")
                        .update({

                            cor_principal:
                                principal,

                            cor_secundaria:
                                secundaria

                        })
                        .eq(
                            "id",
                            usuarioAtual.id
                        );


                if (error) {

                    throw error;

                }


                /* -----------------------------------------
                   ATUALIZAR OBJETO LOCAL
                   ----------------------------------------- */

                if (perfilAtual) {

                    perfilAtual.cor_principal =
                        principal;


                    perfilAtual.cor_secundaria =
                        secundaria;

                }


                mostrarMensagem(
                    "✓ Cores salvas no seu perfil!"
                );


            } catch (erro) {

                console.error(
                    "Erro ao salvar cores:",
                    erro
                );


                mostrarMensagem(
                    "Não foi possível salvar as cores."
                );


            } finally {

                salvarPersonalizacao.disabled =
                    false;

            }

        }
    );

}


/* =========================================================
   DOWNLOAD
   ========================================================= */

if (baixarCard) {

    baixarCard.addEventListener(
        "click",
        async function () {

            try {

                baixarCard.textContent =
                    "GERANDO...";


                baixarCard.disabled =
                    true;


                /* -----------------------------------------
                   APLICAR CORES
                   ----------------------------------------- */

                aplicarCores();


                /* -----------------------------------------
                   ESPERAR IMAGENS
                   ----------------------------------------- */

                const imagens =
                    membroCard
                        .querySelectorAll(
                            "img"
                        );


                await Promise.all(

                    [
                        ...imagens

                    ].map(

                        function (
                            imagem
                        ) {

                            if (
                                imagem.complete
                            ) {

                                return Promise.resolve();

                            }


                            return new Promise(
                                function (
                                    resolve
                                ) {

                                    imagem.onload =
                                        resolve;


                                    imagem.onerror =
                                        resolve;

                                }
                            );

                        }

                    )

                );


                /* -----------------------------------------
                   HTML2CANVAS
                   ----------------------------------------- */

                const canvas =
                    await html2canvas(
                        membroCard,
                        {

                            scale: 3,

                            useCORS: true,

                            allowTaint: false,

                            backgroundColor:
                                null,

                            logging: false,

                            imageTimeout:
                                15000

                        }
                    );


                /* -----------------------------------------
                   DOWNLOAD
                   ----------------------------------------- */

                const link =
                    document.createElement(
                        "a"
                    );


                const username =
                    perfilAtual &&
                    perfilAtual.username
                        ? perfilAtual.username
                        : "membro";


                link.download =
                    `carteirinha-${username}.png`;


                link.href =
                    canvas.toDataURL(
                        "image/png"
                    );


                link.click();


            } catch (erro) {

                console.error(
                    "Erro ao gerar carteirinha:",
                    erro
                );


                alert(
                    "Não foi possível gerar a carteirinha."
                );


            } finally {

                baixarCard.textContent =
                    "↓ BAIXAR CARTEIRINHA";


                baixarCard.disabled =
                    false;

            }

        }
    );

}


/* =========================================================
   INICIAR
   ========================================================= */

aplicarCores();

carregarMembro();