class Level {
  enemies;
  items;
  clouds;
  backgroundObjects;
  level_end_x = 2200;

  constructor(enemies, items, clouds, backgroundObjects) {
    this.enemies = enemies;
    this.items = items;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
  }
}