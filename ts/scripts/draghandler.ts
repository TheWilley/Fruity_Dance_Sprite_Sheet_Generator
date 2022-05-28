import { PreviewImage, StopPreviewImage } from "./smoothpreview";
import { cellCollection } from "./getSet";
import {preview_image} from "./graphichandler";

// Move images
let orginal_position_x = 0;
let orginal_positon_y = 0;

// Drag managment
//@ts-ignore
interact('.draggable').draggable({
    listeners: {
        start(event: { target: any; dx: number; dy: number; }) {
            var target = event.target;
            // Keep the dragged position in the data-x/data-y attributes
            var x: number = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            var y: number = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            orginal_position_x = x;
            orginal_positon_y = y;

            PreviewImage();

            var image = document.getElementById("popup_image") as HTMLImageElement;
            image.src = target.src;
        },
        move(event: { target: any; dx: number; dy: number; }) {
            var target = event.target;
            // Keep the dragged position in the data-x/data-y attributes
            var x: number = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            var y: number = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            // translateS the element
            target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

            // update the posiion attributes
            target.setAttribute('data-x', x)
            target.setAttribute('data-y', y)
        },
        end(event: { relatedTarget: null; target: { id: string; classList: { remove: (arg0: string) => void; }; }; }) {
            if (event.relatedTarget == null) {
                let target_element = document.getElementById(event.target.id);

                if (target_element != undefined) {
                    target_element.style.transform = 'translate(' + orginal_position_x + 'px, ' + orginal_positon_y + 'px)';
                    target_element.setAttribute('data-x', orginal_position_x.toString());
                    target_element.setAttribute('data-y', orginal_positon_y.toString());
                } else {
                    throw console.error("target object does not exist!");
                }

                event.target.classList.remove("isdragged");

                StopPreviewImage();
            }
        }
    }
})

// Grid dropzone managment
//@ts-ignore
interact(".dropzone")
    .dropzone({
        ondrop: function (event: { target: { firstChild: { src: any; }; classList: { remove: (arg0: string) => void; }; }; relatedTarget: { src: string; id: string; classList: { remove: (arg0: string) => void; }; }; }) {
            // Get target id and split it
            let target = event.target;
            let relatedTarget = event.relatedTarget;
            let target_element = document.getElementById(event.relatedTarget.id) as HTMLImageElement;

            //@ts-ignore
            var rownumb = target.dataset.x;
            //@ts-ignore
            var cellnumb = target.dataset.y;

            cellCollection[rownumb][cellnumb].imageSrc = relatedTarget.src;
            cellCollection[rownumb][cellnumb].xOffset = 0;
            cellCollection[rownumb][cellnumb].yOffset = 0;

            if (target_element != undefined) {
                // Run function to insert images into canvas    
                preview_image(target_element.src, rownumb, cellnumb);

                event.target.firstChild.src = target_element.src;

                // Go back to otiginal position
                target_element.style.transform = 'translate(' + orginal_position_x + 'px, ' + orginal_positon_y + 'px)';
                target_element.setAttribute('data-x', orginal_position_x.toString());
                target_element.setAttribute('data-y', orginal_positon_y.toString());
            }

            event.target.classList.remove('drop-target')
            event.relatedTarget.classList.remove('can-drop')
            event.relatedTarget.classList.remove("isdragged");

            StopPreviewImage();
        },
        ondragenter: function (event: { target: any; relatedTarget: any; }) {
            var dropzoneElement = event.target
            var draggableElement = event.relatedTarget
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target')
            draggableElement.classList.add('can-drop')
        },
        ondragleave: function (event: { relatedTarget: any; target: { classList: { remove: (arg0: string) => void; }; }; }) {
            var draggableElement = event.relatedTarget
            // remove the drop feedback style
            event.target.classList.remove('drop-target')
            draggableElement.classList.remove('can-drop')
        }
    })
    .on('dropactivate', function (event: { target: { classList: { add: (arg0: string) => void; }; }; }) {
        event.target.classList.add('drop-activated');
    })