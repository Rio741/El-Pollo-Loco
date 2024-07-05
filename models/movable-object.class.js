class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection;
  speedY = 0;
  acceleration = 3.2;
  energy = 100;
  collectedCoins = 0;
  collectedBottles = 0;
  lastHit = 0;
  isEnemyDead;

 animate(images, interval = 700) {
    this.world.addInterval(setInterval(() => {
      this.playAnimation(images);
    }, interval));
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return this.y < 340;
    } else { //character
      return this.y < 135;
    }
  }

  isColliding(mo) {
    if (this instanceof Character) {
      return (
        this.x + 25 < mo.x + mo.width &&
        this.x + this.width - 35 > mo.x &&
        this.y + 145 < mo.y + mo.height &&
        this.y + this.height + 13 > mo.y
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
    } else if (this instanceof Endboss) {
      return (
        this.x + 40 < mo.x + mo.width &&
        this.x + this.width - 50 > mo.x &&
        this.y + 80 < mo.y + mo.height &&
        this.y + this.height - 130 > mo.y
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

  incrementCoinCount() {
    this.collectedCoins++;
  }

  incrementBottleCount() {
    this.collectedBottles++;
    if (this.collectedBottles > 5) {
      this.collectedBottles = 5;
    }
  }

  /*playAnimation(images, playOnce = false) {
    if (playOnce) {
      if (this.currentImage < images.length) {
        let path = images[this.currentImage];
        this.img = this.imageCache[path];
        this.currentImage++;
      } else {
        this.currentImage = images.length - 1;
      }
    } else {
      let i = this.currentImage % images.length;
      let path = images[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }
  }*/

  playAnimation(images, playOnce = false) {
    if (playOnce) {
      this.currentImage = Math.min(this.currentImage, images.length - 1);
    } else {
      this.currentImage = this.currentImage % images.length;
    }
    let path = images[this.currentImage];
    this.img = this.imageCache[path];
    this.currentImage++;
  }
    
  moveRight() {
    this.x += this.speed;
    this.lastMoved = new Date().getTime();
  }

  moveLeft() {
    this.x -= this.speed;
    this.lastMoved = new Date().getTime();
  }

  isJumpingOn(mo) {
    return (
      this.speedY < 0 &&
      this.y + this.height >= mo.y &&
      this.y + this.height <= mo.y + mo.height
    );
  }
}
