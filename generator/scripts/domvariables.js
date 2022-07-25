/**
 * Thanks to u/PotbellyPlatypus for the help
 */

// Create object
const state = {}

// Populate object
function populateState(state) {
    const elems = document.querySelectorAll('.domElement')
    for (const elem of elems) {
        if (elem.id) { state[elem.id] = elem }
        else { throw new Error("Element " + elem + " does not have an ID. All instances with the 'domElement' class must have an ID!") }
    }
}

populateState(state);
console.log(state)