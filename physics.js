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
  // your code here
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
    restitution: 0.95
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
    drawVertices(element.vertices)
    if (isOffScreen(element)) {    //remove objects that are off-screen
      Composite.remove(engine.world, element);
      birds.splice(element, 1);
    }
    // console.log(birds)
  }
  pop();
}
////////////////////////////////////////////////////////////////
//creates a tower of boxes
function setupTower() {
  //you code here
  // Make a single rectangle
  function makeRect(x, y) {
    var box = Bodies.rectangle(x, y, 80, 80);
    return box;
  }
  //Matter.Composites.stack(xx, yy, columns, rows, columnGap, rowGap, callback) 
  var stack = Composites.stack(width - 400, 2, 3, 6, 0, 0, makeRect);
  boxes = stack.bodies;

  //generating random shades of green using randomColor.js library, count to 18 for each box in the stack.
  let shadesofgreen = randomColor({ hue: 'green', luminosity: 'dark', count: 18 })
  //pushing the shades of the green into the colors array.
  for (const element of shadesofgreen) {
    colors.push(element)
  }

  console.log('greens', shadesofgreen)
  console.log('colors array', colors)
  Composite.add(engine.world, [stack]);
}
////////////////////////////////////////////////////////////////
//draws tower of boxes
function drawTower() {
  push();
  noStroke();
  //draw each box in different shade of green.
  boxes.forEach((element, i) => {
    fill(colors[i])
    drawVertices(element.vertices)
  })
  pop();
}
////////////////////////////////////////////////////////////////
function setupSlingshot() {
  //
  //Bodies.circle(x, y, radius, [options], [maxSides]) 
  slingshotBird = Bodies.circle(width / 4, 100, 20, { friction: 0, restitution: 0.95 });
  slingshotConstraint = Constraint.create({
    pointA: { x: width / 4, y: 80 },
    bodyB: slingshotBird,
    pointB: { x: -15, y: -2 },
    stiffness: 0.01,
    damping: 0.0001
  });
  Composite.add(engine.world, [slingshotBird, slingshotConstraint]);


}
////////////////////////////////////////////////////////////////
//draws slingshot bird and its constraint
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
