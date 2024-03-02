class Endboss extends MovableObject {
    height = 400;
    width = 250;
    y = 50;
    energy = 100;
    speed = 4;
    offset = {
        left: 15,
        right: 20,
        top: 80,
        bottom: 30
    }
    positionEnd = false;
    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];
    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];
    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];
    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];
    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];
    chicken_sound = new Audio('audio/endboss_hurt.mp3');

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.x = 2500;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        setTimeout(() => this.animate(), 5000);
    }

    /**
     * Initiates the animation loops for moving and animating the end boss.
     * Uses two intervals: one for continuous movement and one for animation frames.
     * Movement is executed at a higher frequency (60 times per second) to ensure smooth motion.
     * Animation frames are updated at a lower frequency (5 times per second) for rendering.
     * @memberof Object
     * @function animate
     * @instance
     * @returns {void}
     */
    animate() {
        const moveInterval = setInterval(() => {
            if (!world.gamePaused) this.movingEndboss()
        }, 1000 / 60);
        setStoppableInterval(() => {
            if (!world.gamePaused) this.animateEndboss(moveInterval)
        }, 200);
    }

    /**
     * Starts the Endboss fight.
     */
    startEndBoss() {
        if (this.canEndbossStart()) {
            setMusicPause();
            setMusic('endBossFight_sound');
            world.endbossFight = true;
            setTimeout(() => this.positionEnd = true, 2500);
        }
    }

    /**
     * Ends the Endboss fight.
     * @param {number} mI - The ID of the interval.
     */
    endBossDead(mI) {
        clearInterval(mI);
        this.playAnimation(this.IMAGES_DEAD);
    }

    /**
     * Moves the Endboss.
     */
    movingEndboss() {
        if (this.isCharacterAtTheEnd())
            this.moveLeft();
        if (this.isCharacterNear())
            this.moveRight();
    }

    /**
     * Animates the Endboss.
     * @param {number} mI - The ID of the interval.
     */
    animateEndboss(mI) {
        if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (!this.positionEnd) {
            this.playAnimation(this.IMAGES_ALERT);
        } else if (world.character.isHurt()) {
            this.playAnimation(this.IMAGES_ATTACK)
        } else if (this.energy <= 0) {
            this.endBossDead(mI);
        } else {
            this.playAnimation(this.IMAGES_WALKING);
        }
        this.startEndBoss();
    }

    /**
     * Checks if the character is at the end.
     * @returns {boolean} - Returns true if the character is at the end, otherwise false.
     */
    isCharacterAtTheEnd() {
        return (2500 - world.character.x) < 800 && this.x > world.character.x && this.positionEnd && gameStarted;
    }

    /**
     * Moves the Endboss to the left.
     */
    moveLeft() {
        super.moveLeft();
        this.otherDirection = false;
    }

    /**
     * Checks if the character is nearby.
     * @returns {boolean} - Returns true if the character is nearby, otherwise false.
     */
    isCharacterNear() {
        return (2500 - world.character.x) > 800 && this.x < 2500 && this.positionEnd && gameStarted;
    }

    /**
     * Moves the Endboss to the right.
     */
    moveRight() {
        super.moveRight();
        this.otherDirection = true;
    }

    /**
     * Checks if the Endboss can start.
     * @returns {boolean} - Returns true if the Endboss can start, otherwise false.
     */
    canEndbossStart() {
        return (2500 - world.character.x) < 700;
    }
}