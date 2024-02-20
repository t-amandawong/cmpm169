// sketch.js - folklore lyrics displayer
// Author: Thanyared Wong
// Date: 2024.02.18

// Globals
const sizeOfText = 32;
const blobSize = 10;
const noiseScale = 0.001
const frameRate = 0.005
const songTitles = ['the_1', 
                        'cardigan', 
                        'the_last_great_american_dynasty', 
                        'exile', 
                        'my_tears_ricochet', 
                        'mirrorball', 
                        'seven', 
                        'august', 
                        'this_is_me_trying',
                        'illicit_affairs',
                        'invisible_string',
                        'mad_woman',
                        'epiphany',
                        'betty',
                        'peace',
                        'hoax',
                        'the_lakes']
let songsLyrics = []          
let canvasContainer;
let myFont;
let lyrics;
let title;
let currentLine = 0; // Index of the current line being displayed
let alpha = 0; // Opacity of the text
let fadingIn = true; // Whether the text is currently fading in or out
let lastChangeTime; // When the last fade change happened
let displayDuration = 1500; // How long to display each line fully visible
let fadeDuration = 1000; // Duration of fade in/out
let iter = 0 // line number on each stanza
let currentText = '';
let savedText = '';

function preload() {
    myFont = loadFont('./assets/FePIit2.ttf');
    songTitles.forEach((song) => {
        songsLyrics.push(loadStrings(`./assets/${song}.txt`))
    })
    lyrics = random(songsLyrics)
    let index = songsLyrics.indexOf(lyrics)
    title = songTitles[index].replace(/_/g, ' ')
    //lyrics = loadStrings('./assets/august.txt');
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
  
    for (let x = 0; x < width; x += blobSize) {
        for (let y = 0; y < height; y += blobSize) {
            let noiseVal = noise(x * noiseScale, y * noiseScale, frameCount * frameRate);
            let gray = map(noiseVal, 0, 1, 50, 255);
            fill(gray);
            noStroke();
            rect(x, y, blobSize, blobSize); // Draw the blob
        }
    }

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
    fill(0, 0, 0, alpha);
    curr_lyric = lyrics[currentLine].replace('"', '“', 1)
    text(curr_lyric, sizeOfText, (3 * sizeOfText) + (iter * sizeOfText))

    fill(255)
    text(title, sizeOfText, (1.5 * sizeOfText))
    text(currentText, sizeOfText, height - sizeOfText)
}

function keyPressed() {
    // Check if the key is alphabetical (a-z or A-Z)
    if (key.match(/^[a-zA-Z1]$/) || key === ' ') {
        currentText += key.toLowerCase(); // Append the pressed key to the current text
    }
    // Check if Enter/Return is pressed
    if (keyCode === ENTER || keyCode === RETURN) {
        savedText = currentText; // Save the current text
        currentText = ''; // Reset current text for new input

        song = savedText.replace(/ +/g, '_')
        song = song.trim()
        let index = songTitles.indexOf(song)
        if (index != -1) {
            lyrics = songsLyrics[index]
            title = savedText
        } else {
            lyrics = random(songsLyrics)
            let index = songsLyrics.indexOf(lyrics)
            title = songTitles[index].replace(/_/g, ' ')  
        }
        currentLine = 0;
        fadingIn = true;
        lastChangeTime = millis(); 
        iter = 0  
    }

    if (keyCode === BACKSPACE || keyCode === DELETE) {
        currentText = currentText.substring(0, currentText.length - 1);
    }
}