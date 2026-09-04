
const SUPABASE_URL = "https://lhhoqahzpuohhhnbwgfp.supabase.co";
const SUPABASE_KEY = "sb_publishable_FTie2ELWKBc4Tz9r5fZuTw_izSaEHao";

/* ==============================
   CAMINHOS
============================== */

const scriptAtual = document.currentScript;
const urlMenuJS = scriptAtual ? new URL(scriptAtual.src) : new URL("/menu/menu.js", window.location.origin);
const urlMenuHTML = new URL("menu.html", urlMenuJS);

const caminhoAtual = window.location.pathname.toLowerCase();
const dentroDePages = caminhoAtual.includes("/pages/");

/*
   Raiz do site.
   O menu.js está em /menu/, então ../ volta para a raiz.
*/
const urlRaiz = new URL("../", urlMenuJS);
const caminhoRaiz = urlRaiz.href;

/* ==============================
   AJUSTAR LINKS
============================== */

function ajustarLinksDoMenu() {

    const menuLinks = document.querySelectorAll("#menu a");

    menuLinks.forEach(link => {

        const href = link.getAttribute("href");

        if (!href || href === "#") {
            return;
        }

        /*
           Links internos do site.
           Convertemos para URLs absolutas baseadas
           na raiz real do site, evitando problemas
           com a profundidade da página.
        */

        if (
            href === "index.html" ||
            href.startsWith("pages/") ||
            href.startsWith("membros/") ||
            href.startsWith("perfil/") ||
            href.startsWith("login/")
        ) {
            link.href = new URL(href, caminhoRaiz).href;
        }

        /*
           Links que já possuem ../ continuam relativos
           à estrutura definida no menu.html.
        */

    });
}

/* ==============================
   SUPABASE
============================== */

function carregarSupabase() {

    return new Promise((resolve, reject) => {

        if (
            window.supabase &&
            typeof window.supabase.createClient === "function"
        ) {
            resolve();
            return;
        }

        const script = document.createElement("script");

        script.src =
            "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

        script.onload = () => resolve();

        script.onerror = () => {
            reject(
                new Error(
                    "Não foi possível carregar o Supabase."
                )
            );
        };

        document.head.appendChild(script);
    });
}

/* ==============================
   LOGIN / LOGOUT
============================== */

async function configurarMenuUsuario() {

    const menuProfile =
        document.getElementById("menu-profile");

    const menuLogin =
        document.getElementById("menu-login");

    const menuLogout =
        document.getElementById("menu-logout");

    const logoutLink =
        document.getElementById("logout-link");

    const supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY,
            {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true,
                    storage: window.localStorage
                }
            }
        );

    const {
        data: { user }
    } = await supabaseClient.auth.getUser();

    if (user) {

        if (menuProfile) {
            menuProfile.style.display = "";
        }

        if (menuLogin) {
            menuLogin.style.display = "none";
        }

        if (menuLogout) {
            menuLogout.style.display = "";
        }

    } else {

        if (menuProfile) {
            menuProfile.style.display = "none";
        }

        if (menuLogin) {
            menuLogin.style.display = "";
        }

        if (menuLogout) {
            menuLogout.style.display = "none";
        }
    }

    if (logoutLink) {

        logoutLink.addEventListener(
            "click",
            async function (event) {

                event.preventDefault();

                const { error } =
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

/* ==============================
   CARREGAR MENU
============================== */

fetch(urlMenuHTML.href)
    .then(response => {

        console.log(
            "Menu carregado:",
            urlMenuHTML.href,
            response
        );

        if (!response.ok) {

            throw new Error(
                `Não foi possível carregar o menu. HTTP ${response.status}`
            );
        }

        return response.text();
    })
    .then(async data => {

        const container =
            document.querySelector("#menu");

        if (!container) {

            throw new Error(
                "Elemento #menu não encontrado."
            );
        }

        container.innerHTML = data;

        ajustarLinksDoMenu();

        const mobileNavbar =
            new MobileNavbar(
                ".mobile-menu",
                ".nav-list",
                ".nav-list li"
            );

        mobileNavbar.init();

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
            "ERRO AO CARREGAR MENU:",
            error
        );
    });

/* ==============================
   MOBILE NAVBAR
============================== */

class MobileNavbar {

    constructor(
        mobileMenu,
        navList,
        navLinks
    ) {

        this.mobileMenu =
            document.querySelector(mobileMenu);

        this.navList =
            document.querySelector(navList);

        this.navLinks =
            document.querySelectorAll(navLinks);

        this.activeClass = "active";

        this.handleClick =
            this.handleClick.bind(this);

        this.closeMenu =
            this.closeMenu.bind(this);
    }

    animateLinks() {

        this.navLinks.forEach(link => {

            link.style.animation = "";

            if (
                this.navList.classList.contains(
                    this.activeClass
                )
            ) {

                link.style.animation =
                    "navLinkFade 0.45s ease forwards";
            }
        });
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

        this.navLinks.forEach(link => {

            link.addEventListener(
                "click",
                this.closeMenu
            );
        });
    }

    init() {

        if (
            !this.mobileMenu ||
            !this.navList
        ) {
            console.warn(
                "Elementos do menu mobile não encontrados."
            );

            return this;
        }

        this.addClickEvent();

        return this;
    }
}
