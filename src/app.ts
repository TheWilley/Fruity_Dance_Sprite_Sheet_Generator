import './main/sass/main.sass'
import EventListeners from './main/ts/eventListeners';
import ElementCatcher from "./main/ts/libs/elementCatcher"
import Configuration from "./main/ts/config"

// Global scope
export const elementCatcher = new ElementCatcher({ targetElement: document.getElementById("app"), getElementsWith: "id" })
export const config = new Configuration()

// Import all
function importAll(r: any) {
  r.keys().forEach(r);
}

importAll(require.context('./main/ts', true, /\.ts$/));

// Start
new EventListeners().run()

