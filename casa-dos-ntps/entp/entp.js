
document.addEventListener("DOMContentLoaded", () => {

    const buttons = document.querySelectorAll(".topic-button");
    const sections = document.querySelectorAll(".topic-content");

    window.showTopic = function(topic, button) {

        sections.forEach(section => {
            section.classList.remove("active");
        });

        buttons.forEach(btn => {
            btn.classList.remove("active");
        });

        const selected = document.getElementById("topic-" + topic);

        if (!selected) {
            console.warn("Tópico não encontrado:", topic);
            return;
        }

        selected.classList.add("active");

        if (button) {
            button.classList.add("active");
        } else {
            const matchingButton = document.querySelector(
                `.topic-button[onclick*="'${topic}'"]`
            );

            if (matchingButton) {
                matchingButton.classList.add("active");
            }
        }

        const menu = document.querySelector(".topic-menu");

        if (menu) {
            window.scrollTo({
                top: menu.offsetTop - 20,
                behavior: "smooth"
            });
        }

        const url = new URL(window.location.href);

        if (topic === "inicio") {
            url.searchParams.delete("topic");
        } else {
            url.searchParams.set("topic", topic);
        }

        window.history.replaceState({}, "", url);
    };


    /* ABRIR TÓPICO PELO LINK */

    const params = new URLSearchParams(window.location.search);
    const topicFromUrl = params.get("topic");

    if (
        topicFromUrl &&
        document.getElementById("topic-" + topicFromUrl)
    ) {
        showTopic(topicFromUrl);
    } else {
        const firstButton = document.querySelector(".topic-button");
        const firstSection = document.querySelector(".topic-content");

        if (firstSection) {
            firstSection.classList.add("active");
        }

        if (firstButton) {
            firstButton.classList.add("active");
        }
    }

});