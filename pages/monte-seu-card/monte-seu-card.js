const campos = {
    nick: document.getElementById("nick"),
    mbti: document.getElementById("mbti"),
    eneagrama: document.getElementById("eneagrama"),
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
    subtipo: document.getElementById("cardSubtipo"),
    stacking: document.getElementById("cardStacking"),
    temperamento: document.getElementById("cardTemperamento"),
    tritype: document.getElementById("cardTritype"),
    socionics: document.getElementById("cardSocionics"),
    instintos: document.getElementById("cardInstintos"),
    bigfive: document.getElementById("cardBigfive")
};

const card = document.getElementById("cardGerado");
const colorPicker = document.getElementById("cor");
const corFundo = document.getElementById("corFundo");
const valorCor = document.getElementById("valorCor");
const valorCorFundo = document.getElementById("valorCorFundo");

const botoesCor = document.querySelectorAll(".cor-opcao");
const botoesFundo = document.querySelectorAll(".fundo-opcao");
const botoesTema = document.querySelectorAll(".tema");
const botoesTipoFundo = document.querySelectorAll(".tipo-fundo-btn");

const fundoImagens = document.getElementById("fundoImagens");
const fundoCor = document.getElementById("fundoCor");

let tipoFundo = "imagem";
let temaAtual = "azul";
let timeoutURL = null;

const valoresPadrao = {
    nick: "Seu Nick",
    mbti: "ENTP",
    eneagrama: "7w6",
    subtipo: "sp7",
    stacking: "sp/so",
    temperamento: "Sanguíneo",
    tritype: "739",
    socionics: "ILE",
    instintos: "sp/so",
    bigfive: "SCOEI"
};

const temas = {
    azul: {
        imagem: "img/azul.jpg"
    },
    azul2: {
        imagem: "img/azul2.jpg"
    },
    estrelado: {
        imagem: "img/estrelado.jpg"
    },
    preto: {
        imagem: "img/preto.jpg"
    },
    preto2: {
        imagem: "img/preto2.jpg"
    },
    rosa: {
        imagem: "img/rosa.jpg"
    },
    roxo: {
        imagem: "img/roxo.jpg"
    },
    verde: {
        imagem: "img/verde.jpg"
    },
    Giorno: {
        imagem: "img/giorno.jpg"
    },
    "noite azulado": {
        imagem: "img/noite azulada.jpg"
    },
    DIO: {
        imagem: "img/dio.jpg"
    },
    anime: {
        imagem: "img/anime.jpg"
    },
    gojo: {
        imagem: "img/gojo.jpg"
    },
    zoro: {
        imagem: "img/zoro.jpg"
    },
    alucard: {
        imagem: "img/alucard.jpg"
    },
    Saiki: {
        imagem: "img/Saiki.jpg"
    },
    "Johnny-Joestar": {
        imagem: "img/Johnny-Joestar.jpg"
    },
    reze: {
        imagem: "img/reze.jpg"
    }
};

function atualizarCard() {
    Object.keys(campos).forEach((chave) => {
        const valor = campos[chave].value.trim();

        elementosCard[chave].textContent =
            valor || valoresPadrao[chave];
    });
}

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

function aplicarCorTexto(cor, salvar = true) {
    if (!cor) {
        return;
    }

    card.style.setProperty("--card-primary", cor);

    try {
        colorPicker.value = cor;
    } catch (erro) {
        console.warn("Não foi possível atualizar o seletor de cor.");
    }

    if (valorCor) {
        valorCor.textContent = cor.toUpperCase();
    }

    botoesCor.forEach((botao) => {
        botao.classList.toggle(
            "ativa",
            botao.dataset.color.toLowerCase() === cor.toLowerCase()
        );
    });

    if (salvar) {
        salvarNaURL();
    }
}

botoesCor.forEach((botao) => {
    botao.addEventListener("click", () => {
        aplicarCorTexto(botao.dataset.color);
    });
});

colorPicker.addEventListener("input", () => {
    aplicarCorTexto(colorPicker.value);
});

function aplicarCorFundo(cor, salvar = true) {
    if (!cor) {
        return;
    }

    tipoFundo = "cor";

    card.style.backgroundImage = "none";
    card.style.backgroundColor = cor;
    card.style.setProperty("--card-background", cor);

    try {
        corFundo.value = cor;
    } catch (erro) {
        console.warn("Não foi possível atualizar o seletor do fundo.");
    }

    if (valorCorFundo) {
        valorCorFundo.textContent = cor.toUpperCase();
    }

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

function aplicarTema(nomeTema, salvar = true) {
    const tema = temas[nomeTema];

    if (!tema) {
        console.error("Tema não encontrado:", nomeTema);
        return;
    }

    temaAtual = nomeTema;
    tipoFundo = "imagem";

    card.style.backgroundColor = "transparent";
    card.style.backgroundImage = `url("${tema.imagem}")`;
    card.style.backgroundSize = "cover";
    card.style.backgroundPosition = "center";
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
            tipoFundo = "imagem";
            aplicarTema(temaAtual);
            return;
        }

        if (tipo === "cor") {
            tipoFundo = "cor";
            aplicarCorFundo(corFundo.value);
        }
    });
});

function pegarDados() {
    return {
        nick: campos.nick.value.trim(),
        mbti: campos.mbti.value.trim(),
        eneagrama: campos.eneagrama.value.trim(),
        subtipo: campos.subtipo.value.trim(),
        stacking: campos.stacking.value.trim(),
        temperamento: campos.temperamento.value.trim(),
        tritype: campos.tritype.value.trim(),
        socionics: campos.socionics.value.trim(),
        instintos: campos.instintos.value.trim(),
        bigfive: campos.bigfive.value.trim(),
        tipoFundo,
        tema: temaAtual,
        cor: colorPicker.value,
        corFundo: corFundo.value
    };
}

function codificarDados(dados) {
    if (typeof LZString === "undefined") {
        throw new Error("LZString não foi carregado.");
    }

    const texto = JSON.stringify(dados);

    return LZString.compressToEncodedURIComponent(texto);
}

function decodificarDados(codigo) {
    if (typeof LZString === "undefined") {
        console.error("LZString não foi carregado.");
        return null;
    }

    try {
        const texto =
            LZString.decompressFromEncodedURIComponent(codigo);

        if (!texto) {
            return null;
        }

        return JSON.parse(texto);
    } catch (erro) {
        console.warn(
            "Não foi possível carregar os dados do card:",
            erro
        );

        return null;
    }
}

function salvarNaURL() {
    try {
        const dados = pegarDados();
        const codigo = codificarDados(dados);

        history.replaceState(
            null,
            "",
            `${window.location.pathname}#${codigo}`
        );
    } catch (erro) {
        console.error(
            "Erro ao salvar o card na URL:",
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

function mostrarToast(mensagem) {
    const toast = document.getElementById("toast");

    toast.textContent = mensagem;
    toast.classList.add("mostrar");

    setTimeout(() => {
        toast.classList.remove("mostrar");
    }, 2200);
}

async function carregarDaURL() {
    const dados = carregarDadosDaURL();

    if (!dados) {
        atualizarCard();
        aplicarCorTexto("#8c52e8", false);
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

    if (tipoFundo === "imagem") {
        if (temas[temaAtual]) {
            aplicarTema(
                temaAtual,
                false
            );
        } else {
            aplicarTema(
                "azul",
                false
            );
        }
    } else {
        aplicarCorFundo(
            dados.corFundo || "#d9ccd9",
            false
        );
    }

    atualizarTipoFundoVisual();
    atualizarCard();
}

document
    .getElementById("copiarLink")
    .addEventListener("click", async () => {
        salvarNaURL();

        try {
            await navigator.clipboard.writeText(
                window.location.href
            );

            mostrarToast(
                "🔗 Link do card copiado!"
            );
        } catch (erro) {
            mostrarToast(
                "Não foi possível copiar o link."
            );
        }
    });

document
    .getElementById("compartilharCard")
    .addEventListener("click", async () => {
        salvarNaURL();

        const nick =
            campos.nick.value.trim() ||
            "meu card";

        if (navigator.share) {
            try {
                await navigator.share({
                    title:
                        `Card de ${nick} | Casa dos MBTIs`,
                    text:
                        "Olha meu card da Casa dos MBTIs 🏠🧠",
                    url:
                        window.location.href
                });
            } catch (erro) {
                return;
            }
        } else {
            try {
                await navigator.clipboard.writeText(
                    window.location.href
                );

                mostrarToast(
                    "🔗 Link copiado!"
                );
            } catch (erro) {
                mostrarToast(
                    "Copie o link da barra do navegador."
                );
            }
        }
    });

document
    .getElementById("baixarCard")
    .addEventListener("click", async () => {
        const botao =
            document.getElementById("baixarCard");

        botao.disabled = true;
        botao.textContent =
            "Gerando card...";

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

            const canvas =
                await html2canvas(
                    card,
                    {
                        scale: 2,
                        useCORS: true,
                        allowTaint: false,
                        backgroundColor: null,
                        logging: false,
                        imageTimeout: 20000,
                        removeContainer: true,
                        onclone: (documento) => {
                            const cardClone =
                                documento.getElementById(
                                    "cardGerado"
                                );

                            if (!cardClone) {
                                return;
                            }

                            cardClone.style.transform =
                                "none";

                            cardClone.style.filter =
                                "none";

                            cardClone.style.boxShadow =
                                "none";

                            const elementos =
                                cardClone.querySelectorAll(
                                    "*"
                                );

                            elementos.forEach(
                                (elemento) => {
                                    elemento.style.animation =
                                        "none";

                                    elemento.style.transition =
                                        "none";
                                }
                            );
                        }
                    }
                );

            const link =
                document.createElement("a");

            const nick =
                campos.nick.value.trim() ||
                "meu-card";

            const nomeArquivo =
                nick
                    .replace(
                        /[^a-zA-Z0-9À-ÿ\s-_]/g,
                        ""
                    )
                    .trim()
                    .replace(
                        /\s+/g,
                        "-"
                    );

            link.download =
                `casa-dos-mbtis-${nomeArquivo || "meu-card"}.png`;

            link.href =
                canvas.toDataURL(
                    "image/png"
                );

            document.body.appendChild(
                link
            );

            link.click();
            link.remove();

            mostrarToast(
                "✨ Card baixado!"
            );
        } catch (erro) {
            console.error(
                "ERRO AO GERAR O CARD:",
                erro
            );

            mostrarToast(
                "😿 Não consegui gerar a imagem."
            );
        } finally {
            botao.disabled = false;

            botao.textContent =
                "↓ Baixar como imagem";
        }
    });

carregarDaURL();