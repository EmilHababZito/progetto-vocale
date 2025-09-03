let classifier;
const options = { include: ['up', 'down', 'left', 'right'] };

let snake;
let food;
let scl = 20;

function preload() {
  classifier = ml5.soundClassifier('SpeechCommands18w', options);
}

function setup() {
  createCanvas(400, 400);
  snake = new Snake();
  frameRate(10);
  pickLocation();
  classifier.classify(gotResult);
}

function pickLocation() {
  let cols = floor(width / scl);
  let rows = floor(height / scl);
  food = createVector(floor(random(cols)), floor(random(rows)));
  food.mult(scl);
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  const label = results[0].label;

  if (label === 'up') {
    snake.dir(0, -1);
  } else if (label === 'down') {
    snake.dir(0, 1);
  } else if (label === 'left') {
    snake.dir(-1, 0);
  } else if (label === 'right') {
    snake.dir(1, 0);
  }
}

function draw() {
  background(51);
  snake.death();
  snake.update();
  snake.show();

  if (snake.eat(food)) {
    pickLocation();
  }

  fill(255, 0, 100);
  rect(food.x, food.y, scl, scl);
}

function Snake() {
  this.x = 0;
  this.y = 0;
  this.xspeed = 1;
  this.yspeed = 0;
  this.total = 0;
  this.tail = [];

  this.dir = function(x, y) {
    this.xspeed = x;
    this.yspeed = y;
  }

  this.eat = function(pos) {
    let d = dist(this.x, this.y, pos.x, pos.y);
    if (d < 1) {
      this.total++;
      return true;
    } else {
      return false;
    }
  }

  this.death = function() {
    for (let i = 0; i < this.tail.length; i++) {
      let pos = this.tail[i];
      let d = dist(this.x, this.y, pos.x, pos.y);
      if (d < 1) {
        this.total = 0;
        this.tail = [];
      }
    }
  }

  this.update = function() {
    for (let i = 0; i < this.tail.length - 1; i++) {
      this.tail[i] = this.tail[i + 1];
    }
    if (this.total >= 1) {
      this.tail[this.total - 1] = createVector(this.x, this.y);
    }

    this.x = this.x + this.xspeed * scl;
    this.y = this.y + this.yspeed * scl;

    this.x = constrain(this.x, 0, width - scl);
    this.y = constrain(this.y, 0, height - scl);
  }

  this.show = function() {
    fill(255);
    for (let i = 0; i < this.tail.length; i++) {
      rect(this.tail[i].x, this.tail[i].y, scl, scl);
    }
    rect(this.x, this.y, scl, scl);
  }
}