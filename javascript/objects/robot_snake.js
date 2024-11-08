class RobotSnake extends Snake {
    constructor(direction, initialPos, initialSize, id) {
        super(direction, initialPos, initialSize, id);
        this.aiMove = () => {

            let possibleDirections = [
                [1, 0], [0, 1], [-1, 0], [0, -1] 
            ];


            possibleDirections = possibleDirections.filter(dir => 
                (dir[0] !== -this.direction[0] || dir[1] !== -this.direction[1])
            );

            let currentDirectionRisk = calculateCollisionRisk([
                this.body[0][0] + this.direction[0],
                this.body[0][1] + this.direction[1]
            ]);

            if (currentDirectionRisk === 0) {
                let foodInCurrentDirection = this.checkFoodInDirection(this.direction);
                if (foodInCurrentDirection) {
                    return;
                }
            }

            let newDirection = this.seekFood(possibleDirections);
            let newDirectionRisk = calculateCollisionRisk([
                this.body[0][0] + newDirection[0],
                this.body[0][1] + newDirection[1]
            ]);
            
            if (newDirectionRisk > 0) {
                newDirection = this.findSafeMove(possibleDirections);
            }

            this.direction = newDirection;
        }
  
        this.checkFoodInDirection = (direction) => {
            let potentialHead = [
                this.body[0][0] + direction[0],
                this.body[0][1] + direction[1]
            ];
            return foods.some(food => 
                food[0] === potentialHead[0] && food[1] === potentialHead[1]
            );
        }

        this.seekFood = (directions) => {
            let currentDirection = this.direction;
            let food = this.findClosestFood();

            if (!food) return currentDirection;

            let bestDirection = currentDirection;
            let minDistance = calculateDistance([
                this.body[0][0] + currentDirection[0],
                this.body[0][1] + currentDirection[1]
            ], food);

            for (let direction of directions) {
                let potentialHead = [
                    this.body[0][0] + direction[0],
                    this.body[0][1] + direction[1]
                ];

                let distance = calculateDistance(potentialHead, food);
                if (distance < minDistance) {
                    bestDirection = direction;
                    minDistance = distance;
                }
            }

            return bestDirection;
        }

        this.findClosestFood = () => {
            let closestFood = null;
            let minDistance = Infinity;

            for (let food of foods) {
                let distance = calculateDistance(this.body[0], food);
                if (distance < minDistance) {
                    closestFood = food;
                    minDistance = distance;
                }
            }

            return closestFood;
        }

        this.findSafeMove = (directions) => {
            let safestDirection = this.direction;
            let lowestRisk = Infinity;

            for (let direction of directions) {
                let potentialHead = [
                    this.body[0][0] + direction[0],
                    this.body[0][1] + direction[1]
                ];

                let risk = calculateCollisionRisk(potentialHead);
                if (risk < lowestRisk) {
                    safestDirection = direction;
                    lowestRisk = risk;
                }
            }

            return safestDirection;
        }

        this.specialDeath = () => {
            spawnRandomSnakes(1);
        };
    }
}

function spawnRandomSnakes(count) {
    for (let i = 0; i < count; i++) {
        let position, direction;
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

        createRobotSnake(direction, position, 20, `${Date.now()}-${i}`);
    }
}

function calculateDistance(point1, point2) {
    return Math.abs(point1[0] - point2[0]) + Math.abs(point1[1] - point2[1]);
}

function calculateCollisionRisk(newHead) {
    let risk = 0;
    if (collisionBorderCheck(newHead)) risk += 1;
    if (collisionSnakeCheck(newHead)) risk += 10;
    return risk;
}

function createRobotSnake(direction, initialPos, initialSize, id) {
    snakes.set(id, new RobotSnake(direction, initialPos, initialSize, id));
}
