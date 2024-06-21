class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection;
  speedY = 0;
  acceleration = 3.2;
  energy = 100;
  collectedCoins = 0;
  collectedBottles = 0;
  lastHit = 0;
  sleepAnimationPlayed = false;
  isEnemyDead;

  // NUR FLASCHEN !!!
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      } else {
        this.onGround();
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

  hit() {
    this.energy -= 20;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
      this.hurtSound.play(); // Sound beim Treffer abspielen
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
    if (this.energy == 0) {
      this.endGame(); // Beende das Spiel
      return true;
    }
    return false;
  }
  endGame() {
    // Stoppe alle Intervalle
    let highestIntervalId = setInterval(() => {}, 10000);
    for (let i = 0; i < highestIntervalId; i++) {
      clearInterval(i);
    }

    // Pausiere alle Töne
    let sounds = document.querySelectorAll("audio");
    sounds.forEach((sound) => {
      sound.pause();
      this.walking_sound.pause();
      sound.currentTime = 0; // Setze den Ton zurück
    });

    // Füge das Game Over-Bild hinzu
    const gameOverImg = document.createElement("img");
    gameOverImg.src = "img/9_intro_outro_screens/game_over/game over.png";
    gameOverImg.id = "game-over-img";
    document.body.appendChild(gameOverImg);
  }

  isSleep() {
    let timepassed = new Date().getTime() - this.lastMoved;
    timepassed = timepassed / 1000;
    return timepassed > 3;
  }

  playAnimation(images, playOnce = false) {
    if (playOnce) {
      if (this.currentImage < images.length) {
        let path = images[this.currentImage];
        this.img = this.imageCache[path];
        this.currentImage++;
      } else {
        this.currentImage = images.length - 1; // Stop at the last image
      }
    } else {
      let i = this.currentImage % images.length;
      let path = images[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }
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
    this.jumpSound.play();
    this.speedY = 32;
    this.lastMoved = new Date().getTime(); // Aktualisiere die Zeit der letzten Bewegung
  }

  isJumpingOn(mo) {
    return (
      this.speedY < 0 && // Der Charakter fällt gerade nach unten
      this.y + this.height >= mo.y && // Der Charakter ist unterhalb oder auf der Höhe des Feindes
      this.y + this.height <= mo.y + mo.height // Der Charakter ist oberhalb des Feindes
    );
  }

  bounceOff() {
    this.speedY = 23; // Der Charakter springt leicht ab, wenn er auf einen Feind trifft
  }
}
