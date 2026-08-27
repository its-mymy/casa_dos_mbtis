const SUPABASE_URL = "https://lhhoqahzpuohhhnbwgfp.supabase.co";
const SUPABASE_KEY = "sb_publishable_FTie2ELWKBc4Tz9r5fZuTw_izSaEHao";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const resetForm = document.getElementById("reset-form");
const newPassword = document.getElementById("new-password");
const confirmPassword = document.getElementById("confirm-password");
const resetButton = document.getElementById("reset-button");
const resetMessage = document.getElementById("reset-message");

function mostrarMensagem(mensagem, tipo) {
    resetMessage.textContent = mensagem;
    resetMessage.className = `reset-message ${tipo}`;
}

async function alterarSenha() {

    const senha = newPassword.value;
    const confirmacao = confirmPassword.value;

    if (senha.length < 6) {
        mostrarMensagem(
            "A senha precisa ter pelo menos 6 caracteres.",
            "error"
        );

        return;
    }

    if (senha !== confirmacao) {
        mostrarMensagem(
            "As senhas não são iguais.",
            "error"
        );

        return;
    }

    resetButton.disabled = true;
    resetButton.textContent = "ALTERANDO...";

    const {
        error
    } = await supabaseClient.auth.updateUser({
        password: senha
    });

    if (error) {

        console.error(
            "Erro ao alterar senha:",
            error
        );

        mostrarMensagem(
            error.message ||
            "Não foi possível alterar sua senha.",
            "error"
        );

        resetButton.disabled = false;
        resetButton.textContent = "ALTERAR SENHA";

        return;
    }

    mostrarMensagem(
        "Senha alterada com sucesso! Você já pode entrar novamente.",
        "success"
    );

    resetForm.reset();

    setTimeout(() => {
        window.location.href = "../../index.html";
    }, 2000);
}

resetForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        await alterarSenha();
    }
);

supabaseClient.auth.onAuthStateChange(
    function(event) {

        if (event === "PASSWORD_RECOVERY") {
            console.log(
                "Sessão de recuperação de senha iniciada."
            );
        }
    }
);