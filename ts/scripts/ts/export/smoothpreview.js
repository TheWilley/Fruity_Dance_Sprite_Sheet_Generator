"use strict";
exports.__esModule = true;
exports.StopPreviewImage = exports.PreviewImage = void 0;
function PreviewImage() {
    document.getElementById("popup").style.transform = "translate(-50%, 300px)";
    document.getElementById("mouse-circle").style.opacity = "100%";
}
exports.PreviewImage = PreviewImage;
function StopPreviewImage() {
    document.getElementById("popup").style.transform = "translate(-50%, 150px)";
    document.getElementById("mouse-circle").style.opacity = "0%";
}
exports.StopPreviewImage = StopPreviewImage;
