// Classes
class Vector2 {
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }

  static zero () { return new Vector2(0, 0); }
  static fromMouse () { return new Vector2(mouseX, mouseY); }
  static random () { return new Vector2(random(), random()); }
  
  static fromPerlin (x, y) {
    let theta = lerp(0, TWO_PI, noise(x, y));

    return new Vector2(cos(theta), sin(theta));
  }

  copy () { return new Vector2(this.x, this.y); }
  getMag () { return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)); }
  getUnit () { let mag = this.getMag(); return this.copy().div(mag); }
  setUnit () { let mag = this.getMag(); return this.div(mag); }
  setMag (x) { return this.setUnit().mult(x); }

  add (other) {
    if (other instanceof Vector2) {
      this.x += other.x;
      this.y += other.y;

      return this;
    } else if (typeof other === `number`) {
      this.x += other;
      this.y += other;

      return this;
    } else console.error(`Bad type.`, typeof other);
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
    } else console.error(`Bad type.`, typeof other, other);
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
    } else console.error(`Bad type.`, typeof other, other);
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
    } else console.error(`Bad type.`, typeof other);
  }

  min (other) {
    if (other instanceof Vector2) {
      this.x = Math.min(this.x, other.x);
      this.y = Math.min(this.y, other.y);

      return this;
    } else console.error(`Bad type.`, typeof other, other);
  }

  max (other) {
    if (other instanceof Vector2) {
      this.x = Math.max(this.x, other.x);
      this.y = Math.max(this.y, other.y);

      return this;
    } else console.error(`Bad type.`, typeof other, other);
  }

  floor () {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);

    return this;
  }

  limit (m) {
    // Limits this vector to a certain maximum magnitude.

    if (this.getMag() > m) return this.setMag(m);
    else return this;
  }
}

class FlowField {
  constructor (size) {
    this.size = size;
    this.shape = canvas.v.copy().div(this.size);
    
    this.field = [];
    for (let x = 0; x < size.x; x ++) {
      this.field[x] = [];
      for (let y = 0; y < size.y; y ++) this.field[x][y] = Vector2.fromPerlin(x / 10, y / 10);
    }
  }

  draw () {
    noFill(); stroke(colors.gray); strokeWeight(1); rectMode(CORNER);

    for (let x = 0; x < this.size.x; x ++) {
      for (let y = 0; y < this.size.y; y ++) {
        let coords = new Vector2(x, y);

        // Draw Box
        if (DEBUG.draw.boxes) {
          let topLeft = new Vector2(x, y).mult(this.shape);
          
          rect(topLeft.x, topLeft.y, this.shape.x, this.shape.y);
        }

        // Draw Vector
        if (DEBUG.draw.vectors) {
          let center = coords.copy().add(0.5).mult(this.shape);
          let end = this.field[x][y].copy().mult(this.shape).div(2).add(center);
  
          line(center.x, center.y, end.x, end.y);
        }
      }
    }
  }

  lookup (pos) {
    pos = pos.copy()
      .div(this.shape)
      .floor()
      .min(this.size)
      .max(Vector2.zero());

    return this.field[pos.x][pos.y].copy();
  }
}

class Ship {
  constructor (pos) {
    this.pos = pos;
    this.vel = Vector2.zero();
    this.acc = Vector2.zero();

    this.r = 5;
    this.maxForce = random(0.1, 0.5);
    this.maxSpeed = random(2, 5);
  }

  // static setupDraw () { fill(colors.white); stroke(colors.black); strokeWeight(1); }
  static setupDraw () { fill(colors.white); noStroke(); }

  follow () {
    // Finds the vector underneath of it, and adds that to it's acceleration.
    let force = flowField
      .lookup(this.pos)
      .mult(this.maxSpeed)
      .sub(this.vel)
      .limit(this.maxForce);

    this.acc.add(force);
  }

  step () {
    this.follow();

    this.vel
      .add(this.acc)
      .limit(this.maxSpeed);

    this.pos.add(this.vel);
    if (this.pos.x > canvas.w) this.pos.x -= canvas.w;
    else if (this.pos.x < 0) this.pos.x += canvas.w;
    if (this.pos.y > canvas.h) this.pos.y -= canvas.h;
    else if (this.pos.y < 0) this.pos.y += canvas.h;

    this.acc.mult(0);
  }

  draw () {
    circle(this.pos.x, this.pos.y, this.r);
  }
}

// Globals
let canvas = {
  e: null, // Canvas element

  w: null, // Canvas width
  h: null, // Canvas height
  v: null, // Canvas size vector
};

let colors = {};

let ships = [];

let flowField;

// Constants
const DEBUG = {
  draw: {
    boxes: false,
    vectors: true,
  }
}

// p5 Functions
function setup () {
  // Canvas
  canvas.e = createCanvas();
  canvas.e.parent(`container`);
  windowResized();

  // Variables
  noiseSeed(random(100e3));

  colors = {
    black: color(0),
    gray: color(128),
    white: color(255),

    green: color(0, 255, 0),
    blue: color(0, 0, 255),
    red: color(255, 0, 0),
  }

  flowField = new FlowField(new Vector2(50, 50));
}

function draw () {
  // Clearing
  background(colors.black);

  // Drawing Flowfield
  if (DEBUG.draw.boxes || DEBUG.draw.vectors) flowField.draw();

  // Updating Ships
  for (let ship of ships) ship.step();
  
  // Drawing Ships
  Ship.setupDraw();
  for (let ship of ships) ship.draw();
}

function windowResized () {
  const size = { w: window.innerWidth, h: window.innerHeight };

  canvas.w = size.w;
  canvas.h = size.h;
  canvas.v = new Vector2(canvas.w, canvas.h);

  resizeCanvas(size.w, size.h);
}

function mouseClicked () {
  let mouse = Vector2.fromMouse();

  ships.push(new Ship(mouse));
}