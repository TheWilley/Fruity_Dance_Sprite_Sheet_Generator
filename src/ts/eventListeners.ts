import Configuration from "./config"
import DownloadUpload from "./downloadUpload"

class EventListeners {
    private config
    private downloadUpload
    private state

    constructor() {
        const config = new Configuration()
        this.downloadUpload = new DownloadUpload()
        this.config = config.settings
        this.state = config.state
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
                        self.state.downloadJson.click();
                        break;
                    case 'e': // Export
                        event.preventDefault();
                        self.state.filename.value = "savedSpriteSheet";
                        self.state.downloadSpriteSheet.click();
                        self.state.filename.value = "";
                        break;
                    case 'u': // Clear uploaded images
                        event.preventDefault();
                        self.state.clear.click();
                        break;
                }
            }
        });

        /**
         * Checks if download sprite sheet button has been clicked
         */
        $(this.state.downloadSpriteSheet).on('click', function (e) {
            self.downloadUpload.downloadZIP(canvas, self.state.textarea.value, self.state.filename.value);
        });

        /**
         * Checks if download Json button has been clicked sdfsd
         */
        $(this.state.downloadJson).on('click', function (e) {
            self.downloadUpload.saveJson();
        });

        /**
         * Creates table when website has loaded
         */
        $(document).on('ready', function () {
            table.addTable();
            graphicHandler.ctx()
        })

        /**
         * Checks scroll position
         */
        $(window).on("scroll", (event) => {
            if (this.scrollY >= 45) {
                this.state.sidebar.classList.add("fixedSidebar")
                this.state.sidebarContainer.classList.add("fixedContainer")
            } else {
                this.state.sidebar.classList.remove("fixedSidebar")
                this.state.sidebarContainer.classList.remove("fixedContainer")
            }
        });

        /**
         * Runs Before leaving page
         */
        $(window).on('beforeunload', function () {
            if (self.config.warnBeforeLeavingPage) return 'Your changes might not be saved';
        })

        /**
         * Checks if element values are too high or low
         */
        $([this.state.rows, this.state.cell_width, this.state.cell_height]).on('change', function (event: Event) {
            self.checkMinMax(event);
            if (table.checkEmptyCells()) table.addTable();
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