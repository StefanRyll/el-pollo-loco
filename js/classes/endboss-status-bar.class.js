class EndbossStatusBar extends DrawableObject {
    IMAGES = [
        'img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue100.png',
    ];
    x = 495;
    y = 20;
    width = 200;
    height = 50;
    percentage = 100;

    constructor() {
        super();
        this.loadImage('img/7_statusbars/3_icons/icon_health_endboss.png')
        this.loadImages(this.IMAGES);
        this.setPercentage(100);
    }

    /**
     * Decreases the energy of the end boss status bar.
     * If the enemy is an instance of Endboss, sets the percentage of the status bar based on the enemy's energy.
     * @param {Enemy} enemy The enemy whose energy is to be used for updating the status bar.
     */
    decreaseEnergyOfEndbossStatusBar(enemy) {
        if (enemy instanceof Endboss) {
            this.setPercentage(enemy.energy);
        } else {
            return;
        }
    }
}