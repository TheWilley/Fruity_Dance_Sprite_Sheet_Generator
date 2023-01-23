class ElementCatcher {
    #config

    /**
     * @description Element catcher to access elements with object syntax 
     * @param {Object} config The config object
     * @param {string} config.id The id of your target element. 
     * @param {("id" | "class" | "all" | "allAsArray")} config.getElementsWith Filters elements by type
     * @param {string=} config.ignoreClass Only elements without this class name will be added
     * @param {string=} config.includeClass Only elements with this class name will be added
     * @param {boolean=} config.directChildren Only catch elements that is a direct child of the target element
     * @author TheWilley
     */
    constructor(config) {
        /**

         */
        this.#config = config

        this.elements = []

        this.app = this.returnApp()
        this.start()
    }

    error(message) {
        alert("[[ElementCatcher]] Error - " + message)
        throw new Error(message)
    }

    returnApp() {
        if (this.#config == null) this.error(`No object found`)
        if (this.#config.ignoreClass && this.#config.includeClass) this.error(`ignoreClass and includeClass cannot exist in the same instance`)
        if (!this.#config.id) this.error(`No id value found`)
        if (document.getElementById(this.#config.id) == null) this.error(`No id with value "${this.#config.id}" found`)

        return document.getElementById(this.#config.id)
    }

    start() {
        for (const element of this.#config.directChildren ? this.app.childNodes : this.app.getElementsByTagName("*")) {
            switch (this.#config.getElementsWith) {
                case 'id':
                    if (this.#config.ignoreClass) { if (!element.id && element.classList.contains(this.#config.ignoreClass)) this[element.id] = element }
                    else if (this.#config.includeClass) { if (element.id && element.classList.contains(this.#config.includeClass)) this[element.id] = element }
                    else if (element.id) { this[element.id] = element }
                    break;
                case 'class':
                    if (this.#config.ignoreClass) { if (element.classList.length > 0 && !element.classList.contains(this.#config.ignoreClass)) this.elements.push(element); }
                    else if (this.#config.includeClass) { if (element.classList.length > 0 && element.classList.contains(this.#config.includeClass)) this.elements.push(element) }
                    else if (element.classList.length > 0) { this.elements.push(element) }
                    break;
                case 'all':
                    if (this.#config.ignoreClass) { if (!element.classList.contains(this.#config.ignoreClass)) element.id ? this[element.id] = element : this.elements.push(element) }
                    else if (this.#config.includeClass) { if (element.classList.contains(this.#config.includeClass)) element.id ? this[element.id] = element : this.elements.push(element) }
                    else { element.id ? this[element.id] = element : this.elements.push(element) }
                    break;
                case 'allAsArray':
                    if (this.#config.ignoreClass) { if (!element.classList.contains(this.#config.ignoreClass)) this.elements.push(element) }
                    else if (this.#config.includeClass) { if (element.classList.contains(this.#config.includeClass)) this.elements.push(element) }
                    else { this.elements.push(element) }
                    break;
                default:
                    this.error(`'${this.#config.getElementsWith}' is not a valid 'getElementsWith' value (id, class, all, allAsArray)`)
            }
        }
    }

    addElement(element) {
        if (Array.isArray(element)) {
            element.forEach(e => {
                if (e.id) {
                    this[e.id] = e;
                } else if (e.classList.length > 0) {
                    this.elements.push(e);
                } else {
                    this.error("Element has no id or class")
                }
            })
        } else {
            if (element.id) {
                this[element.id] = element;
            } else if (element.classList.length > 0) {
                this.elements.push(element);
            } else {
                this.error("Element has no id or class")
            }
        }
    }
}
