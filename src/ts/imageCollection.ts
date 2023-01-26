class ImageCollection {
    private _cellCollection: ImageInfo[][] = [[]];

    /*/ Getters /*/
    public get cellCollection() {
        return this._cellCollection;
    }

    /*/ Setters /*/
    public set cellCollection(collection: ImageInfo[][]) {
        this._cellCollection = collection;
    }
} 

export default ImageCollection