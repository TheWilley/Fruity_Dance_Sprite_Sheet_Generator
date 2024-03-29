import DragHandler from "./dragHandler";
import EventListeners from "./eventListeners";
import GraphicHandler from "./globals/graphicHandler";
import Globals from "./globals/globals";
import ElementCatcher from "./globals/elementCatcher";
import Configuration from "./globals/config";
import ImageCollection from "./globals/imageCollection";
import MouseHandler from "./mouseHandler";
import Table from "./globals/table";
import { LIB_VERSION } from "./version";
import ImageInfo from "./imageInfo";
import * as bootstrap from "bootstrap";

// Global variable that holds all instances
export let globals: Globals;

/**
 * Initializes the app
 */
export function init() {
	createGlobals();
	addVersionNumber();

	new DragHandler().run();
	new EventListeners().run();
	new MouseHandler();
	globals.table.addTable();
	globals.graphicHandler.ctx();
}

/**
 * Adds instances to global variable
 */
function createGlobals() {
	//TODO: Make all classes globbals
	globals = new Globals();
	globals.elementCatcher = new ElementCatcher({
		targetElement: document.getElementById("app"),
		getElementsWith: "id"
	});
	globals.config = new Configuration();
	globals.imageCollection = new ImageCollection();
	globals.graphicHandler = new GraphicHandler();
	globals.table = new Table();
	create2dArrayForImages();
}

/**
 * Get latest release from github
 */
async function addVersionNumber() {
	// https://stackoverflow.com/a/67701490/10223638
	if (LIB_VERSION == undefined) {
		console.error("LIB_VERSION is undefined");
		process.exit(1);
	}
	globals.config.state.currentVersion.innerText = "v" + LIB_VERSION;
}

/**
 * Creates a 2D array of ImageInfo objects
 */
function create2dArrayForImages() {
	for (let x = 0; x <= 999; x++) {
		/* For every row, add another row to the 2D array in @getSet.js.
		This way, the array is dynamic. */
		globals.imageCollection.cellCollection.push([]);
		for (let y = 0; y <= 7; y++) {
			// Here we add a tempobject to the grid to store for later usage
			const tempobject = new ImageInfo(x, y);
			globals.imageCollection.cellCollection[x][y] = tempobject;
			globals.imageCollection.cellCollection[x][y].xOffset = 0;
			globals.imageCollection.cellCollection[x][y].yOffset = 0;
			globals.imageCollection.cellCollection[x][y].sizeMultiplier = 1;
		}
	}
}