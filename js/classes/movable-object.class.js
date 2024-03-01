class MovableObject extends DrawableObject {
    speed = .15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    lastHit = 0;
    collectedBottles = 0;
    collectedCoins = 0;
    offset = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    }
    chicken_sound = new Audio('audio/chicken.mp3');

    applyGravity() {
        setStoppableInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    isCollidingOld(obj) {
        return (this.x + this.width) - this.offset.right > obj.x + obj.offset.left &&
            (this.y + this.height) - this.offset.bottom > obj.y + obj.offset.top &&
            this.x + this.offset.left < obj.x + obj.width + obj.offset.right &&
            this.y + this.offset.top < obj.y + obj.height + obj.offset.bottom;
    }


    hit(character) {
        if (character) this.energy -= 5;
        this.lastHit = new Date().getTime();
    }


    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < .8;
    }


    isDead() {
        return this.energy == 0;
    }


    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return this.y < 350;
        } else {
            return this.y < 160;
        }
    }


    moveRight() {
        this.x += this.speed;
    }


    moveLeft() {
        this.x -= this.speed;
    }


    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }


    jump() {
        this.speedY = 25;
    }

    enemyKill(energy, mI, aI, image) {
        if (energy <= 0) {
            clearInterval(mI);
            clearInterval(aI);
            this.loadImage(image);
        }
    }
}