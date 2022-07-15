let cellCollection = [];
let currentCell;

// Grid class
class grid {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// Image class constructor
class ImageObject extends grid {
    constructor(x, y, xOffset, yOffset, imageSrc) {
        super(x, y);
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.imageSrc = imageSrc;
    }
}