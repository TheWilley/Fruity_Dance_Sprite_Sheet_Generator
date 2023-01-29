import DragHandler from "./dragHandler";
import EventListeners from "./eventListeners";
import GraphicHandler from "./graphicHandler";
import Table from "./table";
import Globals from "./globals/globals";
import ElementCatcher from "./globals/elementCatcher";
import Configuration from "./globals/config";
import ImageCollection from "./globals/imageCollection";

// Global variable
export var globals: Globals

// Init all needed functions
export function init() {
    createGlobals()
    new Table().addTable();
    new GraphicHandler().ctx()
    new DragHandler().run()
    new EventListeners().run()
}

// add instances to global variable
function createGlobals() {
    globals = new Globals()
    globals.elementCatcher = new ElementCatcher({targetElement: document.getElementById("app"), getElementsWith: "id"})
    globals.config = new Configuration()
    globals.imageCollection = new ImageCollection()
}