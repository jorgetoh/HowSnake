/*      
                ARRAY POS 0 is X, POS 1 is Y

        direction: should be [1,0], [0,1], [-1,0], [0,-1]
        initialPos: coords of the head of the snake.
        initialSize: extra components of the initial snake. 0 for no components.

    */

class Snake {
  constructor(direction, initialPos, initialSize, id) {
    this.id = id;
    this.direction = direction;
    this.body = [initialPos];
    this.spawnTime = Date.now();
    this.deathTime;
    if (this instanceof RobotSnake) {
      let x = Math.floor(Math.random() * (100 - 30 + 1)) + 30;
      this.color = [x, x, x];
    } else {
      this.color = [255, 250, 250];
    }

    for (let i = 1; i < initialSize + 2; i++) {
      this.body.push([
        initialPos[0] - i * this.direction[0],
        initialPos[1] - i * this.direction[1],
      ]);
    }

    this.draw = () => {
      myP5.fill(...this.color);
      for (let bodyPart of this.body) {
        myP5.rect(
          bodyPart[0] * elementSize,
          bodyPart[1] * elementSize,
          elementSize,
          elementSize
        );
      }
    };

    this.move = (game) => {
      if (this.dead) {
        return;
      }
      let oldHead = this.body[0];

      let newHead = [
        oldHead[0] + Number(this.direction[0]),
        oldHead[1] + Number(this.direction[1]),
      ];

      if (isColliding(newHead, game)) {
        this.body.forEach((element) => {
          game.foods.push(element);
        });
        game.snakeStats[this.id] = this;
        this.deathTime = Date.now();
        this.specialDeath(game);
        game.snakes.delete(this.id);
        return;
      }

      this.body.unshift(newHead);
      if (!isFood(newHead, game)) {
        this.body.pop();
      } else {
        if (game.spawnFoodAfterEat === true) {
          game.foods.push([
            Math.floor(Math.random() * cols),
            Math.floor(Math.random() * rows),
          ]);
        }
      }
    };

    this.specialDeath = (game) => {};
  }
}

function isColliding(snakeHead, game) {
  return (
    collisionBorderCheck(snakeHead) || collisionSnakeCheck(snakeHead, game)
  );
}

function collisionSnakeCheck(snakeHead, game) {
  return [...game.snakes.values()].some((secondSnake) =>
    secondSnake.body.some((element) =>
      element.every((value, index) => value === snakeHead[index])
    )
  );
}
function collisionBorderCheck(snakeHead) {
  return (
    snakeHead[0] < 0 ||
    snakeHead[0] >= cols ||
    snakeHead[1] < 0 ||
    snakeHead[1] >= rows
  );
}

function isFood(snakeHead, game) {
  const index = game.foods.findIndex((food) =>
    food.every((value, i) => value === snakeHead[i])
  );
  if (index !== -1) {
    game.foods.splice(index, 1);
    return true;
  }
  return false;
}

createSnake = (direction, initialPos, initialSize, id, game) => {
  game.snakes.set(id, new Snake(direction, initialPos, initialSize, id));
};

// SNAKE AI CLASS

class RobotSnake extends Snake {
  constructor(direction, initialPos, initialSize, id) {
    super(direction, initialPos, initialSize, id);
    this.aiMove = (game) => {
      let possibleDirections = [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1],
      ];

      possibleDirections = possibleDirections.filter(
        (dir) => dir[0] !== -this.direction[0] || dir[1] !== -this.direction[1]
      );

      let currentDirectionRisk = calculateCollisionRisk(
        [
          this.body[0][0] + this.direction[0],
          this.body[0][1] + this.direction[1],
        ],
        game
      );

      if (currentDirectionRisk === 0) {
        let foodInCurrentDirection = this.checkFoodInDirection(
          this.direction,
          game
        );
        if (foodInCurrentDirection) {
          return;
        }
      }

      let newDirection = this.seekFood(possibleDirections, game);
      let newDirectionRisk = calculateCollisionRisk(
        [this.body[0][0] + newDirection[0], this.body[0][1] + newDirection[1]],
        game
      );

      if (newDirectionRisk > 0) {
        newDirection = this.findSafeMove(possibleDirections, game);
      }

      this.direction = newDirection;
    };

    this.checkFoodInDirection = (direction, game) => {
      let potentialHead = [
        this.body[0][0] + direction[0],
        this.body[0][1] + direction[1],
      ];
      return game.foods.some(
        (food) => food[0] === potentialHead[0] && food[1] === potentialHead[1]
      );
    };

    this.seekFood = (directions, game) => {
      let currentDirection = this.direction;
      let food = this.findClosestFood(game);

      if (!food) return currentDirection;

      let bestDirection = currentDirection;
      let minDistance = calculateDistance(
        [
          this.body[0][0] + currentDirection[0],
          this.body[0][1] + currentDirection[1],
        ],
        food
      );

      for (let direction of directions) {
        let potentialHead = [
          this.body[0][0] + direction[0],
          this.body[0][1] + direction[1],
        ];

        let distance = calculateDistance(potentialHead, food);
        if (distance < minDistance) {
          bestDirection = direction;
          minDistance = distance;
        }
      }

      return bestDirection;
    };

    this.findClosestFood = (game) => {
      let closestFood = null;
      let minDistance = Infinity;

      for (let food of game.foods) {
        let distance = calculateDistance(this.body[0], food);
        if (distance < minDistance) {
          closestFood = food;
          minDistance = distance;
        }
      }

      return closestFood;
    };

    this.findSafeMove = (directions, game) => {
      let safestDirection = this.direction;
      let lowestRisk = Infinity;

      for (let direction of directions) {
        let potentialHead = [
          this.body[0][0] + direction[0],
          this.body[0][1] + direction[1],
        ];

        let risk = calculateCollisionRisk(potentialHead, game);
        if (risk < lowestRisk) {
          safestDirection = direction;
          lowestRisk = risk;
        }
      }

      return safestDirection;
    };

    this.specialDeath = (game) => {
      spawnRandomSnakes(
        game.amountOfSnakesAfterDie,
        game.minInitialSize,
        game.maxInitialSize,
        game.edges,
        game
      );
    };
  }
}

function spawnRandomSnakes(count, minSize, maxSize, edges, game) {
  for (let i = 0; i < count; i++) {
    let position, direction;
    if (edges) {
      const edge = Math.floor(Math.random() * 4);
      switch (edge) {
        case 0:
          position = [Math.floor(Math.random() * cols), 0];
          direction = [0, 1];
          break;
        case 1:
          position = [Math.floor(Math.random() * cols), rows - 1];
          direction = [0, -1];
          break;
        case 2:
          position = [0, Math.floor(Math.random() * rows)];
          direction = [1, 0];
          break;
        case 3:
          position = [cols - 1, Math.floor(Math.random() * rows)];
          direction = [-1, 0];
          break;
      }
    } else {
      position = [
        Math.floor(Math.random() * cols),
        Math.floor(Math.random() * rows),
      ];
      direction = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ][Math.floor(Math.random() * 4)];
    }
    createRobotSnake(
      direction,
      position,
      Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize,
      `${Date.now()}-${i}`,
      game
    );
    //console.log(`Spawned snakes ${count}, total snakes: ${game.snakes.size}`);
  }
}

function calculateSnakesToSpawn() {
  return Math.max(1, Math.floor((rows * cols) / 300));
}

function calculateDistance(point1, point2) {
  return Math.abs(point1[0] - point2[0]) + Math.abs(point1[1] - point2[1]);
}

function calculateCollisionRisk(newHead, game) {
  let risk = 0;
  if (collisionBorderCheck(newHead)) risk += 1;
  if (collisionSnakeCheck(newHead, game)) risk += 10;
  return risk;
}

function createRobotSnake(direction, initialPos, initialSize, id, game) {
  game.snakes.set(id, new RobotSnake(direction, initialPos, initialSize, id));
}
