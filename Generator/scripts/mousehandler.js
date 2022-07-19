let mousePosX = 0,
    mousePosY = 0,
    mouseCircle = document.getElementById('mouse-circle');

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

    mouseCircle.style.top = revisedMousePosY + 'px';
    mouseCircle.style.left = revisedMousePosX + 'px';
}
delayMouseFollow();


$(window).bind('beforeunload', function(){
    return 'Your changes might not be saved';
})