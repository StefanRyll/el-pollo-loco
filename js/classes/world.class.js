class World {
    character = new Character();
    level = level1;
    statusBar = new StatusBar();
    bottleStatusBar = new BottleStatusBar();
    coinStatusBar = new CoinStatusBar();
    endbossStatusBar = new EndbossStatusBar();
    throwableObject = [];
    gamePaused = false;
    ctx;
    canvas;
    keyboard;
    camera_x = -60;
    throwCooldown = 0;
    throwDelay = 1500;
    gameMusic_sound = new Audio('audio/gameMusic.mp3');
    endBossFight_sound = new Audio('audio/endboss_fight.mp3');
    endbossFight = false;
    characterImmortal = false;
    isGameOver = false;
    oneItem = 10;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.run();
    }

    /**
     * Runs the game loop, checking collisions, updating game elements, and handling game logic.
     */
    run() {
        setStoppableInterval(() => {
            this.checkCollisionsWithEnemy();
            this.checkCollisionOfBottleWithEnemy();
            this.checkCollisionWithCollectible(this.level.bottles, this.character, "collectedBottles", this.bottleStatusBar, this.character.bottle_sound);
            this.checkCollisionWithCollectible(this.level.coins, this.character, "collectedCoins", this.coinStatusBar, this.character.coin_sound);
            this.throwBottle();
            this.checkForEndOfGame();
            this.bottleStatusBar.setPercentage(this.bottleStatusBar.percentage);
            if (this.throwCooldown > 0) this.throwCooldown -= 100;
        }, 100);
    }

    /**
     * Throws a bottle if the conditions are met.
     */
    throwBottle() {
        if (this.checkForThrowingBottle('W', !this.character.otherDirection)) this.throwObj(20);
        if (this.checkForThrowingBottle('W', this.character.otherDirection)) this.throwObj(20);
    }

    /**
     * Checks if conditions are met to throw a bottle.
     * @param {string} key - The keyboard key to check for bottle throwing.
     * @param {boolean} direction - The direction the character is facing.
     * @returns {boolean} True if conditions are met to throw a bottle.
     */
    checkForThrowingBottle(key, direction) {
        return keyboard[key] && this.character.collectedBottles > 0 && this.throwCooldown <= 0 && !this.gamePaused && gameStarted && direction;
    }

    /**
     * Creates a new throwable object (bottle) and adjusts game state accordingly.
     * @param {number} speed - The speed at which the bottle is thrown.
     */
    throwObj(speed) {
        let bottle = new ThrowableObject(this.character.x + 40, this.character.y + 100, this.character.otherDirection, speed);
        this.throwableObject.push(bottle);
        this.character.collectedBottles = this.character.collectedBottles - this.oneItem;
        this.bottleStatusBar.percentage = this.bottleStatusBar.percentage - this.oneItem;
        this.character.throw_sound.play();
        this.throwCooldown = this.throwDelay;
    }

    /**
     * Handles the logic when the character hits an enemy.
     * @param {object} enemy - The enemy object that the character collides with.
     */
    checkCollisionsWithEnemy() {
        this.level.enemies.forEach(enemy => {
            if (this.isCharacterCollidingWithEnemy(enemy)) this.characterHitsEnemy(enemy);
            if (this.isEnemyCollidingWithCharacter(enemy)) this.enemyHitsCharacter();
        });
    }

    /**
     * Manages the collision of a thrown bottle with an enemy.
     */
    checkCollisionOfBottleWithEnemy() {
        if (this.throwableObject.length > 0) {
            this.level.enemies.forEach(enemy => {
                this.throwableObject.forEach(bottle => {
                    if (this.isBottleHittingEnemy(bottle, enemy)) {
                        this.handleBottleHitEnemy(bottle, enemy);
                        if (this.isEnemyDead(enemy)) {
                            this.enemyDies(enemy);
                        }
                    } else if (this.isBottleHittingGround(bottle, enemy)) {
                        this.bottleBreaking(bottle);
                    }
                });
            });
        }
    }

    /**
     * Determines if the character is colliding with an enemy.
     * @param {Object} enemy - The enemy object to check for collision.
     * @returns {boolean} True if the character is colliding with the enemy.
     */
    isCharacterCollidingWithEnemy(enemy) {
        return this.character.isCollidingOld(enemy) && this.character.isAboveGround() && enemy.energy > 0 && this.character.speedY < 0;
    }

    /**
     * Handles the event when the character hits an enemy.
     * @param {Object} enemy - The enemy that the character collides with.
     */
    characterHitsEnemy(enemy) {
        enemy.energy--;
        enemy.hit();
        this.endbossStatusBar.decreaseEnergyOfEndbossStatusBar(enemy);
        this.character.jump();
        if (enemy.energy <= 0) {
            this.deleteEnemy(enemy);
            this.chickenSound(enemy);
        }
    }

    /**
     * Checks if an enemy is colliding with the character.
     * @param {Object} enemy - The enemy object to check for collision.
     * @returns {boolean} True if the enemy is colliding with the character.
     */
    isEnemyCollidingWithCharacter(enemy) {
        return this.character.isCollidingOld(enemy) && !this.character.isAboveGround() && this.character.energy > 0 && enemy.energy > 0 && !this.characterImmortal;
    }

    /**
     * Handles the event when an enemy hits the character.
     * Updates character's energy, plays hurt sound, updates status bar, and sets immortal timer.
     */
    enemyHitsCharacter() {
        this.character.hit(true);
        this.character.hurt_sound.play();
        this.statusBar.setPercentage(this.character.energy);
        this.setImmortalTimer();
    }

    /**
     * Checks if a thrown bottle is hitting an enemy.
     * @param {Object} bottle - The thrown bottle object.
     * @param {Object} enemy - The enemy object to check for collision.
     * @returns {boolean} True if the bottle is hitting the enemy.
     */
    isBottleHittingEnemy(bottle, enemy) {
        return bottle.isCollidingOld(enemy) && enemy.energy > 0;
    }

    /**
     * Manages the interaction when a thrown bottle hits an enemy.
     * @param {Object} bottle - The bottle that hits the enemy.
     * @param {Object} enemy - The enemy that is hit by the bottle.
     */
    handleBottleHitEnemy(bottle, enemy) {
        enemy.energy = enemy.energy - 5;
        this.breakingGlassSound();
        this.deleteBottle(bottle);
        enemy.hit();
        this.endbossStatusBar.decreaseEnergyOfEndbossStatusBar(enemy);
    }

    /**
     * Checks if the enemy is dead.
     * @param {object} enemy - The enemy to check.
     * @returns {boolean} - Returns true if the enemy's energy is less than or equal to 0, otherwise false.
     */
    isEnemyDead(enemy) {
        return enemy.energy <= 0;
    }

    /**
     * Handles the event when an enemy dies.
     * Deletes the enemy from the level and plays the chicken sound.
     * @param {object} enemy - The enemy that died.
     */
    enemyDies(enemy) {
        this.deleteEnemy(enemy);
        this.chickenSound(enemy);
    }

    /**
     * Deletes an enemy from the level after a delay.
     * @param {object} enemy - The enemy to delete.
     */
    deleteEnemy(enemy) {
        setTimeout(() => this.level.enemies.splice(this.level.enemies.indexOf(enemy), 1), 2000);
    }

    /**
     * Plays the chicken sound.
     * @param {object} enemy - The enemy for which to play the sound.
     */
    chickenSound(enemy) {
        enemy.chicken_sound.play();
    }

    /**
     * Checks if a thrown bottle is hitting the ground.
     * @param {Object} bottle - The thrown bottle object.
     * @param {Object} enemy - The enemy object for reference.
     * @returns {boolean} True if the bottle is hitting the ground.
     */
    isBottleHittingGround(bottle, enemy) {
        return !bottle.isCollidingOld(enemy) && !bottle.isAboveGround();
    }

    /**
     * Handles the event when a bottle breaks.
     * Plays the breaking glass sound and deletes the bottle.
     * @param {object} bottle - The bottle that broke.
     */
    bottleBreaking(bottle) {
        this.breakingGlassSound();
        this.deleteBottle(bottle);
    }

    /**
     * Checks for the end of the game.
     * If the end boss is defeated or the character's energy reaches 0, triggers the game over sequence.
     */
    checkForEndOfGame() {
        if (!this.checkIfEndboss()) this.gameOver('win_sound');
        if (this.character.energy == 0) this.gameOver('gameOver_sound');
    }

    /**
     * Triggers the game over sequence.
     * Stops the game, plays the specified sound, and sets the game over flag.
     * @param {string} sound - The sound to play when the game is over.
     */
    gameOver(sound) {
        setTimeout(() => {
            stopGame();
            this.character[sound].play();
            this.isGameOver = true;
        }, 1000);
    }

    /**
     * Sets a timer to make the character immortal for a short duration.
     * Immortal character cannot be hurt by enemies.
     */
    setImmortalTimer() {
        this.characterImmortal = true;
        setTimeout(() => this.characterImmortal = false, 150);
    }

    /**
     * Checks if an end boss exists in the level.
     * @returns {boolean} - Returns true if an end boss exists, otherwise false.
     */
    checkIfEndboss() {
        return this.level.enemies.some(enemy => enemy instanceof Endboss);
    }

    /**
     * Plays the breaking glass sound.
     */
    breakingGlassSound() {
        this.character.breaking_glass_sound.play();
    }

    /**
     * Deletes a bottle after a short delay.
     * @param {object} bottle - The bottle object to delete.
     */
    deleteBottle(bottle) {
        setTimeout(() => this.throwableObject.splice(this.throwableObject.indexOf(bottle)), 200);
    }

    /**
     * Checks for collisions between the character and collectible items.
     * @param {Array} collectibles - An array of collectible objects.
     * @param {Object} character - The game's main character.
     * @param {string} countPropertyName - The property name to increment on collision.
     * @param {Object} statusBar - The status bar to update on collision.
     * @param {Object} sound - The sound effect to play on collision.
     */
    checkCollisionWithCollectible(collectibles, character, countPropertyName, statusBar, sound) {
        collectibles.forEach((collectible, index) => {
            if (this.isCharacterCollidingWithCollectable(collectible)) {
                this.collectItem(collectibles, index, character, countPropertyName, statusBar, sound);
            }
        });
    }

    /**
     * Checks if the character is colliding with a collectible object.
     * @param {object} collectible - The collectible object to check collision with.
     * @returns {boolean} - Returns true if the character is colliding with the collectible, otherwise false.
     */
    isCharacterCollidingWithCollectable(collectible) {
        return this.character.isCollidingOld(collectible);
    }

    /**
     * Handles the collection of an item.
     * @param {Array} collectibles - An array of collectible objects.
     * @param {number} index - The index of the collectible in the array.
     * @param {Object} character - The game's main character.
     * @param {string} countPropertyName - The property name to increment on collection.
     * @param {Object} statusBar - The status bar to update on collection.
     * @param {Object} sound - The sound effect to play on collection.
     */
    collectItem(collectibles, index, character, countPropertyName, statusBar, sound) {
        if (character[countPropertyName] < 100) {
            collectibles.splice(index, 1);
            character[countPropertyName] = character[countPropertyName] + this.oneItem;
            statusBar.setPercentage(character[countPropertyName]);
            if (sound) sound.play();
        }
    }

    /**
     * Draws all objects on the canvas.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clears the canvas before draw new objects.
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);

        this.ctx.translate(-this.camera_x, 0);
        // Space for non movable objects ------------------
        this.addToMap(this.endbossStatusBar);
        this.addToMap(this.coinStatusBar);
        this.addToMap(this.bottleStatusBar);
        this.addToMap(this.statusBar);
        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObject);
        this.addToMap(this.character);
        this.ctx.translate(-this.camera_x, 0);

        requestAnimationFrame(() => {
            this.draw();
        });
    }

    /**
     * Adds multiple objects to the canvas map.
     * @param {Array} object - The array of objects to add to the map.
     */
    addObjectsToMap(object) {
        object.forEach(o => {
            this.addToMap(o);
        });
    }

    /**
     * Adds a single object to the canvas map.
     * @param {object} mo - The object to add to the map.
     */
    addToMap(mo) {
        if (mo.otherDirection) this.mirrowImage(mo);
        mo.draw(this.ctx);
        if (mo.otherDirection) this.mirrowImageReset(mo);
    }

    /**
     * Mirrors the image horizontally.
     * @param {object} mo - The object whose image is to be mirrored.
     */
    mirrowImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Resets the mirrored image to its original state.
     * @param {object} mo - The object whose image is to be reset.
     */
    mirrowImageReset(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}