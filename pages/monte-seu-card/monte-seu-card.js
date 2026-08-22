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

const grupoCard = document.getElementById("grupoCard");
const abas = document.querySelectorAll(".aba");
const painelImagens = document.getElementById("painelImagens");
const painelCor = document.getElementById("painelCor");
const temasBotoes = document.querySelectorAll(".tema");
const botoesCorLetra = document.querySelectorAll(".cor.letra");
const botoesCorTopo = document.querySelectorAll(".cor.topo");
const botoesFundo = document.querySelectorAll(".cores-fundo button");
const botoesAcessorio = document.querySelectorAll(".acessorio");
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
    azul: "img/azul.jpg",
    azul2: "img/azul2.jpg",
    estrelado: "img/estrelado.jpg",
    preto: "img/preto.jpg",
    preto2: "img/preto2.jpg",
    rosa: "img/rosa.jpg",
    roxo: "img/roxo.jpg",
    verde: "img/verde.jpg",
    Giorno: "img/giorno.jpg",
    noite: "img/noite azulada.jpg",
    DIO: "img/dio.jpg",
    anime: "img/anime.jpg",
    gojo: "img/gojo.jpg",
    zoro: "img/zoro.jpg",
    alucard: "img/alucard.jpg",
    Saiki: "img/Saiki.jpg",
    "Johnny-Joestar": "img/Johnny-Joestar.jpg",
    reze: "img/reze.jpg"
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
    acessorio: "a"
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
    a: "acessorio"
};

let fundoAtual = "imagem";
let temaAtual = "azul";
let acessorioAtual = "none";
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

function atualizarCard() {
    Object.keys(campos).forEach(chave => {
        const valor = campos[chave].value.trim();
        cardCampos[chave].textContent = valor || valoresPadrao[chave];
    });

    atualizarGrupo();
}

function atualizarGrupo() {
    const grupo = campos.grupo.value || valoresPadrao.grupo;
    const cor = grupos[grupo] || grupos.Analistas;

    grupoCard.style.setProperty("--group", cor);
}

function atualizarNick() {
    const valor = campos.nick.value.trim();
    const tamanho = valor.length;

    if (!valor) {
        cardCampos.nick.style.fontSize = "";
        return;
    }

    if (window.matchMedia("(max-width: 820px)").matches) {
        if (tamanho <= 7) {
            cardCampos.nick.style.fontSize = "30px";
        } else if (tamanho <= 12) {
            cardCampos.nick.style.fontSize = "25px";
        } else if (tamanho <= 18) {
            cardCampos.nick.style.fontSize = "21px";
        } else {
            cardCampos.nick.style.fontSize = "18px";
        }

        return;
    }

    if (tamanho <= 5) {
        cardCampos.nick.style.fontSize = "54px";
    } else if (tamanho <= 9) {
        cardCampos.nick.style.fontSize = "48px";
    } else if (tamanho <= 14) {
        cardCampos.nick.style.fontSize = "42px";
    } else if (tamanho <= 20) {
        cardCampos.nick.style.fontSize = "36px";
    } else {
        cardCampos.nick.style.fontSize = "31px";
    }
}

function atualizarTudo() {
    atualizarCard();
    atualizarNick();
}

Object.values(campos).forEach(campo => {
    campo.addEventListener("input", () => {
        atualizarTudo();
        agendarLink();
    });

    campo.addEventListener("change", () => {
        atualizarTudo();
        salvarLink();
    });
});

function mostrarAba(tipo) {
    abas.forEach(aba => {
        aba.classList.toggle("ativo", aba.dataset.fundo === tipo);
    });

    painelImagens.classList.toggle("ativo", tipo === "imagem");
    painelCor.classList.toggle("ativo", tipo === "cor");

    fundoAtual = tipo;
    salvarLink();
}

abas.forEach(aba => {
    aba.addEventListener("click", () => {
        mostrarAba(aba.dataset.fundo);
    });
});

function aplicarTema(nome) {
    if (!temas[nome]) return;

    temaAtual = nome;
    fundoAtual = "imagem";

    card.style.backgroundImage = "none";
    document.querySelector(".card-fundo").style.backgroundImage = `url("${temas[nome]}")`;

    temasBotoes.forEach(botao => {
        botao.classList.toggle("ativo", botao.dataset.tema === nome);
    });

    abas.forEach(aba => {
        aba.classList.toggle("ativo", aba.dataset.fundo === "imagem");
    });

    painelImagens.classList.add("ativo");
    painelCor.classList.remove("ativo");

    salvarLink();
}

temasBotoes.forEach(botao => {
    botao.addEventListener("click", () => {
        aplicarTema(botao.dataset.tema);
    });
});

function aplicarCorFundo(cor) {
    fundoAtual = "cor";

    document.querySelector(".card-fundo").style.backgroundImage = "none";
    card.style.background = cor;
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

    salvarLink();
}

botoesFundo.forEach(botao => {
    botao.addEventListener("click", () => {
        aplicarCorFundo(botao.dataset.cor);
    });
});

corFundo.addEventListener("input", () => {
    aplicarCorFundo(corFundo.value);
});

function aplicarCorLetraFunc(cor) {
    card.style.setProperty("--primary", cor);
    corLetra.value = cor;
    valorCorLetra.textContent = cor.toUpperCase();

    botoesCorLetra.forEach(botao => {
        botao.classList.toggle(
            "ativa",
            botao.dataset.cor.toLowerCase() === cor.toLowerCase()
        );
    });

    salvarLink();
}

botoesCorLetra.forEach(botao => {
    botao.addEventListener("click", () => {
        aplicarCorLetraFunc(botao.dataset.cor);
    });
});

corLetra.addEventListener("input", () => {
    aplicarCorLetraFunc(corLetra.value);
});

function aplicarCorTopoFunc(cor) {
    card.style.setProperty("--top", cor);
    corTopo.value = cor;
    valorCorTopo.textContent = cor.toUpperCase();

    botoesCorTopo.forEach(botao => {
        botao.classList.toggle(
            "ativa",
            botao.dataset.cor.toLowerCase() === cor.toLowerCase()
        );
    });

    salvarLink();
}

botoesCorTopo.forEach(botao => {
    botao.addEventListener("click", () => {
        aplicarCorTopoFunc(botao.dataset.cor);
    });
});

corTopo.addEventListener("input", () => {
    aplicarCorTopoFunc(corTopo.value);
});

function aplicarAcessorio(nome) {
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

    salvarLink();
}

botoesAcessorio.forEach(botao => {
    botao.addEventListener("click", () => {
        aplicarAcessorio(botao.dataset.acessorio);
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
    return LZString.compressToEncodedURIComponent(
        JSON.stringify(dados)
    );
}

function descompactar(codigo) {
    try {
        const texto =
            LZString.decompressFromEncodedURIComponent(codigo);

        if (!texto) return null;

        return expandirDados(
            JSON.parse(texto)
        );
    } catch (erro) {
        console.error(erro);
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
    }, 250);
}

function carregarLink() {
    const codigo =
        window.location.hash.substring(1);

    if (!codigo) {
        inicializar();
        return;
    }

    const dados = descompactar(codigo);

    if (!dados) {
        inicializar();
        return;
    }

    Object.keys(campos).forEach(chave => {
        if (
            dados[chave] !== undefined &&
            dados[chave] !== null
        ) {
            campos[chave].value = dados[chave];
        }
    });

    fundoAtual =
        dados.fundo || "imagem";

    temaAtual =
        dados.tema || "azul";

    acessorioAtual =
        dados.acessorio || "none";

    atualizarTudo();

    if (fundoAtual === "imagem") {
        aplicarTemaInicial(
            temas[temaAtual]
                ? temaAtual
                : "azul"
        );
    } else {
        aplicarCorFundoInicial(
            dados.corFundo || "#17121f"
        );
    }

    aplicarCorLetraInicial(
        dados.corLetra || "#c88dff"
    );

    aplicarCorTopoInicial(
        dados.corTopo || "#9f63d9"
    );

    aplicarAcessorioInicial(
        acessorioAtual
    );
}

function aplicarTemaInicial(nome) {
    temaAtual = nome;
    fundoAtual = "imagem";

    document.querySelector(".card-fundo").style.backgroundImage =
        `url("${temas[nome]}")`;

    temasBotoes.forEach(botao => {
        botao.classList.toggle(
            "ativo",
            botao.dataset.tema === nome
        );
    });

    abas.forEach(aba => {
        aba.classList.toggle(
            "ativo",
            aba.dataset.fundo === "imagem"
        );
    });

    painelImagens.classList.add("ativo");
    painelCor.classList.remove("ativo");
}

function aplicarCorFundoInicial(cor) {
    fundoAtual = "cor";

    document.querySelector(".card-fundo").style.backgroundImage =
        "none";

    card.style.background = cor;
    card.style.setProperty(
        "--background",
        cor
    );

    corFundo.value = cor;
    valorCorFundo.textContent =
        cor.toUpperCase();

    abas.forEach(aba => {
        aba.classList.toggle(
            "ativo",
            aba.dataset.fundo === "cor"
        );
    });

    painelImagens.classList.remove("ativo");
    painelCor.classList.add("ativo");
}

function aplicarCorLetraInicial(cor) {
    card.style.setProperty(
        "--primary",
        cor
    );

    corLetra.value = cor;
    valorCorLetra.textContent =
        cor.toUpperCase();

    botoesCorLetra.forEach(botao => {
        botao.classList.toggle(
            "ativa",
            botao.dataset.cor.toLowerCase() === cor.toLowerCase()
        );
    });
}

function aplicarCorTopoInicial(cor) {
    card.style.setProperty(
        "--top",
        cor
    );

    corTopo.value = cor;
    valorCorTopo.textContent =
        cor.toUpperCase();

    botoesCorTopo.forEach(botao => {
        botao.classList.toggle(
            "ativa",
            botao.dataset.cor.toLowerCase() === cor.toLowerCase()
        );
    });
}

function aplicarAcessorioInicial(nome) {
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
}

function inicializar() {
    aplicarTemaInicial("azul");
    aplicarCorLetraInicial("#c88dff");
    aplicarCorTopoInicial("#9f63d9");
    aplicarCorFundoInicial("#17121f");
    aplicarAcessorioInicial("none");
    atualizarTudo();
}

function mostrarToast(texto) {
    const toast =
        document.getElementById("toast");

    toast.textContent = texto;
    toast.classList.add("mostrar");

    clearTimeout(mostrarToast.timer);

    mostrarToast.timer =
        setTimeout(() => {
            toast.classList.remove("mostrar");
        }, 2500);
}

botaoLink.addEventListener(
    "click",
    async () => {
        try {
            clearTimeout(timeoutLink);

            const dados = gerarDados();
            const codigo = compactar(dados);

            const url =
                `${window.location.origin}${window.location.pathname}#${codigo}`;

            history.replaceState(
                null,
                "",
                `#${codigo}`
            );

            await navigator.clipboard.writeText(url);

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

botaoDownload.addEventListener(
    "click",
    async () => {
        const confirmar =
            window.confirm(
                "Baixar seu card como imagem?"
            );

        if (!confirmar) return;

        botaoDownload.disabled = true;
        botaoDownload.textContent =
            "Gerando card...";

        let urlArquivo = null;

        try {
            if (
                typeof html2canvas !==
                "function"
            ) {
                throw new Error(
                    "html2canvas não carregou."
                );
            }

            if (document.fonts) {
                await document.fonts.ready;
            }

            await new Promise(resolve => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(resolve);
                });
            });

            const largura =
                card.clientWidth;

            const altura =
                card.clientHeight;

            if (!largura || !altura) {
                throw new Error(
                    "Tamanho inválido do card."
                );
            }

            const mobile =
                window.innerWidth <= 820;

            const escala =
                mobile ? 3 : 4;

            const canvas =
                await html2canvas(
                    card,
                    {
                        width: largura,
                        height: altura,
                        scale: escala,
                        useCORS: true,
                        allowTaint: false,
                        backgroundColor: null,
                        logging: false,
                        imageTimeout: 30000,
                        scrollX: 0,
                        scrollY: 0,
                        removeContainer: true,
                        foreignObjectRendering: false,
                        onclone: documento => {
                            const clone =
                                documento.getElementById(
                                    "cardGerado"
                                );

                            if (!clone) return;

                            clone.style.transform =
                                "none";

                            clone.style.filter =
                                "none";

                            clone.style.boxShadow =
                                "none";

                            clone.style.opacity =
                                "1";

                            clone.style.visibility =
                                "visible";

                            clone.querySelectorAll(
                                "*"
                            ).forEach(elemento => {
                                elemento.style.animation =
                                    "none";

                                elemento.style.transition =
                                    "none";
                            });
                        }
                    }
                );

            if (
                !canvas ||
                canvas.width <= 0 ||
                canvas.height <= 0
            ) {
                throw new Error(
                    "Canvas vazio."
                );
            }

            const blob =
                await new Promise(resolve => {
                    canvas.toBlob(
                        resolve,
                        "image/png",
                        1
                    );
                });

            if (!blob) {
                throw new Error(
                    "Não foi possível gerar o PNG."
                );
            }

            urlArquivo =
                URL.createObjectURL(blob);

            const nome =
                campos.nick.value.trim() ||
                "meu-card";

            const nomeLimpo =
                nome
                    .replace(
                        /[^a-zA-Z0-9À-ÿ\s-_]/g,
                        ""
                    )
                    .trim()
                    .replace(
                        /\s+/g,
                        "-"
                    );

            const arquivo =
                `casa-dos-mbtis-${nomeLimpo || "meu-card"}.png`;

            const link =
                document.createElement("a");

            link.href = urlArquivo;
            link.download = arquivo;

            document.body.appendChild(
                link
            );

            link.click();
            link.remove();

            mostrarToast(
                "✨ Card salvo em alta resolução!"
            );

            setTimeout(() => {
                if (urlArquivo) {
                    URL.revokeObjectURL(
                        urlArquivo
                    );

                    urlArquivo = null;
                }
            }, 2000);
        } catch (erro) {
            console.error(
                "Erro ao baixar:",
                erro
            );

            if (urlArquivo) {
                URL.revokeObjectURL(
                    urlArquivo
                );
            }

            mostrarToast(
                "😿 Não consegui baixar o card."
            );
        } finally {
            botaoDownload.disabled = false;
            botaoDownload.textContent =
                "↓ Baixar como imagem";
        }
    }
);

aplicarCoresBotoes();
carregarLink();