let t = 0;
let fourier = [];
let X = [];
let path = [];
let scale = 0;
let coordx = [];
let coordy = [];
const prevbtn = document.getElementById("prev");
const nextbtn = document.getElementById("next");
let index = 0;
let a = 0;
let grey = false;
drawing2.reverse();
drawing7.reverse();
drawing8.reverse();
let alldrawing = [
  drawing10,
  drawing0,
  drawing1,
  drawing2,
  drawing3,
  drawing4,
  drawing5,
  drawing6,
  drawing7,
  drawing8,
  drawing9,
];
nextbtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (index < alldrawing.length - 1) {
    index++;
  } else {
    index = 0;
  }
  reset();
});
prevbtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (index > 0) {
    index--;
  } else {
    index = alldrawing.length - 1;
  }
  reset();
});

function reset() {
  t = 0;
  fourier = [];
  X = [];
  path = [];
  coordx = [];
  coordy = [];
  let avgx = 0;
  let avgy = 0;
  drawing = alldrawing[index];
  for (let i = 0; i < drawing.length; i += 8) {
    let x = drawing[floor(i)][0];
    let y = drawing[floor(i)][1];
    coordx.push(x);
    coordy.push(y);
    X.push(createVector(x, y));
  }
  coordx.sort((a, b) => a - b);
  coordy.sort((a, b) => a - b);
  const scaley = (windowHeight * 0.8) / (coordy[coordy.length - 1] - coordy[0]);
  const scalex = (windowWidth * 0.8) / (coordx[coordx.length - 1] - coordx[0]);
  scale = scalex < scaley ? scalex : scaley;
  avgx = (coordx[coordx.length - 1] + coordx[0]) / 2;
  avgy = (coordy[coordy.length - 1] + coordy[0]) / 2;
  X.forEach((vector) => {
    vector.add(createVector(-avgx, -avgy));
    vector.mult(scale);
  });
  fourier = dft(X);
  fourier.sort((a, b) => b.amp - a.amp);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  reset();
}

function draw() {
  background(0);
  frameRate(144);
  epicycles(fourier, t, path);
  t += 1 / fourier.length;
  if (t >= 1) {
    t = 0;
  }
}

function epicycles(fourier, t, path) {
  let x = width / 2;
  let y = height / 2;
  fourier.forEach((cycle) => {
    const w = TWO_PI * cycle.freq;
    let xold = x;
    let yold = y;
    x += cycle.amp * cos(w * t + cycle.phase);
    y += cycle.amp * sin(w * t + cycle.phase);
    drawArrow(xold, yold, x, y, cycle.amp);
    drawcircles(xold, yold, cycle.amp, cycle.freq);
  });

  path.push(createVector(x, y));
  if (path.length >= 0.8 * X.length) {
    path.shift();
  }
  drawpath(path);
}

function drawpath(path) {
  stroke(220, 210, 0);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 0; i < path.length; i++) {
    curveVertex(path[i].x, path[i].y);
  }
  endShape();
}

function drawArrow(xold, yold, x, y, scal) {
  scal *= 0.5;
  scal = constrain(scal, 0, 30);
  v = createVector(x - xold, y - yold);
  v.mult(0.99);
  push();
  colorMode(HSB);
  fill(200, 0.8);
  translate(x, y);
  rotate(v.heading());
  strokeWeight(0);
  triangle(-0.6 * scal, -0.3 * scal, 0, 0, -0.6 * scal, 0.3 * scal);
  pop();

  push();
  colorMode(HSB);
  strokeCap(ROUND);
  stroke(200, 0.7);
  strokeWeight(2.5);
  translate(xold, yold);
  line(0, 0, v.x, v.y);
  pop();
}

function drawcircles(x, y, l, freq) {
  push();
  colorMode(HSB);
  if (grey) {
    stroke(0, 0, 33, 0.8);
  } else {
    stroke(196, 68, 33, 0.8);
  }
  noFill();
  strokeWeight(2);
  circle(x, y, 2 * l);
  grey = !grey
  pop();
}
