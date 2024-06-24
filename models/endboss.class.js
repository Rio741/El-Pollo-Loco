class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 55;
  maxEnergy = 100;
  energy = this.maxEnergy;
  hitCount = 0;
  walking = false;
  walkingSpeed = 3;

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  constructor() {
    super().loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_ATTACK);
    this.x = 3300;
    this.animate();
  }

  animate() {
    this.animationInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_ALERT);
    }, 200);
  }

  startWalking() {
    if (this.walking) return;
    this.walking = true;
    this.clearEndbossIntervals();
    this.animationInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 130);
    this.walkingInterval = setInterval(() => {
      this.x -= this.walkingSpeed;
    }, 1000 / 60);
  }

  startAttackAnimation() {
    this.clearEndbossIntervals();
    let i = 0;
    this.walking = false;
    const attackAnimationInterval = setInterval(() => {
      if (i < this.IMAGES_ATTACK.length) {
        this.img = this.imageCache[this.IMAGES_ATTACK[i]];
        i++;
      } else {
        if (!this.isEnemyDead) {
          this.startWalking();
        }
      }
    }, 200);
  }

  hurt() {
    this.clearEndbossIntervals();
    let i = 0;
    this.walking = false;
    const hurtAnimationInterval = setInterval(() => {
      if (i < this.IMAGES_HURT.length) {
        this.img = this.imageCache[this.IMAGES_HURT[i]];
        i++;
      } else {
        if (!this.isEnemyDead) {
          this.startWalking();
        }
      }
    }, 200);
  }

  die() {
    this.isEnemyDead = true;
    this.clearEndbossIntervals();

    let i = 0;
    const deathAnimationInterval = setInterval(() => {
      if (i < this.IMAGES_DEAD.length) {
        this.img = this.imageCache[this.IMAGES_DEAD[i]];
        i++;
      } else {
        this.removeFromWorld();
      }
    }, 300);
    this.winGame();
  }

  winGame() {
    let sounds = document.querySelectorAll("audio");
    sounds.forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
    });

    let winImg = document.getElementById("win-img");
    winImg.style.display = "flex";
  }

  clearEndbossIntervals() {
    clearInterval(this.animationInterval);
    clearInterval(this.walkingInterval);
    clearInterval(this.attackAnimationInterval);
    clearInterval(this.hurtAnimationInterval);
  }

  /*
  removeFromWorld() {
    const index = this.world.level.enemies.indexOf(this);
    if (index > -1) {
      this.world.level.enemies.splice(index, 1);
    }
  }
*/
}
