const dimensoes = {

    preguiça: {

        nome: "Preguiça",

        cor: "#bd94ff",

        classe: "purple-text",

        simbolo: "☾",

        descricao: "Procrastinação, adiamento e resistência a tarefas que exigem esforço.",

        alta: "Você tende a adiar tarefas, buscar conforto ou esperar a motivação aparecer antes de agir.",

        baixa: "Você tende a começar tarefas sem adiá-las tanto e demonstra disposição para colocar as coisas em prática."

    },

    competencia: {

        nome: "Competência",

        cor: "#65dfb5",

        classe: "green-text",

        simbolo: "✦",

        descricao: "Organização, iniciativa, autonomia e capacidade de resolver problemas.",

        alta: "Você relata facilidade para se organizar, tomar iniciativa e cumprir suas responsabilidades.",

        baixa: "Pode ser mais difícil manter uma rotina, começar tarefas ou concluir planos de maneira consistente."

    },

    ansiedade: {

        nome: "Ansiedade",

        cor: "#ff83bb",

        classe: "pink-text",

        simbolo: "♡",

        descricao: "Preocupação antecipada, pensamentos repetitivos e dificuldade para relaxar.",

        alta: "Suas respostas indicam uma tendência maior a se preocupar, antecipar problemas ou pensar demais.",

        baixa: "Você relata menos tendência aos padrões de preocupação descritos neste questionário."

    },

    alerta: {

        nome: "Alerta",

        cor: "#ffd078",

        classe: "yellow-text",

        simbolo: "◉",

        descricao: "Atenção ao ambiente, percepção de mudanças e prontidão para reagir.",

        alta: "Você relata observar o ambiente, perceber detalhes e prestar atenção a possíveis mudanças.",

        baixa: "Você pode não dedicar tanta atenção a detalhes do ambiente ou a sinais sutis em determinadas situações."

    },

    calma: {

        nome: "Calma",

        cor: "#82bfff",

        classe: "blue-text",

        simbolo: "☁",

        descricao: "Paciência, serenidade diante de imprevistos e controle das reações.",

        alta: "Você relata facilidade para desacelerar, lidar com imprevistos e pensar antes de reagir.",

        baixa: "Pode ser mais difícil desacelerar ou manter a serenidade em algumas situações de pressão."

    }

};



const perguntas = [

    // PREGUIÇA — 1 a 5

    {

        categoria: "preguiça",

        texto: "Quando tenho uma tarefa importante, costumo deixá-la para depois mesmo tendo tempo para fazê-la."

    },

    {

        categoria: "preguiça",

        texto: "Se posso escolher entre resolver algo agora ou adiar, geralmente escolho adiar."

    },

    {

        categoria: "preguiça",

        texto: "Preciso estar com muita vontade para começar uma atividade que exige esforço."

    },

    {

        categoria: "preguiça",

        texto: "Às vezes, passo tanto tempo pensando em fazer algo que acabo nem começando."

    },

    {

        categoria: "preguiça",

        texto: "Quando uma tarefa parece cansativa ou complicada, procuro maneiras de adiá-la ou torná-la menos trabalhosa."

    },



    // COMPETÊNCIA — 6 a 10

    {

        categoria: "competencia",

        texto: "Mesmo sem ninguém cobrando, consigo me organizar para cumprir minhas responsabilidades."

    },

    {

        categoria: "competencia",

        texto: "Quando surge um problema, tento encontrar uma solução por conta própria antes de desistir."

    },

    {

        categoria: "competencia",

        texto: "Costumo terminar aquilo que começo, mesmo quando perco um pouco do entusiasmo inicial."

    },

    {

        categoria: "competencia",

        texto: "Consigo tomar decisões e assumir as consequências delas sem depender sempre de outra pessoa."

    },

    {

        categoria: "competencia",

        texto: "Mesmo quando estou desmotivado, consigo manter o compromisso com aquilo que considero importante."

    },



    // ANSIEDADE — 11 a 15

    {

        categoria: "ansiedade",

        texto: "Costumo imaginar várias coisas que podem dar errado antes mesmo de algo acontecer."

    },

    {

        categoria: "ansiedade",

        texto: "Mesmo quando tudo parece estar bem, minha mente encontra motivos para se preocupar."

    },

    {

        categoria: "ansiedade",

        texto: "Fico revivendo conversas ou situações, pensando no que deveria ter feito diferente."

    },

    {

        categoria: "ansiedade",

        texto: "Tenho dificuldade para relaxar quando sei que ainda existe algo pendente."

    },

    {

        categoria: "ansiedade",

        texto: "Quando tenho algo importante pela frente, penso tanto nas possibilidades que tenho dificuldade para me concentrar no presente."

    },



    // ALERTA — 16 a 20

    {

        categoria: "alerta",

        texto: "Percebo rapidamente quando o clima de um ambiente muda ou alguém parece agir de maneira diferente."

    },

    {

        categoria: "alerta",

        texto: "Geralmente noto detalhes que outras pessoas deixam passar despercebidos."

    },

    {

        categoria: "alerta",

        texto: "Antes de confiar em uma situação ou pessoa, observo o comportamento e procuro sinais de que algo está errado."

    },

    {

        categoria: "alerta",

        texto: "Quando acontece algo inesperado, costumo observar o que está acontecendo antes de agir."

    },

    {

        categoria: "alerta",

        texto: "Em ambientes novos, costumo prestar atenção nas pessoas, nas mudanças e no que acontece ao meu redor."

    },



    // CALMA — 21 a 25

    {

        categoria: "calma",

        texto: "Quando algo sai diferente do planejado, consigo me adaptar sem perder a cabeça."

    },

    {

        categoria: "calma",

        texto: "Mesmo quando alguém está irritado comigo, geralmente consigo responder sem reagir imediatamente no impulso."

    },

    {

        categoria: "calma",

        texto: "Consigo descansar sem sentir que preciso estar fazendo alguma coisa o tempo inteiro."

    },

    {

        categoria: "calma",

        texto: "Quando enfrento um problema, consigo separar o que posso resolver agora daquilo que precisa esperar."

    }
];


const respostas = new Array(perguntas.length).fill(null);
const inicio = document.getElementById("inicio");
const areaQuiz = document.getElementById("areaQuiz");
const resultado = document.getElementById("resultado");
const botaoComecar = document.getElementById("comecar");
const botaoVoltar = document.getElementById("voltar");
const botaoProxima = document.getElementById("proxima");
const botaoRefazer = document.getElementById("refazer");
const botaoBaixar = document.getElementById("baixar");
const elementoContador = document.getElementById("contador");
const elementoProgresso = document.getElementById("progresso");
const elementoNumero = document.getElementById("numeroGrande");
const elementoPergunta = document.getElementById("pergunta");
const elementoOpcoes = document.getElementById("opcoes");



let perguntaAtual = 0;

let pontuacoesFinais = {};



function iniciarQuiz() {

    perguntaAtual = 0;

    respostas.fill(null);



    inicio.classList.add("hidden");

    resultado.classList.add("hidden");

    areaQuiz.classList.remove("hidden");



    renderizarPergunta();

    window.scrollTo({ top: 0, behavior: "smooth" });

}



function renderizarPergunta() {
    const pergunta = perguntas[perguntaAtual];
    const dimensao = dimensoes[pergunta.categoria];
    elementoContador.textContent = `PERGUNTA ${perguntaAtual + 1} DE ${perguntas.length}`;
    elementoProgresso.style.width =  `${((perguntaAtual + 1) / perguntas.length) * 100}%`;
    elementoNumero.textContent = String(perguntaAtual + 1).padStart(2, "0");
    elementoPergunta.textContent = pergunta.texto;
    elementoOpcoes.querySelectorAll(".answer-option").forEach(botao => {
        const valor = Number(botao.dataset.value);
        const selecionado = respostas[perguntaAtual] === valor;
        botao.classList.toggle("selected", selecionado);
        botao.setAttribute("aria-pressed", String(selecionado));

    });

    botaoVoltar.disabled = perguntaAtual === 0;
    botaoProxima.disabled = respostas[perguntaAtual] === null;
    botaoProxima.innerHTML = perguntaAtual === perguntas.length - 1

            ? 'Ver meu resultado <span>→</span>'

            : 'Próxima <span>→</span>';

}



elementoOpcoes.addEventListener("click", evento => {

    const botao = evento.target.closest(".answer-option");



    if (!botao) return;



    respostas[perguntaAtual] = Number(botao.dataset.value);

    renderizarPergunta();

});



botaoComecar.addEventListener("click", iniciarQuiz);



botaoVoltar.addEventListener("click", () => {

    if (perguntaAtual <= 0) return;



    perguntaAtual--;

    renderizarPergunta();

});


botaoProxima.addEventListener("click", () => {

    if (respostas[perguntaAtual] === null) return;
    if (perguntaAtual < perguntas.length - 1) {

        perguntaAtual++;

        renderizarPergunta();

        window.scrollTo({ top: 0, behavior: "smooth" });

        return;

    }

    mostrarResultados();

});



function calcularPontuacoes() {

    const resultados = {};



    Object.keys(dimensoes).forEach(categoria => {

        const indices = perguntas

            .map((pergunta, indice) => ({ pergunta, indice }))

            .filter(item => item.pergunta.categoria === categoria);



        const total = indices.reduce((soma, item) => {

            return soma + respostas[item.indice];

        }, 0);

        resultados[categoria] = Math.round(total / indices.length);

    });



    return resultados;

}



function obterFaixa(valor) {

    if (valor >= 70) return "Tendência mais presente";

    if (valor >= 40) return "Tendência intermediária";

    return "Tendência menos presente";

}



function obterDescricao(categoria, valor) {

    const dimensao = dimensoes[categoria];



    if (valor >= 70) return dimensao.alta;

    if (valor >= 40) {

        return `${dimensao.descricao} Suas respostas indicam uma presença intermediária dessa tendência.`;

    }

    return dimensao.baixa;

}



function mostrarResultados() {

    pontuacoesFinais = calcularPontuacoes();



    areaQuiz.classList.add("hidden");

    resultado.classList.remove("hidden");



    const ordenadas = Object.entries(pontuacoesFinais)

        .sort((a, b) => b[1] - a[1]);



    const [categoriaPrincipal, valorPrincipal] = ordenadas[0];

    const dimensaoPrincipal = dimensoes[categoriaPrincipal];



    document.getElementById("iconeDestaque").textContent =

        dimensaoPrincipal.simbolo;



    document.getElementById("iconeDestaque").style.color =

        dimensaoPrincipal.cor;



    document.getElementById("iconeDestaque").style.background =

        `${dimensaoPrincipal.cor}20`;



    document.getElementById("tituloResultado").textContent =

        dimensaoPrincipal.nome;



    document.getElementById("descricaoResultado").textContent =

        obterDescricao(categoriaPrincipal, valorPrincipal);



    renderizarCards(pontuacoesFinais);

    renderizarBarras(pontuacoesFinais);



    resultado.scrollIntoView({ behavior: "smooth", block: "start" });



    requestAnimationFrame(desenharGrafico);

}



function renderizarCards(pontuacoes) {

    const lista = document.getElementById("listaPontuacoes");

    lista.innerHTML = "";



    Object.entries(dimensoes).forEach(([categoria, dimensao]) => {

        const valor = pontuacoes[categoria];



        const card = document.createElement("article");

        card.className = "score-card";



        const topo = document.createElement("div");

        topo.className = "score-top";



        const nome = document.createElement("div");

        nome.className = "score-name";



        const simbolo = document.createElement("span");

        simbolo.className = "score-symbol";

        simbolo.textContent = dimensao.simbolo;

        simbolo.style.color = dimensao.cor;



        const textoNome = document.createElement("span");

        textoNome.textContent = dimensao.nome;



        nome.append(simbolo, textoNome);



        const valorTexto = document.createElement("strong");

        valorTexto.className = "score-value";

        valorTexto.textContent = `${valor}%`;

        valorTexto.style.color = dimensao.cor;



        topo.append(nome, valorTexto);



        const descricao = document.createElement("p");

        descricao.textContent = obterFaixa(valor);



        const trilho = document.createElement("div");

        trilho.className = "score-track";



        const preenchimento = document.createElement("div");

        preenchimento.className = "score-fill";

        preenchimento.style.width = `${valor}%`;

        preenchimento.style.background = dimensao.cor;



        trilho.appendChild(preenchimento);

        card.append(topo, descricao, trilho);

        lista.appendChild(card);

    });

}



function renderizarBarras(pontuacoes) {

    const container = document.getElementById("barrasResultado");

    container.innerHTML = "";



    Object.entries(dimensoes).forEach(([categoria, dimensao]) => {

        const valor = pontuacoes[categoria];



        const linha = document.createElement("div");

        linha.className = "bar-row";



        const legenda = document.createElement("div");

        legenda.className = "bar-label-line";



        const nome = document.createElement("span");

        nome.textContent = dimensao.nome;



        const porcentagem = document.createElement("strong");

        porcentagem.textContent = `${valor}%`;

        porcentagem.style.color = dimensao.cor;



        legenda.append(nome, porcentagem);



        const trilho = document.createElement("div");

        trilho.className = "score-track";



        const barra = document.createElement("div");

        barra.className = "score-fill";

        barra.style.width = `${valor}%`;

        barra.style.background = dimensao.cor;



        trilho.appendChild(barra);

        linha.append(legenda, trilho);

        container.appendChild(linha);

    });

}



function desenharGrafico() {

    const canvas = document.getElementById("graficoRadar");

    const contexto = canvas.getContext("2d");



    const dimensoesLista = Object.entries(dimensoes);

    const larguraCSS = Math.max(280, canvas.parentElement.clientWidth);

    const alturaCSS = Math.min(390, Math.max(300, larguraCSS * 0.9));

    const escala = Math.min(window.devicePixelRatio || 1, 2);



    canvas.width = Math.round(larguraCSS * escala);

    canvas.height = Math.round(alturaCSS * escala);

    canvas.style.width = `${larguraCSS}px`;

    canvas.style.height = `${alturaCSS}px`;



    contexto.scale(escala, escala);

    contexto.clearRect(0, 0, larguraCSS, alturaCSS);



    const centroX = larguraCSS / 2;

    const centroY = alturaCSS / 2;

    const raio = Math.min(larguraCSS * 0.29, alturaCSS * 0.31);

    const quantidade = dimensoesLista.length;

    const anguloInicial = -Math.PI / 2;



    function ponto(indice, fator) {

        const angulo = anguloInicial + (Math.PI * 2 * indice) / quantidade;



        return {

            x: centroX + Math.cos(angulo) * raio * fator,

            y: centroY + Math.sin(angulo) * raio * fator

        };

    }



    contexto.lineWidth = 1;

    contexto.strokeStyle = "rgba(200, 180, 225, 0.17)";



    for (let nivel = 1; nivel <= 4; nivel++) {

        contexto.beginPath();



        dimensoesLista.forEach((_, indice) => {

            const p = ponto(indice, nivel / 4);



            if (indice === 0) contexto.moveTo(p.x, p.y);

            else contexto.lineTo(p.x, p.y);

        });



        contexto.closePath();

        contexto.stroke();

    }



    dimensoesLista.forEach((_, indice) => {

        const p = ponto(indice, 1);



        contexto.beginPath();

        contexto.moveTo(centroX, centroY);

        contexto.lineTo(p.x, p.y);

        contexto.stroke();

    });



    contexto.beginPath();



    dimensoesLista.forEach(([categoria], indice) => {

        const p = ponto(indice, pontuacoesFinais[categoria] / 100);



        if (indice === 0) contexto.moveTo(p.x, p.y);

        else contexto.lineTo(p.x, p.y);

    });



    contexto.closePath();

    contexto.fillStyle = "rgba(189, 148, 255, 0.18)";

    contexto.fill();

    contexto.strokeStyle = "#c7a3ff";

    contexto.lineWidth = 2.5;

    contexto.stroke();



    dimensoesLista.forEach(([categoria, dimensao], indice) => {

        const p = ponto(indice, pontuacoesFinais[categoria] / 100);



        contexto.beginPath();

        contexto.arc(p.x, p.y, 4.5, 0, Math.PI * 2);

        contexto.fillStyle = dimensao.cor;

        contexto.fill();

        contexto.strokeStyle = "#15101f";

        contexto.lineWidth = 2;

        contexto.stroke();

    });



    contexto.font = "600 11px 'DM Sans', sans-serif";

    contexto.textBaseline = "middle";



    dimensoesLista.forEach(([categoria, dimensao], indice) => {

        const p = ponto(indice, 1.22);

        const angulo = anguloInicial + (Math.PI * 2 * indice) / quantidade;

        const cos = Math.cos(angulo);



        contexto.textAlign = cos > 0.25 ? "left" : cos < -0.25 ? "right" : "center";

        contexto.fillStyle = dimensao.cor;

        contexto.fillText(dimensao.nome, p.x, p.y);

    });

}



botaoBaixar.addEventListener("click", () => {

    const canvasOriginal = document.getElementById("graficoRadar");



    const exportCanvas = document.createElement("canvas");

    exportCanvas.width = 1000;

    exportCanvas.height = 1000;



    const contexto = exportCanvas.getContext("2d");

    contexto.fillStyle = "#0b0912";

    contexto.fillRect(0, 0, exportCanvas.width, exportCanvas.height);



    contexto.fillStyle = "#f7f2ff";

    contexto.textAlign = "center";

    contexto.font = "bold 38px sans-serif";

    contexto.fillText("CASA DOS MBTIs", 500, 75);



    contexto.font = "bold 30px sans-serif";

    contexto.fillText("Como sua mente funciona?", 500, 125);



    contexto.drawImage(canvasOriginal, 100, 150, 800, 610);



    const lista = Object.entries(dimensoes);

    contexto.textAlign = "left";

    contexto.font = "bold 21px sans-serif";



    lista.forEach(([categoria, dimensao], indice) => {

        const coluna = indice % 2;

        const linha = Math.floor(indice / 2);

        const x = coluna === 0 ? 100 : 525;

        const y = 815 + linha * 48;



        contexto.fillStyle = dimensao.cor;

        contexto.fillText(

            `${dimensao.nome}: ${pontuacoesFinais[categoria]}%`,

            x,

            y

        );

    });



    contexto.font = "14px sans-serif";

    contexto.fillStyle = "#9f96ae";

    contexto.textAlign = "center";

    contexto.fillText("Resultado recreativo, sem finalidade diagnóstica.", 500, 970);



    const link = document.createElement("a");

    link.download = "quiz3-resultado.png";

    link.href = exportCanvas.toDataURL("image/png");

    link.click();

});



botaoRefazer.addEventListener("click", iniciarQuiz);



let temporizadorRedesenho;



window.addEventListener("resize", () => {

    if (resultado.classList.contains("hidden")) return;



    clearTimeout(temporizadorRedesenho);

    temporizadorRedesenho = setTimeout(desenharGrafico, 120);

});
