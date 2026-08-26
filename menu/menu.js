const SUPABASE_URL = "https://lhhoqahzpuohhhnbwgfp.supabase.co";
const SUPABASE_KEY = "sb_publishable_FTie2ELWKBc4Tz9r5fZuTw_izSaEHao";

const caminhoAtual =
    window.location.pathname.toLowerCase();

const dentroDePages =
    caminhoAtual.includes("/pages/");

let caminhoMenu = "menu/menu.html";
let caminhoRaiz = "";

if (dentroDePages) {
    const partes =
        window.location.pathname
            .split("/")
            .filter(Boolean);

    const indicePages =
        partes.findIndex(
            parte =>
                parte.toLowerCase() === "pages"
        );

    if (indicePages !== -1) {
        const pastasDepoisDePages =
            partes.length -
            indicePages -
            2;

        const niveis =
            pastasDepoisDePages + 1;

        caminhoRaiz =
            "../".repeat(niveis);

        caminhoMenu =
            caminhoRaiz +
            "menu/menu.html";
    }
}

function ajustarLinksDoMenu() {

    const menuLinks =
        document.querySelectorAll("#menu a");

    menuLinks.forEach(link => {

        const href =
            link.getAttribute("href");

        if (!href) {
            return;
        }

        /*
            Quando estamos dentro de /pages/,
            precisamos voltar para a raiz.
        */

        if (dentroDePages) {

            if (href === "index.html") {
                link.href =
                    caminhoRaiz +
                    "index.html";
            }

            else if (
                href.startsWith("pages/")
            ) {
                link.href =
                    caminhoRaiz +
                    href;
            }

            else if (
                href.startsWith("membros/")
            ) {
                link.href =
                    caminhoRaiz +
                    href;
            }

            else if (
                href.startsWith("perfil/")
            ) {
                link.href =
                    caminhoRaiz +
                    href;
            }

            else if (
                href.startsWith("login/")
            ) {
                link.href =
                    caminhoRaiz +
                    href;
            }
        }
    });
}

function carregarSupabase() {

    return new Promise(
        (resolve, reject) => {

            if (
                window.supabase &&
                typeof window.supabase.createClient ===
                    "function"
            ) {
                resolve();
                return;
            }

            const script =
                document.createElement("script");

            script.src =
                "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

            script.onload =
                () => resolve();

            script.onerror =
                () =>
                    reject(
                        new Error(
                            "Não foi possível carregar o Supabase."
                        )
                    );

            document.head.appendChild(
                script
            );
        }
    );
}

async function configurarMenuUsuario() {

    const menuProfile =
        document.getElementById(
            "menu-profile"
        );

    const menuLogin =
        document.getElementById(
            "menu-login"
        );

    const menuLogout =
        document.getElementById(
            "menu-logout"
        );

    const logoutLink =
        document.getElementById(
            "logout-link"
        );

    /*
        IMPORTANTE:
        Use exatamente as mesmas credenciais
        do seu login.js/perfil.js.
    */

    const supabaseUrl =
        typeof SUPABASE_URL !== "undefined"
            ? SUPABASE_URL
            : "SUA_URL_DO_PROJETO";

    const supabaseKey =
        typeof SUPABASE_KEY !== "undefined"
            ? SUPABASE_KEY
            : "SUA_SB_PUBLISHABLE_KEY";

    if (
        supabaseUrl === "SUA_URL_DO_PROJETO" ||
        supabaseKey === "SUA_SB_PUBLISHABLE_KEY"
    ) {
        console.warn(
            "Configure SUPABASE_URL e SUPABASE_KEY no menu.js."
        );

        return;
    }

    const supabaseClient =
        window.supabase.createClient(
            supabaseUrl,
            supabaseKey
        );

    const {
        data: {
            user
        }
    } =
        await supabaseClient.auth.getUser();

    if (user) {

        /*
            LOGADO
        */

        if (menuProfile) {
            menuProfile.style.display =
                "";
        }

        if (menuLogin) {
            menuLogin.style.display =
                "none";
        }

        if (menuLogout) {
            menuLogout.style.display =
                "";
        }

    } else {

        /*
            NÃO LOGADO
        */

        if (menuProfile) {
            menuProfile.style.display =
                "none";
        }

        if (menuLogin) {
            menuLogin.style.display =
                "";
        }

        if (menuLogout) {
            menuLogout.style.display =
                "none";
        }
    }

    if (logoutLink) {

        logoutLink.addEventListener(
            "click",
            async function (event) {

                event.preventDefault();

                const {
                    error
                } =
                    await supabaseClient.auth.signOut();

                if (error) {
                    console.error(
                        "Erro ao sair:",
                        error
                    );

                    return;
                }

                window.location.reload();
            }
        );
    }
}

fetch(caminhoMenu)
    .then(response => {

        console.log(
            "Resposta do menu:",
            response
        );

        if (!response.ok) {

            throw new Error(
                "Não foi possível carregar o menu."
            );
        }

        return response.text();
    })
    .then(async data => {

        document.querySelector(
            "#menu"
        ).innerHTML = data;

        /*
            Corrige os caminhos.
        */

        ajustarLinksDoMenu();

        /*
            Primeiro cria o MobileNavbar.
        */

        const mobileNavbar =
            new MobileNavbar(
                ".mobile-menu",
                ".nav-list",
                ".nav-list li"
            );

        mobileNavbar.init();

        /*
            Depois configura login/logout.
        */

        try {

            await carregarSupabase();

            await configurarMenuUsuario();

        } catch (error) {

            console.error(
                "Erro ao configurar usuário:",
                error
            );
        }
    })
    .catch(error => {

        console.error(
            "ERRO:",
            error
        );
    });


class MobileNavbar {

    constructor(
        mobileMenu,
        navList,
        navLinks
    ) {

        this.mobileMenu =
            document.querySelector(
                mobileMenu
            );

        this.navList =
            document.querySelector(
                navList
            );

        this.navLinks =
            document.querySelectorAll(
                navLinks
            );

        this.activeClass =
            "active";

        this.handleClick =
            this.handleClick.bind(
                this
            );

        this.closeMenu =
            this.closeMenu.bind(
                this
            );
    }

    animateLinks() {

        this.navLinks.forEach(
            link => {

                link.style.animation =
                    "";

                if (
                    this.navList.classList.contains(
                        this.activeClass
                    )
                ) {

                    link.style.animation =
                        "navLinkFade 0.45s ease forwards";
                }
            }
        );
    }

    handleClick() {

        this.navList.classList.toggle(
            this.activeClass
        );

        this.mobileMenu.classList.toggle(
            this.activeClass
        );

        this.animateLinks();
    }

    closeMenu() {

        this.navList.classList.remove(
            this.activeClass
        );

        this.mobileMenu.classList.remove(
            this.activeClass
        );
    }

    addClickEvent() {

        this.mobileMenu.addEventListener(
            "click",
            this.handleClick
        );

        this.navLinks.forEach(
            link => {

                link.addEventListener(
                    "click",
                    this.closeMenu
                );
            }
        );
    }

    init() {

        if (
            !this.mobileMenu ||
            !this.navList
        ) {
            return this;
        }

        this.addClickEvent();

        return this;
    }
}