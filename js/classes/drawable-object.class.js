class DrawableObject {
    x = 120;
    y = 250;
    img;
    height = 150;
    width = 100;
    imageCache = {};
    currentImage = 0;


    /**
     * Loads an image.
     * Increments the count of images to load.
     * @param {string} path The path to the image file.
     */
    loadImage(path) {
        imagesToLoad++;
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Loads multiple images into the image cache.
     * @param {Array} array An array of paths to the image files.
     */
    loadImages(array) {
        array.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draws the character on the canvas context.
     * @param {CanvasRenderingContext2D} ctx The 2D rendering context of the canvas.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Sets the percentage of the character and updates its image accordingly.
     * @param {number} percentage The percentage value to set.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolvePercentage()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolves the percentage value to an index for selecting the appropriate image from the IMAGES array.
     * @returns {number} The index corresponding to the resolved percentage.
     */
    resolvePercentage() {
        if (this.percentage === 100) {
            return 5;
        } else if (this.percentage >= 70) {
            return 4;
        } else if (this.percentage >= 50) {
            return 3;
        } else if (this.percentage >= 30) {
            return 2;
        } else if (this.percentage >= 10) {
            return 1;
        } else {
            return 0;
        }
    }
}