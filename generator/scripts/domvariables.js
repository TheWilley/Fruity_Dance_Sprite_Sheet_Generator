// Object to collect DOM elements
var domObjects = {
    objects: [],
    getId: function (query) {
        let result;
        this.objects.forEach(e => {
            if (e.id.indexOf(query) > -1) {
                result = e;
            }
        })
        return result;
    },
    getElements: function () {
        // Factory
        document.querySelectorAll(".domElement").forEach(function (element, i) {
            domObjects.objects[i] = element;
        })
    }
}

domObjects.getElements();

