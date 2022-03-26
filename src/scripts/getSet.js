let cellCollection = [];
let currentCell;

class grid {
    constructor(cellPosition) {
        this.cellPosition = cellPosition;
    }
}

// Image class constructor
class ImageObject extends grid {
    constructor(imageID, imageSrc, cellPosition, imageGridOffset) {
        this.imageID = imageID;
        this.imageSrc = imageSrc;
        super(cellPosition)
        this.imageGridOffset = imageGridOffset;
    }
}

// Add object to the collection array
function addObject(object) {
    cellCollection[object.imageGridPosition[0]][object.imageGridPosition[1]] = object;
}

function getCurrentObject() {
    preview_image_edit(document.getElementById('img' + currentCell.imageID).src, currentCell.imageGridOffset[0], currentCell.imageGridOffset[1]);
}