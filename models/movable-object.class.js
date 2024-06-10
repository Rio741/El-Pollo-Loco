class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection;
  speedY = 0;
  acceleration = 2.4;
  energy = 100;
  collectedCoins = 0;
  collectedBottles = 0;
  lastHit = 0;

  // NUR FLASCHEN !!!
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return this.y < 340; // fuer flasche fallstop
    } else {
      return this.y < 135;
    }
  }

  isColliding(mo) {
    if (this instanceof Character) {
      return (
        this.x + 25 < mo.x + mo.width &&
        this.x + this.width - 35 > mo.x &&
        this.y + 145 < mo.y + mo.height &&
        this.y + this.height + 15 > mo.y
      );
    } else if (this instanceof Bottle) {
      return (
        this.x + 20 < mo.x + mo.width &&
        this.x + this.width - 30 > mo.x &&
        this.y + 10 < mo.y + mo.height &&
        this.y + this.height - 15 > mo.y
      );
    } else if (this instanceof Coin) {
      return (
        this.x + 40 < mo.x + mo.width &&
        this.x + this.width - 80 > mo.x &&
        this.y + 40 < mo.y + mo.height &&
        this.y + this.height - 80 > mo.y
      );
    } else {
      return (
        this.x + 5 < mo.x + mo.width &&
        this.x + this.width - 10 > mo.x &&
        this.y < mo.y + mo.height &&
        this.y + this.height - 10 > mo.y
      );
    }
  }

  /*
  isColliding(mo) {
    return (
      this.x + this.width > mo.x &&
      this.y + this.height > mo.y &&
      this.x < mo.x &&
      this.y < mo.y + mo.height
    );
  }
  */

  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  incrementCoinCount() {
    this.collectedCoins++;
  }

  incrementBottleCount() {
    this.collectedBottles++;
    if (this.collectedBottles > 5) {
      this.collectedBottles = 5; // Maximal 5 Flaschen
    }
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  isDead() {
    return this.energy == 0;
  }

  isSleep() {
    let timepassed = new Date().getTime() - this.lastMoved;
    timepassed = timepassed / 1000;
    return timepassed > 5;
  }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /*playAnimation(images) {
    let i = this.currentImage % images.length;
    if (i < images.length - 1) {
      let path = images[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }
  }
*/

  moveRight() {
    this.x += this.speed;
    this.lastMoved = new Date().getTime(); // Aktualisiere die Zeit der letzten Bewegung
  }

  moveLeft() {
    this.x -= this.speed;
    this.lastMoved = new Date().getTime(); // Aktualisiere die Zeit der letzten Bewegung
  }

  jump() {
    this.speedY = 28;
    this.lastMoved = new Date().getTime(); // Aktualisiere die Zeit der letzten Bewegung
  }

  isJumpingOn(mo) {
    return (
      this.speedY < 0 && // Der Charakter fällt gerade nach unten
      this.y + this.height >= mo.y && // Der Charakter ist im Bereich des Feindes
      this.y + this.height <= mo.y + mo.height / 2
    ); // Der Charakter befindet sich oberhalb der Mitte des Feindes
  }

  bounceOff() {
    this.speedY = 23; // Der Charakter springt leicht ab, wenn er auf einen Feind trifft
  }
}
