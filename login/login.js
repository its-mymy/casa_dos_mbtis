
const SUPABASE_URL = "https://lhhoqahzpuohhhnbwgfp.supabase.co";
const SUPABASE_KEY = "sb_publishable_FTie2ELWKBc4Tz9r5fZuTw_izSaEHao";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const loginSection = document.getElementById("login-section");
const registerSection = document.getElementById("register-section");

const showRegisterButton = document.getElementById("show-register");
const showLoginButton = document.getElementById("show-login");

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

const loginMessage = document.getElementById("login-message");
const registerMessage = document.getElementById("register-message");


/* =========================
   ALTERNAR LOGIN / CADASTRO
========================= */

showRegisterButton.addEventListener("click", function () {
    loginSection.classList.add("hidden");
    registerSection.classList.remove("hidden");

    loginMessage.textContent = "";
});


showLoginButton.addEventListener("click", function () {
    registerSection.classList.add("hidden");
    loginSection.classList.remove("hidden");

    registerMessage.textContent = "";
});


/* =========================
   LOGIN COM NICK
========================= */

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    loginMessage.textContent = "Entrando...";

    const username = document
        .getElementById("login-username")
        .value
        .trim();

    const password = document
        .getElementById("login-password")
        .value;


    if (!username) {
        loginMessage.textContent = "Digite seu nick.";
        return;
    }


    if (!password) {
        loginMessage.textContent = "Digite sua senha.";
        return;
    }


    try {

        const response = await fetch(
            `${SUPABASE_URL}/functions/v1/login-com-nick`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "apikey": SUPABASE_KEY
                },

                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }
        );


        const result = await response.json();


        if (!response.ok) {

            console.error(
                "Erro no login:",
                result
            );

            loginMessage.textContent =
                result.error ||
                "Nick ou senha incorretos.";

            return;
        }


        /* =========================
           CRIAR SESSÃO DO SUPABASE
        ========================= */

        const { error: sessionError } =
            await supabaseClient.auth.setSession({
                access_token: result.access_token,
                refresh_token: result.refresh_token
            });


        if (sessionError) {

            console.error(
                "Erro ao criar sessão:",
                sessionError
            );

            loginMessage.textContent =
                "Não foi possível iniciar a sessão.";

            return;
        }


        console.log(
            "Login realizado com nick!"
        );


        loginMessage.textContent =
            "Login realizado com sucesso!";


        window.location.href =
            "../perfil/index.html";


    } catch (error) {

        console.error(
            "Erro ao conectar:",
            error
        );

        loginMessage.textContent =
            "Erro ao conectar com o Supabase.";
    }
});


/* =========================
   CADASTRO
========================= */

registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    registerMessage.textContent =
        "Verificando código...";


    const codigo = document
        .getElementById("register-code")
        .value
        .trim();


    const email = document
        .getElementById("register-email")
        .value
        .trim();


    const password = document
        .getElementById("register-password")
        .value;


    if (!codigo) {

        registerMessage.textContent =
            "Digite o código de acesso.";

        return;
    }


    if (!email) {

        registerMessage.textContent =
            "Digite seu e-mail.";

        return;
    }


    if (password.length < 6) {

        registerMessage.textContent =
            "A senha precisa ter pelo menos 6 caracteres.";

        return;
    }


    try {

        console.log(
            "Código digitado:",
            JSON.stringify(codigo)
        );


        const {
            data: codigoValido,
            error: codigoError
        } = await supabaseClient.rpc(
            "verificar_codigo_convite",
            {
                codigo_informado: codigo
            }
        );


        console.log(
            "Resultado da RPC:",
            codigoValido
        );


        console.log(
            "Erro da RPC:",
            codigoError
        );


        if (codigoError) {

            console.error(
                "Erro ao verificar código:",
                codigoError
            );

            registerMessage.textContent =
                "Não foi possível verificar o código.";

            return;
        }


        if (!codigoValido) {

            registerMessage.textContent =
                "Código inválido ou já utilizado.";

            return;
        }


        registerMessage.textContent =
            "Código válido! Criando conta...";


        const {
            data,
            error
        } = await supabaseClient.auth.signUp({
            email,
            password,

            options: {
                data: {
                    codigo_convite: codigo
                }
            }
        });


        if (error) {

            console.error(
                "Erro ao criar conta:",
                error
            );

            registerMessage.textContent =
                error.message;

            return;
        }


        if (!data.user) {

            registerMessage.textContent =
                "Não foi possível criar a conta.";

            return;
        }


        const {
            data: conviteUsado,
            error: conviteError
        } = await supabaseClient.rpc(
            "usar_codigo_convite",
            {
                codigo_informado: codigo,
                usuario_id: data.user.id
            }
        );


        if (conviteError) {

            console.error(
                "Erro ao usar convite:",
                conviteError
            );

            registerMessage.textContent =
                "Conta criada, mas não foi possível registrar o convite.";

            return;
        }


        if (!conviteUsado) {

            registerMessage.textContent =
                "Esse código já foi usado.";

            return;
        }


        registerMessage.textContent =
            "Conta criada com sucesso!";


        registerForm.reset();


        console.log(
            "Usuário criado:",
            data.user
        );


    } catch (error) {

        console.error(
            "Erro:",
            error
        );

        registerMessage.textContent =
            "Ocorreu um erro ao criar a conta.";
    }
});
