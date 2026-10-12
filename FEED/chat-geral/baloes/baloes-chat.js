
(() => {
    "use strict";

    const PADRAO = {
        bubble_style: "padrao",
        effect: "aurora",
        color1: "#8B5CF6",
        color2: "#EC4899"
    };

    function normalizar(preferencia) {
        const item = preferencia || {};

        return {
            bubble_style: "padrao",
            effect: "aurora",
            color1: /^#[0-9a-f]{6}$/i.test(item.color1 || "")
                ? item.color1
                : PADRAO.color1,
            color2: /^#[0-9a-f]{6}$/i.test(item.color2 || "")
                ? item.color2
                : PADRAO.color2
        };
    }

    function aplicar(elemento, preferencia) {
        if (!elemento) return;

        const p = normalizar(preferencia);

        elemento.dataset.bubbleStyle = "padrao";
        elemento.dataset.effect = "aurora";
        elemento.dataset.personalizado = preferencia ? "true" : "false";

        elemento.style.setProperty("--bubble-color-1", p.color1);
        elemento.style.setProperty("--bubble-color-2", p.color2);

        /* Remove restos dos desenhos e efeitos antigos */
        elemento.querySelectorAll(
            ":scope > .bubble-shape-art, " +
            ":scope > .bubble-cloud-art, " +
            ":scope > .bubble-floating-emojis"
        ).forEach(item => item.remove());
    }

    async function carregarPreferencias(client, userIds) {
        const ids = [...new Set((userIds || []).filter(Boolean))];

        if (!ids.length) return new Map();

        const { data, error } = await client
            .from("chat_bubble_preferences")
            .select("user_id,color1,color2")
            .in("user_id", ids);

        if (error) throw error;

        return new Map(
            (data || []).map(item => [
                item.user_id,
                normalizar(item)
            ])
        );
    }

    window.ChatBaloes = {
        padrao: { ...PADRAO },
        normalizar,
        aplicar,
        carregarPreferencias
    };
})();