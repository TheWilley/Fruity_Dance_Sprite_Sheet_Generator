import { globals } from "./setup";
import DownloadUpload from "./downloadUpload";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import $ from "jquery";

class EventListeners {
	private _settings = globals.config.settings;
	private _state = globals.config.state;
	private _downloadUpload = new DownloadUpload();
	private _table = globals.table;
	private _config = globals.config;
	private _graphicHandler = globals.graphicHandler;

	public run() {
		// Create tippy tooltips
		this.tippy();

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
						this._downloadUpload.downloadZIP(
							this._state.canvas,
							document.getElementsByClassName("row-name"),
						);
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
				document.getElementsByClassName("row-name"),
			);
		});

		/**
		 * Checks if download Json button has been clicked
		 */
		$(this._state.downloadJson).on("click", (event) => {
			event.stopImmediatePropagation();
			this._downloadUpload.saveJson();
		});

		/**
		 * Check if delete button has been clicked
		 */
		$(this._state.delete).on("click", () => {
			this._graphicHandler.remove();
		});

		/**
		 * Checks if start preview button has been clicked
		 */
		$(this._state.start_preview).on("click", () => {
			this._graphicHandler.configPreview(true);
		});

		/**
		 * Checks if pause preview button has been clicked
		 */
		$(this._state.pause_preview).on("click", () => {
			this._graphicHandler.configPreview(false);
		});

		/**
		 * Checks if show preview button has been clicked
		 */
		$(this._state.show_preview).on("click", (event) => {
			event.stopImmediatePropagation();
			this._graphicHandler.show_preview();
			this._graphicHandler.show_rowname();
		});

		/**
		 * Check if clear button has been clicked
		 */
		$(this._state.clear).on("click", () => {
			this._downloadUpload.clearData();
		});

		/**
		 * Checks if collection has been clicked
		 */
		$(this._state.collection).on("change", () => {
			this._graphicHandler.filterClass();
		});

		/**
		 * Checks scroll position
		 */
		$(window).on("scroll", () => {
			if ($(window).scrollTop() >= 45) {
				this._state.sidebar.classList.add("fixed_sidebar");
				this._state.sidebarContainer.classList.add("fixed_container");
			} else {
				this._state.sidebar.classList.remove("fixed_sidebar");
				this._state.sidebarContainer.classList.remove("fixed_container");
			}
		});

		/**
		 * Runs Before leaving page
		 */
		$(window).on("beforeunload", () => {
			return "Your changes might not be saved";
		});

		/**
		 * Checks if element values are too high or low
		 */
		$([this._state.rows, this._state.cell_width, this._state.cell_height]).on(
			"change",
			(event: JQuery.ChangeEvent) => {
				event.stopImmediatePropagation();
				this._graphicHandler.checkMinMax(0, 0, event);
				if (this._table.checkEmptyCells()) this._table.addTable();
			}
		);

		/**
		 * Flips image horizontally
		 */
		$(this._state.flip_horizontal).on(
			"click", () => {
				this._graphicHandler.flip("horizontal");
			}
		);

		/**
		 * Flips image vertically
		 */
		$(this._state.flip_vertical).on(
			"click", () => {
				this._graphicHandler.flip("vertical");
			}
		);

		$(this._state.move_to_top).on(
			"click", () => {
				this._graphicHandler.moveUp();
			}
		);

		/**
		 * Checks if config is changed
		 */
		$("#config_form").on("input", "input", (event) => {
			this._config.refreshSettings();
			this._state.apply_settings.style.display = "inline-block";
			event.currentTarget.parentElement.style.boxShadow =
				"0 0 0 2px rgba(255, 193, 7, 0.5)";
		});

		/**
		 * Collapses section
		 */
		$(".collapse-button").on("click", (event) => {
			event.currentTarget
				.closest(".section-wrapper")
				.classList.toggle("collapsed");
		});

		/**
		 * Removes all autocomplete from inputs
		 */
		$("input").attr("autocomplete", "off");
	}

	/**
	 * Creates tippy tooltips
	 */
	public tippy() {
		tippy("#frames_editor", {
			content: "F = Frame, R = Row",
			placement: "top-start",
			delay: [500, 0]
		});

		tippy(".collapse-button", {
			content: "Collapse",
			delay: [500, 0]
		});

		tippy("#flip_horizontal", {
			content: "Flip image vertically",
			delay: [500, 0]
		});

		tippy("#flip_vertical", {
			content: "Flip image horizontally",
			delay: [500, 0]
		});

		tippy("#move_to_top", {
			content: "Move image to top",
			delay: [500, 0]
		});

		tippy("#delete", {
			content: "Delete image",
			delay: [500, 0]
		});

		tippy("#start_preview", {
			content: "Start preview",
			delay: [500, 0]
		});

		tippy("#pause_preview", {
			content: "Pause preview",
			delay: [500, 0]
		});

		tippy("#show_preview", {
			content: "Show or hide preview and rows",
			delay: [500, 0]
		});
	}
}

export default EventListeners;
