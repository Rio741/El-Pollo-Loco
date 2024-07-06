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

 
  /**
   * Loads a single image into the object.
   * @param {string} path - The path to the image file.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }


  /**
   * Draws the object on the canvas context.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw on.
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }


  /**
   * Loads multiple images into the image cache.
   * @param {string[]} arr - Array of paths to images to load.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }


  /**
   * Animates the object by cycling through the provided images at a specified interval.
   * @param {string[]} images - Array of image paths to animate.
   * @param {number} [interval=700] - Interval between each frame in milliseconds.
   */
  animate(images, interval = 700) {
    this.world.addInterval(setInterval(() => {
      this.playAnimation(images);
    }, interval));
  }


  /**
   * Checks if the object is above the ground level based on its type.
   * @returns {boolean} True if the object is above the ground, false otherwise.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return this.y < 340;
    } else { // Character
      return this.y < 135;
    }
  }


  /**
   * Checks collision between this object and another movable object.
   * @param {MovableObject} mo - The other movable object to check collision with.
   * @returns {boolean} True if collision occurs, false otherwise.
   */
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


  /**
   * Increments the coin count.
   */
  incrementCoinCount() {
    this.collectedCoins++;
  }


  /**
   * Increments the bottle count.
   */
  incrementBottleCount() {
    this.collectedBottles++;
    if (this.collectedBottles > 5) {
      this.collectedBottles = 5;
    }
  }


  /**
   * Plays an animation sequence using the provided images array.
   * @param {string[]} images - Array of image paths to animate.
   * @param {boolean} [playOnce=false] - Flag indicating if the animation should play once.
   */
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


  /**
   * Moves the object to the right.
   */
  moveRight() {
    this.x += this.speed;
    this.lastMoved = new Date().getTime();
  }


  /**
   * Moves the object to the left.
   */
  moveLeft() {
    this.x -= this.speed;
    this.lastMoved = new Date().getTime();
  }

  
  /**
   * Checks if the object is jumping on another movable object.
   * @param {MovableObject} mo - The other movable object to check.
   * @returns {boolean} True if the object is jumping on the other object, false otherwise.
   */
  isJumpingOn(mo) {
    return (
      this.speedY < 0 &&
      this.y + this.height >= mo.y &&
      this.y + this.height <= mo.y + mo.height
    );
  }
}