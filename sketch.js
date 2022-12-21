// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter

// module aliases
const Engine = Matter.Engine,
  Render = Matter.Render,
  Composite = Matter.Composite,
  Bodies = Matter.Bodies,
  Composites = Matter.Composites,
  Body = Matter.Body,
  Constraint = Matter.Constraint,
  Mouse = Matter.Mouse,
  MouseConstraint = Matter.MouseConstraint;


//global variables
var engine;
var propeller;
let boxes = [];
let circles = [];
var birds = [];
var colors = [];
var ground;
var slingshotBird, slingshotConstraint;
var angle = 0;
var angleSpeed = 0;
var canvas;
let timeLimit = 60, currentTime = 0, startTime = 0;
let elapsedtime;

////////////////////////////////////////////////////////////
function setup() {
  canvas = createCanvas(1000, 600);
  frameRate(30) //set frame rate to 30 frames every second
  engine = Engine.create();  // create an engine

  setupGround();
  setupPropeller();
  setupTower();
  // setupPyramid();
  setupMouseInteraction();
  setupSlingshot();
}
////////////////////////////////////////////////////////////
function draw() {
  background(0);

  Engine.update(engine);

  CountDown();
  StartGame()
  drawGround();
  drawPropeller();
  drawTower();
  // drawPyramid();
  drawBirds();
  drawSlingshot();
}
////////////////////////////////////////////////////////////
//use left and right arrow keys to control the propeller on screen 
function keyPressed() {
  if (keyCode == LEFT_ARROW) {
    //if left arrow is pressed the angle speed is incremented by 0.01. 
    angleSpeed += 0.01;
  }
  else if (keyCode == RIGHT_ARROW) {
    //if right arrow is pressed the angle speed is decremented by 0.01.
    angleSpeed -= 0.01;
  }

}
////////////////////////////////////////////////////////////
function keyTyped() {
  //if 'b' create a new bird to use with propeller
  if (key === 'b') {
    setupBird();
  }

  //if 'r' reset the slingshot
  if (key === 'r') {
    removeFromWorld(slingshotBird);
    removeFromWorld(slingshotConstraint);
    setupSlingshot();
  }
}
////////////////////////////////////////////////////////////
function StartGame() {
  //instructions to start the game. 
  elapsedtime = millis();
  if (elapsedtime < 4000) {
    fill(255)
    strokeWeight(0);
    textAlign(CENTER, CENTER);
    textSize(25);
    start = "you have to remove all boxes\n from screen within 60 seconds\n use the b to shoot birds";
    text(start, width / 2, height / 11);
  }

}
////////////////////////////////////////////////////////////
//call gameOver when countdown timer of 60s is passed.
function GameOver() {
  text("game over! ", width / 2, height / 2);
  noLoop();
}
//returns the converted number into min:sec.
function convertSeconds(s) {
  var min = floor(s / 60);
  var sec = s % 60;
  return nf(min, 2) + ':' + nf(sec, 2);
}
////////////////////////////////////////////////////////////

//compute how much time is left
//timer start at 01:00, if time left is equal to 0 gameOver is called.
function CountDown() {
  startTime = millis();
  fill(255);
  strokeWeight(0);
  textAlign(CENTER, CENTER);
  textSize(45);
  timer = convertSeconds(timeLimit - currentTime);
  text(timer, width - 100, height / 8);
  currentTime = floor((millis() - startTime) / 1000);
  if (frameCount % 60 == 0 && timeLimit > 0) {
    timeLimit--;
  }
  if (timeLimit == 0) {
    GameOver();
  }
}
////////////////////////////////////////////////////////////
//  HELPER FUNCTIONS 
//if mouse is released destroy slingshot constraint so that
//slingshot bird can fly off
function mouseReleased() {
  setTimeout(() => {
    slingshotConstraint.bodyB = null;
    slingshotConstraint.pointA = { x: 0, y: 0 };
  }, 100);
}
////////////////////////////////////////////////////////////
//tells you if a body is off-screen
function isOffScreen(body) {
  var pos = body.position;
  return (pos.y > height + 200 || pos.x < 0 || pos.x > width + 100);
}
////////////////////////////////////////////////////////////
//removes a body from the physics world
function removeFromWorld(body) {
  Composite.remove(engine.world, body);
}
////////////////////////////////////////////////////////////
function drawVertices(vertices) {
  beginShape();
  for (const element of vertices) {
    vertex(element.x, element.y);
  }
  endShape(CLOSE);
}
////////////////////////////////////////////////////////////
function drawConstraint(constraint) {
  push();
  var offsetA = constraint.pointA;
  var posA = { x: 0, y: 0 };
  if (constraint.bodyA) {
    posA = constraint.bodyA.position;
  }
  var offsetB = constraint.pointB;
  var posB = { x: 0, y: 0 };
  if (constraint.bodyB) {
    posB = constraint.bodyB.position;
  }
  strokeWeight(5);
  stroke(255);
  line(
    posA.x + offsetA.x,

    posA.y + offsetA.y,
    posB.x + offsetB.x,
    posB.y + offsetB.y
  );
  pop();
}
