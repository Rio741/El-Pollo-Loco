class Chicken extends MovableObject {
  y = 340;
  height = 80;
  width = 80;
  currentImage = 0;
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];
  
  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 200 + Math.random() * 4000 + 700;
    this.speed = 0.5 + Math.random() * 1;
  }

  animate() {
    this.world.addInterval(setInterval(() => {
      if (!this.isEnemyDead) {
        this.moveLeft();
      }
    }, 1000 / 60));

    this.world.addInterval(setInterval(() => {
      if (!this.isEnemyDead) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 200));
  }

  die() {
    this.world.audioManager.chickenSound.play();
    this.isEnemyDead = true;
    this.loadImage(this.IMAGES_DEAD[0]);
    setTimeout(() => {
      this.removeFromWorld();
    }, 1000);
  }

  removeFromWorld() {
    const index = this.world.level.enemies.indexOf(this);
    if (index > -1) {
      this.world.level.enemies.splice(index, 1);
    }
  }
}
