const perguntas = [
    {
        pergunta: "Qual tipo tem Ni como função dominante e Te como função auxiliar?",
        alternativas: [
            "INTJ",
            "INFJ",
            "ENTJ",
            "INTP"
        ],
        correta: 0,
        explicacao: "INTJ possui Ni dominante e Te auxiliar, formando a sequência Ni–Te–Fi–Se."
    },

    {
        pergunta: "Quais dois tipos compartilham exatamente o mesmo conjunto de quatro funções cognitivas, mas em ordens diferentes?",
        alternativas: [
            "INTJ e ENTJ",
            "INTJ e INFJ",
            "INTP e ENFP",
            "ISTJ e ISFJ"
        ],
        correta: 0,
        explicacao: "INTJ usa Ni–Te–Fi–Se e ENTJ usa Te–Ni–Se–Fi. As quatro funções são as mesmas, mas estão organizadas em ordens diferentes."
    },

    {
        pergunta: "No contexto das funções cognitivas, o que é um loop?",
        alternativas: [
            "Quando a pessoa passa a usar principalmente a função dominante e a terciária, deixando a auxiliar de lado.",
            "Quando a pessoa troca definitivamente de tipo MBTI depois de passar por uma situação estressante.",
            "Quando a pessoa desenvolve uma quinta função cognitiva que não fazia parte de sua stack.",
            "Quando a função inferior se torna permanentemente a função dominante."
        ],
        correta: 0,
        explicacao: "Um loop é geralmente descrito como uma dinâmica em que as funções dominante e terciária ficam excessivamente envolvidas enquanto a auxiliar é deixada de lado."
    },

    {
        pergunta: "O que é geralmente chamado de grip no contexto das funções cognitivas?",
        alternativas: [
            "Uma situação em que a função inferior passa a dominar temporariamente o comportamento, especialmente sob estresse.",
            "O uso equilibrado das quatro funções cognitivas no cotidiano.",
            "A troca da função dominante pela função auxiliar durante o desenvolvimento normal.",
            "A descoberta de que duas pessoas possuem o mesmo tipo MBTI."
        ],
        correta: 0,
        explicacao: "Grip descreve uma situação de estresse intenso em que a função inferior pode assumir uma influência exagerada sobre o comportamento."
    },

    {
        pergunta: "Qual função cognitiva está mais associada à avaliação interna de valores pessoais, autenticidade e aquilo que a pessoa considera profundamente significativo para si?",
        alternativas: [
            "Fe",
            "Fi",
            "Ti",
            "Te"
        ],
        correta: 1,
        explicacao: "Fi avalia experiências e decisões segundo valores internos, autenticidade e significado pessoal."
    },

    {
        pergunta: "Qual função cognitiva está mais relacionada à organização externa, eficiência, aplicação de critérios objetivos e busca por resultados concretos?",
        alternativas: [
            "Te",
            "Ti",
            "Fe",
            "Fi"
        ],
        correta: 0,
        explicacao: "Te orienta o pensamento para organização externa, critérios objetivos, eficiência e resultados observáveis."
    },

    {
        pergunta: "Qual função tende a perceber o ambiente de maneira direta, prestar atenção aos estímulos presentes e agir com base no que está acontecendo agora?",
        alternativas: [
            "Se",
            "Si",
            "Ni",
            "Ne"
        ],
        correta: 0,
        explicacao: "Se está associada à percepção direta do ambiente presente e à atenção aos estímulos concretos disponíveis no momento."
    },

    {
        pergunta: "Qual função está mais relacionada à comparação do presente com experiências anteriores, referências internas e padrões já conhecidos?",
        alternativas: [
            "Ne",
            "Si",
            "Se",
            "Ni"
        ],
        correta: 1,
        explicacao: "Si utiliza experiências, referências e impressões armazenadas para interpretar e comparar informações presentes."
    },

    {
        pergunta: "Qual função cognitiva está mais associada à exploração de múltiplas possibilidades, conexões e interpretações alternativas?",
        alternativas: [
            "Ni",
            "Ne",
            "Si",
            "Se"
        ],
        correta: 1,
        explicacao: "Ne explora possibilidades, associações e diferentes caminhos que podem surgir a partir de uma ideia ou situação."
    },

    {
        pergunta: "Qual função cognitiva está mais relacionada à busca por padrões, significados implícitos e uma compreensão interna que sintetiza várias informações em uma direção mais focada?",
        alternativas: [
            "Ne",
            "Ni",
            "Se",
            "Si"
        ],
        correta: 1,
        explicacao: "Ni busca padrões e significados internos, frequentemente sintetizando informações em uma compreensão mais focada."
    }
];

let questaoAtual = 0;
let acertos = 0;
let respondeu = false;

const pergunta = document.getElementById("pergunta");
const alternativas = document.getElementById("alternativas");
const explicacao = document.getElementById("explicacao");
const proxima = document.getElementById("proxima");

const questaoNumero = document.getElementById("questao-numero");
const pontuacao = document.getElementById("pontuacao");
const progresso = document.getElementById("progresso");

const quizArea = document.getElementById("quiz-area");
const resultado = document.getElementById("resultado");

const mensagemResultado = document.getElementById("mensagem-resultado");
const porcentagem = document.getElementById("porcentagem");
const resultadoTexto = document.getElementById("resultado-texto");

const acertosFinal = document.getElementById("acertos-final");
const errosFinal = document.getElementById("erros-final");
const totalFinal = document.getElementById("total-final");

const refazer = document.getElementById("refazer");
const voltarCentral = document.getElementById("voltar-central");

const confetes = document.getElementById("confetes");
const botaoTema = document.getElementById("tema");

function carregarTema() {
    const temaSalvo = localStorage.getItem("tema-quiz");

    if (temaSalvo === "light") {
        document.body.classList.add("light");
        botaoTema.textContent = "🌙";
    } else {
        document.body.classList.remove("light");
        botaoTema.textContent = "☀️";
    }
}

function alternarTema() {
    document.body.classList.toggle("light");

    const claro = document.body.classList.contains("light");

    botaoTema.textContent = claro ? "🌙" : "☀️";

    localStorage.setItem(
        "tema-quiz",
        claro ? "light" : "dark"
    );
}

botaoTema.addEventListener("click", alternarTema);

function carregarPergunta() {

    respondeu = false;

    proxima.disabled = true;

    explicacao.textContent = "";
    explicacao.classList.remove("visivel");

    const atual = perguntas[questaoAtual];

    pergunta.textContent = atual.pergunta;

    alternativas.innerHTML = "";

    atual.alternativas.forEach((texto, indice) => {

        const botao = document.createElement("button");

        botao.className = "alternativa";

        const letra = document.createElement("span");

        letra.className = "letra";

        letra.textContent =
            String.fromCharCode(65 + indice);

        botao.appendChild(letra);

        botao.appendChild(
            document.createTextNode(texto)
        );

        botao.addEventListener(
            "click",
            () => responder(indice)
        );

        alternativas.appendChild(botao);
    });

    questaoNumero.textContent =
        `Questão ${questaoAtual + 1} de ${perguntas.length}`;

    pontuacao.textContent =
        `${acertos} ${acertos === 1 ? "acerto" : "acertos"}`;

    const progressoAtual =
        ((questaoAtual + 1) / perguntas.length) * 100;

    progresso.style.width =
        `${progressoAtual}%`;
}

function responder(indiceEscolhido) {

    if (respondeu) return;

    respondeu = true;

    const atual = perguntas[questaoAtual];

    const botoes =
        document.querySelectorAll(".alternativa");

    botoes.forEach(botao => {
        botao.disabled = true;
    });

    botoes[atual.correta]
        .classList.add("correta");

    if (indiceEscolhido === atual.correta) {

        acertos++;

    } else {

        botoes[indiceEscolhido]
            .classList.add("errada");
    }

    explicacao.textContent =
        atual.explicacao;

    explicacao.classList.add("visivel");

    pontuacao.textContent =
        `${acertos} ${acertos === 1 ? "acerto" : "acertos"}`;

    proxima.disabled = false;

    if (questaoAtual === perguntas.length - 1) {

        proxima.textContent =
            "Ver resultado 🎉";

    } else {

        proxima.textContent =
            "Próxima questão →";
    }
}

proxima.addEventListener("click", () => {

    if (!respondeu) return;

    if (questaoAtual < perguntas.length - 1) {

        questaoAtual++;

        carregarPergunta();

    } else {

        mostrarResultado();
    }
});

function mostrarResultado() {

    quizArea.classList.add("hidden");

    resultado.classList.remove("hidden");

    const total = perguntas.length;

    const erros = total - acertos;

    const porcentagemFinal =
        Math.round((acertos / total) * 100);

    porcentagem.textContent =
        `${porcentagemFinal}%`;

    acertosFinal.textContent =
        acertos;

    errosFinal.textContent =
        erros;

    totalFinal.textContent =
        total;

    resultadoTexto.textContent =
        `Você acertou ${acertos} de ${total} questões.`;

    let mensagem = "";
    let nivelConfete = 0;

    if (porcentagemFinal === 100) {

        mensagem = "👑 Mestre do Quiz!";

        nivelConfete = 3;

    } else if (porcentagemFinal >= 90) {

        mensagem = "🧠 Especialista!";

        nivelConfete = 3;

    } else if (porcentagemFinal >= 75) {

        mensagem = "😎 Mandou bem!";

        nivelConfete = 2;

    } else if (porcentagemFinal >= 50) {

        mensagem = "🤨 Tá chegando...";

        nivelConfete = 1;

    } else if (porcentagemFinal >= 25) {

        mensagem =
            "😭 Vish, tem que estudar mais kkk";

    } else {

        mensagem =
            "💀 O conhecimento foi de arrasta.";
    }

    mensagemResultado.textContent =
        mensagem;

    if (nivelConfete > 0) {
        criarConfetes(nivelConfete);
    }
}

function criarConfetes(nivel) {

    confetes.innerHTML = "";

    const quantidade =
        nivel === 3
            ? 90
            : nivel === 2
                ? 55
                : 25;

    const cores = [
        "#9a6cff",
        "#c45cff",
        "#8abde8",
        "#a7d6f5",
        "#65c99a",
        "#ffd66b",
        "#ff8da1"
    ];

    for (let i = 0; i < quantidade; i++) {

        const confete =
            document.createElement("span");

        confete.className =
            "confete";

        confete.style.left =
            `${Math.random() * 100}%`;

        confete.style.animationDuration =
            `${2 + Math.random() * 3}s`;

        confete.style.animationDelay =
            `${Math.random() * 1.5}s`;

        confete.style.background =
            cores[
                Math.floor(
                    Math.random() * cores.length
                )
            ];

        confetes.appendChild(confete);
    }
}

function reiniciar() {

    questaoAtual = 0;

    acertos = 0;

    resultado.classList.add("hidden");

    quizArea.classList.remove("hidden");

    confetes.innerHTML = "";

    proxima.textContent =
        "Próxima questão →";

    carregarPergunta();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

refazer.addEventListener(
    "click",
    reiniciar
);

voltarCentral.addEventListener(
    "click",
    () => {
        window.location.href =
            "../index.html";
    }
);

carregarTema();

carregarPergunta();