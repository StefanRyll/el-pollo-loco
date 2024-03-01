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

    /**
     * Applies gravity to the movable object.
     */
    applyGravity() {
        setStoppableInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /**
     * Checks if the object is colliding with another object.
     * @param {DrawableObject} obj - The object to check collision with.
     * @returns {boolean} - Returns true if colliding, otherwise false.
     */
    isCollidingOld(obj) {
        return (this.x + this.width) - this.offset.right > obj.x + obj.offset.left &&
            (this.y + this.height) - this.offset.bottom > obj.y + obj.offset.top &&
            this.x + this.offset.left < obj.x + obj.width + obj.offset.right &&
            this.y + this.offset.top < obj.y + obj.height + obj.offset.bottom;
    }

    /**
     * Handles a hit on the object.
     * @param {Character} character - The character causing the hit.
     */
    hit(character) {
        if (character) this.energy -= 10;
        this.lastHit = new Date().getTime();
    }

    /**
     * Checks if the object is hurt.
     * @returns {boolean} - Returns true if hurt, otherwise false.
     */
    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < .8;
    }

    /**
     * Checks if the object is dead.
     * @returns {boolean} - Returns true if dead, otherwise false.
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Checks if the object is above ground.
     * @returns {boolean} - Returns true if above ground, otherwise false.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return this.y < 350;
        } else {
            return this.y < 160;
        }
    }

    /**
     * Moves the object to the right.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left.
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Plays the animation for the object.
     * @param {string[]} images - An array of image paths for the animation.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Causes the object to jump.
     */
    jump() {
        this.speedY = 25;
    }

    /**
     * Handles the killing of an enemy object.
     * @param {number} energy - The energy level of the enemy object.
     * @param {number} mI - The ID of the move interval.
     * @param {number} aI - The ID of the animation interval.
     * @param {string} image - The image path for the dead enemy.
     */
    enemyKill(energy, mI, aI, image) {
        if (energy <= 0) {
            clearInterval(mI);
            clearInterval(aI);
            this.loadImage(image);
        }
    }
}