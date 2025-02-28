let cols, rows;
let grid = [];
let chaosSlider;
let chaosLevel = 0;

function setup() {
  createCanvas(600, 600);
  cols = 10;
  rows = 10;
  let w = width / cols;
  let h = height / rows;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid.push(new Cell(i * w + w / 2, j * h + h / 2, w, h));
    }
  }

  chaosSlider = select('#chaosSlider');
}

function draw() {
  background(0);
  chaosLevel = chaosSlider.value();

  for (let cell of grid) {
    cell.update();
    cell.display();
  }
}

function mousePressed() {
  for (let cell of grid) {
    if (cell.contains(mouseX, mouseY)) {
      cell.triggerChaos();
    }
  }
}

class Cell {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.origX = x;
    this.origY = y;
    this.angle = 0;
    this.color = color(255);
    this.chaosFactor = 0;
  }

  update() {
    let jitterX = map(noise(this.origX * 0.01, frameCount * 0.01), 0, 1, -this.w * chaosLevel, this.w * chaosLevel);
    let jitterY = map(noise(this.origY * 0.01, frameCount * 0.01), 0, 1, -this.h * chaosLevel, this.h * chaosLevel);
    
    this.x = this.origX + jitterX + random(-this.chaosFactor, this.chaosFactor) * chaosLevel;
    this.y = this.origY + jitterY + random(-this.chaosFactor, this.chaosFactor) * chaosLevel;
    
    this.angle = random(-PI / 4, PI / 4) * chaosLevel;
    this.color = color(random(100, 255) * chaosLevel, random(100, 255), random(100, 255));
    
    this.chaosFactor *= 0.95; 
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    fill(this.color);
    rectMode(CENTER);
    rect(0, 0, this.w * 0.8, this.h * 0.8);
    pop();
  }

  contains(px, py) {
    return px > this.x - this.w / 2 && px < this.x + this.w / 2 && py > this.y - this.h / 2 && py < this.y + this.h / 2;
  }

  triggerChaos() {
    this.chaosFactor = this.w / 2;
  }
}

