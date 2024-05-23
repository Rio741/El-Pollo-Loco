class Coin extends MovableObject {
  height = 120;
  width = 120;
  IMAGES_WALKING = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];
  currentImage = 0;

  constructor(x, y) {
    super().loadImage("img/8_coin/coin_1.png");
    this.loadImages(this.IMAGES_WALKING);
    this.x = x;
    this.y = y;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 700);
  }
}
