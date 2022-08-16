var mouseHandler = function() {
    let mousePosX = 0;
    let mousePosY = 0;
    let delay = 6;
    let revisedMousePosX = 0;
    let revisedMousePosY = 0;

    // Mouse move
    $(document).on("mousemove", function(e) {
        mousePosX = e.pageX;
        mousePosY = e.pageY;
    });

    function delayMouseFollow() {
        requestAnimationFrame(delayMouseFollow);

        revisedMousePosX += (mousePosX - revisedMousePosX) / delay;
        revisedMousePosY += (mousePosY - revisedMousePosY) / delay;

        state.mouseCircle.style.top = revisedMousePosY + 'px';
        state.mouseCircle.style.left = revisedMousePosX + 'px';
    }

    delayMouseFollow();
}()