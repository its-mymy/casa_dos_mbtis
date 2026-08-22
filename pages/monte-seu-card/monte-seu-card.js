const campos = {
    nick: document.getElementById("nick"),
    mbti: document.getElementById("mbti"),
    eneagrama: document.getElementById("eneagrama"),
    grupo: document.getElementById("grupo"),
    instintos: document.getElementById("instintos"),
    temperamento: document.getElementById("temperamento"),
    tritype: document.getElementById("tritype"),
    bigfive: document.getElementById("bigfive"),
    psychophy: document.getElementById("psychophy")
};

const elementosCard = {
    nick: document.getElementById("cardNick"),
    mbti: document.getElementById("cardMbti"),
    eneagrama: document.getElementById("cardEneagrama"),
    grupo: document.getElementById("cardGrupo"),
    instintos: document.getElementById("cardInstintos"),
    temperamento: document.getElementById("cardTemperamento"),
    tritype: document.getElementById("cardTritype"),
    bigfive: document.getElementById("cardBigfive"),
    psychophy: document.getElementById("cardPsychophy")
};

const card = document.getElementById("cardGerado");
const grupoFaixa = document.getElementById("grupoFaixa");
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
const botoesAcessorio = document.querySelectorAll(".acessorio");
const fundoImagens = document.getElementById("fundoImagens");
const fundoCor = document.getElementById("fundoCor");
const botaoCopiarLink = document.getElementById("copiarLink");
const botaoBaixarCard = document.getElementById("baixarCard");

const decoracoes = {
    spark: document.getElementById("decorSpark"),
    flower: document.getElementById("decorFlower"),
    star: document.getElementById("decorStar"),
    heart: document.getElementById("decorHeart"),
    bow: document.getElementById("decorBow")
};

let tipoFundo = "imagem";
let temaAtual = "azul";
let acessorioAtual = "none";
let timeoutURL = null;

const valoresPadrao = {
    nick: "Seu Nick",
    mbti: "ENTP",
    eneagrama: "7w6",
    grupo: "Analistas",
    instintos: "sp/so",
    temperamento: "Sanguíneo",
    tritype: "739",
    bigfive: "SCOEI",
    psychophy: "1L 2E 3V 4F"
};

const chavesCurtas = {
    nick: "n",
    mbti: "m",
    eneagrama: "e",
    grupo: "g",
    instintos: "i",
    temperamento: "t",
    tritype: "r",
    bigfive: "b",
    psychophy: "p",
    tipoFundo: "f",
    tema: "h",
    cor: "c",
    corTopo: "q",
    corFundo: "u",
    acessorio: "a"
};

const chavesLongas = {
    n: "nick",
    m: "mbti",
    e: "eneagrama",
    g: "grupo",
    i: "instintos",
    t: "temperamento",
    r: "tritype",
    b: "bigfive",
    p: "psychophy",
    f: "tipoFundo",
    h: "tema",
    c: "cor",
    q: "corTopo",
    u: "corFundo",
    a: "acessorio"
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
    "noite-azulada": { imagem: "img/noite azulada.jpg" },
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
    Diplomatas: "#5c9b68",
    Sentinelas: "#4d82e8",
    Exploradores: "#f0bd35"
};

botoesCor.forEach(botao => {
    botao.style.background = botao.dataset.color;
});

botoesCorTopo.forEach(botao => {
    botao.style.background = botao.dataset.color;
});

botoesFundo.forEach(botao => {
    botao.style.background = botao.dataset.color;
});

function ajustarTamanhoNick() {
    const nick = elementosCard.nick;
    const valor = campos.nick.value.trim();
    const tamanho = valor.length;

    if (!valor) {
        nick.style.fontSize = "";
        return;
    }

    if (tamanho <= 5) {
        nick.style.fontSize = "clamp(34px, 4.4vw, 54px)";
    } else if (tamanho <= 9) {
        nick.style.fontSize = "clamp(30px, 4vw, 48px)";
    } else if (tamanho <= 14) {
        nick.style.fontSize = "clamp(26px, 3.5vw, 42px)";
    } else if (tamanho <= 20) {
        nick.style.fontSize = "clamp(22px, 3vw, 36px)";
    } else {
        nick.style.fontSize = "clamp(18px, 2.5vw, 31px)";
    }
}

function atualizarGrupoCard() {
    const grupo = campos.grupo.value || valoresPadrao.grupo;
    const cor = coresGrupos[grupo] || coresGrupos.Analistas;
    elementosCard.grupo.textContent = grupo;
    grupoFaixa.style.setProperty("--grupo-color", cor);
}

function atualizarCard() {
    Object.keys(campos).forEach(chave => {
        const valor = campos[chave].value.trim();
        elementosCard[chave].textContent = valor || valoresPadrao[chave];
    });

    ajustarTamanhoNick();
    atualizarGrupoCard();
}

function agendarSalvarURL() {
    clearTimeout(timeoutURL);
    timeoutURL = setTimeout(salvarNaURL, 300);
}

Object.values(campos).forEach(campo => {
    campo.addEventListener("input", () => {
        atualizarCard();
        agendarSalvarURL();
    });

    campo.addEventListener("change", () => {
        atualizarCard();
        salvarNaURL();
    });
});

function atualizarBotoesCor(botoes, cor) {
    botoes.forEach(botao => {
        botao.classList.toggle("ativa", botao.dataset.color.toLowerCase() === cor.toLowerCase());
    });
}

function aplicarCorTexto(cor, salvar = true) {
    if (!cor) return;

    card.style.setProperty("--card-primary", cor);
    colorPicker.value = cor;
    valorCor.textContent = cor.toUpperCase();
    atualizarBotoesCor(botoesCor, cor);

    if (salvar) salvarNaURL();
}

function aplicarCorTopo(cor, salvar = true) {
    if (!cor) return;

    card.style.setProperty("--card-top", cor);
    corTopo.value = cor;
    valorCorTopo.textContent = cor.toUpperCase();
    atualizarBotoesCor(botoesCorTopo, cor);

    if (salvar) salvarNaURL();
}

botoesCor.forEach(botao => {
    botao.addEventListener("click", () => {
        aplicarCorTexto(botao.dataset.color);
    });
});

botoesCorTopo.forEach(botao => {
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

function atualizarBotoesFundo(cor) {
    botoesFundo.forEach(botao => {
        botao.classList.toggle("ativa", botao.dataset.color.toLowerCase() === cor.toLowerCase());
    });
}

function aplicarCorFundo(cor, salvar = true) {
    if (!cor) return;

    tipoFundo = "cor";
    card.style.backgroundImage = "none";
    card.style.backgroundColor = cor;
    card.style.setProperty("--card-background", cor);
    corFundo.value = cor;
    valorCorFundo.textContent = cor.toUpperCase();

    atualizarBotoesFundo(cor);
    atualizarTipoFundoVisual();

    if (salvar) salvarNaURL();
}

botoesFundo.forEach(botao => {
    botao.addEventListener("click", () => {
        aplicarCorFundo(botao.dataset.color);
    });
});

corFundo.addEventListener("input", () => {
    aplicarCorFundo(corFundo.value);
});

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

    botoesTema.forEach(botao => {
        botao.classList.toggle("ativo", botao.dataset.theme === nomeTema);
    });

    atualizarTipoFundoVisual();

    if (salvar) salvarNaURL();
}

botoesTema.forEach(botao => {
    botao.addEventListener("click", () => {
        aplicarTema(botao.dataset.theme);
    });
});

function atualizarTipoFundoVisual() {
    botoesTipoFundo.forEach(botao => {
        botao.classList.toggle("ativo", botao.dataset.tipo === tipoFundo);
    });

    if (tipoFundo === "imagem") {
        fundoImagens.classList.add("ativo");
        fundoCor.classList.remove("ativo");
    } else {
        fundoImagens.classList.remove("ativo");
        fundoCor.classList.add("ativo");
    }
}

botoesTipoFundo.forEach(botao => {
    botao.addEventListener("click", () => {
        const tipo = botao.dataset.tipo;

        if (tipo === "imagem") {
            aplicarTema(temas[temaAtual] ? temaAtual : "azul");
            return;
        }

        aplicarCorFundo(corFundo.value);
    });
});

function atualizarAcessorio(nome, salvar = true) {
    acessorioAtual = nome;

    botoesAcessorio.forEach(botao => {
        botao.classList.toggle("ativo", botao.dataset.acessorio === nome);
    });

    Object.values(decoracoes).forEach(decoracao => {
        decoracao.classList.remove("visivel");
    });

    if (decoracoes[nome]) {
        decoracoes[nome].classList.add("visivel");
    }

    if (salvar) salvarNaURL();
}

botoesAcessorio.forEach(botao => {
    botao.addEventListener("click", () => {
        atualizarAcessorio(botao.dataset.acessorio);
    });
});

function pegarDadosCompactos() {
    const dados = {};

    Object.keys(campos).forEach(chave => {
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

    if (colorPicker.value.toLowerCase() !== "#c88dff") {
        dados.c = colorPicker.value;
    }

    if (corTopo.value.toLowerCase() !== "#9f63d9") {
        dados.q = corTopo.value;
    }

    if (corFundo.value.toLowerCase() !== "#17121f") {
        dados.u = corFundo.value;
    }

    if (acessorioAtual !== "none") {
        dados.a = acessorioAtual;
    }

    return dados;
}

function expandirDados(dados) {
    const resultado = {};

    Object.keys(dados).forEach(chave => {
        const chaveLonga = chavesLongas[chave];

        if (chaveLonga) {
            resultado[chaveLonga] = dados[chave];
        }
    });

    return resultado;
}

function codificarDados(dados) {
    if (typeof LZString === "undefined") {
        throw new Error("LZString não foi carregado.");
    }

    return LZString.compressToEncodedURIComponent(JSON.stringify(dados));
}

function decodificarDados(codigo) {
    if (typeof LZString === "undefined") {
        throw new Error("LZString não foi carregado.");
    }

    try {
        const texto = LZString.decompressFromEncodedURIComponent(codigo);

        if (!texto) return null;

        return expandirDados(JSON.parse(texto));
    } catch (erro) {
        console.warn("Não foi possível carregar o card:", erro);
        return null;
    }
}

function salvarNaURL() {
    try {
        const dados = pegarDadosCompactos();
        const codigo = codificarDados(dados);

        history.replaceState(null, "", `${window.location.pathname}#${codigo}`);
    } catch (erro) {
        console.error("Erro ao salvar card:", erro);
    }
}

function carregarDadosDaURL() {
    const codigo = window.location.hash.substring(1);

    if (!codigo) return null;

    return decodificarDados(codigo);
}

function preencherCampos(dados) {
    Object.keys(campos).forEach(chave => {
        if (dados[chave] !== undefined && dados[chave] !== null) {
            campos[chave].value = dados[chave];
        }
    });
}

function carregarImagem(src) {
    return new Promise((resolve, reject) => {
        const imagem = new Image();

        imagem.onload = () => resolve(imagem);
        imagem.onerror = () => reject(new Error(`Não foi possível carregar a imagem: ${src}`));
        imagem.src = src;
    });
}

async function prepararImagensDoCard() {
    if (tipoFundo !== "imagem") return;

    const tema = temas[temaAtual];

    if (!tema) return;

    await carregarImagem(tema.imagem);
}

function mostrarToast(mensagem) {
    const toast = document.getElementById("toast");

    toast.textContent = mensagem;
    toast.classList.add("mostrar");

    clearTimeout(mostrarToast.timer);

    mostrarToast.timer = setTimeout(() => {
        toast.classList.remove("mostrar");
    }, 2600);
}

async function carregarDaURL() {
    const dados = carregarDadosDaURL();

    if (!dados) {
        atualizarCard();
        aplicarCorTexto("#c88dff", false);
        aplicarCorTopo("#9f63d9", false);
        aplicarTema("azul", false);
        atualizarAcessorio("none", false);
        atualizarTipoFundoVisual();
        return;
    }

    preencherCampos(dados);

    tipoFundo = dados.tipoFundo || "imagem";
    temaAtual = dados.tema || "azul";
    acessorioAtual = dados.acessorio || "none";

    aplicarCorTexto(dados.cor || "#c88dff", false);
    aplicarCorTopo(dados.corTopo || "#9f63d9", false);

    if (tipoFundo === "imagem") {
        aplicarTema(temas[temaAtual] ? temaAtual : "azul", false);
    } else {
        aplicarCorFundo(dados.corFundo || "#17121f", false);
    }

    atualizarAcessorio(acessorioAtual, false);
    atualizarTipoFundoVisual();
    atualizarCard();
}

botaoCopiarLink.addEventListener("click", async () => {
    salvarNaURL();

    try {
        await navigator.clipboard.writeText(window.location.href);
        mostrarToast("🔗 Link curto do card copiado!");
    } catch (erro) {
        console.error(erro);
        mostrarToast("Não foi possível copiar o link.");
    }
});

botaoBaixarCard.addEventListener("click", async () => {
    const confirmou = window.confirm("Baixar seu card como imagem?");

    if (!confirmou) return;

    let arquivoURL = null;

    botaoBaixarCard.disabled = true;
    botaoBaixarCard.textContent = "Gerando card...";

    try {
        if (typeof html2canvas !== "function") {
            throw new Error("html2canvas não foi carregado.");
        }

        if (document.fonts) {
            await document.fonts.ready;
        }

        await prepararImagensDoCard();

        await new Promise(resolve => {
            requestAnimationFrame(() => {
                requestAnimationFrame(resolve);
            });
        });

        const largura = card.clientWidth;
        const altura = card.clientHeight;

        if (!largura || !altura) {
            throw new Error("Não foi possível identificar o tamanho do card.");
        }

        const escala = window.innerWidth <= 700 ? 3 : 4;

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
            onclone: documento => {
                const cardClone = documento.getElementById("cardGerado");

                if (!cardClone) return;

                cardClone.style.transform = "none";
                cardClone.style.filter = "none";
                cardClone.style.boxShadow = "none";

                cardClone.querySelectorAll("*").forEach(elemento => {
                    elemento.style.animation = "none";
                    elemento.style.transition = "none";
                });
            }
        });

        if (!canvas || canvas.width <= 0 || canvas.height <= 0) {
            throw new Error("A imagem gerada ficou vazia.");
        }

        const blob = await new Promise(resolve => {
            canvas.toBlob(resolve, "image/png", 1);
        });

        if (!blob) {
            throw new Error("Não foi possível criar o PNG.");
        }

        arquivoURL = URL.createObjectURL(blob);

        const nick = campos.nick.value.trim() || "meu-card";

        const nomeArquivo = nick
            .replace(/[^a-zA-Z0-9À-ÿ\s-_]/g, "")
            .trim()
            .replace(/\s+/g, "-");

        const nomeFinal = `casa-dos-mbtis-${nomeArquivo || "meu-card"}.png`;

        const link = document.createElement("a");
        link.href = arquivoURL;
        link.download = nomeFinal;
        link.setAttribute("download", nomeFinal);
        link.style.display = "none";

        document.body.appendChild(link);
        link.click();
        link.remove();

        mostrarToast("✨ Card salvo em alta resolução!");

        setTimeout(() => {
            if (arquivoURL) {
                URL.revokeObjectURL(arquivoURL);
                arquivoURL = null;
            }
        }, 2000);
    } catch (erro) {
        console.error("ERRO AO BAIXAR O CARD:", erro);

        if (arquivoURL) {
            URL.revokeObjectURL(arquivoURL);
            arquivoURL = null;
        }

        mostrarToast("😿 Não consegui salvar a imagem.");
    } finally {
        botaoBaixarCard.disabled = false;
        botaoBaixarCard.textContent = "↓ Baixar como imagem";
    }
});

carregarDaURL();