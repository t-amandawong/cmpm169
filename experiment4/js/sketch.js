// sketch.js - Images, Video, and Sound Art
// Author: Thanyared Wong
// Date: 2024.02.05

// Globals
let bg, vocals, bg_fft, vocals_fft, img, mask; 
let angle = 0, timesPressed = 0;
let stickers = []

function preload() {
    bg = loadSound('./media/beautiful_monster_instrumental.mp3')
    vocals = loadSound('./media/beautiful_monster_acapella.mp3')
    img = loadImage('./media/STAYC_WE_NEED_LOVE.png')
    for (let i = 1; i <=21; i++) {
        let filename = './media/stickers/' + i + '.png'
        images.push(loadImage(filename))
    }
}

let currentImage = {
    img: null,
    x: 0,
    y: 0,
    startTime: 0,
    displayTime: 0, // How long to display before fading starts
    fadeDuration: 1000, // Duration of the fade-out effect in milliseconds
    isFading: false,
    imgTransparency: 255
  };

// setup() function is called once when the program starts
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

    imageMode(CENTER)
    img.resize(300, 300);
    let mask = createGraphics(300, 300)
    mask.fill(255)
    mask.ellipse(mask.width/2, mask.height/2, 300, 300)

    mask.erase()
    mask.ellipse(mask.width/2, mask.height/2, 75, 75)
    mask.noErase()

    img.mask(mask)

    angleMode(DEGREES)
    colorMode(HSB, 360, 100, 100);

    bg_fft = new p5.FFT()
    bg_fft.setInput(bg)
    vocals_fft = new p5.FFT()
    vocals_fft.setInput(vocals)

}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
    background(25,15,70)
    stroke(4, 0, 90)
    strokeWeight(2)
    noFill()

    if (bg.isPlaying()) {
        angle += 1
    }

    push()
    translate(width/2, height/2)
    rotate(angle)
    image(img, 0, 0)
    pop()
    ellipse(width/2, height/2, 50, 50)
    stroke(4, 0, 90, 75)
    strokeWeight(8)
    ellipse(width/2, height/2, 62.5, 62.5)

    strokeWeight(3)

    let bg_wave = bg_fft.waveform(); // Get the frequency spectrum
    let vocals_wave = vocals_fft.waveform();
    let max_bg = max(bg_wave)
    let max_vocal = max(vocals_wave)
    let hue_bg = map(max_bg, 0, 1, 0, 360);
    let hue_vocal = map(max_vocal, 0, 1, 0, 360);

    stroke(hue_bg, 38, 100)
    for(let t = -1; t <= 1; t += 2) {
        beginShape();
        for (let i = 0; i <= 180; i += 0.5) {
            let index = floor(map(i, 0, 180, 0, bg_wave.length - 1))
            let r = map(bg_wave[index], -1, 1, 150, 350)

            let x = r * sin(i) * t
            let y = r * cos(i)
            vertex(x + width/2, y + height/2)
        }
        endShape();
    }

    stroke(hue_vocal, 38, 100)
    for(let t = -1; t <= 1; t += 2) {
        beginShape();
        for (let i = 0; i <= 180; i += 0.5) {
            let index = floor(map(i, 0, 180, 0, vocals_wave.length - 1))
            let r = map(vocals_wave[index], -1, 1, 100, 200)

            let x = r * sin(i) * t
            let y = r * cos(i)
            vertex(x + width/2, y + height/2)
        }
        endShape();
    }
}

function mousePressed() {
    if (bg.isPlaying()) {
        bg.pause()
        vocals.pause()
    } else {
        bg.play(0, 1, 1, 0.5)
        vocals.play(0, 1, 1, 0.5)
    }
}