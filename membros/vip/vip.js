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

function mostrarAvatar(
    url,
    tipo
) {

    if (
        tipo &&
        tipo.startsWith("preset:")
    ) {

        const emoji =
            tipo.replace(
                "preset:",
                ""
            );

        memberAvatar.innerHTML =
            "";

        const placeholder =
            document.createElement(
                "div"
            );

        placeholder.className =
            "avatar-emoji";

        placeholder.textContent =
            emoji;

        memberAvatar.appendChild(
            placeholder
        );

        return;
    }


    if (url) {

        memberAvatar.innerHTML =
            "";

        const img =
            document.createElement(
                "img"
            );

        img.src =
            url;

        img.alt =
            "Avatar do membro";

        memberAvatar.appendChild(
            img
        );

        return;
    }


    memberAvatar.innerHTML =
        '<div class="avatar-emoji">👤</div>';
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
       CORES DO PERFIL
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
        nome;

    memberUsername.textContent =
        username;

    memberMbti.textContent =
        perfil.mbti ||
        "—";

    memberEneagrama.textContent =
        perfil.eneagrama ||
        "—";

    memberTritype.textContent =
        perfil.tritype ||
        "—";

    memberGroup.textContent =
        perfil.grupo_casa ||
        "CASA DOS MBTIs";


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
       DATA DE ENTRADA
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
   BAIXAR CARD
========================================== */

if (downloadButton) {

    downloadButton.addEventListener(
        "click",
        async function () {

            if (
                typeof html2canvas ===
                "undefined"
            ) {

                vipMessage.textContent =
                    "Não foi possível preparar o download.";

                return;
            }


            vipMessage.textContent =
                "Preparando sua identidade...";


            const estavaVirado =
                identityCard.classList.contains(
                    "flipped"
                );


            /* ----------------------------------
               Para baixar a frente
            ---------------------------------- */

            if (estavaVirado) {

                identityCard.classList.remove(
                    "flipped"
                );

                await new Promise(
                    resolve =>
                        setTimeout(
                            resolve,
                            500
                        )
                );
            }


            try {

                const canvas =
                    await html2canvas(
                        identityCard,
                        {
                            backgroundColor:
                                null,

                            scale:
                                2,

                            useCORS:
                                true,

                            allowTaint:
                                false
                        }
                    );


                const link =
                    document.createElement(
                        "a"
                    );


                link.download =
                    "identidade-vip-casa-dos-mbtis.png";


                link.href =
                    canvas.toDataURL(
                        "image/png"
                    );


                link.click();


                vipMessage.textContent =
                    "Identidade baixada com sucesso!";


            } catch (error) {

                console.error(
                    "Erro ao gerar identidade:",
                    error
                );

                vipMessage.textContent =
                    "Não foi possível gerar a imagem.";


            } finally {

                if (estavaVirado) {

                    identityCard.classList.add(
                        "flipped"
                    );
                }
            }
        }
    );
}


/* ==========================================
   INICIAR
========================================== */

carregarIdentidade();