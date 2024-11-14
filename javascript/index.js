let myP5;
let elementSize = 20;
let cols, rows;
let grid = [];
let parent = document.getElementById("canva-parent");
let currentGame;

new p5((sketch) => {
  myP5 = sketch;
  sketch.setup = () => {
    sketch
      .createCanvas(parent.offsetWidth, parent.offsetHeight)
      .parent("canva-parent");
  };

  sketch.windowResized = () => {
    sketch.resizeCanvas(parent.offsetWidth, parent.offsetHeight);
  };
}, "canva-parent");

function initializeGrid() {
  cols = Math.ceil(parent.offsetWidth / elementSize);
  rows = Math.ceil(parent.offsetHeight / elementSize);
  grid = Array.from({ length: cols }, () => Array(rows).fill());
}

// document.getElementById('pvp-form').addEventListener('submit', (event) => {
//   event.preventDefault();

//   const formData = new FormData(event.target);
//   const formValues = Object.fromEntries(formData);

//   console.log(formValues);

//   startGame(new PvPSnakeGame(formValues["initial-food"],
//     formValues["frames-per-second"],
//     formValues["initial-snake-size"],
//     formValues["respawn-food"],
//     formValues["win-size"]
//   ));
//   getCurrentGame().initGame();
// });

function startGame(newGame) {
  currentGame = newGame;
}

function getCurrentGame() {
  return currentGame;
}

const switchMenu = (nextMenu, currentMenu = null) => {
  nextMenu.style.display = "flex";
  nextMenu.classList.add("animate-in");

  nextMenu.addEventListener(
    "animationend",
    () => {
      nextMenu.classList.remove("animate-in");
    },
    { once: true }
  );

  if (currentMenu) {
    currentMenu.classList.add("animate-out");
    currentMenu.addEventListener(
      "animationend",
      () => {
        currentMenu.style.display = "none";
        currentMenu.classList.remove("animate-out");
      },
      { once: true }
    );
  }
};

function displayLeaderboard(htmlContent) {
  const leaderboardMenu = document.getElementById("leaderboard-menu");
  const menuContent = leaderboardMenu.querySelector(".menu-content");
  menuContent.innerHTML = htmlContent;
  switchMenu(leaderboardMenu);
}

//all the animation stuff should be improved lol

document.addEventListener("DOMContentLoaded", () => {
  const gamemodesMenu = document.getElementById("gamemodes");
  const pvpForm = document.getElementById("pvp-form");
  const vsAiForm = document.getElementById("vs-ai-form");
  const leaderboardMenu = document.getElementById("leaderboard-menu");

  const menus = [gamemodesMenu, pvpForm, vsAiForm, leaderboardMenu];

  menus.forEach((menu) => (menu.style.display = "none"));
  gamemodesMenu.classList.add("animate-in");
  gamemodesMenu.style.display = "flex";

  gamemodesMenu
    .querySelector(".menu-options")
    .addEventListener("click", (event) => {
      gamemodesMenu.classList.remove("animate-in");
      if (event.target.textContent.trim() === "PvP") {
        switchMenu(pvpForm, gamemodesMenu);
      } else if (event.target.textContent.trim() === "vs AI") {
        switchMenu(vsAiForm, gamemodesMenu);
      }
    });

  document.querySelectorAll(".go-back").forEach((button) => {
    button.addEventListener("click", () => {
      const currentForm = button.closest(".menu");
      gamemodesMenu.classList.remove("animate-out");
      switchMenu(gamemodesMenu, currentForm);
    });
  });

  document.getElementById("play-pvp").addEventListener("click", (event) => {
    event.preventDefault();
    pvpForm.classList.add("animate-out");

    pvpForm.addEventListener(
      "animationend",
      () => {
        pvpForm.classList.remove("animate-out");
        const formData = new FormData(pvpForm);
        const formValues = Object.fromEntries(formData);

        console.log(formValues);

        startGame(
          new PvPSnakeGame(
            formValues["initial-food"],
            formValues["frames-per-second"],
            formValues["initial-snake-size"],
            formValues["respawn-food"],
            formValues["win-size"]
          )
        );
        getCurrentGame().initGame();

        menus.forEach((menu) => (menu.style.display = "none"));
      },
      { once: true }
    );
  });

  document.getElementById("play-ai").addEventListener("click", (event) => {
    event.preventDefault();
    vsAiForm.classList.add("animate-out");

    vsAiForm.addEventListener(
      "animationend",
      () => {
        vsAiForm.classList.remove("animate-out");
        const formData = new FormData(vsAiForm);
        const formValues = Object.fromEntries(formData);

        startGame(
          new AISnakeGame(
            formValues["initial-food"],
            formValues["frames-per-second-ai"],
            formValues["initial-snake-size-min"],
            formValues["initial-snake-size-max"],
            formValues["ai-snakes"],
            formValues["spawn-edges"],
            formValues["respawn-snakes"]
          )
        );
        getCurrentGame().initGame();

        menus.forEach((menu) => (menu.style.display = "none"));
      },
      { once: true }
    );
  });
});

function formatTime(millis) {
  const seconds = Math.floor(millis / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const formattedSeconds = seconds % 60;
  const formattedMinutes = minutes % 60;
  const formattedHours = hours;

  let timeString = "";
  if (formattedHours > 0) timeString += `${formattedHours}h `;
  if (formattedMinutes > 0) timeString += `${formattedMinutes}m `;
  if (formattedSeconds > 0 || (formattedHours === 0 && formattedMinutes === 0))
    timeString += `${formattedSeconds}s`;

  return timeString.trim();
}
