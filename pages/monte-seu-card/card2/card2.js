const fields = {
    nameInput: "cardName",
    usernameInput: ["cardUsername", "cardWatermarkUser"],
    mbtiInput: ["cardMbti", "cardMbtiMain"],
    enneagramInput: "cardEnneagram",
    tritypeInput: "cardTritype",
    subtypeInput: "cardSubtype",
    temperamentInput: "cardTemperament",
    socionicsInput: "cardSocionics",
    bigfiveInput: "cardBigFive",
    quoteInput: "cardQuote",
    aboutInput: "cardAbout",
    phraseInput: "cardPhrase"
};

Object.entries(fields).forEach(([inputId, targetId]) => {
    const input = document.getElementById(inputId);

    if (!input) {
        return;
    }

    function updateField() {
        const targets = Array.isArray(targetId)
            ? targetId
            : [targetId];

        targets.forEach(id => {
            const target = document.getElementById(id);

            if (target) {
                target.textContent = input.value;
            }
        });
    }

    input.addEventListener("input", updateField);
    input.addEventListener("change", updateField);

    updateField();
});

/* VIBE */

const vibeInput = document.getElementById("vibeInput");
const vibeValueInput = document.getElementById("vibeValueInput");
const vibeValueLabel = document.getElementById("vibeValueLabel");
const cardVibe = document.getElementById("cardVibe");
const cardVibeValue = document.getElementById("cardVibeValue");
const cardVibeBar = document.getElementById("cardVibeBar");

vibeInput.addEventListener("change", () => {
    cardVibe.textContent = vibeInput.value;
});

vibeValueInput.addEventListener("input", () => {
    const value = Number(vibeValueInput.value);

    vibeValueLabel.textContent = `${value}%`;
    cardVibeValue.textContent = `${value}%`;
    cardVibeBar.style.width = `${value}%`;
});

/* INTERESSES */

const interestInput = document.getElementById("interestInput");
const addInterestButton = document.getElementById("addInterestButton");
const editorInterests = document.getElementById("editorInterests");
const cardInterests = document.getElementById("cardInterests");

let interests = [];

function renderInterests() {
    editorInterests.innerHTML = "";
    cardInterests.innerHTML = "";

    interests.forEach((interest, index) => {
        const editorTag = document.createElement("div");
        editorTag.className = "editor-interest";

        const text = document.createElement("span");
        text.textContent = interest;

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.textContent = "×";
        removeButton.setAttribute(
            "aria-label",
            `Remover interesse ${interest}`
        );

        removeButton.addEventListener("click", () => {
            interests.splice(index, 1);
            renderInterests();
        });

        editorTag.appendChild(text);
        editorTag.appendChild(removeButton);
        editorInterests.appendChild(editorTag);

        const cardTag = document.createElement("span");
        cardTag.textContent = interest;
        cardInterests.appendChild(cardTag);
    });
}

function addInterest() {
    const value = interestInput.value.trim();

    if (!value) {
        return;
    }

    if (interests.length >= 5) {
        alert("Você pode adicionar até 5 interesses.");
        return;
    }

    interests.push(value);
    interestInput.value = "";

    renderInterests();
}

addInterestButton.addEventListener("click", addInterest);

interestInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        event.preventDefault();
        addInterest();
    }
});

renderInterests();

/* COR DO CARD */

const themeInput = document.getElementById("themeInput");

themeInput.addEventListener("input", () => {
    const color = themeInput.value;
    const rgb = hexToRgb(color);

    if (!rgb) {
        return;
    }

    const light = {
        r: Math.min(rgb.r + 70, 255),
        g: Math.min(rgb.g + 70, 255),
        b: Math.min(rgb.b + 70, 255)
    };

    const dark = {
        r: Math.round(rgb.r * 0.58),
        g: Math.round(rgb.g * 0.58),
        b: Math.round(rgb.b * 0.58)
    };

    const darker = {
        r: Math.round(rgb.r * 0.28),
        g: Math.round(rgb.g * 0.28),
        b: Math.round(rgb.b * 0.28)
    };

    document.documentElement.style.setProperty(
        "--accent",
        color
    );

    document.documentElement.style.setProperty(
        "--accent-light",
        `rgb(${light.r}, ${light.g}, ${light.b})`
    );

    document.documentElement.style.setProperty(
        "--accent-dark",
        `rgb(${dark.r}, ${dark.g}, ${dark.b})`
    );

    document.documentElement.style.setProperty(
        "--card-color",
        `rgb(${darker.r}, ${darker.g}, ${darker.b})`
    );

    document.documentElement.style.setProperty(
        "--card-color-dark",
        `rgb(
            ${Math.max(darker.r - 15, 0)},
            ${Math.max(darker.g - 15, 0)},
            ${Math.max(darker.b - 15, 0)}
        )`
    );
});

function hexToRgb(hex) {
    const value = hex.replace("#", "");

    if (value.length !== 6) {
        return null;
    }

    return {
        r: parseInt(value.substring(0, 2), 16),
        g: parseInt(value.substring(2, 4), 16),
        b: parseInt(value.substring(4, 6), 16)
    };
}

/* IMAGENS */

function loadImage(inputId, targetIds, pickerIds) {
    const input = document.getElementById(inputId);

    const targets = Array.isArray(targetIds)
        ? targetIds
        : [targetIds];

    const pickers = Array.isArray(pickerIds)
        ? pickerIds
        : [pickerIds];

    if (!input) {
        return;
    }

    input.addEventListener("change", event => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Escolha uma imagem válida.");
            input.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            const imageData = reader.result;

            targets.forEach(id => {
                const target = document.getElementById(id);

                if (target) {
                    target.src = imageData;
                }
            });
        };

        reader.onerror = () => {
            alert("Não foi possível carregar a imagem.");
        };

        reader.readAsDataURL(file);
    });

    pickers.forEach(pickerId => {
        const picker = document.getElementById(pickerId);

        if (!picker) {
            return;
        }

        picker.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();

            input.value = "";
            input.click();
        });
    });
}

loadImage(
    "avatarInput",
    ["cardAvatar", "cardAvatarCharacter"],
    [
        "avatarButton",
        "avatarPicker",
        "avatarCharacterPicker"
    ]
);

loadImage(
    "vibeCharacterInput",
    "cardVibeCharacter",
    [
        "vibeCharacterButton",
        "vibeCharacterPicker"
    ]
);

/* DOWNLOAD 9:16 / 1080x1920 */

const downloadButton = document.getElementById("downloadButton");

downloadButton.addEventListener("click", async () => {
    const card = document.getElementById("profileCard");

    downloadButton.disabled = true;
    downloadButton.textContent = "GERANDO CARD...";

    try {
        if (typeof html2canvas !== "function") {
            throw new Error(
                "html2canvas não foi carregado."
            );
        }

        await document.fonts.ready;

        await new Promise(resolve => {
            requestAnimationFrame(() => {
                requestAnimationFrame(resolve);
            });
        });

        const cardRect = card.getBoundingClientRect();

        if (
            !cardRect.width ||
            !cardRect.height
        ) {
            throw new Error(
                "Não foi possível identificar o tamanho do card."
            );
        }

        const exportWidth = 1080;
        const exportHeight = 1920;

        const scale = exportWidth / cardRect.width;

        const canvas = await html2canvas(card, {
            width: cardRect.width,
            height: cardRect.height,
            scale,
            backgroundColor: null,
            useCORS: true,
            allowTaint: false,
            imageTimeout: 30000,
            logging: false,
            scrollX: 0,
            scrollY: 0,
            windowWidth: document.documentElement.clientWidth,
            windowHeight: document.documentElement.clientHeight
        });

        if (
            !canvas ||
            canvas.width <= 0 ||
            canvas.height <= 0
        ) {
            throw new Error(
                "Canvas inválido."
            );
        }

        const finalCanvas = document.createElement("canvas");

        finalCanvas.width = exportWidth;
        finalCanvas.height = exportHeight;

        const context = finalCanvas.getContext("2d");

        if (!context) {
            throw new Error(
                "Não foi possível criar o canvas final."
            );
        }

        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";

        const canvasRatio =
            canvas.width / canvas.height;

        const targetRatio =
            exportWidth / exportHeight;

        let drawWidth = exportWidth;
        let drawHeight = exportWidth / canvasRatio;
        let offsetX = 0;
        let offsetY = (exportHeight - drawHeight) / 2;

        if (canvasRatio > targetRatio) {
            drawHeight = exportHeight;
            drawWidth = exportHeight * canvasRatio;
            offsetX = (exportWidth - drawWidth) / 2;
            offsetY = 0;
        }

        context.clearRect(
            0,
            0,
            exportWidth,
            exportHeight
        );

        context.drawImage(
            canvas,
            offsetX,
            offsetY,
            drawWidth,
            drawHeight
        );

        const blob = await new Promise(resolve => {
            finalCanvas.toBlob(
                resolve,
                "image/png",
                1
            );
        });

        if (!blob) {
            throw new Error(
                "Não foi possível gerar o PNG."
            );
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "card-casa-dos-mbtis-9x16.png";

        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 2000);
    } catch (error) {
        console.error(
            "Erro ao gerar o card:",
            error
        );

        alert(
            "Não foi possível gerar o card. Tente novamente."
        );
    } finally {
        downloadButton.disabled = false;
        downloadButton.textContent = "✦ SALVAR COMO IMAGEM";
    }
});