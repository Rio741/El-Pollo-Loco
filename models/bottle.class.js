class Bottle extends MovableObject {
  height = 70;
  width = 70;
  currentImage = 0;
  IMAGES_BOTTLE = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];
  
  constructor(x, y) {
    super();
    this.loadImage("img/6_salsa_bottle/1_salsa_bottle_on_ground.png");
    this.loadImages(this.IMAGES_BOTTLE);
    this.x = x;
    this.y = y;
  }

  animate() {
    super.animate(this.IMAGES_BOTTLE);
  }

  handleCollision(world, index) {
    if (world.character.collectedBottles < 5) {
      world.character.incrementBottleCount();
      let bottlePercentage = world.character.collectedBottles * 20;
      world.bottleStatusBar.setPercentage(bottlePercentage);
      world.level.items.splice(index, 1);
      world.audioManager.bottleSound.play();
    }
  }
}
