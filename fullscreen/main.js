// Classes
class Vector2 {
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }

  static mouse () { return new Vector2(mouseX, mouseY); }
  static random () { return new Vector2(Math.random(), Math.random()); }

  copy () { return new Vector2(this.x, this.y); }
  fromScreen () { this.div(canvas.v); return this; }
  toScreen () { this.mult(canvas.v); return this; }

  getUnit () { let mag = this.getMag(); return this.copy().div(mag); }

  getMag () { return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)); }

  add (other) {
    if (other instanceof Vector2) {
      this.x += other.x;
      this.y += other.y;

      return this;
    } else if (typeof other === `number`) {
      this.x += other;
      this.y += other;

      return this;
    } else console.error(`Unknown type.`);
  }

  sub (other) {
    if (other instanceof Vector2) {
      this.x -= other.x;
      this.y -= other.y;

      return this;
    } else if (typeof other === `number`) {
      this.x -= other;
      this.y -= other;

      return this;
    } else console.error(`Unknown type.`);
  }

  div (other) {
    if (other instanceof Vector2) {
      this.x /= other.x;
      this.y /= other.y;

      return this;
    } else if (typeof other === `number`) {
      this.x /= other;
      this.y /= other;

      return this;
    } else console.error(`Unknown tyoe.`);
  }

  mult (other) {
    if (other instanceof Vector2) {
      this.x *= other.x;
      this.y *= other.y;

      return this;
    } else if (typeof other === `number`) {
      this.x *= other;
      this.y *= other;

      return this;
    } else console.error(`Unknown type.`);
  }

  max (other) {
    if (other instanceof Vector2) {
      this.x = Math.max(this.x, other.x);
      this.y = Math.max(this.y, other.y);

      return this;
    } else if (typeof other === `number`) {
      this.x = Math.max(this.x, other);
      this.y = Math.max(this.y, other);

      return this;
    } else console.error(`Unknown type.`);
  }

  min (other) {
    if (other instanceof Vector2) {
      this.x = Math.min(this.x, other.x);
      this.y = Math.min(this.y, other.y);

      return this;
    } else if (typeof other === `number`) {
      this.x = Math.min(this.x, other);
      this.y = Math.min(this.y, other);

      return this;
    } else console.error(`Unknown type.`);
  }
}

class Ship {
  constructor (pos) {
    this.pos = pos;
    this.vel = Vector2.random();
  }

  static setupDraw () { rectMode(CENTER); fill(colors.white); stroke(colors.black); strokeWeight(1); }

  step () {
    // Clamp Pos
    this.pos.max(0).min(1);
    
    // Calc force.
    let ben = this.getVectorBeneath();
    let go = this.vel.add(ben).min(maxSpeed).getUnit().div(500);
    // this.vel.add(ben).div(gravity).min(0.1).max(0);

    // Add force.
    // this.pos.add(this.vel).min(1).max(0);
    this.pos.add(go).min(1).max(0);

    // Clamp
    // this.pos.max(new Vector2(0, 0)).min(canvas.v);
  }

  draw () {
    let realPos = this.pos.copy().toScreen();

    rect(realPos.x, realPos.y, 10, 10);
    strokeWeight(5); point(realPos.x, realPos.y);
  }

  lookup () {
    let x = Math.floor(this.pos.x * (vectors.length - 1));
    let y = Math.floor(this.pos.y * (vectors[0].length - 1));

    return new Vector2(x, y);
  }

  getVectorBeneath () {
    // let x = this.pos.x
    let lk = this.lookup();

    return vectors[lk.x][lk.y].copy();
  }
}

// Globals
const gravity = 0.05;
const maxSpeed = 0.001;

let canvas = {
  e: null, // Canvas element

  w: null, // Canvas width
  h: null, // Canvas height
  v: null,
};

let colors = {};

let vectors = [];
let ships = [];

// p5 Functions
function setup () {
  // Canvas
  canvas.e = createCanvas();
  canvas.e.parent(`container`);
  windowResized();

  // Variables
  colors = {
    black: color(0),
    gray: color(128),
    lightGray: color(192),
    white: color(255),

    green: color(0, 255, 0),
    blue: color(0, 0, 255),
    red: color(255, 0, 0),
  }

  vectors = [];
  for (let i = 0; i < 10; i ++) {
    vectors[i] = [];
    for (let j = 0; j < 10; j ++) vectors[i][j] = Vector2.random().mult(2).sub(1);
  }

  ships = [];
  for (let i = 0; i < 1; i ++)
    ships[i] = new Ship(Vector2.random());

  frameRate(10);
}

function draw () {
  // Clearing
  background(colors.white);

  // Calc

  // Moving Ships
  for (let ship of ships) ship.step();
  
  // Drawing
  let size = new Vector2(canvas.w / vectors.length, canvas.h / vectors[0].length);

  // Drawing Boxes
  noFill(); stroke(colors.lightGray); strokeWeight(1);
  rectMode(CORNER);
  
  for (let x = 0; x < vectors.length; x ++) {
    for (let y = 0; y < vectors[0].length; y ++) {
      let test = ships[0].pos;
      // if (test.x == x && test.y === y) 
      if (x === Math.floor(test.x * (vectors.length - 1)) && y === Math.floor(test.y * (vectors[0].length - 1))) fill(colors.red);;

      let pos = new Vector2(x, y).mult(size);
      rect(pos.x, pos.y, size.x, size.y);
      
      noFill();
    }
  }

  // Drawing Vectors
  noFill(); stroke(colors.lightGray); strokeWeight(1);

  for (let x = 0; x < vectors.length; x ++) {
    for (let y = 0; y < vectors[0].length; y ++) {
      let str = new Vector2(x, y).add(0.5).mult(size)
      let vec = vectors[x][y].copy().div(2).mult(size).add(str);
      line(str.x, str.y, vec.x, vec.y);
    }
  }

  // Drawing Ships
  Ship.setupDraw();
  for (let ship of ships) {
    ship.draw();
  }
}

function windowResized () {
  const size = { w: window.innerWidth, h: window.innerHeight };

  canvas.w = size.w;
  canvas.h = size.h;
  canvas.v = new Vector2(canvas.w, canvas.h);

  resizeCanvas(size.w, size.h);
}