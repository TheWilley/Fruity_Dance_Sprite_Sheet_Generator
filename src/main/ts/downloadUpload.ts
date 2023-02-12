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
	public checkAnimationNames() {
		const lines = this._state.textarea.value.split("\n");

		// Removes white lines
		const whitelines = function () {
			for (let i = 0; i < lines.length; i++) {
				if (lines[i] == "") {
					return false;
				}
			}

			return true;
		};

		// Get length of lines
		const linesLength = lines.length;

		// Check if last row have text 'held'
		if (!whitelines()) {
			alert("No white lines in animation names!");
			return false;
		} else if (lines[lines.length - 1] != "Held") {
			alert("Could not find animation name 'Held' at last line!");
			return false;

			// Check if there are less animation names than rows 
		} else if (linesLength < this._state.rows.value) {
			alert("There are less animation names than rows!");
			return false;

			// Check if there are more animation names than rows 
		} else if (linesLength > this._state.rows.value) {
			alert("There are more animation names than rows!");
			return false;
		} else {
			return true;
		}
	}

	/**
	 * Compress sprite sheet along with a text file into a ZIP, then downloads it
	 * @param {Object} canvas - The canvas element (sprite sheet)
	 * @param {*} text - The animations names
	 * @param {*} filename - The filename of the exported ZIP
	 */
	public downloadZIP(
		canvas: HTMLCanvasElement,
		text: string,
		filename: string
	) {
		const zip = new JSZip();
		const zipFilename = `${filename}.zip`;
		const output = new Image();
		output.src = canvas.toDataURL();

		if (this.checkAnimationNames()) {
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
				zip.file(`${filename}.txt`, text);

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

		location.reload();
	}

	/**
	 * Saves a json file containing data about sprite sheet
	 */
	public saveJson() {
		const object = {
			spriteSheetId: "cWqgPFdGN5", // Identifies the json as a sprite sheet
			rows: this._state.rows.value,
			rowNames: this._state.textarea.value,
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
				const maxFrames = this._settings.maxAllowedGifFrames;

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

		/**filepond-plugin-file-encode.min
		 * FilePond instance for images / gifs
		 */
		const uploadImage = FilePond.create(document.querySelector("#files"), {
			// Settings
			labelIdle:
				"Drag & Drop your <b>Image(s) / Gif</b> file or <span class=\"filepond--label-action\"> Browse </span>",
			maxFileSize: this._settings.maxUploadSize
				? this._settings.maxUploadSize
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
			_imageSrc: string;
		};

		const itterateJson = (json: jsonSpriteSheet[][]) => {
			const imageCollection: ImageInfo[][] = [];

			for (const [i, row] of json.entries()) {
				imageCollection.push([]);
				for (const [e, cell] of row.entries()) {
					console.log(cell, row);
					imageCollection[i][e] = new ImageInfo(
						cell._x,
						cell._y,
						cell._xOffset,
						cell._yOffset,
						cell._sizeMultiplier,
						cell._imageSrc
					);
				}
			}

			return imageCollection;
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
			this._state.textarea.value = json.rowNames;
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
			maxFileSize: "10mb",
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
