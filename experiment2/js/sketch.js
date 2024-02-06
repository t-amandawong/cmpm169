// sketch.js - Heartstrings: an interactive heart you can play with
// Author: Thanyared Wong
// Date: 2024.01.22

// 

let t = []
let numPoints = 30;
let scaleFactor = 15;
let speed = 0.01    // speed that dots are moving
let lineWeight = 2;

function setup() {
    canvasContainer = $('#canvas-container');
    let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
    canvas.parent("canvas-container");
    $(window).resize(function() {   //resize canvas if the page is resized
        console.log("resizing...");
        resizeCanvas(canvasContainer.width(), canvasContainer.height());
    });

    // initialize t values for each dot
    for (let i = 0; i < numPoints; i++) {
        t.push(map(i, 0, numPoints, 0, TWO_PI)) // distribute dots evenly along the heart path
    }
}

function draw() {
    background(0);

    // map mouse X position to the red component (0 at left, 255 at right)
    // map mouse Y position to the green and blue components (255 at top, 0 at bottom)
    let redValue = map(mouseX, 0, width, 255, 255);
    let greenBlueValue = map(mouseY, 0, height, 255, 0);

    stroke(redValue, greenBlueValue, greenBlueValue);

    for (let i = 0; i < numPoints; i++) {
        // heart parametric equations with scaling
        let x = 16 * pow(sin(t[i]), 3);
        let y = (13 * cos(t[i]) - 5 * cos(2 * t[i]) - 2 * cos(3 * t[i]) - cos(4 * t[i]));

        // draw each dot, centered and scaled
        strokeWeight(7);
        let px = (width / 2) + (scaleFactor * x);
        let py = (height / 2) - (scaleFactor * y);
        point(px, py);

        //draw line between dot and mouse
        strokeWeight(lineWeight);
        line(px, py, mouseX, mouseY);

        // increment t for each dot
        t[i] += speed
        if (t[i] > TWO_PI) {
            t[i] -= TWO_PI // reset t once it completes a loop
        }
    }
}

function keyPressed() {
    if (key == ' ') { // space bar is pressed
        // change lines to visible or not
        lineWeight = (lineWeight == 2) ? 0 : 2;
    }
}

function mousePressed() {
    // change speed from normal to double & vice versa
    speed = (speed == 0.01) ? 0.02 : 0.01;
}