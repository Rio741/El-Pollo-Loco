class Coin extends MovableObject {
  height = 120;
  width = 120;
  IMAGES_COIN = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];
  currentImage = 0;
  
  constructor(x, y) {
    super();
    this.loadImage("img/8_coin/coin_1.png");
    this.loadImages(this.IMAGES_COIN);
    this.x = x;
    this.y = y;
  }

  animate() {
    super.animate(this.IMAGES_COIN);
  }

  handleCollision(world, index) {
    world.character.incrementCoinCount();
    let coinPercentage =
      (world.character.collectedCoins / world.level.totalCoins) * 100;
    world.coinStatusBar.setPercentage(coinPercentage);
    world.level.items.splice(index, 1);
    let coinSound = new Audio("audio/coin.mp3");
    coinSound.play();
    if (world.audioManager.backgroundMusic.muted) {
      coinSound.muted = true;
    }
  }
}
