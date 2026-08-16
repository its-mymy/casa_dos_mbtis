const questions = [ 

    // NI

    { q: "Tenho insights repentinos que parecem surgir do nada, mas que depois fazem sentido para mim.", w: { Ne: 1, Ni: 3, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } }, 
    { q: "Costumo procurar o significado mais profundo ou o padrão central por trás dos acontecimentos.", w: { Ne: 1, Ni: 3, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } }, 
    { q: "Quando penso no futuro, geralmente surge uma direção que parece mais provável ou significativa do que as outras.", w: { Ne: 1, Ni: 3, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } }, 
    { q: "Prefiro aprofundar uma ideia até compreender suas implicações, em vez de continuar abrindo novas possibilidades.", w: { Ne: 1, Ni: 3, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } }, 
    { q: "Sinto que minhas ideias vão se organizando internamente até convergirem para uma compreensão mais definida.", w: { Ne: 1, Ni: 3, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } }, 
    { q: "Às vezes percebo como uma situação provavelmente vai se desenvolver antes de conseguir explicar exatamente como cheguei a essa conclusão.", w: { Ne: 1, Ni: 3, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } }, 
    { q: "Tenho facilidade em resumir conceitos complexos em uma única ideia que representa o que considero essencial.", w: { Ne: 1, Ni: 3, Ti: 1, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } }, 
    { q: "Quando penso sobre uma situação, tendo a reunir as informações até formar uma interpretação principal, em vez de manter várias interpretações abertas.", w: { Ne: 1, Ni: 3, Ti: 1, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } }, 
    { q: "Quando penso no que pode acontecer no futuro, geralmente procuro entender qual direção parece mais provável, em vez de imaginar muitos caminhos diferentes.", w: { Ne: 0, Ni: 3, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } }, 
    { q: "Quando várias informações parecem estar relacionadas, minha tendência é procurar o padrão que conecta todas elas e chegar a uma compreensão mais unificada.", w: { Ne: 1, Ni: 3, Ti: 1, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } }, 

    // NE 

    { q: "Eu me divirto mais na parte de criar uma ideia do que na parte de executá-la.", w: { Ne: 3, Ni: 1, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } }, 
    { q: "É mais natural para mim conectar ideias diferentes do que aprofundar uma única ideia até o fim.", w: { Ne: 3, Ni: 1, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } }, 
    { q: "Fico naturalmente interessado quando começo a perceber novas possibilidades para uma situação.", w: { Ne: 3, Ni: 1, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } }, 
    { q: "Genuinamente não gosto de fechar portas ou descartar opções, porque cada possibilidade pode levar a uma descoberta inesperada.", w: { Ne: 3, Ni: 1, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } }, 
    { q: "Frequentemente uma ideia me leva a outra, que leva a outra, fazendo meu pensamento seguir várias direções.", w: { Ne: 3, Ni: 0, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } }, 
    { q: "Gosto de imaginar situações hipotéticas e explorar o que poderia acontecer se determinada coisa fosse diferente.", w: { Ne: 3, Ni: 1, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } }, 
    { q: "Minha mente costuma fazer associações espontâneas enquanto converso, leio ou observo alguma coisa.", w: { Ne: 3, Ni: 1, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } }, 
    { q: "Quando uma ideia chama minha atenção, é comum ela gerar outras possibilidades e perguntas em vez de me levar imediatamente a uma conclusão única.", w: { Ne: 3, Ni: 0, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } }, 
    { q: "Ao receber uma informação nova, costumo fazer várias associações e pensar em diferentes coisas que poderiam estar relacionadas a ela.", w: { Ne: 3, Ni: 1, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } }, 
    { q: "Quando tento compreender uma situação complexa, tendo a explorar diferentes interpretações e possibilidades antes de decidir qual delas faz mais sentido.", w: { Ne: 3, Ni: 1, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } }, 

    // TI 

    { q: "Em uma discussão, eu: (A) busco a verdade LÓGICA, mesmo que isso signifique discordar de todo mundo OU (B) busco um consenso que funcione para todos.", w: { Ti: 3, Te: 0, Ne: 0, Ni: 0, Si: 0, Se: 0, Fi: 0, Fe: 0 } }, 
    { q: "Gosto de usar a lógica para resolver problemas, mas não preciso ficar analisando tudo até o último detalhe.", w: { Ti: 3, Te: 1, Ne: 0, Se: 1, Ni: 0, Si: 0, Fi: 0, Fe: 0 } }, 
    { q: "Uso minha capacidade analítica para explorar possibilidades e encontrar soluções criativas para problemas.", w: { Ti: 3, Te: 0, Ne: 0, Se: 0, Ni: 0, Si: 0, Fi: 0, Fe: 0 } }, 
    { q: "Minhas decisões são baseadas principalmente na análise lógica, não em emoções ou na opinião dos outros.", w: { Ti: 3, Te: 1, Fi: 0, Fe: 0, Ne: 0, Ni: 0, Se: 0, Si: 0 } }, 
    { q: "Preciso entender a lógica interna das coisas antes de aceitá-las como verdade. Não confio em algo só porque 'é assim que sempre foi feito'.", w: { Ti: 3, Te: 1, Fi: 0, Fe: 0, Ne: 0, Ni: 0, Se: 0, Si: 0 } }, 
    { q: "Fico frustrado quando as pessoas usam argumentos emocionais ou apelos à autoridade em vez de lógica.", w: { Ti: 3, Te: 1, Fi: 0, Fe: 0, Ne: 0, Ni: 0, Se: 0, Si: 0 } }, 
    { q: "Prefiro entender o 'porquê' das coisas do que simplesmente saber 'como' fazer.", w: { Ti: 3, Te: 0, Fi: 0, Fe: 0, Ne: 0, Ni: 0, Se: 0, Si: 0 } }, 
    { q: "Sou atraído por quebra-cabeças, enigmas e problemas que exigem raciocínio lógico.", w: { Ti: 3, Te: 1, Fi: 0, Fe: 0, Ne: 0, Ni: 0, Se: 0, Si: 0 } }, 
    { q: "Antes de tomar uma posição sobre algo, preciso dissecar o assunto de todos os ângulos possíveis.", w: { Ti: 3, Te: 0, Fi: 0, Fe: 0, Ne: 0, Ni: 0, Se: 0, Si: 0 } }, 
    { q: "Quando algo não faz sentido para mim, fico tentando entender onde está o erro até conseguir montar uma explicação que seja logicamente coerente e faça sentido pra mim.", w: { Ti: 3, Te: 1, Ne: 0, Ni: 0, Se: 0, Si: 0, Fi: 1, Fe: 0 } }, 

    // TE 

    { q: "Sinto que perco tempo quando fico divagando em ideias que não têm aplicação prática.", w: { Ne: 0, Ni: 0, Ti: 0, Te: 3, Si: 1, Se: 0, Fi: 0, Fe: 0 } }, 
    { q: "Sou naturalmente orientado a resultados e gosto de sentir que estou fazendo algo que realmente leva a algum resultado.", w: { Te: 3, Ti: 0, Se: 0, Si: 0, Ne: 0, Ni: 0, Fi: 0, Fe: 0 } }, 
    { q: "Tenho facilidade para organizar pessoas e recursos para alcançar metas claras.", w: { Te: 3, Ti: 0, Se: 0, Si: 0, Ne: 0, Ni: 0, Fi: 0, Fe: 0 } }, 
    { q: "Fico frustrado quando percebo que algo poderia ser feito de forma mais eficiente, mas ninguém tenta melhorar.", w: { Te: 3, Ti: 0, Se: 0, Si: 0, Ne: 0, Ni: 0, Fi: 0, Fe: 0 } }, 
    { q: "Ao tomar uma decisão, costumo considerar fatos, dados e informações que possam ajudar a escolher a melhor opção.", w: { Te: 3, Ti: 1, Se: 0, Si: 1, Ne: 0, Ni: 0, Fi: 0, Fe: 0 } }, 
    { q: "Gosto de criar sistemas, processos e estruturas que tornem o trabalho mais eficiente.", w: { Te: 3, Ti: 1, Se: 0, Si: 1, Ne: 0, Ni: 0, Fi: 0, Fe: 0 } }, 
    { q: "Sou bom em dividir tarefas e organizar o que precisa ser feito para que um objetivo seja alcançado.", w: { Te: 3, Ti: 0, Se: 0, Si: 0, Ne: 0, Ni: 0, Fi: 0, Fe: 0 } }, 
    { q: "Fico impaciente quando uma discussão fica apenas na teoria e ninguém pensa em como colocar a ideia em prática.", w: { Te: 3, Ti: 0, Se: 1, Si: 0, Ne: 0, Ni: 0, Fi: 0, Fe: 0 } }, 
    { q: "Consigo ser bastante organizado e eficiente, mas não sinto necessidade de estar o tempo todo produzindo ou organizando coisas.", w: { Te: 3, Ti: 0, Ni: 0, Si: 1, Se: 0, Ne: 0, Fi: 0, Fe: 0 } }, 
    { q: "Uso minha capacidade de organização e planejamento para colocar em prática aquilo que considero importante.", w: { Te: 3, Ti: 0, Ni: 1, Si: 1, Se: 0, Ne: 0, Fi: 0, Fe: 0 } }, 

    // SE 

    { q: "Tomar decisões baseadas em 'intuição' ou 'pressentimento' me parece arriscado e pouco confiável.", w: { Ni: 0, Ne: 0, Ti: 1, Te: 0, Si: 0, Se: 3, Fi: 0, Fe: 0 } }, 
    { q: "Minha energia vem da ação e do movimento. Ficar parado por muito tempo me deixa inquieto.", w: { Se: 3, Si: 0, Ne: 0, Ni: 0, Ti: 0, Te: 0, Fi: 0, Fe: 0 } }, 
    { q: "Tenho reflexos rápidos e sou bom em reagir a mudanças inesperadas no ambiente.", w: { Se: 3, Si: 0, Ne: 0, Ni: 0, Ti: 0, Te: 0, Fi: 0, Fe: 0 } }, 
    { q: "Sou atraído por experiências que envolvem meus sentidos: texturas, sabores, cheiros, sons e imagens.", w: { Se: 3, Si: 1, Ne: 0, Ni: 0, Ti: 0, Te: 0, Fi: 0, Fe: 0 } }, 
    { q: "Fico entediado com teorias muito abstratas e prefiro quando uma conversa leva a algo que possa ser feito na prática logo, em vez de ficar teorizando muito.", w: { Se: 3, Si: 0, Ne: 0, Ni: 0, Ti: 1, Te: 1, Fi: 0, Fe: 0 } }, 
    { q: "Gosto de atividades físicas e de sentir que estou usando meu corpo para fazer algo.", w: { Se: 3, Si: 0, Ne: 0, Ni: 0, Ti: 0, Te: 0, Fi: 0, Fe: 0 } }, 
    { q: "Aprendo melhor quando posso experimentar e descobrir as coisas fazendo, em vez de apenas ler ou ouvir sobre elas.", w: { Se: 3, Si: 1, Ne: 0, Ni: 0, Ti: 0, Te: 0, Fi: 0, Fe: 0 } }, 
    { q: "Reparo facilmente em detalhes que estão acontecendo ao meu redor, como mudanças no ambiente, expressões, movimentos e sons.", w: { Se: 3, Si: 1, Ne: 0, Ni: 0, Ti: 0, Te: 0, Fi: 1, Fe: 0 } }, 
    { q: "Sou bom em improvisar e me adaptar rapidamente quando algo inesperado acontece.", w: { Se: 3, Si: 0, Ne: 0, Ni: 0, Ti: 0, Te: 0, Fi: 0, Fe: 0 } }, 
    { q: "Sou uma pessoa prática e gosto de lidar diretamente com coisas que posso ver, tocar e experimentar.", w: { Se: 3, Si: 1, Ne: 0, Ni: 0, Ti: 0, Te: 1, Fi: 0, Fe: 0 } }, 

    // SI

    { q: "Prefiro planejar com antecedência a improvisar na hora.", w: { Ni: 0, Ne: 0, Ti: 1, Te: 0, Si: 3, Se: 0, Fi: 0, Fe: 0 } }, 
    { q: "Costumo lembrar de detalhes específicos de experiências que vivi, como o que aconteceu, como era o lugar e como me senti naquele momento.", w: { Si: 3, Se: 0, Ne: 0, Ni: 0, Ti: 0, Te: 0, Fi: 0, Fe: 0 } }, 
    { q: "Quando passo por uma situação parecida com algo que já vivi, naturalmente comparo o que está acontecendo com minha experiência anterior.", w: { Si: 3, Se: 1, Ne: 0, Ni: 0, Ti: 0, Te: 0, Fi: 0, Fe: 0 } }, 
    { q: "Gosto de aprender com aquilo que já aconteceu e usar essas experiências como referência para minhas decisões.", w: { Si: 3, Se: 0, Ne: 0, Ni: 0, Ti: 0, Te: 1, Fi: 0, Fe: 0 } }, 
    { q: "Costumo perceber quando algo está diferente de como eu me lembro ou de como normalmente acontece.", w: { Si: 3, Se: 1, Ne: 0, Ni: 0, Ti: 0, Te: 0, Fi: 0, Fe: 0 } }, 
    { q: "Mudanças bruscas podem me deixar desconfortável quando alteram algo que eu já estava acostumado a fazer de determinada maneira.", w: { Si: 3, Se: 0, Ne: 0, Ni: 0, Ti: 0, Te: 0, Fi: 0, Fe: 0 } }, 
    { q: "Quando preciso decidir o que fazer, muitas vezes lembro de situações anteriores para descobrir o que funcionou ou não naquela época.", w: { Si: 3, Se: 0, Ne: 0, Ni: 0, Ti: 0, Te: 0, Fi: 0, Fe: 0 } }, 
    { q: "Costumo guardar informações e detalhes que considero importantes porque posso precisar deles novamente no futuro.", w: { Si: 3, Se: 0, Ne: 0, Ni: 0, Ti: 1, Te: 0, Fi: 0, Fe: 0 } }, 
    { q: "Quando conheço algo novo, gosto de relacioná-lo com experiências que já tive para entender melhor o que estou vendo.", w: { Si: 3, Se: 0, Ne: 0, Ni: 1, Ti: 0, Te: 0, Fi: 0, Fe: 0 } }, 
    { q: "Tenho facilidade para lembrar como uma experiência foi para mim, inclusive detalhes sensoriais como cheiros, sons, sabores ou sensações físicas.", w: { Si: 3, Se: 1, Ne: 0, Ni: 0, Ti: 0, Te: 0, Fi: 1, Fe: 0 } }, 

    // FI

    { q: "Tenhho valores fortes, mas não me fecho para perspectivas diferentes que possam enriquecer minha visão.", w: { Fi: 3, Fe: 1, Ne: 1, Se: 1, Si: 0, Ni: 0, Ti: 0, Te: 0 } }, 
    { q: "Uso meus valores pessoais como guia, mas estou aberto a aprender com as experiências do mundo.", w: { Fi: 3, Fe: 1, Ne: 1, Se: 1, Si: 0, Ni: 0, Ti: 0, Te: 0 } }, 
    { q: "Sinto uma forte necessidade de ser autêntico e verdadeiro comigo mesmo, independentemente das expectativas externas.", w: { Fi: 3, Fe: 1, Se: 0, Si: 0, Ne: 0, Ni: 0, Ti: 0, Te: 0 } }, 
    { q: "Minhas emoções são profundas e pessoais, e costumo processá-las dentro de mim antes de compartilhá-las com outras pessoas.", w: { Fi: 3, Fe: 0, Ti: 0, Te: 0, Se: 0, Si: 0, Ne: 0, Ni: 0 } }, 
    { q: "Quando me expresso artisticamente ou criativamente, sinto que estou colocando uma parte de quem eu sou naquilo que faço.", w: { Fi: 3, Fe: 1, Ti: 0, Te: 0, Se: 0, Si: 0, Ne: 0, Ni: 0 } }, 
    { q: "Prefiro ser sincero sobre o que realmente penso e sinto, mesmo quando isso pode não agradar todo mundo.", w: { Fi: 3, Fe: 1, Ti: 0, Te: 0, Se: 0, Si: 0, Ne: 0, Ni: 0 } }, 
    { q: "Costumo prestar atenção ao que sinto por dentro para perceber se algo realmente está de acordo com o que considero certo para mim.", w: { Fi: 3, Fe: 1, Ti: 0, Te: 0, Se: 0, Si: 0, Ne: 0, Ni: 0 } }, 
    { q: "Prefiro que as pessoas me conheçam como eu realmente sou, em vez de criar uma imagem de mim apenas para agradá-las.", w: { Fi: 3, Fe: 1, Ti: 0, Te: 0, Se: 0, Si: 0, Ne: 0, Ni: 0 } }, 
    { q: "Sou fiel ao que considero importante para mim, mas continuo aberto a conhecer maneiras diferentes de pensar e viver.", w: { Fi: 3, Fe: 1, Ne: 1, Se: 0, Ti: 0, Te: 0, Si: 0, Ni: 0 } }, 
    { q: "Minha identidade é importante para mim, mas também pode mudar conforme vivo novas experiências e descubro coisas sobre mim mesmo.", w: { Fi: 3, Fe: 1, Ne: 1, Se: 1, Ti: 0, Te: 0, Si: 0, Ni: 0 } }, 


    // FE

    { q: "Minhas decisões levam em conta principalmente como elas vão afetar as pessoas ao meu redor.", w: { Ne: 0, Ni: 0, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 1, Fe: 3 } }, 
    { q: "Me sinto desconfortável quando há uma desarmonia NO GRUPO.", w: { Ne: 0, Ni: 0, Ti: 0, Te: 0, Si: 0, Se: 0, Fi: 0, Fe: 3 } }, 
    { q: "Consigo perceber rapidamente o que os outros estão sentindo, mesmo antes deles mesmos colocarem em palavras.", w: { Fe: 3, Fi: 1, Se: 0, Si: 0, Ne: 0, Ni: 0, Ti: 0, Te: 0 } }, 
    { q: "Sou bom em criar uma boa primeira impressão e causar impacto positivo nas pessoas.", w: { Fe: 3, Fi: 0, Se: 1, Si: 0, Ne: 0, Ni: 0, Ti: 0, Te: 0 } }, 
    { q: "Se eu tiver que escolher entre: (A) dizer a verdade direta e seca ou (B) suavizar para amenizar o impacto e me adaptar para não deixar o clima muito pesado, escolho B.", w: { Fi: 1, Fe: 3, Se: 0, Si: 0, Ne: 0, Ni: 0, Ti: 0, Te: 0 } }, 
    { q: "Sinto que fiz a coisa certa quando consigo manter as pessoas importantes para mim bem e satisfeitas com a situação.", w: { Fe: 3, Fi: 1, Se: 0, Si: 0, Ne: 0, Ni: 0, Te: 0, Ti: 0 } }, 
    { q: "Sinto mais satisfação quando percebo que as pessoas ao meu redor estão bem e o ambiente entre nós está harmonioso.", w: { Fe: 3, Fi: 1, Se: 0, Si: 0, Ne: 0, Ni: 0, Te: 0, Ti: 0 } }, 
    { q: "Minhas decisões são fortemente influenciadas por como elas vão afetar as pessoas ao meu redor.", w: { Fe: 3, Fi: 0, Se: 0, Si: 0, Ne: 0, Ni: 0, Ti: 0, Te: 0 } }, 
    { q: "Consigo perceber facilmente o que as pessoas estão sentindo e costumo levar isso em consideração na forma como ajo com elas.", w: { Fe: 3, Fi: 1, Se: 0, Si: 0, Ne: 0, Ni: 0, Ti: 0, Te: 0 } }, 
    { q: "Quando percebo que alguém está desconfortável em uma situação, tenho vontade de mudar minha forma de agir ou falar para deixar o ambiente mais agradável.", w: { Fe: 3, Fi: 0, Se: 0, Si: 0, Ne: 0, Ni: 0, Ti: 0, Te: 0 } } 

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