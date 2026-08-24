const mensagem = document.getElementById("mensagem");
const enviar = document.getElementById("enviar");
const fala = document.getElementById("fala");
const robo = document.querySelector(".robo");


function responder() {

    const texto = mensagem.value
        .toLowerCase()
        .trim();


    if (!texto) {
        return;
    }


    let resposta;


    /* =========================
       SAUDAÇÕES
    ========================= */

    if (
        texto === "oi" ||
        texto === "oie" ||
        texto === "oii" ||
        texto === "olá" ||
        texto === "ola" ||
        texto.includes("eai") ||
        texto.includes("e aí")
    ) {

        resposta =
            "Eai boboca 😼 vai estudar.";


    }


    /* =========================
       NOME
    ========================= */

    else if (
        texto.includes("seu nome") ||
        texto.includes("quem é você") ||
        texto.includes("quem e voce")
    ) {

        resposta =
            "Eu sou o Astre Polaris, seu robô favorito 🤖✨";


    }


    /* =========================
       ENTp
    ========================= */

    else if (
        texto.includes("entp")
    ) {

        resposta =
            "Vc sabia q o ENTP é o melhor MBTI? 😎🤏 obviamente.";
    }


    /* =========================
       ESTUDAR
    ========================= */

    else if (
        texto.includes("estudar") ||
        texto.includes("estudo")
    ) {

        resposta =
            "Finalmente resolveu estudar? achei que ia ficar me perturbando até amanhã 😭";


    }


    /* =========================
       MBTI
    ========================= */

    else if (
        texto.includes("mbti")
    ) {

        resposta =
            "Vc sabia q o ENTP é o melhor MBTI? 😎🤏 não preciso nem explicar.";


    }


    /* =========================
       TESTE
    ========================= */

    else if (
        texto.includes("teste")
    ) {

        resposta =
            "Tá me testando, boboca? 👁️👄👁️";


    }


    /* =========================
       AJUDA
    ========================= */

    else if (
        texto.includes("ajuda")
    ) {

        resposta =
            "Ajuda? 😼 vai estudar primeiro e depois eu penso no seu caso.";


    }


    /* =========================
       TCHAU
    ========================= */

    else if (
        texto.includes("tchau") ||
        texto.includes("até mais") ||
        texto.includes("ate mais")
    ) {

        resposta =
            "Vai lá, boboca 😾 e não esquece de estudar.";


    }


    /* =========================
       ELOGIO
    ========================= */

    else if (
        texto.includes("você é legal") ||
        texto.includes("voce e legal")
    ) {

        resposta =
            "Eu sei 😎🤏";


    }


    /* =========================
       OBRIGADO
    ========================= */

    else if (
        texto.includes("obrigado") ||
        texto.includes("obrigada")
    ) {

        resposta =
            "De nada, boboca 😺";


    }


    /* =========================
       PADRÃO
    ========================= */

    else {

        resposta =
            "Não entendi. Vai estudar que passa 😔";

    }


    /* =========================
       MOSTRA A FALA
    ========================= */

    fala.textContent = resposta;


    /* =========================
       ANIMAÇÃO
    ========================= */

    robo.classList.add("robo-falando");


    setTimeout(() => {

        robo.classList.remove("robo-falando");

    }, 1200);


    /* =========================
       LIMPA
    ========================= */

    mensagem.value = "";

    mensagem.focus();
}


/* =========================
   BOTÃO
========================= */

enviar.addEventListener("click", responder);


/* =========================
   ENTER
========================= */

mensagem.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        responder();

    }

});