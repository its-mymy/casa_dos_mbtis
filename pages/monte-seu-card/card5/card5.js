const canvas = document.getElementById("cardCanvas");
const ctx = canvas.getContext("2d");

const nickInput = document.getElementById("nick");
const overlayColor = document.getElementById("overlayColor");
const overlayOpacity = document.getElementById("overlayOpacity");
const opacityValue = document.getElementById("opacityValue");
const downloadBtn = document.getElementById("downloadBtn");

const cardData = {
    nick: "",
    overlay: {
        color: "#8b5cf6",
        opacity: 25
    },
    images: {
        mbti: null,
        eneagrama: null,
        tritype: null,
        subtipos: null,
        personagem: null,
        bigfive: null,
        temperamento: null,
        psychosophy: null,
        extra: null
    }
};

const labels = {
    mbti: "MBTI",
    eneagrama: "ENEAGRAMA",
    tritype: "TRITYPE",
    subtipos: "SUBTIPOS",
    personagem: "PERSONAGEM",
    bigfive: "BIG FIVE",
    temperamento: "TEMPERAMENTO",
    psychosophy: "PSYCHOSOPHY",
    extra: "EXTRA"
};

const positions = {
    mbti: [0, 0],
    eneagrama: [1, 0],
    tritype: [2, 0],

    subtipos: [0, 1],
    personagem: [1, 1],
    bigfive: [2, 1],

    temperamento: [0, 2],
    psychosophy: [1, 2],
    extra: [2, 2]
};

const CELL_SIZE = canvas.width / 3;

function hexToRgba(hex, opacity) {
    const clean = hex.replace("#", "");

    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function drawCoverImage(img, x, y, width, height) {
    const imageRatio = img.width / img.height;
    const cellRatio = width / height;

    let sx = 0;
    let sy = 0;
    let sw = img.width;
    let sh = img.height;

    if (imageRatio > cellRatio) {
        sw = img.height * cellRatio;
        sx = (img.width - sw) / 2;
    } else {
        sh = img.width / cellRatio;
        sy = (img.height - sh) / 2;
    }

    ctx.drawImage(
        img,
        sx,
        sy,
        sw,
        sh,
        x,
        y,
        width,
        height
    );
}

function drawPlaceholder(x, y, width, height, label) {
    ctx.fillStyle = "#17171f";
    ctx.fillRect(x, y, width, height);

    ctx.fillStyle = "#666";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        label,
        x + width / 2,
        y + height / 2
    );
}

function drawCard() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /*
        Fundo
    */

    ctx.fillStyle = "#101014";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    /*
        Imagens dos quadrados
    */

    Object.keys(positions).forEach(slot => {

        const [column, row] = positions[slot];

        const x = column * CELL_SIZE;
        const y = row * CELL_SIZE;

        const image = cardData.images[slot];

        if (image) {
            drawCoverImage(
                image,
                x,
                y,
                CELL_SIZE,
                CELL_SIZE
            );
        } else {
            drawPlaceholder(
                x,
                y,
                CELL_SIZE,
                CELL_SIZE,
                labels[slot]
            );
        }
    });

    /*
        Overlay
    */

    ctx.fillStyle = hexToRgba(
        cardData.overlay.color,
        cardData.overlay.opacity / 100
    );

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    /*
        Linhas da grade
    */

    ctx.strokeStyle = "rgba(255,255,255,0.75)";
    ctx.lineWidth = 5;

    for (let i = 1; i < 3; i++) {

        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(canvas.width, i * CELL_SIZE);
        ctx.stroke();
    }

  /*
    Nick
*/

const nick = cardData.nick.trim();

if (nick) {

    ctx.save();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "bold 48px Arial";

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const nickWidth = ctx.measureText(nick).width;

    // Fundo atrás do nick
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.fillRect(
        centerX - nickWidth / 2 - 25,
        centerY - 32,
        nickWidth + 50,
        64
    );

    // Nick
    ctx.fillStyle = "#fff";

    ctx.fillText(
        nick,
        centerX,
        centerY
    );

    ctx.restore();
}

    /*
        Marca d'água
    */

    ctx.save();

    ctx.globalAlpha = 0.65;
    ctx.font = "bold 22px Arial";
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = "#fff";

    ctx.fillText(
        "casa dos mbtis",
        canvas.width - 22,
        canvas.height - 18
    );

    ctx.restore();
}

/*
    Upload das imagens
*/

document.querySelectorAll(
    '.upload-box input[type="file"]'
).forEach(input => {

    input.addEventListener("change", event => {

        const file = event.target.files[0];

        if (!file) return;

        const slot = input.dataset.slot;

        const reader = new FileReader();

        reader.onload = e => {

            const img = new Image();

            img.onload = () => {

                cardData.images[slot] = img;

                const preview = document.getElementById(
                    `preview-${slot}`
                );

                preview.innerHTML = "";

                const previewImage =
                    document.createElement("img");

                previewImage.src = e.target.result;

                preview.appendChild(previewImage);

                drawCard();
            };

            img.src = e.target.result;
        };

        reader.readAsDataURL(file);
    });
});

/*
    Nick
*/

nickInput.addEventListener("input", event => {

    cardData.nick = event.target.value;

    drawCard();
});

/*
    Cor do overlay
*/

overlayColor.addEventListener("input", event => {

    cardData.overlay.color = event.target.value;

    drawCard();
});

/*
    Opacidade
*/

overlayOpacity.addEventListener("input", event => {

    cardData.overlay.opacity =
        Number(event.target.value);

    opacityValue.textContent =
        `${cardData.overlay.opacity}%`;

    drawCard();
});

/*
    Salvar PNG
*/

downloadBtn.addEventListener("click", () => {

    const link = document.createElement("a");

    const safeNick =
        cardData.nick.trim().replace(/[^a-zA-Z0-9_-]/g, "");

    link.download =
        safeNick
            ? `card4-${safeNick}.png`
            : "card4-casa-dos-mbtis.png";

    link.href = canvas.toDataURL("image/png");

    link.click();
});

/*
    Desenho inicial
*/

drawCard();