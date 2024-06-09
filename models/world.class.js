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

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
  }

  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => (enemy.world = this)); // Weisen Sie allen Feinden die Welt zu
  }

  run() {
    setInterval(() => {
      this.checkEnemyCollisions();
      this.checkItemCollisions();
      this.checkThrowObjects();
      this.checkThrowableCollisions(); // Hinzufügen der Kollisionsprüfung für die geworfenen Objekte
      this.checkJumpOnEnemies(); // Neue Methode zum Überprüfen von Sprüngen auf Gegner
    }, 50);
  }

  checkJumpOnEnemies() {
    this.level.enemies.forEach((enemy) => {
      if (
        this.character.isCharacterColliding(enemy) &&
        this.character.isJumpingOn(enemy)
      ) {
        enemy.die();
        this.character.bounceOff(); // Neue Methode, um dem Charakter einen kleinen Aufprall-Effekt zu geben
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
      let bottlePercentage = (this.character.collectedBottles / 5) * 100;
      this.character.collectedBottles--;
      this.bottleStatusBar.setPercentage(bottlePercentage);
    }
  }

  checkThrowableCollisions() {
    this.throwableObjects.forEach((bottle) => {
      if (!bottle.isUsed) {
        // Nur nicht verwendete Flaschen überprüfen
        this.level.enemies.forEach((enemy) => {
          if (bottle.isColliding(enemy)) {
            if (enemy instanceof Chicken || enemy instanceof BabyChicken) {
              enemy.die();
              bottle.markAsUsed();
            }
          }
        });
      }
    });
  }

  checkEnemyCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isCharacterColliding(enemy)) {
        this.handleEnemyCollision();
      }
    });
  }

  checkItemCollisions() {
    this.level.items.forEach((item, index) => {
      if (this.character.isCharacterColliding(item)) {
        this.handleItemCollision(item, index);
      }
    });
  }

  handleEnemyCollision() {
    this.character.hit();
    this.healthStatusBar.setPercentage(this.character.energy);
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
    this.level.items.splice(index, 1); // Entferne die Münze
  }

  collectBottle(index) {
    if (this.character.collectedBottles < 5) {
      this.character.incrementBottleCount();
      let bottlePercentage = this.character.collectedBottles * 21; // Umrechnung auf Prozentwert (5 Flaschen max)
      this.bottleStatusBar.setPercentage(bottlePercentage);
      this.level.items.splice(index, 1); // Entferne die Flasche
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
    mo.drawFrame(this.ctx);

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
