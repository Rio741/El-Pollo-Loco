class Coin extends MovableObject {
  height = 120;
  width = 120;
  IMAGES_COIN = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];
  currentImage = 0;

  constructor(x, y) {
    super().loadImage("img/8_coin/coin_1.png");
    this.loadImages(this.IMAGES_COIN);
    this.x = x;
    this.y = y;
  }

  animate() {
    this.world.addInterval(setInterval(() => {
      this.playAnimation(this.IMAGES_COIN);
    }, 700));
  }
}
