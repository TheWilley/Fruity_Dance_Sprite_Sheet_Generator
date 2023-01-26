class imageInfo {
    cellCollection: ImageObject[] = [];

    /*/ Getters /*/
    get getCellCollection() {
        return this.cellCollection;
    }

    /*/ Setters /*/
    set setCellCollection(collection: ImageObject[]) {
        this.cellCollection = collection;
    }
} ()

/**
 *  Class used to store info about images
 */
class ImageObject {
    private x
    private y
    private xOffset
    private yOffset
    private imageSrc 

    constructor(x: number, y: number, xOffset: number, yOffset: number, imageSrc: string) {
        this.x = x;
        this.y = y;
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.imageSrc = imageSrc;
    }
}
