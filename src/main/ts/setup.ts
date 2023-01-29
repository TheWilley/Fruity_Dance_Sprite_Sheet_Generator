import DragHandler from "./dragHandler";
import EventListeners from "./eventListeners";
import GraphicHandler from "./graphicHandler";
import Table from "./table";

// Start
class Setup {
    public run() {
        new Table().addTable();
        new GraphicHandler().ctx()
        new DragHandler().run()
        new EventListeners().run()
    }
}

export default Setup