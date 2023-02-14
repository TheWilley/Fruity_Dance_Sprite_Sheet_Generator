import { globals } from "../setup";

interface IConfiguration {
	/*/ Canvas settings /*/
	maxRows: number; // Max amount of allowed rows

	minWidth: number; // Minimum cell width
	minHeight: number; // Minimum cell height
	minXOffset: number; // Minimum X-offset
	minYOffset: number; // Minimum Y-offset

	maxWidth: number; // Maximum cell width
	maxHeight: number; // Maximum cell height
	maxXOffset: number; // Maximum X-offset
	maxYOffset: number; // Maximum Y-offset

	/*/ Upload settings /*/
	maxUploadSize: string; // Max image upload size
	imageQuality: number; // The image quality (1 = best quality, 0 = worst quality)
	imageSizeMultiplier: number; // Multiplies the max proportions of an uploaded image (by default the minWidth/minHeight and maxWidth/maxHeight values). Higher value here means better image quality.
	maxAllowedGifFrames: number; // Limit how many frames of a gif to export

	/*/ Other settings /*/
	previewFPS: number; // The FPS of a preview
	amountOfCollections: number; // The amount of collections
	background: string; // A custom background, must be a link to an image / path to a local one OR a color in HEX (null will mean default)
	warnBeforeLeavingPage: boolean; // Warn user before leaving page to not discard any progress
}

class Configuration {
	private _settings: IConfiguration;
	private _state = globals.elementCatcher;

	constructor() {
		this._settings = this.parseForm();

		this.runConfig();
	}

	private runConfig() {
		new Map([
			[
				"maxRows",
				(value: number | boolean | string) => {
					this._state.rows.setAttribute("max", value);
				}
			],
			[
				"minWidth",
				(value) => {
					this._state.cell_width.setAttribute("min", value);
					this._state.cell_width.value = value;
				}
			],
			[
				"maxWidth",
				(value) => {
					this._state.cell_width.setAttribute("max", value);
				}
			],
			[
				"minHeight",
				(value) => {
					this._state.cell_height.setAttribute("min", value);
					this._state.cell_height.value = value;
				}
			],
			[
				"maxHeight",
				(value) => {
					this._state.cell_height.setAttribute("max", value);
				}
			],
			[
				"minXOffset",
				(value) => {
					this._state.offset_x.setAttribute("min", value);
				}
			],
			[
				"maxXOffset",
				(value) => {
					this._state.offset_x.setAttribute("max", value);
				}
			],
			[
				"minYOffset",
				(value) => {
					this._state.offset_y.setAttribute("min", value);
				}
			],
			[
				"maxYOffset",
				(value) => {
					this._state.offset_y.setAttribute("max", value);
				}
			],
			[
				"background",
				(value) => {
					const root = document.documentElement;
					if (value != null)
						String(value)[0] == "#"
							? root.style.setProperty("--background", String(value))
							: root.style.setProperty("--background", `url(${value})`);
				}
			]
		]).forEach((value, key) => {
			if (this._settings[key as keyof IConfiguration])
				value(this._settings[key as keyof IConfiguration]);
		});
	}

	parseForm() {
		const form = document.getElementById("config_form") as HTMLFormElement;
		const settings = {
			maxRows: parseInt((form.elements.namedItem("max_rows") as HTMLInputElement).value) || 20,
			minWidth: parseInt((form.elements.namedItem("min_cell_width") as HTMLInputElement).value) || 80,
			minHeight: parseInt((form.elements.namedItem("min_cell_height") as HTMLInputElement).value) || 80,
			minXOffset: parseInt((form.elements.namedItem("min_x_offset") as HTMLInputElement).value) || -20,
			minYOffset: parseInt((form.elements.namedItem("min_y_offset") as HTMLInputElement).value) || -150,
			maxWidth: parseInt((form.elements.namedItem("max_cell_width") as HTMLInputElement).value) || 150,
			maxHeight: parseInt((form.elements.namedItem("max_cell_height") as HTMLInputElement).value) || 150,
			maxXOffset: parseInt((form.elements.namedItem("max_x_offset") as HTMLInputElement).value) || 150,
			maxYOffset: parseInt((form.elements.namedItem("max_y_offset") as HTMLInputElement).value) || 150,
			maxUploadSize: (form.elements.namedItem("max_upload_size") as HTMLInputElement).value || "8mb",
			imageQuality: parseFloat((form.elements.namedItem("image_quality") as HTMLInputElement).value) || 0.7,
			imageSizeMultiplier: parseFloat((form.elements.namedItem("image_size_multiplier") as HTMLInputElement).value) || 1,
			maxAllowedGifFrames: parseInt((form.elements.namedItem("max_allowed_gif_frames") as HTMLInputElement).value) || 30,
			previewFPS: parseInt((form.elements.namedItem("preview_fps") as HTMLInputElement).value) || 4,
			amountOfCollections: parseInt((form.elements.namedItem("amount_of_collections") as HTMLInputElement).value) || 12,
			background: (form.elements.namedItem("background") as HTMLInputElement).value || null,
			warnBeforeLeavingPage: (form.elements.namedItem("warn_before_leaving_page") as HTMLInputElement).checked || true
		};

		return settings;
	}

	refreshSettings() {
		this._settings = this.parseForm();
		this.runConfig();
	}

	get settings() {
		return this._settings;
	}


	get state() {
		return this._state;
	}
}

export default Configuration;
