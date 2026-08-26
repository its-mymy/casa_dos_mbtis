const SUPABASE_URL = "https://lhhoqahzpuohhhnbwgfp.supabase.co";
const SUPABASE_KEY = "sb_publishable_FTie2ELWKBc4Tz9r5fZuTw_izSaEHao";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

let usuarioLogado = null;
let perfilVisitado = null;
let seguindo = false;

const params = new URLSearchParams(
    window.location.search
);

const perfilId = params.get("id");

const profileCard = document.getElementById("profile-card");
const bannerImage = document.getElementById("banner-image");
const avatarElement = document.getElementById("avatar");

const profileName = document.getElementById("profile-name");
const profileUsername = document.getElementById("profile-username");

const profileMbti = document.getElementById("profile-mbti");
const profileEneagrama = document.getElementById("profile-eneagrama");
const profileTritype = document.getElementById("profile-tritype");

const profileBio = document.getElementById("profile-bio");

const infoMbti = document.getElementById("info-mbti");
const infoEneagrama = document.getElementById("info-eneagrama");
const infoTritype = document.getElementById("info-tritype");
const infoSubtipo = document.getElementById("info-subtipo");
const infoTemperamento = document.getElementById("info-temperamento");
const infoSocionics = document.getElementById("info-socionics");
const infoBigFive = document.getElementById("info-big-five");
const infoGrupo = document.getElementById("info-grupo");

const profileMusic = document.getElementById("profile-music");
const profileArtist = document.getElementById("profile-artist");
const profileGame = document.getElementById("profile-game");
const profileSeries = document.getElementById("profile-series");
const profileCharacter = document.getElementById("profile-character");

const followersCount = document.getElementById("followers-count");
const followingCount = document.getElementById("following-count");

const followButton = document.getElementById("follow-button");

const followersButton =
    document.getElementById("followers-button");

const followingButton =
    document.getElementById("following-button");

const followModal =
    document.getElementById("follow-modal");

const closeFollowModal =
    document.getElementById("close-follow-modal");

const followModalTitle =
    document.getElementById("follow-modal-title");

const followList =
    document.getElementById("follow-list");

const createProfileButton =
    document.getElementById("create-profile-button");

function aplicarCores(perfil) {
    const primary =
        perfil.cor_principal || "#8B5CF6";

    const secondary =
        perfil.cor_secundaria || "#C084FC";

    const accent =
        perfil.cor_destaque || "#60A5FA";

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

function mostrarAvatar(perfil) {
    if (
        perfil.avatar_tipo &&
        perfil.avatar_tipo.startsWith("preset:")
    ) {
        avatarElement.innerHTML =
            perfil.avatar_tipo.replace("preset:", "");

        return;
    }

    if (perfil.avatar_url) {
        avatarElement.innerHTML = `
            <img
                src="${perfil.avatar_url}"
                alt="Foto de perfil"
            >
        `;

        return;
    }

    avatarElement.textContent = "👤";
}

function mostrarBanner(perfil) {
    if (perfil.banner_url) {
        bannerImage.src =
            perfil.banner_url;

        bannerImage.style.display =
            "block";
    }
}

async function carregarContadores() {
    const {
        count: seguidores
    } = await supabaseClient
        .from("follows")
        .select("*", {
            count: "exact",
            head: true
        })
        .eq(
            "following_id",
            perfilId
        );

    const {
        count: seguindoCount
    } = await supabaseClient
        .from("follows")
        .select("*", {
            count: "exact",
            head: true
        })
        .eq(
            "follower_id",
            perfilId
        );

    followersCount.textContent =
        seguidores || 0;

    followingCount.textContent =
        seguindoCount || 0;
}

function escaparHTML(valor) {
    return String(valor)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function avatarDoSeguidor(perfil) {
    if (
        perfil.avatar_tipo &&
        perfil.avatar_tipo.startsWith("preset:")
    ) {
        return `
            <div class="follow-person-avatar">
                ${escaparHTML(
                    perfil.avatar_tipo.replace("preset:", "")
                )}
            </div>
        `;
    }

    if (perfil.avatar_url) {
        return `
            <div class="follow-person-avatar">
                <img
                    src="${escaparHTML(perfil.avatar_url)}"
                    alt="Foto de perfil"
                >
            </div>
        `;
    }

    return `
        <div class="follow-person-avatar">
            👤
        </div>
    `;
}

async function abrirListaFollow(tipo) {
    followModal.classList.remove("hidden");

    followModalTitle.textContent =
        tipo === "followers"
            ? "Seguidores"
            : "Seguindo";

    followList.innerHTML =
        "Carregando...";

    const coluna =
        tipo === "followers"
            ? "following_id"
            : "follower_id";

    const colunaPerfil =
        tipo === "followers"
            ? "follower_id"
            : "following_id";

    const {
        data: follows,
        error: followError
    } = await supabaseClient
        .from("follows")
        .select(`id, ${colunaPerfil}`)
        .eq(coluna, perfilId);

    if (followError) {
        console.error(
            "Erro ao carregar lista:",
            followError
        );

        followList.innerHTML = `
            <div class="follow-empty">
                Não foi possível carregar esta lista.
            </div>
        `;

        return;
    }

    if (!follows || !follows.length) {
        followList.innerHTML = `
            <div class="follow-empty">
                ${
                    tipo === "followers"
                        ? "Este perfil ainda não tem seguidores."
                        : "Este perfil ainda não segue ninguém."
                }
            </div>
        `;

        return;
    }

    const ids =
        follows.map(
            item => item[colunaPerfil]
        );

    const {
        data: perfis,
        error: perfilError
    } = await supabaseClient
        .from("profiles")
        .select(`
            id,
            nome,
            username,
            avatar_url,
            avatar_tipo
        `)
        .in("id", ids);

    if (perfilError) {
        console.error(
            "Erro ao carregar perfis:",
            perfilError
        );

        followList.innerHTML = `
            <div class="follow-empty">
                Não foi possível carregar os perfis.
            </div>
        `;

        return;
    }

    followList.innerHTML = "";

    perfis.forEach(perfil => {
        const link =
            document.createElement("a");

        link.className =
            "follow-person";

        link.href =
            `perfil.html?id=${encodeURIComponent(
                perfil.id
            )}`;

        link.innerHTML = `
            ${avatarDoSeguidor(perfil)}

            <div class="follow-person-info">
                <strong>
                    ${escaparHTML(
                        perfil.nome || "Sem nome"
                    )}
                </strong>

                <span>
                    ${
                        perfil.username
                            ? "@" +
                              escaparHTML(
                                  perfil.username.replace(/^@/, "")
                              )
                            : "@usuario"
                    }
                </span>
            </div>
        `;

        followList.appendChild(link);
    });
}

async function verificarSeSegue() {
    if (!usuarioLogado) {
        followButton.style.display =
            "none";

        if (createProfileButton) {
            createProfileButton.style.display =
                "inline-block";
        }

        return;
    }

    if (usuarioLogado.id === perfilId) {
        followButton.style.display =
            "none";

        if (createProfileButton) {
            createProfileButton.style.display =
                "none";
        }

        return;
    }

    if (createProfileButton) {
        createProfileButton.style.display =
            "none";
    }

    followButton.style.display =
        "inline-block";

    const {
        data,
        error
    } = await supabaseClient
        .from("follows")
        .select("id")
        .eq(
            "follower_id",
            usuarioLogado.id
        )
        .eq(
            "following_id",
            perfilId
        )
        .maybeSingle();

    if (error) {
        console.error(
            "Erro ao verificar follow:",
            error
        );

        return;
    }

    seguindo = !!data;

    atualizarBotaoFollow();
}

function atualizarBotaoFollow() {
    if (seguindo) {
        followButton.textContent =
            "SEGUINDO";

        followButton.classList.add(
            "following"
        );
    } else {
        followButton.textContent =
            "SEGUIR";

        followButton.classList.remove(
            "following"
        );
    }
}

async function alternarFollow() {
    if (!usuarioLogado) {
        window.location.href =
            "../login/index.html";

        return;
    }

    if (usuarioLogado.id === perfilId) {
        return;
    }

    followButton.disabled = true;

    if (seguindo) {
        const {
            error
        } = await supabaseClient
            .from("follows")
            .delete()
            .eq(
                "follower_id",
                usuarioLogado.id
            )
            .eq(
                "following_id",
                perfilId
            );

        if (error) {
            console.error(
                "Erro ao deixar de seguir:",
                error
            );

            followButton.disabled = false;
            return;
        }

        seguindo = false;
    } else {
        const {
            error
        } = await supabaseClient
            .from("follows")
            .insert({
                follower_id:
                    usuarioLogado.id,

                following_id:
                    perfilId
            });

        if (error) {
            console.error(
                "Erro ao seguir:",
                error
            );

            followButton.disabled = false;
            return;
        }

        seguindo = true;
    }

    atualizarBotaoFollow();
    await carregarContadores();

    followButton.disabled = false;
}

async function iniciar() {
    if (!perfilId) {
        window.location.href =
            "index.html";

        return;
    }

    const {
        data: { user }
    } = await supabaseClient.auth.getUser();

    usuarioLogado = user;

    if (!usuarioLogado) {
        followButton.style.display =
            "none";

        if (createProfileButton) {
            createProfileButton.style.display =
                "inline-block";
        }
    } else {
        if (createProfileButton) {
            createProfileButton.style.display =
                "none";
        }
    }

    const {
        data: perfil,
        error: perfilError
    } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq(
            "id",
            perfilId
        )
        .single();

    if (perfilError || !perfil) {
        console.error(
            "Erro ao carregar perfil:",
            perfilError
        );

        profileCard.innerHTML = `
            <div style="
                padding:40px;
                text-align:center;
            ">
                <h2>Perfil não encontrado.</h2>
                <a href="index.html">
                    Voltar aos membros
                </a>
            </div>
        `;

        return;
    }

    perfilVisitado = perfil;

    aplicarCores(perfil);
    mostrarAvatar(perfil);
    mostrarBanner(perfil);

    profileName.textContent =
        perfil.nome || "Sem nome";

    profileUsername.textContent =
        perfil.username
            ? `@${perfil.username.replace(/^@/, "")}`
            : "@usuario";

    profileMbti.textContent =
        perfil.mbti || "MBTI";

    profileEneagrama.textContent =
        perfil.eneagrama || "Eneagrama";

    profileTritype.textContent =
        perfil.tritype || "Tritype";

    profileBio.textContent =
        perfil.bio ||
        "Nenhuma bio adicionada.";

    infoMbti.textContent =
        perfil.mbti || "—";

    infoEneagrama.textContent =
        perfil.eneagrama || "—";

    infoTritype.textContent =
        perfil.tritype || "—";

    infoSubtipo.textContent =
        perfil.subtipo || "—";

    infoTemperamento.textContent =
        perfil.temperamento || "—";

    infoSocionics.textContent =
        perfil.socionics || "—";

    infoBigFive.textContent =
        perfil.big_five || "—";

    infoGrupo.textContent =
        perfil.grupo_casa || "—";

    profileMusic.textContent =
        perfil.musica_favorita || "—";

    profileArtist.textContent =
        perfil.artista_favorito || "—";

    profileGame.textContent =
        perfil.jogo_favorito || "—";

    profileSeries.textContent =
        perfil.serie_favorita || "—";

    profileCharacter.textContent =
        perfil.personagem_favorito || "—";

    await carregarContadores();
    await verificarSeSegue();
}

if (followButton) {
    followButton.addEventListener(
        "click",
        alternarFollow
    );
}
if (followersButton) {
    followersButton.addEventListener(
        "click",
        function () {
            abrirListaFollow("followers");
        }
    );
}

if (followingButton) {
    followingButton.addEventListener(
        "click",
        function () {
            abrirListaFollow("following");
        }
    );
}

if (closeFollowModal) {
    closeFollowModal.addEventListener(
        "click",
        function () {
            followModal.classList.add("hidden");
        }
    );
}

if (followModal) {
    followModal.addEventListener(
        "click",
        function (event) {
            if (event.target === followModal) {
                followModal.classList.add("hidden");
            }
        }
    );
}

if (createProfileButton) {
    createProfileButton.addEventListener(
        "click",
        async function () {
            const {
                data: { user }
            } = await supabaseClient.auth.getUser();

            if (user) {
                window.location.href =
                    "../perfil/index.html";
            } else {
                window.location.href =
                    "../login/index.html";
            }
        }
    );
}

iniciar();