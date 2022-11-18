////////////////////////////////////////////////////////////////
function setupGround() {
  ground = Bodies.rectangle(500, 600, 1000, 40, {
    isStatic: true, angle: 0
  });
  Composite.add(engine.world, [ground]);
}

////////////////////////////////////////////////////////////////
function drawGround() {
  push();
  fill(128);
  drawVertices(ground.vertices);
  pop();
}
////////////////////////////////////////////////////////////////
function setupPropeller() {
  // your code here
  propeller = Bodies.rectangle(150, 480, 200, 15, {
    isStatic: true, angle: 0
  });
  Composite.add(engine.world, [propeller])


}
////////////////////////////////////////////////////////////////
//updates and draws the propeller
function drawPropeller() {
  push();

  fill(255, 100, 0);
  drawVertices(propeller.vertices);
  Body.setAngle(propeller, angle);  // to change the angle of the propeller on screen
  Body.setAngularVelocity(propeller, angleSpeed); // the propeller moves at a rate of angleSpeed between frames. 
  angle += angleSpeed;

  pop();
}
////////////////////////////////////////////////////////////////
function setupBird() {
  var bird = Bodies.circle(mouseX, mouseY, 20, {
    friction: 0,
    restitution: .95
  });
  Matter.Body.setMass(bird, bird.mass * 10);
  Composite.add(engine.world, [bird]);
  birds.push(bird);
}
////////////////////////////////////////////////////////////////
function drawBirds() {
  push();
  //your code here
  for (const element of birds) {
    fill(255, 100, 100)
    drawVertices(element.vertices)
    if (isOffScreen(element)) {    //remove objects that are off-screen
      removeFromWorld(element);
      birds.splice(element, 1);
    }
    // console.log(birds)
  }
  pop();
}
////////////////////////////////////////////////////////////////
//creates a tower of boxes
function setupTower() {
  // Make a single rectangle
  function makeRect(x, y) {
    var box = Bodies.rectangle(x, y, 80, 80, { isStatic: false });
    return box;
  }
  //Matter.Composites.stack(xx, yy, columns, rows, columnGap, rowGap, callback) 
  //create a tower of boxes, six boxes high, three boxes wide.
  var stack = Composites.stack(width - 400, 100, 3, 6, 0, 0, makeRect);
  boxes = stack.bodies; //pushing the rectangle bodies to boxes array.

  //generating random shades of green using randomColor.js library, count to 18 for each box in the stack.
  let shadesofgreen = randomColor({ hue: 'green', luminosity: 'dark', count: 18 })
  //pushing the shades of the green into the colors array.
  for (const element of shadesofgreen) {
    colors.push(element)
  }

  console.log('greens', shadesofgreen)
  console.log('colors array', colors)
  //add the tower to the world.
  Composite.add(engine.world, [stack]);
}
////////////////////////////////////////////////////////////////
//draws tower of boxes.
function drawTower() {
  push();
  noStroke();
  let countBoxes = boxes.length;
  console.log('num of boxes', countBoxes)
  //draw each box in different shade of green.
  boxes.forEach((element, i) => {
    fill(colors[i])
    drawVertices(element.vertices)
    if (isOffScreen(element)) {  //remove boxes that are off-screen from array.
      // removeFromWorld(element);
      boxes.splice(element, 1);
    }
  });
  //draw a counter of boxes left on the screen. 
  fill(255)
  textSize(25);
  text('boxes left : ' + countBoxes, 100, 50);
  pop();
}
////////////////////////////////////////////////////////////////
//setup the pyramid of reclangles.
function setupPyramid() {

  function makerects(x, y) {
    var box = Bodies.rectangle(x, y, 20, 40);
    return box;
  }
  //Matter.Composites.pyramid(xx, yy, columns, rows, columnGap, rowGap, callback) 
  var pyramid = Composites.stack(width - 600, 100, 1, 12, 0, 0, makerects);

  circles = pyramid.bodies;
  Composite.add(engine.world, [pyramid])
}
////////////////////////////////////////////////////////////////
//draws the pyramid of rectangles.
function drawPyramid() {
  push();
  // strokeWeight(2)
  noStroke()
  circles.forEach((element, i) => {
    fill(255);
    drawVertices(element.vertices);

  })
  pop();
}
////////////////////////////////////////////////////////////////
function setupSlingshot() {

  //Bodies.circle(x, y, radius, [options], [maxSides]) ]
  slingshotBird = Bodies.circle(width / 5, 170, 20, { friction: 0, restitution: .95 });
  slingshotConstraint = Constraint.create({
    pointA: { x: width / 5, y: 150 },
    bodyB: slingshotBird,
    pointB: { x: -2, y: -2 },
    stiffness: 0.01,
    damping: 0.0001
  });
  Matter.Body.setMass(slingshotBird, slingshotBird.mass * 10); //set the mass * 10 its original mass.
  Composite.add(engine.world, [slingshotBird, slingshotConstraint]);


}
////////////////////////////////////////////////////////////////
//draws slingshot bird and its constraint.
function drawSlingshot() {
  push();
  // your code here
  fill(207, 200, 81);
  drawVertices(slingshotBird.vertices);
  stroke(128);
  strokeWeight(2);
  drawConstraint(slingshotConstraint);
  pop();
}
/////////////////////////////////////////////////////////////////
function setupMouseInteraction() {
  var mouse = Mouse.create(canvas.elt);
  var mouseParams = {
    mouse: mouse,
    constraint: { stiffness: 0.05 }
  }
  mouseConstraint = MouseConstraint.create(engine, mouseParams);
  mouseConstraint.mouse.pixelRatio = pixelDensity();
  Composite.add(engine.world, mouseConstraint);
}
