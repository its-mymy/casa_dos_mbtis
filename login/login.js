
const SUPABASE_URL = "https://lhhoqahzpuohhhnbwgfp.supabase.co";
const SUPABASE_KEY = "sb_publishable_FTie2ELWKBc4Tz9r5fZuTw_izSaEHao";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


const loginSection =
    document.getElementById("login-section");

const registerSection =
    document.getElementById("register-section");


const showRegisterButton =
    document.getElementById("show-register");

const showLoginButton =
    document.getElementById("show-login");


const loginForm =
    document.getElementById("login-form");

const registerForm =
    document.getElementById("register-form");


const loginMessage =
    document.getElementById("login-message");

const registerMessage =
    document.getElementById("register-message");


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

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        loginMessage.textContent =
            "Entrando...";


        const username =
            document
                .getElementById("login-username")
                .value
                .trim();


        const password =
            document
                .getElementById("login-password")
                .value;


        if (!username) {

            loginMessage.textContent =
                "Digite seu nick.";

            return;

        }


        if (!password) {

            loginMessage.textContent =
                "Digite sua senha.";

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


            const result =
                await response.json();


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
const {
    error: sessionError
} = await supabaseClient.auth.setSession({
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
    "Conectando...";

const botaoLogin =
    loginForm.querySelector(
        ".main-button"
    );

if (botaoLogin) {
    botaoLogin.disabled = true;
    botaoLogin.textContent =
        "CONECTANDO...";
}

setTimeout(
    () => {
        window.location.href =
            "../../FEED/";
    },
    500
);

} catch (error) {

    console.error(
        "Erro ao conectar:",
        error
    );

    loginMessage.textContent =
        "Erro ao conectar com o Supabase.";

}

}
);



/* =========================
   CADASTRO
========================= */

registerForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        registerMessage.textContent =
            "Verificando informações...";


        const codigo =
            document
                .getElementById("register-code")
                .value
                .trim();


        let username =
            document
                .getElementById("register-username")
                .value
                .trim();


        const email =
            document
                .getElementById("register-email")
                .value
                .trim();


        const password =
            document
                .getElementById("register-password")
                .value;


        /* =========================
           VALIDAR NICK
        ========================= */


        if (!username) {

            registerMessage.textContent =
                "Digite seu @username.";

            return;

        }


        // Remove @ do começo

        username =
            username.replace(/^@+/, "");


        // Remove espaços

        username =
            username.trim();


        if (!username) {

            registerMessage.textContent =
                "Digite um username válido.";

            return;

        }


        // Limite

        if (username.length < 2) {

            registerMessage.textContent =
                "O username precisa ter pelo menos 2 caracteres.";

            return;

        }


        // Apenas caracteres seguros

        if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {

            registerMessage.textContent =
                "O username só pode ter letras, números, _, . e -.";

            return;

        }


        /* =========================
           VALIDAR CÓDIGO
        ========================= */

        if (!codigo) {

            registerMessage.textContent =
                "Digite o código de acesso.";

            return;

        }


        /* =========================
           VALIDAR E-MAIL
        ========================= */

        if (!email) {

            registerMessage.textContent =
                "Digite seu e-mail.";

            return;

        }


        /* =========================
           VALIDAR SENHA
        ========================= */

        if (password.length < 6) {

            registerMessage.textContent =
                "A senha precisa ter pelo menos 6 caracteres.";

            return;

        }


        try {

            /* =========================
               VERIFICAR USERNAME
            ========================= */

            registerMessage.textContent =
                "Verificando @username...";


            const {
                data: usernameDisponivel,
                error: usernameError
            } =
                await supabaseClient.rpc(
                    "verificar_username_disponivel",
                    {
                        p_username: username
                    }
                );


            if (usernameError) {

                console.error(
                    "Erro ao verificar username:",
                    usernameError
                );

                registerMessage.textContent =
                    "Não foi possível verificar o username.";

                return;

            }


            if (!usernameDisponivel) {

                registerMessage.textContent =
                    `O @${username} já está em uso. Escolha outro.`;

                return;

            }


            /* =========================
               VERIFICAR CÓDIGO
            ========================= */

            registerMessage.textContent =
                "Verificando código...";


            const {
                data: codigoValido,
                error: codigoError
            } =
                await supabaseClient.rpc(
                    "verificar_codigo_convite",
                    {
                        codigo_informado: codigo
                    }
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


            /* =========================
               CRIAR CONTA
            ========================= */

            registerMessage.textContent =
                "Criando conta...";


            const {
                data,
                error
            } =
                await supabaseClient.auth.signUp({

                    email: email,

                    password: password,

                    options: {

                        data: {

                            username: username,

                            codigo_convite: codigo

                        }

                    }

                });


            if (error) {

                console.error(
                    "Erro ao criar conta:",
                    error
                );


                // Caso duas pessoas tentem
                // pegar o mesmo nick ao mesmo tempo

                if (
                    error.message
                        .toLowerCase()
                        .includes("username")
                ) {

                    registerMessage.textContent =
                        "Esse @username já está em uso.";

                } else {

                    registerMessage.textContent =
                        error.message;

                }

                return;

            }


            if (!data.user) {

                registerMessage.textContent =
                    "Não foi possível criar a conta.";

                return;

            }


            /* =========================
               USAR CÓDIGO
            ========================= */

            const {
                data: conviteUsado,
                error: conviteError
            } =
                await supabaseClient.rpc(
                    "usar_codigo_convite",
                    {
                        codigo_informado: codigo,

                        usuario_id:
                            data.user.id
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


            /* =========================
               SUCESSO
            ========================= */

            registerMessage.textContent =
                `Conta criada com sucesso! @${username}`;


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

    }
);
