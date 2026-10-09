const perguntas = [
    // NARCISISMO
    {
        categoria: "Narcisismo e validação",
        tipo: "narcisismo",
        peso: 70,
        texto: "Você sente necessidade de ser reconhecido pelas suas qualidades?"
    },
    {
        categoria: "Narcisismo e validação",
        tipo: "narcisismo",
        peso: 85,
        texto: "Você fica muito incomodado quando alguém não reconhece seu mérito?"
    },
    {
        categoria: "Narcisismo e validação",
        tipo: "narcisismo",
        peso: 80,
        texto: "Você acredita que, em determinadas situações, merece um tratamento especial?"
    },
    {
        categoria: "Narcisismo e validação",
        tipo: "narcisismo",
        peso: 90,
        texto: "Você tem dificuldade em admitir que alguém pode ser melhor do que você em algo?"
    },

    // BAIXA AUTOESTIMA
    {
        categoria: "Autoestima e insegurança",
        tipo: "autoestima",
        peso: 90,
        texto: "Você costuma sentir que não é bom o suficiente, mesmo quando se esforça?"
    },
    {
        categoria: "Autoestima e insegurança",
        tipo: "autoestima",
        peso: 90,
        texto: "Você se compara frequentemente com outras pessoas e se sente inferior?"
    },
    {
        categoria: "Autoestima e insegurança",
        tipo: "autoestima",
        peso: 75,
        texto: "Você precisa que outras pessoas confirmem que você é capaz ou interessante?"
    },
    {
        categoria: "Autoestima e insegurança",
        tipo: "autoestima",
        peso: 85,
        texto: "Você interpreta críticas como prova de que fracassou ou não tem valor?"
    },

    // DEPENDÊNCIA EMOCIONAL
    {
        categoria: "Dependência emocional",
        tipo: "dependencia",
        peso: 90,
        texto: "Você sente muito medo de ser abandonado por alguém importante?"
    },
    {
        categoria: "Dependência emocional",
        tipo: "dependencia",
        peso: 95,
        texto: "Você continua em uma relação que lhe faz mal por medo de ficar sozinho?"
    },
    {
        categoria: "Dependência emocional",
        tipo: "dependencia",
        peso: 80,
        texto: "Você precisa de demonstrações frequentes de afeto para se sentir seguro em uma relação?"
    },
    {
        categoria: "Dependência emocional",
        tipo: "dependencia",
        peso: 90,
        texto: "Você sente que perde parte de quem é quando alguém importante se afasta?"
    },

    // CONTROLE E DESCONFIANÇA
    {
        categoria: "Controle e desconfiança",
        tipo: "controle",
        peso: 75,
        texto: "Você fica ansioso quando não consegue prever o que vai acontecer?"
    },
    {
        categoria: "Controle e desconfiança",
        tipo: "controle",
        peso: 85,
        texto: "Você tem dificuldade em confiar nas intenções das pessoas, mesmo sem provas concretas?"
    },
    {
        categoria: "Controle e desconfiança",
        tipo: "controle",
        peso: 80,
        texto: "Você tenta controlar situações ou decisões para evitar que algo dê errado?"
    },
    {
        categoria: "Controle e desconfiança",
        tipo: "controle",
        peso: 80,
        texto: "Você sente ciúmes ou desconfiança quando alguém próximo dá atenção a outras pessoas?"
    },

    // REPRESSÃO EMOCIONAL
    {
        categoria: "Repressão emocional",
        tipo: "repressao",
        peso: 85,
        texto: "Você esconde o que sente para não parecer vulnerável?"
    },
    {
        categoria: "Repressão emocional",
        tipo: "repressao",
        peso: 80,
        texto: "Você tem dificuldade em pedir ajuda, mesmo quando precisa?"
    },
    {
        categoria: "Repressão emocional",
        tipo: "repressao",
        peso: 75,
        texto: "Você prefere se afastar a admitir que alguém conseguiu machucá-lo emocionalmente?"
    },
    {
        categoria: "Repressão emocional",
        tipo: "repressao",
        peso: 85,
        texto: "Você costuma agir como se nada o afetasse, mesmo quando está sofrendo?"
    },

    // PERFECCIONISMO E APROVAÇÃO
    {
        categoria: "Perfeccionismo e aprovação",
        tipo: "perfeccionismo",
        peso: 90,
        texto: "Você sente que precisa fazer tudo perfeitamente para se considerar competente?"
    },
    {
        categoria: "Perfeccionismo e aprovação",
        tipo: "perfeccionismo",
        peso: 85,
        texto: "Você fica remoendo erros pequenos por muito tempo?"
    },
    {
        categoria: "Perfeccionismo e aprovação",
        tipo: "perfeccionismo",
        peso: 80,
        texto: "Você tem dificuldade em dizer não por medo de decepcionar alguém?"
    },
    {
        categoria: "Perfeccionismo e aprovação",
        tipo: "perfeccionismo",
        peso: 85,
        texto: "Você muda seu comportamento para ser aceito por pessoas de quem deseja aprovação?"
    }
];

const categorias = [
    {
        id: "narcisismo",
        nome: "Narcisismo e validação",
        descricao: "Busca por reconhecimento, validação e valorização pessoal."
    },
    {
        id: "autoestima",
        nome: "Baixa autoestima e insegurança",
        descricao: "Autocrítica, comparação e dúvidas sobre o próprio valor."
    },
    {
        id: "dependencia",
        nome: "Dependência emocional",
        descricao: "Medo de abandono e necessidade de segurança afetiva."
    },
    {
        id: "controle",
        nome: "Necessidade de controle e desconfiança",
        descricao: "Busca por previsibilidade, controle e segurança nas relações."
    },
    {
        id: "repressao",
        nome: "Repressão emocional",
        descricao: "Tendência a esconder sentimentos e evitar vulnerabilidade."
    },
    {
        id: "perfeccionismo",
        nome: "Perfeccionismo e necessidade de aprovação",
        descricao: "Autocobrança e preocupação com erros e aceitação."
    }
];

const inicio = document.getElementById("inicio");
const areaQuiz = document.getElementById("areaQuiz");
const resultado = document.getElementById("resultado");

const botaoComecar = document.getElementById("comecar");
const botaoVoltar = document.getElementById("voltar");
const botaoProxima = document.getElementById("proxima");
const botaoRefazer = document.getElementById("refazer");
const botaoBaixar = document.getElementById("baixar");

const elementoCategoria = document.getElementById("categoria");
const elementoPergunta = document.getElementById("pergunta");
const elementoOpcoes = document.getElementById("opcoes");
const elementoContador = document.getElementById("contador");
const elementoPorcentagem = document.getElementById("porcentagem");
const elementoProgresso = document.getElementById("progresso");

let indice = 0;
let respostas = new Array(perguntas.length).fill(null);
let pontuacoesFinais = [];
let dadosGrafico = [];

function comecarQuiz() {
    indice = 0;
    respostas = new Array(perguntas.length).fill(null);

    inicio.classList.add("escondido");
    resultado.classList.add("escondido");
    areaQuiz.classList.remove("escondido");

    renderizarPergunta();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderizarPergunta() {
    const perguntaAtual = perguntas[indice];
    const numeroAtual = indice + 1;
    const progresso = (numeroAtual / perguntas.length) * 100;

    elementoContador.textContent =
        `PERGUNTA ${numeroAtual} DE ${perguntas.length}`;

    elementoPorcentagem.textContent = `${Math.round(progresso)}%`;
    elementoProgresso.style.width = `${progresso}%`;

    elementoCategoria.textContent = perguntaAtual.categoria;
    elementoPergunta.textContent = perguntaAtual.texto;

    elementoOpcoes.querySelectorAll(".opcao").forEach(botao => {
        botao.classList.toggle(
            "selecionada",
            botao.dataset.resposta === respostas[indice]
        );
    });

    botaoVoltar.disabled = indice === 0;

    botaoProxima.disabled = respostas[indice] === null;

    botaoProxima.textContent =
        indice === perguntas.length - 1 ? "Ver resultado" : "Próxima";
}

elementoOpcoes.addEventListener("click", evento => {
    const botao = evento.target.closest(".opcao");

    if (!botao) return;

    respostas[indice] = botao.dataset.resposta;
    renderizarPergunta();
});

botaoComecar.addEventListener("click", comecarQuiz);

botaoVoltar.addEventListener("click", () => {
    if (indice > 0) {
        indice--;
        renderizarPergunta();
    }
});

botaoProxima.addEventListener("click", () => {
    if (respostas[indice] === null) return;

    if (indice < perguntas.length - 1) {
        indice++;
        renderizarPergunta();
    } else {
        mostrarResultado();
    }
});

// Calcula uma pontuação independente para cada categoria.
function calcularPontuacoes() {
    return categorias.map(categoria => {
        const perguntasCategoria = perguntas
            .map((pergunta, i) => ({ ...pergunta, resposta: respostas[i] }))
            .filter(pergunta => pergunta.tipo === categoria.id);

        let total = 0;

        perguntasCategoria.forEach(pergunta => {
            if (pergunta.resposta === "sim") {
                total += pergunta.peso;
            } else if (pergunta.resposta === "nao") {
                total += 100 - pergunta.peso;
            } else {
                total += 50;
            }
        });

        const media = total / perguntasCategoria.length;

        return {
            ...categoria,
            pontuacao: Math.round(media)
        };
    });
}

function descreverPontuacao(valor) {
    if (valor < 25) {
        return "Baixa presença relativa neste questionário";
    }

    if (valor < 45) {
        return "Presença relativamente baixa";
    }

    if (valor < 60) {
        return "Presença intermediária";
    }

    if (valor < 80) {
        return "Presença relativamente elevada";
    }

    return "Presença elevada neste questionário";
}

function mostrarResultado() {
    pontuacoesFinais = calcularPontuacoes();

    const ordenadas = [...pontuacoesFinais].sort(
        (a, b) => b.pontuacao - a.pontuacao
    );

    const maior = ordenadas[0];

    document.getElementById("tituloResultado").textContent =
        "Sua tendência predominante";

    document.getElementById("descricaoResultado").textContent =
        `${maior.nome}: ${maior.pontuacao}/100. ` +
        `${maior.descricao} Este é o traço com a maior pontuação entre ` +
        `as seis categorias avaliadas, não um diagnóstico psicológico.`;

    renderizarPontuacoes(pontuacoesFinais);

    dadosGrafico = pontuacoesFinais.map(item => ({
        nome: item.nome,
        valor: item.pontuacao
    }));

    resultado.classList.remove("escondido");
    areaQuiz.classList.add("escondido");

    // Espera o resultado aparecer antes de medir e desenhar o gráfico.
    requestAnimationFrame(() => {
        desenharGraficoRadar();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

function renderizarPontuacoes(pontuacoes) {
    const lista = document.getElementById("listaPontuacoes");
    lista.replaceChildren();

    pontuacoes.forEach(item => {
        const linha = document.createElement("div");
        linha.className = "pontuacao-item";

        const cabecalho = document.createElement("div");
        cabecalho.className = "pontuacao-cabecalho";

        const nome = document.createElement("span");
        nome.textContent = item.nome;

        const valor = document.createElement("span");
        valor.className = "valor-pontuacao";
        valor.textContent = `${item.pontuacao}/100`;

        cabecalho.append(nome, valor);

        const fundo = document.createElement("div");
        fundo.className = "barra-fundo";

        const barra = document.createElement("div");
        barra.className = "barra-valor";
        barra.style.width = `${item.pontuacao}%`;

        fundo.appendChild(barra);
        linha.append(cabecalho, fundo);
        lista.appendChild(linha);
    });
}

// Desenha o gráfico radar sem bibliotecas externas.
function desenharGraficoRadar() {
    const canvas = document.getElementById("graficoRadar");
    const contexto = canvas.getContext("2d");

    const larguraCSS = canvas.parentElement.clientWidth - 16;
    const largura = Math.max(280, Math.min(larguraCSS, 560));
    const altura = Math.round(largura * 0.94);
    const proporcao = window.devicePixelRatio || 1;

    canvas.width = largura * proporcao;
    canvas.height = altura * proporcao;
    canvas.style.width = `${largura}px`;
    canvas.style.height = `${altura}px`;

    contexto.setTransform(proporcao, 0, 0, proporcao, 0, 0);
    contexto.clearRect(0, 0, largura, altura);

    const centroX = largura / 2;
    const centroY = altura / 2;
    const raio = Math.min(largura * 0.30, altura * 0.31);
    const quantidade = dadosGrafico.length;

    const nomesCurtos = [
        ["Narcisismo", "e validação"],
        ["Baixa autoestima", "e insegurança"],
        ["Dependência", "emocional"],
        ["Controle e", "desconfiança"],
        ["Repressão", "emocional"],
        ["Perfeccionismo", "e aprovação"]
    ];

    function pontoNoEixo(indiceEixo, valor) {
        const angulo = -Math.PI / 2 + (2 * Math.PI * indiceEixo) / quantidade;
        const distancia = raio * valor;

        return {
            x: centroX + Math.cos(angulo) * distancia,
            y: centroY + Math.sin(angulo) * distancia
        };
    }

    // Anéis da escala: 20, 40, 60, 80 e 100.
    contexto.lineWidth = 1;
    contexto.strokeStyle = "rgba(181, 135, 214, 0.22)";

    for (let nivel = 1; nivel <= 5; nivel++) {
        contexto.beginPath();

        for (let i = 0; i < quantidade; i++) {
            const ponto = pontoNoEixo(i, nivel / 5);

            if (i === 0) {
                contexto.moveTo(ponto.x, ponto.y);
            } else {
                contexto.lineTo(ponto.x, ponto.y);
            }
        }

        contexto.closePath();
        contexto.stroke();
    }

    // Linhas que partem do centro para cada característica.
    for (let i = 0; i < quantidade; i++) {
        const ponto = pontoNoEixo(i, 1);

        contexto.beginPath();
        contexto.moveTo(centroX, centroY);
        contexto.lineTo(ponto.x, ponto.y);
        contexto.stroke();
    }

    // Forma criada pelas seis pontuações.
    contexto.beginPath();

    dadosGrafico.forEach((item, i) => {
        const ponto = pontoNoEixo(i, item.valor / 100);

        if (i === 0) {
            contexto.moveTo(ponto.x, ponto.y);
        } else {
            contexto.lineTo(ponto.x, ponto.y);
        }
    });

    contexto.closePath();
    contexto.fillStyle = "rgba(155, 105, 214, 0.28)";
    contexto.fill();

    contexto.strokeStyle = "#b68be5";
    contexto.lineWidth = 2.5;
    contexto.stroke();

    // Pontos em cada eixo.
    dadosGrafico.forEach((item, i) => {
        const ponto = pontoNoEixo(i, item.valor / 100);

        contexto.beginPath();
        contexto.arc(ponto.x, ponto.y, 4, 0, Math.PI * 2);
        contexto.fillStyle = "#d7b878";
        contexto.fill();
    });

    // Rótulos das características.
    contexto.fillStyle = "#eee8f2";
    contexto.font = `600 ${largura < 380 ? 10 : 11}px Inter, sans-serif`;

    nomesCurtos.forEach((linhas, i) => {
        const ponto = pontoNoEixo(i, 1.24);
        const angulo = -Math.PI / 2 + (2 * Math.PI * i) / quantidade;
        const cos = Math.cos(angulo);

        contexto.textAlign =
            cos > 0.3 ? "left" : cos < -0.3 ? "right" : "center";

        contexto.textBaseline =
            Math.sin(angulo) > 0.5
                ? "top"
                : Math.sin(angulo) < -0.5
                    ? "bottom"
                    : "middle";

        linhas.forEach((linha, j) => {
            const deslocamento = (j - (linhas.length - 1) / 2) * 13;

            contexto.fillText(
                linha,
                ponto.x,
                ponto.y + deslocamento
            );
        });
    });

    // Título dentro da imagem exportada.
    contexto.textAlign = "center";
    contexto.textBaseline = "middle";
    contexto.fillStyle = "#d7b878";
    contexto.font = `600 ${largura < 380 ? 10 : 12}px Inter, sans-serif`;
    contexto.fillText(
        "SOMBRAS DA MENTE",
        centroX,
        altura - 13
    );
}

botaoBaixar.addEventListener("click", () => {
    const canvas = document.getElementById("graficoRadar");
    const link = document.createElement("a");

    link.download = "sombras-da-mente-grafico.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
});

botaoRefazer.addEventListener("click", comecarQuiz);

// Redesenha o gráfico se a largura da tela mudar.
window.addEventListener("resize", () => {
    if (!resultado.classList.contains("escondido") && dadosGrafico.length) {
        desenharGraficoRadar();
    }
});
