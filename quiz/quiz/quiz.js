
const perguntas = [
    "Você prejudicaria uma pessoa inocente para proteger alguém que ama?",
    "Se pudesse conseguir tudo o que deseja manipulando alguém, faria isso?",
    "Você perdoaria alguém que nunca demonstrou arrependimento?",
    "Se ninguém descobrisse que você fez algo cruel, ainda se sentiria culpado?",
    "Você sacrificaria seus próprios interesses para ajudar um desconhecido?",
    "Se pudesse se vingar de alguém que te machucou sem sofrer consequências, faria isso?",
    "Você mentiria para alguém que confia em você se isso trouxesse uma grande vantagem?",
    "Se precisasse escolher entre salvar alguém que ama ou várias pessoas desconhecidas, você aceitaria sacrificar a pessoa amada para salvar as outras?",
    "Você ajudaria alguém de quem não gosta se essa pessoa estivesse em uma situação desesperadora?",
    "Você abandonaria alguém que depende de você se essa pessoa se tornasse um obstáculo para seus objetivos?",
    "Se uma pessoa inocente fosse culpada por um erro seu, deixaria que ela pagasse pelo que aconteceu?",
    "Você sentiria satisfação ao ver alguém que te humilhou fracassar?",
    "Você contaria uma verdade dolorosa mesmo sabendo que ela machucaria profundamente alguém?",
    "Se pudesse destruir a reputação de um rival para conseguir algo que deseja muito, faria isso?",
    "Você continuaria ajudando alguém mesmo sabendo que essa pessoa nunca poderia retribuir?",
    "Se tivesse poder absoluto e ninguém pudesse te punir, continuaria seguindo seus princípios morais?",
    "Você faria algo cruel para impedir que alguém ainda mais cruel conseguisse o que deseja?",
    "Você acredita que uma boa intenção pode justificar uma atitude cruel?",
    "Se pudesse controlar as decisões de alguém para impedir que essa pessoa arruinasse a própria vida, faria isso sem consentimento?",
    "Você abriria mão dos seus princípios morais para garantir sua própria felicidade?"
];

const niveis = [
    {
        nome: "LUZ ABSOLUTA",
        descricao: "A empatia e a compaixão orientam suas escolhas. Você tende a considerar o bem-estar alheio, mesmo quando ajudar exige abrir mão de algo pessoal.",
        frase: "A bondade também é uma escolha diante da escuridão.",
        imagem: "./luz-absoluta.jpg",
        cor: "#f0d18a"
    },
    {
        nome: "BONDADE ELEVADA",
        descricao: "Você valoriza a justiça, a lealdade e o respeito. Procura fazer o que considera certo, embora reconheça que nem toda situação oferece uma solução perfeita.",
        frase: "Fazer o certo nem sempre é o caminho mais fácil.",
        imagem: "./bondade-elevada.jpg",
        cor: "#d6b76f"
    },
    {
        nome: "MORALIDADE CINZENTA",
        descricao: "Suas escolhas dependem das circunstâncias. Você pondera interesses, consequências e princípios, sem acreditar que todas as situações possam ser divididas entre certo e errado.",
        frase: "Entre a luz e a sombra, existem escolhas.",
        imagem: "./moralidade-cinzenta.jpg",
        cor: "#b59ad9"
    },
    {
        nome: "MALDADE CALCULADA",
        descricao: "Você demonstra disposição para priorizar seus objetivos e aceitar decisões moralmente difíceis. Em certas circunstâncias, os resultados podem pesar mais que os meios utilizados.",
        frase: "Toda escolha tem um preço. Você decide qual pagar.",
        imagem: "./maldade-calculada.jpg",
        cor: "#d58baf"
    },
    {
        nome: "MALDADE ABSOLUTA",
        descricao: "Neste quiz, suas respostas indicam maior disposição para priorizar os próprios desejos, mesmo diante de possíveis prejuízos para outras pessoas. Isso não define quem você é fora do teste.",
        frase: "A sombra revela possibilidades, não um destino.",
        imagem: "./maldade-absoluta.jpg",
        cor: "#e45b78"
    }
];

/*
 * Peso de cada pergunta:
 * 0 = "sim" indica menos maldade.
 * 100 = "sim" indica mais maldade.
 * 50 = a resposta não favorece nenhum extremo.
 * null = a pergunta não influencia a pontuação.
 *
 * "Não" recebe o peso inverso.
 * "Depende" vale 50 nas perguntas pontuadas.
 */
const pesosMaldade = [
    100,  // 1. Prejudicar um inocente para proteger alguém amado
    100,  // 2. Manipular alguém para obter vantagem
    null, // 3. Perdoar alguém sem arrependimento: não pontua
    0,    // 4. Sentir culpa por uma crueldade
    0,    // 5. Sacrificar interesses para ajudar um desconhecido
    100,  // 6. Vingar-se sem consequências
    100,  // 7. Mentir para obter vantagem
    0,    // 8. Sacrificar uma pessoa para salvar várias
    0,    // 9. Ajudar alguém de quem não gosta
    100,  // 10. Abandonar alguém dependente
    100,  // 11. Deixar um inocente pagar por seu erro
    100,  // 12. Sentir satisfação com o fracasso de alguém
    0,    // 13. Contar uma verdade dolorosa
    100,  // 14. Destruir a reputação de um rival
    0,    // 15. Ajudar sem receber algo em troca
    0,    // 16. Manter os princípios com poder absoluto
    50,   // 17. Fazer algo cruel para impedir algo pior
    50,   // 18. Uma boa intenção justificar crueldade
    100,  // 19. Controlar alguém sem consentimento
    100   // 20. Abandonar princípios pela própria felicidade
];

// Elementos do HTML
const inicio = document.getElementById("inicio");
const areaQuiz = document.getElementById("areaQuiz");
const resultado = document.getElementById("resultado");
const perguntaEl = document.getElementById("pergunta");
const opcoesEl = document.getElementById("opcoes");
const contador = document.getElementById("contador");
const porcentagem = document.getElementById("porcentagem");
const progresso = document.getElementById("progresso");
const voltar = document.getElementById("voltar");
const proxima = document.getElementById("proxima");

let indice = 0;
let respostas = Array(perguntas.length).fill(null);

// Iniciar o quiz
document.getElementById("comecar").addEventListener("click", () => {
    indice = 0;
    respostas = Array(perguntas.length).fill(null);

    inicio.classList.add("escondido");
    resultado.classList.add("escondido");
    areaQuiz.classList.remove("escondido");

    renderizarPergunta();
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// Mostrar a pergunta atual
function renderizarPergunta() {
    perguntaEl.textContent = perguntas[indice];

    const numero = indice + 1;
    const percentual = Math.round((numero / perguntas.length) * 100);

    contador.textContent = `PERGUNTA ${numero} DE ${perguntas.length}`;
    porcentagem.textContent = `${percentual}%`;
    progresso.style.width = `${percentual}%`;

    voltar.disabled = indice === 0;
    voltar.style.opacity = indice === 0 ? ".35" : "1";

    opcoesEl.querySelectorAll(".opcao").forEach(botao => {
        botao.classList.toggle(
            "selecionada",
            respostas[indice] === botao.dataset.resposta
        );
    });

    proxima.disabled = respostas[indice] === null;
    proxima.textContent = indice === perguntas.length - 1
        ? "VER RESULTADO ✦"
        : "PRÓXIMA →";
}

// Selecionar resposta
opcoesEl.addEventListener("click", event => {
    const botao = event.target.closest(".opcao");

    if (!botao) return;

    respostas[indice] = botao.dataset.resposta;

    opcoesEl.querySelectorAll(".opcao").forEach(opcao => {
        opcao.classList.toggle("selecionada", opcao === botao);
    });

    proxima.disabled = false;
});

// Avançar
proxima.addEventListener("click", () => {
    if (respostas[indice] === null) return;

    if (indice < perguntas.length - 1) {
        indice++;
        renderizarPergunta();
        return;
    }

    mostrarResultado();
});

// Voltar
voltar.addEventListener("click", () => {
    if (indice === 0) return;

    indice--;
    renderizarPergunta();
});

// Calcular a pontuação
function calcularPontuacao() {
    let total = 0;
    let quantidade = 0;

    respostas.forEach((resposta, i) => {
        const peso = pesosMaldade[i];

        // A pergunta sobre perdão não entra na média.
        if (peso === null || resposta === null) return;

        if (resposta === "sim") {
            total += peso;
        } else if (resposta === "nao") {
            total += 100 - peso;
        } else if (resposta === "depende") {
            total += 50;
        } else {
            return;
        }

        quantidade++;
    });

    if (quantidade === 0) return 50;

    return Math.round(total / quantidade);
}

// Selecionar um dos cinco níveis
function obterNivel(pontos) {
    if (pontos < 20) return 0;
    if (pontos < 40) return 1;
    if (pontos < 60) return 2;
    if (pontos < 80) return 3;
    return 4;
}

// Exibir resultado
function mostrarResultado() {
    const pontos = calcularPontuacao();
    const indiceNivel = obterNivel(pontos);
    const nivel = niveis[indiceNivel];

    areaQuiz.classList.add("escondido");
    resultado.classList.remove("escondido");

    document.getElementById("nomeNivel").textContent = nivel.nome;
    document.getElementById("descricaoNivel").textContent = nivel.descricao;
    document.getElementById("fraseNivel").textContent = `“${nivel.frase}”`;

    document.getElementById("cardNumero").textContent =
        `NÍVEL ${String(indiceNivel + 1).padStart(2, "0")}`;

    document.getElementById("pontos").textContent = `${pontos}/100`;

    const marcador = document.getElementById("marcador");
    marcador.style.left = `${pontos}%`;

    const img = document.getElementById("imagemNivel");
    const fallback = document.getElementById("imagemFallback");

    fallback.classList.add("escondido");
    img.classList.remove("escondido");

    img.alt = `Ilustração: ${nivel.nome}`;
    img.onerror = () => {
        img.classList.add("escondido");
        fallback.classList.remove("escondido");
        fallback.textContent = ["☼", "✧", "◈", "♜", "☾"][indiceNivel];
    };

    img.src = nivel.imagem;

    document.getElementById("nomeNivel").style.color = nivel.cor;
    document.getElementById("cardNumero").style.color = nivel.cor;
    document.getElementById("mensagem").textContent = "";

    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Baixar o resultado como imagem PNG
document.getElementById("baixar").addEventListener("click", async () => {
    const mensagem = document.getElementById("mensagem");
    const botao = document.getElementById("baixar");

    if (typeof html2canvas !== "function") {
        mensagem.textContent =
            "Não foi possível carregar o gerador de imagem. Verifique sua conexão.";
        return;
    }

    botao.disabled = true;
    mensagem.textContent = "Preparando sua imagem...";

    try {
        const cartao = document.getElementById("cartao");

        const canvas = await html2canvas(cartao, {
            backgroundColor: "#050505",
            scale: 3,
            useCORS: true,
            logging: false
        });

        const link = document.createElement("a");

        const nome = document.getElementById("nomeNivel").textContent
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        link.download = `casa-dos-mbtis-${nome}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();

        mensagem.textContent = "Sua imagem PNG foi gerada!";
    } catch (erro) {
        console.error("Erro ao gerar o cartão:", erro);

        mensagem.textContent =
            "Não foi possível gerar a imagem. Verifique se a ilustração está carregando.";
    } finally {
        botao.disabled = false;
    }
});

// Refazer o quiz
document.getElementById("refazer").addEventListener("click", () => {
    indice = 0;
    respostas = Array(perguntas.length).fill(null);

    resultado.classList.add("escondido");
    areaQuiz.classList.add("escondido");
    inicio.classList.remove("escondido");

    window.scrollTo({ top: 0, behavior: "smooth" });
});
