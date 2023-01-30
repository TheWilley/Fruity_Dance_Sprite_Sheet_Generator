import "./main/sass/main.sass";
import {init} from "./main/ts/setup";

// Import all
function importAll(r: any) {
	r.keys().forEach(r);
}

importAll(require.context("./main/ts", true, /\.ts$/));

// Init
init();
