class World {
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
  audioManager = new AudioManager();
  lastThrowTime = 0;
  allIntervals = [];
  character;
  gameOver = false;
  gameWon = false;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.character = new Character(this); 
    this.draw();
    this.setWorld();
    this.run();
    this.audioManager.playBackgroundMusic();
  }

  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
      if (enemy instanceof Chicken || enemy instanceof BabyChicken) {
        enemy.animate();
      } else if (enemy instanceof Endboss) {
        enemy.animateAlert();
      }
    });
  
    this.level.clouds.forEach((cloud) => {
      cloud.world = this;
      cloud.animate();
    });

    this.level.items.forEach((item) => {
      item.world = this;
      if (item instanceof Coin || item instanceof Bottle) {
        item.animate();
      }
    });
  }
  
  loseGame() {
    if (!this.gameOver) {
      this.gameOver = true;
      this.clearAllIntervals();
      setTimeout(() => {
        let gameOverImg = document.getElementById("game-over-img");
        gameOverImg.style.display = "flex";
        this.audioManager.setAllSoundsMuted(true);
        this.audioManager.gameOverSound.muted = false;
        this.audioManager.gameOverSound.play(); 
        this.showHomeButton();
      }, 1000);
    }
  }

  winGame() {
    if (!this.gameWon) {
      this.gameWon = true;
      this.clearAllIntervals();
      let winImg = document.getElementById("win-img");
      winImg.style.display = "flex";
      this.audioManager.setAllSoundsMuted(true);
      this.audioManager.winSound.muted = false;
      this.audioManager.winSound.play();
      this.showHomeButton();
    }
  }

  showHomeButton() {
    let homeBtn = document.getElementById("home-btn");
    homeBtn.style.display = "block";
  }
  
  run() {
    this.allIntervals.push(setInterval(() => {
      this.checkEnemyCollisions();
      this.checkThrowableCollisions();
      this.checkJumpOnEnemies();
      this.checkItemCollisions();
    }, 40));

    this.allIntervals.push(setInterval(() => {
      this.checkThrowObjects();
      this.checkEndbossStartWalking();
      
    }, 200));

    this.allIntervals.push(setInterval(() => {
      const endboss = this.level.enemies.find(
        (enemy) => enemy instanceof Endboss
      );
      if (endboss && endboss.walking && !endboss.attackAnimationInterval) {
        endboss.startAttackAnimation();
      }
    }, 6000));
  }

  addInterval(intervalId) {
    this.allIntervals.push(intervalId);
  }

  clearAllIntervals() {
    this.allIntervals.forEach(clearInterval);
    this.allIntervals = [];
  }
  
  checkEndbossStartWalking() {
    if (this.character.x >= 3150) {
      const endboss = this.level.enemies.find(
        (enemy) => enemy instanceof Endboss
      );
      if (endboss && !endboss.walking) {
        endboss.startWalking();
        endboss.canTakeDamage = true; 
        this.audioManager.switchToEndbossMusic();
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
    const now = Date.now();
    if (
      this.keyboard.D &&
      this.character.collectedBottles > 0 &&
      now - this.lastThrowTime >= 700
    ) {
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
      this.lastThrowTime = now;
      this.character.sleepAnimationPlayed = false
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
              if (enemy.canTakeDamage) {
                enemy.energy -= 20;
                enemy.hurt();
                if (enemy.energy < 0) enemy.energy = 0;
                this.updateEndbossStatusBar();
                if (enemy.energy <= 0 && !enemy.isEnemyDead) {
                  enemy.die();
                }
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
        if (!enemy.isEnemyDead) {
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
    if (world.audioManager.backgroundMusic.muted) {
      coinSound.muted = true;
    }
  }

  collectBottle(index) {
    if (this.character.collectedBottles < 5) {
      this.character.incrementBottleCount();
      let bottlePercentage = this.character.collectedBottles * 20;
      this.bottleStatusBar.setPercentage(bottlePercentage);
      this.level.items.splice(index, 1);
      this.audioManager.bottleSound.play();
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
