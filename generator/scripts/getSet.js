var cellCollection = [];
var currentCell;

/**
 * Grid class used to get x and y positions in table
 */
class TablePositions {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

/**
 * Image class
 */
class ImageObject extends TablePositions {
    constructor(x, y, xOffset, yOffset, imageSrc) {
        super(x, y);
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.imageSrc = imageSrc;
    }
}
