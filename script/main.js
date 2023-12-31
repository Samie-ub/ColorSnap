const loader = document.getElementById("loader");
setTimeout(() => {
  loader.style.display = "none";
}, 3000);

document.addEventListener("DOMContentLoaded", function () {
  const colorContainer = document.getElementById("colorContainer");
  const homeContainer = document.querySelector(".home-container");
  let generateColors = true;
  let imageSelected = false;
  let colorInterval;

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function updateColorPalette() {
    if (!generateColors || imageSelected) return;

    colorContainer.innerHTML = "";
    for (let i = 0; i < 5; i++) {
      const colorDiv = document.createElement("div");
      const randomColor = getRandomColor();

      colorDiv.style.backgroundColor = randomColor;
      colorDiv.textContent = randomColor;
      colorDiv.addEventListener("click", function () {
        navigator.clipboard.writeText(randomColor);
        showCopiedSign(colorDiv);
      });

      colorContainer.appendChild(colorDiv);
    }
  }

  function showCopiedSign(element) {
    const copiedSign = document.createElement("div");
    copiedSign.className = "copied-sign";
    copiedSign.textContent = "Copied!";
    element.appendChild(copiedSign);
    setTimeout(() => {
      copiedSign.remove();
    }, 1000);
  }

  function displayLoading() {
    // Create the loader element
    const loaderElement = document.createElement("div");
    loaderElement.classList.add("image-loader");

    // Center the loader using CSS
    loaderElement.style.position = "absolute";
    loaderElement.style.top = "50%";
    loaderElement.style.left = "50%";

    // Append the loader to the homeContainer
    homeContainer.appendChild(loaderElement);

    return loaderElement;
  }

  function removeLoading(loaderElement) {
    loaderElement.remove();
  }

  function extractColors(image) {
    const vibrant = new Vibrant(image);
    const swatches = vibrant.swatches();

    if (swatches && Object.keys(swatches).length > 0) {
      const colorValues = Object.values(swatches)
        .filter((swatch) => swatch !== undefined)
        .map((swatch) => swatch.getHex());

      if (colorValues.length > 2) {
        displayColors(colorValues);
      } else {
        alert("Image must contain at least 2 valid color swatches.");
        location.reload();
      }
    } else {
      console.error("Unable to extract colors from the image.");
    }
  }

  function displayColors(colors) {
    colorContainer.innerHTML = "";
    colors.forEach((color) => {
      const colorDiv = document.createElement("div");
      colorDiv.style.backgroundColor = color;
      colorDiv.textContent = color;
      colorDiv.addEventListener("click", () => handleColorClick(color));
      colorContainer.appendChild(colorDiv);
    });
  }

  function handleColorClick(color) {
    showCopiedSign(event, color);
  }

  function showCopiedSign(event, color) {
    const copiedSign = document.createElement("div");
    copiedSign.classList.add("copied-sign");
    copiedSign.textContent = "Copied!";
    copiedSign.style.top = event.clientY + "px";
    copiedSign.style.left = event.clientX + "px";

    document.body.appendChild(copiedSign);

    setTimeout(() => {
      document.body.removeChild(copiedSign);
    }, 1000);

    copyToClipboard(color);
  }

  function copyToClipboard(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }

  const imageInput = document.getElementById("imageInput");
  const addBtn = document.querySelector(".add-btn img");

  let colorContainerVisible = false;

  addBtn.addEventListener("click", handleButtonClick);

  function handleButtonClick() {
    if (colorContainerVisible) {
      colorContainer.innerHTML = "";
      colorContainer.style.display = "none";

      addBtn.src = "./public/add.png";

      colorContainerVisible = false;
    } else {
      imageInput.click();
    }
  }

  imageInput.addEventListener("change", handleImageUpload);

  function handleImageUpload() {
    const file = imageInput.files[0];

    if (file) {
      const loadingSign = displayLoading();
      addBtn.src = "./public/back.png";
      colorContainer.style.display = "none";
      imageSelected = true;

      clearInterval(colorInterval);

      loadImage(file)
        .then((image) => {
          homeContainer.style.backgroundImage = `url('${URL.createObjectURL(
            file
          )}')`;
          homeContainer.style.backgroundSize = "contain";
          homeContainer.style.backgroundRepeat = "no-repeat";
          homeContainer.style.backgroundPosition = "center";

          setTimeout(() => {
            extractColors(image);
            removeLoading(loadingSign);
            colorContainer.style.display = "flex";
            colorInterval = setInterval(updateColorPalette, 1000); 
          }, 2000); 
        })
        .catch((error) => {
          console.error("Error loading image:", error);
        });
    }
  }

  function loadImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = function (e) {
        const image = new Image();
        image.src = e.target.result;

        image.onload = function () {
          resolve(image);
        };

        image.onerror = function () {
          reject("Failed to load the image.");
        };
      };

      reader.readAsDataURL(file);
    });
  }

  colorContainer.addEventListener("mouseenter", () => {
    generateColors = false;
    clearInterval(colorInterval);
  });

  colorContainer.addEventListener("mouseleave", () => {
    generateColors = true;
    updateColorPalette();
    colorInterval = setInterval(updateColorPalette, 1000);
  });
});
