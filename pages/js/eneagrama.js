document.addEventListener("DOMContentLoaded", () => {

    // CARREGA O MENU
    fetch("../../menu/menu.html")
        .then(response => {
            if (!response.ok) {
                throw new Error("Não foi possível carregar o menu.");
            }

            return response.text();
        })
        .then(data => {

            const menu = document.getElementById("menu");

            if (menu) {
                menu.innerHTML = data;
            }

        })
        .catch(error => {
            console.error("Erro ao carregar o menu:", error);
        });


    // INTERAÇÃO DOS CARDS DOS 9 TIPOS
    const cards = document.querySelectorAll(".type-card");

    cards.forEach(card => {

        card.addEventListener("touchstart", () => {

            cards.forEach(otherCard => {
                otherCard.classList.remove("active");
            });

            card.classList.add("active");

        }, { passive: true });

    });

});