import ElementCatcher from "./libs/elementCatcher"
import DownloadUpload from "./downloadUpload"
import CompressImages from "./helpers/compressImages"
import Configuration from "./config"

// Global scope
export const elementCatcher = new ElementCatcher({ targetElement: document.getElementById("app"), getElementsWith: "id" })
export const downloadUpload = new DownloadUpload()
export const config = new Configuration()