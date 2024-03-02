class Cloud extends MovableObject {
    y = 20;
    width = 500;
    height = 250;

    constructor(x) {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.animate();
        this.x = x;
    }

    /**
     * Executes the animation of the object at intervals.
     */
    animate() {
        setStoppableInterval(() => {
            if (!world.gamePaused) this.moveLeft()
        }, 1000 / 60);
    }
}