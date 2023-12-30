document.addEventListener('DOMContentLoaded', function () {
    const imageInput = document.getElementById('imageInput');
    const colorContainer = document.getElementById('colorContainer');

    imageInput.addEventListener('change', handleImageUpload);

    function handleImageUpload() {
        const file = imageInput.files[0];

        if (file) {
            loadImage(file)
                .then(image => extractColors(image))
                .catch(error => console.error('Error loading image:', error));
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
                    reject('Failed to load the image.');
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
                .filter(swatch => swatch !== undefined) // Filter out undefined swatches
                .map(swatch => swatch.getHex());
    
            if (colorValues.length > 0) {
                displayColors(colorValues);
            } else {
                console.error('No valid color swatches found.');
            }
        } else {
            console.error('Unable to extract colors from the image.');
        }
    }
    

    function displayColors(colors) {
        colorContainer.innerHTML = '';
        colors.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.style.backgroundColor = color;
            colorDiv.textContent = color;
            colorContainer.appendChild(colorDiv);
        });
    }
});
