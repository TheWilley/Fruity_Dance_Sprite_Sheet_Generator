import DragHandler from "./dragHandler";
import EventListeners from "./eventListeners";
import GraphicHandler from "./globals/graphicHandler";
import Globals from "./globals/globals";
import ElementCatcher from "./globals/elementCatcher";
import Configuration from "./globals/config";
import ImageCollection from "./globals/imageCollection";
import MouseHandler from "./mouseHandler";
import Table from "./globals/table";
import {LIB_VERSION} from "./version";

// Global variable that holds all instances
export let globals: Globals;

/**
 * Initializes the app
 */
export function init() {
	createGlobals();
	addVersionNumber();
	checkTheme();

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
	globals.config.state.currentVersion.innerText = LIB_VERSION;
}

/**
 * Checks if the user has a theme preference
 */
function checkTheme() {
	if (localStorage.getItem("theme") === "lightTheme") {
		document.body.classList.add("lightTheme");
	} else {
		document.body.classList.add("darkTheme");
	}
}
