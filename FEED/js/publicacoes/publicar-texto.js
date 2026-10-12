async function publicarTextoNoBanco() {
    const titulo =
        postTitle?.value.trim() || "";

    const conteudo =
        postContent?.value.trim() || "";

    if (!conteudo) {
        if (postMessage) {
            postMessage.textContent =
                "Escreva algo para publicar.";
        }

        return false;
    }

    const { error } = await supabaseClient
        .from("feed_posts")
        .insert({
            author_id: usuarioAtual.id,
            tipo: "texto",
            titulo: titulo || null,
            conteudo: conteudo
        });

    if (error) {
        throw error;
    }

    mostrarToast("✅ Publicação publicada!");

    return true;
}