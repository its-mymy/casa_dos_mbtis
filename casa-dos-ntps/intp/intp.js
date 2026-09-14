function showTopic(topic, button) {
    document.querySelectorAll(".topic-content").forEach(section => {
        section.classList.remove("active");
    });

    document.querySelectorAll(".topic-button").forEach(btn => {
        btn.classList.remove("active");
    });

    const selected = document.getElementById(`topic-${topic}`);

    if (selected) {
        selected.classList.add("active");
        button.classList.add("active");
    }

    window.scrollTo({
        top: document.querySelector(".topic-menu").offsetTop - 20,
        behavior: "smooth"
    });
}