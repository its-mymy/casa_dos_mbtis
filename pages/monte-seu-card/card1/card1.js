const campos = {
    nick: document.getElementById("nick"),
    grupo: document.getElementById("grupo"),
    mbti: document.getElementById("mbti"),
    eneagrama: document.getElementById("eneagrama"),
    instintos: document.getElementById("instintos"),
    temperamento: document.getElementById("temperamento"),
    tritype: document.getElementById("tritype"),
    bigfive: document.getElementById("bigfive"),
    psychophy: document.getElementById("psychophy")
};

const card = document.getElementById("cardGerado");
const cardArea = document.querySelector(".card-area");
const grupoCard = document.getElementById("grupoCard");
const cardFundo = document.querySelector(".card-fundo");
const fotoPlaceholder = document.querySelector(".foto-placeholder");

const cardCampos = {
    nick: document.getElementById("cardNick"),
    grupo: document.getElementById("cardGrupo"),
    mbti: document.getElementById("cardMbti"),
    eneagrama: document.getElementById("cardEneagrama"),
    instintos: document.getElementById("cardInstintos"),
    temperamento: document.getElementById("cardTemperamento"),
    tritype: document.getElementById("cardTritype"),
    bigfive: document.getElementById("cardBigfive"),
    psychophy: document.getElementById("cardPsychophy")
};

const abas = document.querySelectorAll(".aba");
const painelImagens = document.getElementById("painelImagens");
const painelCor = document.getElementById("painelCor");
const temasBotoes = document.querySelectorAll(".tema");
const botoesCorLetra = document.querySelectorAll(".cor.letra");
const botoesCorTopo = document.querySelectorAll(".cor.topo");
const botoesFundo = document.querySelectorAll(".cores-fundo button");
const botoesAcessorio = document.querySelectorAll(".acessorio");
const botoesFormatoFoto = document.querySelectorAll(".formato-foto");

const corLetra = document.getElementById("corLetra");
const corTopo = document.getElementById("corTopo");
const corFundo = document.getElementById("corFundo");

const valorCorLetra = document.getElementById("valorCorLetra");
const valorCorTopo = document.getElementById("valorCorTopo");
const valorCorFundo = document.getElementById("valorCorFundo");

const botaoDownload = document.getElementById("baixarCard");
const botaoLink = document.getElementById("copiarLink");

const decoracoes = {
    spark: document.querySelector(".decoracao-spark"),
    flower: document.querySelector(".decoracao-flower"),
    star: document.querySelector(".decoracao-star"),
    heart: document.querySelector(".decoracao-heart"),
    bow: document.querySelector(".decoracao-bow")
};

const valoresPadrao = {
    nick: "Seu Nick",
    grupo: "Analistas",
    mbti: "ENTP",
    eneagrama: "7w6",
    instintos: "sp/so",
    temperamento: "Sanguíneo",
    tritype: "739",
    bigfive: "SCOEI",
    psychophy: "1L 2E 3V 4F"
};

const grupos = {
    Analistas: "#8c52e8",
    Diplomatas: "#5c9b68",
    Sentinelas: "#4d82e8",
    Exploradores: "#f0bd35"
};
const temas = {
    azul: "../img/azul.jpg",
    estrelado: "../img/estrelado.jpg",
    preto: "../img/preto.jpg",
    preto2: "../img/preto2.jpg",
    rosa: "../img/rosa.jpg",
    roxo: "../img/roxo.jpg",
    verde: "../img/verde.jpg",
    Giorno: "../img/giorno.jpg",
    noite: "../img/noite azulada.jpg",
    DIO: "../img/dio.jpg",
    anime: "../img/anime.jpg",
    gojo: "../img/gojo.jpg",
    zoro: "../img/zoro.jpg",
    alucard: "../img/alucard.jpg",
    Saiki: "../img/Saiki.jpg",
    "Johnny-Joestar": "../img/Johnny-Joestar.jpg",
    reze: "../img/reze.jpg",
    jinx: "../img/jinx.jpg",
    reze2: "../img/reze2.jpg",
    toji: "../img/toji.jpg",
    megumi: "../img/megumi.jpg",
    lobo: "../img/lobo.jpg",
    levi: "../img/levi.jpg",
    toji2: "../img/toji2.jpg",
    geto: "../img/geto.jpg",
    rel: "../img/rel.jpg",
    feliz: "../img/feliz.jpg",
    yuta: "../img/yuta.jpg",
    mob: "../img/mob.jpg",
    gojo2: "../img/gojo2.jpg",
    gojo3: "../img/gojo3.jpg",
    choso: "../img/choso.jpg",
    molusco: "../img/molusco.jpg",
    coringa: "../img/coringa.jpg",
    spider: "../img/spider.jpg",
    L: "../img/L.jpg",
    reze3: "../img/reze3.jpg",
    reze4: "../img/reze4.jpg",
    saiki2: "../img/saiki2.jpg"
};
const abreviacoes = {
    nick: "n",
    grupo: "g",
    mbti: "m",
    eneagrama: "e",
    instintos: "i",
    temperamento: "t",
    tritype: "r",
    bigfive: "b",
    psychophy: "p",
    fundo: "f",
    tema: "h",
    corLetra: "l",
    corTopo: "q",
    corFundo: "u",
    acessorio: "a",
    formatoFoto: "z"
};

const nomesAbreviados = {
    n: "nick",
    g: "grupo",
    m: "mbti",
    e: "eneagrama",
    i: "instintos",
    t: "temperamento",
    r: "tritype",
    b: "bigfive",
    p: "psychophy",
    f: "fundo",
    h: "tema",
    l: "corLetra",
    q: "corTopo",
    u: "corFundo",
    a: "acessorio",
    z: "formatoFoto"
};

let fundoAtual = "imagem";
let temaAtual = "azul";
let acessorioAtual = "none";
let formatoFotoAtual = "original";
let timeoutLink = null;

function aplicarCoresBotoes() {
    botoesCorLetra.forEach(botao => {
        botao.style.backgroundColor = botao.dataset.cor;
    });

    botoesCorTopo.forEach(botao => {
        botao.style.backgroundColor = botao.dataset.cor;
    });

    botoesFundo.forEach(botao => {
        botao.style.backgroundColor = botao.dataset.cor;
    });
}

function ajustarEscalaCard() {
    if (!cardArea || !card) {
        return;
    }

    const larguraDisponivel = cardArea.clientWidth;
    const larguraOriginal = 760;
    const alturaOriginal = 500;
    const margem = 4;

    if (!larguraDisponivel) {
        return;
    }

    let escala = (larguraDisponivel - margem) / larguraOriginal;

    if (escala > 1) {
        escala = 1;
    }

    if (escala < 0.35) {
        escala = 0.35;
    }

    card.style.setProperty("--card-scale", escala);

    const alturaVisual = alturaOriginal * escala;
    cardArea.style.height = `${alturaVisual}px`;
}

function atualizarGrupo() {
    const grupo = campos.grupo.value || valoresPadrao.grupo;
    const cor = grupos[grupo] || grupos.Analistas;

    grupoCard.style.setProperty("--group", cor);
}

function atualizarCard() {
    Object.keys(campos).forEach(chave => {
        const valor = campos[chave].value.trim();
        cardCampos[chave].textContent = valor || valoresPadrao[chave];
    });

    atualizarGrupo();
}

Object.values(campos).forEach(campo => {
    campo.addEventListener("input", () => {
        atualizarCard();
        agendarLink();
    });

    campo.addEventListener("change", () => {
        atualizarCard();
        salvarLink();
    });
});

function agendarLink() {
    clearTimeout(timeoutLink);
    timeoutLink = setTimeout(salvarLink, 250);
}

function mostrarAba(tipo) {
    fundoAtual = tipo;

    abas.forEach(aba => {
        aba.classList.toggle("ativo", aba.dataset.fundo === tipo);
    });

    painelImagens.classList.toggle("ativo", tipo === "imagem");
    painelCor.classList.toggle("ativo", tipo === "cor");

    salvarLink();
}

abas.forEach(aba => {
    aba.addEventListener("click", () => {
        mostrarAba(aba.dataset.fundo);
    });
});

function aplicarTema(nome, salvar = true) {
    if (!temas[nome]) {
        return;
    }

    temaAtual = nome;
    fundoAtual = "imagem";

    cardFundo.style.backgroundImage = `url("${temas[nome]}")`;

    temasBotoes.forEach(botao => {
        botao.classList.toggle("ativo", botao.dataset.tema === nome);
    });

    abas.forEach(aba => {
        aba.classList.toggle("ativo", aba.dataset.fundo === "imagem");
    });

    painelImagens.classList.add("ativo");
    painelCor.classList.remove("ativo");

    if (salvar) {
        salvarLink();
    }
}

temasBotoes.forEach(botao => {
    botao.addEventListener("click", () => {
        aplicarTema(botao.dataset.tema);
    });
});

function aplicarCorFundo(cor, salvar = true) {
    fundoAtual = "cor";
    cardFundo.style.backgroundImage = "none";
    card.style.setProperty("--background", cor);

    corFundo.value = cor;
    valorCorFundo.textContent = cor.toUpperCase();

    botoesFundo.forEach(botao => {
        botao.classList.toggle(
            "ativo",
            botao.dataset.cor.toLowerCase() === cor.toLowerCase()
        );
    });

    abas.forEach(aba => {
        aba.classList.toggle("ativo", aba.dataset.fundo === "cor");
    });

    painelImagens.classList.remove("ativo");
    painelCor.classList.add("ativo");

    if (salvar) {
        salvarLink();
    }
}

botoesFundo.forEach(botao => {
    botao.addEventListener("click", () => {
        aplicarCorFundo(botao.dataset.cor);
    });
});

corFundo.addEventListener("input", () => {
    aplicarCorFundo(corFundo.value);
});

function aplicarCorLetra(cor, salvar = true) {
    card.style.setProperty("--primary", cor);
    corLetra.value = cor;
    valorCorLetra.textContent = cor.toUpperCase();

    botoesCorLetra.forEach(botao => {
        botao.classList.toggle(
            "ativa",
            botao.dataset.cor.toLowerCase() === cor.toLowerCase()
        );
    });

    if (salvar) {
        salvarLink();
    }
}

botoesCorLetra.forEach(botao => {
    botao.addEventListener("click", () => {
        aplicarCorLetra(botao.dataset.cor);
    });
});

corLetra.addEventListener("input", () => {
    aplicarCorLetra(corLetra.value);
});

function aplicarCorTopo(cor, salvar = true) {
    card.style.setProperty("--top", cor);
    corTopo.value = cor;
    valorCorTopo.textContent = cor.toUpperCase();

    botoesCorTopo.forEach(botao => {
        botao.classList.toggle(
            "ativa",
            botao.dataset.cor.toLowerCase() === cor.toLowerCase()
        );
    });

    if (salvar) {
        salvarLink();
    }
}

botoesCorTopo.forEach(botao => {
    botao.addEventListener("click", () => {
        aplicarCorTopo(botao.dataset.cor);
    });
});

corTopo.addEventListener("input", () => {
    aplicarCorTopo(corTopo.value);
});

function aplicarAcessorio(nome, salvar = true) {
    acessorioAtual = nome;

    botoesAcessorio.forEach(botao => {
        botao.classList.toggle(
            "ativo",
            botao.dataset.acessorio === nome
        );
    });

    Object.values(decoracoes).forEach(decoracao => {
        decoracao.classList.remove("visivel");
    });

    if (decoracoes[nome]) {
        decoracoes[nome].classList.add("visivel");
    }

    if (salvar) {
        salvarLink();
    }
}

botoesAcessorio.forEach(botao => {
    botao.addEventListener("click", () => {
        aplicarAcessorio(botao.dataset.acessorio);
    });
});

function aplicarFormatoFoto(nome, salvar = true) {
    const formatos = [
        "original",
        "redondo",
        "quadrado",
        "coracao"
    ];

    if (!formatos.includes(nome)) {
        nome = "original";
    }

    formatoFotoAtual = nome;

    if (fotoPlaceholder) {
        fotoPlaceholder.classList.remove(
            "formato-original",
            "formato-redondo",
            "formato-quadrado",
            "formato-coracao"
        );

        if (nome !== "original") {
            fotoPlaceholder.classList.add(`formato-${nome}`);
        }
    }

    botoesFormatoFoto.forEach(botao => {
        botao.classList.toggle(
            "ativo",
            botao.dataset.formato === nome
        );
    });

    if (salvar) {
        salvarLink();
    }
}

botoesFormatoFoto.forEach(botao => {
    botao.addEventListener("click", () => {
        aplicarFormatoFoto(botao.dataset.formato);
    });
});

function gerarDados() {
    const dados = {};

    Object.keys(campos).forEach(chave => {
        const valor = campos[chave].value.trim();

        if (valor && valor !== valoresPadrao[chave]) {
            dados[abreviacoes[chave]] = valor;
        }
    });

    if (fundoAtual !== "imagem") {
        dados.f = fundoAtual;
    }

    if (temaAtual !== "azul") {
        dados.h = temaAtual;
    }

    if (corLetra.value.toLowerCase() !== "#c88dff") {
        dados.l = corLetra.value;
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

    if (formatoFotoAtual !== "original") {
        dados.z = formatoFotoAtual;
    }

    return dados;
}

function expandirDados(dados) {
    const resultado = {};

    Object.keys(dados).forEach(chave => {
        const nome = nomesAbreviados[chave];

        if (nome) {
            resultado[nome] = dados[chave];
        }
    });

    return resultado;
}

function compactar(dados) {
    if (typeof LZString === "undefined") {
        throw new Error("LZString não foi carregado.");
    }

    return LZString.compressToEncodedURIComponent(
        JSON.stringify(dados)
    );
}

function descompactar(codigo) {
    try {
        const texto = LZString.decompressFromEncodedURIComponent(codigo);

        if (!texto) {
            return null;
        }

        return expandirDados(JSON.parse(texto));
    } catch (erro) {
        console.error("Erro ao ler link:", erro);
        return null;
    }
}

function salvarLink() {
    clearTimeout(timeoutLink);

    timeoutLink = setTimeout(() => {
        try {
            const dados = gerarDados();
            const codigo = compactar(dados);

            history.replaceState(
                null,
                "",
                `${window.location.pathname}#${codigo}`
            );
        } catch (erro) {
            console.error("Erro ao salvar link:", erro);
        }
    }, 100);
}

function aplicarDadosDoLink(dados) {
    Object.keys(campos).forEach(chave => {
        if (dados[chave] !== undefined && dados[chave] !== null) {
            campos[chave].value = dados[chave];
        }
    });

    fundoAtual = dados.fundo || "imagem";
    temaAtual = dados.tema || "azul";
    acessorioAtual = dados.acessorio || "none";
    formatoFotoAtual = dados.formatoFoto || "original";

    aplicarCorLetra(
        dados.corLetra || "#c88dff",
        false
    );

    aplicarCorTopo(
        dados.corTopo || "#9f63d9",
        false
    );

    if (fundoAtual === "imagem") {
        aplicarTema(
            temas[temaAtual] ? temaAtual : "azul",
            false
        );
    } else {
        aplicarCorFundo(
            dados.corFundo || "#17121f",
            false
        );
    }

    aplicarAcessorio(acessorioAtual, false);
    aplicarFormatoFoto(formatoFotoAtual, false);
    atualizarCard();
}

function inicializar() {
    aplicarTema("azul", false);
    aplicarCorFundo("#17121f", false);
    aplicarCorLetra("#c88dff", false);
    aplicarCorTopo("#9f63d9", false);
    aplicarAcessorio("none", false);
    aplicarFormatoFoto("original", false);
    atualizarCard();
}

function carregarLink() {
    const codigo = window.location.hash.substring(1);

    if (!codigo) {
        inicializar();
        return;
    }

    const dados = descompactar(codigo);

    if (!dados) {
        inicializar();
        return;
    }

    aplicarDadosDoLink(dados);
}

function mostrarToast(mensagem) {
    const toast = document.getElementById("toast");

    toast.textContent = mensagem;
    toast.classList.add("mostrar");

    clearTimeout(mostrarToast.timer);

    mostrarToast.timer = setTimeout(() => {
        toast.classList.remove("mostrar");
    }, 2500);
}

botaoLink.addEventListener("click", async () => {
    try {
        clearTimeout(timeoutLink);

        const dados = gerarDados();
        const codigo = compactar(dados);
        const url = `${window.location.origin}${window.location.pathname}#${codigo}`;

        history.replaceState(
            null,
            "",
            `${window.location.pathname}#${codigo}`
        );

        await navigator.clipboard.writeText(url);

        mostrarToast("🔗 Link compacto copiado!");
    } catch (erro) {
        console.error(erro);
        mostrarToast("Não foi possível copiar o link.");
    }
});

async function prepararImagemAtual() {
    if (fundoAtual !== "imagem") {
        return;
    }

    const imagem = temas[temaAtual];

    if (!imagem) {
        return;
    }

    await new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = resolve;
        img.onerror = reject;
        img.src = imagem;
    });
}

botaoDownload.addEventListener("click", async () => {
    const confirmar = window.confirm(
        "Baixar seu card como imagem?"
    );

    if (!confirmar) {
        return;
    }

    let arquivoURL = null;

    botaoDownload.disabled = true;
    botaoDownload.textContent = "Gerando card...";

    try {
        if (typeof html2canvas !== "function") {
            throw new Error(
                "html2canvas não foi carregado."
            );
        }

        if (document.fonts) {
            await document.fonts.ready;
        }

        await prepararImagemAtual();

        await new Promise(resolve => {
            requestAnimationFrame(() => {
                requestAnimationFrame(resolve);
            });
        });

        const canvas = await html2canvas(card, {
            width: 760,
            height: 500,
            scale: 4,
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
                const clone =
                    documento.getElementById("cardGerado");

                if (!clone) {
                    return;
                }

                clone.style.transform = "none";
                clone.style.width = "760px";
                clone.style.height = "500px";
                clone.style.minWidth = "760px";
                clone.style.minHeight = "500px";
                clone.style.boxShadow = "none";
                clone.style.filter = "none";
                clone.style.opacity = "1";
                clone.style.visibility = "visible";

                clone.querySelectorAll("*").forEach(elemento => {
                    elemento.style.animation = "none";
                    elemento.style.transition = "none";
                });
            }
        });

        if (!canvas || canvas.width <= 0 || canvas.height <= 0) {
            throw new Error("O PNG ficou vazio.");
        }

        const blob = await new Promise(resolve => {
            canvas.toBlob(
                resolve,
                "image/png",
                1
            );
        });

        if (!blob) {
            throw new Error("Não foi possível criar o PNG.");
        }

        arquivoURL = URL.createObjectURL(blob);

        const nome =
            campos.nick.value.trim() || "meu-card";

        const nomeLimpo = nome
            .replace(/[^a-zA-Z0-9À-ÿ\s-_]/g, "")
            .trim()
            .replace(/\s+/g, "-");

        const nomeArquivo =
            `casa-dos-mbtis-${nomeLimpo || "meu-card"}.png`;

        const link = document.createElement("a");

        link.href = arquivoURL;
        link.download = nomeArquivo;
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
        console.error("Erro ao baixar:", erro);

        if (arquivoURL) {
            URL.revokeObjectURL(arquivoURL);
        }

        mostrarToast("😿 Não consegui baixar o card.");
    } finally {
        botaoDownload.disabled = false;
        botaoDownload.textContent = "↓ Baixar como imagem";
    }
});

function atualizarLayoutCard() {
    ajustarEscalaCard();
}

window.addEventListener(
    "resize",
    atualizarLayoutCard
);

window.addEventListener(
    "orientationchange",
    () => {
        setTimeout(
            atualizarLayoutCard,
            100
        );
    }
);

window.addEventListener(
    "load",
    () => {
        setTimeout(
            atualizarLayoutCard,
            50
        );
    }
);

aplicarCoresBotoes();
carregarLink();
atualizarCard();
ajustarEscalaCard();