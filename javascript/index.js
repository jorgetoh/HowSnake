let elementSize = 20;
let cols, rows;
let grid = [];
let parent = document.getElementById('canva-parent');
let snakes;
let foods;
let gameRunning = false;

function setup() {
  createCanvas(parent.offsetWidth, parent.offsetHeight).parent('canva-parent');
}

function initializeGrid() {
  cols = ceil(width / elementSize);
  rows = ceil(height / elementSize);
  grid = Array.from({ length: cols }, () => Array(rows).fill());
}

function windowResized() {
  resizeCanvas(parent.offsetWidth, parent.offsetHeight);
}

function populateMapWithFood(numFoodItems) {
  for (let index = 0; index < numFoodItems; index++) {
    let x = Math.floor(Math.random() * cols);
    let y = Math.floor(Math.random() * rows);
    foods.push([x,y]);
  }
}

