// Src: https://gist.githubusercontent.com/Sahero/211c1f83d0f086ed7d4d9104d4396dff/raw/0ac42e032487e8dd356a45a2d8fdc3144d0d7f21/spritesheet.js
var animationInterval;
var position = 0;

function stopAnimation() {
    clearInterval(animationInterval);
}

function startAnimation(row) {
    const speed = 5433; //in millisecond(ms)

    animationInterval = setInterval(() => {
        var spriteSheet = document.getElementById("gifPreview" + (row + 1));
        if (cellCollection[row][position].imageSrc != null) {
            spriteSheet.src = cellCollection[row][position].imageSrc;
            spriteSheet.style.objectPosition = cellCollection[row][position].xOffset + "px " + cellCollection[row][position].yOffset + "px";
            console.log(cellCollection[row][position].xOffset + "px" + cellCollection[row][position].yOffset + "px");
        } else {
            spriteSheet.src = '';

        }

        if (position < 7) {
            position++;
        } else {
            position = 0;
        }

        //reset the position to show first sprite after the last one
    }, speed);
}