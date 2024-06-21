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
  canCollideWithEnemy = true; // Flagge, um Kollisionen zu steuern

  jumpOnSound = new Audio("audio/jump-on.mp3");
  bottleSound = new Audio("audio/bottle.mp3");

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
      this.checkThrowableCollisions(); // Hinzufügen der Kollisionsprüfung für die geworfenen Objekte
      this.checkJumpOnEnemies(); // Neue Methode zum Überprüfen von Sprüngen auf Gegner
      this.checkEndbossStartWalking(); // Überprüfen, ob der Endboss anfangen soll zu laufen
    }, 40);

    setInterval(() => {
      this.checkThrowObjects();
    }, 200); // Alle 200 Millisekunden

    setInterval(() => {
      const endboss = this.level.enemies.find(
        (enemy) => enemy instanceof Endboss
      );
      if (endboss && endboss.walking && !endboss.attackAnimationInterval) {
        endboss.startAttackAnimation();
      }
    }, 4000); // Alle 5000 Millisekunden (5 Sekunden)
  }

  checkEndbossStartWalking() {
    if (this.character.x >= 2970) {
      const endboss = this.level.enemies.find(
        (enemy) => enemy instanceof Endboss
      );
      if (endboss && !endboss.walking) {
        endboss.startWalking();
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
          enemy.die(); // Gegner stirbt, wenn der Charakter auf ihn springt
          this.character.bounceOff(); // Charakter springt ab
          this.jumpOnSound.play();
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
              enemy.energy -= 20; // Beispiel: Endboss verliert 20 Energie pro Treffer
              enemy.hurt(); // Hurt-Animation abspielen
              if (enemy.energy < 0) enemy.energy = 0;
              this.updateEndbossStatusBar(); // Statusleiste aktualisieren
              if (enemy.energy <= 0 && !enemy.isEnemyDead) {
                enemy.die(); // Endboss stirbt, wenn Energie auf 0 fällt
              }
            } else {
              enemy.die(); // Normale Gegner sterben sofort
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
    throwableObject.world = this; // Referenz zur Welt setzen
    this.throwableObjects.push(throwableObject);
  }

  // In der Methode, die die Kollisionen überprüft (z.B. checkEnemyCollisions())
  checkEnemyCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.canCollideWithEnemy && this.character.isColliding(enemy)) {
        if (this.character.isJumpingOn(enemy) && !(enemy instanceof Endboss)) {
          enemy.die(); // Gegner stirbt, wenn der Charakter auf ihn springt
          this.character.bounceOff(); // Charakter springt ab
        } else {
          if (enemy instanceof Endboss) {
            this.character.energy = 0; // Setze die Energie des Charakters auf 0
            this.healthStatusBar.setPercentage(0); // Setze die StatusBar auf 0
            this.character.isDead(); // Überprüfe, ob der Charakter tot ist
            // Führe hier weitere Aktionen aus, um den Tod des Charakters zu behandeln
          } else {
            this.character.hit(); // Charakter nimmt Schaden
            this.healthStatusBar.setPercentage(this.character.energy); // Aktualisiere die StatusBar
          }
        }
        this.canCollideWithEnemy = false; // Kollisionen für eine Sekunde sperren
        setTimeout(() => {
          this.canCollideWithEnemy = true;
        }, 1000); // Nach 1 Sekunde können wieder Kollisionen erkannt werden
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
    this.character.energy = 0; // Setze die Energie des Charakters auf 0
    this.character.isDead(); // Überprüfe, ob der Charakter tot ist
    this.healthStatusBar.setPercentage(this.character.energy); // Aktualisiere die Lebensanzeige
    const endboss = this.level.enemies.find(
      (enemy) => enemy instanceof Endboss
    );
    if (endboss && !endboss.isDead) {
      endboss.startAttackAnimation(); // Starte die Angriffsanimation des Endbosses
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
    this.level.items.splice(index, 1); // Entferne die Münze
    const coinSound = new Audio("audio/coin.mp3");
    coinSound.play(); // Spiele den Coin-Sound ab
  }

  collectBottle(index) {
    if (this.character.collectedBottles < 5) {
      this.character.incrementBottleCount();
      let bottlePercentage = this.character.collectedBottles * 20; // Umrechnung auf Prozentwert (5 Flaschen max)
      this.bottleStatusBar.setPercentage(bottlePercentage);
      this.level.items.splice(index, 1); // Entferne die Flasche
      this.bottleSound.play(); // Spiele den Coin-Sound ab
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
