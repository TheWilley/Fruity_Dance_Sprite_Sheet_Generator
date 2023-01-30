import {globals} from "./setup";
import DownloadUpload from "./downloadUpload";
import $ from "jquery";

class EventListeners {
	private _settings = globals.config.settings;
	private _state = globals.config.state;
	private _downloadUpload = new DownloadUpload();
	private _table = globals.table;
	private _graphicHandler = globals.graphicHandler;

	public run() {
		/**
		 * Keyboard shortcut
		 * https://stackoverflow.com/a/14180949
		 */
		$(window).on("keydown", (event) => {
			if (event.ctrlKey || event.metaKey) {
				switch (String.fromCharCode(event.which).toLowerCase()) {
					case "s": // Save
						event.stopImmediatePropagation();
						event.preventDefault();
						this._downloadUpload.saveJson();
						break;
					case "e": // Export
						event.stopImmediatePropagation();
						event.preventDefault();
						this._state.filename.value = "savedSpriteSheet";
						this._downloadUpload.downloadZIP(
							this._state.canvas,
							this._state.textarea.value,
							this._state.filename.value
						);
						this._state.filename.value = "";
						break;
					case "u": // Clear uploaded images
						event.stopImmediatePropagation();
						event.preventDefault();
						this._downloadUpload.clearData();
						break;
				}
			}
		});

		/**
		 * Checks if download sprite sheet button has been clicked
		 */
		$(this._state.downloadSpriteSheet).on("click", (event) => {
			event.stopImmediatePropagation();
			this._downloadUpload.downloadZIP(
				this._state.canvas,
				this._state.textarea.value,
				this._state.filename.value
			);
		});

		/**
		 * Checks if download Json button has been clicked
		 */
		$(this._state.downloadJson).on("click", (event) => {
			event.stopImmediatePropagation();
			this._downloadUpload.saveJson();
		});

		$(this._state.delete).on("click", () => {
			this._graphicHandler.remove();
		});

		$(this._state.startPreview).on("click", () => {
			this._graphicHandler.configPreview(true);
		});

		$(this._state.pausePreview).on("click", () => {
			this._graphicHandler.configPreview(false);
		});

		$(this._state.showPreview).on("click", (event) => {
			event.stopImmediatePropagation();
			this._graphicHandler.showPreview();
		});

		$(this._state.clear).on("click", () => {
			this._downloadUpload.clearData();
		});

		$(this._state.collection).on("click", () => {
			this._graphicHandler.filterClass();
		});

		/**
		 * Checks scroll position
		 */
		$(window).on("scroll", () => {
			if ($(window).scrollTop() >= 45) {
				this._state.sidebar.classList.add("fixedSidebar");
				this._state.sidebarContainer.classList.add("fixedContainer");
			} else {
				this._state.sidebar.classList.remove("fixedSidebar");
				this._state.sidebarContainer.classList.remove("fixedContainer");
			}
		});

		/**
		 * Runs Before leaving page
		 */
		$(window).on("beforeunload", () => {
			if (this._settings.warnBeforeLeavingPage)
				return "Your changes might not be saved";
		});

		/**
		 * Checks if element values are too high or low
		 */
		$([this._state.rows, this._state.cell_width, this._state.cell_height]).on(
			"change",
			(event: JQuery.ChangeEvent) => {
				event.stopImmediatePropagation();
				this._graphicHandler.checkMinMax(event);
				if (this._table.checkEmptyCells()) this._table.addTable();
			}
		);
	}
}

export default EventListeners;
