class ThrowableObject extends MovableObject {
  BOTTLE_ROTATION_IMAGES = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  BOTTLE_SPLASHING_IMAGES = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  constructor(x, y, direction) {
    super().loadImage(this.BOTTLE_ROTATION_IMAGES[0]);
    this.loadImages(this.BOTTLE_ROTATION_IMAGES);
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.world = world;
    this.height = 70;
    this.width = 70; 
    this.isUsed = false;
    this.throwInterval = null;
    this.throw();
  }

  applyBottleGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      } else {
        this.onGround();
      }
    }, 1000 / 25);
  }

  throw() {
    this.speedY = 30;
    this.applyBottleGravity();
    this.throwSound = this.createAudio("audio/spin.mp3");
    this.throwInterval = setInterval(() => {
      this.x += this.direction === "right" ? 9 : -9;
    }, 25);
    this.animateThrowingBottle();
  }

  animateThrowingBottle() {
    const intervalId = setInterval(() => {
      if (this.isUsed) {
        clearInterval(intervalId);
        this.animateSplashingBottle();
      } else {
        this.playAnimation(this.BOTTLE_ROTATION_IMAGES);
      }
    }, 100);
  }

  remove() {
    this.world.removeObject(this);
  }

  animateSplashingBottle() {
    this.prepareForSplash();
    this.playSplashAnimation();
  }

  prepareForSplash() {
    this.pauseSound(this.throwSound);
    this.splashSound = this.createAudio("audio/splash.mp3");
    clearInterval(this.throwInterval);
    this.throwInterval = null;
    this.loadImages(this.BOTTLE_SPLASHING_IMAGES);
  }

  playSplashAnimation() {
    let currentFrame = 0;
    const totalFrames = this.BOTTLE_SPLASHING_IMAGES.length;

    const intervalId = setInterval(() => {
      if (currentFrame >= totalFrames) {
        clearInterval(intervalId);
        this.remove();
      } else {
        this.playAnimationFrame(this.BOTTLE_SPLASHING_IMAGES[currentFrame]);
        currentFrame++;
      }
    }, 100);
  }

  playAnimationFrame(imagePath) {
    this.img = this.imageCache[imagePath];
  }

  onGround() {
    if (!this.isUsed) {
      this.markAsUsed();
    }
  }

  markAsUsed() {
    this.isUsed = true;
  }

  createAudio(src) {
    const audio = new Audio(src);
    if (this.world.audioManager.backgroundMusic.muted) {
      audio.muted = true;
    }
    audio.play();
    return audio;
  }

  playSound(sound) {
    if (sound.paused) {
      sound.play();
    }
  }

  pauseSound(sound) {
    if (!sound.paused) {
      sound.pause();
      sound.currentTime = 0;
    }
  }
}




/*class ThrowableObject extends MovableObject {
  BOTTLE_ROTATION_IMAGES = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  BOTTLE_SPLASHING_IMAGES = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  constructor(x, y, direction) {
    super().loadImage(
      "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png"
    );
    this.loadImages(this.BOTTLE_ROTATION_IMAGES);
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.world = world;
    this.height = 70;
    this.width = 70;
    this.isUsed = false;
    this.throwInterval = null;
    this.throw();
  }

  applyBottleGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      } else {
        this.onGround();
      }
    }, 1000 / 25);
  }

  throw() {
    this.speedY = 30;
    this.applyBottleGravity();
    let throwSound = new Audio("audio/spin.mp3");
    this.playSound(throwSound);
    if (this.world.audioManager.backgroundMusic.muted) {
      throwSound.muted = true;
    }
    this.throwInterval = setInterval(() => {
      if (this.direction === "right") {
        this.x += 9;
      } else {
        this.x -= 9;
      }
    }, 25);
    this.animateThrowingBottle(throwSound);
  }

  animateThrowingBottle(throwSound) {
    const intervalId = setInterval(() => {
      if (this.isUsed) {
        clearInterval(intervalId);
        this.animateSplashingBottle(throwSound);
      } else {
        this.playAnimation(this.BOTTLE_ROTATION_IMAGES);
      }
    }, 100);
  }

  remove() {
    this.world.removeObject(this);
  }

  animateSplashingBottle(throwSound) {
    this.prepareForSplash(throwSound);
    this.playSplashAnimation();
  }

  prepareForSplash(throwSound) {
    if (!throwSound) {
      throwSound = new Audio("audio/spin-l.mp3");
    }
    this.pauseSound(throwSound);

    if (!this.splashSound || this.splashSound.paused) {
      this.splashSound = new Audio("audio/splash.mp3");
      this.playSound(this.splashSound);
      if (this.world.audioManager.backgroundMusic.muted) {
        this.splashSound.muted = true;
      }
    }
    clearInterval(this.throwInterval);
    this.throwInterval = null;
    this.loadImages(this.BOTTLE_SPLASHING_IMAGES);
  }

  playSplashAnimation() {
    const animationInterval = 100;
    let currentFrame = 0;
    const totalFrames = this.BOTTLE_SPLASHING_IMAGES.length;

    const intervalId = setInterval(() => {
      if (currentFrame >= totalFrames) {
        clearInterval(intervalId);
        this.remove();
      } else {
        this.playAnimationFrame(this.BOTTLE_SPLASHING_IMAGES[currentFrame]);
        currentFrame++;
      }
    }, animationInterval);
  }

  playAnimationFrame(imagePath) {
    this.img = this.imageCache[imagePath];
  }

  onGround() {
    if (!this.isUsed) {
      this.markAsUsed();
      this.animateSplashingBottle();
    }
  }

  markAsUsed() {
    this.isUsed = true;
  }

  playSound(sound) {
    if (sound.paused) {
      sound.play()
    }
  }

  pauseSound(sound) {
    if (!sound.paused) {
      sound.pause();
      sound.currentTime = 0;
    }
  }
}*/
