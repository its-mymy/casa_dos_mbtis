const SUPABASE_URL = "https://lhhoqahzpuohhhnbwgfp.supabase.co";
const SUPABASE_KEY = "sb_publishable_FTie2ELWKBc4Tz9r5fZuTw_izSaEHao";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
        }
    }
);

let usuarioAtual = null;
let perfilVisitado = null;
let seguindo = false;

const params = new URLSearchParams(window.location.search);
const perfilId = params.get("id");

const profileCard = document.getElementById("profile-card");
const bannerImage = document.getElementById("banner-image");
const avatarElement = document.getElementById("avatar");

const profileName = document.getElementById("profile-name");
const profileUsername = document.getElementById("profile-username");
const profileBadge = document.getElementById("profile-badge");

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
const infoPronomes = document.getElementById("info-pronomes");

const temperamentoSection = document.getElementById("temperamento-section");
const socionicsSection = document.getElementById("socionics-section");
const bigFiveSection = document.getElementById("big-five-section");
const likesSection = document.getElementById("likes-section");

const profileMusic = document.getElementById("profile-music");
const profileArtist = document.getElementById("profile-artist");
const profileGame = document.getElementById("profile-game");
const profileSeries = document.getElementById("profile-series");
const profileCharacter = document.getElementById("profile-character");

const vipSection = document.getElementById("vip-section");
const profileStatus = document.getElementById("profile-status");
const vipBigFive = document.getElementById("vip-big-five");
const vipTemperamento = document.getElementById("vip-temperamento");
const vipMusic = document.getElementById("vip-music");
const vipHobby = document.getElementById("vip-hobby");
const vipCharacter = document.getElementById("vip-character");

const aestheticSection = document.getElementById("aesthetic-section");
const showPrimary = document.getElementById("show-primary");
const showSecondary = document.getElementById("show-secondary");
const showAccent = document.getElementById("show-accent");
const colorPrimary = document.getElementById("color-primary");
const colorSecondary = document.getElementById("color-secondary");
const colorAccent = document.getElementById("color-accent");

const followersCount = document.getElementById("followers-count");
const followingCount = document.getElementById("following-count");
const followButton = document.getElementById("follow-button");

const followersButton = document.getElementById("followers-button");
const followingButton = document.getElementById("following-button");
const followModal = document.getElementById("follow-modal");
const followModalTitle = document.getElementById("follow-modal-title");
const closeFollowModal = document.getElementById("close-follow-modal");
const followList = document.getElementById("follow-list");

const miniProfile = document.getElementById("mini-profile");
const miniAvatar = document.getElementById("mini-avatar");
const miniName = document.getElementById("mini-name");
const miniUsername = document.getElementById("mini-username");


function normalizarUsername(username) {
    return String(username || "").trim().replace(/^@/, "");
}


function escaparHTML(valor) {
    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function escaparAtributo(valor) {
    return escaparHTML(valor);
}


function mostrarToast(mensagem) {
    let toast = document.getElementById("toast");

    if (!toast) {
        return;
    }

    toast.textContent = mensagem;
    toast.classList.add("show");

    clearTimeout(mostrarToast.timer);

    mostrarToast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}


function resolverURLAvatar(url) {
    if (!url) {
        return null;
    }

    const texto = String(url).trim();

    if (!texto) {
        return null;
    }

    if (texto.startsWith("http://") || texto.startsWith("https://")) {
        return texto;
    }

    const { data } = supabaseClient.storage
        .from("avatar")
        .getPublicUrl(texto);

    return data?.publicUrl || null;
}


function aplicarCores(perfil, temRecursosVip) {
    const primary = temRecursosVip ? perfil.cor_principal || "#8B5CF6" : "#8B5CF6";
    const secondary = temRecursosVip ? perfil.cor_secundaria || "#C084FC" : "#C084FC";
    const accent = temRecursosVip ? perfil.cor_destaque || "#60A5FA" : "#60A5FA";

    document.documentElement.style.setProperty("--primary", primary);
    document.documentElement.style.setProperty("--secondary", secondary);
    document.documentElement.style.setProperty("--accent", accent);

    const bordaNeon = temRecursosVip ? perfil.borda_neon || "" : "";

    if (profileCard) {
        if (bordaNeon) {
            profileCard.style.setProperty("--borda-neon", bordaNeon);
            profileCard.classList.add("borda-neon-personalizada");
        } else {
            profileCard.style.removeProperty("--borda-neon");
            profileCard.classList.remove("borda-neon-personalizada");
        }
    }

    if (showPrimary) {
        showPrimary.textContent = primary.toUpperCase();
    }

    if (showSecondary) {
        showSecondary.textContent = secondary.toUpperCase();
    }

    if (showAccent) {
        showAccent.textContent = accent.toUpperCase();
    }

    if (colorPrimary) {
        colorPrimary.style.background = primary;
    }

    if (colorSecondary) {
        colorSecondary.style.background = secondary;
    }

    if (colorAccent) {
        colorAccent.style.background = accent;
    }

    aestheticSection?.classList.toggle("hidden", !temRecursosVip);
}


function mostrarAvatar(perfil) {
    if (!avatarElement) {
        return;
    }

    if (perfil.avatar_url) {
        avatarElement.innerHTML = `
            <img src="${escaparAtributo(perfil.avatar_url)}" alt="Foto de perfil">
        `;
        return;
    }

    if (perfil.avatar_tipo?.startsWith("preset:")) {
        avatarElement.innerHTML = `
            <div class="public-avatar-placeholder">
                ${escaparHTML(perfil.avatar_tipo.replace("preset:", ""))}
            </div>
        `;
        return;
    }

    avatarElement.innerHTML = `
        <div class="public-avatar-placeholder">👤</div>
    `;
}


function mostrarBanner(perfil, temRecursosVip) {
    if (!bannerImage) {
        return;
    }

    if (temRecursosVip && perfil.banner_url) {
        bannerImage.src = perfil.banner_url;
        bannerImage.style.display = "block";
        return;
    }

    bannerImage.style.display = "none";
}


function definirBadges(perfil) {
    if (!profileBadge) {
        return;
    }

    const cargo = String(perfil.cargo || "").toLowerCase().trim();
    const isAdm = cargo === "adm";
    const isVip = perfil.vip === true;

    if (isAdm && isVip) {
        profileBadge.textContent = "🛡️ ADM · 💎 VIP";
        profileBadge.classList.remove("hidden");
    } else if (isAdm) {
        profileBadge.textContent = "🛡️ ADM";
        profileBadge.classList.remove("hidden");
    } else if (isVip) {
        profileBadge.textContent = "💎 VIP";
        profileBadge.classList.remove("hidden");
    } else {
        profileBadge.classList.add("hidden");
    }
}


function mostrarCamposComuns(perfil) {
    profileName.textContent = perfil.nome || "Sem nome";

    profileUsername.textContent =
        normalizarUsername(perfil.username)
            ? `@${normalizarUsername(perfil.username)}`
            : "@usuario";

    profileMbti.textContent = perfil.mbti || "MBTI";
    profileEneagrama.textContent = perfil.eneagrama || "Eneagrama";
    profileTritype.textContent = perfil.tritype || "Tritype";
    profileBio.textContent = perfil.bio || "Nenhuma bio adicionada.";

    infoMbti.textContent = perfil.mbti || "—";
    infoEneagrama.textContent = perfil.eneagrama || "—";
    infoTritype.textContent = perfil.tritype || "—";
    infoSubtipo.textContent = perfil.subtipo || "—";
    infoGrupo.textContent = perfil.grupo_casa || "—";
    infoPronomes.textContent = perfil.pronomes || "—";
}


function mostrarCamposVip(perfil, temRecursosVip) {
    const camposVip = [
        temperamentoSection,
        socionicsSection,
        bigFiveSection,
        likesSection,
        vipSection
    ];

    camposVip.forEach(elemento => {
        elemento?.classList.toggle("hidden", !temRecursosVip);
    });

    if (!temRecursosVip) {
        return;
    }

    infoTemperamento.textContent = perfil.temperamento || "—";
    infoSocionics.textContent = perfil.socionics || "—";
    infoBigFive.textContent = perfil.big_five || "—";

    profileMusic.textContent = perfil.musica_favorita || "—";
    profileArtist.textContent = perfil.artista_favorito || "—";
    profileGame.textContent = perfil.jogo_favorito || "—";
    profileSeries.textContent = perfil.serie_favorita || "—";
    profileCharacter.textContent = perfil.personagem_favorito || "—";

    profileStatus.textContent = perfil.status_perfil || "Nenhum status adicionado.";
    vipBigFive.textContent = perfil.big_five || "—";
    vipTemperamento.textContent = perfil.temperamento || "—";
    vipMusic.textContent = perfil.musica_favorita || "—";
    vipHobby.textContent = perfil.hobby || "—";
    vipCharacter.textContent = perfil.personagem_favorito || "—";
}


async function carregarUsuarioAtual() {
    try {
        const { data, error } = await supabaseClient.auth.getUser();

        if (error) {
            throw error;
        }

        usuarioAtual = data?.user || null;

        if (!usuarioAtual) {
            atualizarMiniPerfil();
            return;
        }

        const { data: perfil, error: perfilError } = await supabaseClient
            .from("profiles")
            .select("id, nome, username, cargo, vip, avatar_url, avatar_tipo")
            .eq("id", usuarioAtual.id)
            .maybeSingle();

        if (perfilError) {
            throw perfilError;
        }

        atualizarMiniPerfil(perfil);

    } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        usuarioAtual = null;
        atualizarMiniPerfil();
    }
}


function atualizarMiniPerfil(perfil = null) {
    if (!perfil) {
        miniAvatar.textContent = "👤";
        miniName.textContent = "Visitante";
        miniUsername.textContent = "Entrar";
        return;
    }

    const username = normalizarUsername(perfil.username);

    miniName.textContent = perfil.nome || "Membro";
    miniUsername.textContent = username ? `@${username}` : "@usuario";

    if (perfil.avatar_url) {
        miniAvatar.innerHTML = `
            <img src="${escaparAtributo(perfil.avatar_url)}" alt="Perfil">
        `;
    } else if (perfil.avatar_tipo?.startsWith("preset:")) {
        miniAvatar.textContent = perfil.avatar_tipo.replace("preset:", "");
    } else {
        miniAvatar.textContent = "👤";
    }
}


async function carregarPerfil() {
    if (!perfilId) {
        window.location.href = "../";
        return;
    }

    const { data: perfil, error } = await supabaseClient
        .from("profiles")
        .select(`
            id,
            nome,
            username,
            cargo,
            vip,
            mbti,
            eneagrama,
            tritype,
            subtipo,
            temperamento,
            socionics,
            big_five,
            grupo_casa,
            pronomes,
            bio,
            musica_favorita,
            artista_favorito,
            jogo_favorito,
            serie_favorita,
            personagem_favorito,
            hobby,
            status_perfil,
            avatar_url,
            avatar_tipo,
            banner_url,
            cor_principal,
            cor_secundaria,
            cor_destaque,
            borda_neon,
            created_at
        `)
        .eq("id", perfilId)
        .single();

    if (error || !perfil) {
        console.error("Erro ao carregar perfil:", error);

        profileCard.innerHTML = `
            <div class="profile-error">
                <h2>Perfil não encontrado.</h2>
                <a href="../">← Voltar aos membros</a>
            </div>
        `;

        return;
    }

    perfilVisitado = perfil;

    const cargo = String(perfil.cargo || "").toLowerCase().trim();
    const isAdm = cargo === "adm";
    const isVip = perfil.vip === true;
    const temRecursosVip = isAdm || isVip;

    definirBadges(perfil);
    mostrarCamposComuns(perfil);
    mostrarCamposVip(perfil, temRecursosVip);
    aplicarCores(perfil, temRecursosVip);
    mostrarAvatar(perfil);
    mostrarBanner(perfil, temRecursosVip);

    await carregarContadores();
    await verificarSeSegue();
}


async function carregarContadores() {
    if (!perfilId) {
        return;
    }

    const [
        seguidoresResponse,
        seguindoResponse
    ] = await Promise.all([
        supabaseClient
            .from("follows")
            .select("*", { count: "exact", head: true })
            .eq("following_id", perfilId),

        supabaseClient
            .from("follows")
            .select("*", { count: "exact", head: true })
            .eq("follower_id", perfilId)
    ]);

    if (seguidoresResponse.error) {
        console.error("Erro ao carregar seguidores:", seguidoresResponse.error);
    }

    if (seguindoResponse.error) {
        console.error("Erro ao carregar seguindo:", seguindoResponse.error);
    }

    followersCount.textContent = seguidoresResponse.count || 0;
    followingCount.textContent = seguindoResponse.count || 0;
}


async function verificarSeSegue() {
    if (!followButton) {
        return;
    }

    if (!usuarioAtual) {
        seguindo = false;
        followButton.textContent = "SEGUIR";
        followButton.classList.remove("following");
        return;
    }

    if (usuarioAtual.id === perfilId) {
        followButton.style.display = "none";
        return;
    }

    const { data, error } = await supabaseClient
        .from("follows")
        .select("follower_id")
        .eq("follower_id", usuarioAtual.id)
        .eq("following_id", perfilId)
        .maybeSingle();

    if (error) {
        console.error("Erro ao verificar follow:", error);
        return;
    }

    seguindo = !!data;

    if (seguindo) {
        followButton.textContent = "SEGUINDO";
        followButton.classList.add("following");
    } else {
        followButton.textContent = "SEGUIR";
        followButton.classList.remove("following");
    }
}


followButton?.addEventListener("click", async () => {
    if (!usuarioAtual) {
        sessionStorage.setItem("retornoNTP", window.location.href);
        window.location.href = "../../login/";
        return;
    }

    if (usuarioAtual.id === perfilId) {
        return;
    }

    followButton.disabled = true;

    try {
        if (seguindo) {
            const { error } = await supabaseClient
                .from("follows")
                .delete()
                .eq("follower_id", usuarioAtual.id)
                .eq("following_id", perfilId);

            if (error) {
                throw error;
            }

            seguindo = false;
            followButton.textContent = "SEGUIR";
            followButton.classList.remove("following");

        } else {
            const { error } = await supabaseClient
                .from("follows")
                .insert({
                    follower_id: usuarioAtual.id,
                    following_id: perfilId
                });

            if (error) {
                throw error;
            }

            seguindo = true;
            followButton.textContent = "SEGUINDO";
            followButton.classList.add("following");
        }

        await carregarContadores();

    } catch (error) {
        console.error("Erro ao alterar follow:", error);
        mostrarToast("Não foi possível alterar o follow.");
    } finally {
        followButton.disabled = false;
    }
});


async function abrirListaFollow(tipo) {
    if (!followModal || !followList || !perfilId) {
        return;
    }

    followModal.classList.remove("hidden");

    followModalTitle.textContent =
        tipo === "followers"
            ? "Seguidores"
            : "Seguindo";

    followList.innerHTML = "Carregando...";

    let query = supabaseClient
        .from("follows")
        .select("*")
        .order("created_at", { ascending: false });

    if (tipo === "followers") {
        query = query.eq("following_id", perfilId);
    } else {
        query = query.eq("follower_id", perfilId);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Erro ao carregar lista:", error);
        followList.innerHTML = "Não foi possível carregar a lista.";
        return;
    }

    if (!data?.length) {
        followList.innerHTML = "Ninguém por aqui ainda.";
        return;
    }

    const ids = data.map(item =>
        tipo === "followers"
            ? item.follower_id
            : item.following_id
    );

    const { data: perfis, error: perfisError } = await supabaseClient
        .from("profiles")
        .select("id, nome, username, avatar_url, avatar_tipo, mbti")
        .in("id", ids);

    if (perfisError) {
        console.error("Erro ao carregar perfis:", perfisError);
        followList.innerHTML = "Não foi possível carregar os perfis.";
        return;
    }

    followList.innerHTML = (perfis || []).map(perfil => {
        const avatarURL = resolverURLAvatar(perfil.avatar_url);

        let avatarHTML = "👤";

        if (avatarURL) {
            avatarHTML = `
                <img src="${escaparAtributo(avatarURL)}" alt="Foto de perfil">
            `;
        } else if (perfil.avatar_tipo?.startsWith("preset:")) {
            avatarHTML = escaparHTML(
                perfil.avatar_tipo.replace("preset:", "")
            );
        }

        return `
            <a href="./?id=${encodeURIComponent(perfil.id)}" class="follow-user">
                <div class="follow-user-avatar">
                    ${avatarHTML}
                </div>

                <div class="follow-user-info">
                    <strong>${escaparHTML(perfil.nome || "Membro")}</strong>
                    <span>
                        ${perfil.username ? `@${escaparHTML(normalizarUsername(perfil.username))}` : ""}
                        ${perfil.mbti ? ` · ${escaparHTML(perfil.mbti)}` : ""}
                    </span>
                </div>
            </a>
        `;
    }).join("");
}


followersButton?.addEventListener("click", () => {
    abrirListaFollow("followers");
});


followingButton?.addEventListener("click", () => {
    abrirListaFollow("following");
});


function fecharListaFollow() {
    followModal?.classList.add("hidden");
}


closeFollowModal?.addEventListener(
    "click",
    fecharListaFollow
);


followModal?.addEventListener("click", event => {
    if (event.target === followModal) {
        fecharListaFollow();
    }
});


miniProfile?.addEventListener("click", event => {
    if (!usuarioAtual) {
        event.preventDefault();
        window.location.href = "../../login/";
    }
});


document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        fecharListaFollow();
    }
});


async function iniciar() {
    await carregarUsuarioAtual();
    await carregarPerfil();
}


iniciar();