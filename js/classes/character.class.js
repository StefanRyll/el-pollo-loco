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
    test = 0;
    test2 = 0; // ÜBERPRÜFEN //

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


    canMoveRight() {
        return !world.gamePaused && keyboard.RIGHT && this.x < world.level.level_end_x;
    }


    moveRight() {
        this.test = 60;
        super.moveRight();
        this.otherDirection = false;
        this.walking_sound.play();
    }


    canMoveLeft() {
        return !world.gamePaused && keyboard.LEFT && this.x > -600;
    }


    moveLeft() {
        this.test2 = 560;
        super.moveLeft();
        this.otherDirection = true;
        this.walking_sound.play();
    }


    canJump() {
        return !world.gamePaused && keyboard.UP && !this.isAboveGround();
    }


    jump() {
        super.jump();
        this.jump_sound.play();
    }


    isCharacterActive() {
        return keyboard.UP || keyboard.RIGHT || keyboard.LEFT || keyboard.SPACE;
    }


    characterIsWalking() {
        return keyboard.RIGHT && !world.gamePaused || keyboard.LEFT && !world.gamePaused;
    }


    resetTimer() {
        this.startTime = this.elapsedTime;
    }


    checkIfCharIsJumping() {
        return this.isAboveGround() && !world.gamePaused;
    }


    checkIfCharIsLongIdle() {
        return this.startTime <= 0 && !world.gamePaused;
    }


    checkIfCharIsIdle() {
        return !world.gamePaused;
    }


    isDeadImg() {
        setTimeout(() => this.loadImage('img/2_character_pepe/5_dead/D-57.png'), 1000);
    }
}