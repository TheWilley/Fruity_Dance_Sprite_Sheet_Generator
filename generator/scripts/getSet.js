var imageInfo = function () {
    var cellCollection = [];
    var currentCell;

    return {
        /*/ Getters /*/
        getCellCollection: function () {
            return cellCollection;
        }
    }
}()

/**
 *  Class used to store info about images
 */
class ImageObject {
    constructor(x, y, xOffset, yOffset, imageSrc) {
        this.x = x;
        this.y = y;
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.imageSrc = imageSrc;
    }
}
