class Character extends MovableObject {
    y = 160;
    height = 280;
    width = 110;
    speed = 5;
    energy = 100;
    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];
    IMAGES_IDLE_LONG = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];
    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];
    startTime = 0;
    elapsedTime = 5000;
    offset = {
        left: 10,
        right: 20,
        top: 110,
        bottom: 10
    }
    walking_sound = new Audio('audio/running.mp3');
    jump_sound = new Audio('audio/jump.mp3');
    throw_sound = new Audio('audio/throw.mp3');
    bottle_sound = new Audio('audio/bottle.mp3');
    breaking_glass_sound = new Audio('audio/glass.mp3');
    hurt_sound = new Audio('audio/hurt.mp3');
    coin_sound = new Audio('audio/coin.mp3');
    gameOver_sound = new Audio('audio/gameOver.mp3');
    win_sound = new Audio('audio/win.mp3');


    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_IDLE_LONG);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
        this.applyGravity();
        this.isDead();
        this.resetTimer();
    }


    animate() {
        setStoppableInterval(() => this.movingCharacter(), 1000 / 60);
        setStoppableInterval(() => this.animateCharacter(), 100);
    }

    /**
     * Moves the character based on the current game conditions.
     * Pauses the walking sound of the character, checks movement possibilities,
     * and performs movement, jumping, and activity reset. Updates the camera position.
     */
    movingCharacter() {
        this.walking_sound.pause();
        if (this.canMoveRight())
            this.moveRight();
        if (this.canMoveLeft())
            this.moveLeft();
        if (this.canJump())
            this.jump();
        if (this.isCharacterActive())
            this.resetTimer();
        world.camera_x = -this.x + 100;
    }

    /**
     * Animates the character based on its current state.
     * Decreases the startTime if it's greater than 0.
     * Plays animations for different character states such as dead, hurt, jumping, walking, long idle, and idle.
     */
    animateCharacter() {
        if (this.startTime > 0)
            this.startTime -= 100;
        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
            this.isDeadImg();
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (this.checkIfCharIsJumping()) {
            this.playAnimation(this.IMAGES_JUMPING);
        } else if (this.characterIsWalking()) {
            this.playAnimation(this.IMAGES_WALKING);
        } else if (this.checkIfCharIsLongIdle()) {
            this.playAnimation(this.IMAGES_IDLE_LONG);
        } else if (this.checkIfCharIsIdle()) {
            this.playAnimation(this.IMAGES_IDLE);
        }
    }

    /**
     * Checks if the character can move to the right.
     * @returns {boolean} True if the game is not paused, the right arrow key is pressed, 
     *                    and the character's x-coordinate is less than the level's end x-coordinate; otherwise, false.
     */
    canMoveRight() {
        return !world.gamePaused && keyboard.RIGHT && this.x < world.level.level_end_x;
    }

    /**
     * Moves the character to the right.
     * Calls the parent class's moveRight method, sets otherDirection to false,
     * and plays the walking sound.
     */
    moveRight() {
        super.moveRight();
        this.otherDirection = false;
        this.walking_sound.play();
    }

    /**
     * Checks if the character can move to the left.
     * @returns {boolean} True if the game is not paused, the left arrow key is pressed, 
     *                    and the character's x-coordinate is greater than -600; otherwise, false.
     */
    canMoveLeft() {
        return !world.gamePaused && keyboard.LEFT && this.x > -600;
    }

    /**
     * Moves the character to the left.
     * Calls the parent class's moveLeft method, sets otherDirection to true,
     * and plays the walking sound.
     */
    moveLeft() {
        super.moveLeft();
        this.otherDirection = true;
        this.walking_sound.play();
    }

    /**
     * Checks if the character can jump.
     * @returns {boolean} True if the game is not paused, the up arrow key is pressed, 
     *                    and the character is not above the ground; otherwise, false.
     */
    canJump() {
        return !world.gamePaused && keyboard.UP && !this.isAboveGround();
    }

    /**
     * Makes the character jump.
     * Calls the jump method of the parent class and plays the jump sound.
     */
    jump() {
        super.jump();
        this.jump_sound.play();
    }

    /**
     * Checks if the character is actively moving or jumping.
     * @returns {boolean} True if the up arrow key, right arrow key, left arrow key, or spacebar is pressed; otherwise, false.
     */
    isCharacterActive() {
        return keyboard.UP || keyboard.RIGHT || keyboard.LEFT;
    }

    /**
     * Checks if the character is walking.
     * @returns {boolean} True if the right arrow key is pressed and the game is not paused,
     *                    or the left arrow key is pressed and the game is not paused; otherwise, false.
     */
    characterIsWalking() {
        return keyboard.RIGHT && !world.gamePaused || keyboard.LEFT && !world.gamePaused;
    }

    /**
     * Resets the character's timer to the current elapsed time.
     */
    resetTimer() {
        this.startTime = this.elapsedTime;
    }

    /**
     * Checks if the character is currently jumping.
     * @returns {boolean} True if the character is above the ground and the game is not paused; otherwise, false.
     */
    checkIfCharIsJumping() {
        return this.isAboveGround() && !world.gamePaused;
    }

    /**
     * Checks if the character is in a long idle state.
     * @returns {boolean} True if the character's start time is less than or equal to 0 and the game is not paused; otherwise, false.
     */
    checkIfCharIsLongIdle() {
        return this.startTime <= 0 && !world.gamePaused;
    }

    /**
     * Checks if the character is idle.
     * @returns {boolean} True if the game is not paused; otherwise, false.
     */
    checkIfCharIsIdle() {
        return !world.gamePaused;
    }

    /**
     * Loads the image for the character when it is dead after a delay.
     */
    isDeadImg() {
        setTimeout(() => this.loadImage('img/2_character_pepe/5_dead/D-57.png'), 1000);
    }
}