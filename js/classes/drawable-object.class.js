class DrawableObject {
    x = 120;
    y = 250;
    img;
    height = 150;
    width = 100;
    imageCache = {};
    currentImage = 0;

    loadImage(path) {
        imagesToLoad++;
        this.img = new Image();
        this.img.src = path;
    }


    loadImages(array) {
        array.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }


    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }


    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolvePercentage()];
        this.img = this.imageCache[path];
    }


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