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

Object.values(campos).forEach((campo) => {
    campo.addEventListener("input", () => {
        atualizarCard();
        salvarNaURL();
    });

    campo.addEventListener("change", () => {
        atualizarCard();
        salvarNaURL();
    });
});

function aplicarCorTexto(cor, salvar = true) {
    card.style.setProperty("--card-primary", cor);
    colorPicker.value = cor;
    valorCor.textContent = cor.toUpperCase();

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
    const dados = {};

    Object.keys(campos).forEach((chave) => {
        dados[chave] = campos[chave].value;
    });

    dados.tipoFundo = tipoFundo;
    dados.tema = temaAtual;
    dados.cor = colorPicker.value;
    dados.corFundo = corFundo.value;

    return dados;
}

function codificarDados(dados) {
    const texto = JSON.stringify(dados);
    const bytes = new TextEncoder().encode(texto);

    let binario = "";

    bytes.forEach((byte) => {
        binario += String.fromCharCode(byte);
    });

    return btoa(binario)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
}

function decodificarDados(codigo) {
    try {
        let base64 = codigo
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        while (base64.length % 4 !== 0) {
            base64 += "=";
        }

        const binario = atob(base64);

        const bytes = Uint8Array.from(
            binario,
            (letra) => letra.charCodeAt(0)
        );

        const texto = new TextDecoder().decode(bytes);

        return JSON.parse(texto);
    } catch (erro) {
        console.warn("Não foi possível carregar o card.");
        return null;
    }
}

function salvarNaURL() {
    const dados = pegarDados();
    const codigo = codificarDados(dados);

    history.replaceState(
        null,
        "",
        `${window.location.pathname}#${codigo}`
    );
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

document
    .getElementById("copiarLink")
    .addEventListener("click", async () => {
        salvarNaURL();

        try {
            await navigator.clipboard.writeText(
                window.location.href
            );

            mostrarToast("🔗 Link do card copiado!");
        } catch (erro) {
            mostrarToast("Não foi possível copiar o link.");
        }
    });

document
    .getElementById("compartilharCard")
    .addEventListener("click", async () => {
        salvarNaURL();

        const nick =
            campos.nick.value.trim() || "meu card";

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Card de ${nick} | Casa dos MBTIs`,
                    text: "Olha meu card da Casa dos MBTIs 🏠🧠",
                    url: window.location.href
                });
            } catch (erro) {
                return;
            }
        } else {
            try {
                await navigator.clipboard.writeText(
                    window.location.href
                );

                mostrarToast("🔗 Link copiado!");
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
        botao.textContent = "Gerando card...";

        try {
            if (typeof html2canvas !== "function") {
                throw new Error(
                    "html2canvas não foi carregado. Verifique sua conexão com a internet."
                );
            }

            await document.fonts.ready;
            await prepararImagensDoCard();

            await new Promise((resolve) => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(resolve);
                });
            });

            const canvas = await html2canvas(
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
                }
            );

            const link = document.createElement("a");

            const nick =
                campos.nick.value.trim() || "meu-card";

            const nomeArquivo =
                nick
                    .replace(
                        /[^a-zA-Z0-9À-ÿ\s-_]/g,
                        ""
                    )
                    .trim()
                    .replace(/\s+/g, "-");

            link.download =
                `casa-dos-mbtis-${nomeArquivo || "meu-card"}.png`;

            link.href =
                canvas.toDataURL("image/png");

            document.body.appendChild(link);
            link.click();
            link.remove();

            mostrarToast("✨ Card baixado!");
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