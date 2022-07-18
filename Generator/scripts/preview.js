/**
 * FPS control by elundmark
 * https://gist.github.com/elundmark/38d3596a883521cb24f5
 */

class preview {
    constructor(row, fps) {
        this.row = row;
        this.fps = fps;

        // Default
        this.pause = false;
        this.then = Date.now();
        this.interval = 1000 / this.fps;
        this.now;
        this.delta;
        this.bind; // The bind is used by the requestAnimationFrame to avoid binding many times
        this.width = document.getElementById("cell_width").value;
        this.height = document.getElementById("cell_height").value;

        // Set the height and width
        this.previewCanvas = document.getElementById("gifPreview");
        this.previewCanvas.width = this.width;
        this.previewCanvas.height = this.height * this.row;

        // Image position
        this.x = 0;
    }

    nextFrame() {
        // Generate settings
        var originalCanvas = document.getElementById("canvas"),
            startClippingX = 0,
            startClippingY = (this.height * this.row) - this.height,
            clippingWidth = this.width,
            clippingHeight = this.height,
            pasteX = 0,
            pasteY = (this.height * this.row) - this.height,
            pasteWidth = this.width,
            pasteHeight = this.height

        // Update the x variable
        startClippingX = this.x;

        // Get the previewCanvas
        var context = this.previewCanvas.getContext("2d");

        // Clear the canvas
        context.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);

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
        this.x += parseInt(this.width);
    }

    start() {
        if (this.bind == undefined) {
            this.bind = this.start.bind(this)
        }

        if (this.pause == true) {
            console.log("Use the restart() function to resume")
            return;
        }
        
        // Call for animation
        window.requestAnimationFrame(this.bind);

        this.now = Date.now();
        this.delta = this.now - this.then;

        if (this.delta > this.interval) {
            this.then = this.now - (this.delta % this.interval);
            this.nextFrame()
        }
        if (this.x > this.width * 7) {
            this.x = 0;
        }
    }

    stop() {
        this.pause = true;
    }

    restart() {
        this.pause = false;
        this.start();
    }
}