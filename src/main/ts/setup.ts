import DragHandler from "./dragHandler";
import EventListeners from "./eventListeners";
import GraphicHandler from "./globals/graphicHandler";
import Globals from "./globals/globals";
import ElementCatcher from "./globals/elementCatcher";
import Configuration from "./globals/config";
import ImageCollection from "./globals/imageCollection";
import MouseHandler from "./mouseHandler";
import Table from "./globals/table";
import { Octokit } from "octokit";

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
}

/**
 * Get latest release from github
 */
async function addVersionNumber() {
	const octokit = new Octokit();

	const latestRelease = await octokit.request(
		"GET /repos/TheWilley/Fruity_Dance_Sprite_Sheet_Generator/releases/latest",
		{
			owner: "OWNER",
			repo: "REPO"
		}
	);

	globals.config.state.currentVersion.innerText = latestRelease.data.tag_name;

	console.log(latestRelease.data.tag_name);
}
