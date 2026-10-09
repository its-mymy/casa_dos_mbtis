
const perguntas = [
    {
        texto: "Quando você chega a um ambiente completamente novo, o que chama sua atenção primeiro?",
        opcoes: [
            { texto: "Se o ambiente parece confortável e se tenho tudo de que preciso.", instinto: "sp" },
            { texto: "Como as pessoas interagem e qual parece ser a dinâmica do lugar.", instinto: "so" },
            { texto: "Se existe alguém ou alguma coisa que desperte imediatamente minha curiosidade.", instinto: "sx" }
        ]
    },
    {
        texto: "Quando sua vida fica muito corrida, o que você sente mais necessidade de recuperar?",
        opcoes: [
            { texto: "Minha conexão com as pessoas e a sensação de que ainda faço parte das coisas.", instinto: "so" },
            { texto: "Minha estabilidade, meu descanso e a sensação de que está tudo sob controle.", instinto: "sp" },
            { texto: "Minha empolgação, meu interesse e a sensação de estar vivendo algo significativo.", instinto: "sx" }
        ]
    },
    {
        texto: "Em um grupo de pessoas, qual situação tende a incomodar mais você?",
        opcoes: [
            { texto: "Perceber que não tenho recursos ou condições para lidar com o que está acontecendo.", instinto: "sp" },
            { texto: "Sentir que estou deslocado ou que não compreendo a dinâmica entre as pessoas.", instinto: "so" },
            { texto: "Não encontrar ninguém ou nada com que eu realmente me conecte.", instinto: "sx" }
        ]
    },
    {
        texto: "Ao tomar uma decisão importante, qual preocupação costuma pesar mais?",
        opcoes: [
            { texto: "As consequências práticas e como essa escolha afetará minha estabilidade.", instinto: "sp" },
            { texto: "Como a decisão afetará minhas relações, meu lugar no grupo ou meus compromissos.", instinto: "so" },
            { texto: "Se essa escolha realmente me interessa e corresponde ao que desejo intensamente.", instinto: "sx" }
        ]
    },
    {
        texto: "Quando você gosta muito de alguma coisa, como costuma demonstrar esse interesse?",
        opcoes: [
            { texto: "Procuro incorporá-la à minha rotina e encontrar uma maneira de mantê-la na minha vida.", instinto: "sp" },
            { texto: "Gosto de compartilhar esse interesse e encontrar pessoas com quem possa conversar sobre ele.", instinto: "so" },
            { texto: "Quero mergulhar nisso, explorar profundamente e sentir que existe algo especial ali.", instinto: "sx" }
        ]
    },
    {
        texto: "Qual dessas situações faria você se sentir mais vulnerável?",
        opcoes: [
            { texto: "Depender de outras pessoas para atender às minhas necessidades básicas ou resolver meus problemas.", instinto: "sp" },
            { texto: "Ficar sem apoio, sem referências sociais ou sem saber onde me encaixo.", instinto: "so" },
            { texto: "Criar uma conexão importante e perceber que ela não tem a mesma intensidade para a outra pessoa.", instinto: "sx" }
        ]
    },
    {
        texto: "Quando você começa a planejar o futuro, o que tende a considerar primeiro?",
        opcoes: [
            { texto: "Como garantir condições estáveis e evitar problemas previsíveis.", instinto: "sp" },
            { texto: "Quais oportunidades, contatos e possibilidades de participação posso construir.", instinto: "so" },
            { texto: "O que realmente quero experimentar e quais experiências não quero deixar passar.", instinto: "sx" }
        ]
    },
    {
        texto: "Durante uma conversa, o que mais desperta seu interesse?",
        opcoes: [
            { texto: "Trocar informações úteis e entender algo que possa aplicar à minha vida.", instinto: "sp" },
            { texto: "Compreender as opiniões, os valores e as relações entre as pessoas envolvidas.", instinto: "so" },
            { texto: "Explorar ideias que provoquem curiosidade e uma troca mais intensa ou pessoal.", instinto: "sx" }
        ]
    },
    {
        texto: "Quando algo ameaça mudar sua rotina, qual costuma ser sua primeira reação?",
        opcoes: [
            { texto: "Avalio como a mudança afetará meu conforto, meu tempo e minha organização.", instinto: "sp" },
            { texto: "Penso em como ela afetará meus compromissos e minha participação nos grupos.", instinto: "so" },
            { texto: "Fico curioso para descobrir o que essa mudança pode trazer de novo ou estimulante.", instinto: "sx" }
        ]
    },
    {
        texto: "Qual elogio teria um significado especial para você?",
        opcoes: [
            { texto: "Você sabe cuidar de si e consegue construir uma vida estável.", instinto: "sp" },
            { texto: "Você faz diferença para as pessoas e sabe contribuir com o que está ao seu redor.", instinto: "so" },
            { texto: "Você tem uma presença marcante e consegue despertar algo nas pessoas.", instinto: "sx" }
        ]
    },
    {
        texto: "Quando você entra em um grupo novo, como costuma encontrar seu espaço?",
        opcoes: [
            { texto: "Observando o ambiente e descobrindo como me adaptar sem comprometer meu bem-estar.", instinto: "sp" },
            { texto: "Participando das conversas, entendendo as relações e identificando interesses em comum.", instinto: "so" },
            { texto: "Procurando pessoas ou assuntos que me despertem uma conexão mais forte.", instinto: "sx" }
        ]
    },
    {
        texto: "O que mais costuma motivar você a aprender algo novo?",
        opcoes: [
            { texto: "A possibilidade de desenvolver habilidades úteis para minha independência e meu futuro.", instinto: "sp" },
            { texto: "A oportunidade de compreender melhor o mundo e participar de conversas ou projetos coletivos.", instinto: "so" },
            { texto: "A vontade de explorar algo que me fascina e me envolve de verdade.", instinto: "sx" }
        ]
    },
    {
        texto: "Em um relacionamento importante, o que você mais gostaria de preservar?",
        opcoes: [
            { texto: "Uma base confiável, com respeito aos limites e espaço para cuidar da própria vida.", instinto: "sp" },
            { texto: "A parceria, a presença mútua e a sensação de construir algo em conjunto.", instinto: "so" },
            { texto: "A química, a intensidade e a sensação de que a conexão continua viva e especial.", instinto: "sx" }
        ]
    },
    {
        texto: "Se você tivesse uma semana completamente livre, como preferiria aproveitá-la?",
        opcoes: [
            { texto: "Descansando, organizando minha vida e fazendo coisas que me tragam conforto.", instinto: "sp" },
            { texto: "Encontrando pessoas, participando de atividades e conhecendo novos ambientes.", instinto: "so" },
            { texto: "Vivendo experiências envolventes ou me dedicando intensamente a algo.", instinto: "sx" }
        ]
    },
    {
        texto: "Quando surge um problema inesperado, qual é sua prioridade inicial?",
        opcoes: [
            { texto: "Garantir que minhas necessidades imediatas estejam atendidas e que a situação não piore.", instinto: "sp" },
            { texto: "Entender quem está envolvido, quais informações faltam e como coordenar uma solução.", instinto: "so" },
            { texto: "Identificar o ponto central do problema e agir diretamente sobre aquilo que mais importa.", instinto: "sx" }
        ]
    },
    {
        texto: "Qual dessas perdas seria mais difícil de administrar?",
        opcoes: [
            { texto: "Perder a estabilidade que levei tempo para construir.", instinto: "sp" },
            { texto: "Perder minha conexão com uma comunidade ou deixar de ter um lugar entre as pessoas.", instinto: "so" },
            { texto: "Perder uma conexão especial ou algo que faz a vida parecer intensa e significativa.", instinto: "sx" }
        ]
    },
    {
        texto: "Quando você se interessa por uma causa, projeto ou movimento, o que mais atrai você?",
        opcoes: [
            { texto: "A possibilidade de produzir algo concreto e melhorar condições reais de vida.", instinto: "sp" },
            { texto: "A oportunidade de contribuir para algo coletivo e fazer parte de uma iniciativa maior.", instinto: "so" },
            { texto: "A força da ideia, o envolvimento pessoal e a possibilidade de provocar mudanças marcantes.", instinto: "sx" }
        ]
    },
    {
        texto: "Em situações sociais, qual comportamento parece mais natural para você?",
        opcoes: [
            { texto: "Escolher com cuidado onde gasto meu tempo e preservar minha energia.", instinto: "sp" },
            { texto: "Perceber as relações, acompanhar o que acontece e encontrar maneiras de participar.", instinto: "so" },
            { texto: "Investir minha atenção nas pessoas e experiências que realmente capturam meu interesse.", instinto: "sx" }
        ]
    },
    {
        texto: "Quando você sente que está perdendo o rumo, o que costuma tentar recuperar primeiro?",
        opcoes: [
            { texto: "Uma rotina funcional, condições estáveis e a capacidade de cuidar de mim.", instinto: "sp" },
            { texto: "A sensação de pertencimento, meus vínculos e uma direção dentro do mundo social.", instinto: "so" },
            { texto: "O entusiasmo, os desejos e a conexão com aquilo que faz meus olhos brilharem.", instinto: "sx" }
        ]
    },
    {
        texto: "Olhando para suas escolhas ao longo da vida, qual padrão mais se aproxima de você?",
        opcoes: [
            { texto: "Costumo priorizar o que me mantém seguro, preparado e capaz de sustentar minha própria vida.", instinto: "sp" },
            { texto: "Costumo prestar atenção ao meu lugar no mundo, às pessoas e às estruturas das quais faço parte.", instinto: "so" },
            { texto: "Costumo seguir aquilo que me mobiliza intensamente e buscar conexões ou experiências marcantes.", instinto: "sx" }
        ]
    }
];

const instintos = {
    sp: {
        nome: "Autopreservação (SP)",
        curto: "Autopreservação",
        icone: "☾",
        classe: "sp",
        cor: "#bd9aff",
        descricao: "O foco está em segurança, recursos, conforto, estabilidade e capacidade de cuidar das próprias necessidades.",
        combinacao: "Você pode prestar bastante atenção à sua organização pessoal, às condições de vida e à construção de uma base estável."
    },
    so: {
        nome: "Social (SO)",
        curto: "Social",
        icone: "✦",
        classe: "so",
        cor: "#80dfba",
        descricao: "O foco está em pertencimento, participação, relações coletivas, redes de contato e compreensão das dinâmicas sociais.",
        combinacao: "Você pode prestar bastante atenção aos grupos, às conexões entre pessoas e ao seu lugar nas comunidades de que participa."
    },
    sx: {
        nome: "Sexual (SX)",
        curto: "Sexual",
        icone: "♡",
        classe: "sx",
        cor: "#ff9fc9",
        descricao: "O foco está em atração, intensidade, química, fascínio e conexões individuais marcantes. Não se limita à sexualidade.",
        combinacao: "Você pode se interessar especialmente por experiências envolventes, afinidades intensas e conexões que despertam sua atenção."
    }
};

const inicio = document.getElementById("inicio");
const areaQuiz = document.getElementById("areaQuiz");
const resultado = document.getElementById("resultado");

const elementoContador = document.getElementById("contador");
const elementoPercentual = document.getElementById("percentual");
const elementoProgresso = document.getElementById("progresso");
const elementoNumero = document.getElementById("numeroGrande");
const elementoPergunta = document.getElementById("pergunta");
const elementoOpcoes = document.getElementById("opcoes");

const botaoComecar = document.getElementById("comecar");
const botaoVoltar = document.getElementById("voltar");
const botaoProxima = document.getElementById("proxima");
const botaoBaixar = document.getElementById("baixar");
const botaoRefazer = document.getElementById("refazer");

let perguntaAtual = 0;
let respostas = Array(perguntas.length).fill(null);
let resultadoAtual = null;

function embaralharOpcoes(opcoes, indicePergunta) {
    const copia = [...opcoes];
    let semente = (indicePergunta + 1) * 7919;

    for (let i = copia.length - 1; i > 0; i--) {
        semente = (semente * 9301 + 49297) % 233280;
        const j = Math.floor((semente / 233280) * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }

    return copia;
}

function iniciarQuiz() {
    perguntaAtual = 0;
    respostas = Array(perguntas.length).fill(null);
    resultadoAtual = null;

    inicio.classList.add("hidden");
    resultado.classList.add("hidden");
    areaQuiz.classList.remove("hidden");

    renderizarPergunta();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderizarPergunta() {
    const pergunta = perguntas[perguntaAtual];

    elementoContador.textContent =
        `PERGUNTA ${perguntaAtual + 1} DE ${perguntas.length}`;

    const percentual = Math.round(
        ((perguntaAtual + 1) / perguntas.length) * 100
    );

    elementoPercentual.textContent = `${percentual}%`;
    elementoProgresso.style.width = `${percentual}%`;
    elementoNumero.textContent = String(perguntaAtual + 1).padStart(2, "0");
    elementoPergunta.textContent = pergunta.texto;

    elementoOpcoes.innerHTML = "";

    const opcoes = embaralharOpcoes(pergunta.opcoes, perguntaAtual);

    opcoes.forEach(opcao => {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "answer-option";

        const selecionada = respostas[perguntaAtual] === opcao.instinto;

        if (selecionada) {
            botao.classList.add("selected");
        }

        botao.setAttribute("aria-pressed", String(selecionada));

        const radio = document.createElement("span");
        radio.className = "answer-radio";
        radio.setAttribute("aria-hidden", "true");

        const texto = document.createElement("span");
        texto.className = "answer-text";
        texto.textContent = opcao.texto;

        botao.append(radio, texto);

        botao.addEventListener("click", () => {
            respostas[perguntaAtual] = opcao.instinto;
            renderizarPergunta();
        });

        elementoOpcoes.appendChild(botao);
    });

    botaoVoltar.disabled = perguntaAtual === 0;
    botaoProxima.disabled = respostas[perguntaAtual] === null;

    botaoProxima.innerHTML =
        perguntaAtual === perguntas.length - 1
            ? 'Ver resultado <span>✦</span>'
            : 'Próxima <span>→</span>';
}

function avancarPergunta() {
    if (respostas[perguntaAtual] === null) return;

    if (perguntaAtual < perguntas.length - 1) {
        perguntaAtual++;
        renderizarPergunta();
        window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
        calcularResultado();
    }
}

function voltarPergunta() {
    if (perguntaAtual > 0) {
        perguntaAtual--;
        renderizarPergunta();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}

function calcularResultado() {
    const pontuacoes = { sp: 0, so: 0, sx: 0 };

    respostas.forEach(instinto => {
        if (instinto && Object.hasOwn(pontuacoes, instinto)) {
            pontuacoes[instinto]++;
        }
    });

    const ranking = Object.entries(pontuacoes)
        .sort((a, b) => b[1] - a[1]);

    const maiorPontuacao = ranking[0][1];
    const empatados = ranking.filter(item => item[1] === maiorPontuacao);

    const primeiro = ranking[0][0];
    const segundo = ranking[1][0];

    resultadoAtual = {
        pontuacoes,
        ranking,
        primeiro,
        segundo,
        empatados,
        total: respostas.filter(Boolean).length
    };

    mostrarResultado();
}

function criarCartaoPontuacao(chave, pontos, total) {
    const instinto = instintos[chave];
    const percentual = total ? Math.round((pontos / total) * 100) : 0;

    const card = document.createElement("article");
    card.className = `score-card ${instinto.classe}`;

    const icone = document.createElement("div");
    icone.className = "score-symbol";
    icone.textContent = instinto.icone;

    const nome = document.createElement("h3");
    nome.textContent = instinto.curto;

    const valor = document.createElement("strong");
    valor.textContent = `${pontos}/${total}`;

    const legenda = document.createElement("p");
    legenda.textContent = `${percentual}% das respostas`;

    card.append(icone, nome, valor, legenda);
    return card;
}

function criarBarraPontuacao(chave, pontos, total) {
    const instinto = instintos[chave];
    const percentual = total ? Math.round((pontos / total) * 100) : 0;

    const item = document.createElement("div");
    item.className = "bar-item";

    const label = document.createElement("div");
    label.className = "bar-label";

    const nome = document.createElement("span");
    nome.textContent = instinto.nome;

    const valor = document.createElement("span");
    valor.textContent = `${percentual}%`;

    label.append(nome, valor);

    const trilho = document.createElement("div");
    trilho.className = "bar-track";

    const preenchimento = document.createElement("div");
    preenchimento.className = `bar-fill ${instinto.classe}`;
    preenchimento.style.width = `${percentual}%`;

    trilho.appendChild(preenchimento);
    item.append(label, trilho);

    return item;
}

function preencherCartaoImagem() {
    const cartao = document.getElementById("imagemResultado");
    const tituloImagem = document.getElementById("imagemTitulo");
    const descricaoImagem = document.getElementById("imagemDescricao");
    const pontuacoesImagem = document.getElementById("imagemPontuacoes");

    if (!cartao || !tituloImagem || !descricaoImagem || !pontuacoesImagem) {
        console.warn(
            "Cartão de imagem não encontrado. Confira os IDs no index.html."
        );
        return;
    }

    const {
        ranking,
        primeiro,
        empatados,
        total
    } = resultadoAtual;

    const titulo = empatados.length > 1
        ? "Empate entre instintos"
        : instintos[primeiro].nome;

    const descricao = empatados.length > 1
        ? `Suas respostas ficaram empatadas entre ${empatados
            .map(item => instintos[item[0]].curto)
            .join(" e ")}.`
        : instintos[primeiro].descricao;

    tituloImagem.textContent = titulo;
    descricaoImagem.textContent = descricao;
    pontuacoesImagem.innerHTML = "";

    ranking.forEach(([chave, pontos]) => {
        const instinto = instintos[chave];
        const percentual = total ? Math.round((pontos / total) * 100) : 0;

        const card = document.createElement("article");
        card.className = `share-score ${instinto.classe}`;

        const icone = document.createElement("span");
        icone.className = "share-score-symbol";
        icone.textContent = instinto.icone;

        const nome = document.createElement("h3");
        nome.textContent = instinto.curto;

        const valor = document.createElement("strong");
        valor.textContent = `${pontos}/${total}`;

        const legenda = document.createElement("p");
        legenda.textContent = `${percentual}%`;

        card.append(icone, nome, valor, legenda);
        pontuacoesImagem.appendChild(card);
    });
}

function mostrarResultado() {
    const {
        pontuacoes,
        ranking,
        primeiro,
        segundo,
        empatados,
        total
    } = resultadoAtual;

    areaQuiz.classList.add("hidden");
    inicio.classList.add("hidden");
    resultado.classList.remove("hidden");

    const destaque = document.getElementById("iconeDestaque");
    const titulo = document.getElementById("tituloResultado");
    const descricao = document.getElementById("descricaoResultado");
    const combinacao = document.getElementById("textoCombinacao");

    if (empatados.length > 1) {
        destaque.textContent = "✦";
        titulo.textContent = "Empate entre instintos";

        descricao.textContent =
            `Você teve a mesma pontuação em ${empatados
                .map(item => instintos[item[0]].curto)
                .join(" e ")}. Suas respostas não apontam um único instinto predominante.`;

        combinacao.textContent =
            "O empate sugere que suas respostas se distribuíram igualmente entre as dimensões destacadas. Isso não confirma uma combinação instintiva: pode ser útil refletir sobre situações reais em que suas prioridades entram em conflito.";
    } else {
        destaque.textContent = instintos[primeiro].icone;
        titulo.textContent = instintos[primeiro].nome;
        descricao.textContent = instintos[primeiro].descricao;

        combinacao.textContent =
            `${instintos[primeiro].combinacao} ` +
            `A segunda maior pontuação foi ${instintos[segundo].curto} ` +
            `(${pontuacoes[segundo]} de ${total} respostas). ` +
            "Isso pode indicar uma segunda área de atenção, mas o questionário não determina sozinho a ordem dos seus instintos.";
    }

    const lista = document.getElementById("listaPontuacoes");
    lista.innerHTML = "";

    ranking.forEach(([chave, pontos]) => {
        lista.appendChild(criarCartaoPontuacao(chave, pontos, total));
    });

    const barras = document.getElementById("barrasResultado");
    barras.innerHTML = "";

    ranking.forEach(([chave, pontos]) => {
        barras.appendChild(criarBarraPontuacao(chave, pontos, total));
    });

    preencherCartaoImagem();

    window.scrollTo({ top: 0, behavior: "smooth" });
}

async function baixarResultado() {
    if (!resultadoAtual) {
        alert("Responda ao quiz antes de baixar seu resultado.");
        return;
    }

    if (typeof html2canvas === "undefined") {
        alert(
            "Não foi possível carregar o gerador de imagem. " +
            "Verifique sua conexão e tente novamente."
        );
        return;
    }

    const cartao = document.getElementById("imagemResultado");

    if (!cartao) {
        alert("O cartão de resultado não foi encontrado. Confira o index.html.");
        return;
    }

    const textoOriginal = botaoBaixar.textContent;

    botaoBaixar.disabled = true;
    botaoBaixar.textContent = "Gerando imagem...";

    try {
        const canvas = await html2canvas(cartao, {
            backgroundColor: "#0b0911",
            scale: 2,
            useCORS: true,
            logging: false
        });

        const link = document.createElement("a");
        link.download = "meu-resultado-instintivo.png";
        link.href = canvas.toDataURL("image/png");

        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (erro) {
        console.error("Erro ao gerar a imagem do resultado:", erro);

        alert(
            "Não foi possível gerar a imagem. " +
            "Tente novamente ou confira o console do navegador."
        );
    } finally {
        botaoBaixar.disabled = false;
        botaoBaixar.textContent = textoOriginal;
    }
}

function refazerQuiz() {
    iniciarQuiz();
}

botaoComecar.addEventListener("click", iniciarQuiz);
botaoVoltar.addEventListener("click", voltarPergunta);
botaoProxima.addEventListener("click", avancarPergunta);
botaoBaixar.addEventListener("click", baixarResultado);
botaoRefazer.addEventListener("click", refazerQuiz);
