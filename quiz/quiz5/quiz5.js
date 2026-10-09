
"use strict";

const M = {
    racionalizacao: {
        nome: "Racionalização",
        cor: "#a855f7",
        simbolo: "☾",
        descricao: "Você pode tender a organizar o que aconteceu por meio de explicações e argumentos, especialmente quando uma situação desperta desconforto. Entender os motivos pode ajudar a recuperar uma sensação de clareza.",
        combinacao: "Buscar uma explicação pode ajudar você a organizar a experiência. Observe se a análise também deixa espaço para reconhecer o que sentiu."
    },

    negacao: {
        nome: "Negação",
        cor: "#18d5c2",
        simbolo: "◉",
        descricao: "Diante de algo difícil de aceitar, você pode precisar de tempo antes de reconhecer plenamente o impacto da situação. Manter a rotina pode ajudar a atravessar o primeiro momento.",
        combinacao: "Dar um tempo para assimilar as coisas é humano. Depois, pode ser útil voltar ao assunto com calma e perceber se algo precisa ser encarado."
    },

    projecao: {
        nome: "Projeção",
        cor: "#ff4db8",
        simbolo: "◎",
        descricao: "Em situações de tensão, pode ser mais fácil perceber certas emoções ou intenções no comportamento de outras pessoas do que reconhecê-las primeiro em si. Comparar interpretações com os fatos pode trazer clareza.",
        combinacao: "Quando uma interação incomoda, considere tanto o que a outra pessoa fez quanto o que você pode estar sentindo."
    },

    repressao: {
        nome: "Repressão",
        cor: "#3295ff",
        simbolo: "♙",
        descricao: "Você pode ter tendência a deixar sentimentos difíceis em segundo plano, seguir com as tarefas e só perceber o peso da situação mais tarde. Manter a compostura pode parecer mais acessível do que parar para sentir.",
        combinacao: "Continuar funcionando pode ser útil em certos momentos, mas também vale reservar espaço para identificar emoções e necessidades."
    },

    humor: {
        nome: "Humor",
        cor: "#ffad48",
        simbolo: "☼",
        descricao: "Você pode recorrer a piadas, leveza ou ironia para atravessar situações desconfortáveis. O humor pode diminuir a tensão e aproximar as pessoas, embora às vezes também esconda o quanto algo afetou você.",
        combinacao: "Sua leveza pode ajudar a lidar com momentos difíceis. Observe se você também consegue conversar seriamente quando precisa."
    }
};

const IDS = [
    "racionalizacao",
    "negacao",
    "projecao",
    "repressao",
    "humor"
];

const Q = [
    [
        "Quando algo inesperado acontece, qual costuma ser sua primeira reação?",
        ["Tento entender o que levou a situação a acontecer.", "racionalizacao"],
        ["Continuo o que estava fazendo e vejo como as coisas evoluem.", "negacao"],
        ["Penso no papel que as outras pessoas tiveram nisso.", "projecao"],
        ["Deixo para pensar nisso depois, quando estiver mais tranquilo.", "repressao"],
        ["Faço uma brincadeira para aliviar o clima.", "humor"]
    ],
    [
        "Depois de uma conversa que terminou mal, o que você costuma fazer?",
        ["Repasso os argumentos e tento entender o que aconteceu.", "racionalizacao"],
        ["Prefiro acreditar que não foi algo tão importante.", "negacao"],
        ["Fico pensando no que a outra pessoa estava tentando fazer.", "projecao"],
        ["Evito revisitar a conversa e sigo com o dia.", "repressao"],
        ["Conto a história de um jeito engraçado para aliviar o peso.", "humor"]
    ],
    [
        "Quando alguém aponta um erro seu, como você tende a reagir?",
        ["Explico o contexto e os motivos por trás da minha decisão.", "racionalizacao"],
        ["A princípio, acho que talvez a pessoa esteja exagerando.", "negacao"],
        ["Também penso nas atitudes da pessoa que fez a crítica.", "projecao"],
        ["Guardo a reação para mim e tento não demonstrar incômodo.", "repressao"],
        ["Respondo com uma piada para a situação não ficar pesada.", "humor"]
    ],
    [
        "Quando uma situação fica emocionalmente intensa, você costuma...",
        ["Organizar os fatos para compreender o que está acontecendo.", "racionalizacao"],
        ["Agir como se ainda estivesse tudo sob controle.", "negacao"],
        ["Notar primeiro o comportamento e as intenções dos envolvidos.", "projecao"],
        ["Ficar mais quieto e continuar fazendo o que precisa ser feito.", "repressao"],
        ["Tentar fazer alguém rir ou mudar o tom da conversa.", "humor"]
    ],
    [
        "Quando um plano importante não dá certo, o que mais parece com você?",
        ["Procuro motivos concretos para entender por que falhou.", "racionalizacao"],
        ["Penso que ainda pode dar certo e tento não me preocupar tanto.", "negacao"],
        ["Avalio como as decisões de outras pessoas influenciaram o resultado.", "projecao"],
        ["Deixo a frustração de lado e resolvo o próximo problema.", "repressao"],
        ["Faço graça com o azar para não ficar preso à frustração.", "humor"]
    ],
    [
        "Quando percebe que magoou alguém sem querer, o que tende a fazer primeiro?",
        ["Explico o que eu queria dizer e por que agi daquela forma.", "racionalizacao"],
        ["Espero que a pessoa perceba que não foi algo tão sério.", "negacao"],
        ["Penso se a reação dela também tem relação com outras coisas.", "projecao"],
        ["Evito mostrar o quanto a situação me deixou desconfortável.", "repressao"],
        ["Tento quebrar o clima com leveza.", "humor"]
    ],
    [
        "Em um dia muito difícil, qual atitude parece mais natural para você?",
        ["Faço uma lista mental de causas e possíveis soluções.", "racionalizacao"],
        ["Foco no que está funcionando e não penso muito no resto.", "negacao"],
        ["Observo quem está contribuindo para o problema.", "projecao"],
        ["Cumpro minhas obrigações e lido com isso depois.", "repressao"],
        ["Procuro algo engraçado para me distrair um pouco.", "humor"]
    ],
    [
        "Quando alguém demonstra irritação com você, o que passa pela sua cabeça?",
        ["Tento encontrar uma explicação lógica para a reação.", "racionalizacao"],
        ["Imagino que a pessoa logo vai ficar bem e deixo passar.", "negacao"],
        ["Considero que talvez ela esteja atribuindo a mim algo que sente.", "projecao"],
        ["Mantenho a expressão neutra, mesmo se fico abalado.", "repressao"],
        ["Uso uma resposta bem-humorada para diminuir a tensão.", "humor"]
    ],
    [
        "Quando se sente inseguro diante de outras pessoas, tende a...",
        ["Lembrar a si mesmo dos motivos pelos quais está preparado.", "racionalizacao"],
        ["Agir como se a insegurança não estivesse ali.", "negacao"],
        ["Perceber as inseguranças ou julgamentos das outras pessoas.", "projecao"],
        ["Esconder o desconforto e manter a postura.", "repressao"],
        ["Fazer comentários engraçados para se soltar.", "humor"]
    ],
    [
        "Quando recebe uma notícia decepcionante, como costuma lidar com ela?",
        ["Procuro entender por que o resultado aconteceu.", "racionalizacao"],
        ["Demoro um pouco para acreditar que aconteceu de verdade.", "negacao"],
        ["Penso em quais decisões externas contribuíram para isso.", "projecao"],
        ["Deixo a emoção de lado até resolver o necessário.", "repressao"],
        ["Tento encontrar o lado absurdo ou engraçado da situação.", "humor"]
    ],
    [
        "Em um desentendimento, o que você faz com mais frequência?",
        ["Apresento razões e contexto para sustentar meu ponto.", "racionalizacao"],
        ["Tento agir como se a discussão não tivesse tanta importância.", "negacao"],
        ["Fico atento às motivações que atribuo à outra pessoa.", "projecao"],
        ["Evito mostrar minha reação emocional durante a conversa.", "repressao"],
        ["Uso ironia ou brincadeiras para reduzir a tensão.", "humor"]
    ],
    [
        "Quando algo do passado ainda incomoda você, o que costuma acontecer?",
        ["Reinterpreto os acontecimentos para fazer sentido deles.", "racionalizacao"],
        ["Prefiro pensar que já passou e não merece atenção.", "negacao"],
        ["Relembro as atitudes das pessoas envolvidas.", "projecao"],
        ["Passo um tempo sem pensar nisso, até algo trazer o assunto de volta.", "repressao"],
        ["Consigo contar a história com humor, mesmo que tenha sido difícil.", "humor"]
    ],
    [
        "Quando está frustrado, mas precisa continuar em público, você tende a...",
        ["Explicar para si mesmo por que a situação não é tão ruim quanto parece.", "racionalizacao"],
        ["Agir normalmente e tentar não dar importância ao sentimento.", "negacao"],
        ["Notar como o comportamento alheio contribuiu para sua frustração.", "projecao"],
        ["Guardar a reação para lidar com ela em outro momento.", "repressao"],
        ["Fazer uma observação engraçada para aliviar o ambiente.", "humor"]
    ],
    [
        "Se um amigo diz que você parece chateado, qual resposta mais combina com você?",
        ["Explico os motivos pelos quais minha reação faz sentido.", "racionalizacao"],
        ["Digo que está tudo bem porque não quero dar importância a isso.", "negacao"],
        ["Comento que outras pessoas também estão agindo de forma estranha.", "projecao"],
        ["Digo pouco sobre o assunto e tento seguir em frente.", "repressao"],
        ["Faço uma piada sobre meu próprio estado para mudar o clima.", "humor"]
    ],
    [
        "Quando precisa admitir que uma escolha não funcionou, você costuma...",
        ["Reviso as circunstâncias que me levaram a escolher aquilo.", "racionalizacao"],
        ["Dou mais tempo antes de aceitar que realmente não funcionou.", "negacao"],
        ["Considero as influências de outras pessoas na decisão.", "projecao"],
        ["Guardo a decepção e me concentro no próximo passo.", "repressao"],
        ["Transformo o erro em uma história engraçada.", "humor"]
    ],
    [
        "Quando uma pessoa próxima está emocionalmente abalada, você tende a...",
        ["Ajudá-la a organizar os fatos e pensar em explicações.", "racionalizacao"],
        ["Tentar tranquilizá-la dizendo que talvez não seja tão grave.", "negacao"],
        ["Conversar sobre o que outras pessoas podem ter feito ou pensado.", "projecao"],
        ["Ajudar de forma prática, mesmo sem falar muito sobre sentimentos.", "repressao"],
        ["Tentar fazê-la sorrir para dar uma pausa no sofrimento.", "humor"]
    ],
    [
        "Quando sente que perdeu o controle de uma situação, o que faz primeiro?",
        ["Analiso as causas para descobrir o que ainda posso compreender.", "racionalizacao"],
        ["Tento acreditar que a situação vai se resolver sozinha.", "negacao"],
        ["Procuro entender como as atitudes dos envolvidos afetaram tudo.", "projecao"],
        ["Contenho minha reação e foco no que precisa ser feito.", "repressao"],
        ["Faço uma piada para suportar melhor o momento.", "humor"]
    ],
    [
        "Quando alguém interpreta suas intenções de um jeito negativo, você costuma...",
        ["Explicar detalhadamente o raciocínio por trás do que fiz.", "racionalizacao"],
        ["Achar que a pessoa vai esquecer logo e não insistir no assunto.", "negacao"],
        ["Pensar que ela pode estar interpretando a situação pelas próprias preocupações.", "projecao"],
        ["Esconder o quanto a interpretação me afetou.", "repressao"],
        ["Responder com humor para não deixar a conversa pesada.", "humor"]
    ],
    [
        "Depois de um momento constrangedor, o que ajuda você a seguir em frente?",
        ["Entender por que aconteceu e o que aprendi.", "racionalizacao"],
        ["Tratar o episódio como algo pequeno e não voltar a ele.", "negacao"],
        ["Lembrar que a reação das pessoas também depende delas.", "projecao"],
        ["Evitar pensar no episódio por um tempo.", "repressao"],
        ["Rir do ocorrido e transformar em uma história divertida.", "humor"]
    ],
    [
        "Quando várias emoções aparecem ao mesmo tempo, você tende a...",
        ["Separar os fatos e analisar cada parte da situação.", "racionalizacao"],
        ["Focar em outra coisa até a intensidade diminuir.", "negacao"],
        ["Pensar em como as outras pessoas estão influenciando o clima.", "projecao"],
        ["Colocar as emoções em espera para resolver o que é urgente.", "repressao"],
        ["Buscar leveza e humor para tornar tudo mais suportável.", "humor"]
    ]
];

/* =========================================
   ESTADO DO QUIZ
========================================= */

let indice = 0;
let respostas = Array(Q.length).fill(null);
let opcoesVisiveis = [];

const $ = id => document.getElementById(id);

function elementoExiste(id) {
    const elemento = $(id);

    if (!elemento) {
        console.error(`Quiz 05: não encontrei o elemento #${id} no HTML.`);
        return false;
    }

    return true;
}

function embaralhar(lista) {
    const copia = [...lista];

    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }

    return copia;
}

function prepararOpcoes() {
    opcoesVisiveis = Q.map(pergunta => {
        return embaralhar(
            pergunta.slice(1).map((opcao, id) => ({
                texto: opcao[0],
                mecanismo: opcao[1],
                id
            }))
        );
    });
}

function tela(idAtivo) {
    ["inicio", "areaQuiz", "resultado"].forEach(id => {
        const elemento = $(id);

        if (elemento) {
            elemento.hidden = id !== idAtivo;
        }
    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* =========================================
   RENDERIZAR PERGUNTAS
========================================= */

function renderizarPergunta() {
    if (indice < 0 || indice >= Q.length) return;

    $("contador").textContent =
        `PERGUNTA ${indice + 1} DE ${Q.length}`;

    const progresso = ((indice + 1) / Q.length) * 100;

    $("percentual").textContent = `${Math.round(progresso)}%`;
    $("progresso").style.width = `${progresso}%`;
    $("numero").textContent = String(indice + 1).padStart(2, "0");
    $("pergunta").textContent = Q[indice][0];

    $("aviso").textContent = respostas[indice] === null
        ? "Selecione uma alternativa para continuar."
        : "Resposta selecionada.";

    const area = $("opcoes");
    area.replaceChildren();

    opcoesVisiveis[indice].forEach(opcao => {
        const botao = document.createElement("button");
        const selecionada = respostas[indice] === opcao.id;

        botao.type = "button";
        botao.className = "option" + (selecionada ? " selected" : "");
        botao.setAttribute("aria-pressed", String(selecionada));

        const radio = document.createElement("span");
        radio.className = "radio";
        radio.setAttribute("aria-hidden", "true");

        const texto = document.createElement("span");
        texto.className = "option-label";
        texto.textContent = opcao.texto;

        botao.append(radio, texto);

        botao.addEventListener("click", () => {
            respostas[indice] = opcao.id;
            renderizarPergunta();
        });

        area.appendChild(botao);
    });

    $("anterior").disabled = indice === 0;
    $("proxima").disabled = respostas[indice] === null;

    $("proxima").textContent = indice === Q.length - 1
        ? "Ver resultado →"
        : "Próxima →";
}

/* =========================================
   CALCULAR E MOSTRAR RESULTADO
========================================= */

function calcularPontuacoes() {
    const pontuacoes = Object.fromEntries(
        IDS.map(id => [id, 0])
    );

    respostas.forEach((resposta, perguntaIndex) => {
        if (resposta === null) return;

        const opcao = opcoesVisiveis[perguntaIndex].find(
            item => item.id === resposta
        );

        if (opcao && pontuacoes[opcao.mecanismo] !== undefined) {
            pontuacoes[opcao.mecanismo]++;
        }
    });

    return pontuacoes;
}

function mostrarResultado() {
    if (respostas.some(resposta => resposta === null)) {
        alert("Responda a todas as perguntas antes de ver o resultado.");
        return;
    }

    const pontuacoes = calcularPontuacoes();

    const ranking = [...IDS].sort((a, b) => {
        return pontuacoes[b] - pontuacoes[a];
    });

    const maiorPontuacao = pontuacoes[ranking[0]];

    const empatados = ranking.filter(id => {
        return pontuacoes[id] === maiorPontuacao;
    });

    const principal = M[ranking[0]];

    $("cartaoPrincipal").style.setProperty("--color", principal.cor);
    $("simbolo").textContent = principal.simbolo;

    $("kicker").textContent = empatados.length > 1
        ? "TENDÊNCIAS MAIS PRESENTES"
        : "TENDÊNCIA MAIS PRESENTE";

    $("nome").textContent = empatados.length > 1
        ? "Tendências equilibradas"
        : principal.nome;

    $("descricao").textContent = empatados.length > 1
        ? `Suas respostas ficaram empatadas entre ${empatados.map(id => M[id].nome).join(", ")}. Mais de uma forma de lidar com situações difíceis apareceu com frequência semelhante neste questionário.`
        : principal.descricao;

    $("combinacao").textContent = empatados.length > 1
        ? `As maiores pontuações foram compartilhadas por ${empatados.map(id => M[id].nome).join(" e ")}. Considere essas descrições como possibilidades de reflexão, não como rótulos fixos.`
        : principal.combinacao;

    const grade = $("pontuacoes");
    grade.replaceChildren();

    ranking.forEach(id => {
        const mecanismo = M[id];
        const pontos = pontuacoes[id];
        const percentual = pontos / Q.length * 100;

        const cartao = document.createElement("article");
        cartao.className = "score-card";
        cartao.style.setProperty("--color", mecanismo.cor);

        const icone = document.createElement("span");
        icone.className = "score-icon";
        icone.textContent = mecanismo.simbolo;

        const nome = document.createElement("div");
        nome.className = "score-name";
        nome.textContent = mecanismo.nome;

        const valor = document.createElement("div");
        valor.className = "score-value";
        valor.textContent = `${pontos}/${Q.length}`;

        const legenda = document.createElement("div");
        legenda.className = "score-percent";
        legenda.textContent = `${percentual}% das respostas`;

        const trilha = document.createElement("div");
        trilha.className = "score-track";

        const barra = document.createElement("div");
        barra.className = "score-bar";
        barra.style.width = `${percentual}%`;

        trilha.appendChild(barra);
        cartao.append(icone, nome, valor, legenda, trilha);
        grade.appendChild(cartao);
    });

    tela("resultado");
}

/* =========================================
   BAIXAR RESULTADO COMO PNG
========================================= */

async function baixarResultado() {
    const botao = $("baixar");
    const areaResultado = $("resultado");

    if (typeof window.html2canvas !== "function") {
        alert("A ferramenta de imagem não carregou. Atualize a página e tente novamente.");
        return;
    }

    const textoOriginal = botao.textContent;

    botao.disabled = true;
    botao.textContent = "Preparando imagem...";

    try {
        const canvas = await window.html2canvas(areaResultado, {
            backgroundColor: "#070611",
            scale: 2,
            useCORS: true,
            logging: true,
            scrollX: 0,
            scrollY: 0,

onclone: (documento) => {
    const resultado = documento.getElementById("resultado");
    if (!resultado) return;

    const propriedadesDeCor = [
        "color",
        "background-color",
        "border-top-color",
        "border-right-color",
        "border-bottom-color",
        "border-left-color",
        "outline-color",
        "text-decoration-color",
        "fill",
        "stroke"
    ];

    function converterCor(valor) {
        return valor.replace(
            /color\(\s*srgb\s+([\d.e+-]+)\s+([\d.e+-]+)\s+([\d.e+-]+)(?:\s*\/\s*([\d.e+-]+%?))?\s*\)/gi,
            (_, r, g, b, a) => {
                const canal = (n) =>
                    Math.round(Math.max(0, Math.min(1, Number(n))) * 255);

                const alpha = a === undefined
                    ? 1
                    : a.endsWith("%")
                        ? Math.max(0, Math.min(1, parseFloat(a) / 100))
                        : Math.max(0, Math.min(1, Number(a)));

                return alpha < 1
                    ? `rgba(${canal(r)}, ${canal(g)}, ${canal(b)}, ${alpha})`
                    : `rgb(${canal(r)}, ${canal(g)}, ${canal(b)})`;
            }
        );
    }

    const elementos = [
        resultado,
        ...resultado.querySelectorAll("*")
    ];

    const estilo = documento.defaultView;

    elementos.forEach((elemento) => {
        const computado = estilo.getComputedStyle(elemento);

        propriedadesDeCor.forEach((propriedade) => {
            const valor = computado.getPropertyValue(propriedade);

            if (valor && valor.includes("color(")) {
                elemento.style.setProperty(
                    propriedade,
                    converterCor(valor),
                    "important"
                );
            }
        });

        elemento.style.setProperty("background-image", "none", "important");
        elemento.style.setProperty("box-shadow", "none", "important");
    });

    resultado.style.setProperty("background-color", "#070611", "important");

    const principal = resultado.querySelector(".feature");
    if (principal) {
        principal.style.setProperty("background", "#100a1d", "important");
        principal.style.setProperty("border-color", "#7040a0", "important");
    }

    const simbolo = resultado.querySelector(".big-symbol");
    if (simbolo) {
        simbolo.style.setProperty("background", "#211331", "important");
    }

    resultado.querySelectorAll(".score-card").forEach((cartao) => {
        cartao.style.setProperty("background", "#171023", "important");
    });
}

        });

        const blob = await new Promise((resolve) => {
            canvas.toBlob(resolve, "image/png");
        });

        if (!blob) {
            throw new Error("Não foi possível criar o arquivo PNG.");
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "meu-mecanismo-de-defesa.png";

        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => URL.revokeObjectURL(url), 1500);

    } catch (erro) {
        console.error("Erro ao gerar imagem do resultado:", erro);

        alert(
            "Não foi possível gerar a imagem. Confira o erro no console (F12)."
        );

    } finally {
        botao.disabled = false;
        botao.textContent = textoOriginal;
    }
}


/* =========================================
   REINICIAR QUIZ
========================================= */

function reiniciarQuiz() {
    indice = 0;
    respostas = Array(Q.length).fill(null);

    prepararOpcoes();
    tela("inicio");
}

/* =========================================
   INICIALIZAÇÃO
========================================= */

function iniciarQuiz() {
    const elementosNecessarios = [
        "inicio",
        "areaQuiz",
        "resultado",
        "comecar",
        "contador",
        "percentual",
        "progresso",
        "numero",
        "pergunta",
        "opcoes",
        "aviso",
        "anterior",
        "proxima",
        "cartaoPrincipal",
        "simbolo",
        "kicker",
        "nome",
        "descricao",
        "combinacao",
        "pontuacoes",
        "baixar",
        "refazer"
    ];

    const faltando = elementosNecessarios.filter(id => !$(id));

    if (faltando.length > 0) {
        console.error(
            "Quiz 05: faltam elementos no HTML:",
            faltando.join(", ")
        );

        return;
    }

    prepararOpcoes();

    $("comecar").addEventListener("click", () => {
        indice = 0;
        tela("areaQuiz");
        renderizarPergunta();
    });

    $("anterior").addEventListener("click", () => {
        if (indice > 0) {
            indice--;
            renderizarPergunta();
        }
    });

    $("proxima").addEventListener("click", () => {
        if (respostas[indice] === null) return;

        if (indice < Q.length - 1) {
            indice++;
            renderizarPergunta();
        } else {
            mostrarResultado();
        }
    });

    $("refazer").addEventListener("click", reiniciarQuiz);
    $("baixar").addEventListener("click", baixarResultado);

    tela("inicio");

    console.log("Quiz 05 carregado. Perguntas:", Q.length);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarQuiz);
} else {
    iniciarQuiz();
}
