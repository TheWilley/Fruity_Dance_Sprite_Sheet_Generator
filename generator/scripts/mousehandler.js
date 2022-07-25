let mousePosX = 0,
    mousePosY = 0

$(document).on("mousemove", function (e) {
    mousePosX = e.pageX;
    mousePosY = e.pageY;
});

let delay = 6,
    revisedMousePosX = 0,
    revisedMousePosY = 0;

function delayMouseFollow() {
    requestAnimationFrame(delayMouseFollow);

    revisedMousePosX += (mousePosX - revisedMousePosX) / delay;
    revisedMousePosY += (mousePosY - revisedMousePosY) / delay;

    state.mouseCircle.style.top = revisedMousePosY + 'px';
    state.mouseCircle.style.left = revisedMousePosX + 'px';
}
delayMouseFollow();