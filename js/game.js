let canvas;
let world;
let keyboard = new Keyboard();
let intervalIds = [];
let i = 1;

function setStoppableInterval(fn, time) {
  let id = setInterval(fn, time);
  intervalIds.push(id);
}

//setStoppableInterval(handleRightMovement(), 40);

function stopGame() {
  intervalIds.forEach(clearInterval);
}

console.log(intervalIds);

function init() {}

function startGame() {
  initLevel();
  let canvas = document.getElementById("canvas");
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("play-btn").style.display = "none";
  document.getElementById("privacy-policity-btn").style.display = "none";
  document.getElementById("legal-notice-btn").style.display = "none";
  document.getElementById("info-btn").style.display = "none";
  canvas.style.display = "block";
  world = new World(canvas, keyboard);
}

function toggleFullScreen() {
  const canvas = document.getElementById("fullscreen");
  if (!document.fullscreenElement) {
    canvas.requestFullscreen().catch((err) => {
      alert(
        `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
      );
    });
  } else {
    document.exitFullscreen();
  }
}

function soundOff() {
  document.getElementById("mute-btn").style.display = "flex";
  document.getElementById("sound-btn").style.display = "none";

  world.character.walking_sound.muted = true;
  world.character.jumpSound.muted = true;
  world.character.hurtSound.muted = true;
  world.character.snoreSound.muted = true;
  world.chicken.chickenSound.muted = true;
  world.babyChicken.babyChickenSound.muted = true;
  world.bottleSound.muted = true;
  world.coinSound.muted = true;
  world.throwSound.muted = true;
  world.splashSound.muted = true;
}

function soundOn() {
  document.getElementById("mute-btn").style.display = "none";
  document.getElementById("sound-btn").style.display = "flex";

  world.character.walking_sound.muted = false;
  world.character.jumpSound.muted = false;
  world.character.hurtSound.muted = false;
  world.character.snoreSound.muted = false;
  world.enemies.chicken.chickenSound.muted = false;
  world.enemies.babyChicken.babyChickenSound.muted = false;
  world.bottleSound.muted = false;
  world.coinSound.muted = false;
  world.throwSound.muted = false;
  world.splashSound.muted = false;
}

function openInfo() {
  const infoContainer = document.getElementById("info-container");
  if (infoContainer.style.display === "flex") {
    infoContainer.style.display = "none";
  } else {
    infoContainer.style.display = "flex";
  }
}

function closePopup() {
  document.getElementById("info-container").style.display = "none";
  document.getElementById("privacy-policity-container").style.display = "none";
  document.getElementById("legal-notice-container").style.display = "none";
}

function openPrivacyPolicity() {
  var privacyPolicityContainer = document.getElementById(
    "privacy-policity-container"
  );
  if (
    privacyPolicityContainer.style.display === "none" ||
    privacyPolicityContainer.style.display === "flex"
  ) {
    // Laden des Inhalts von policity.html über XMLHttpRequest
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          var privacyPolicityContent = document.getElementById(
            "privacy-policity-content"
          );
          privacyPolicityContent.innerHTML = xhr.responseText;
          privacyPolicityContainer.style.display = "block"; // Zeige das Overlay an
        } else {
          console.error(
            "Fehler beim Laden der Datei privacy-policity.html:",
            xhr.status
          );
        }
      }
    };
    xhr.open("GET", "privacy-policity.html", true);
    xhr.send();
  } else {
    privacyPolicityContainer.style.display = "none"; // Verstecke das Overlay
  }
}

function openLegalNotice() {
  var legalNoticeContainer = document.getElementById("legal-notice-container");
  if (
    legalNoticeContainer.style.display === "none" ||
    legalNoticeContainer.style.display === "flex"
  ) {
    // Laden des Inhalts von policity.html über XMLHttpRequest
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          var LegalNoticeContent = document.getElementById(
            "legal-notice-content"
          );
          LegalNoticeContent.innerHTML = xhr.responseText;
          legalNoticeContainer.style.display = "block"; // Zeige das Overlay an
        } else {
          console.error(
            "Fehler beim Laden der Datei policity.html:",
            xhr.status
          );
        }
      }
    };
    xhr.open("GET", "legal-notice.html", true);
    xhr.send();
  } else {
    legalNoticeContainer.style.display = "none"; // Verstecke das Overlay
  }
}

window.addEventListener("orientationchange", checkOrientation);
window.addEventListener("resize", checkOrientation); // Added resize event to handle changes in window size.
window.addEventListener("load", checkOrientation);

function checkOrientation() {
  const warning = document.getElementById("orientation-warning");
  if (window.innerWidth < 760 && window.innerWidth < window.innerHeight) {
    warning.style.display = "flex";
  } else {
    warning.style.display = "none";
  }
}

function doNotClose(event) {
  event.stopPropagation();
}

window.addEventListener("keydown", (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = true;
  }
  if (e.keyCode == 37) {
    keyboard.LEFT = true;
  }
  if (e.keyCode == 38) {
    keyboard.UP = true;
  }
  if (e.keyCode == 40) {
    keyboard.DOWN = true;
  }
  if (e.keyCode == 32) {
    keyboard.SPACE = true;
  }
  if (e.keyCode == 68) {
    keyboard.D = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = false;
  }
  if (e.keyCode == 37) {
    keyboard.LEFT = false;
  }
  if (e.keyCode == 38) {
    keyboard.UP = false;
  }
  if (e.keyCode == 40) {
    keyboard.DOWN = false;
  }
  if (e.keyCode == 32) {
    keyboard.SPACE = false;
  }
  if (e.keyCode == 68) {
    keyboard.D = false;
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const leftBtn = document.getElementById("left-btn");
  const rightBtn = document.getElementById("right-btn");
  const jumpBtn = document.getElementById("jump-btn");
  const throwBtn = document.getElementById("throw-btn");

  leftBtn.addEventListener("mousedown", () => {
    keyboard.LEFT = true;
  });
  leftBtn.addEventListener("mouseup", () => {
    keyboard.LEFT = false;
  });
  leftBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.LEFT = true;
  });
  leftBtn.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.LEFT = false;
  });

  rightBtn.addEventListener("mousedown", () => {
    keyboard.RIGHT = true;
  });
  rightBtn.addEventListener("mouseup", () => {
    keyboard.RIGHT = false;
  });
  rightBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.RIGHT = true;
  });
  rightBtn.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.RIGHT = false;
  });

  jumpBtn.addEventListener("mousedown", () => {
    keyboard.SPACE = true;
  });
  jumpBtn.addEventListener("mouseup", () => {
    keyboard.SPACE = false;
  });
  jumpBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.SPACE = true;
  });
  jumpBtn.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.SPACE = false;
  });

  throwBtn.addEventListener("mousedown", () => {
    keyboard.D = true;
  });
  throwBtn.addEventListener("mouseup", () => {
    keyboard.D = false;
  });
  throwBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.D = true;
  });
  throwBtn.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.D = false;
  });
});
