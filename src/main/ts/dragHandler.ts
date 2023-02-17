import { globals } from "./setup";
import interact from "interactjs";

class DragHandler {
	private _original_position_x = 0;
	private _original_position_y = 0;
	private _state = globals.config.state;
	private _graphicHandler = globals.graphicHandler;
	private _imageCollection = globals.imageCollection;

	getCoordinates(event: Interact.DragEvent) {
		// Keep the dragged position in the data-x/data-y attributes
		const x = (parseFloat(event.target.getAttribute("data-x")) || 0) + event.dx;
		const y = (parseFloat(event.target.getAttribute("data-y")) || 0) + event.dy;

		return { x, y };
	}

	goToOriginalPosition(added: boolean, event: Interact.DragEvent) {
		let target;

		if (added) {
			target = event.relatedTarget;
		} else {
			target = event.target;
		}

		// Translate the element
		target.style.transform = `translate(${this._original_position_x}px, ${this._original_position_y}px)`;
		target.parentElement.style.opacity = "100%";

		// Update the posiion attributes
		target.setAttribute("data-x", String(this._original_position_x));
		target.setAttribute("data-y", String(this._original_position_y));

		this._graphicHandler.previewImage(false);
	}

	run() {
		// The reason for disabling alias checking is bbecause I ultimately have no control over function handling in this plugin
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;

		/**
		 * Drag managment
		 */
		interact(".draggable").draggable({
			listeners: {
				start(event) {
					self._graphicHandler.previewImage(true);
					self._state.popup_image.src = event.target.src;
					event.target.parentElement.style.opacity = "65%";
				},
				move(event) {
					const coordinates = self.getCoordinates(event);

					// Translates the element
					event.target.style.transform = `translate(${coordinates.x}px, ${coordinates.y}px)`;

					// Update the posiion attributes
					event.target.setAttribute("data-x", coordinates.x);
					event.target.setAttribute("data-y", coordinates.y);
				},

				end(event) {
					if (event.relatedTarget == null) {
						self.goToOriginalPosition(false, event);
					}
				}
			}
		});

		/**
		 * Grid dropzone managment
		 */
		interact(".dropzones")
			.dropzone({
				ondrop: function (event) {
					// Get target id and split it
					const target_element = event.relatedTarget as HTMLImageElement;
					const rownumb = event.target.dataset.x;
					const cellnumb = event.target.dataset.y;

					// Set imageInfo.getCellCollection()
					self._imageCollection.cellCollection[rownumb][cellnumb].imageSrc =
						event.relatedTarget.src;
					self._imageCollection.cellCollection[rownumb][cellnumb].xOffset = 0;
					self._imageCollection.cellCollection[rownumb][cellnumb].yOffset = 0;
					self._imageCollection.cellCollection[rownumb][cellnumb].sizeMultiplier = 1;

					// Run function to insert images into canvas
					self._graphicHandler.generateCanvas(
						target_element.src,
						rownumb,
						cellnumb
					);
					self._graphicHandler.redraw();
					event.target.firstChild.src = target_element.src;

					// Go back to otiginal position
					self.goToOriginalPosition(true, event);

					event.target.classList.remove("drop-target");
					event.relatedTarget.classList.remove("can-drop", "isdragged");
				},
				ondragenter: function (event) {
					// Feedback the possibility of a drop
					event.target.classList.add("drop-target");
					event.relatedTarget.classList.add("can-drop");
				},
				ondragleave: function (event) {
					const draggableElement = event.relatedTarget;
					// Remove the drop feedback style
					event.target.classList.remove("drop-target");
					draggableElement.classList.remove("can-drop");
				}
			})
			.on("dropactivate", function (event) {
				event.target.classList.add("drop-activated");
			});

		interact("#delete").dropzone({
			ondrop: function (event) {
				// Remove element
				event.relatedTarget.parentNode.remove();

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
		});
	}
}

export default DragHandler;
