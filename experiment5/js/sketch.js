// sketch.js - K-means Visualization 
// Author: Thanyared Wong
// Date: 2024.15.02

const sphereSize = 10;
const boxSize = 500;
const movementThreshold = 0.01; // Adjust based on your scale and accuracy needs

let iterationCount = 0;
let displayText = "";

let started = false;
let actionState = 'assign'
let animatingAssignment = false;
let animationProgress = 0;
let angleX = 0;
let angleY = 0;
let previousMouseX = 0;
let previousMouseY = 0;
let spheres = [];
let centroids = [];
let centroid_colors = ['pink', 'mediumseagreen', 'cornflowerblue', 'coral', 'darkorchid', 'firebrick', 'yellow', 'turquoise', 'rosybrown', 'hotpink'];
let assignments = []; // Track which centroid each sphere is assigned to
let updateClusters = false; // Flag to control the update of clusters
let lerpAmt = 0; // For animating centroid movement
let gfx;

function preload() {
  //myFont = loadFont('https://fonts.googleapis.com/css?family=Roboto');
}

function setup() {
  canvasContainer = $('#canvas-container');
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height(), WEBGL);
  canvas.parent("canvas-container");
  $(window).resize(function() {   //resize canvas if the page is resized
      console.log("resizing...");
      resizeCanvas(canvasContainer.width(), canvasContainer.height());
  });

  colorMode(RGB);
  gfx = createGraphics(1280, 720); // Same size as the canvas
  gfx.textSize(18); // Set text size for the 2D graphics context
  
  let minVal = (-boxSize / 2) + sphereSize;
  let maxVal = (boxSize / 2) - sphereSize;
  for (let i = 0; i < 44; i++) {
    let randomX = random(minVal, maxVal);
    let randomY = random(minVal, maxVal);
    let randomZ = random(minVal, maxVal);
    spheres.push(new Sphere(randomX, randomY, randomZ));
   }

  minVal *= 0.75;
  maxVal *= 0.75;
  for (let i = 0; i < 4; i++) {
    let randomX = random(minVal, maxVal);
    let randomY = random(minVal, maxVal);
    let randomZ = random(minVal, maxVal);
    centroids.push(new Centroid(randomX, randomY, randomZ, centroid_colors[i]));
  }
  assignPointsToCentroids();
}

function draw() {
  background(200);
  rotateX(angleX);
  rotateY(angleY);

  ambientLight(100);
  pointLight(250, 250, 250, 100, -100, 200);

  noFill();
  stroke(0);
  box(boxSize);

  // Draw lines and update point colors
  if (started) { // Only draw lines if started is true
    for (let i = 0; i < spheres.length; i++) {
      let s = spheres[i];
      let c = centroids[assignments[i]];
      
      if (animatingAssignment) {
        // Use the interpolated position for the line endpoint
        let interpPos = s.getInterpolatedPositionTowardsCentroid(c, animationProgress);
        stroke(c.color);
        line(s.x, s.y, s.z, interpPos.x, interpPos.y, interpPos.z);
      } else {
        // Draw line directly if not animating
        stroke(c.color);
        line(s.x, s.y, s.z, c.x, c.y, c.z);
      }     
      s.display(c.color)
    }
  } else {
    spheres.forEach(s => {
       stroke(color(255))
      s.display(color(255)); // Optionally display spheres without connections before starting
    });
  }
  
  if (animatingAssignment) {
    animationProgress += 0.05; // Increment animation progress
    if (animationProgress >= 1) {
      animatingAssignment = false; // Stop animating once complete
    }
  }

  noStroke();
  // Animate centroids moving and display
  if (lerpAmt < 1 && updateClusters) {
    lerpAmt += 0.05; // Adjust speed of centroid movement
    centroids.forEach(c => c.lerpToTarget(lerpAmt));
  } else if (lerpAmt >= 1) {
    updateClusters = false; 
  }

  centroids.forEach(c => c.display());
  
  // Use the 2D graphics buffer to draw text
  gfx.clear(); // Clear previous frame's text to avoid overlaying text on itself
  gfx.text(`Iteration: ${iterationCount} - ${displayText}`, 20, 20);
  //gfx.text(`Iteration: ${iterationCount} - ${displayText}`, 20, 40);

  // Draw the 2D graphics buffer onto the WEBGL canvas
  image(gfx, -width / 2, -height / 2); // Adjust positioning as needed
}

function mousePressed() {
  // Store the mouse position at the start of the drag
  previousMouseX = mouseX;
  previousMouseY = mouseY;
}

function mouseDragged() {
  // Calculate the difference in mouse position
  let dx = mouseX - previousMouseX;
  let dy = mouseY - previousMouseY;

  // Update the rotation angles based on the mouse movement
  angleY += radians(dx);
  angleX += radians(dy);

  // Update the previous mouse position
  previousMouseX = mouseX;
  previousMouseY = mouseY;
}
function keyPressed() {
  if (key === ' ' || keyCode === 32) {
    started = true; // Ensure the visualization has started
    if (actionState === 'assign') {
      assignPointsToCentroids(); // Assign points to centroids
      actionState = 'update'; // Next action will be to update centroid positions
      animatingAssignment = true;
      animationProgress = 0
      displayText = "Assigning points to centroids"
      iterationCount++
    } else if (actionState === 'update') {
      updateCentroidPositions(); // Update centroid positions
      lerpAmt = 0; // Reset lerp amount for smooth animation of centroids
      actionState = 'assign'; // Next action will be to assign points
      updateClusters = true; // Ensure clusters will be updated on the next draw cycle
      displayText = "Updating centroid positions"
    }
    return false; // Prevent default behavior
  }
}

// Sphere class
class Sphere {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  display(col) {
    push();
    translate(this.x, this.y, this.z);
    fill(col);
    sphere(sphereSize, 16, 16);
    pop();
  }
  
  getInterpolatedPositionTowardsCentroid(centroid, amt) {
    return {
      x: lerp(this.x, centroid.x, amt),
      y: lerp(this.y, centroid.y, amt),
      z: lerp(this.z, centroid.z, amt)
    };
  }
}

// Centroid class
class Centroid {
  constructor(x, y, z, color) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.color = color;
    this.targetX = x;
    this.targetY = y;
    this.targetZ = z;
    this.moveDistance = 0
  }

  lerpToTarget(amt) {
    this.x = lerp(this.x, this.targetX, amt);
    this.y = lerp(this.y, this.targetY, amt);
    this.z = lerp(this.z, this.targetZ, amt);
  }

  setTarget(x, y, z) {
    this.moveDistance = dist(this.x, this.y, this.z, x, y, z)
    this.targetX = x;
    this.targetY = y;
    this.targetZ = z;
  }

  display() {
    push();
    translate(this.x, this.y, this.z);
    fill(this.color);
    sphere(15, 16, 16);
    pop();
  }
}

// Update centroid positions to the mean of assigned points and set new target for animation
function updateCentroidPositions() {
  let minimalMovement = true
  let sums = Array(centroids.length).fill(0).map(() => createVector(0, 0, 0));
  let counts = Array(centroids.length).fill(0);

  for (let i = 0; i < spheres.length; i++) {
    let centroidIndex = assignments[i];
    sums[centroidIndex].add(createVector(spheres[i].x, spheres[i].y, spheres[i].z));
    counts[centroidIndex]++;
  }

  for (let i = 0; i < centroids.length; i++) {
    if (counts[i] > 0) {
      centroids[i].setTarget(
        sums[i].x / counts[i],
        sums[i].y / counts[i],
        sums[i].z / counts[i]
      );
    }
  }
}

// Assign points to the nearest centroid and prepare for animation by resetting lerpAmt
function assignPointsToCentroids() {
  assignments = [];
  for (let i = 0; i < spheres.length; i++) {
    let minDist = Infinity;
    let closestCentroid = 0;
    for (let j = 0; j < centroids.length; j++) {
      let dist = dist3d(spheres[i].x, spheres[i].y, spheres[i].z, centroids[j].x, centroids[j].y, centroids[j].z);
      if (dist < minDist) {
        minDist = dist; 
        closestCentroid = j;
      }
    }
    assignments[i] = closestCentroid;
  }
}

// Helper function to calculate 3D distance
function dist3d(x1, y1, z1, x2, y2, z2) {
  return sqrt(sq(x2 - x1) + sq(y2 - y1) + sq(z2 - z1));
}
