// sketch.js - Halzion (Generative Methods)
// Author: Thanyared Wong
// Date: 2024.01.29

// this function made with help from ChatGPT
// draws a vertical gradient given x, y, width, height, and start and end colors
function verticalGradient(x, y, w, h, startColour, endColour) {
    for (let i = y; i <= y + h; i++) {
        // Calculate the interpolation amount
        let inter = map(i, y, y + h, 0, 1)

        // Get the color at the current slice
        let c = lerpColor(startColour, endColour, inter)

        stroke(c)
        line(x, i, x + w, i)
    }
}

// this function made with help from ChatGPT
// draws a horizontal gradient given x, y, width, height, and start and end colors
function horizontalGradient(x, y, w, h, startColour, endColour) {
    for (let i = x; i <= x + w; i++) {
        // Calculate the interpolation amount
        let inter = map(i, x, x + w, 0, 1)

        // Get the color at the current slice
        let c = lerpColor(startColour, endColour, inter)

        stroke(c)
        line(i, y, i, y + h)
    }
}

// window class draws each pop-up window
class Window {
    constructor(x, y, w, h, sc, ec, lc) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.sc = sc
        this.ec = ec
        this.lc = lc
    }

    // draws window
    show() {
        let borderWidth = 5
        let barHeight = 25
        let startX = this.x + borderWidth
        let mainWidth = this.w - (2 * borderWidth)
        let buttonSize = barHeight - 9
        let borderColor = color(241, 241, 244)
        let highColor = color(196, 210, 215)
        let shadowColor = color(101, 102, 119)
        let buttonColor = color(52, 52, 54)

        // window border
        noStroke()
        fill(borderColor)
        rect(this.x, this.y, this.w, this.h)
        this.drawShadow(this.x, this.y, this.w, this.h, highColor, 0)

        // draw gradient for top bar
        let topY = this.y + borderWidth
        let startColor = color(79, 0, 235)
        let endColor = color(235, 166, 236)
        horizontalGradient(startX, topY, mainWidth, barHeight, startColor, endColor)

        // draw gradient for main display
        let displayY = this.y + (2 * borderWidth) + barHeight
        let displayH = this.h - ((3 * borderWidth) + barHeight)
        verticalGradient(startX, displayY, mainWidth, displayH, this.sc, this.ec)

        // main display shadows
        this.drawShadow(startX, displayY, mainWidth, displayH, shadowColor, highColor)

        // draw buttons
        noStroke()
        fill(borderColor)
        let endButtonX = this.x + this.w - (5 * borderWidth)
        let midButtonX = endButtonX - buttonSize - borderWidth
        let firButtonX = midButtonX - buttonSize - borderWidth
        let buttonY = this.y + (2 * borderWidth)
        rect(endButtonX, buttonY, buttonSize, buttonSize)
        rect(midButtonX, buttonY, buttonSize, buttonSize)
        rect(firButtonX, buttonY, buttonSize, buttonSize)

        // button shadows
        this.drawShadow(firButtonX, buttonY, buttonSize, buttonSize, highColor, shadowColor)
        this.drawShadow(midButtonX, buttonY, buttonSize, buttonSize, highColor, shadowColor)
        this.drawShadow(endButtonX, buttonY, buttonSize, buttonSize, highColor, shadowColor)

        // button symbols

        // window symbol
        noFill()
        strokeWeight(2)
        stroke(buttonColor)
        rect(endButtonX + 3, buttonY + 3, 10, 10)
        line(endButtonX + 3, buttonY + 5, endButtonX + 13, buttonY + 5)

        // ? and X symbol
        noStroke(0)
        fill(buttonColor)
        textSize(15)
        textAlign(CENTER, CENTER)
        text('?', midButtonX + (buttonSize * 0.5), buttonY + (buttonSize * 0.5))
        text('X', firButtonX + (buttonSize * 0.5), buttonY + (buttonSize * 0.5))

        // draw a shape in the window
        this.drawShape(startX, displayY, mainWidth, displayH, borderWidth)
    }

    // helps draws shadows given x, y, width, height, and shadow colors
    drawShadow(x, y, w, h, topShadow, bottomShadow) {
        strokeWeight(2)
        stroke(bottomShadow)
        line(x, y + h, x + w, y + h)
        line(x + w, y, x + w, y + h)
        stroke(topShadow)
        line(x, y, x + w, y)
        line(x, y, x, y + h)
    }

    // draws a random shape in each window using lines
    drawShape(x, y, w, h, borderWidth) {
        stroke(this.lc)

        // random number of sides in shape
        let sides = random(3, 11)

        // starting x & y value
        let startX = random(x + borderWidth, x + w - borderWidth)
        let startY = random(y + borderWidth, y + h - borderWidth)

        let currX = startX
        let currY = startY

        // loop randomly generates end points
        for (let i = 0; i < sides; i++) {
            let tempX = random(x + borderWidth, x + w - borderWidth)
            let tempY = random(y + borderWidth, y + h - borderWidth)

            line(currX, currY, tempX, tempY)

            currX = tempX
            currY = tempY
        }

        // line that connects start and end points
        line(currX, currY, startX, startY)

    }
}



function setup() {
    let canvas = createCanvas(1280, 720);
    canvas.parent("canvas-container");
    frameRate(10)

    // preset gradient start and end colors
    let cyanGradient = [color(119, 212, 231), color(203, 254, 244)]
    let periGradient = [color(145, 155, 245), color(162, 217, 251)]
    let pinkGradient = [color(249, 243, 254), color(242, 224, 252)]
    let magentaGradient = [color(192, 77, 246), color(239, 168, 246)]
    let sunsetGradient = [color(248, 214, 213), color(243, 184, 231)]

    // consolidate all gradients into one list
    allGradients = [cyanGradient, periGradient, pinkGradient, magentaGradient, sunsetGradient]

    // choose a random gradient to set as background color
    let randGradient = random(allGradients)
    startColor = randGradient[0]
    endColor = randGradient[1]
    verticalGradient(0, 0, width, height, startColor, endColor)
}

// set minimum size for width and height of each window
let minW = 100
let minH = 70

function draw() {

    // flatten allGradients list so that window gradient can choose from any color
    let allColors = allGradients.flat(Infinity)

    // choose two random colors for window, one for shape
    let randColor1 = random(allColors)
    let randColor2 = random(allColors)
    let randColor3 = random(allColors)

    // choose controlled noise random size
    w = max(minW, 360 * noise(0.5 * frameCount))
    h = max(minH, 240 * noise(0.5 * frameCount))

    // choose random x, y values
    let x = random(0 - (w * 0.5), width - (w * 0.5))
    let y = random(0 - (h * 0.5), height - (w * 0.5))

    // create a new window object
    let win = new Window(x, y, w, h, randColor1, randColor2, randColor3)
    win.show()
}