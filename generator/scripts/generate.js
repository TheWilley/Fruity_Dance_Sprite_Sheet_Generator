const dom = [
    new BOB("div").cl("domElement").id("mouseCircle").s(),
    new BOB("div").cl("hidden").insert("img").id("canvas_output").s()
];

dom.forEach(e => {
    document.body.appendChild(function() {let template = document.createElement("template"); template.innerHTML = e; return template.content.firstElementChild}())
})
