
const SUPABASE_URL =
    "https://lhhoqahzpuohhhnbwgfp.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_FTie2ELWKBc4Tz9r5fZuTw_izSaEHao";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* ==========================================
   ELEMENTOS
========================================== */

const identityCard =
    document.getElementById("identity-card");

const flipButton =
    document.getElementById("flip-card");

const downloadButton =
    document.getElementById("download-card");

const vipMessage =
    document.getElementById("vip-message");


const memberAvatar =
    document.getElementById("member-avatar");

const memberName =
    document.getElementById("member-name");

const memberUsername =
    document.getElementById("member-username");

const memberMbti =
    document.getElementById("member-mbti");

const memberEneagrama =
    document.getElementById("member-eneagrama");

const memberTritype =
    document.getElementById("member-tritype");

const memberGroup =
    document.getElementById("member-group");

const memberCargo =
    document.getElementById("member-cargo");


const backUsername =
    document.getElementById("back-username");

const backMbti =
    document.getElementById("back-mbti");

const backSubtipo =
    document.getElementById("back-subtipo");

const backTemperamento =
    document.getElementById("back-temperamento");

const backSocionics =
    document.getElementById("back-socionics");

const backBigFive =
    document.getElementById("back-big-five");

const memberSince =
    document.getElementById("member-since");

const backStatus =
    document.getElementById("back-status");


/* ==========================================
   AVATAR
========================================== */

let avatarParaDownload = null;

function mostrarAvatar(url, tipo) {

    if (
        tipo &&
        tipo.startsWith("preset:")
    ) {

        const emoji =
            tipo.replace(
                "preset:",
                ""
            );

        memberAvatar.innerHTML = "";

        const placeholder =
            document.createElement("div");

        placeholder.className =
            "avatar-emoji";

        placeholder.textContent =
            emoji;

        memberAvatar.appendChild(
            placeholder
        );

        avatarParaDownload = {
            tipo: "emoji",
            valor: emoji
        };

        return;
    }


    if (url) {

        memberAvatar.innerHTML = "";

        const img =
            document.createElement("img");

        img.src = url;

        img.alt =
            "Avatar do membro";

        img.crossOrigin =
            "anonymous";

        memberAvatar.appendChild(
            img
        );

        avatarParaDownload = {
            tipo: "imagem",
            valor: url
        };

        return;
    }


    memberAvatar.innerHTML =
        '<div class="avatar-emoji">👤</div>';

    avatarParaDownload = {
        tipo: "emoji",
        valor: "👤"
    };
}


/* ==========================================
   CORES
========================================== */

function aplicarCores(
    primary,
    secondary,
    accent
) {

    document.documentElement.style.setProperty(
        "--primary",
        primary
    );

    document.documentElement.style.setProperty(
        "--secondary",
        secondary
    );

    document.documentElement.style.setProperty(
        "--accent",
        accent
    );
}


/* ==========================================
   DATA
========================================== */

function formatarData(data) {

    if (!data) {
        return "—";
    }

    const dataObj =
        new Date(data);

    if (
        Number.isNaN(
            dataObj.getTime()
        )
    ) {
        return "—";
    }

    return dataObj.toLocaleDateString(
        "pt-BR",
        {
            month: "2-digit",
            year: "numeric"
        }
    );
}


/* ==========================================
   ESCAPE
========================================== */

function escaparTexto(texto) {

    return String(
        texto ?? ""
    );
}


/* ==========================================
   CARREGAR IDENTIDADE
========================================== */

async function carregarIdentidade() {

    vipMessage.textContent =
        "Carregando sua identidade...";


    const {
        data: {
            user
        },
        error: userError
    } =
        await supabaseClient.auth.getUser();


    if (
        userError ||
        !user
    ) {

        window.location.href =
            "../../login/index.html";

        return;
    }


    const {
        data: perfil,
        error: perfilError
    } =
        await supabaseClient
            .from("profiles")
            .select(`
                id,
                nome,
                username,
                cargo,
                mbti,
                eneagrama,
                tritype,
                subtipo,
                temperamento,
                socionics,
                big_five,
                grupo_casa,
                avatar_url,
                avatar_tipo,
                cor_principal,
                cor_secundaria,
                cor_destaque
            `)
            .eq(
                "id",
                user.id
            )
            .single();


    if (perfilError) {

        console.error(
            "Erro ao carregar perfil:",
            perfilError
        );

        vipMessage.textContent =
            "Não foi possível carregar sua identidade.";

        return;
    }


    /* ======================================
       CORES
    ====================================== */

    const primary =
        perfil.cor_principal ||
        "#8B5CF6";

    const secondary =
        perfil.cor_secundaria ||
        "#C084FC";

    const accent =
        perfil.cor_destaque ||
        "#60A5FA";


    aplicarCores(
        primary,
        secondary,
        accent
    );


    /* ======================================
       DADOS
    ====================================== */

    const nome =
        perfil.nome ||
        "Sem nome";


    const username =
        perfil.username
            ? "@" +
              perfil.username.replace(
                  /^@/,
                  ""
              )
            : "@usuario";


    const cargo =
        String(
            perfil.cargo ||
            "membro"
        )
            .toLowerCase()
            .trim();


    /* ======================================
       FRENTE
    ====================================== */

    memberName.textContent =
        escaparTexto(nome);

    memberUsername.textContent =
        escaparTexto(username);

    memberMbti.textContent =
        escaparTexto(
            perfil.mbti ||
            "—"
        );

    memberEneagrama.textContent =
        escaparTexto(
            perfil.eneagrama ||
            "—"
        );

    memberTritype.textContent =
        escaparTexto(
            perfil.tritype ||
            "—"
        );

    memberGroup.textContent =
        escaparTexto(
            perfil.grupo_casa ||
            "CASA DOS MBTIs"
        );


    if (
        cargo === "adm"
    ) {

        memberCargo.textContent =
            "🛡️ ADM";

    } else if (
        cargo === "moderador"
    ) {

        memberCargo.textContent =
            "🛡️ MODERADOR";

    } else {

        memberCargo.textContent =
            "MEMBRO";
    }


    /* ======================================
       VERSO
    ====================================== */

    backUsername.textContent =
        username;

    backMbti.textContent =
        perfil.mbti ||
        "—";

    backSubtipo.textContent =
        perfil.subtipo ||
        "—";

    backTemperamento.textContent =
        perfil.temperamento ||
        "—";

    backSocionics.textContent =
        perfil.socionics ||
        "—";

    backBigFive.textContent =
        perfil.big_five ||
        "—";


    /* ======================================
       DATA
    ====================================== */

    memberSince.textContent =
        formatarData(
            user.created_at
        );


    /* ======================================
       STATUS
    ====================================== */

    if (
        cargo === "adm"
    ) {

        backStatus.textContent =
            "🛡️ ADMINISTRADOR DA CASA";

    } else if (
        cargo === "moderador"
    ) {

        backStatus.textContent =
            "🛡️ MODERADOR DA CASA";

    } else {

        backStatus.textContent =
            "★ MEMBRO VERIFICADO ★";
    }


    /* ======================================
       AVATAR
    ====================================== */

    mostrarAvatar(
        perfil.avatar_url,
        perfil.avatar_tipo
    );


    vipMessage.textContent =
        "";
}


/* ==========================================
   VIRAR CARD
========================================== */

if (flipButton) {

    flipButton.addEventListener(
        "click",
        function () {

            identityCard.classList.toggle(
                "flipped"
            );

        }
    );
}


if (identityCard) {

    identityCard.addEventListener(
        "click",
        function (event) {

            if (
                event.target.closest(
                    "button"
                )
            ) {
                return;
            }

            identityCard.classList.toggle(
                "flipped"
            );

        }
    );
}


/* ==========================================
   DOWNLOAD POR CANVAS
========================================== */

function arredondarRetangulo(
    ctx,
    x,
    y,
    largura,
    altura,
    raio
) {

    ctx.beginPath();

    ctx.moveTo(
        x + raio,
        y
    );

    ctx.lineTo(
        x + largura - raio,
        y
    );

    ctx.quadraticCurveTo(
        x + largura,
        y,
        x + largura,
        y + raio
    );

    ctx.lineTo(
        x + largura,
        y + altura - raio
    );

    ctx.quadraticCurveTo(
        x + largura,
        y + altura,
        x + largura - raio,
        y + altura
    );

    ctx.lineTo(
        x + raio,
        y + altura
    );

    ctx.quadraticCurveTo(
        x,
        y + altura,
        x,
        y + altura - raio
    );

    ctx.lineTo(
        x,
        y + raio
    );

    ctx.quadraticCurveTo(
        x,
        y,
        x + raio,
        y
    );

    ctx.closePath();
}


function desenharTexto(
    ctx,
    texto,
    x,
    y,
    tamanho,
    peso = "400",
    alinhamento = "left"
) {

    ctx.font =
        `${peso} ${tamanho}px Arial`;

    ctx.textAlign =
        alinhamento;

    ctx.textBaseline =
        "middle";

    ctx.fillStyle =
        "#FFFFFF";

    ctx.fillText(
        texto,
        x,
        y
    );
}


function desenharEtiqueta(
    ctx,
    titulo,
    valor,
    x,
    y,
    largura,
    altura
) {

    ctx.fillStyle =
        "rgba(255,255,255,0.07)";

    arredondarRetangulo(
        ctx,
        x,
        y,
        largura,
        altura,
        14
    );

    ctx.fill();


    ctx.fillStyle =
        "rgba(255,255,255,0.55)";

    ctx.font =
        "700 12px Arial";

    ctx.textAlign =
        "left";

    ctx.textBaseline =
        "middle";

    ctx.fillText(
        titulo,
        x + 14,
        y + 18
    );


    ctx.fillStyle =
        "#FFFFFF";

    ctx.font =
        "700 18px Arial";

    ctx.fillText(
        valor,
        x + 14,
        y + 42
    );
}


async function carregarImagem(
    url
) {

    return new Promise(
        (resolve, reject) => {

            const img =
                new Image();

            img.crossOrigin =
                "anonymous";

            img.onload =
                function () {
                    resolve(img);
                };

            img.onerror =
                function () {
                    reject(
                        new Error(
                            "Não foi possível carregar o avatar."
                        )
                    );
                };

            img.src =
                url;
        }
    );
}


async function criarImagemDoCard() {

    const largura = 1520;
    const altura = Math.round(
        largura / 1.62
    );

    const escala =
        largura / 760;

    const canvas =
        document.createElement(
            "canvas"
        );

    canvas.width =
        largura;

    canvas.height =
        altura;

    const ctx =
        canvas.getContext(
            "2d"
        );


    /* ======================================
       FUNDO
    ====================================== */

    const fundo =
        ctx.createLinearGradient(
            0,
            0,
            largura,
            altura
        );

    fundo.addColorStop(
        0,
        "#160D22"
    );

    fundo.addColorStop(
        0.45,
        "#120D18"
    );

    fundo.addColorStop(
        1,
        "#0D1928"
    );


    ctx.fillStyle =
        fundo;

    arredondarRetangulo(
        ctx,
        0,
        0,
        largura,
        altura,
        52
    );

    ctx.fill();


    /* ======================================
       BORDA
    ====================================== */

    ctx.strokeStyle =
        "rgba(255,255,255,0.16)";

    ctx.lineWidth =
        4;

    arredondarRetangulo(
        ctx,
        2,
        2,
        largura - 4,
        altura - 4,
        52
    );

    ctx.stroke();


    /* ======================================
       TOPO
    ====================================== */

    const alturaTopo =
        Math.round(
            altura * 0.25
        );

    const gradienteTopo =
        ctx.createLinearGradient(
            0,
            0,
            largura,
            alturaTopo
        );

    gradienteTopo.addColorStop(
        0,
        getComputedStyle(
            document.documentElement
        ).getPropertyValue(
            "--primary"
        ).trim() || "#8B5CF6"
    );

    gradienteTopo.addColorStop(
        1,
        getComputedStyle(
            document.documentElement
        ).getPropertyValue(
            "--secondary"
        ).trim() || "#C084FC"
    );


    ctx.fillStyle =
        gradienteTopo;

    ctx.beginPath();

    ctx.moveTo(
        0,
        26
    );

    ctx.quadraticCurveTo(
        0,
        0,
        26,
        0
    );

    ctx.lineTo(
        largura - 26,
        0
    );

    ctx.quadraticCurveTo(
        largura,
        0,
        largura,
        26
    );

    ctx.lineTo(
        largura,
        alturaTopo
    );

    ctx.lineTo(
        0,
        alturaTopo
    );

    ctx.closePath();

    ctx.fill();


    /* ======================================
       TÍTULO
    ====================================== */

    desenharTexto(
        ctx,
        "CASA DOS",
        60,
        43,
        24,
        "700",
        "left"
    );

    desenharTexto(
        ctx,
        "MBTIs",
        60,
        78,
        58,
        "700",
        "left"
    );


    desenharTexto(
        ctx,
        "IDENTIDADE VIP",
        largura - 60,
        60,
        23,
        "700",
        "right"
    );


    /* ======================================
       CORPO
    ====================================== */

    const centroY =
        alturaTopo +
        Math.round(
            altura * 0.29
        );


    const avatarX =
        70;

    const avatarY =
        centroY - 5;

    const avatarTamanho =
        360;


    ctx.save();

    arredondarRetangulo(
        ctx,
        avatarX,
        avatarY,
        avatarTamanho,
        avatarTamanho,
        44
    );

    ctx.clip();


    ctx.fillStyle =
        "#17101F";

    ctx.fillRect(
        avatarX,
        avatarY,
        avatarTamanho,
        avatarTamanho
    );


    try {

        if (
            avatarParaDownload?.tipo ===
            "imagem"
        ) {

            const imagem =
                await carregarImagem(
                    avatarParaDownload.valor
                );

            const proporcao =
                Math.max(
                    avatarTamanho /
                    imagem.width,
                    avatarTamanho /
                    imagem.height
                );

            const larguraImagem =
                imagem.width *
                proporcao;

            const alturaImagem =
                imagem.height *
                proporcao;

            ctx.drawImage(
                imagem,
                avatarX +
                    (
                        avatarTamanho -
                        larguraImagem
                    ) / 2,
                avatarY +
                    (
                        avatarTamanho -
                        alturaImagem
                    ) / 2,
                larguraImagem,
                alturaImagem
            );

        } else {

            desenharTexto(
                ctx,
                avatarParaDownload?.valor ||
                    "👤",
                avatarX +
                    avatarTamanho / 2,
                avatarY +
                    avatarTamanho / 2,
                150,
                "400",
                "center"
            );

        }

    } catch (error) {

        desenharTexto(
            ctx,
            "👤",
            avatarX +
                avatarTamanho / 2,
            avatarY +
                avatarTamanho / 2,
            150,
            "400",
            "center"
        );
    }

    ctx.restore();


    /* ======================================
       BORDA AVATAR
    ====================================== */

    const primary =
        getComputedStyle(
            document.documentElement
        ).getPropertyValue(
            "--primary"
        ).trim() || "#8B5CF6";

    ctx.strokeStyle =
        primary;

    ctx.lineWidth =
        12;

    arredondarRetangulo(
        ctx,
        avatarX,
        avatarY,
        avatarTamanho,
        avatarTamanho,
        44
    );

    ctx.stroke();


    /* ======================================
       INFORMAÇÕES
    ====================================== */

    const infoX =
        490;

    const nome =
        memberName.textContent ||
        "Sem nome";

    const username =
        memberUsername.textContent ||
        "@usuario";


    ctx.fillStyle =
        "rgba(255,255,255,0.55)";

    ctx.font =
        "700 20px Arial";

    ctx.textAlign =
        "left";

    ctx.fillText(
        "NOME",
        infoX,
        centroY + 35
    );


    ctx.fillStyle =
        "#FFFFFF";

    ctx.font =
        "700 52px Arial";

    ctx.fillText(
        nome,
        infoX,
        centroY + 95
    );


    ctx.fillStyle =
        "rgba(255,255,255,0.65)";

    ctx.font =
        "400 25px Arial";

    ctx.fillText(
        username,
        infoX,
        centroY + 137
    );


    /* ======================================
       TAGS
    ====================================== */

    const tagY =
        centroY + 190;

    const tagLargura =
        200;

    const tagAltura =
        75;

    desenharEtiqueta(
        ctx,
        "MBTI",
        memberMbti.textContent || "—",
        infoX,
        tagY,
        tagLargura,
        tagAltura
    );


    desenharEtiqueta(
        ctx,
        "ENEAGRAMA",
        memberEneagrama.textContent || "—",
        infoX + 220,
        tagY,
        tagLargura,
        tagAltura
    );


    desenharEtiqueta(
        ctx,
        "TRITYPE",
        memberTritype.textContent || "—",
        infoX + 440,
        tagY,
        tagLargura,
        tagAltura
    );


    /* ======================================
       RODAPÉ
    ====================================== */

    const rodapeY =
        altura -
        Math.round(
            altura * 0.11
        );


    ctx.strokeStyle =
        "rgba(255,255,255,0.10)";

    ctx.lineWidth =
        2;

    ctx.beginPath();

    ctx.moveTo(
        0,
        rodapeY
    );

    ctx.lineTo(
        largura,
        rodapeY
    );

    ctx.stroke();


    ctx.fillStyle =
        "rgba(255,255,255,0.70)";

    ctx.font =
        "700 20px Arial";

    ctx.textAlign =
        "left";

    ctx.fillText(
        memberGroup.textContent ||
            "CASA DOS MBTIs",
        60,
        rodapeY + 45
    );


    ctx.textAlign =
        "right";

    ctx.fillStyle =
        "#FFFFFF";

    ctx.fillText(
        memberCargo.textContent ||
            "MEMBRO",
        largura - 60,
        rodapeY + 45
    );


    return canvas;
}


/* ==========================================
   BOTÃO DE DOWNLOAD
========================================== */

if (downloadButton) {

    downloadButton.addEventListener(
        "click",
        async function () {

            downloadButton.disabled =
                true;

            vipMessage.textContent =
                "Preparando sua identidade...";

            try {

                const canvas =
                    await criarImagemDoCard();


                canvas.toBlob(
                    function (blob) {

                        if (!blob) {

                            throw new Error(
                                "Não foi possível criar o arquivo."
                            );
                        }


                        const url =
                            URL.createObjectURL(
                                blob
                            );


                        const link =
                            document.createElement(
                                "a"
                            );


                        link.href =
                            url;

                        link.download =
                            "identidade-vip-casa-dos-mbtis.png";

                        document.body.appendChild(
                            link
                        );

                        link.click();

                        link.remove();


                        setTimeout(
                            function () {

                                URL.revokeObjectURL(
                                    url
                                );

                            },
                            3000
                        );


                        vipMessage.textContent =
                            "Identidade baixada com sucesso!";

                    },
                    "image/png"
                );


            } catch (error) {

                console.error(
                    "Erro no download:",
                    error
                );

                vipMessage.textContent =
                    "Não foi possível baixar o card.";

            } finally {

                downloadButton.disabled =
                    false;

            }

        }
    );
}


/* ==========================================
   INICIAR
========================================== */

carregarIdentidade();

