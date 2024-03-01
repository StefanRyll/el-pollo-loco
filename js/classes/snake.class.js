class Snake extends MovableObject {
    width = 160;
    height = 180;
    y = 320;
    energy = 1;
    offset = {
        left: 30,
        right: 0,
        top: 50,
        bottom: 10
    }
    IMAGES_WALKING = [
        'img/11_enemies_snake/Walk1.png',
        'img/11_enemies_snake/Walk2.png',
        'img/11_enemies_snake/Walk3.png',
        'img/11_enemies_snake/Walk4.png'
    ]
    IMAGE_DEAD = 'img/11_enemies_snake/Death4.png';
    chicken_sound = new Audio('audio/snake.mp3');


    constructor(x) {
        super().loadImage('img/11_enemies_snake/Walk1.png');
        this.x = x;
        this.speed = 0.15 + Math.random() * 1;
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
        this.isDead();
    }


    animate() {
        const moveInterval = setInterval(() => {
            if (!world.gamePaused && gameStarted && !world.isGameOver) this.moveLeft();
            this.otherDirection = true;;
        }, 1000 / 60);
        const animateInterval = setInterval(() => {
            if (!world.gamePaused && !world.isGameOver) this.playAnimation(this.IMAGES_WALKING)
        }, 200);
        setStoppableInterval(() => this.enemyKill(this.energy, moveInterval, animateInterval, this.IMAGE_DEAD), 200);
    }
}