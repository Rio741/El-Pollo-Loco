class Level {
  enemies;
  items;
  clouds;
  backgroundObjects;
  level_end_x = 2200;
  totalCoins;

  constructor(enemies, items, clouds, backgroundObjects) {
    this.enemies = enemies;
    this.items = items;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.totalCoins = items.filter((item) => item instanceof Coin).length;
  }
}
