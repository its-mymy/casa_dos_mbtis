const questions = [
    { q: "Você vê facilmente várias possibilidades diferentes para uma mesma situação.", w: { Ne: 3, Ni: 1, Ti: 0, Te: 0, Si: -1, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você frequentemente sente que uma situação está caminhando para determinado resultado antes de conseguir explicar exatamente por quê.", w: { Ne: 1, Ni: 3, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você gosta de entender exatamente como e por que uma ideia funciona antes de aceitá-la.", w: { Ne: 1, Ni: 0, Ti: 3, Te: 1, Si: 0, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Quando existe um problema, sua primeira preocupação costuma ser descobrir a maneira mais eficiente de resolvê-lo.", w: { Ne: 0, Ni: 0, Ti: 1, Te: 3, Si: 0, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Experiências anteriores influenciam bastante a maneira como você interpreta situações atuais.", w: { Ne: 0, Ni: 0, Ti: 0, Te: 0, Si: 3, Se: 0, Fi: 1, Fe: 0 } },
    { q: "Você gosta de experimentar diretamente as coisas em vez de passar muito tempo pensando sobre elas.", w: { Ne: 1, Ni: -1, Ti: 0, Te: 0, Si: -1, Se: 3, Fi: 0, Fe: 0 } },
    { q: "Seus valores pessoais podem continuar sendo importantes para você mesmo quando ninguém ao seu redor concorda com eles.", w: { Ne: 0, Ni: 0, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 3, Fe: 1 } },
    { q: "Você percebe rapidamente quando alguém está desconfortável e tende a ajustar seu comportamento para melhorar o clima.", w: { Ne: 0, Ni: 0, Ti: 0, Te: 0, Si: 0, Se: 1, Fi: 1, Fe: 3 } },
    { q: "Uma ideia costuma fazer você pensar imediatamente em várias outras ideias relacionadas.", w: { Ne: 3, Ni: 1, Ti: 1, Te: 0, Si: -1, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você costuma procurar um significado mais profundo por trás dos acontecimentos.", w: { Ne: 1, Ni: 3, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 1, Fe: 0 } },
    { q: "Você costuma questionar definições, conceitos e regras quando percebe alguma inconsistência lógica.", w: { Ne: 1, Ni: 0, Ti: 3, Te: 1, Si: 0, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você prefere estabelecer objetivos claros e organizar os recursos necessários para alcançá-los.", w: { Ne: 0, Ni: 0, Ti: 1, Te: 3, Si: 0, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Lugares familiares podem proporcionar uma sensação de segurança e estabilidade.", w: { Ne: 0, Ni: 0, Ti: 0, Te: 0, Si: 3, Se: -1, Fi: 1, Fe: 0 } },
    { q: "Você percebe rapidamente mudanças no ambiente ao seu redor.", w: { Ne: 0, Ni: 0, Ti: 0, Te: 0, Si: -1, Se: 3, Fi: 0, Fe: 1 } },
    { q: "Você prefere agir de acordo com aquilo que considera genuinamente certo para você.", w: { Ne: 0, Ni: 0, Ti: 1, Te: 0, Si: 0, Se: 0, Fi: 3, Fe: 0 } },
    { q: "Você costuma pensar em maneiras diferentes de fazer algo mesmo quando o método atual funciona.", w: { Ne: 3, Ni: 0, Ti: 1, Te: 0, Si: -2, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você frequentemente tem uma impressão geral sobre uma pessoa ou situação que demora para conseguir colocar em palavras.", w: { Ne: 1, Ni: 3, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 1, Fe: 0 } },
    { q: "Você prefere compreender os princípios de algo em vez de simplesmente decorar como fazê-lo.", w: { Ne: 1, Ni: 0, Ti: 3, Te: 0, Si: 1, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você tende a transformar ideias em planos, procedimentos ou resultados concretos.", w: { Ne: 0, Ni: 0, Ti: 1, Te: 3, Si: 0, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você percebe diferenças entre o que está acontecendo agora e aquilo que já vivenciou anteriormente.", w: { Ne: 0, Ni: 0, Ti: 0, Te: 0, Si: 3, Se: 1, Fi: 0, Fe: 0 } },
    { q: "Quando surge uma oportunidade inesperada, você pode sentir vontade de aproveitá-la imediatamente.", w: { Ne: 1, Ni: -1, Ti: 0, Te: 1, Si: -1, Se: 3, Fi: 0, Fe: 0 } },
    { q: "Você tem dificuldade em abandonar uma convicção pessoal apenas porque outras pessoas discordam dela.", w: { Ne: 0, Ni: 1, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 3, Fe: 0 } },
    { q: "Você costuma pensar sobre como suas decisões afetarão emocionalmente as pessoas envolvidas.", w: { Ne: 0, Ni: 0, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 1, Fe: 3 } },
    { q: "Você se diverte imaginando cenários que ainda não existem.", w: { Ne: 3, Ni: 2, Ti: 0, Te: 0, Si: -1, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você tende a buscar uma única interpretação que faça todas as partes de uma situação se encaixarem.", w: { Ne: 0, Ni: 3, Ti: 1, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você pode passar bastante tempo desmontando mentalmente um argumento para descobrir onde ele falha.", w: { Ne: 1, Ni: 0, Ti: 3, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você prefere tomar decisões com base em informações objetivas e resultados observáveis.", w: { Ne: 0, Ni: 0, Ti: 1, Te: 3, Si: 0, Se: 1, Fi: 0, Fe: 0 } },
    { q: "Você tende a repetir métodos que já demonstraram funcionar para você.", w: { Ne: 0, Ni: 0, Ti: 0, Te: 1, Si: 3, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você gosta da sensação de estar completamente envolvido em uma experiência presente.", w: { Ne: 1, Ni: -1, Ti: 0, Te: 0, Si: -1, Se: 3, Fi: 0, Fe: 0 } },
    { q: "Você pode sentir uma forte necessidade de permanecer fiel àquilo que considera sua identidade.", w: { Ne: 0, Ni: 1, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 3, Fe: 0 } },
    { q: "Você naturalmente tenta conectar assuntos aparentemente não relacionados.", w: { Ne: 3, Ni: 1, Ti: 1, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você costuma imaginar como uma situação poderá se desenvolver ao longo do tempo.", w: { Ne: 1, Ni: 3, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você prefere descobrir uma explicação lógica por conta própria em vez de simplesmente aceitar uma resposta pronta.", w: { Ne: 1, Ni: 0, Ti: 3, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você se sente satisfeito quando consegue tornar um sistema mais organizado e produtivo.", w: { Ne: 0, Ni: 0, Ti: 0, Te: 3, Si: 0, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você se lembra facilmente de como determinadas coisas costumavam ser.", w: { Ne: 0, Ni: 0, Ti: 0, Te: 0, Si: 3, Se: 0, Fi: 1, Fe: 0 } },
    { q: "Você tende a agir primeiro e analisar as consequências depois quando algo desperta seu interesse.", w: { Ne: 1, Ni: -1, Ti: 0, Te: 0, Si: -1, Se: 3, Fi: 0, Fe: 0 } },
    { q: "Você pode rejeitar uma escolha que parece conveniente se ela entrar em conflito com seus princípios.", w: { Ne: 0, Ni: 0, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 3, Fe: 1 } },
    { q: "Você sente satisfação quando consegue fazer diferentes pessoas se sentirem incluídas.", w: { Ne: 0, Ni: 0, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 1, Fe: 3 } },
    { q: "Você começa uma atividade e rapidamente percebe várias outras coisas que poderia explorar.", w: { Ne: 3, Ni: 0, Ti: 1, Te: 0, Si: -1, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você frequentemente percebe um padrão geral antes de conseguir explicar os detalhes que levaram até ele.", w: { Ne: 1, Ni: 3, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você gosta de testar se uma ideia permanece logicamente consistente quando aplicada a diferentes situações.", w: { Ne: 1, Ni: 0, Ti: 3, Te: 1, Si: 0, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você costuma assumir a responsabilidade por organizar pessoas e recursos quando algo precisa ser realizado.", w: { Ne: 0, Ni: 0, Ti: 0, Te: 3, Si: 0, Se: 0, Fi: 0, Fe: 1 } },
    { q: "Você dá grande valor à tradição e ao dever.", w: { Ne: 0, Ni: 0, Ti: 0, Te: 0, Si: 3, Se: 0, Fi: 1, Fe: 1 } },
    { q: "Você vive intensamente o presente e tende a prestar atenção ao que está acontecendo ao seu redor.", w: { Ne: 0, Ni: -1, Ti: 0, Te: 0, Si: -1, Se: 3, Fi: 0, Fe: 0 } },
    { q: "Você considera importante que suas escolhas reflitam aquilo que você realmente acredita.", w: { Ne: 0, Ni: 0, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 3, Fe: 0 } },
    { q: "Você costuma questionar uma ideia simplesmente para descobrir até onde ela pode ser levada.", w: { Ne: 3, Ni: 0, Ti: 2, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você frequentemente chega a conclusões que parecem surgir repentinamente depois de muito tempo pensando sobre algo.", w: { Ne: 1, Ni: 3, Ti: 1, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você gosta de construir teorias internas para explicar como as coisas funcionam.", w: { Ne: 1, Ni: 1, Ti: 3, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você costuma avaliar uma estratégia principalmente pela eficiência dos resultados que produz.", w: { Ne: 0, Ni: 0, Ti: 0, Te: 3, Si: 0, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você sente desconforto quando precisa abandonar completamente uma rotina que funciona bem.", w: { Ne: 0, Ni: 0, Ti: 0, Te: 0, Si: 3, Se: -1, Fi: 0, Fe: 0 } },
    { q: "Você se sente energizado quando pode explorar livremente o ambiente e reagir ao que aparece.", w: { Ne: 1, Ni: -1, Ti: 0, Te: 0, Si: -1, Se: 3, Fi: 0, Fe: 0 } },
    { q: "Você pode preferir ficar sozinho até conseguir entender completamente aquilo que está sentindo.", w: { Ne: 0, Ni: 1, Ti: 1, Te: 0, Si: 0, Se: 0, Fi: 3, Fe: -1 } },
    { q: "Você naturalmente adapta sua comunicação ao grupo para manter uma interação agradável.", w: { Ne: 0, Ni: 0, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 3 } },
    { q: "Você tem dificuldade em se concentrar em apenas uma possibilidade quando existem muitas alternativas interessantes.", w: { Ne: 3, Ni: 0, Ti: 1, Te: 0, Si: -2, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você frequentemente tenta descobrir qual é a causa fundamental por trás de acontecimentos diferentes.", w: { Ne: 1, Ni: 3, Ti: 1, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você consegue perceber rapidamente quando uma explicação não é logicamente coerente.", w: { Ne: 1, Ni: 0, Ti: 3, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você prefere definir prioridades e estabelecer prazos para garantir que algo seja concluído.", w: { Ne: 0, Ni: 0, Ti: 0, Te: 3, Si: 0, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você costuma confiar naquilo que já conhece quando precisa tomar uma decisão rapidamente.", w: { Ne: 0, Ni: 0, Ti: 0, Te: 0, Si: 3, Se: 0, Fi: 1, Fe: 0 } },
    { q: "Você gosta de experiências novas mesmo quando não sabe exatamente o que acontecerá.", w: { Ne: 2, Ni: 0, Ti: 0, Te: 0, Si: -1, Se: 3, Fi: 0, Fe: 0 } },
    { q: "Você sente que algumas coisas são pessoalmente certas ou erradas independentemente da opinião da maioria.", w: { Ne: 0, Ni: 1, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 3, Fe: 0 } },
    { q: "Você costuma apresentar ideias novas mesmo quando ainda não sabe exatamente como colocá-las em prática.", w: { Ne: 3, Ni: 1, Ti: 1, Te: 0, Si: -1, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você tende a interpretar acontecimentos atuais considerando onde eles provavelmente irão levar no futuro.", w: { Ne: 1, Ni: 3, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você gosta de investigar profundamente uma questão apenas porque quer entender como ela funciona.", w: { Ne: 1, Ni: 0, Ti: 3, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você costuma pensar em maneiras de otimizar sistemas existentes visando maior eficiência e produtividade.", w: { Ne: 0, Ni: 0, Ti: 1, Te: 3, Si: 0, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você é habilidoso em reconhecer quando os detalhes diante de você correspondem ao que já conhece.", w: { Ne: 0, Ni: 0, Ti: 0, Te: 0, Si: 3, Se: 0, Fi: 1, Fe: 0 } },
    { q: "Você absorve informações do mundo externo de maneira direta, prestando atenção ao que está acontecendo concretamente.", w: { Ne: 0, Ni: -1, Ti: 0, Te: 0, Si: -1, Se: 3, Fi: 0, Fe: 0 } },
    { q: "Você é atraído pelo abstrato e frequentemente se interessa por significados ocultos.", w: { Ne: 1, Ni: 3, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 1, Fe: 0 } },
    { q: "Você costuma expressar simpatia depois de compreender emocionalmente o que outra pessoa está passando.", w: { Ne: 0, Ni: 0, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 1, Fe: 3 } },
    { q: "Você é excelente em resolver problemas porque consegue analisá-los profundamente.", w: { Ne: 1, Ni: 0, Ti: 3, Te: 1, Si: 0, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você simpatiza facilmente com os esforços e dificuldades das outras pessoas.", w: { Ne: 0, Ni: 0, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 1, Fe: 3 } },
    { q: "Você prefere trabalhar sozinho para resolver problemas e chegar às suas próprias conclusões.", w: { Ne: 1, Ni: 1, Ti: 3, Te: 0, Si: 0, Se: 0, Fi: 1, Fe: -1 } },
    { q: "Pessoas falsas ou que demonstram emoções que você considera insinceras incomodam você.", w: { Ne: 0, Ni: 1, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 3, Fe: 1 } },
    { q: "Você costuma ser brusco e direto ao ponto quando precisa comunicar alguma coisa.", w: { Ne: 0, Ni: 0, Ti: 1, Te: 3, Si: 0, Se: 1, Fi: 0, Fe: -1 } },
    { q: "Você tenta ajudar as pessoas mesmo quando isso faz você negligenciar suas próprias necessidades.", w: { Ne: 0, Ni: 0, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 1, Fe: 3 } },
    { q: "Você sente que existe algo além daquilo que pode ser diretamente observado ou explicado.", w: { Ne: 1, Ni: 3, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 1, Fe: 0 } },
    { q: "Você frequentemente usa analogias ou comparações para comunicar ideias novas.", w: { Ne: 3, Ni: 1, Ti: 1, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 1 } },
    { q: "Você vê uma situação complexa e rapidamente identifica a visão geral por trás dos detalhes.", w: { Ne: 1, Ni: 3, Ti: 1, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você usa experiências passadas para orientar suas decisões no presente.", w: { Ne: 0, Ni: 0, Ti: 0, Te: 0, Si: 3, Se: 0, Fi: 1, Fe: 0 } },
    { q: "Você costuma começar vários projetos ou interesses diferentes antes de terminar os anteriores.", w: { Ne: 3, Ni: 0, Ti: 1, Te: 0, Si: -2, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você hesita em se conformar com expectativas sociais quando elas entram em conflito com aquilo que acredita.", w: { Ne: 1, Ni: 0, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 3, Fe: -1 } },
    { q: "Você acredita que alcançar uma verdade é mais importante do que simplesmente vencer uma discussão.", w: { Ne: 1, Ni: 1, Ti: 3, Te: 0, Si: 0, Se: 0, Fi: 1, Fe: 0 } },
    { q: "Você inventa maneiras próprias de pensar, teorias e sistemas lógicos para descrever o mundo.", w: { Ne: 1, Ni: 1, Ti: 3, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você se sente confortável assumindo riscos quando uma experiência parece valer a pena.", w: { Ne: 1, Ni: -1, Ti: 0, Te: 0, Si: -1, Se: 3, Fi: 0, Fe: 0 } },
    { q: "Você não gosta quando mudanças inesperadas obrigam você a abandonar aquilo que já estava funcionando.", w: { Ne: 0, Ni: 0, Ti: 0, Te: 0, Si: 3, Se: -1, Fi: 0, Fe: 0 } },
    { q: "Você tem sido consistentemente lógico ao longo da vida e costuma priorizar coerência em suas decisões.", w: { Ne: 1, Ni: 0, Ti: 3, Te: 1, Si: 0, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você faria de tudo para ganhar um debate quando acredita que está certo.", w: { Ne: 1, Ni: 0, Ti: 1, Te: 3, Si: 0, Se: 0, Fi: 0, Fe: -1 } },
    { q: "Você explora assuntos profundamente simplesmente porque sente prazer em descobrir como eles funcionam.", w: { Ne: 1, Ni: 1, Ti: 3, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você é muito individualista e valoriza profundamente aquilo que torna sua personalidade diferente das outras pessoas.", w: { Ne: 1, Ni: 1, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 3, Fe: 0 } },
    { q: "Você frequentemente sente que uma resposta apareceu repentinamente depois de conectar várias informações.", w: { Ne: 1, Ni: 3, Ti: 1, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } },
    { q: "Você vê o mundo como um lugar cheio de possibilidades esperando para serem exploradas.", w: { Ne: 3, Ni: 1, Ti: 0, Te: 0, Si: -1, Se: 1, Fi: 0, Fe: 0 } }
];

const functions = ["Ne", "Ni", "Se", "Si", "Te", "Ti", "Fe", "Fi"];

const stacks = {
    ENTP: ["Ne", "Ti", "Fe", "Si"],
    ENFP: ["Ne", "Fi", "Te", "Si"],
    ESTP: ["Se", "Ti", "Fe", "Ni"],
    ESFP: ["Se", "Fi", "Te", "Ni"],
    ENTJ: ["Te", "Ni", "Se", "Fi"],
    ESTJ: ["Te", "Si", "Ne", "Fi"],
    ENFJ: ["Fe", "Ni", "Se", "Ti"],
    ESFJ: ["Fe", "Si", "Ne", "Ti"],
    INTP: ["Ti", "Ne", "Si", "Fe"],
    INFP: ["Fi", "Ne", "Si", "Te"],
    ISTP: ["Ti", "Se", "Ni", "Fe"],
    ISFP: ["Fi", "Se", "Ni", "Te"],
    INTJ: ["Ni", "Te", "Fi", "Se"],
    ISTJ: ["Si", "Te", "Fi", "Ne"],
    INFJ: ["Ni", "Fe", "Ti", "Se"],
    ISFJ: ["Si", "Fe", "Ti", "Ne"]
};

const descriptions = {
    ENTP: "Seu perfil apresenta forte tendência à exploração de possibilidades, análise lógica e abertura para novas ideias.",
    ENFP: "Seu perfil apresenta forte exploração de possibilidades combinada com valores pessoais e interesse pelas pessoas.",
    ESTP: "Seu perfil apresenta forte percepção do ambiente, ação direta e análise prática das situações.",
    ESFP: "Seu perfil apresenta forte presença no momento, experiência direta e atenção às pessoas ao redor.",
    ENTJ: "Seu perfil apresenta forte orientação para eficiência, estrutura, estratégia e execução de objetivos.",
    ESTJ: "Seu perfil apresenta forte organização, praticidade, eficiência e atenção ao que funciona na realidade.",
    ENFJ: "Seu perfil apresenta forte atenção às pessoas, organização social e visão de futuro.",
    ESFJ: "Seu perfil apresenta forte atenção às necessidades das pessoas, estabilidade e organização social.",
    INTP: "Seu perfil apresenta forte análise interna, investigação conceitual e exploração de possibilidades.",
    INFP: "Seu perfil apresenta forte orientação por valores pessoais, imaginação e exploração de possibilidades.",
    ISTP: "Seu perfil apresenta forte análise interna, observação concreta e capacidade de resolver problemas.",
    ISFP: "Seu perfil apresenta forte autenticidade, percepção do presente e atenção à experiência concreta.",
    INTJ: "Seu perfil apresenta forte visão de longo prazo, análise estratégica e organização.",
    ISTJ: "Seu perfil apresenta forte estabilidade, experiência acumulada, organização e eficiência.",
    INFJ: "Seu perfil apresenta forte visão interna, compreensão das pessoas e busca por significado.",
    ISFJ: "Seu perfil apresenta forte atenção às experiências, estabilidade, cuidado e necessidades das pessoas."
};

const intro = document.getElementById("intro");
const quiz = document.getElementById("quiz");
const result = document.getElementById("result");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const questionText = document.getElementById("question-text");
const questionNumber = document.getElementById("question-number");
const questionTitle = document.getElementById("question-title");
const progressBar = document.getElementById("progress-bar");
const themeToggle = document.getElementById("theme-toggle");

let currentQuestion = 0;
let answers = new Array(questions.length).fill(null);

const weightCapacity = {};

functions.forEach(fn => {
    weightCapacity[fn] = questions.reduce((total, question) => {
        return total + Math.abs(question.w[fn] || 0);
    }, 0);
});

function showQuestion() {
    const question = questions[currentQuestion];

    questionText.textContent = question.q;
    questionNumber.textContent = `${currentQuestion + 1} / ${questions.length}`;
    questionTitle.textContent = `PERGUNTA ${currentQuestion + 1}`;
    progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;

    document.querySelectorAll('input[name="answer"]').forEach(input => {
        input.checked = Number(input.value) === answers[currentQuestion];
    });

    prevBtn.style.visibility = currentQuestion === 0 ? "hidden" : "visible";
    nextBtn.textContent = currentQuestion === questions.length - 1
        ? "CALCULAR RESULTADO"
        : "PRÓXIMA →";
}

function getSelectedValue() {
    const selected = document.querySelector('input[name="answer"]:checked');
    return selected ? Number(selected.value) : null;
}

function startTest() {
    intro.classList.add("hidden");
    result.classList.add("hidden");
    quiz.classList.remove("hidden");

    currentQuestion = 0;
    answers.fill(null);

    showQuestion();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function nextQuestion() {
    const value = getSelectedValue();

    if (value === null) {
        alert("Escolha uma das cinco opções antes de continuar.");
        return;
    }

    answers[currentQuestion] = value;

    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    } else {
        calculateResults();
    }
}

function previousQuestion() {
    const value = getSelectedValue();

    if (value !== null) {
        answers[currentQuestion] = value;
    }

    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
}

function calculateFunctionScores() {
    const rawScores = {
        Ne: 0,
        Ni: 0,
        Se: 0,
        Si: 0,
        Te: 0,
        Ti: 0,
        Fe: 0,
        Fi: 0
    };

    questions.forEach((question, index) => {
        const answer = answers[index];

        if (answer === null) return;

        functions.forEach(fn => {
            rawScores[fn] += answer * (question.w[fn] || 0);
        });
    });

    const balancedScores = {};

    functions.forEach(fn => {
        const capacity = weightCapacity[fn] || 1;
        balancedScores[fn] = rawScores[fn] / capacity;
    });

    return balancedScores;
}

function normalizeScores(scores) {
    const values = Object.values(scores);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const normalized = {};

    functions.forEach(fn => {
        normalized[fn] = ((scores[fn] - min) / range) * 100;
    });

    return normalized;
}

function getAxisPreferences(scores) {
    return {
        NeSi: scores.Ne - scores.Si,
        NiSe: scores.Ni - scores.Se,
        TiFe: scores.Ti - scores.Fe,
        FiTe: scores.Fi - scores.Te
    };
}

function getFunctionPreference(scores, first, second) {
    return scores[first] >= scores[second] ? first : second;
}

function getAxisType(scores) {
    const axes = getAxisPreferences(scores);

    const intuition = (axes.NeSi + axes.NiSe) / 2;
    const thinking = axes.TiFe;
    const feeling = -axes.TiFe;

    const extroverted = (
        scores.Ne +
        scores.Se +
        scores.Te +
        scores.Fe
    ) / 4;

    const introverted = (
        scores.Ni +
        scores.Si +
        scores.Ti +
        scores.Fi
    ) / 4;

    const E = extroverted >= introverted ? "E" : "I";
    const N = intuition >= 0 ? "N" : "S";
    const T = thinking >= feeling ? "T" : "F";

    let J;

    if (E === "E") {
        const judging = scores.Te + scores.Fe;
        const perceiving = scores.Ne + scores.Se;
        J = judging >= perceiving ? "J" : "P";
    } else {
        const auxiliaryJudging = scores.Te + scores.Fe;
        const auxiliaryPerceiving = scores.Ne + scores.Se;
        J = auxiliaryJudging >= auxiliaryPerceiving ? "J" : "P";
    }

    return E + N + T + J;
}

function getLetterProfile(scores) {
    const extroverted =
        scores.Ne +
        scores.Se +
        scores.Te +
        scores.Fe;

    const introverted =
        scores.Ni +
        scores.Si +
        scores.Ti +
        scores.Fi;

    const intuition =
        scores.Ne +
        scores.Ni;

    const sensing =
        scores.Se +
        scores.Si;

    const thinking =
        scores.Ti +
        scores.Te;

    const feeling =
        scores.Fi +
        scores.Fe;

    return {
        E: extroverted,
        I: introverted,
        N: intuition,
        S: sensing,
        T: thinking,
        F: feeling
    };
}

function getIndicatorType(scores) {
    const profile = getLetterProfile(scores);

    const E = profile.E >= profile.I ? "E" : "I";
    const N = profile.N >= profile.S ? "N" : "S";
    const T = profile.T >= profile.F ? "T" : "F";

    let J;

    if (E === "E") {
        J = (scores.Te + scores.Fe) >= (scores.Ne + scores.Se)
            ? "J"
            : "P";
    } else {
        J = (scores.Te + scores.Fe) >= (scores.Ne + scores.Se)
            ? "J"
            : "P";
    }

    return E + N + T + J;
}

function getTypeFit(type, scores) {
    const stack = stacks[type];

    const weights = {
        0: 1.00,
        1: 0.70,
        2: 0.45,
        3: 0.25
    };

    let score = 0;

    stack.forEach((fn, index) => {
        score += scores[fn] * weights[index];
    });

    const unusedFunctions = functions.filter(
        fn => !stack.includes(fn)
    );

    unusedFunctions.forEach(fn => {
        score -= scores[fn] * 0.08;
    });

    const expectedDominant = stack[0];
    const expectedAuxiliary = stack[1];

    score += scores[expectedDominant] * 0.35;
    score += scores[expectedAuxiliary] * 0.20;

    return score;
}

function getMyersType(scores) {
    let bestType = null;
    let bestScore = -Infinity;

    Object.keys(stacks).forEach(type => {
        const stack = stacks[type];
        let score = getTypeFit(type, scores);

        const dominant = stack[0];
        const auxiliary = stack[1];

        const extrovertedFunctions = ["Ne", "Se", "Te", "Fe"];
        const judgingFunctions = ["Te", "Fe"];
        const perceivingFunctions = ["Ne", "Se"];

        if (extrovertedFunctions.includes(dominant)) {
            score += scores[dominant] * 0.30;
        }

        if (type[0] === "E") {
            score += (
                scores.Ne +
                scores.Se +
                scores.Te +
                scores.Fe
            ) * 0.10;
        } else {
            score += (
                scores.Ni +
                scores.Si +
                scores.Ti +
                scores.Fi
            ) * 0.10;
        }

        if (type[3] === "J" && judgingFunctions.includes(auxiliary)) {
            score += scores[auxiliary] * 0.15;
        }

        if (type[3] === "P" && perceivingFunctions.includes(auxiliary)) {
            score += scores[auxiliary] * 0.15;
        }

        if (score > bestScore) {
            bestScore = score;
            bestType = type;
        }
    });

    return bestType;
}

function renderFunctions(normalized) {
    const container = document.getElementById("function-results");

    const ordered = [...functions].sort(
        (a, b) => normalized[b] - normalized[a]
    );

    container.innerHTML = "";

    ordered.forEach(fn => {
        const value = Math.round(normalized[fn]);

        const row = document.createElement("div");
        row.className = "function-row";

        row.innerHTML = `
            <div class="function-info">
                <span class="function-name">${fn}</span>
                <span class="function-value">${value}%</span>
            </div>
            <div class="function-bar">
                <div class="function-fill" style="width:${value}%"></div>
            </div>
        `;

        container.appendChild(row);
    });
}

function calculateConsensus(types) {
    const count = {};

    types.forEach(type => {
        count[type] = (count[type] || 0) + 1;
    });

    const sorted = Object.entries(count).sort(
        (a, b) => b[1] - a[1]
    );

    const mostCommon = sorted[0][0];
    const amount = sorted[0][1];

    if (amount === 3) {
        return `Os três modelos convergiram para ${mostCommon}. Isso indica uma forte convergência entre os diferentes métodos de cálculo.`;
    }

    if (amount === 2) {
        return `Dois dos três modelos chegaram a ${mostCommon}. O terceiro modelo apresentou uma interpretação diferente das preferências funcionais.`;
    }

    return `Os três modelos apresentaram resultados diferentes: ${types.join(", ")}. Isso indica que seu perfil está próximo de diferentes interpretações funcionais.`;
}

function calculateResults() {
    const scores = calculateFunctionScores();
    const normalized = normalizeScores(scores);

    const axisType = getAxisType(scores);
    const myersType = getMyersType(scores);
    const indicatorType = getIndicatorType(scores);

    const modelTypes = [
        axisType,
        myersType,
        indicatorType
    ];

    const count = {};

    modelTypes.forEach(type => {
        count[type] = (count[type] || 0) + 1;
    });

    const mainType = Object.entries(count).sort(
        (a, b) => b[1] - a[1]
    )[0][0];

    document.getElementById("main-type").textContent = mainType;
    document.getElementById("animated-type").textContent = mainType;
    document.getElementById("axis-type").textContent = axisType;
    document.getElementById("myers-type").textContent = myersType;
    document.getElementById("indicator-type").textContent = indicatorType;
    document.getElementById("result-description").textContent =
        descriptions[mainType];

    renderFunctions(normalized);

    document.getElementById("consensus-text").textContent =
        calculateConsensus(modelTypes);

    quiz.classList.add("hidden");
    intro.classList.add("hidden");
    result.classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");

    const light = document.body.classList.contains("light");

    themeToggle.textContent = light ? "🌙" : "☀️";

    localStorage.setItem(
        "mbti-theme",
        light ? "light" : "dark"
    );
});

function loadTheme() {
    const savedTheme = localStorage.getItem("mbti-theme");

    if (savedTheme === "light") {
        document.body.classList.add("light");
        themeToggle.textContent = "🌙";
    } else {
        themeToggle.textContent = "☀️";
    }
}

startBtn.addEventListener("click", startTest);
restartBtn.addEventListener("click", startTest);
nextBtn.addEventListener("click", nextQuestion);
prevBtn.addEventListener("click", previousQuestion);

document.addEventListener("keydown", event => {
    if (quiz.classList.contains("hidden")) return;

    if (event.key === "ArrowRight") {
        nextQuestion();
    }

    if (event.key === "ArrowLeft") {
        previousQuestion();
    }
});

loadTheme();