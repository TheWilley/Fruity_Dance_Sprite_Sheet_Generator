var dragHandler = function () {
    // Original positions
    let original_position_x = 0;
    let original_position_y = 0;

    
    /**
     * Drag managment
     */
    interact('.draggable').draggable({
        listeners: {
            start(event) {
                // Keep the dragged position in the data-x/data-y attributes
                original_position_x = (parseFloat(event.target.getAttribute('data-x')) || 0) + event.dx;
                original_position_y = (parseFloat(event.target.getAttribute('data-y')) || 0) + event.dy;

                // Here we show the user the image in its true proportions
                graphicHandler.previewImage(true);

                // Set image src
                state.popup_image.src = event.target.src;
            },
            move(event) {
                // Keep the dragged position in the data-x/data-y attributes
                var x = (parseFloat(event.target.getAttribute('data-x')) || 0) + event.dx;
                var y = (parseFloat(event.target.getAttribute('data-y')) || 0) + event.dy;

                // Translates the element
                event.target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

                // Update the posiion attributes
                event.target.setAttribute('data-x', x)
                event.target.setAttribute('data-y', y)
            },
            end(event) {
                if (event.relatedTarget == null) {
                    var target_element = document.getElementById(event.target.id);
                    // Translate the element
                    target_element.style.transform = 'translate(' + original_position_x + 'px, ' + original_position_y + 'px)';

                    // Update the posiion attributes
                    target_element.setAttribute('data-x', original_position_x);
                    target_element.setAttribute('data-y', original_position_y);

                    event.target.classList.remove("isdragged");
                    graphicHandler.previewImage(false);
                }
            }
        }
    })

    /**
     * Grid dropzone managment
     */
    interact(".dropzones").dropzone({
        ondrop: function (event) {
            // Get target id and split it
            var target_element = document.getElementById(event.relatedTarget.id);
            var rownumb = event.target.dataset.x;
            var cellnumb = event.target.dataset.y;

            // Set imageInfo.getCellCollection()
            imageInfo.getCellCollection()[rownumb][cellnumb].imageSrc = event.relatedTarget.src;
            imageInfo.getCellCollection()[rownumb][cellnumb].xOffset = 0;
            imageInfo.getCellCollection()[rownumb][cellnumb].yOffset = 0;

            // Run function to insert images into canvas    
            graphicHandler.generateCanvas(target_element.src, rownumb, cellnumb);
            graphicHandler.redraw()
            event.target.firstChild.src = target_element.src;

            // Go back to otiginal position
            target_element.style.transform = 'translate(' + original_position_x + 'px, ' + original_position_y + 'px)';
            target_element.setAttribute('data-x', original_position_x);
            target_element.setAttribute('data-y', original_position_y);

            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop', 'isdragged');

            graphicHandler.previewImage(false);
        },
        ondragenter: function (event) {
            // Feedback the possibility of a drop
            event.target.classList.add('drop-target')
            event.relatedTarget.classList.add('can-drop')
        },
        ondragleave: function (event) {
            var draggableElement = event.relatedTarget
            // Remove the drop feedback style
            event.target.classList.remove('drop-target')
            draggableElement.classList.remove('can-drop')
        }
    }).on('dropactivate', function (event) {
        event.target.classList.add('drop-activated');
    })

    interact("#delete").dropzone({
        ondrop: function(event) {
            // Remove element
            event.relatedTarget.remove()

            // Disable the preview
            graphicHandler.previewImage(false);

            // Reset delete button color
            event.target.style.background = "#ffc107";

            // Update stored images
            localStorage.setItem("images", state.result.innerHTML);
        },
        ondragenter: function (event) {
            event.target.style.background = "red";
        },
        ondragleave: function (event) {
            event.target.style.background = "#ffc107";
        }
    })
}()