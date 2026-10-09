
const temperaments = {
    colerico: {
        name: "Colérico",
        emoji: "🔥",
        color: "#ff626f",
        description:
            "Tende a ser direto, decidido e orientado para a ação. Pode gostar de assumir responsabilidades, resolver problemas e influenciar os acontecimentos.",
        interpretation:
            "Sua tendência colérica sugere uma preferência por iniciativa, decisão e resolução de problemas. Você pode sentir vontade de agir quando percebe algo parado ou ineficiente. Em situações difíceis, vale observar se a pressa por uma solução deixa pouco espaço para ouvir outras perspectivas."
    },

    sanguineo: {
        name: "Sanguíneo",
        emoji: "☀️",
        color: "#ffd166",
        description:
            "Tende a buscar experiências, interação e variedade. Pode demonstrar entusiasmo com novidades e gostar de compartilhar ideias e momentos com outras pessoas.",
        interpretation:
            "Sua tendência sanguínea sugere abertura para experiências, entusiasmo e conexão com outras pessoas. Novidades e ambientes movimentados podem despertar seu interesse. Também pode ser útil observar como você lida com tarefas repetitivas, compromissos prolongados e momentos em que precisa desacelerar."
    },

    fleumatico: {
        name: "Fleumático",
        emoji: "🌊",
        color: "#63b8ff",
        description:
            "Tende a valorizar tranquilidade, estabilidade e cooperação. Pode preferir pensar antes de agir, evitar conflitos desnecessários e respeitar o ritmo das situações.",
        interpretation:
            "Sua tendência fleumática sugere valorização da tranquilidade, da estabilidade e de relações mais harmoniosas. Você pode preferir avaliar uma situação antes de se posicionar. Vale observar se, em alguns momentos, evitar conflitos ou esperar que outra pessoa tome a iniciativa faz você deixar de expressar o que realmente deseja."
    },

    melancolico: {
        name: "Melancólico",
        emoji: "🌙",
        color: "#bc8bff",
        description:
            "Tende a observar detalhes, refletir sobre possibilidades e buscar coerência. Pode valorizar planejamento, profundidade e qualidade naquilo que realiza.",
        interpretation:
            "Sua tendência melancólica sugere atenção aos detalhes, reflexão e preocupação com a qualidade. Você pode preferir compreender uma situação antes de decidir e se importar com a consistência do que faz. É interessante observar se a busca por fazer bem-feito, em certas situações, se transforma em autocobrança ou dificuldade para aceitar imperfeições."
    }
};

/*
 * Cada alternativa distribui pontos entre os quatro temperamentos.
 * As respostas descrevem tendências possíveis, não tipos fixos.
 */
const questions = [
    {
        text: "Quando um grupo precisa tomar uma decisão importante, como você costuma agir?",
        answers: [
            {
                text: "Organizo as possibilidades e tento encaminhar uma decisão para que as coisas avancem.",
                scores: { colerico: 3, sanguineo: 1, fleumatico: 0, melancolico: 1 }
            },
            {
                text: "Compartilho ideias, converso com o pessoal e tento deixar a decisão mais animada.",
                scores: { colerico: 1, sanguineo: 3, fleumatico: 1, melancolico: 0 }
            },
            {
                text: "Escuto as pessoas e espero um pouco para entender o que o grupo prefere.",
                scores: { colerico: 0, sanguineo: 1, fleumatico: 3, melancolico: 1 }
            },
            {
                text: "Analiso as opções e penso nas consequências antes de escolher.",
                scores: { colerico: 0, sanguineo: 0, fleumatico: 1, melancolico: 3 }
            }
        ]
    },
    {
        text: "Quando alguém critica algo que você fez, qual costuma ser sua reação?",
        answers: [
            {
                text: "Avalio se a crítica faz sentido e, se for útil, tento corrigir o que for necessário.",
                scores: { colerico: 2, sanguineo: 0, fleumatico: 1, melancolico: 2 }
            },
            {
                text: "Posso ficar incomodado na hora, mas tento conversar e não deixar aquilo dominar meu dia.",
                scores: { colerico: 1, sanguineo: 3, fleumatico: 1, melancolico: 0 }
            },
            {
                text: "Tento ouvir sem transformar a situação em uma discussão, mesmo se eu discordar.",
                scores: { colerico: 0, sanguineo: 1, fleumatico: 3, melancolico: 1 }
            },
            {
                text: "Fico pensando no que foi dito e examino se realmente poderia ter feito melhor.",
                scores: { colerico: 0, sanguineo: 0, fleumatico: 1, melancolico: 3 }
            }
        ]
    },
    {
        text: "Você recebe uma tarefa nova, mas ninguém explicou direito como fazê-la. O que tende a fazer?",
        answers: [
            {
                text: "Começo a organizar a tarefa e descubro o caminho enquanto avanço.",
                scores: { colerico: 3, sanguineo: 1, fleumatico: 0, melancolico: 1 }
            },
            {
                text: "Exploro possibilidades, testo ideias e vejo o que parece funcionar melhor.",
                scores: { colerico: 1, sanguineo: 3, fleumatico: 0, melancolico: 1 }
            },
            {
                text: "Espero por mais orientações ou observo como as outras pessoas vão lidar com ela.",
                scores: { colerico: 0, sanguineo: 0, fleumatico: 3, melancolico: 1 }
            },
            {
                text: "Procuro entender os detalhes e planejo os passos antes de começar.",
                scores: { colerico: 0, sanguineo: 0, fleumatico: 1, melancolico: 3 }
            }
        ]
    },
    {
        text: "Em uma conversa com opiniões muito diferentes, como você tende a participar?",
        answers: [
            {
                text: "Defendo meu ponto de vista e tento chegar a uma conclusão clara.",
                scores: { colerico: 3, sanguineo: 0, fleumatico: 0, melancolico: 1 }
            },
            {
                text: "Trago exemplos, faço comentários e ajudo a conversa a continuar fluindo.",
                scores: { colerico: 0, sanguineo: 3, fleumatico: 1, melancolico: 0 }
            },
            {
                text: "Procuro entender os lados envolvidos e não aumentar a tensão.",
                scores: { colerico: 0, sanguineo: 1, fleumatico: 3, melancolico: 1 }
            },
            {
                text: "Examino os argumentos e aponto contradições ou detalhes importantes.",
                scores: { colerico: 1, sanguineo: 0, fleumatico: 0, melancolico: 3 }
            }
        ]
    },
    {
        text: "Quando seus planos mudam de repente, o que costuma acontecer?",
        answers: [
            {
                text: "Procuro rapidamente uma alternativa e reorganizo o que precisa ser feito.",
                scores: { colerico: 3, sanguineo: 1, fleumatico: 0, melancolico: 1 }
            },
            {
                text: "Tento aproveitar a mudança e descobrir algo interessante nessa nova situação.",
                scores: { colerico: 0, sanguineo: 3, fleumatico: 1, melancolico: 0 }
            },
            {
                text: "Prefiro me adaptar com calma, sem criar mais preocupação do que o necessário.",
                scores: { colerico: 0, sanguineo: 1, fleumatico: 3, melancolico: 0 }
            },
            {
                text: "Preciso reorganizar minhas expectativas e entender o que essa mudança afeta.",
                scores: { colerico: 0, sanguineo: 0, fleumatico: 1, melancolico: 3 }
            }
        ]
    },
    {
        text: "Em um dia livre, qual cenário mais combina com você?",
        answers: [
            {
                text: "Resolver coisas pendentes e aproveitar a sensação de ter avançado em algo.",
                scores: { colerico: 3, sanguineo: 0, fleumatico: 1, melancolico: 0 }
            },
            {
                text: "Sair, conversar, conhecer algo novo ou fazer algo espontâneo.",
                scores: { colerico: 0, sanguineo: 3, fleumatico: 1, melancolico: 0 }
            },
            {
                text: "Descansar, fazer minhas coisas no meu ritmo e curtir a tranquilidade.",
                scores: { colerico: 0, sanguineo: 0, fleumatico: 3, melancolico: 1 }
            },
            {
                text: "Ter tempo para meus interesses, refletir ou me dedicar a algo de que gosto.",
                scores: { colerico: 0, sanguineo: 1, fleumatico: 1, melancolico: 3 }
            }
        ]
    },
    {
        text: "Quando uma pessoa próxima está passando por um problema, como você costuma ajudar?",
        answers: [
            {
                text: "Tento encontrar soluções práticas e ajudar a pessoa a tomar uma atitude.",
                scores: { colerico: 3, sanguineo: 0, fleumatico: 1, melancolico: 0 }
            },
            {
                text: "Procuro animá-la, conversar e lembrá-la de que não precisa enfrentar tudo sozinha.",
                scores: { colerico: 0, sanguineo: 3, fleumatico: 1, melancolico: 0 }
            },
            {
                text: "Escuto com paciência e fico ao lado dela, sem pressionar por uma solução imediata.",
                scores: { colerico: 0, sanguineo: 1, fleumatico: 3, melancolico: 1 }
            },
            {
                text: "Tento compreender profundamente o que ela sente e pensar no que poderia ajudá-la.",
                scores: { colerico: 0, sanguineo: 0, fleumatico: 1, melancolico: 3 }
            }
        ]
    },
    {
        text: "Quando você tem vários compromissos para cumprir, como se organiza?",
        answers: [
            {
                text: "Defino prioridades e vou resolvendo uma coisa de cada vez para chegar ao resultado.",
                scores: { colerico: 3, sanguineo: 0, fleumatico: 0, melancolico: 1 }
            },
            {
                text: "Faço uma lista, mas também me permito mudar a ordem conforme minha disposição.",
                scores: { colerico: 1, sanguineo: 3, fleumatico: 0, melancolico: 1 }
            },
            {
                text: "Organizo o necessário, mas tento manter um ritmo tranquilo e realista.",
                scores: { colerico: 0, sanguineo: 0, fleumatico: 3, melancolico: 1 }
            },
            {
                text: "Planejo horários e etapas para não esquecer detalhes nem entregar algo incompleto.",
                scores: { colerico: 0, sanguineo: 0, fleumatico: 1, melancolico: 3 }
            }
        ]
    },
    {
        text: "O que mais costuma incomodar você em um trabalho em grupo?",
        answers: [
            {
                text: "A falta de iniciativa quando todos sabem que alguma coisa precisa ser feita.",
                scores: { colerico: 3, sanguineo: 0, fleumatico: 0, melancolico: 1 }
            },
            {
                text: "Um ambiente tão rígido que ninguém pode sugerir ideias diferentes.",
                scores: { colerico: 0, sanguineo: 3, fleumatico: 0, melancolico: 1 }
            },
            {
                text: "Discussões desnecessárias e pessoas que tornam tudo mais tenso.",
                scores: { colerico: 0, sanguineo: 0, fleumatico: 3, melancolico: 0 }
            },
            {
                text: "Desorganização, descuido e pessoas que não prestam atenção aos detalhes.",
                scores: { colerico: 1, sanguineo: 0, fleumatico: 0, melancolico: 3 }
            }
        ]
    },
    {
        text: "Quando você precisa aprender algo complicado, qual abordagem prefere?",
        answers: [
            {
                text: "Entender o objetivo e praticar logo, aprendendo com os erros durante o processo.",
                scores: { colerico: 3, sanguineo: 1, fleumatico: 0, melancolico: 0 }
            },
            {
                text: "Explorar exemplos variados e aprender de um jeito que mantenha meu interesse.",
                scores: { colerico: 0, sanguineo: 3, fleumatico: 0, melancolico: 1 }
            },
            {
                text: "Aprender gradualmente, com explicações claras e tempo para praticar.",
                scores: { colerico: 0, sanguineo: 0, fleumatico: 3, melancolico: 1 }
            },
            {
                text: "Estudar a fundo, compreender a lógica e conferir se realmente entendi.",
                scores: { colerico: 0, sanguineo: 0, fleumatico: 1, melancolico: 3 }
            }
        ]
    },
    {
        text: "Se alguém tenta pressionar você a tomar uma decisão, o que tende a fazer?",
        answers: [
            {
                text: "Deixo claro o que quero e tento encerrar a pressão com uma decisão.",
                scores: { colerico: 3, sanguineo: 0, fleumatico: 0, melancolico: 1 }
            },
            {
                text: "Converso, tento aliviar o clima e decido quando consigo me situar melhor.",
                scores: { colerico: 0, sanguineo: 3, fleumatico: 1, melancolico: 0 }
            },
            {
                text: "Peço espaço para pensar e evito entrar em uma disputa naquele momento.",
                scores: { colerico: 0, sanguineo: 0, fleumatico: 3, melancolico: 1 }
            },
            {
                text: "Questiono os motivos da pressa e avalio os riscos de decidir sem refletir.",
                scores: { colerico: 1, sanguineo: 0, fleumatico: 0, melancolico: 3 }
            }
        ]
    },
    {
        text: "Quando algo dá errado apesar do seu esforço, qual reação parece mais familiar?",
        answers: [
            {
                text: "Identifico o que pode ser feito agora e concentro minha energia em corrigir a situação.",
                scores: { colerico: 3, sanguineo: 0, fleumatico: 0, melancolico: 1 }
            },
            {
                text: "Fico frustrado, mas tento recuperar o ânimo e não me prender só ao problema.",
                scores: { colerico: 0, sanguineo: 3, fleumatico: 1, melancolico: 0 }
            },
            {
                text: "Respiro, aceito que aconteceu e procuro lidar com a situação sem piorá-la.",
                scores: { colerico: 0, sanguineo: 0, fleumatico: 3, melancolico: 1 }
            },
            {
                text: "Repasso o que aconteceu para entender onde errei e como evitar repetir isso.",
                scores: { colerico: 0, sanguineo: 0, fleumatico: 1, melancolico: 3 }
            }
        ]
    },
    {
        text: "Em um grupo novo, no qual você ainda não conhece ninguém, como costuma agir?",
        answers: [
            {
                text: "Tomo a iniciativa quando necessário e não tenho muita dificuldade em me posicionar.",
                scores: { colerico: 3, sanguineo: 1, fleumatico: 0, melancolico: 0 }
            },
            {
                text: "Tento puxar conversa e encontrar assuntos em comum para me aproximar das pessoas.",
                scores: { colerico: 0, sanguineo: 3, fleumatico: 0, melancolico: 0 }
            },
            {
                text: "Observo o ambiente e vou me aproximando quando me sinto confortável.",
                scores: { colerico: 0, sanguineo: 0, fleumatico: 3, melancolico: 1 }
            },
            {
                text: "Prefiro conhecer um pouco as pessoas antes de me abrir ou participar muito.",
                scores: { colerico: 0, sanguineo: 0, fleumatico: 1, melancolico: 3 }
            }
        ]
    },
    {
        text: "Qual elogio você mais gostaria de receber?",
        answers: [
            {
                text: "Você sabe resolver as coisas e faz acontecer quando é necessário.",
                scores: { colerico: 3, sanguineo: 0, fleumatico: 0, melancolico: 0 }
            },
            {
                text: "Você deixa tudo mais interessante e faz as pessoas se sentirem incluídas.",
                scores: { colerico: 0, sanguineo: 3, fleumatico: 1, melancolico: 0 }
            },
            {
                text: "Você transmite confiança e é alguém com quem podemos contar.",
                scores: { colerico: 0, sanguineo: 0, fleumatico: 3, melancolico: 1 }
            },
            {
                text: "Você é atento, profundo e faz as coisas com cuidado e qualidade.",
                scores: { colerico: 0, sanguineo: 0, fleumatico: 0, melancolico: 3 }
            }
        ]
    },
    {
        text: "Quando uma pessoa discorda de você de maneira insistente, o que costuma fazer?",
        answers: [
            {
                text: "Sustento meus argumentos e tento resolver a discordância diretamente.",
                scores: { colerico: 3, sanguineo: 0, fleumatico: 0, melancolico: 1 }
            },
            {
                text: "Debato com energia, mas posso mudar de assunto se a conversa deixar de ser produtiva.",
                scores: { colerico: 1, sanguineo: 3, fleumatico: 0, melancolico: 0 }
            },
            {
                text: "Procuro um ponto de entendimento ou encerro a conversa se ela não levar a nada.",
                scores: { colerico: 0, sanguineo: 1, fleumatico: 3, melancolico: 0 }
            },
            {
                text: "Penso nos argumentos da pessoa e tento identificar exatamente onde discordamos.",
                scores: { colerico: 0, sanguineo: 0, fleumatico: 1, melancolico: 3 }
            }
        ]
    },
    {
        text: "Como você costuma reagir a uma rotina muito repetitiva?",
        answers: [
            {
                text: "Procuro maneiras de torná-la mais eficiente ou eliminar etapas desnecessárias.",
                scores: { colerico: 3, sanguineo: 0, fleumatico: 0, melancolico: 1 }
            },
            {
                text: "Sinto falta de novidades e tento variar as atividades sempre que posso.",
                scores: { colerico: 0, sanguineo: 3, fleumatico: 0, melancolico: 0 }
            },
            {
                text: "Não me incomoda tanto se a rotina me permite ter estabilidade e tranquilidade.",
                scores: { colerico: 0, sanguineo: 0, fleumatico: 3, melancolico: 0 }
            },
            {
                text: "Gosto de ter estrutura, especialmente quando posso aperfeiçoar a forma como faço as coisas.",
                scores: { colerico: 0, sanguineo: 0, fleumatico: 1, melancolico: 3 }
            }
        ]
    },
    {
        text: "Se ninguém se oferece para organizar uma atividade coletiva, o que você faria?",
        answers: [
            {
                text: "Assumiria a organização se percebesse que é necessário para a atividade acontecer.",
                scores: { colerico: 3, sanguineo: 0, fleumatico: 0, melancolico: 0 }
            },
            {
                text: "Tentaria animar o grupo e sugerir ideias, sem necessariamente coordenar tudo.",
                scores: { colerico: 0, sanguineo: 3, fleumatico: 0, melancolico: 0 }
            },
            {
                text: "Esperaria para ver se alguém toma a iniciativa; se ninguém fizer isso, talvez eu ajude quando pedirem.",
                scores: { colerico: 0, sanguineo: 0, fleumatico: 3, melancolico: 0 }
            },
            {
                text: "Pensaria na melhor maneira de organizar, mas poderia hesitar até ter certeza de como fazer.",
                scores: { colerico: 0, sanguineo: 0, fleumatico: 1, melancolico: 3 }
            }
        ]
    },
    {
        text: "Quando você percebe que cometeu um erro, o que mais combina com sua reação?",
        answers: [
            {
                text: "Admito o que aconteceu e me concentro em resolver as consequências.",
                scores: { colerico: 3, sanguineo: 0, fleumatico: 1, melancolico: 0 }
            },
            {
                text: "Tento não me prender à culpa e busco uma maneira de seguir em frente.",
                scores: { colerico: 0, sanguineo: 3, fleumatico: 1, melancolico: 0 }
            },
            {
                text: "Aceito que erros acontecem e tento lidar com eles sem me desesperar.",
                scores: { colerico: 0, sanguineo: 0, fleumatico: 3, melancolico: 1 }
            },
            {
                text: "Reflito sobre o erro, suas causas e o que posso aprender para melhorar.",
                scores: { colerico: 0, sanguineo: 0, fleumatico: 1, melancolico: 3 }
            }
        ]
    },
    {
        text: "Em relação aos seus objetivos pessoais, qual afirmação mais combina com você?",
        answers: [
            {
                text: "Gosto de definir o que quero e criar maneiras concretas de chegar lá.",
                scores: { colerico: 3, sanguineo: 0, fleumatico: 0, melancolico: 1 }
            },
            {
                text: "Gosto de explorar possibilidades e me entusiasmo quando encontro algo que me inspira.",
                scores: { colerico: 0, sanguineo: 3, fleumatico: 0, melancolico: 1 }
            },
            {
                text: "Prefiro avançar com constância, sem transformar cada objetivo em uma fonte de pressão.",
                scores: { colerico: 0, sanguineo: 0, fleumatico: 3, melancolico: 1 }
            },
            {
                text: "Penso bastante no que quero e procuro um caminho que faça sentido para mim.",
                scores: { colerico: 0, sanguineo: 0, fleumatico: 1, melancolico: 3 }
            }
        ]
    },
    {
        text: "Quando precisa expressar algo que está incomodando você, como costuma agir?",
        answers: [
            {
                text: "Falo diretamente sobre o problema e digo o que gostaria que mudasse.",
                scores: { colerico: 3, sanguineo: 0, fleumatico: 0, melancolico: 0 }
            },
            {
                text: "Tento conversar de forma espontânea, explicando o que sinto enquanto penso.",
                scores: { colerico: 0, sanguineo: 3, fleumatico: 0, melancolico: 0 }
            },
            {
                text: "Posso guardar por um tempo para evitar conflito e falar quando me sentir preparado.",
                scores: { colerico: 0, sanguineo: 0, fleumatico: 3, melancolico: 1 }
            },
            {
                text: "Organizo meus pensamentos antes de falar para explicar o que realmente me incomoda.",
                scores: { colerico: 0, sanguineo: 0, fleumatico: 1, melancolico: 3 }
            }
        ]
    }
];

const intro = document.getElementById("intro");
const quizSection = document.getElementById("quizSection");
const resultSection = document.getElementById("resultSection");

const startBtn = document.getElementById("startBtn");
const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const copyBtn = document.getElementById("copyBtn");

const questionCounter = document.getElementById("questionCounter");
const questionNumber = document.getElementById("questionNumber");
const questionText = document.getElementById("questionText");
const answersContainer = document.getElementById("answers");
const progressFill = document.getElementById("progressFill");

let currentQuestion = 0;
let selectedAnswers = Array(questions.length).fill(null);

const temperamentKeys = [
    "colerico",
    "sanguineo",
    "fleumatico",
    "melancolico"
];

function startQuiz() {
    currentQuestion = 0;
    selectedAnswers = Array(questions.length).fill(null);

    intro.classList.add("hidden");
    resultSection.classList.add("hidden");
    quizSection.classList.remove("hidden");

    renderQuestion();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderQuestion() {
    const question = questions[currentQuestion];
    const number = String(currentQuestion + 1).padStart(2, "0");

    questionCounter.textContent = `${number} / ${questions.length}`;
    questionNumber.textContent = `PERGUNTA ${number}`;
    questionText.textContent = question.text;

    progressFill.style.width =
        `${((currentQuestion + 1) / questions.length) * 100}%`;

    answersContainer.innerHTML = "";

    question.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "answer-option";

        if (selectedAnswers[currentQuestion] === index) {
            button.classList.add("selected");
        }

        const letter = document.createElement("span");
        letter.className = "answer-letter";
        letter.textContent = String.fromCharCode(65 + index);

        const text = document.createElement("span");
        text.className = "answer-text";
        text.textContent = answer.text;

        button.append(letter, text);
        button.addEventListener("click", () => selectAnswer(index));

        answersContainer.appendChild(button);
    });

    backBtn.disabled = currentQuestion === 0;
    nextBtn.disabled = selectedAnswers[currentQuestion] === null;

    nextBtn.innerHTML = currentQuestion === questions.length - 1
        ? 'Ver resultado <span>↗</span>'
        : 'Próxima <span>→</span>';
}

function selectAnswer(index) {
    selectedAnswers[currentQuestion] = index;

    answersContainer.querySelectorAll(".answer-option").forEach((button, i) => {
        button.classList.toggle("selected", i === index);
    });

    nextBtn.disabled = false;
}

function goBack() {
    if (currentQuestion <= 0) return;

    currentQuestion--;
    renderQuestion();
}

function goNext() {
    if (selectedAnswers[currentQuestion] === null) return;

    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        renderQuestion();
        return;
    }

    showResults();
}

function calculateScores() {
    const scores = {
        colerico: 0,
        sanguineo: 0,
        fleumatico: 0,
        melancolico: 0
    };

    selectedAnswers.forEach((answerIndex, questionIndex) => {
        if (answerIndex === null) return;

        const answer = questions[questionIndex].answers[answerIndex];

        temperamentKeys.forEach(key => {
            scores[key] += answer.scores[key] || 0;
        });
    });

    return scores;
}

function getPercentages(scores) {
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);

    const percentages = {};

    temperamentKeys.forEach(key => {
        percentages[key] = total > 0
            ? Math.round((scores[key] / total) * 100)
            : 0;
    });

    return percentages;
}

function showResults() {
    const scores = calculateScores();
    const percentages = getPercentages(scores);

    const sorted = [...temperamentKeys].sort((a, b) => {
        return scores[b] - scores[a];
    });

    const dominantKey = sorted[0];
    const dominant = temperaments[dominantKey];

    quizSection.classList.add("hidden");
    resultSection.classList.remove("hidden");

    document.getElementById("dominantCard").style.setProperty(
        "--dominant-color",
        dominant.color
    );

    document.getElementById("dominantEmoji").textContent = dominant.emoji;
    document.getElementById("dominantName").textContent = dominant.name;
    document.getElementById("dominantDescription").textContent =
        dominant.description;

    document.getElementById("dominantPercentage").textContent =
        `${percentages[dominantKey]}%`;

    document.getElementById("dominantScoreFill").style.width =
        `${percentages[dominantKey]}%`;

    document.getElementById("resultInterpretation").textContent =
        dominant.interpretation;

    renderBubbles(scores, percentages, dominantKey);
    renderScoreList(scores, percentages, dominantKey);

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderBubbles(scores, percentages, dominantKey) {
    const maxScore = Math.max(...Object.values(scores), 1);
    const minSize = 78;
    const maxSize = 160;

    temperamentKeys.forEach(key => {
        const bubble = document.querySelector(`[data-bubble="${key}"]`);
        const info = temperaments[key];

        const relative = scores[key] / maxScore;
        const size = Math.round(minSize + relative * (maxSize - minSize));

        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.setProperty("--bubble-color", info.color);

        bubble.querySelector(".bubble-emoji").textContent = info.emoji;
        bubble.querySelector(".bubble-name").textContent = info.name;
        bubble.querySelector(".bubble-score").textContent =
            `${percentages[key]}%`;

        bubble.classList.toggle("dominant", key === dominantKey);
    });
}

function renderScoreList(scores, percentages, dominantKey) {
    const scoreList = document.getElementById("scoreList");
    scoreList.innerHTML = "";

    const sorted = [...temperamentKeys].sort((a, b) => {
        return scores[b] - scores[a];
    });

    sorted.forEach(key => {
        const info = temperaments[key];

        const row = document.createElement("div");
        row.className = "score-row";

        const name = document.createElement("div");
        name.className = "score-row-name";

        const dot = document.createElement("span");
        dot.className = "score-row-dot";
        dot.style.background = info.color;

        const label = document.createElement("span");
        label.textContent = info.name;

        if (key === dominantKey) {
            label.style.color = info.color;
            label.style.fontWeight = "700";
        }

        name.append(dot, label);

        const track = document.createElement("div");
        track.className = "score-track";

        const fill = document.createElement("div");
        fill.className = "score-fill";
        fill.style.background = info.color;
        fill.style.width = `${percentages[key]}%`;

        track.appendChild(fill);

        const value = document.createElement("div");
        value.className = "score-row-value";
        value.textContent = `${percentages[key]}%`;

        row.append(name, track, value);
        scoreList.appendChild(row);
    });
}

function restartQuiz() {
    resultSection.classList.add("hidden");
    quizSection.classList.add("hidden");
    intro.classList.remove("hidden");

    currentQuestion = 0;
    selectedAnswers = Array(questions.length).fill(null);

    window.scrollTo({ top: 0, behavior: "smooth" });
}

async function copyResult() {
    const scores = calculateScores();
    const percentages = getPercentages(scores);

    const sorted = [...temperamentKeys].sort((a, b) => {
        return scores[b] - scores[a];
    });

    const dominant = temperaments[sorted[0]];

    const lines = [
        "MEU RESULTADO — TEMPERAMENTOS",
        "",
        `Predominante: ${dominant.name} ${dominant.emoji}`,
        "",
        ...sorted.map(key =>
            `${temperaments[key].name}: ${percentages[key]}%`
        ),
        "",
        "Resultado de um teste de autoconhecimento; não é avaliação psicológica."
    ];

    const text = lines.join("\n");

    try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = "Resultado copiado ✓";
    } catch (error) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";

        document.body.appendChild(textArea);
        textArea.select();

        const copied = document.execCommand("copy");
        textArea.remove();

        copyBtn.textContent = copied
            ? "Resultado copiado ✓"
            : "Não foi possível copiar";
    }

    window.setTimeout(() => {
        copyBtn.textContent = "Copiar resultado ↗";
    }, 2200);
}

startBtn.addEventListener("click", startQuiz);
backBtn.addEventListener("click", goBack);
nextBtn.addEventListener("click", goNext);
restartBtn.addEventListener("click", restartQuiz);
copyBtn.addEventListener("click", copyResult);
