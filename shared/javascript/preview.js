/**
 * FPS control by elundmark
 * https://gist.github.com/elundmark/38d3596a883521cb24f5
 */ 

var x = 0;
var fps = 4;
var now;
var then = Date.now();
var interval = 1000 / fps;
var delta;

function draw() {
    // Generate settings
    var originalCanvas = document.getElementById("canvas"),
        startClippingX = 0,
        startClippingY = 0,
        clippingWidth = 80,
        clippingHeight = 80,
        pasteX = 0,
        pasteY = 0,
        pasteWidth = 80,
        pasteHeight = 80

    // Update the x variable
    startClippingX = x;

    // Get the previewCanvas
    var previewCanvas = document.getElementById("gifPreview");
    var context = previewCanvas.getContext("2d");

    // Set the height and width
    previewCanvas.width = document.getElementById("cell_width").value;
    previewCanvas.height = document.getElementById("cell_height").value;

    // Clear the canvas
    context.clearRect(0, 0, previewCanvas.width, previewCanvas.height);

    // Draw the image
    context.drawImage(
        originalCanvas,
        startClippingX,
        startClippingY,
        clippingWidth,
        clippingHeight,
        pasteX,
        pasteY,
        pasteWidth,
        pasteHeight
    );

    // Add to the x
    x += 80;
}

function startAnimation(row) {
    // Call for animation
    window.requestAnimationFrame(startAnimation);

    now = Date.now();
    delta = now - then;

    if (delta > interval) {
        then = now - (delta % interval);
        draw();
    }
    if (x > 80 * 7) {
        x = 0;
    }
}