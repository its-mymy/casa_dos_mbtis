fetch("../menu/menu.html")
    .then(response => {
        console.log("Resposta do menu:", response);

        if (!response.ok) {
            throw new Error("Não foi possível carregar o menu.");
        }

        return response.text();
    })

    .then(data => {
        console.log("Menu carregado!");
        document.querySelector("#menu").innerHTML = data;
        const mobileNavbar = new MobileNavbar( ".mobile-menu", ".nav-list", ".nav-list li");
        mobileNavbar.init();
    })

    .catch(error => {
        console.error("ERRO:", error);
    });


class MobileNavbar {

    constructor(mobileMenu, navList, navLinks) {
        this.mobileMenu = document.querySelector(mobileMenu);
        this.navList = document.querySelector(navList);
        this.navLinks = document.querySelectorAll(navLinks);
        this.activeClass = "active";
        this.handleClick = this.handleClick.bind(this);
    }


    animateLinks() {
        this.navLinks.forEach((link) => {
            link.style.animation = "";
            link.style.animation = "navLinkFade 0.5s ease forwards 0.3s";
        });

    }


    handleClick() {
        this.navList.classList.toggle(this.activeClass);
        this.mobileMenu.classList.toggle(this.activeClass);
        this.animateLinks();

    }


    addClickEvent() {
        this.mobileMenu.addEventListener(
            "click",
            this.handleClick
        );

    }


    init() {

        if (this.mobileMenu) {
            this.addClickEvent();

        }

        return this;

    }

}