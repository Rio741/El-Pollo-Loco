class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  x = 120;
  y = 280;
  height = 150;
  width = 100;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrame(ctx) {
    if (this instanceof Character) {
      this.drawCharacterFrame(ctx);
    } /* else if (this instanceof Bottle) {
      this.drawBottleFrame(ctx);
    } else if (this instanceof Coin) {
      this.drawCoinFrame(ctx);
    }*/ else if (
      this instanceof Chicken ||
      this instanceof BabyChicken ||
      this instanceof Endboss
    ) {
      this.drawEnemyFrame(ctx);
    }
  }

  drawCharacterFrame(ctx) {
    ctx.beginPath();
    ctx.lineWidth = "3";
    ctx.strokeStyle = "blue";
    ctx.rect(this.x + 25, this.y + 110, this.width - 35, this.height - 120);
    ctx.stroke();
  }
  /*
  drawBottleFrame(ctx) {
    ctx.beginPath();
    ctx.lineWidth = "3";
    ctx.strokeStyle = "green";
    ctx.rect(this.x + 20, this.y + 10, this.width - 30, this.height - 15);
    ctx.stroke();
  }

  drawCoinFrame(ctx) {
    ctx.beginPath();
    ctx.lineWidth = "3";
    ctx.strokeStyle = "yellow";
    ctx.rect(this.x + 40, this.y + 40, this.width - 80, this.height - 80);
    ctx.stroke();
  }
*/
  drawEnemyFrame(ctx) {
    ctx.beginPath();
    ctx.lineWidth = "3";
    ctx.strokeStyle = "red";
    ctx.rect(this.x + 5, this.y, this.width - 10, this.height - 10);
    ctx.stroke();
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
