
function criarPostTexto(post) {
    const content = document.createElement("div");
    content.className = "post-content";

    if (post.titulo) {
        const title = document.createElement("div");
        title.className = "post-title";
        title.textContent = post.titulo;
        content.appendChild(title);
    }

    const text = document.createElement("div");
    text.className = "post-text";
    text.textContent = post.conteudo || "";

    content.appendChild(text);

    return content;
}
