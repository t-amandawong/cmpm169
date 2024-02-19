// sketch.js - Text Art
// Author: Thanyared Wong
// Date: 2024.02.18

// Globals
const sizeOfText = 32;
let canvasContainer;
let myFont;
let lyrics;
let currentLine = 0; // Index of the current line being displayed
let alpha = 0; // Opacity of the text
let fadingIn = true; // Whether the text is currently fading in or out
let lastChangeTime; // When the last fade change happened
let displayDuration = 1500; // How long to display each line fully visible
let fadeDuration = 1000; // Duration of fade in/out
let iter = 0 // line number on each stanza

function preload() {
    myFont = loadFont('./assets/FePIit2.ttf');
    lyrics = loadStrings('./assets/folklore.txt');
}

function setup() {
    // place our canvas, making it fit our container
    canvasContainer = $("#canvas-container");
    let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
    canvas.parent("canvas-container");
    // resize canvas is the page is resized
    $(window).resize(function() {
        console.log("Resizing...");
        resizeCanvas(canvasContainer.width(), canvasContainer.height());
    });

    textFont(myFont, sizeOfText);
    lastChangeTime = millis()
}

function draw() {
    background(220); 

    let currentTime = millis()
    let timeElapsedSinceChange = currentTime - lastChangeTime
    if (fadingIn) {
        if (timeElapsedSinceChange < fadeDuration) {
            alpha = map(timeElapsedSinceChange, 0, fadeDuration, 0, 255)
        } else {
            alpha = 255;
            if (timeElapsedSinceChange > fadeDuration + displayDuration) {
                fadingIn = false;
                lastChangeTime = currentTime
            }
        }
    } else {
        if (timeElapsedSinceChange < fadeDuration) {
            alpha = map(timeElapsedSinceChange, 0, fadeDuration, 255, 0)
        } else {
            currentLine = (currentLine + 1) % lyrics.length
            fadingIn = true;
            lastChangeTime = currentTime
            if (lyrics[currentLine].length == 0) {
                iter = -1
            } else {
                iter += 1
            }
        }
    }
    print(iter)
    fill(0, 0, 0, alpha);
    text(lyrics[currentLine], sizeOfText, (2 * sizeOfText) + (iter * sizeOfText))
}

function mousePressed() {
    // code to run when mouse is pressed
}