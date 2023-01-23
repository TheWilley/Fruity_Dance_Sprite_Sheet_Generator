var imageInfo = function () {
    var cellCollection = [];

    return {
        /*/ Getters /*/
        getCellCollection: function () {
            return cellCollection;
        },

        /*/ Setters /*/
        setCellCollection: function(e) {
            cellCollection = e;
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
