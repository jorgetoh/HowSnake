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
        if (this.id == "player") {
            this.color =[255, 250, 250];
        } else {
            let x = random(100)
            this.color = [x, x, x]
        }
        
        for (let i = 1; i < initialSize + 2; i++) {
            this.body.push([
                initialPos[0] - (i * this.direction[0]),
                initialPos[1] - (i * this.direction[1])
            ]);
        }

        this.draw = () => {
            
            
            fill(...this.color);
            for (let bodyPart of this.body) {
                rect(bodyPart[0] * elementSize, bodyPart[1] * elementSize, elementSize, elementSize);
            }
        }

        this.move = () => {
            if (this.dead) {
                return;
            }
            let oldHead = this.body[0];

            let newHead = [
                oldHead[0] + Number(this.direction[0]), 
                oldHead[1] + Number(this.direction[1])
            ];

            if (isColliding(newHead)) {
                this.body.forEach(element => {
                    foods.push(element);
                });
                this.specialDeath()
                snakes.delete(this.id);
                delete this;
                return;
            }

            this.body.unshift(newHead);
            if (!isFood(newHead)) {
                this.body.pop();
            }
        }

        this.specialDeath = () => {

        }
    }
}



function isColliding(snakeHead) {
    return collisionBorderCheck(snakeHead) || collisionSnakeCheck(snakeHead);
}

function collisionSnakeCheck(snakeHead) {
    return [...snakes.values()].some(secondSnake => secondSnake.body.some(element => element.every((value, index) => value === snakeHead[index])));
}
function collisionBorderCheck(snakeHead) {
    return (snakeHead[0] < 0 || snakeHead[0] >= cols || snakeHead[1] < 0 || snakeHead[1] >= rows);
}

function isFood(snakeHead) {
    const index = foods.findIndex(food => food.every((value, i) => value === snakeHead[i]));
    if (index !== -1) {
        foods.splice(index, 1);
        return true;
    }
    return false;
}

function createSnake(direction, initialPos, initialSize, id) {
    snakes.set(id ,new Snake(direction, initialPos, initialSize, id));
}
