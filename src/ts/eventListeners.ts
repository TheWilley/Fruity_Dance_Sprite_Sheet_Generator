import Configuration from "./config"
import DownloadUpload from "./downloadUpload"

class EventListeners {
    private _config
    private _downloadUpload
    private _state

    constructor() {
        const config = new Configuration()
        this._downloadUpload = new DownloadUpload()
        this._config = config.settings
        this._state = config.state
    }

    private run() {
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
            self._downloadUpload.downloadZIP(canvas, self._state.textarea.value, self._state.filename.value);
        });

        /**
         * Checks if download Json button has been clicked sdfsd
         */
        $(this._state.downloadJson).on('click', function (e) {
            self._downloadUpload.saveJson();
        });

        /**
         * Creates table when website has loaded
         */
        $(document).on('ready', function () {
            Table.addTable();
            graphicHandler.ctx()
        })

        /**
         * Checks scroll position
         */
        $(window).on("scroll", (event) => {
            if (this.scrollY >= 45) {
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
            if (self._config.warnBeforeLeavingPage) return 'Your changes might not be saved';
        })

        /**
         * Checks if element values are too high or low
         */
        $([this._state.rows, this._state.cell_width, this._state.cell_height]).on('change', function (event: Event) {
            self.checkMinMax(event);
            if (Table.checkEmptyCells()) Table.addTable();
        });

    }
    /**
     * Checks if the current value is under its minimum / over its maximum
     * @param {object} event 
     */
    private checkMinMax(event: Event) {
        if (parseInt((event.target as HTMLInputElement).value) > parseInt((event.target as HTMLInputElement).getAttribute("max"))) { event.target.value = parseInt((event.target as HTMLInputElement).getAttribute("max")) };
        if (parseInt((event.target as HTMLInputElement).value) < parseInt((event.target as HTMLInputElement).getAttribute("min"))) { event.target.value = parseInt((event.target as HTMLInputElement).getAttribute("min")) };
    }
}

export default EventListeners