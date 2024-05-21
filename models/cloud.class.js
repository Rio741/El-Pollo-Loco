class Cloud extends MovableObject {
  x = 0;
  y = 0;
  height = 300;
  width = 700;
  speed = 0.15;

  constructor() {
    super().loadImage("img/5_background/layers/4_clouds/1.png");
    this.x = Math.random() * 500;
    this.animate();
  }
  animate() {
    this.moveLeft();
  }
}
