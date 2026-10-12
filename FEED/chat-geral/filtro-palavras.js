/*
 * Filtro de experiência do usuário.
 * A validação real também ocorre no banco (SQL); não dependa apenas deste arquivo.
 */
(function () {
    "use strict";

    const TERMOS_BLOQUEADOS = [
        // Lista inicial ilustrativa; mantenha e ajuste conforme as regras da comunidade.
        /\bputa\b/giu,
        /\bputo\b/giu,
        /\bputaria\b/giu,
        /\bmerda\b/giu,
        /\bcaralho\b/giu,
        /\bporra\b/giu,
        /\bfod[aeiou]\w*\b/giu,
        /\bbuceta\b/giu,
        /\bcu\b/giu,
        /\bpau\b/giu,
        /\bpênis\b/giu,
        /\bvagina\b/giu,
        /\bsexo explícito\b/giu
    ];

    window.ChatFiltro = {
        limpar(texto) {
            let resultado = String(texto || "");
            for (const padrao of TERMOS_BLOQUEADOS) {
                resultado = resultado.replace(padrao, match => "•".repeat(Math.min(match.length, 8)));
            }
            return resultado;
        },
        contemTermoBloqueado(texto) {
            return TERMOS_BLOQUEADOS.some(padrao => {
                padrao.lastIndex = 0;
                return padrao.test(String(texto || ""));
            });
        }
    };
})();
