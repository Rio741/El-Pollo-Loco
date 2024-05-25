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

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.checkCollisions();
  }

  setWorld() {
    this.character.world = this;
  }

  checkCollisions() {
    setInterval(() => {
      // Überprüfung der Kollisionen mit Feinden
      this.level.enemies.forEach((enemy) => {
        if (this.character.isColliding(enemy)) {
          this.character.hit();
          this.healthStatusBar.setPercentage(this.character.energy);
        }
      });

      // Überprüfung der Kollisionen mit Gegenständen
      this.level.items.forEach((item, index) => {
        if (this.character.isColliding(item)) {
          if (item instanceof Coin) {
            this.character.collectCoin();
            let coinPercentage =
              (this.character.collectedCoins / this.level.totalCoins) * 100;
            this.coinStatusBar.setPercentage(coinPercentage);
            this.level.items.splice(index, 1); // Entferne die Münze
          } else if (item instanceof Bottle) {
            this.character.collectBottle();
            this.bottleStatusBar.setPercentage(this.character.collectedBottles);
            this.level.items.splice(index, 1);
          }
        }
      });
    }, 200);
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
