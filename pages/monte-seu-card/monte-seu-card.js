const campos = {
    nick: document.getElementById("nick"),
    mbti: document.getElementById("mbti"),
    eneagrama: document.getElementById("eneagrama"),
    grupo: document.getElementById("grupo"),
    subtipo: document.getElementById("subtipo"),
    stacking: document.getElementById("stacking"),
    temperamento: document.getElementById("temperamento"),
    tritype: document.getElementById("tritype"),
    socionics: document.getElementById("socionics"),
    instintos: document.getElementById("instintos"),
    bigfive: document.getElementById("bigfive")
};

const elementosCard = {
    nick: document.getElementById("cardNick"),
    mbti: document.getElementById("cardMbti"),
    eneagrama: document.getElementById("cardEneagrama"),
    grupo: document.getElementById("cardGrupo"),
    subtipo: document.getElementById("cardSubtipo"),
    stacking: document.getElementById("cardStacking"),
    temperamento: document.getElementById("cardTemperamento"),
    tritype: document.getElementById("cardTritype"),
    socionics: document.getElementById("cardSocionics"),
    instintos: document.getElementById("cardInstintos"),
    bigfive: document.getElementById("cardBigfive")
};

const card = document.getElementById("cardGerado");
const grupoBolinha = document.getElementById("grupoBolinha");

const colorPicker = document.getElementById("cor");
const corTopo = document.getElementById("corTopo");
const corFundo = document.getElementById("corFundo");

const valorCor = document.getElementById("valorCor");
const valorCorTopo = document.getElementById("valorCorTopo");
const valorCorFundo = document.getElementById("valorCorFundo");

const botoesCor = document.querySelectorAll(".cor-opcao");
const botoesCorTopo = document.querySelectorAll(".cor-topo-opcao");
const botoesFundo = document.querySelectorAll(".fundo-opcao");
const botoesTema = document.querySelectorAll(".tema");
const botoesTipoFundo = document.querySelectorAll(".tipo-fundo-btn");

const fundoImagens = document.getElementById("fundoImagens");
const fundoCor = document.getElementById("fundoCor");

const botaoCopiarLink = document.getElementById("copiarLink");
const botaoBaixarCard = document.getElementById("baixarCard");

let tipoFundo = "imagem";
let temaAtual = "azul";
let timeoutURL = null;

const valoresPadrao = {
    nick: "Seu Nick",
    mbti: "ENTP",
    eneagrama: "7w6",
    grupo: "Analistas",
    subtipo: "sp7",
    stacking: "sp/so",
    temperamento: "Sanguíneo",
    tritype: "739",
    socionics: "ILE",
    instintos: "sp/so",
    bigfive: "SCOEI"
};

const chavesCurtas = {
    nick: "n",
    mbti: "m",
    eneagrama: "e",
    grupo: "g",
    subtipo: "s",
    stacking: "k",
    temperamento: "t",
    tritype: "r",
    socionics: "c",
    instintos: "i",
    bigfive: "b",
    tipoFundo: "f",
    tema: "h",
    cor: "p",
    corTopo: "q",
    corFundo: "u"
};

const chavesLongas = {
    n: "nick",
    m: "mbti",
    e: "eneagrama",
    g: "grupo",
    s: "subtipo",
    k: "stacking",
    t: "temperamento",
    r: "tritype",
    c: "socionics",
    i: "instintos",
    b: "bigfive",
    f: "tipoFundo",
    h: "tema",
    p: "cor",
    q: "corTopo",
    u: "corFundo"
};

const temas = {
    azul: { imagem: "img/azul.jpg" },
    azul2: { imagem: "img/azul2.jpg" },
    estrelado: { imagem: "img/estrelado.jpg" },
    preto: { imagem: "img/preto.jpg" },
    preto2: { imagem: "img/preto2.jpg" },
    rosa: { imagem: "img/rosa.jpg" },
    roxo: { imagem: "img/roxo.jpg" },
    verde: { imagem: "img/verde.jpg" },
    Giorno: { imagem: "img/giorno.jpg" },
    "noite azulado": { imagem: "img/noite azulada.jpg" },
    DIO: { imagem: "img/dio.jpg" },
    anime: { imagem: "img/anime.jpg" },
    gojo: { imagem: "img/gojo.jpg" },
    zoro: { imagem: "img/zoro.jpg" },
    alucard: { imagem: "img/alucard.jpg" },
    Saiki: { imagem: "img/Saiki.jpg" },
    "Johnny-Joestar": { imagem: "img/Johnny-Joestar.jpg" },
    reze: { imagem: "img/reze.jpg" }
};

const coresGrupos = {
    Analistas: "#8c52e8",
    Sentinelas: "#4d82e8",
    Exploradores: "#f0bd35",
    Diplomatas: "#5c9b68"
};


/* =========================================================
   NICK
========================================================= */

function ajustarTamanhoNick() {
    const nick = elementosCard.nick;
    const valor = campos.nick.value.trim();
    const tamanho = valor.length;

    if (!valor) {
        nick.style.fontSize = "";
        return;
    }

    if (tamanho <= 5) {
        nick.style.fontSize = "clamp(32px, 4.5vw, 55px)";
    } else if (tamanho <= 9) {
        nick.style.fontSize = "clamp(27px, 3.8vw, 47px)";
    } else if (tamanho <= 14) {
        nick.style.fontSize = "clamp(23px, 3.2vw, 40px)";
    } else if (tamanho <= 20) {
        nick.style.fontSize = "clamp(20px, 2.8vw, 35px)";
    } else {
        nick.style.fontSize = "clamp(17px, 2.4vw, 30px)";
    }
}


/* =========================================================
   CARD
========================================================= */

function atualizarGrupoCard() {
    const grupo = campos.grupo.value || valoresPadrao.grupo;

    elementosCard.grupo.textContent = grupo;

    grupoBolinha.style.background =
        coresGrupos[grupo] || coresGrupos.Analistas;
}

function atualizarCard() {
    Object.keys(campos).forEach((chave) => {
        const valor = campos[chave].value.trim();

        elementosCard[chave].textContent =
            valor || valoresPadrao[chave];
    });

    ajustarTamanhoNick();
    atualizarGrupoCard();
}


/* =========================================================
   URL
========================================================= */

function agendarSalvarURL() {
    clearTimeout(timeoutURL);

    timeoutURL = setTimeout(() => {
        salvarNaURL();
    }, 300);
}

Object.values(campos).forEach((campo) => {
    campo.addEventListener("input", () => {
        atualizarCard();
        agendarSalvarURL();
    });

    campo.addEventListener("change", () => {
        atualizarCard();
        salvarNaURL();
    });
});


/* =========================================================
   CORES
========================================================= */

function atualizarBotoesCor(botoes, cor) {
    botoes.forEach((botao) => {
        botao.classList.toggle(
            "ativa",
            botao.dataset.color.toLowerCase() === cor.toLowerCase()
        );
    });
}

function aplicarCorTexto(cor, salvar = true) {
    if (!cor) return;

    card.style.setProperty("--card-primary", cor);

    colorPicker.value = cor;
    valorCor.textContent = cor.toUpperCase();

    atualizarBotoesCor(botoesCor, cor);

    if (salvar) {
        salvarNaURL();
    }
}

function aplicarCorTopo(cor, salvar = true) {
    if (!cor) return;

    card.style.setProperty("--card-top", cor);

    corTopo.value = cor;
    valorCorTopo.textContent = cor.toUpperCase();

    atualizarBotoesCor(botoesCorTopo, cor);

    if (salvar) {
        salvarNaURL();
    }
}

botoesCor.forEach((botao) => {
    botao.addEventListener("click", () => {
        aplicarCorTexto(botao.dataset.color);
    });
});

botoesCorTopo.forEach((botao) => {
    botao.addEventListener("click", () => {
        aplicarCorTopo(botao.dataset.color);
    });
});

colorPicker.addEventListener("input", () => {
    aplicarCorTexto(colorPicker.value);
});

corTopo.addEventListener("input", () => {
    aplicarCorTopo(corTopo.value);
});


/* =========================================================
   FUNDO POR COR
========================================================= */

function aplicarCorFundo(cor, salvar = true) {
    if (!cor) return;

    tipoFundo = "cor";

    card.style.backgroundImage = "none";
    card.style.backgroundColor = cor;
    card.style.setProperty("--card-background", cor);

    corFundo.value = cor;
    valorCorFundo.textContent = cor.toUpperCase();

    botoesFundo.forEach((botao) => {
        botao.classList.toggle(
            "ativa",
            botao.dataset.color.toLowerCase() === cor.toLowerCase()
        );
    });

    atualizarTipoFundoVisual();

    if (salvar) {
        salvarNaURL();
    }
}

botoesFundo.forEach((botao) => {
    botao.addEventListener("click", () => {
        aplicarCorFundo(botao.dataset.color);
    });
});

corFundo.addEventListener("input", () => {
    aplicarCorFundo(corFundo.value);
});


/* =========================================================
   TEMAS
========================================================= */

function aplicarTema(nomeTema, salvar = true) {
    const tema = temas[nomeTema];

    if (!tema) return;

    temaAtual = nomeTema;
    tipoFundo = "imagem";

    card.style.backgroundColor = "transparent";
    card.style.backgroundImage = `url("${tema.imagem}")`;
    card.style.backgroundSize = "cover";
    card.style.backgroundPosition = "center center";
    card.style.backgroundRepeat = "no-repeat";

    botoesTema.forEach((botao) => {
        botao.classList.toggle(
            "ativo",
            botao.dataset.theme === nomeTema
        );
    });

    atualizarTipoFundoVisual();

    if (salvar) {
        salvarNaURL();
    }
}

botoesTema.forEach((botao) => {
    botao.addEventListener("click", () => {
        aplicarTema(botao.dataset.theme);
    });
});


/* =========================================================
   TIPO DE FUNDO
========================================================= */

function atualizarTipoFundoVisual() {
    botoesTipoFundo.forEach((botao) => {
        botao.classList.toggle(
            "ativo",
            botao.dataset.tipo === tipoFundo
        );
    });

    if (tipoFundo === "imagem") {
        fundoImagens.classList.add("ativo");
        fundoCor.classList.remove("ativo");
    } else {
        fundoImagens.classList.remove("ativo");
        fundoCor.classList.add("ativo");
    }
}

botoesTipoFundo.forEach((botao) => {
    botao.addEventListener("click", () => {
        const tipo = botao.dataset.tipo;

        if (tipo === "imagem") {
            aplicarTema(
                temas[temaAtual] ? temaAtual : "azul"
            );
            return;
        }

        aplicarCorFundo(corFundo.value);
    });
});


/* =========================================================
   DADOS COMPACTOS
========================================================= */

function pegarDadosCompactos() {
    const dados = {};

    Object.keys(campos).forEach((chave) => {
        const valor = campos[chave].value.trim();

        if (valor && valor !== valoresPadrao[chave]) {
            dados[chavesCurtas[chave]] = valor;
        }
    });

    if (tipoFundo !== "imagem") {
        dados.f = tipoFundo;
    }

    if (temaAtual !== "azul") {
        dados.h = temaAtual;
    }

    if (colorPicker.value.toLowerCase() !== "#8c52e8") {
        dados.p = colorPicker.value;
    }

    if (corTopo.value.toLowerCase() !== "#8c52e8") {
        dados.q = corTopo.value;
    }

    if (corFundo.value.toLowerCase() !== "#d9ccd9") {
        dados.u = corFundo.value;
    }

    return dados;
}

function expandirDados(dados) {
    if (
        dados.nick !== undefined ||
        dados.mbti !== undefined ||
        dados.eneagrama !== undefined
    ) {
        return dados;
    }

    const resultado = {};

    Object.keys(dados).forEach((chave) => {
        const chaveLonga = chavesLongas[chave];

        if (chaveLonga) {
            resultado[chaveLonga] = dados[chave];
        }
    });

    return resultado;
}


/* =========================================================
   LZ STRING
========================================================= */

function codificarDados(dados) {
    if (typeof LZString === "undefined") {
        throw new Error("LZString não foi carregado.");
    }

    return LZString.compressToEncodedURIComponent(
        JSON.stringify(dados)
    );
}

function decodificarDados(codigo) {
    if (typeof LZString === "undefined") {
        throw new Error("LZString não foi carregado.");
    }

    try {
        const texto =
            LZString.decompressFromEncodedURIComponent(codigo);

        if (!texto) {
            return null;
        }

        const dados = JSON.parse(texto);

        return expandirDados(dados);
    } catch (erro) {
        console.warn(
            "Não foi possível carregar o card:",
            erro
        );

        return null;
    }
}


/* =========================================================
   SALVAR / CARREGAR URL
========================================================= */

function salvarNaURL() {
    try {
        const dados = pegarDadosCompactos();
        const codigo = codificarDados(dados);

        history.replaceState(
            null,
            "",
            `${window.location.pathname}#${codigo}`
        );
    } catch (erro) {
        console.error(
            "Erro ao salvar o card:",
            erro
        );
    }
}

function carregarDadosDaURL() {
    const codigo = window.location.hash.substring(1);

    if (!codigo) {
        return null;
    }

    return decodificarDados(codigo);
}

function preencherCampos(dados) {
    Object.keys(campos).forEach((chave) => {
        if (
            dados[chave] !== undefined &&
            dados[chave] !== null
        ) {
            campos[chave].value = dados[chave];
        }
    });
}


/* =========================================================
   IMAGENS
========================================================= */

function carregarImagem(src) {
    return new Promise((resolve, reject) => {
        const imagem = new Image();

        imagem.onload = () => {
            resolve(imagem);
        };

        imagem.onerror = () => {
            reject(
                new Error(
                    `Não foi possível carregar a imagem: ${src}`
                )
            );
        };

        imagem.src = src;
    });
}

async function prepararImagensDoCard() {
    if (tipoFundo !== "imagem") {
        return;
    }

    const tema = temas[temaAtual];

    if (!tema) {
        return;
    }

    await carregarImagem(tema.imagem);
}


/* =========================================================
   TOAST
========================================================= */

function mostrarToast(mensagem) {
    const toast = document.getElementById("toast");

    toast.textContent = mensagem;
    toast.classList.add("mostrar");

    clearTimeout(mostrarToast.timer);

    mostrarToast.timer = setTimeout(() => {
        toast.classList.remove("mostrar");
    }, 2600);
}


/* =========================================================
   CARREGAR CARD
========================================================= */

async function carregarDaURL() {
    const dados = carregarDadosDaURL();

    if (!dados) {
        atualizarCard();

        aplicarCorTexto("#8c52e8", false);
        aplicarCorTopo("#8c52e8", false);
        aplicarTema("azul", false);

        atualizarTipoFundoVisual();

        return;
    }

    preencherCampos(dados);

    tipoFundo = dados.tipoFundo || "imagem";
    temaAtual = dados.tema || "azul";

    aplicarCorTexto(
        dados.cor || "#8c52e8",
        false
    );

    aplicarCorTopo(
        dados.corTopo || "#8c52e8",
        false
    );

    if (tipoFundo === "imagem") {
        aplicarTema(
            temas[temaAtual]
                ? temaAtual
                : "azul",
            false
        );
    } else {
        aplicarCorFundo(
            dados.corFundo || "#d9ccd9",
            false
        );
    }

    atualizarTipoFundoVisual();
    atualizarCard();
}


/* =========================================================
   COPIAR LINK
========================================================= */

botaoCopiarLink.addEventListener("click", async () => {
    salvarNaURL();

    try {
        await navigator.clipboard.writeText(
            window.location.href
        );

        mostrarToast(
            "🔗 Link curto do card copiado!"
        );
    } catch (erro) {
        console.error(erro);

        mostrarToast(
            "Não foi possível copiar o link."
        );
    }
});


/* =========================================================
   DOWNLOAD DO CARD
========================================================= */

botaoBaixarCard.addEventListener("click", async () => {
    let arquivoURL = null;

    botaoBaixarCard.disabled = true;
    botaoBaixarCard.textContent = "Gerando card...";

    try {
        if (typeof html2canvas !== "function") {
            throw new Error(
                "html2canvas não foi carregado."
            );
        }

        await document.fonts.ready;
        await prepararImagensDoCard();

        await new Promise((resolve) => {
            requestAnimationFrame(() => {
                requestAnimationFrame(resolve);
            });
        });

        const largura = card.clientWidth;
        const altura = card.clientHeight;

        if (!largura || !altura) {
            throw new Error(
                "Não foi possível identificar o tamanho do card."
            );
        }

        const emCelular = window.innerWidth <= 700;

        const escala = emCelular ? 3 : 4;

        const canvas = await html2canvas(card, {
            width: largura,
            height: altura,
            scale: escala,

            useCORS: true,
            allowTaint: false,

            backgroundColor: null,

            logging: false,
            imageTimeout: 30000,

            removeContainer: true,
            foreignObjectRendering: false,

            scrollX: 0,
            scrollY: 0,

            onclone: (documento) => {
                const cardClone =
                    documento.getElementById("cardGerado");

                if (!cardClone) {
                    return;
                }

                cardClone.style.transform = "none";
                cardClone.style.filter = "none";
                cardClone.style.boxShadow = "none";

                const elementos =
                    cardClone.querySelectorAll("*");

                elementos.forEach((elemento) => {
                    elemento.style.animation = "none";
                    elemento.style.transition = "none";
                });
            }
        });

        if (
            !canvas ||
            canvas.width <= 0 ||
            canvas.height <= 0
        ) {
            throw new Error(
                "A imagem gerada ficou vazia."
            );
        }

        const blob = await new Promise((resolve) => {
            canvas.toBlob(
                resolve,
                "image/png",
                1
            );
        });

        if (!blob) {
            throw new Error(
                "Não foi possível criar o PNG."
            );
        }

        arquivoURL = URL.createObjectURL(blob);

        const nick =
            campos.nick.value.trim() ||
            "meu-card";

        const nomeArquivo = nick
            .replace(
                /[^a-zA-Z0-9À-ÿ\s-_]/g,
                ""
            )
            .trim()
            .replace(/\s+/g, "-");

        const nomeFinal =
            `casa-dos-mbtis-${nomeArquivo || "meu-card"}.png`;

        /*
         * Desktop:
         * baixa diretamente.
         */
        if (!emCelular) {
            const link =
                document.createElement("a");

            link.href = arquivoURL;
            link.download = nomeFinal;

            document.body.appendChild(link);
            link.click();
            link.remove();

            mostrarToast(
                "✨ Card baixado em alta resolução!"
            );

            setTimeout(() => {
                if (arquivoURL) {
                    URL.revokeObjectURL(arquivoURL);
                    arquivoURL = null;
                }
            }, 1500);

            return;
        }

        /*
         * Celular:
         * tenta usar compartilhamento de arquivo.
         */
        if (
            navigator.share &&
            navigator.canShare
        ) {
            const arquivo = new File(
                [blob],
                nomeFinal,
                {
                    type: "image/png"
                }
            );

            const podeCompartilhar =
                navigator.canShare({
                    files: [arquivo]
                });

            if (podeCompartilhar) {
                await navigator.share({
                    files: [arquivo],
                    title:
                        "Meu card da Casa dos MBTIs",
                    text:
                        "Meu card da Casa dos MBTIs 🏠🧠"
                });

                mostrarToast(
                    "✨ Imagem pronta para salvar!"
                );

                URL.revokeObjectURL(arquivoURL);
                arquivoURL = null;

                return;
            }
        }

        /*
         * Fallback para celulares que não suportam
         * compartilhamento de arquivos.
         */
        const link =
            document.createElement("a");

        link.href = arquivoURL;
        link.download = nomeFinal;

        document.body.appendChild(link);
        link.click();
        link.remove();

        mostrarToast(
            "✨ Card pronto para salvar!"
        );

        setTimeout(() => {
            if (arquivoURL) {
                URL.revokeObjectURL(arquivoURL);
                arquivoURL = null;
            }
        }, 3000);

    } catch (erro) {
        console.error(
            "ERRO AO GERAR O CARD:",
            erro
        );

        if (arquivoURL) {
            URL.revokeObjectURL(arquivoURL);
            arquivoURL = null;
        }

        mostrarToast(
            "😿 Não consegui gerar a imagem."
        );

    } finally {
        botaoBaixarCard.disabled = false;
        botaoBaixarCard.textContent =
            "↓ Baixar como imagem";
    }
});


carregarDaURL();