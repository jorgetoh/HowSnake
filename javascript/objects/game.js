class SnakeGame {
  constructor() {
    this.snakes;
    this.foods;
    this.gameRunning;
    this.edges = true;
    this.spawnFoodAfterEat = false;
    this.initialAmountFood = 50;
    this.framesPerSecond = 20;
    this.snakeInitialSize = 4;
    this.snakeStats = new Object();
    this.amountOfSnakesAfterDie = 1;
    this.minInitialSize = 10;
    this.maxInitialSize = 20;

    this.initGame = () => {
      this.snakes = new Map();
      this.foods = [];

      initializeGrid();
      this.populateMapWithFood(this.initialAmountFood);
      myP5.frameRate(this.framesPerSecond);
      createSnake([0, 1], [0, 5], this.snakeInitialSize, "player", this);
      spawnRandomSnakes(calculateSnakesToSpawn(), 5, this.edges, this);

      this.gameRunning = true;
      this.draw();
    };

    this.draw = () => {
      myP5.background(0, 0, 0);

      this.drawFood();
      this.snakes.forEach((snake) => {
        if (snake instanceof RobotSnake) {
          snake.aiMove(this);
        }
        snake.move(this);
        snake.draw();
      });

      this.checksOnDraw();
    };

    this.populateMapWithFood = (numFoodItems) => {
      for (let index = 0; index < numFoodItems; index++) {
        let x = Math.floor(Math.random() * cols);
        let y = Math.floor(Math.random() * rows);
        this.foods.push([x, y]);
      }
    };

    this.drawFood = () => {
      myP5.fill(50, 12, 12);
      for (let food of this.foods) {
        myP5.rect(
          food[0] * elementSize,
          food[1] * elementSize,
          elementSize,
          elementSize
        );
      }
    };

    this.checksOnDraw = () => {};
  }
}

class AISnakeGame extends SnakeGame {
  constructor(
    initialAmountFood,
    framesPerSecond,
    minInitialSize,
    maxInitialSize,
    amountOfSnakes,
    spawnInEdges,
    amountOfSnakesAfterDie
  ) {
    super();
    this.initialAmountFood = Number(initialAmountFood);
    this.framesPerSecond = Number(framesPerSecond);
    this.spawnFoodAfterEat = false;
    this.minInitialSize = Number(minInitialSize);
    this.maxInitialSize = Number(maxInitialSize);
    this.amountOfSnakes = Number(amountOfSnakes);
    this.edges = spawnInEdges.toLowerCase() === "true";
    this.amountOfSnakesAfterDie = Number(amountOfSnakesAfterDie);

    this.initGame = () => {
      this.snakes = new Map();
      this.foods = [];

      initializeGrid();
      this.populateMapWithFood(this.initialAmountFood);
      myP5.frameRate(this.framesPerSecond);
      createSnake([0, 1], [0, 5], this.snakeInitialSize, "player", this);
      spawnRandomSnakes(
        this.amountOfSnakes,
        this.minInitialSize,
        this.maxInitialSize,
        this.edges,
        this
      );
      this.gameRunning = true;
    };

    this.checksOnDraw = () => {
      if (!this.snakes.get("player")) {
        if (this.gameRunning) {
          const leaderboardHTML = `<h1>AI Leaderboard</h1>
                      <p>PLAYER >> Size: ${
                        this.snakeStats.player.body.length
                      }, Time alive: ${formatTime(
            this.snakeStats.player.deathTime - this.snakeStats.player.spawnTime
          )}</p>
                      <p>Amount of death snakes: ${
                        Object.keys(this.snakeStats).length
                      }</p>
                      <p>Alive snakes: ${this.snakes.size}</p>
                      <p>Food blocks in-game: ${this.foods.length}</p>`;

          displayLeaderboard(leaderboardHTML);
          this.gameRunning = false;
        }
      }
    };
  }
}

class MenuSnakeGame extends SnakeGame {
  constructor() {
    super();

    this.initGame = () => {
      this.snakes = new Map();
      this.foods = [];
      this.edges = false;
      myP5.frameRate(30);
      initializeGrid();
      this.populateMapWithFood(50);
      spawnRandomSnakes(
        calculateSnakesToSpawn(),
        this.minInitialSize,
        this.maxInitialSize,
        this.edges,
        this
      );

      this.gameRunning = true;
    };

    this.draw = () => {
      if (this.foods.length > 0.5 * (rows * cols)) {
        this.initGame();
        return;
      }
      myP5.background(0, 0, 0);

      this.drawFood();
      this.snakes.forEach((snake) => {
        if (snake instanceof RobotSnake) {
          snake.aiMove(this);
        }
        snake.move(this);
        snake.draw();
      });

      this.checksOnDraw();
    };
  }
}

class PvPSnakeGame extends SnakeGame {
  constructor(
    initialAmountFood,
    framesPerSecond,
    snakeInitialSize,
    spawnFoodAfterEat,
    sizeToWin
  ) {
    super();

    this.initialAmountFood = Number(initialAmountFood);
    this.framesPerSecond = Number(framesPerSecond);
    this.snakeInitialSize = Number(snakeInitialSize);
    this.spawnFoodAfterEat = spawnFoodAfterEat.toLowerCase() === "true";
    this.sizeToWin = Number(sizeToWin);

    this.initGame = () => {
      this.snakes = new Map();
      this.foods = [];

      initializeGrid();
      this.populateMapWithFood(this.initialAmountFood);
      myP5.frameRate(this.framesPerSecond);
      createSnake([0, 1], [cols - 2, 5], this.snakeInitialSize, "player", this);
      createSnake([0, 1], [0, 5], this.snakeInitialSize, "player2", this);
      this.gameRunning = true;
    };

    this.checksOnDraw = () => {
      if (this.snakes.size == 0) {
        if (this.gameRunning) {
          const leaderboardHTML = `<h1>PvP Leaderboard</h1>
                      <p>PLAYER #1 >> Size: ${
                        this.snakeStats.player.body.length
                      }, Time alive: ${formatTime(
            this.snakeStats.player.deathTime - this.snakeStats.player.spawnTime
          )}</p>
                      <p>PLAYER #2 >> Size: ${
                        this.snakeStats.player2.body.length
                      }, Time alive: ${formatTime(
            this.snakeStats.player2.deathTime -
              this.snakeStats.player2.spawnTime
          )}</p>`;

          displayLeaderboard(leaderboardHTML);
          this.gameRunning = false;
        }
      }
    };
  }
}
