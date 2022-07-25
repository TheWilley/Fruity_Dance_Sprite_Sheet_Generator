const dom = [
    new BOB("div").cl("domElement").id("mouseCircle").s(),
    new BOB("div").cl("hidden").i("img").id("canvas_output").s(),
    new BOB("nav").cl("navbar navbar-expand-lg navbar-dark bg-dark").i("a.", {href: "#"}).cl("navbar-brand").st("margin-left: 10px;").co("Fruity Dance Sprite Sheet Generator").up().i("button", {"type": "button", "data-toggle": "collapse", "data-target": "#navbarSupportedContent", "aria-controls": "navbarSupportedContent", "aria-expanded": "false", "aria-label": "Toggle navigation"}).cl("navbar-toggler")
];

dom.forEach(e => {
    document.body.appendChild(function() {let template = document.createElement("template"); template.innerHTML = e; return template.content.firstElementChild}())
})