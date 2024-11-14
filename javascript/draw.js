function drawGrid() {
  stroke(20);
  for (let x = 0; x <= width; x += elementSize) {
    line(x, 0, x, height);
  }
  for (let y = 0; y <= height; y += elementSize) {
    line(0, y, width, y);
  }
}

let fadeAmount = 1;

function drawMenu() {
  if (frameCount * fadeAmount < 50) {
    for (let x = 0; x <= width; x += elementSize) {
      for (let y = 0; y <= height; y += elementSize) {
        let colorValue = max(
          0,
          random(50 - Math.floor(Math.random() * y)) - frameCount * fadeAmount
        );
        myP5.fill(colorValue, colorValue, colorValue);
        myP5.rect(x, y, elementSize, elementSize);
      }
    }
  }
}

startGame(new MenuSnakeGame());
getCurrentGame().initGame();

myP5.draw = () => {
  if (getCurrentGame()) getCurrentGame().draw();
};

const playerKeybinds = {
  player: {
    up: myP5.UP_ARROW,
    down: myP5.DOWN_ARROW,
    left: myP5.LEFT_ARROW,
    right: myP5.RIGHT_ARROW,
  },
  player2: {
    up: "W".charCodeAt(0),
    down: "S".charCodeAt(0),
    left: "A".charCodeAt(0),
    right: "D".charCodeAt(0),
  },
};

const players = [
  { id: "player", keys: playerKeybinds.player },
  { id: "player2", keys: playerKeybinds.player2 },
];

myP5.keyPressed = () => {
  const keyCode = myP5.keyCode;

  players.forEach((playerData) => {
    let player = getCurrentGame().snakes.get(playerData.id);
    if (player) {
      if (keyCode === playerData.keys.up && player.direction[1] === 0) {
        player.direction = [0, -1];
      } else if (
        keyCode === playerData.keys.down &&
        player.direction[1] === 0
      ) {
        player.direction = [0, 1];
      } else if (
        keyCode === playerData.keys.left &&
        player.direction[0] === 0
      ) {
        player.direction = [-1, 0];
      } else if (
        keyCode === playerData.keys.right &&
        player.direction[0] === 0
      ) {
        player.direction = [1, 0];
      }
    }
  });
};
