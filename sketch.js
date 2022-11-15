// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter
// add also Benedict Gross credit


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


var engine;
var propeller;
let boxes = [];
var birds = [];
var colors = [];
var ground;
var slingshotBird, slingshotConstraint;
var angle = 0;
var angleSpeed = 0;
var canvas;
let timer = 60;  
////////////////////////////////////////////////////////////
function setup() {
  canvas = createCanvas(1000, 600);

  engine = Engine.create();  // create an engine


  setupGround();

  setupPropeller();

  setupTower();

  

  setupMouseInteraction();
  setupSlingshot();
}
////////////////////////////////////////////////////////////
function draw() {
  background(0);

  Engine.update(engine);


  CountDown();

  drawGround();

  drawPropeller();

  drawTower();

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

function StartGame(){
  //some code here to start the game. q
  start = "to start the game press space bar"
  text(start, width/2,height/2);
}

function GameOver(){
  text("game over! ", width/2, height/2)
  noLoop();
}

function CountDown(){
  fill(255)
  strokeWeight(0);
  textAlign(CENTER, CENTER);
  textSize(45);
  text(timer + 'sec', width- 100, height /8);
  if(keyCode === 32){
    if(frameCount % 60 == 0 && timer > 0){
      timer--
    }
  
  }

  if(timer == 0){
    GameOver();
  }
}
//**********************************************************************
//  HELPER FUNCTIONS - DO NOT WRITE BELOW THIS line
//**********************************************************************

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
  return (pos.y > height || pos.x < 0 || pos.x > width);
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
