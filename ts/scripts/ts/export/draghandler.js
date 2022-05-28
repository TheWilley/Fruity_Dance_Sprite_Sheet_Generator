"use strict";
exports.__esModule = true;
var smoothpreview_1 = require("./smoothpreview");
var getSet_1 = require("./getSet");
var graphichandler_1 = require("./graphichandler");
// Move images
var orginal_position_x = 0;
var orginal_positon_y = 0;
// Drag managment
//@ts-ignore
interact('.draggable').draggable({
    listeners: {
        start: function (event) {
            var target = event.target;
            // Keep the dragged position in the data-x/data-y attributes
            var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
            orginal_position_x = x;
            orginal_positon_y = y;
            (0, smoothpreview_1.PreviewImage)();
            var image = document.getElementById("popup_image");
            image.src = target.src;
        },
        move: function (event) {
            var target = event.target;
            // Keep the dragged position in the data-x/data-y attributes
            var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
            // translateS the element
            target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
            // update the posiion attributes
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        },
        end: function (event) {
            if (event.relatedTarget == null) {
                var target_element = document.getElementById(event.target.id);
                if (target_element != undefined) {
                    target_element.style.transform = 'translate(' + orginal_position_x + 'px, ' + orginal_positon_y + 'px)';
                    target_element.setAttribute('data-x', orginal_position_x.toString());
                    target_element.setAttribute('data-y', orginal_positon_y.toString());
                }
                else {
                    throw console.error("target object does not exist!");
                }
                event.target.classList.remove("isdragged");
                (0, smoothpreview_1.StopPreviewImage)();
            }
        }
    }
});
// Grid dropzone managment
//@ts-ignore
interact(".dropzone")
    .dropzone({
    ondrop: function (event) {
        // Get target id and split it
        var target = event.target;
        var relatedTarget = event.relatedTarget;
        var target_element = document.getElementById(event.relatedTarget.id);
        //@ts-ignore
        var rownumb = target.dataset.x;
        //@ts-ignore
        var cellnumb = target.dataset.y;
        getSet_1.cellCollection[rownumb][cellnumb].imageSrc = relatedTarget.src;
        getSet_1.cellCollection[rownumb][cellnumb].xOffset = 0;
        getSet_1.cellCollection[rownumb][cellnumb].yOffset = 0;
        if (target_element != undefined) {
            // Run function to insert images into canvas    
            (0, graphichandler_1.preview_image)(target_element.src, rownumb, cellnumb);
            event.target.firstChild.src = target_element.src;
            // Go back to otiginal position
            target_element.style.transform = 'translate(' + orginal_position_x + 'px, ' + orginal_positon_y + 'px)';
            target_element.setAttribute('data-x', orginal_position_x.toString());
            target_element.setAttribute('data-y', orginal_positon_y.toString());
        }
        event.target.classList.remove('drop-target');
        event.relatedTarget.classList.remove('can-drop');
        event.relatedTarget.classList.remove("isdragged");
        (0, smoothpreview_1.StopPreviewImage)();
    },
    ondragenter: function (event) {
        var dropzoneElement = event.target;
        var draggableElement = event.relatedTarget;
        // feedback the possibility of a drop
        dropzoneElement.classList.add('drop-target');
        draggableElement.classList.add('can-drop');
    },
    ondragleave: function (event) {
        var draggableElement = event.relatedTarget;
        // remove the drop feedback style
        event.target.classList.remove('drop-target');
        draggableElement.classList.remove('can-drop');
    }
})
    .on('dropactivate', function (event) {
    event.target.classList.add('drop-activated');
});
