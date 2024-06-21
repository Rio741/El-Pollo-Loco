let level1;
function initLevel() {
  level1 = new Level(
    [
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new BabyChicken(),
      new BabyChicken(),
      new BabyChicken(),
      new Endboss(),
    ],
    [
      new Coin(350, 330),
      new Coin(400, 160),
      new Coin(480, 160),
      new Coin(560, 160),
      new Coin(1070, 180),
      new Coin(1130, 140),
      new Coin(1200, 100),
      new Coin(1270, 140),
      new Coin(1340, 180),
      new Coin(1600, 330),
      new Coin(1700, 330),
      new Bottle(1458, 340),
      new Bottle(731, 299),
      new Bottle(2025, 189),
      new Bottle(1045, 340),
      new Bottle(1672, 156),
      new Bottle(493, 214),
    ],
    [
      new Cloud("img/5_background/layers/4_clouds/1.png", 0),
      new Cloud("img/5_background/layers/4_clouds/2.png", 720),
      new Cloud("img/5_background/layers/4_clouds/1.png", 1440),
      new Cloud("img/5_background/layers/4_clouds/2.png", 2160),
      new Cloud("img/5_background/layers/4_clouds/2.png", 2880),
    ],
    [
      new BackgroundObject("img/5_background/layers/air.png", -719),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -719),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/2.png",
        -719
      ),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -719),
      new BackgroundObject("img/5_background/layers/air.png", 0),
      new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/air.png", 719),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719),
      new BackgroundObject("img/5_background/layers/air.png", 719 * 2),
      new BackgroundObject(
        "img/5_background/layers/3_third_layer/1.png",
        719 * 2
      ),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/1.png",
        719 * 2
      ),
      new BackgroundObject(
        "img/5_background/layers/1_first_layer/1.png",
        719 * 2
      ),
      new BackgroundObject("img/5_background/layers/air.png", 719 * 3),
      new BackgroundObject(
        "img/5_background/layers/3_third_layer/2.png",
        719 * 3
      ),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/2.png",
        719 * 3
      ),
      new BackgroundObject(
        "img/5_background/layers/1_first_layer/2.png",
        719 * 3
      ),
      new BackgroundObject("img/5_background/layers/air.png", 719 * 4),
      new BackgroundObject(
        "img/5_background/layers/3_third_layer/1.png",
        719 * 4
      ),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/1.png",
        719 * 4
      ),
      new BackgroundObject(
        "img/5_background/layers/1_first_layer/1.png",
        719 * 4
      ),

      new BackgroundObject("img/5_background/layers/air.png", 719 * 5),
      new BackgroundObject(
        "img/5_background/layers/3_third_layer/2.png",
        719 * 5
      ),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/2.png",
        719 * 5
      ),
      new BackgroundObject(
        "img/5_background/layers/1_first_layer/2.png",
        719 * 5
      ),
    ]
  );
}
