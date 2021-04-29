// Globals
let canvas = {
  e: null, // Canvas element

  w: null, // Canvas width
  h: null, // Canvas height
};

let colors = {};

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
    white: color(255),

    green: color(0, 255, 0),
    blue: color(0, 0, 255),
    red: color(255, 0, 0),
  }
}

function draw () {
  // Clearing
  background(colors.black);

  // Drawing
  noStroke(); rectMode(CORNERS);
  
  fill(colors.gray);
  rect(
    canvas.w * 1 / 6, canvas.h * 1 / 6,
    canvas.w * 5 / 6, canvas.h * 5 / 6
  );

  fill(colors.white);
  rect(
    canvas.w * 1 / 3, canvas.h * 1 / 3,
    canvas.w * 2 / 3, canvas.h * 2 / 3,
  );
}

function windowResized () {
  const size = { w: window.innerWidth, h: window.innerHeight };

  canvas.w = size.w;
  canvas.h = size.h;

  resizeCanvas(size.w, size.h);
}