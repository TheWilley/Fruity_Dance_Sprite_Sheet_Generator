var dragHandler = function() {
    // Original position
    let original_position_x = 0;
    let original_position_y = 0;

    // Drag managment
    interact('.draggable').draggable({
        listeners: {
            start(event) {
                var target = event.target;
                // Keep the dragged position in the data-x/data-y attributes
                var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                original_position_x = x;
                original_position_y = y;

                // Here we show the user the image in its true proportions
                graphicHandler.previewImage();

                state.popup_image.src = target.src;
            },
            move(event) {
                var target = event.target;
                // Keep the dragged position in the data-x/data-y attributes
                var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                // TranslateS the element
                target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

                // Update the posiion attributes
                target.setAttribute('data-x', x)
                target.setAttribute('data-y', y)
            },
            end(event) {
                if (event.relatedTarget == null) {
                    let target_element = document.getElementById(event.target.id);
                    // Translate the element
                    target_element.style.transform = 'translate(' + original_position_x + 'px, ' + original_position_y + 'px)';

                    // Update the posiion attributes
                    target_element.setAttribute('data-x', original_position_x);
                    target_element.setAttribute('data-y', original_position_y);

                    event.target.classList.remove("isdragged");
                    graphicHandler.stopPreviewImage();
                }
            }
        }
    })

    // Grid dropzone managment
    interact(".dropzone")
        .dropzone({
            ondrop: function(event) {
                // Get target id and split it
                let target = event.target;
                let relatedTarget = event.relatedTarget;
                let target_element = document.getElementById(event.relatedTarget.id)

                var rownumb = target.dataset.x;
                var cellnumb = target.dataset.y;

                cellCollection[rownumb][cellnumb].imageSrc = relatedTarget.src;
                cellCollection[rownumb][cellnumb].xOffset = 0;
                cellCollection[rownumb][cellnumb].yOffset = 0;

                // Run function to insert images into canvas    
                graphicHandler.preview_image(target_element.src, rownumb, cellnumb);

                event.target.firstChild.src = target_element.src;

                // Go back to otiginal position
                target_element.style.transform = 'translate(' + original_position_x + 'px, ' + original_position_y + 'px)';
                target_element.setAttribute('data-x', original_position_x);
                target_element.setAttribute('data-y', original_position_y);

                event.target.classList.remove('drop-target');
                event.relatedTarget.classList.remove('can-drop');
                event.relatedTarget.classList.remove("isdragged");

                graphicHandler.stopPreviewImage();
            },
            ondragenter: function(event) {
                var dropzoneElement = event.target
                var draggableElement = event.relatedTarget
                    // Feedback the possibility of a drop
                dropzoneElement.classList.add('drop-target')
                draggableElement.classList.add('can-drop')
            },
            ondragleave: function(event) {
                var draggableElement = event.relatedTarget
                    // Remove the drop feedback style
                event.target.classList.remove('drop-target')
                draggableElement.classList.remove('can-drop')
            }
        })
        .on('dropactivate', function(event) {
            event.target.classList.add('drop-activated');
        })

    return {
        // Functions for drag and drop
        allowDrop: (ev) => {
            ev.preventDefault();
        },

        drag: (ev) => {
            ev.dataTransfer.setData("text", ev.target.id);
        },

        drop: (ev) => {
            ev.preventDefault();
            let data = ev.dataTransfer.getData("text");
            ev.target.appendChild(document.getElementById(data));
        }
    }
}()