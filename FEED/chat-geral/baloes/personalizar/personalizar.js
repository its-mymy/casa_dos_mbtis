(() => {
    "use strict";

    const SUPABASE_URL = "https://lhhoqahzpuohhhnbwgfp.supabase.co";
    const SUPABASE_KEY = "sb_publishable_FTie2ELWKBc4Tz9r5fZuTw_izSaEHao";

    const el = id => document.getElementById(id);

    const form = el("bubble-form");
    const accessMessage = el("access-message");
    const color1Input = el("color1");
    const color2Input = el("color2");
    const preview = el("bubble-preview");
    const saveButton = el("save-bubble");
    const saveStatus = el("save-status");
    const resetButton = el("reset-bubble");

    const PADRAO = {
        bubble_style: "padrao",
        effect: "aurora",
        color1: "#8B5CF6",
        color2: "#EC4899"
    };

    let client = null;
    let currentUser = null;

    function temAcesso(profile) {
        if (String(profile?.cargo || "").trim().toLowerCase() === "adm") {
            return true;
        }

        if (profile?.vip !== true) {
            return false;
        }

        if (!profile.vip_expira_em) {
            return true;
        }

        const validade = new Date(profile.vip_expira_em).getTime();

        return Number.isFinite(validade) && validade > Date.now();
    }

    function preferenciasAtuais() {
        return {
            ...PADRAO,
            color1: color1Input.value,
            color2: color2Input.value
        };
    }

    function atualizarPrevia() {
        if (window.ChatBaloes) {
            window.ChatBaloes.aplicar(preview, preferenciasAtuais());
        }
    }

    function preencherCores(preferencias) {
        color1Input.value = preferencias.color1 || PADRAO.color1;
        color2Input.value = preferencias.color2 || PADRAO.color2;
        atualizarPrevia();
    }

    function mostrarAviso(mensagem, mostrarLogin = false) {
        accessMessage.classList.remove("hidden");
        accessMessage.textContent = mensagem;

        if (mostrarLogin) {
            const link = document.createElement("a");
            link.href = "../../../../login/index.html";
            link.textContent = " Entrar na conta";

            accessMessage.append(document.createElement("br"), link);
        }
    }

    async function inicializar() {
        if (!window.supabase || !window.ChatBaloes) {
            mostrarAviso("Não foi possível carregar a personalização. Atualize a página e tente novamente.");
            return;
        }

        client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

        const { data: { session }, error: sessionError } =
            await client.auth.getSession();

        if (sessionError) {
            throw sessionError;
        }

        if (!session?.user) {
            mostrarAviso("Entre na sua conta da Casa dos MBTIs para personalizar o balão.", true);
            return;
        }

        currentUser = session.user;

        const { data: profile, error: profileError } = await client
            .from("profiles")
            .select("vip,cargo,vip_expira_em")
            .eq("id", currentUser.id)
            .maybeSingle();

        if (profileError) {
            throw profileError;
        }

        if (!temAcesso(profile)) {
            mostrarAviso("A personalização de balões é exclusiva de membros VIP com benefício válido e ADMs.");
            return;
        }

        const { data: saved, error: savedError } = await client
            .from("chat_bubble_preferences")
            .select("color1,color2")
            .eq("user_id", currentUser.id)
            .maybeSingle();

        if (savedError) {
            throw savedError;
        }

        form.classList.remove("hidden");
        preencherCores(saved || PADRAO);
    }

    color1Input.addEventListener("input", atualizarPrevia);
    color2Input.addEventListener("input", atualizarPrevia);

    resetButton.addEventListener("click", () => {
        preencherCores(PADRAO);
        saveStatus.textContent =
            "Cores padrão restauradas na prévia. Salve para aplicar no chat.";
    });

    form.addEventListener("submit", async event => {
        event.preventDefault();

        if (!currentUser || !client) {
            return;
        }

        saveButton.disabled = true;
        saveStatus.textContent = "Salvando suas cores...";

        try {
            const { error } = await client
                .from("chat_bubble_preferences")
                .upsert({
                    user_id: currentUser.id,
                    bubble_style: "padrao",
                    effect: "aurora",
                    color1: color1Input.value,
                    color2: color2Input.value,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: "user_id"
                });

            if (error) {
                throw error;
            }

            atualizarPrevia();
            saveStatus.textContent =
                "Cores salvas! Seu balão terá o contorno neon no chat. ✨";
        } catch (error) {
            console.error("Erro ao salvar personalização:", error);
            saveStatus.textContent =
                error.message || "Não foi possível salvar suas cores.";
        } finally {
            saveButton.disabled = false;
        }
    });

    inicializar().catch(error => {
        console.error("Erro ao abrir personalização:", error);
        mostrarAviso("Não foi possível carregar sua personalização. Atualize a página e tente novamente.");
    });
})();