import interact from "interactjs";
import Configuration from "./config";
import GraphicHandler from "./graphicHandler";
import ImageCollection from "./imageCollection";

class DragHandler {
    private _original_position_x = 0
    private _original_position_y = 0
    private _state = new Configuration().state
    private _graphicHandler = new GraphicHandler() 
    private _imageCollection = new ImageCollection()
    
    constructor() {
        this.run()
    }

    run() {
        const self = this

        /**
         * Drag managment
         */
        interact('.draggable').draggable({
            listeners: {
                start(event) {
                    event
                    // Keep the dragged position in the data-x/data-y attributes
                    var x = (parseFloat(event.target.getAttribute('data-x')) || 0) + event.dx;
                    var y = (parseFloat(event.target.getAttribute('data-y')) || 0) + event.dy;

                    // Translates the element
                    event.target.style.transform = `translate(${x}px, ${y}px)`;

                    // Update the posiion attributes
                    event.target.setAttribute('data-x', x)
                    event.target.setAttribute('data-y', y)
                },
                end(event) {
                    if (event.relatedTarget == null) {
                        var target_element = document.getElementById(event.target.id);
                        // Translate the element
                        target_element.style.transform = `translate(${self._original_position_x}px, ${self._original_position_y}px)`;
                        self._graphicHandler.previewImage(false);
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
                var target_element = document.getElementById(event.relatedTarget.id) as HTMLImageElement;
                var rownumb = event.target.dataset.x;
                var cellnumb = event.target.dataset.y;

                // Set imageInfo.getCellCollection()
                self._imageCollection.cellCollection[rownumb][cellnumb].imageSrc = event.relatedTarget.src;
                self._imageCollection.cellCollection[rownumb][cellnumb].xOffset = 0;
                self._imageCollection.cellCollection[rownumb][cellnumb].yOffset = 0;

                // Run function to insert images into canvas    
                self._graphicHandler.generateCanvas(target_element.src, rownumb, cellnumb);
                self._graphicHandler.redraw()
                event.target.firstChild.src = target_element.src;

                // Go back to otiginal position
                target_element.style.transform = `translate(${self._original_position_x}px, ${self._original_position_y}px)`;
                target_element.setAttribute('data-x', String(self._original_position_x));
                target_element.setAttribute('data-y', String(self._original_position_y));

                event.target.classList.remove('drop-target');
                event.relatedTarget.classList.remove('can-drop', 'isdragged');

                self._graphicHandler.previewImage(false);
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
            ondrop: function (event) {
                // Remove element
                event.relatedTarget.parentNode.remove()

                // Disable the preview
                self._graphicHandler.previewImage(false);

                // Reset delete button color
                event.target.style.background = "#ffc107";

                // Update stored images
                localStorage.setItem("images", self._state.result.innerHTML);
            },
            ondragenter: function (event) {
                event.target.style.background = "red";
            },
            ondragleave: function (event) {
                event.target.style.background = "#ffc107";
            }
        })
    }
}

export default DragHandler