function PreviewImage(show) {
    document.getElementById("popup").style.transform = "translate(-50%, 300px)";
    state.mouseCircle.style.opacity = "100%";
}

function StopPreviewImage() {
    document.getElementById("popup").style.transform = "translate(-50%, 150px)";
    state.mouseCircle.style.opacity = "0%";
}