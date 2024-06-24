let canvas;
let world;
let keyboard = new Keyboard();

function init() {
  const startMusic = document.getElementById("startMusic");
  startMusic.play();
}

function startGame() {
  initLevel();
  const PrivacyPolicityBtn = document.getElementById("privacy-policity-btn");
  const LegalNoticeBtn = document.getElementById("legal-notice-btn");
  const startScreen = document.getElementById("startScreen");
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const infoBtn = document.getElementById("info-btn");
  const canvas = document.getElementById("canvas");
  const backgroundMusic = document.getElementById("backgroundMusic");
  const playBtn = document.getElementById("play-btn");
  playBtn.style.display = "none";
  fullscreenBtn.style.display = "flex";
  infoBtn.style.display = "none";
  PrivacyPolicityBtn.style.display = "none";
  LegalNoticeBtn.style.display = "none";

  // Stop start music
  startMusic.pause();
  startMusic.currentTime = 0;

  // Hide start screen
  startScreen.style.display = "none";

  // Show canvas and start background music
  canvas.style.display = "block";
  backgroundMusic.play();

  // Initialize the game
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
  const backgroundMusic = document.getElementById("backgroundMusic");
  backgroundMusic.muted = true;

  // Andere Sounds stummschalten
  world.character.walking_sound.muted = true;
  world.character.jumpSound.muted = true;
  world.character.hurtSound.muted = true;
  world.jumpOnSound.muted = true;
  world.bottleSound.muted = true;
  world.coinSound.muted = true;

  world.throwSound.muted = true;
  world.splashSound.muted = true;
}

function soundOn() {
  document.getElementById("mute-btn").style.display = "none";
  document.getElementById("sound-btn").style.display = "flex";
  const backgroundMusic = document.getElementById("backgroundMusic");
  backgroundMusic.muted = false;

  // Andere Sounds aktivieren
  world.character.walking_sound.muted = false;
  world.character.jumpSound.muted = false;
  world.character.hurtSound.muted = false;
  world.jumpOnSound.muted = false;
  world.bottleSound.muted = false;
  world.coinSound.muted = false;
  world.throwSound.muted = false;
  world.splashSound.muted = false;
}

function toggleInfo() {
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
