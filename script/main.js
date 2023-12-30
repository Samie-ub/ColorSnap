const loader = document.getElementById("loader");
setTimeout(() => {
  loader.style.display = "none";
}, 3000);

document.addEventListener("DOMContentLoaded", function () {
  const imageInput = document.getElementById("imageInput");
  const colorContainer = document.getElementById("colorContainer");
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
      addBtn.src = "./public/back.png";
      colorContainer.style.display = "none";

      loadImage(file)
        .then((image) => extractColors(image))
        .catch((error) => console.error("Error loading image:", error));
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

  function extractColors(image) {
    const vibrant = new Vibrant(image);
    const swatches = vibrant.swatches();

    if (swatches && Object.keys(swatches).length > 0) {
      const colorValues = Object.values(swatches)
        .filter((swatch) => swatch !== undefined)
        .map((swatch) => swatch.getHex());

      if (colorValues.length > 2) {
        displayColors(colorValues);

        colorContainer.style.display = "flex";
        colorContainerVisible = true;
      } else {
        alert("Image must contain at least 2 valid color swatches.");
        colorContainer.style.display = "none";

        colorContainerVisible = false;
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
});
