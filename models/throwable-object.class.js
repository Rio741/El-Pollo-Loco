class ThrowableObject extends MovableObject {
  BOTTLE_ROTATION_IMAGES = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  BOTTLE_SPLASHING_IMAGES = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  constructor(x, y, direction) {
    super().loadImage(this.BOTTLE_ROTATION_IMAGES[0]);
    this.loadImages(this.BOTTLE_ROTATION_IMAGES);
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.world = world;
    this.height = 70;
    this.width = 70; 
    this.isUsed = false;
    this.throwInterval = null;
    this.throw();
  }


  /**
   * Applies gravity to the bottle, making it fall until it hits the ground.
   */
  applyBottleGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      } else {
        this.onGround();
      }
    }, 1000 / 25);
  }


  /**
   * Throws the bottle in the specified direction.
   */
   throw() {
    this.speedY = 30;
    this.applyBottleGravity(); 
    this.throwSound = this.createAudio("audio/spin.mp3");
    this.throwInterval = setInterval(() => {
      this.x += this.direction === "right" ? 9 : -9; 
    }, 25);
    this.animateThrowingBottle(); 
  }


  /**
   * Animates the bottle while it is being thrown.
   */
   animateThrowingBottle() {
    const intervalId = setInterval(() => {
      if (this.isUsed) {
        clearInterval(intervalId);
        this.animateSplashingBottle();
      } else {
        this.playAnimation(this.BOTTLE_ROTATION_IMAGES);
      }
    }, 100);
  }


  /**
   * Removes the bottle from the game world.
   */
  remove() {
    this.world.removeObject(this);
  }


  animateSplashingBottle() {
    this.prepareForSplash();
    this.playSplashAnimation();
  }


  /**
   * Prepares the bottle for splashing animation.
   */
  prepareForSplash() {
    this.pauseSound(this.throwSound); 
    this.splashSound = this.createAudio("audio/splash.mp3");
    clearInterval(this.throwInterval);
    this.throwInterval = null;
    this.loadImages(this.BOTTLE_SPLASHING_IMAGES); 
  }


  /**
   * Plays the splashing animation for the bottle.
   */
  playSplashAnimation() {
    let currentFrame = 0;
    const totalFrames = this.BOTTLE_SPLASHING_IMAGES.length;

    const intervalId = setInterval(() => {
      if (currentFrame >= totalFrames) {
        clearInterval(intervalId);
        this.remove();
      } else {
        this.playAnimationFrame(this.BOTTLE_SPLASHING_IMAGES[currentFrame]); // Play each frame of splashing animation
        currentFrame++;
      }
    }, 100);
  }


  /**
   * Plays a single animation frame with the specified image path.
   * @param {string} imagePath - The path of the image to display.
   */
   playAnimationFrame(imagePath) {
    this.img = this.imageCache[imagePath];
  }


  /**
   * Handles the bottle reaching the ground.
   */
  onGround() {
    if (!this.isUsed) {
      this.markAsUsed();
    }
  }


  /**
   * Marks the bottle as used.
   */
  markAsUsed() {
    this.isUsed = true;
  }


  /**
   * Creates an audio element with the specified source and plays it.
   * @param {string} src - The path of the audio file.
   * @returns {HTMLAudioElement} The created audio element.
   */
  createAudio(src) {
    const audio = new Audio(src); 
    if (this.world.audioManager.backgroundMusic.muted) {
      audio.muted = true;
    }
    audio.play();
    return audio;
  }
  

  /**
   * Plays the specified sound if it is paused.
   * @param {HTMLAudioElement} sound - The audio element to play.
   */
   playSound(sound) {
    if (sound.paused) {
      sound.play();
    }
  }

  
  /**
   * Pauses the specified sound if it is playing.
   * @param {HTMLAudioElement} sound - The audio element to pause.
   */
  pauseSound(sound) {
    if (!sound.paused) {
      sound.pause(); 
      sound.currentTime = 0; 
    }
  }
}
