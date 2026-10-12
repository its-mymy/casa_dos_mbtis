async function publicarEnqueteNoBanco() {
    const pergunta =
        pollQuestion?.value.trim() || "";

    const opcoes = pollOptionsInputs
        ? [
            ...pollOptionsInputs.querySelectorAll(
                ".poll-option-input"
            )
        ]
            .map(input => input.value.trim())
            .filter(Boolean)
        : [];

    if (!pergunta) {
        if (postMessage) {
            postMessage.textContent =
                "Digite a pergunta da enquete.";
        }

        return false;
    }

    if (opcoes.length < 2) {
        if (postMessage) {
            postMessage.textContent =
                "A enquete precisa ter pelo menos 2 opções.";
        }

        return false;
    }

    const {
        data: novoPost,
        error: postError
    } = await supabaseClient
        .from("feed_posts")
        .insert({
            author_id: usuarioAtual.id,
            tipo: "enquete",
            titulo: null,
            conteudo: pergunta
        })
        .select()
        .single();

    if (postError) {
        throw postError;
    }

    const opcoesParaInserir = opcoes.map(
        (texto, index) => ({
            post_id: novoPost.id,
            texto: texto,
            ordem: index
        })
    );

    const { error: optionsError } =
        await supabaseClient
            .from("feed_poll_options")
            .insert(opcoesParaInserir);

    if (optionsError) {
        await supabaseClient
            .from("feed_posts")
            .delete()
            .eq("id", novoPost.id);

        throw optionsError;
    }

    mostrarToast("📊 Enquete publicada!");

    return true;
}