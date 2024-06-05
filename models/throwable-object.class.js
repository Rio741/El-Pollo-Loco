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
    super().loadImage(
      "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png"
    );
    this.loadImages(this.BOTTLE_ROTATION_IMAGES);
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.height = 60;
    this.width = 60;
    this.isUsed = false; // Markierung, ob die Flasche bereits eine Kollision verursacht hat
    this.throw();
  }

  throw() {
    this.speedY = 25;
    this.applyGravity();
    setInterval(() => {
      if (this.direction === "right") {
        this.x += 5;
      } else {
        this.x -= 5;
      }
    }, 25);
    this.animateThrowingBottle();
  }

  animateThrowingBottle() {
    setInterval(() => {
      this.playAnimation(this.BOTTLE_ROTATION_IMAGES);
    }, 100);
  }

  markAsUsed() {
    this.isUsed = true;
  }
}
