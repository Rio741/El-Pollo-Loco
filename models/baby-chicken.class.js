class BabyChicken extends MovableObject {
  y = 368;
  height = 48;
  width = 48;
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];
  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];
  currentImage = 0;

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 200 + Math.random() * 500 + 720;
    this.speed = 0.15 + Math.random() * 0.3;
    this.animate();
  }

  animate() {
    setInterval(() => {
      if (!this.isEnemyDead) {
        this.moveLeft();
      }
    }, 1000 / 60);

    setInterval(() => {
      if (!this.isEnemyDead) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 200);
  }

  die() {
    this.world.audioManager.babyChickenSound.play();
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
