class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  bottleStatusBar = new StatusBar(StatusBar.BOTTLE_IMAGES, 10, 0);
  healthStatusBar = new StatusBar(StatusBar.HEALTH_IMAGES, 10, 35);
  coinStatusBar = new StatusBar(StatusBar.COIN_IMAGES, 10, 70);
  endbossStatusBar = new StatusBar(StatusBar.ENDBOSS_IMAGES, 540, 10);
  throwableObjects = [];
  canCollideWithEnemy = true;

  bottleSound = new Audio("audio/bottle.mp3");

  backgroundMusic = new Audio("audio/background.mp3");
  endbossMusic = new Audio("audio/background-endboss.mp3");
  gunshotSound = new Audio("audio/gunshot.mp3");
  endbossSound = new Audio("audio/endboss.mp3");

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
    this.playBackgroundMusic();
  }

  playBackgroundMusic() {
    this.backgroundMusic.loop = true;
    this.backgroundMusic.play();
  }

  switchToEndbossMusic() {
    this.backgroundMusic.pause();
    this.endbossMusic.loop = true;
    this.gunshotSound.play();
    this.endbossMusic.play();
    this.endbossSound.play();
  }

  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => (enemy.world = this));
  }

  run() {
    setInterval(() => {
      this.checkEnemyCollisions();
      this.checkItemCollisions();
      this.checkThrowableCollisions();
      this.checkJumpOnEnemies();
      this.checkEndbossStartWalking();
    }, 40);

    setInterval(() => {
      this.checkThrowObjects();
    }, 200);

    setInterval(() => {
      const endboss = this.level.enemies.find(
        (enemy) => enemy instanceof Endboss
      );
      if (endboss && endboss.walking && !endboss.attackAnimationInterval) {
        endboss.startAttackAnimation();
      }
    }, 4000);
  }

  checkEndbossStartWalking() {
    if (this.character.x >= 2970) {
      const endboss = this.level.enemies.find(
        (enemy) => enemy instanceof Endboss
      );
      if (endboss && !endboss.walking) {
        endboss.startWalking();
        this.switchToEndbossMusic();
      }
    }
  }

  checkJumpOnEnemies() {
    this.level.enemies.forEach((enemy) => {
      if (
        this.character.isColliding(enemy) &&
        this.character.isJumpingOn(enemy)
      ) {
        if (!(enemy instanceof Endboss) && !enemy.isEnemyDead) {
          enemy.die();
          this.character.bounceOff();
        }
      }
    });
  }

  checkThrowObjects() {
    if (this.keyboard.D && this.character.collectedBottles > 0) {
      let bottleDirection = this.character.otherDirection ? "left" : "right";
      let bottle = new ThrowableObject(
        this.character.x + (bottleDirection === "right" ? 100 : -40),
        this.character.y + 100,
        bottleDirection
      );
      this.throwableObjects.push(bottle);
      let bottlePercentage = (this.character.collectedBottles / 6) * 100;
      this.character.collectedBottles--;
      this.bottleStatusBar.setPercentage(bottlePercentage);
    }
  }

  updateEndbossStatusBar() {
    let endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
    if (endboss) {
      let endbossHealthPercentage = (endboss.energy / endboss.maxEnergy) * 100;
      this.endbossStatusBar.setPercentage(endbossHealthPercentage);
    }
  }
  checkThrowableCollisions() {
    this.throwableObjects.forEach((bottle) => {
      if (!bottle.isUsed) {
        this.level.enemies.forEach((enemy) => {
          if (bottle.isColliding(enemy)) {
            if (enemy instanceof Endboss) {
              enemy.energy -= 20;
              enemy.hurt();
              if (enemy.energy < 0) enemy.energy = 0;
              this.updateEndbossStatusBar();
              if (enemy.energy <= 0 && !enemy.isEnemyDead) {
                enemy.die();
              }
            } else {
              enemy.die();
            }
            bottle.markAsUsed();
          }
        });
      }
    });
  }

  removeObject(object) {
    const index = this.throwableObjects.indexOf(object);
    if (index > -1) {
      this.throwableObjects.splice(index, 1);
    }
  }

  addThrowableObject(throwableObject) {
    throwableObject.world = this;
    this.throwableObjects.push(throwableObject);
  }

  checkEnemyCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.canCollideWithEnemy && this.character.isColliding(enemy)) {
        if (this.character.isJumpingOn(enemy) && !(enemy instanceof Endboss)) {
          enemy.die();
          this.character.bounceOff();
        } else {
          if (enemy instanceof Endboss) {
            this.character.energy = 0;
            this.healthStatusBar.setPercentage(0);
            this.character.isDead();
          } else {
            this.character.hit();
            this.healthStatusBar.setPercentage(this.character.energy);
          }
        }
        this.canCollideWithEnemy = false;
        setTimeout(() => {
          this.canCollideWithEnemy = true;
        }, 1000);
      }
    });
  }

  checkItemCollisions() {
    this.level.items.forEach((item, index) => {
      if (this.character.isColliding(item)) {
        this.handleItemCollision(item, index);
      }
    });
  }

  handleEnemyCollision() {
    this.character.energy = 0;
    this.character.isDead();
    this.healthStatusBar.setPercentage(this.character.energy);
    const endboss = this.level.enemies.find(
      (enemy) => enemy instanceof Endboss
    );
    if (endboss && !endboss.isDead) {
      endboss.startAttackAnimation();
    }
  }

  handleItemCollision(item, index) {
    if (item instanceof Coin) {
      this.collectCoin(index);
    } else if (item instanceof Bottle) {
      this.collectBottle(index);
    }
  }

  collectCoin(index) {
    this.character.incrementCoinCount();
    let coinPercentage =
      (this.character.collectedCoins / this.level.totalCoins) * 100;
    this.coinStatusBar.setPercentage(coinPercentage);
    this.level.items.splice(index, 1);

    let coinSound = new Audio("audio/coin.mp3");
    coinSound.play();
  }

  collectBottle(index) {
    if (this.character.collectedBottles < 5) {
      this.character.incrementBottleCount();
      let bottlePercentage = this.character.collectedBottles * 20;
      this.bottleStatusBar.setPercentage(bottlePercentage);
      this.level.items.splice(index, 1);
      this.bottleSound.play();
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.drawObjects(this.level.backgroundObjects);
    this.addToMap(this.character);
    this.drawObjects(this.level.enemies);
    this.drawObjects(this.level.items);
    this.drawObjects(this.level.clouds);
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.bottleStatusBar);
    this.addToMap(this.healthStatusBar);
    this.addToMap(this.coinStatusBar);
    this.addToMap(this.endbossStatusBar);
    this.ctx.translate(this.camera_x, 0);
    let self = this;
    this.throwableObjects.forEach((obj) => {
      this.addToMap(obj);
    });
    this.ctx.translate(-this.camera_x, 0);
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    // mo.drawFrame(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  drawObjects(objects) {
    objects.forEach((obj) => {
      this.addToMap(obj);
    });
  }
}
