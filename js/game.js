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
  document.getElementById("sound-btn").style.display = "flex";
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

function setAllSoundsMuted(muted) {
  if (world && world.audioManager) {
    let path = world.audioManager;
    let sounds = [
      "backgroundMusic",
      "endbossMusic",
      "gunshotSound",
      "endbossSound",
      "bottleSound",
      "winSound",
      "gameOverSound",
      "walking_sound",
      "jumpSound",
      "hurtSound",
      "snoreSound",
      "babyChickenSound",
      "chickenSound",
    ];
    sounds.forEach((sound) => {
      if (path[sound]) {
        path[sound].muted = muted;
      }
    });
  }
}

function soundOff() {
  document.getElementById("mute-btn").style.display = "flex";
  document.getElementById("sound-btn").style.display = "none";
  setAllSoundsMuted(true);
}

function soundOn() {
  document.getElementById("mute-btn").style.display = "none";
  document.getElementById("sound-btn").style.display = "flex";
  setAllSoundsMuted(false);
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

function toggleContent(containerId, contentId, url) {
  var container = document.getElementById(containerId);
  if (
    container.style.display === "none" ||
    container.style.display === "flex"
  ) {
    // Laden des Inhalts über XMLHttpRequest
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          var content = document.getElementById(contentId);
          content.innerHTML = xhr.responseText;
          container.style.display = "block"; // Zeige das Overlay an
        } else {
          console.error("Fehler beim Laden der Datei " + url + ":", xhr.status);
        }
      }
    };
    xhr.open("GET", url, true);
    xhr.send();
  } else {
    container.style.display = "none"; // Verstecke das Overlay
  }
}

function openPrivacyPolicity() {
  toggleContent(
    "privacy-policity-container",
    "privacy-policity-content",
    "privacy-policity.html"
  );
}

function openLegalNotice() {
  toggleContent(
    "legal-notice-container",
    "legal-notice-content",
    "legal-notice.html"
  );
}

function closePopup() {
  document.getElementById("info-container").style.display = "none";
  document.getElementById("privacy-policity-container").style.display = "none";
  document.getElementById("legal-notice-container").style.display = "none";
}

function doNotClose(event) {
  event.stopPropagation();
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
