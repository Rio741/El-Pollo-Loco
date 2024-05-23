class Cloud extends MovableObject {
  x = 0;
  y = 0;
  height = 300;
  width = 700;
  speed = 0.15;

  constructor(image, startX) {
    super().loadImage(image);
    this.x = Math.random() * 300 + startX;
    this.animate();
  }
  animate() {
    this.moveLeft();
  }
}
