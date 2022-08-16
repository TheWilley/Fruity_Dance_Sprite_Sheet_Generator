
/**
 * @description Element catcher to access elements with object syntax 
 * @param {object} - Options object 
 * 
 * @author TheWilley
 */
 class elementCatcher {
    #object

    constructor(object) {
        this.#object = object
        this.elements = []

        this.app = this.returnApp()
        this.start()
    }

    error(message) {
        alert("[[elementCatcher]] Error - " + message)
        throw new Error(message)
    }

    returnApp() {
        if (this.#object == null) this.error(`No object found`)
        if (this.#object.ignoreClass && this.#object.includeClass) this.error(`ignoreClass and includeClass cannot exist in the same instance`)
        if (!this.#object.id) this.error(`No id value found`)
        if (document.getElementById(this.#object.id) == null) this.error(`No id with value "${this.#object.id}" found`)

        return document.getElementById(this.#object.id)
    }
    
    start() {
        for (const element of this.#object.directChildren ? this.app.childNodes : this.app.getElementsByTagName("*")) {
            switch (this.#object.getElementsWith) {
                case 'id': 
                    if (this.#object.ignoreClass) { if (!element.id && element.classList.contains(this.#object.ignoreClass)) this[element.id] = element }
                    else if (this.#object.includeClass) { if (element.id && element.classList.contains(this.#object.includeClass)) this[element.id] = element }
                    else if (element.id) { this[element.id] = element }
                    break;
                case 'class':
                    if (this.#object.ignoreClass) { if (element.classList.length > 0 && !element.classList.contains(this.#object.ignoreClass)) this.elements.push(element); }
                    else if (this.#object.includeClass) { if (element.classList.length > 0 && element.classList.contains(this.#object.includeClass)) this.elements.push(element) }
                    else if (element.classList.length > 0) { this.elements.push(element) }
                    break;
                case 'all':
                    if (this.#object.ignoreClass) { if (!element.classList.contains(this.#object.ignoreClass)) element.id ? this[element.id] = element : this.elements.push(element) }
                    else if (this.#object.includeClass) { if (element.classList.contains(this.#object.includeClass)) element.id ? this[element.id] = element : this.elements.push(element) }
                    else { element.id ? this[element.id] = element : this.elements.push(element) }
                    break;
                case 'allAsArray':
                    if (this.#object.ignoreClass) { if (!element.classList.contains(this.#object.ignoreClass)) this.elements.push(element) }
                    else if (this.#object.includeClass) { if (element.classList.contains(this.#object.includeClass)) this.elements.push(element) }
                    else { this.elements.push(element) }
                    break;
                default:
                    this.error(`'${this.#object.getElementsWith}' is not a valid 'getElementsWith' value (id, class, all, allAsArray)`)
            }
        }
    }
}