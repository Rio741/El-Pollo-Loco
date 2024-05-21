class MovableObject {
  x = 120;
  y = 280;
  img;
  height = 150;
  width = 100;
  speed = 0.15;
  imageCache = {};
  otherDirection;
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  moveRight() {}
  moveLeft() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60); // Ändere die x-Koordinate, um die Wolke nach links zu bewegen
  }
}
