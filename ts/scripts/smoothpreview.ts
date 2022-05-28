function PreviewImage() {
    document.getElementById("popup").style.transform = "translate(-50%, 300px)";
    document.getElementById("mouse-circle").style.opacity = "100%";
}

function StopPreviewImage() {
    document.getElementById("popup").style.transform = "translate(-50%, 150px)";
    document.getElementById("mouse-circle").style.opacity = "0%";
}