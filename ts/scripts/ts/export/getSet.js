"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.cellCollection = void 0;
exports.cellCollection = [];
var currentCell;
var grid = /** @class */ (function () {
    function grid(x, y) {
        this.x = x;
        this.y = y;
    }
    return grid;
}());
// Image class constructor
var ImageObject = /** @class */ (function (_super) {
    __extends(ImageObject, _super);
    function ImageObject(x, y, xOffset, yOffset, imageSrc) {
        var _this = _super.call(this, x, y) || this;
        _this.xOffset = xOffset;
        _this.yOffset = yOffset;
        _this.imageSrc = imageSrc;
        return _this;
    }
    return ImageObject;
}(grid));
function getCurrentObject() { }
