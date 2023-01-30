import Configuration from "./config";
import ElementCatcher from "./elementCatcher";
import ImageCollection from "./imageCollection";
import GraphicHandler from "./graphicHandler";
import Table from "../table";

class Globals {
	private _elementCatcher: ElementCatcher;
	private _config: Configuration;
	private _imageCollection: ImageCollection;
	private _graphicHandler: GraphicHandler;
	private _table: Table;

	get elementCatcher() {
		return this._elementCatcher;
	}

	set elementCatcher(value: ElementCatcher) {
		this._elementCatcher = value;
	}

	get config() {
		return this._config;
	}

	set config(value: Configuration) {
		this._config = value;
	}

	get imageCollection() {
		return this._imageCollection;
	}

	set imageCollection(value: ImageCollection) {
		this._imageCollection = value;
	}

	get graphicHandler() {
		return this._graphicHandler;
	}

	set graphicHandler(value: GraphicHandler) {
		this._graphicHandler = value;
	}

	get table() {
		return this._table;
	}

	set table(value: Table) {
		this._table = value;
	}
}

export default Globals;
