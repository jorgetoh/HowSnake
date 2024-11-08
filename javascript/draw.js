function draw() {
    background(0,0,0);
    //drawGrid();
    if (!gameRunning) {
        drawMenu();
        return;
    }


    drawFood();
    snakes.forEach(snake => {
        if (snake.id != "player") {
            snake.aiMove();

        }
        snake.move();
        snake.draw();
    });
}


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
                let colorValue = max(0, random(50 - Math.floor(Math.random() * y)) - frameCount * fadeAmount);
                fill(colorValue, colorValue, colorValue);
                rect(x, y, elementSize, elementSize);
            }
        }
    } else {
        initGame();
    }
}

function drawFood() {
    fill(50, 12, 12);
    for (let food of foods) {
        rect(food[0] * elementSize, food[1] * elementSize, elementSize, elementSize);
    }
}

//BUG if I move two times in a row too fast it allows me to do illegal movements causing a collision.
function keyPressed() {
    if (keyCode === UP_ARROW && snakes.get("player").direction[1] === 0) {
        snakes.get("player").direction = [0, -1];
    } else if (keyCode === DOWN_ARROW && snakes.get("player").direction[1] === 0) {
        snakes.get("player").direction = [0, 1];
    } else if (keyCode === LEFT_ARROW && snakes.get("player").direction[0] === 0) {
        snakes.get("player").direction = [-1, 0];
    } else if (keyCode === RIGHT_ARROW && snakes.get("player").direction[0] === 0) {
        snakes.get("player").direction = [1, 0];
    }
}

function initGame() {
    snakes = new Map();
    foods = [];

    initializeGrid();
    populateMapWithFood(50);
    frameRate(20);
    createSnake([0, 1], [0, 5], 4, "player");
    spawnRandomSnakes(5);

    gameRunning=true;
}

document.getElementById("reset").addEventListener("click", initGame)