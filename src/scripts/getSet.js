let objectCollection = [];

let currentObject;

// Image class constructor
class ImageObject {
    constructor(imageID, imageSrc, imageGridPosition, imageGridOffset) {
        this.imageID = imageID;
        this.imageSrc = imageSrc;
        this.imageGridPosition = imageGridPosition;
        this.imageGridOffset = imageGridOffset;
    }
}

// Add object to the collection array
function addObject(object) {
    objectCollection[object.imageGridPosition[0]][object.imageGridPosition[1]] = object;
}

function getCurrentObject() {
    preview_image_edit(document.getElementById('img' + currentObject.imageID).src, currentObject.imageGridOffset[0], currentObject.imageGridOffset[1]);
}