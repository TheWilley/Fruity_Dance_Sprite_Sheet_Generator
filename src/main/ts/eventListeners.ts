import { globals } from "./setup"
import DownloadUpload from "./downloadUpload"
import Table from "./table"
import GraphicHandler from "./graphicHandler"
import $ from "jquery";

class EventListeners {
    private _settings = globals.config.settings
    private _state = globals.config.state
    private _downloadUpload = new DownloadUpload()
    private _table = new Table()
    private _graphicHandler = new GraphicHandler()

    public run() {
        const self = this
        /**
         * Keyboard shortcut
         * https://stackoverflow.com/a/14180949
         */
        $(window).on('keydown', function (event) {
            if (event.ctrlKey || event.metaKey) {
                switch (String.fromCharCode(event.which).toLowerCase()) {
                    case 's': // Save
                        event.preventDefault();
                        self._state.downloadJson.click();
                        break;
                    case 'e': // Export
                        event.preventDefault();
                        self._state.filename.value = "savedSpriteSheet";
                        self._state.downloadSpriteSheet.click();
                        self._state.filename.value = "";
                        break;
                    case 'u': // Clear uploaded images
                        event.preventDefault();
                        self._state.clear.click();
                        break;
                }
            }
        });

        /**
         * Checks if download sprite sheet button has been clicked
         */
        $(this._state.downloadSpriteSheet).on('click', function (e) {
            self._downloadUpload.downloadZIP(self._state.canvas, self._state.textarea.value, self._state.filename.value);
        });

        /**
         * Checks if download Json button has been clicked sdfsd
         */
        $(this._state.downloadJson).on('click', function (e) {
            self._downloadUpload.saveJson();
        });

        /**
         * Checks scroll position
         */
        $(window).on("scroll", (event) => {
            if (event.target.scrollY >= 45) {
                this._state.sidebar.classList.add("fixedSidebar")
                this._state.sidebarContainer.classList.add("fixedContainer")
            } else {
                this._state.sidebar.classList.remove("fixedSidebar")
                this._state.sidebarContainer.classList.remove("fixedContainer")
            }
        });

        /**
         * Runs Before leaving page
         */
        $(window).on('beforeunload', function () {
            if (self._settings.warnBeforeLeavingPage) return 'Your changes might not be saved';
        })

        /**
         * Checks if element values are too high or low
         */
        $([this._state.rows, this._state.cell_width, this._state.cell_height]).on('change', function (event: JQuery.ChangeEvent) {
            self._graphicHandler.checkMinMax(event);
            if (self._table.checkEmptyCells()) self._table.addTable();
        });
    }
}

export default EventListeners