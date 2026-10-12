
function criarPostEnquete(post) {
    const content = document.createElement("div");
    content.className = "post-content";

    const question = document.createElement("div");
    question.className = "poll-question";
    question.textContent = post.conteudo || "Enquete";

    content.appendChild(question);

    const options = document.createElement("div");
    options.className = "poll-options";

    const votes = post.votes || [];
    const totalVotes = votes.length;

    const sortedOptions = [
        ...(post.feed_poll_options || [])
    ].sort((a, b) => (a.ordem || 0) - (b.ordem || 0));

    let meuVoto = null;

    if (usuarioAtual) {
        meuVoto = votes.find(
            vote => vote.user_id === usuarioAtual.id
        ) || null;
    }

    sortedOptions.forEach(option => {
        const optionVotes = votes.filter(
            vote => vote.option_id === option.id
        ).length;

        const percent = totalVotes
            ? Math.round((optionVotes / totalVotes) * 100)
            : 0;

        const button = document.createElement("button");
        button.type = "button";
        button.className = "poll-option";

        if (meuVoto?.option_id === option.id) {
            button.classList.add("voted");
        }

        button.innerHTML = `
            <div
                class="poll-option-bar"
                style="width:${percent}%"
            ></div>

            <div class="poll-option-content">
                <span class="poll-option-text">
                    ${escaparHTML(option.texto)}
                </span>

                <span class="poll-percent">
                    ${percent}%
                </span>
            </div>
        `;

        button.addEventListener("click", () => {
            votarEnquete(post, option.id);
        });

        options.appendChild(button);
    });

    content.appendChild(options);

    const footer = document.createElement("div");
    footer.className = "poll-footer";

    const total = document.createElement("span");
    total.className = "poll-total";
    total.textContent = `${totalVotes} ${
        totalVotes === 1 ? "voto" : "votos"
    }`;

    footer.appendChild(total);

    const voteButton = document.createElement("button");
    voteButton.type = "button";
    voteButton.className = "vote-button";

    if (!usuarioAtual) {
        voteButton.textContent = "ENTRAR PARA VOTAR";
    } else if (meuVoto) {
        voteButton.textContent = "✓ VOTADO";
        voteButton.disabled = true;
    } else {
        voteButton.textContent = "ESCOLHER OPÇÃO";
    }

    voteButton.addEventListener("click", () => {
        if (!usuarioAtual) {
            irParaLogin();
            return;
        }

        if (meuVoto) {
            return;
        }

        const primeiraOpcao = sortedOptions[0];

        if (primeiraOpcao) {
            votarEnquete(post, primeiraOpcao.id);
        }
    });

    footer.appendChild(voteButton);
    content.appendChild(footer);

    return content;
}

async function votarEnquete(post, optionId) {
    if (!usuarioAtual) {
        irParaLogin();
        return;
    }

    const jaVotou = (post.votes || []).some(
        vote => vote.user_id === usuarioAtual.id
    );

    if (jaVotou) {
        mostrarToast("Você já votou nessa enquete.");
        return;
    }

    const { error } = await supabaseClient
        .from("feed_poll_votes")
        .insert({
            post_id: post.id,
            option_id: optionId,
            user_id: usuarioAtual.id
        });

    if (error) {
        console.error("Erro ao votar:", error);

        if (error.code === "23505") {
            mostrarToast("Você já votou nessa enquete.");
        } else {
            mostrarToast("Não foi possível registrar seu voto.");
        }

        return;
    }

    if (!post.votes) {
        post.votes = [];
    }

    post.votes.push({
        post_id: post.id,
        option_id: optionId,
        user_id: usuarioAtual.id
    });

    renderizarFeed();

    mostrarToast("✅ Voto registrado!");
}
