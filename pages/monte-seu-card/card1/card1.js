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
const botoesCorLetra = document.querySelectorAll(".cor.letra");
const botoesCorTopo = document.querySelectorAll(".cor.topo");
const botoesFundo = document.querySelectorAll(".cores-fundo button");
const botoesAcessorio = document.querySelectorAll(".acessorio");
const botoesFormatoFoto = document.querySelectorAll(".formato-foto");

const corLetra = document.getElementById("corLetra");
const corTopo = document.getElementById("corTopo");
const corFundo = document.getElementById("corFundo");

const valorCorLetra = document.getElementById("valorCorLetra");
const valorCorTopo = document.getElementById("valorCorFundo");
const valorCorFundo = document.getElementById("valorCorFundo");

const botaoDownload = document.getElementById("baixarCard");
const botaoLink = document.getElementById("copiarLink");

const inputImagem = document.getElementById("imagemGaleria");
const valorNomeImagem = document.getElementById("nomeImagem");

const overlayOpacity = document.getElementById("overlayOpacity");
const valorOverlay = document.getElementById("valorOverlay");

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
    formatoFoto: "z",
    overlayOpacity: "o"
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
    z: "formatoFoto",
    o: "overlayOpacity"
};

let fundoAtual = "imagem";
let acessorioAtual = "none";
let formatoFotoAtual = "original";
let overlayAtual = 72;
let imagemGaleriaAtual = null;
let imagemGaleriaURL = null;
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
        cardCampos[chave].textContent =
            valor || valoresPadrao[chave];
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

    timeoutLink = setTimeout(() => {
        salvarLink();
    }, 250);
}

function mostrarAba(tipo) {
    fundoAtual = tipo;

    abas.forEach(aba => {
        aba.classList.toggle(
            "ativo",
            aba.dataset.fundo === tipo
        );
    });

    painelImagens.classList.toggle(
        "ativo",
        tipo === "imagem"
    );

    painelCor.classList.toggle(
        "ativo",
        tipo === "cor"
    );

    salvarLink();
}

abas.forEach(aba => {
    aba.addEventListener("click", () => {
        mostrarAba(aba.dataset.fundo);
    });
});

/* =========================
   IMAGEM DA GALERIA
========================= */

function aplicarImagemGaleria(file, salvar = true) {
    if (!file) {
        return;
    }

    if (!file.type.startsWith("image/")) {
        mostrarToast("Escolha uma imagem válida.");
        return;
    }

    if (imagemGaleriaURL) {
        URL.revokeObjectURL(imagemGaleriaURL);
    }

    imagemGaleriaAtual = file;
    imagemGaleriaURL = URL.createObjectURL(file);

    fundoAtual = "imagem";

    cardFundo.style.backgroundImage =
        `url("${imagemGaleriaURL}")`;

    card.style.setProperty("--background", "#17121f");

    abas.forEach(aba => {
        aba.classList.toggle(
            "ativo",
            aba.dataset.fundo === "imagem"
        );
    });

    painelImagens.classList.add("ativo");
    painelCor.classList.remove("ativo");

    if (valorNomeImagem) {
        valorNomeImagem.textContent = file.name;
    }

    if (salvar) {
        salvarLink();
    }
}

if (inputImagem) {
    inputImagem.addEventListener("change", event => {
        const file = event.target.files?.[0];

        if (file) {
            aplicarImagemGaleria(file);
        }
    });
}

/* =========================
   OVERLAY
========================= */

function aplicarOverlay(valor, salvar = true) {
    let numero = Number(valor);

    if (!Number.isFinite(numero)) {
        numero = 72;
    }

    numero = Math.max(0, Math.min(100, numero));

    overlayAtual = numero;

    const opacidade = numero / 100;

    card.style.setProperty(
        "--overlay-opacity",
        opacidade
    );

    if (overlayOpacity) {
        overlayOpacity.value = String(numero);
    }

    if (valorOverlay) {
        valorOverlay.textContent = `${numero}%`;
    }

    if (salvar) {
        salvarLink();
    }
}

if (overlayOpacity) {
    overlayOpacity.addEventListener("input", () => {
        aplicarOverlay(overlayOpacity.value);
    });
}

/* =========================
   COR DO FUNDO
========================= */

function aplicarCorFundo(cor, salvar = true) {
    fundoAtual = "cor";

    cardFundo.style.backgroundImage = "none";
    card.style.setProperty("--background", cor);

    corFundo.value = cor;
    valorCorFundo.textContent = cor.toUpperCase();

    botoesFundo.forEach(botao => {
        botao.classList.toggle(
            "ativo",
            botao.dataset.cor.toLowerCase() ===
            cor.toLowerCase()
        );
    });

    abas.forEach(aba => {
        aba.classList.toggle(
            "ativo",
            aba.dataset.fundo === "cor"
        );
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

/* =========================
   CORES
========================= */

function aplicarCorLetra(cor, salvar = true) {
    card.style.setProperty("--primary", cor);

    corLetra.value = cor;

    valorCorLetra.textContent =
        cor.toUpperCase();

    botoesCorLetra.forEach(botao => {
        botao.classList.toggle(
            "ativa",
            botao.dataset.cor.toLowerCase() ===
            cor.toLowerCase()
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

    valorCorTopo.textContent =
        cor.toUpperCase();

    botoesCorTopo.forEach(botao => {
        botao.classList.toggle(
            "ativa",
            botao.dataset.cor.toLowerCase() ===
            cor.toLowerCase()
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

/* =========================
   ACESSÓRIOS
========================= */

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
        aplicarAcessorio(
            botao.dataset.acessorio
        );
    });
});

/* =========================
   FORMATO DA FOTO
========================= */

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
            fotoPlaceholder.classList.add(
                `formato-${nome}`
            );
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
        aplicarFormatoFoto(
            botao.dataset.formato
        );
    });
});

/* =========================
   DADOS / LINK
========================= */

function gerarDados() {
    const dados = {};

    Object.keys(campos).forEach(chave => {
        const valor = campos[chave].value.trim();

        if (
            valor &&
            valor !== valoresPadrao[chave]
        ) {
            dados[abreviacoes[chave]] = valor;
        }
    });

    if (fundoAtual !== "imagem") {
        dados.f = fundoAtual;
    }

    if (
        corLetra.value.toLowerCase() !== "#c88dff"
    ) {
        dados.l = corLetra.value;
    }

    if (
        corTopo.value.toLowerCase() !== "#9f63d9"
    ) {
        dados.q = corTopo.value;
    }

    if (
        corFundo.value.toLowerCase() !== "#17121f"
    ) {
        dados.u = corFundo.value;
    }

    if (acessorioAtual !== "none") {
        dados.a = acessorioAtual;
    }

    if (formatoFotoAtual !== "original") {
        dados.z = formatoFotoAtual;
    }

    if (overlayAtual !== 72) {
        dados.o = overlayAtual;
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
        throw new Error(
            "LZString não foi carregado."
        );
    }

    return LZString.compressToEncodedURIComponent(
        JSON.stringify(dados)
    );
}

function descompactar(codigo) {
    try {
        const texto =
            LZString.decompressFromEncodedURIComponent(
                codigo
            );

        if (!texto) {
            return null;
        }

        return expandirDados(
            JSON.parse(texto)
        );

    } catch (erro) {
        console.error(
            "Erro ao ler link:",
            erro
        );

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
            console.error(
                "Erro ao salvar link:",
                erro
            );
        }
    }, 100);
}

/* =========================
   CARREGAR DADOS
========================= */

function aplicarDadosDoLink(dados) {
    Object.keys(campos).forEach(chave => {
        if (
            dados[chave] !== undefined &&
            dados[chave] !== null
        ) {
            campos[chave].value =
                dados[chave];
        }
    });

    fundoAtual =
        dados.fundo || "imagem";

    acessorioAtual =
        dados.acessorio || "none";

    formatoFotoAtual =
        dados.formatoFoto || "original";

    aplicarCorLetra(
        dados.corLetra || "#c88dff",
        false
    );

    aplicarCorTopo(
        dados.corTopo || "#9f63d9",
        false
    );

    aplicarOverlay(
        dados.overlayOpacity ?? 72,
        false
    );

    if (fundoAtual === "cor") {
        aplicarCorFundo(
            dados.corFundo || "#17121f",
            false
        );
    } else {
        painelImagens.classList.add("ativo");
        painelCor.classList.remove("ativo");

        abas.forEach(aba => {
            aba.classList.toggle(
                "ativo",
                aba.dataset.fundo === "imagem"
            );
        });
    }

    aplicarAcessorio(
        acessorioAtual,
        false
    );

    aplicarFormatoFoto(
        formatoFotoAtual,
        false
    );

    atualizarCard();
}

/* =========================
   INICIALIZAÇÃO
========================= */

function inicializar() {
    aplicarCorFundo(
        "#17121f",
        false
    );

    aplicarCorLetra(
        "#c88dff",
        false
    );

    aplicarCorTopo(
        "#9f63d9",
        false
    );

    aplicarOverlay(
        72,
        false
    );

    aplicarAcessorio(
        "none",
        false
    );

    aplicarFormatoFoto(
        "original",
        false
    );

    atualizarCard();
}

function carregarLink() {
    const codigo =
        window.location.hash.substring(1);

    if (!codigo) {
        inicializar();
        return;
    }

    const dados =
        descompactar(codigo);

    if (!dados) {
        inicializar();
        return;
    }

    aplicarDadosDoLink(dados);
}

/* =========================
   TOAST
========================= */

function mostrarToast(mensagem) {
    const toast =
        document.getElementById("toast");

    if (!toast) {
        return;
    }

    toast.textContent = mensagem;

    toast.classList.add("mostrar");

    clearTimeout(
        mostrarToast.timer
    );

    mostrarToast.timer = setTimeout(() => {
        toast.classList.remove(
            "mostrar"
        );
    }, 2500);
}

/* =========================
   COPIAR LINK
========================= */

if (botaoLink) {
    botaoLink.addEventListener(
        "click",
        async () => {
            try {
                clearTimeout(timeoutLink);

                const dados =
                    gerarDados();

                const codigo =
                    compactar(dados);

                const url =
                    `${window.location.origin}${window.location.pathname}#${codigo}`;

                history.replaceState(
                    null,
                    "",
                    `${window.location.pathname}#${codigo}`
                );

                await navigator.clipboard
                    .writeText(url);

                mostrarToast(
                    "🔗 Link compacto copiado!"
                );

            } catch (erro) {
                console.error(erro);

                mostrarToast(
                    "Não foi possível copiar o link."
                );
            }
        }
    );
}

/* =========================
   DOWNLOAD
========================= */

async function prepararImagemAtual() {
    if (fundoAtual !== "imagem") {
        return;
    }

    if (
        !cardFundo.style.backgroundImage ||
        cardFundo.style.backgroundImage === "none"
    ) {
        return;
    }

    if (
        imagemGaleriaURL &&
        cardFundo.style.backgroundImage.includes(
            imagemGaleriaURL
        )
    ) {
        const img =
            new Image();

        img.src =
            imagemGaleriaURL;

        await new Promise(resolve => {
            if (img.complete) {
                resolve();
                return;
            }

            img.onload = resolve;
            img.onerror = resolve;
        });

        return;
    }

    await new Promise(resolve => {
        resolve();
    });
}

if (botaoDownload) {
    botaoDownload.addEventListener(
        "click",
        async () => {

            const confirmar =
                window.confirm(
                    "Baixar seu card como imagem?"
                );

            if (!confirmar) {
                return;
            }

            botaoDownload.disabled = true;
            botaoDownload.textContent =
                "Gerando card...";

            try {

                if (
                    typeof html2canvas !==
                    "function"
                ) {
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
                        requestAnimationFrame(
                            resolve
                        );
                    });
                });

                const canvas =
                    await html2canvas(
                        card,
                        {
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
                                    documento.getElementById(
                                        "cardGerado"
                                    );

                                if (!clone) {
                                    return;
                                }

                                clone.style.transform =
                                    "none";

                                clone.style.setProperty(
                                    "--card-scale",
                                    "1"
                                );
                            }
                        }
                    );

                const link =
                    document.createElement("a");

                link.download =
                    "casa-dos-mbtis-card.png";

                link.href =
                    canvas.toDataURL(
                        "image/png"
                    );

                link.click();

                mostrarToast(
                    "✅ Card baixado!"
                );

            } catch (erro) {
                console.error(
                    "Erro ao gerar card:",
                    erro
                );

                mostrarToast(
                    "❌ Não foi possível gerar o card."
                );

            } finally {
                botaoDownload.disabled =
                    false;

                botaoDownload.textContent =
                    "Baixar Card";
            }
        }
    );
}

/* =========================
   RESIZE
========================= */

window.addEventListener(
    "resize",
    ajustarEscalaCard
);

/* =========================
   START
========================= */

aplicarCoresBotoes();
carregarLink();
ajustarEscalaCard();