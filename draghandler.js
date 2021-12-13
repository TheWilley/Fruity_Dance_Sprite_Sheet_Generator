// Move images
var orginal_positioon_x = 0;
var orginal_positooon_y = 0;

var immage_offset_y = 0;
var immage_offset_x = 0;

// Drag managment
interact('.draggable').draggable({
    listeners: {
        start(event) {
            var target = event.target
                // keep the dragged position in the data-x/data-y attributes
            var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            orginal_positioon_x = x;
            orginal_positioon_y = y;

            PreviewImage(true);

            document.getElementById("popup_image").src = target.src;
        },
        move(event) {
            var target = event.target
                // keep the dragged position in the data-x/data-y attributes
            var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            // translateS the element
            target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

            // update the posiion attributes
            target.setAttribute('data-x', x)
            target.setAttribute('data-y', y)
        },
        end(event) {
            if (event.relatedTarget == null) {
                let target_element = document.getElementById(event.target.id)
                    // translate the element
                target_element.style.transform = 'translate(' + orginal_positioon_x + 'px, ' + orginal_positioon_y + 'px)';

                // update the posiion attributes
                target_element.setAttribute('data-x', orginal_positioon_x);
                target_element.setAttribute('data-y', orginal_positioon_y);

                event.target.classList.remove("isdragged");

                StopPreviewImage();
            }
        }
    }
})

// Grid dropzone managment
interact(".dropzone")
    .dropzone({
        ondrop: function(event) {
            // Get target id and split it
            let target_id = event.target.id;
            let target_element = document.getElementById(event.relatedTarget.id)
            var rownumb = parseInt(target_id.charAt(0));
            var cellnumb = parseInt(target_id.charAt(2));

            // Run function to insert images into canvas
            preview_image(document.getElementById(event.relatedTarget.id).src, rownumb, cellnumb);
            console.log(document.getElementById(event.relatedTarget.id).src);

            document.getElementById("img" + rownumb + "-" + cellnumb).src = document.getElementById(event.relatedTarget.id).src;

            // Go back to otiginal position
            target_element.style.transform = 'translate(' + orginal_positioon_x + 'px, ' + orginal_positioon_y + 'px)';
            target_element.setAttribute('data-x', orginal_positioon_x);
            target_element.setAttribute('data-y', orginal_positioon_y);

            event.target.classList.remove('drop-target')
            event.relatedTarget.classList.remove('can-drop')
            event.relatedTarget.classList.remove("isdragged");

            StopPreviewImage();
        },
        ondragenter: function(event) {
            var dropzoneElement = event.target
            var draggableElement = event.relatedTarget
                // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target')
            draggableElement.classList.add('can-drop')
        },
        ondragleave: function(event) {
            var draggableElement = event.relatedTarget
                // remove the drop feedback style
            event.target.classList.remove('drop-target')
            draggableElement.classList.remove('can-drop')
        }
    })
    .on('dropactivate', function(event) {
        event.target.classList.add('drop-activated');
    })

// Functions for drag and drop
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}