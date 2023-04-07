import { globals } from "./setup";
import * as FilePond from "filepond";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import gifFrames from "gif-frames";
import CompressImages from "./compressImages";
import FilePondPluginFileEncode from "./libs/filepond/addons/filepond-plugin-file-encode.min";
import FilePondPluginFileValidateSize from "./libs/filepond/addons/filepond-plugin-file-validate-size.min";
import FilePondPluginFileValidateType from "./libs/filepond/addons/filepond-plugin-file-validate-type.min";
import ImageInfo from "./imageInfo";

class DownloadUpload {
	private _settings = globals.config.settings;
	private _state = globals.config.state;
	private _imageCollection = globals.imageCollection;
	private _graphicHandler = globals.graphicHandler;
	private _table = globals.table;

	constructor() {
		// Create new pond instance
		this.pond();
	}

	/**
	 * Creates a new image element and appends it to a collection
	 * @param {*} src - An image src
	 */
	public async createImage(src: File) {
		return new Promise<void>((resolve) => {
			if (src) {
				const div = document.createElement("div");
				div.setAttribute("class", "result-container");
				new CompressImages(src, div).init();
				resolve();
			}
		});
	}

	/**
	 * Checks if animations names are correct
	 * @returns True | False
	 */
	public checkAnimationNames(frameNames: string[]) {
		// Removes white lines
		for (let i = 0; i < frameNames.length; i++) {
			if (frameNames[i] == "") {
				alert("Animation names cannot be empty!");
				return false;
			}
		}

		return true;
	}

	/**
	 * Parses animation names from textarea
	 * @returns Array of animation names
	 */
	parseFrameNames(frameNamesContainer: HTMLElement) {
		// Holds all animation names
		const frameNames: string[] = [];

		// Get all animation names from div element
		for (const element of frameNamesContainer.children as unknown as HTMLInputElement[]) {
			frameNames.push(element.value);
		}

		return frameNames;
	}

	/**
	 * Compress sprite sheet along with a text file into a ZIP, then downloads it
	 * @param {Object} canvas - The canvas element (sprite sheet)
	 * @param {*} frameNamesContainer - The animations names
	 * @param {*} filename - The filename of the exported ZIP
	 */
	public downloadZIP(
		canvas: HTMLCanvasElement,
		frameNamesContainer: HTMLElement,
		filename: string
	) {
		// Declare constants
		const zip = new JSZip();
		const zipFilename = `${filename}.zip`;
		const output = new Image();
		output.src = canvas.toDataURL();

		// Check if animation names are correct before continuing with the export
		if (this.checkAnimationNames(this.parseFrameNames(frameNamesContainer))) {
			// Check for invalid characters in filename
			if (
				/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(filename) == true ||
				filename == ""
			) {
				alert("Illegal file name!");
			} else {
				// Zip image and text file
				zip.file(
					`${filename}.png`,
					output.src.substring(output.src.indexOf(",") + 1),
					{ base64: true }
				);
				zip.file(
					`${filename}.txt`,
					this.parseFrameNames(frameNamesContainer).join("\n")
				);

				// Save file
				zip.generateAsync({ type: "blob" }).then((content: Blob) => {
					saveAs(content, zipFilename);
				});
			}
		}
	}

	/**
	 * Removes all stored image elements
	 */
	public clearData() {
		if (!confirm("This action will remove ALL UPLOADED IMAGES. Continue?")) {
			return;
		}

		// Reset local storage
		localStorage.setItem("images", "");
		localStorage.setItem("imagenumb", "");
		this._graphicHandler.disableControls(true);

		location.reload();
	}

	/**
	 * Saves a json file containing data about sprite sheet
	 */
	public saveJson() {
		const object = {
			spriteSheetId: "cWqgPFdGN5", // Identifies the json as a sprite sheet
			rows: this._state.rows.value,
			rowNames: this.parseFrameNames(this._state.row_names_container).join(
				"\n"
			),
			width: this._state.cell_width.value,
			height: this._state.cell_height.value,
			tableObject: this._imageCollection.cellCollection
		};

		// Create a blob of the data
		const fileToSave = new Blob([JSON.stringify(object, undefined, 2)], {
			type: "application/json"
		});

		// Save the file
		saveAs(fileToSave, "savedSpritSheet.json");
	}

	/**
	 * Creates drag and drop functionality
	 */
	public pond() {
		FilePond.registerPlugin(
			FilePondPluginFileEncode,
			FilePondPluginFileValidateSize,
			FilePondPluginFileValidateType
		);

		/**
		 * Extracts all frames from a gif file
		 * @param {Object} file - A gif file
		 * @returns
		 */
		const extractFrames = async (file: File) => {
			return new Promise<void>((resolve) => {
				const maxFrames = this._settings.max_allowed_gif_frames;

				// Export frames depending on transparency
				gifFrames({
					url: file,
					frames: "all",
					outputType: "canvas",
					cumulative:
						this._state.cumulative.value == "cumulative" ? false : true
				})
					.then((frameData: any) => {
						frameData.forEach((frame: HTMLElement, i: number) => {
							if (i < maxFrames) {
								this._state.gif_frames.appendChild(frameData[i].getImage());
							}
						});

						for (const frame of this._state.gif_frames.childNodes) {
							// https://stackoverflow.com/a/60005078
							fetch(frame.toDataURL())
								.then((res) => {
									return res.blob();
								})
								.then(async (blob) => {
									await this.createImage(new File([blob], "file"));
								});
						}

						this._state.gif_frames.innerHTML = "";
					})
					.catch(console.error.bind(console));
				resolve();
			});
		};

		/*/ Interfaces used to handle missing types START /*/
		interface FilePondPlugins extends FilePond.FilePondOptions {
			maxFilesize?: string;
		}

		interface FileExtender extends File {
			getFileEncodeDataURL(): File;
			substring(number: number): string;
		}

		interface FilePondFileExtender extends FilePond.FilePondFile {
			getFileEncodeDataURL(): FileExtender;
			file: FileExtender;
		}
		/*/ Interfaces used to handle missing types END /*/

		/**
		 * FilePond instance for images / gifs
		 */
		const uploadImage = FilePond.create(document.querySelector("#files"), {
			// Settings
			labelIdle:
				"Drag & Drop your <b>Image(s) / Gif</b> file or <span class=\"filepond--label-action\"> Browse </span>",
			maxFileSize: this._settings.max_upload_size
				? this._settings.max_upload_size
				: "2mb",
			allowMultiple: true,
			maxFiles: 20,
			allowFileTypeValidation: true,
			acceptedFileTypes: ["image/png", "image/jpeg", "image/gif"],
			credits: false,

			onaddfile: async (error, image: FilePondFileExtender) => {
				if (error) {
					return;
				}

				// For every image
				try {
					if (image.fileType == "image/gif") {
						await extractFrames(image.getFileEncodeDataURL());
						uploadImage.removeFile(image);
					} else {
						await this.createImage(image.file);
						uploadImage.removeFile(image);
					}
				} catch (err) {
					if (err instanceof TypeError) {
						console.log(err);
						console.log("Invalid File");
					}
				}
			}
		} as FilePondPlugins);

		type jsonSpriteSheet = {
			_x: number;
			_y: number;
			_xOffset: number;
			_yOffset: number;
			_sizeMultiplier: number;
			_isFlippedVertically: boolean;
			_isFlippedHorizontally: boolean;
			_imageSrc: string;
		};

		/**
		 * Iterates through the json and creates an array of ImageInfo objects
		 * @param json The json containing sprite sheet data
		 * @returns A 2D array of ImageInfo objects
		 */
		const itterateJson = (json: jsonSpriteSheet[][]) => {
			const imageCollection: ImageInfo[][] = [];

			for (const [i, row] of json.entries()) {
				imageCollection.push([]);
				for (const [e, cell] of row.entries()) {
					imageCollection[i][e] = new ImageInfo(
						cell._x,
						cell._y,
						cell._xOffset,
						cell._yOffset,
						cell._sizeMultiplier,
						cell._isFlippedVertically,
						cell._isFlippedHorizontally,
						cell._imageSrc
					);
				}
			}

			return imageCollection;
		};

		/**
		 * Sets the animation names from the json
		 * @param json The json containing sprite sheet data
		 */
		const setAnimationNames = (json: string) => {
			// Split the string into an array by new line
			const names = json.split("\n");

			// Set the value of each input to the corresponding name
			for (const [
				index,
				element
			] of this._state.row_names_container.childNodes.entries()) {
				element.value = names[index];
			}
		};

		/**
		 * Handles and manages uploaded json data
		 * @param {string} json - The json containing sprite sheet data
		 */
		const handleJson = (json: any) => {
			this._state.rows.value = json.rows;
			this._state.cell_width.value = json.width;
			this._state.cell_height.value = json.height;

			this._table.addTable();
			setAnimationNames(json.rowNames);
			this._imageCollection.cellCollection = itterateJson(json.tableObject);
			this._table.iterateTable();
			this._graphicHandler.redraw();
		};

		/**
		 * Filepond instance for json files
		 */
		const uploadJson = FilePond.create(document.querySelector("#uploadJson"), {
			// Settings
			labelIdle:
				"Drag & Drop your <b> JSON </b> file or <span class=\"filepond--label-action\"> Browse </span>",
			maxFileSize: "30mb",
			allowFileTypeValidation: true,
			acceptedFileTypes: ["application/json"],
			credits: false,
			labelFileProcessingError: (error: FilePond.FilePondErrorDescription) => {
				return error.body;
			},

			server: {
				process: (error: any) => {
					const file = uploadJson.getFile() as FilePondFileExtender;
					if (
						JSON.parse(atob(file.getFileEncodeDataURL().substring(29)))
							.spriteSheetId == "cWqgPFdGN5"
					) {
						handleJson(
							JSON.parse(atob(file.getFileEncodeDataURL().substring(29)))
						);
						setTimeout(() => {
							uploadJson.removeFile();
						}, 500);
					} else {
						error("File is not a sprite sheet!");
					}
				}
			}
		} as FilePondPlugins);
	}
}

export default DownloadUpload;
