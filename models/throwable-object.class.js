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

  throwSound = new Audio("audio/spin-l.mp3");
  splashSound = new Audio("audio/splash.mp3");

  constructor(x, y, direction) {
    super().loadImage(
      "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png"
    );
    this.loadImages(this.BOTTLE_ROTATION_IMAGES);
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.world = world; // Referenz auf die Welt hinzufügen
    this.height = 70;
    this.width = 70;
    this.isUsed = false; // Markierung, ob die Flasche bereits eine Kollision verursacht hat
    this.throwInterval = null;
    this.throw();
  }

  throw() {
    this.speedY = 30;
    this.applyGravity();
    this.throwSound.play(); // Sound beim Werfen abspielen
    this.throwInterval = setInterval(() => {
      if (this.direction === "right") {
        this.x += 9;
      } else {
        this.x -= 9;
      }
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
    this.world.removeObject(this); // Entferne das Objekt aus der Welt
  }

  animateSplashingBottle() {
    this.throwSound.pause();
    this.splashSound.play(); // Splash-Sound abspielen
    clearInterval(this.throwInterval);
    this.throwInterval = null;
    this.loadImages(this.BOTTLE_SPLASHING_IMAGES);

    // Intervall für die Animation in Millisekunden festlegen (hier 100ms)
    const animationInterval = 100;
    let currentFrame = 0;
    const totalFrames = this.BOTTLE_SPLASHING_IMAGES.length;

    const intervalId = setInterval(() => {
      if (currentFrame >= totalFrames) {
        clearInterval(intervalId);
        this.remove(); // Entferne das Objekt nach der Splash-Animation
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
}
