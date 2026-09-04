
const FRAMES = {
  kuromi: [
    "png/kuromi.png"
  ],

  cinnamoroll: [
    "png/cinnamorol.png",
    "png/cinnamrol.png"
  ],

  pompompurin: [
    "png/punpompurim.png",
    "png/pompompurin.png"
  ],

  piupiu: [
    "png/piupiu.png"
  ],

  hellokitty: [
    "png/hellokitty.png",
    "png/hello-kitty.png"
  ],

  mymelody: [
    "png/mymelody.png",
    "png/my-melody.png"
  ],

  coelho: [
    "png/coelho.png"
  ],

  coelho: [
    "png/coelho-azul.png"
  ]
};

const FRAME_NAMES = {
  kuromi: "Kuromi",
  cinnamoroll: "Cinnamoroll",
  pompompurin: "Pompompurin",
  piupiu: "Piu Piu",
  hellokitty: "Hello Kitty",
  mymelody: "My Melody",
  pochacco: "Pochacco",
  keroppi: "Keroppi"
};

const DEFAULT_CONFIG = {
  frame: "kuromi",
  background: "#F8E6EF",
  cardColor: "#FFFFFF",
  textColor: "#3B3038",
  nickColor: "#E99BB9",
  overlayColor: "#000000",
  overlayOpacity: 25,
  photo: ""
};

const config = {
  ...DEFAULT_CONFIG
};

const elements = {
  card: document.getElementById("memberCard"),
  frameImage: document.getElementById("frameImage"),
  contentArea: document.getElementById("contentArea"),
  photoBackground: document.getElementById("photoBackground"),
  userPhoto: document.getElementById("userPhoto"),
  photoOverlay: document.getElementById("photoOverlay"),

  frameOptions: document.getElementById("frameOptions"),

  photoInput: document.getElementById("photoInput"),
  removePhotoBtn: document.getElementById("removePhotoBtn"),
  downloadBtn: document.getElementById("downloadBtn"),

  backgroundColor: document.getElementById("backgroundColor"),
  cardColor: document.getElementById("cardColor"),
  textColor: document.getElementById("textColor"),
  nickColor: document.getElementById("nickColor"),
  overlayColor: document.getElementById("overlayColor"),
  overlayOpacity: document.getElementById("overlayOpacity"),

  backgroundColorValue: document.getElementById("backgroundColorValue"),
  cardColorValue: document.getElementById("cardColorValue"),
  textColorValue: document.getElementById("textColorValue"),
  nickColorValue: document.getElementById("nickColorValue"),
  overlayColorValue: document.getElementById("overlayColorValue"),
  overlayOpacityValue: document.getElementById("overlayOpacityValue"),

  nameInput: document.getElementById("nameInput"),
  usernameInput: document.getElementById("usernameInput"),
  mbtiInput: document.getElementById("mbtiInput"),
  eneagramaInput: document.getElementById("eneagramaInput"),
  tritypeInput: document.getElementById("tritypeInput"),
  subtipoInput: document.getElementById("subtipoInput"),

  memberName: document.getElementById("memberName"),
  memberUsername: document.getElementById("memberUsername"),
  memberMbti: document.getElementById("memberMbti"),
  memberEneagrama: document.getElementById("memberEneagrama"),
  memberTritype: document.getElementById("memberTritype"),
  memberSubtipo: document.getElementById("memberSubtipo")
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");

  const value = clean.length === 3
    ? clean.split("").map(char => char + char).join("")
    : clean;

  return {
    r: parseInt(value.substring(0, 2), 16),
    g: parseInt(value.substring(2, 4), 16),
    b: parseInt(value.substring(4, 6), 16)
  };
}

function hexToRgba(hex, opacity) {
  const rgb = hexToRgb(hex);

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Não foi possível carregar: ${src}`));

    image.src = src;
  });
}

async function resolveFramePath(frameName) {
  const paths = FRAMES[frameName] || [];

  for (const path of paths) {
    try {
      await loadImage(path);
      return path;
    } catch (error) {
      // Tenta o próximo nome.
    }
  }

  return null;
}


/*
|--------------------------------------------------------------------------
| DETECÇÃO AUTOMÁTICA DO BURACO
|--------------------------------------------------------------------------
*/

async function detectTransparentHole(image) {
  const canvas = document.createElement("canvas");

  const ctx = canvas.getContext("2d", {
    willReadFrequently: true
  });

  const MAX_SIZE = 280;

  const originalWidth = image.naturalWidth || image.width;
  const originalHeight = image.naturalHeight || image.height;

  const scale = Math.min(
    1,
    MAX_SIZE / Math.max(originalWidth, originalHeight)
  );

  const width = Math.max(1, Math.round(originalWidth * scale));
  const height = Math.max(1, Math.round(originalHeight * scale));

  canvas.width = width;
  canvas.height = height;

  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);

  const pixels = ctx.getImageData(
    0,
    0,
    width,
    height
  ).data;

  const ALPHA_THRESHOLD = 18;
  const total = width * height;

  const transparent = new Uint8Array(total);

  for (let i = 0; i < total; i++) {
    const alpha = pixels[i * 4 + 3];

    if (alpha <= ALPHA_THRESHOLD) {
      transparent[i] = 1;
    }
  }


  /*
  |--------------------------------------------------------------------------
  | SEPARAR TRANSPARÊNCIA EXTERNA
  |--------------------------------------------------------------------------
  */

  const exterior = new Uint8Array(total);
  const queue = new Int32Array(total);

  let head = 0;
  let tail = 0;

  function addExterior(x, y) {
    if (x < 0 || y < 0 || x >= width || y >= height) {
      return;
    }

    const index = y * width + x;

    if (!transparent[index] || exterior[index]) {
      return;
    }

    exterior[index] = 1;
    queue[tail++] = index;
  }

  for (let x = 0; x < width; x++) {
    addExterior(x, 0);
    addExterior(x, height - 1);
  }

  for (let y = 0; y < height; y++) {
    addExterior(0, y);
    addExterior(width - 1, y);
  }

  while (head < tail) {
    const index = queue[head++];

    const x = index % width;
    const y = Math.floor(index / width);

    addExterior(x + 1, y);
    addExterior(x - 1, y);
    addExterior(x, y + 1);
    addExterior(x, y - 1);
  }


  /*
  |--------------------------------------------------------------------------
  | ENCONTRAR O MAIOR BURACO INTERNO
  |--------------------------------------------------------------------------
  */

  const visited = new Uint8Array(total);
  let bestRegion = null;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {

      const start = y * width + x;

      if (
        !transparent[start] ||
        exterior[start] ||
        visited[start]
      ) {
        continue;
      }

      const regionQueue = new Int32Array(total);

      let regionHead = 0;
      let regionTail = 0;

      regionQueue[regionTail++] = start;
      visited[start] = 1;

      let area = 0;

      let minX = x;
      let maxX = x;
      let minY = y;
      let maxY = y;

      while (regionHead < regionTail) {

        const index = regionQueue[regionHead++];

        const px = index % width;
        const py = Math.floor(index / width);

        area++;

        minX = Math.min(minX, px);
        maxX = Math.max(maxX, px);
        minY = Math.min(minY, py);
        maxY = Math.max(maxY, py);

        const neighbors = [
          index - 1,
          index + 1,
          index - width,
          index + width
        ];

        for (const next of neighbors) {

          if (
            next < 0 ||
            next >= total ||
            visited[next] ||
            !transparent[next] ||
            exterior[next]
          ) {
            continue;
          }

          const nx = next % width;
          const ny = Math.floor(next / width);

          if (
            Math.abs(nx - px) + Math.abs(ny - py) !== 1
          ) {
            continue;
          }

          visited[next] = 1;
          regionQueue[regionTail++] = next;
        }
      }

      const regionWidth = maxX - minX + 1;
      const regionHeight = maxY - minY + 1;

      if (
        regionWidth < width * .12 ||
        regionHeight < height * .12
      ) {
        continue;
      }

      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;

      const imageCenterX = width / 2;
      const imageCenterY = height / 2;

      const distance = Math.sqrt(
        Math.pow(centerX - imageCenterX, 2) +
        Math.pow(centerY - imageCenterY, 2)
      );

      const centrality = 1 - clamp(
        distance / Math.max(width, height),
        0,
        1
      );

      const score = area * (1 + centrality * 2);

      if (!bestRegion || score > bestRegion.score) {
        bestRegion = {
          minX,
          maxX,
          minY,
          maxY,
          width: regionWidth,
          height: regionHeight,
          area,
          score
        };
      }
    }
  }


  /*
  |--------------------------------------------------------------------------
  | FALLBACK
  |--------------------------------------------------------------------------
  */

  if (!bestRegion) {
    return {
      left: 16,
      top: 16,
      width: 68,
      height: 68
    };
  }


  return {
    left: (bestRegion.minX / width) * 100,
    top: (bestRegion.minY / height) * 100,
    width: (bestRegion.width / width) * 100,
    height: (bestRegion.height / height) * 100
  };
}


/*
|--------------------------------------------------------------------------
| APLICAR O BURACO
|--------------------------------------------------------------------------
*/

async function positionContentFromFrame(image) {

  const hole = await detectTransparentHole(image);

  const {
    left,
    top,
    width,
    height
  } = hole;

  elements.contentArea.style.left = `${left}%`;
  elements.contentArea.style.top = `${top}%`;
  elements.contentArea.style.width = `${width}%`;
  elements.contentArea.style.height = `${height}%`;

  elements.userPhoto.style.left = `${left}%`;
  elements.userPhoto.style.top = `${top}%`;
  elements.userPhoto.style.width = `${width}%`;
  elements.userPhoto.style.height = `${height}%`;

  elements.photoOverlay.style.left = `${left}%`;
  elements.photoOverlay.style.top = `${top}%`;
  elements.photoOverlay.style.width = `${width}%`;
  elements.photoOverlay.style.height = `${height}%`;

  requestAnimationFrame(updateContentScale);
}


/*
|--------------------------------------------------------------------------
| ESCALA
|--------------------------------------------------------------------------
*/

function updateContentScale() {

  const rect =
    elements.contentArea.getBoundingClientRect();

  if (!rect.width || !rect.height) {
    return;
  }

  const fit = Math.max(
    1,
    Math.min(rect.width, rect.height)
  );

  elements.contentArea.style.setProperty(
    "--fit",
    `${fit}px`
  );
}


/*
|--------------------------------------------------------------------------
| MOLDURAS
|--------------------------------------------------------------------------
*/

async function createFrameOptions() {

  elements.frameOptions.innerHTML = "";

  for (const frameName of Object.keys(FRAMES)) {

    const path =
      await resolveFramePath(frameName);

    if (!path) {
      console.warn(
        `Moldura não encontrada: ${frameName}`
      );

      continue;
    }

    const button =
      document.createElement("button");

    button.type = "button";
    button.className = "frame-option";

    if (frameName === config.frame) {
      button.classList.add("active");
    }

    button.dataset.frame = frameName;

    const image =
      document.createElement("img");

    image.src = path;
    image.alt =
      FRAME_NAMES[frameName] || frameName;

    button.appendChild(image);

    button.addEventListener(
      "click",
      () => selectFrame(frameName)
    );

    elements.frameOptions.appendChild(button);
  }
}

async function selectFrame(frameName) {

  const path =
    await resolveFramePath(frameName);

  if (!path) {
    console.error(
      `Não foi possível encontrar a moldura ${frameName}.`
    );

    return;
  }

  config.frame = frameName;

  elements.frameImage.src = path;

  document
    .querySelectorAll(".frame-option")
    .forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.frame === frameName
      );
    });

  try {

    const image =
      await loadImage(path);

    await positionContentFromFrame(image);

  } catch (error) {

    console.error(
      "Erro ao analisar a moldura:",
      error
    );
  }
}


/*
|--------------------------------------------------------------------------
| FOTO
|--------------------------------------------------------------------------
*/

elements.photoInput.addEventListener(
  "change",
  event => {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Escolha uma imagem válida.");
      return;
    }

    const reader =
      new FileReader();

    reader.onload = event => {

      config.photo =
        event.target.result;

      elements.userPhoto.src =
        config.photo;

      elements.userPhoto.style.display =
        "block";

      elements.photoOverlay.style.display =
        "block";
    };

    reader.readAsDataURL(file);
  }
);

elements.removePhotoBtn.addEventListener(
  "click",
  () => {

    config.photo = "";

    elements.photoInput.value = "";

    elements.userPhoto.removeAttribute(
      "src"
    );

    elements.userPhoto.style.display =
      "none";

    elements.photoOverlay.style.display =
      "none";
  }
);


/*
|--------------------------------------------------------------------------
| CORES
|--------------------------------------------------------------------------
*/

function bindColorInput(
  input,
  valueElement,
  configKey,
  cssVariable
) {

  input.addEventListener(
    "input",
    () => {

      config[configKey] =
        input.value;

      valueElement.textContent =
        input.value.toUpperCase();

      elements.card.style.setProperty(
        cssVariable,
        input.value
      );

      if (configKey === "overlayColor") {
        updateOverlay();
      }
    }
  );
}

bindColorInput(
  elements.backgroundColor,
  elements.backgroundColorValue,
  "background",
  "--background-color"
);

bindColorInput(
  elements.cardColor,
  elements.cardColorValue,
  "cardColor",
  "--card-bg"
);

bindColorInput(
  elements.textColor,
  elements.textColorValue,
  "textColor",
  "--text-color"
);

bindColorInput(
  elements.nickColor,
  elements.nickColorValue,
  "nickColor",
  "--nick-color"
);

bindColorInput(
  elements.overlayColor,
  elements.overlayColorValue,
  "overlayColor",
  "--overlay-color"
);


/*
|--------------------------------------------------------------------------
| OVERLAY
|--------------------------------------------------------------------------
*/

function updateOverlay() {

  config.overlayOpacity =
    Number(
      elements.overlayOpacity.value
    );

  elements.overlayOpacityValue.textContent =
    `${config.overlayOpacity}%`;

  elements.photoOverlay.style.background =
    hexToRgba(
      config.overlayColor,
      config.overlayOpacity / 100
    );
}

elements.overlayOpacity.addEventListener(
  "input",
  updateOverlay
);


/*
|--------------------------------------------------------------------------
| CAMPOS
|--------------------------------------------------------------------------
*/

function bindTextInput(
  input,
  output
) {

  input.addEventListener(
    "input",
    () => {

      output.textContent =
        input.value || " ";
    }
  );
}

bindTextInput(
  elements.nameInput,
  elements.memberName
);

bindTextInput(
  elements.usernameInput,
  elements.memberUsername
);

bindTextInput(
  elements.mbtiInput,
  elements.memberMbti
);

bindTextInput(
  elements.eneagramaInput,
  elements.memberEneagrama
);

bindTextInput(
  elements.tritypeInput,
  elements.memberTritype
);

bindTextInput(
  elements.subtipoInput,
  elements.memberSubtipo
);


/*
|--------------------------------------------------------------------------
| DOWNLOAD
|--------------------------------------------------------------------------
*/

async function downloadCard() {

  if (typeof html2canvas === "undefined") {

    alert(
      "A biblioteca de geração do PNG ainda não foi carregada."
    );

    return;
  }

  const originalText =
    elements.downloadBtn.textContent;

  elements.downloadBtn.disabled = true;
  elements.downloadBtn.textContent =
    "Gerando PNG...";

  try {

    if (elements.frameImage.complete === false) {
      await new Promise(resolve => {
        elements.frameImage.onload =
          resolve;
      });
    }

    if (
      elements.userPhoto.src &&
      elements.userPhoto.complete === false
    ) {
      await new Promise(resolve => {
        elements.userPhoto.onload =
          resolve;
      });
    }

    const canvas =
      await html2canvas(
        elements.card,
        {
          width: 490,
          height: 490,
          scale: 3,
          useCORS: true,
          allowTaint: false,
          backgroundColor: null,
          imageTimeout: 15000,
          logging: false
        }
      );

    const link =
      document.createElement("a");

    link.download =
      "card-casa-dos-mbtis.png";

    link.href =
      canvas.toDataURL(
        "image/png",
        1
      );

    link.click();

  } catch (error) {

    console.error(
      "Erro ao gerar o card:",
      error
    );

    alert(
      "Não foi possível gerar o PNG."
    );

  } finally {

    elements.downloadBtn.disabled =
      false;

    elements.downloadBtn.textContent =
      originalText;
  }
}

elements.downloadBtn.addEventListener(
  "click",
  downloadCard
);


/*
|--------------------------------------------------------------------------
| INICIALIZAÇÃO
|--------------------------------------------------------------------------
*/

async function initialize() {

  elements.card.style.setProperty(
    "--background-color",
    config.background
  );

  elements.card.style.setProperty(
    "--card-bg",
    config.cardColor
  );

  elements.card.style.setProperty(
    "--text-color",
    config.textColor
  );

  elements.card.style.setProperty(
    "--nick-color",
    config.nickColor
  );

  elements.backgroundColor.value =
    config.background;

  elements.cardColor.value =
    config.cardColor;

  elements.textColor.value =
    config.textColor;

  elements.nickColor.value =
    config.nickColor;

  elements.overlayColor.value =
    config.overlayColor;

  elements.overlayOpacity.value =
    config.overlayOpacity;

  elements.backgroundColorValue.textContent =
    config.background;

  elements.cardColorValue.textContent =
    config.cardColor;

  elements.textColorValue.textContent =
    config.textColor;

  elements.nickColorValue.textContent =
    config.nickColor;

  elements.overlayColorValue.textContent =
    config.overlayColor;

  elements.overlayOpacityValue.textContent =
    `${config.overlayOpacity}%`;

  updateOverlay();

  await createFrameOptions();

  await selectFrame(config.frame);

  updateContentScale();
}

initialize();


/*
|--------------------------------------------------------------------------
| HTML2CANVAS
|--------------------------------------------------------------------------
*/

const html2canvasScript =
  document.createElement("script");

html2canvasScript.src =
  "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";

html2canvasScript.crossOrigin =
  "anonymous";

document.head.appendChild(
  html2canvasScript
);

window.addEventListener(
  "resize",
  updateContentScale
);
