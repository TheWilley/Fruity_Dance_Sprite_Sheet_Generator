// formula     http://easings.net/
// description https://stackoverflow.com/questions/8316882/what-is-an-easing-function
// x: percent
// t: current time,
// b: beginning value,
// c: change in value,
// d: duration

function easeOutSine(x) {
    return Math.sin((x * Math.PI) / 2);
}

function PreviewImage(show) {
    document.getElementById("popup").style.transform = "translate(-50%, 300px)";
    document.getElementById("mouse-circle").style.opacity = "100%";
}

function StopPreviewImage() {
    document.getElementById("popup").style.transform = "translate(-50%, 150px)";
    document.getElementById("mouse-circle").style.opacity = "0%";
}