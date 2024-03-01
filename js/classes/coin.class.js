class Coin extends MovableObject {
    width = 120;
    height = 120;
    offset = {
        left: 12,
        right: 15,
        top: 18,
        bottom: 12
    }
    IMAGES_CHANGES = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ]

    constructor() {
        super().loadImage(this.IMAGES_CHANGES[0]);
        this.x = 550 + Math.random() * 1700;
        this.y = 150 + Math.random() * 200;
        this.loadImages(this.IMAGES_CHANGES);
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (!world.gamePaused && !world.isGameOver) this.playAnimation(this.IMAGES_CHANGES);
        }, 200);
    }
}