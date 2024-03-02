class Bottle extends MovableObject {
    width = 50;
    height = 90;
    y = 340;
    offset = {
        left: 20,
        right: 8,
        top: 15,
        bottom: 8
    }
    IMAGES_CHANGES = [
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/salsa_bottle.png',
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png'
    ]

    constructor() {
        super().loadImage(this.IMAGES_CHANGES[0]);
        this.x = 400 + Math.random() * 1800;
        this.loadImages(this.IMAGES_CHANGES);
        this.animate();
    }

    /**
     * Executes the animation of the object at intervals.
     */
    animate() {
        setInterval(() => {
            if (!world.gamePaused && !world.isGameOver) this.playAnimation(this.IMAGES_CHANGES);
        }, 200);
    }
}