import './main/sass/main.sass'
import ElementCatcher from "./main/ts/libs/elementCatcher"
import Configuration from "./main/ts/config"
import Setup from './main/ts/setup';
import ImageCollection from './main/ts/imageCollection';

// Global scope
export const elementCatcher = new ElementCatcher({ targetElement: document.getElementById("app"), getElementsWith: "id" })
export const config = new Configuration()
export const imageCollection = new ImageCollection 

// Import all
function importAll(r: any) {
  r.keys().forEach(r);
}

importAll(require.context('./main/ts', true, /\.ts$/));

// Start
new Setup().run()

