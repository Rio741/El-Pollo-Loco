class Bottle extends MovableObject {
  height = 70;
  width = 70;
  currentImage = 0;
  IMAGES_BOTTLE = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];
  
  constructor(x, y) {
    super().loadImage("img/6_salsa_bottle/1_salsa_bottle_on_ground.png");
    this.loadImages(this.IMAGES_BOTTLE);
    this.x = x;
    this.y = y;
  }

  animate() {
    this.world.addInterval(setInterval(() => {
      this.playAnimation(this.IMAGES_BOTTLE);
    }, 700));
  }
}
