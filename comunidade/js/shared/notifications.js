const toast = document.getElementById("app-toast");
let timeoutId = null;

export function notify(message, duration = 3200) {
    if (!toast) return;

    toast.textContent = String(message || "");
    toast.classList.add("is-visible");

    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
        toast.classList.remove("is-visible");
    }, duration);
}