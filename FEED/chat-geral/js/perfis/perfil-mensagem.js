
(() => {
    "use strict";

    function normalizarUsername(username) {
        return String(username || "").replace(/^@/, "").trim();
    }

    function formatarHora(data) {
        const date = new Date(data);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        return date.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    function criarCabecalho({ userId, profile = {}, createdAt }) {
        const urlPerfil = `../membros/perfil.html?id=${encodeURIComponent(userId)}`;
        const nome = profile.nome || profile.username || "Membro";
        const username = normalizarUsername(profile.username);

        const avatar = document.createElement("a");
        avatar.className = "avatar message-profile-link";
        avatar.href = urlPerfil;
        avatar.setAttribute("aria-label", `Ver perfil de ${nome}`);

        if (profile.avatar_url) {
            const img = document.createElement("img");
            img.src = profile.avatar_url;
            img.alt = "";
            img.loading = "lazy";
            avatar.appendChild(img);
        } else {
            avatar.textContent = profile.avatar_tipo?.startsWith("preset:")
                ? profile.avatar_tipo.slice(7)
                : "👤";
        }

        const meta = document.createElement("div");
        meta.className = "message-meta";

        const nomeLink = document.createElement("a");
        nomeLink.className = "message-name message-profile-link";
        nomeLink.href = urlPerfil;
        nomeLink.textContent = nome;
        meta.appendChild(nomeLink);

        if (username) {
            const usernameLink = document.createElement("a");
            usernameLink.className = "message-user message-profile-link";
            usernameLink.href = urlPerfil;
            usernameLink.textContent = `@${username}`;
            meta.appendChild(usernameLink);
        }

        const hora = document.createElement("time");
        hora.className = "message-time";
        hora.dateTime = createdAt || "";
        hora.textContent = formatarHora(createdAt);
        meta.appendChild(hora);

        return { avatar, meta };
    }

    window.ChatPerfilMensagem = {
        criarCabecalho
    };
})();
