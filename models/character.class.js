class Character extends MovableObject {
  y = 35;
  height = 300;
  width = 140;
  speed = 6;
  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  IMAGES_SLEEP = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];
  
  IMAGES_LONG_SLEEP = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_SLEEP);
    this.loadImages(this.IMAGES_LONG_SLEEP);
    this.applyGravity();
    this.animate();
  }
/*
  animate() {
    const animateInterval = () => {
      this.updateCharacterState();
      this.animateDead();
      this.animateSleep();
      this.animateLongSleep();
      this.animateHurt();
      this.animateJump();
      this.animateWalk();
      requestAnimationFrame(animateInterval);
    };
    animateInterval();
  }

  updateCharacterState() {
    this.world.audioManager.walking_sound.pause();
    this.world.audioManager.walking_sound.currentTime = 0;
    this.world.audioManager.snoreSound.pause();
    this.world.audioManager.snoreSound.currentTime = 0;
    this.handleRightMovement();
    this.handleLeftMovement();
    this.handleJump();
    this.updateCameraPosition();
  }*/

  animate() {
    this.animateMovement();
    this.animateDead();
    this.animateSleep();
    this.animateLongSleep();
    this.animateHurt();
    this.animateJump();
    this.animateWalk();
  }

  animateMovement() {
    setInterval(() => {
      this.world.audioManager.walking_sound.pause();
      this.world.audioManager.walking_sound.currentTime = 0;
      this.world.audioManager.snoreSound.pause();
      this.world.audioManager.snoreSound.currentTime = 0;
      this.handleRightMovement();
      this.handleLeftMovement();
      this.handleJump();
      this.updateCameraPosition();
    }, 1000 / 60);
  }


  handleRightMovement() {
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      this.world.audioManager.walking_sound.play();
      this.sleepAnimationPlayed = false;
    }
  }

  handleLeftMovement() {
    if (this.world.keyboard.LEFT && this.x > -100) {
      this.moveLeft();
      this.otherDirection = true;
      this.world.audioManager.walking_sound.play();
      this.sleepAnimationPlayed = false;
    }
  }

  handleJump() {
    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
      this.sleepAnimationPlayed = false;
    }
  }

  updateCameraPosition() {
    this.world.camera_x = -this.x + 100;
  }

  animateDead() {
    setInterval(() => {
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
      }
    }, 100);
  }

  animateSleep() {
    let sleepAnimationIndex = 0;
    setInterval(() => {
      if (this.isSleep()) {
        if (!this.sleepAnimationPlayed) {
          let path = this.IMAGES_SLEEP[sleepAnimationIndex];
          this.img = this.imageCache[path];
          sleepAnimationIndex++;
          if (sleepAnimationIndex >= this.IMAGES_SLEEP.length) {
            this.sleepAnimationPlayed = true;
            sleepAnimationIndex = 0;
          }
        }
      }
    }, 400);
  }

  animateLongSleep() {
    setInterval(() => {
      if (this.isSleep() && this.sleepAnimationPlayed) {
        this.playAnimation(this.IMAGES_LONG_SLEEP);
        this.world.audioManager.snoreSound.play();
      }
    }, 200);
  }

  animateHurt() {
    setInterval(() => {
      if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      }
    }, 100);
  }

  animateJump() {
    setInterval(() => {
      if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      }
    }, 130);
  }

  animateWalk() {
    setInterval(() => {
      if (
        !this.isDead() &&
        !this.isSleep() &&
        !this.isHurt() &&
        !this.isAboveGround()
      ) {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
          this.playAnimation(this.IMAGES_WALKING);
        } else {
          this.loadImage(this.IMAGES_JUMPING[0]);
        }
      }
    }, 80);
  }

  hit() {
    this.energy -= 20;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
      this.world.audioManager.hurtSound.play();
    }
  }

  jump() {
    this.world.audioManager.jumpSound.play();
    this.speedY = 32;
    this.lastMoved = new Date().getTime(); // Aktualisiere die Zeit der letzten Bewegung
  }

  bounceOff() {
    this.speedY = 23;
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  isDead() {
    if (this.energy == 0) {
      this.world.loseGame();
      return true;
    }
    return false;
  }

  isSleep() {
    let timepassed = new Date().getTime() - this.lastMoved;
    timepassed = timepassed / 1000;
    return timepassed > 3;
  }

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;

        if (this.y > 135) {
          this.y = 135;
          this.speedY = 0;
        }
      }
    }, 1000 / 25);
  }
}
