import { globals } from "../setup";
import { ValuesType } from "utility-types";
import tippy from "tippy.js";

// Configuration interface
interface IConfiguration {
	/*/ Canvas settings /*/
	max_rows: number; // Max amount of allowed rows

	min_cell_width: number; // Minimum cell width
	min_cell_height: number; // Minimum cell height
	min_x_offset: number; // Minimum X-offset
	min_y_offset: number; // Minimum Y-offset

	max_cell_width: number; // Maximum cell width
	max_cell_height: number; // Maximum cell height
	max_x_offset: number; // Maximum X-offset
	max_y_offset: number; // Maximum Y-offset

	/*/ Upload settings /*/
	max_upload_size: string; // Max image upload size
	image_quality: number; // The image quality (1 = best quality, 0 = worst quality)
	image_size_multiplier: number; // Multiplies the max proportions of an uploaded image (by default the minWidth/minHeight and maxWidth/maxHeight values). Higher value here means better image quality.
	max_allowed_gif_frames: number; // Limit how many frames of a gif to export

	/*/ Other settings /*/
	preview_fps: number; // The FPS of a preview
	amount_of_collections: number; // The amount of collections
	background: string; // A custom background, must be a link to an image / path to a local one OR a color in HEX (null will mean default)
	warn_before_leaving_page: boolean; // Warn user before leaving page to not discard any progress
}

type ConfigurationAttributeTypes = ValuesType<IConfiguration>;

class Configuration {
	private _settings: IConfiguration;
	private _state = globals.elementCatcher;

	constructor() {
		// Checks if there are any settings in local storage and applies them if there are
		if (localStorage.getItem("settings") != undefined) {
			this._settings = JSON.parse(localStorage.getItem("settings"));
		} else {
			this._settings = this.getDefaultValues();
		}

		this.setFormValues();
		this.runConfig();
	}

	// Applies the settings
	private runConfig() {
		new Map<keyof IConfiguration, (value: ConfigurationAttributeTypes) => void>(
			[
				[
					"max_rows",
					(value: number) => {
						this._state.rows.setAttribute("max", value);
					}
				],
				[
					"min_cell_width",
					(value: number) => {
						this._state.cell_width.setAttribute("min", value);
						this._state.cell_width.value = value;
					}
				],
				[
					"max_cell_width",
					(value: number) => {
						this._state.cell_width.setAttribute("max", value);
					}
				],
				[
					"min_cell_height",
					(value: number) => {
						this._state.cell_height.setAttribute("min", value);
						this._state.cell_height.value = value;
					}
				],
				[
					"max_cell_height",
					(value: number) => {
						this._state.cell_height.setAttribute("max", value);
					}
				],
				[
					"min_x_offset",
					(value: number) => {
						this._state.offset_x.setAttribute("min", value);
					}
				],
				[
					"max_x_offset",
					(value: number) => {
						this._state.offset_x.setAttribute("max", value);
					}
				],
				[
					"min_y_offset",
					(value: number) => {
						this._state.offset_y.setAttribute("min", value);
					}
				],
				[
					"max_y_offset",
					(value: number) => {
						this._state.offset_y.setAttribute("max", value);
					}
				],
				[
					"background",
					(value: string) => {
						if (value != null)
							String(value)[0] == "#"
								? (this._state.app_container.style.background = String(value))
								: (this._state.app_container.style.background = `url(${value})`);
					}
				]
			]
		).forEach((value, key) => {
			if (this._settings[key as keyof IConfiguration]) {
				value(this._settings[key as keyof IConfiguration]);
			}
		});
	}

	// Parses the form and returns the settings
	getFormValues() {
		const form = document.getElementById("config_form") as HTMLFormElement;
		const defaultValues = this.getDefaultValues();

		const settings: IConfiguration = {
			max_rows:
				parseInt(
					(form.elements.namedItem("max_rows") as HTMLInputElement).value
				) || defaultValues.max_rows,
			min_cell_width:
				parseInt(
					(form.elements.namedItem("min_cell_width") as HTMLInputElement).value
				) || defaultValues.min_cell_width,
			min_cell_height:
				parseInt(
					(form.elements.namedItem("min_cell_height") as HTMLInputElement).value
				) || defaultValues.min_cell_height,
			min_x_offset:
				parseInt(
					(form.elements.namedItem("min_x_offset") as HTMLInputElement).value
				) || defaultValues.min_x_offset,
			min_y_offset:
				parseInt(
					(form.elements.namedItem("min_y_offset") as HTMLInputElement).value
				) || defaultValues.min_y_offset,
			max_cell_width:
				parseInt(
					(form.elements.namedItem("max_cell_width") as HTMLInputElement).value
				) || defaultValues.max_cell_width,
			max_cell_height:
				parseInt(
					(form.elements.namedItem("max_cell_height") as HTMLInputElement).value
				) || defaultValues.max_cell_height,
			max_x_offset:
				parseInt(
					(form.elements.namedItem("max_x_offset") as HTMLInputElement).value
				) || defaultValues.max_x_offset,
			max_y_offset:
				parseInt(
					(form.elements.namedItem("max_y_offset") as HTMLInputElement).value
				) || defaultValues.max_y_offset,
			max_upload_size:
				(form.elements.namedItem("max_upload_size") as HTMLInputElement)
					.value || defaultValues.max_upload_size,
			image_quality:
				parseFloat(
					(form.elements.namedItem("image_quality") as HTMLInputElement).value
				) || 0.7,
			image_size_multiplier:
				parseFloat(
					(form.elements.namedItem("image_size_multiplier") as HTMLInputElement)
						.value
				) || defaultValues.image_size_multiplier,
			max_allowed_gif_frames:
				parseInt(
					(
						form.elements.namedItem(
							"max_allowed_gif_frames"
						) as HTMLInputElement
					).value
				) || defaultValues.max_allowed_gif_frames,
			preview_fps:
				parseInt(
					(form.elements.namedItem("preview_fps") as HTMLInputElement).value
				) || defaultValues.preview_fps,
			amount_of_collections:
				parseInt(
					(form.elements.namedItem("amount_of_collections") as HTMLInputElement)
						.value
				) || defaultValues.amount_of_collections,
			background:
				(form.elements.namedItem("background") as HTMLInputElement).value || "",
			warn_before_leaving_page:
				(
					form.elements.namedItem(
						"warn_before_leaving_page"
					) as HTMLInputElement
				).checked || defaultValues.warn_before_leaving_page
		};

		return settings;
	}

	// Returns the default settings
	getDefaultValues() {
		const settings: IConfiguration = {
			max_rows: 20,
			min_cell_width: 80,
			min_cell_height: 80,
			min_x_offset: -20,
			min_y_offset: -150,
			max_cell_width: 150,
			max_cell_height: 150,
			max_x_offset: 150,
			max_y_offset: 150,
			max_upload_size: "8mb",
			image_quality: 0.7,
			image_size_multiplier: 1,
			max_allowed_gif_frames: 30,
			preview_fps: 4,
			amount_of_collections: 12,
			background: "",
			warn_before_leaving_page: false
		};

		return settings;
	}

	// Returns the tooltips for the settings
	getTippyToolTips() {
		// Interface for the tooltips
		type IConfigurationTooltips = Record<keyof IConfiguration, string>;

		// Object consiting of all keys from the IConfiguration interface and their corresponding tippy tooltips
		const tooltips: IConfigurationTooltips = {
			max_rows: "The maximum amount of rows that can be created",
			min_cell_width: "The minimum width of a cell",
			min_cell_height: "The minimum height of a cell",
			min_x_offset: "The minimum X offset of a cell",
			min_y_offset: "The minimum Y offset of a cell",
			max_cell_width: "The maximum width of a cell",
			max_cell_height: "The maximum height of a cell",
			max_x_offset: "The maximum X offset of a cell",
			max_y_offset: "The maximum Y offset of a cell",
			max_upload_size: "The maximum file size of an image that can be uploaded",
			image_quality: "The image quality (1 = best quality, 0 = worst quality)",
			image_size_multiplier:
				"Multiplies the max proportions of an uploaded image (by default the minWidth/minHeight and maxWidth/maxHeight values). Higher value here means better image quality",
			max_allowed_gif_frames:
				"The maximum amount of frames to be  exported from a gif",
			preview_fps:
				"The amount of frames per second that the preview will play at",
			amount_of_collections: "The amount of collections",
			background:
				"The background of the page. This can be a color in HEX a or URL",
			warn_before_leaving_page:
				"Whether or not to warn the user before leaving the page"
		};

		return tooltips;
	}

	// Saves the settings to local storage
	saveSettingsToLocalStorage(settings: IConfiguration) {
		localStorage.setItem("settings", JSON.stringify(settings));
	}

	// Loads the settings from local storage and applies them to all input feilds
	setFormValues() {
		// Get the form
		const form = document.getElementById("config_form") as HTMLFormElement;

		// Loop through all the settings and set the value of each input feild
		for (const key in this._settings) {
			const input = form.elements.namedItem(key) as HTMLInputElement;
			// Check if input is of type boolean
			if (input.type == "checkbox") {
				input.checked = this._settings[key as keyof IConfiguration] as boolean;
			} else {
				input.value = String(this._settings[key as keyof IConfiguration]);
			}

			// Set the tooltip of the coresponing input feild
			tippy(input, {
				content: this.getTippyToolTips()[key as keyof IConfiguration],
				placement: "bottom",
				delay: [500, 0]
			});
		}
	}

	// Refreshes the settings by getting the values from the form and saving them to local storage
	refreshSettings() {
		this._settings = this.getFormValues();
		this.saveSettingsToLocalStorage(this._settings);
	}

	get settings() {
		return this._settings;
	}

	get state() {
		return this._state;
	}
}

export default Configuration;
