# Fruity Dance Sprite Sheet Generator

<div align=center> <img width="200px"src='logotype.png'> <br> <h3> An Editor & Generator for the Fruity Dance plugin</h3> </div> <br>

This project was made with the FL studio plugin known as [Fruity Dance](https://www.image-line.com/fl-studio-learning/fl-studio-online-manual/html/plugins/Fruity%20Dance.htm) in mind. For instance, you don't have to change the height and width of the sprite sheet manually, as this generator does all that automatically.

## The Plugin Rules
The rules can be sumarized as such:
1. All cells must be equal in width and height, and there must be 8 of them for every row. Say we want a image that is 300px wide: we would need to devide it by eight (300 / 8 = 37.5) and thus we get the width of every cell. The same goes for the height. It does not matter if the height and the width is not the same, as long all cells have equal poppritons. 
2. There must be a `.txt` file with the exact same name as the image file (e.g. generated.png & generated.txt). Every animation name is devided by a **new line** and the last animation name must always be "Held".
3. Altough not mentioned by the website, the animation goes from left to right in a loop. (1 -> 8 -> 1 -> 8, etc.)

## Using the generator
Simply clone the project and open the `index.html` file inside the `generator` folder to get started. The only thing you need is a modern browser to run it. 

## Feautures
* Right click on an image to sort it into a "collection".  <br>
![](readme-stuff/2022-08-18-12-52-34.png)
* Upload images or a gif to auto extract its frames (max 10mb). <br>
![](readme-stuff/2022-08-18-12-56-14.png)
* Edit a cell by clicking on it. You can change the offset or delete the image. You can also edit the row amount and cell size of the entire sprite sheet. <br>
![](readme-stuff/2022-08-18-13-01-00.png)
* Drag and drop images into the grid to place them. You can also delete a uploaded image by dragging it to the delete button. A circle will show you where your mouse is, and the preview will show you the image. <br>
![](readme-stuff/2022-08-18-13-07-48.png)
* Watch your sprite sheet live with the preview section. <br>
![](readme-stuff/2022-08-18-13-14-02.png)
* Edit the name of animations and the ZIP.
![](readme-stuff/2022-08-18-13-21-01.png)
 
## Configure the generator
The current configuration is set to give the best user experience, but you may reconfigure the generator if you want to.

You can find the config variable `settings` in `generator/scripts/conifg.js`. The current config looks like this:
```javascript
    var settings = {
        /*/ Canvas settings /*/
        maxRows: 40, // Max amount of allowed rows

        minWidth: 80, // Minimum cell width
        minHeight: 80, // Minimum cell height
        minXOffset: -20, // Minimum X-offset
        minYOffset: -150, // Minimum Y-offset

        maxWidth: 150, // Maximum cell width
        maxHeight: 150, // Maximum cell height
        maxXOffset: 150, // Maximum X-offset
        maxYOffset: 150, // Maximum Y-offset
        
        /*/ Upload settings /*/
        maxUploadSize: "8mb", // Max image upload size
        compressionRate: 0.7, // The image compression rate (1 = no compression, 0 = highest compression)
        maxAllowedGifFrames: 30, // Limit how many frames of a gif to export

        /*/ Other settings /*/
        previewFPS: 4, // The FPS of the preview
        amountOfCollections: 12, // The amount of collections (The ctx menu can only handle about 38)
        background: null // A custom background, must be a link to an image / path to a local one OR a color in HEX (null will mean default)
    }
```
## Keyboard shortcuts
<table>
    <thead> <td> Shortcut </td> <td> Description </td></thead>
    <tbody> 
        <tr>
            <td> <code> ctrl + s </code> / <code> ⌘ + s </code>
            <td> Save the sprite sheet in json format </td>
        </tr>
        <tr>
            <td> <code> ctrl + e </code> / <code> ⌘ + e </code>
            <td> Export the sprite sheet </td>
        </tr>
        <tr>
            <td> <code> ctrl + u </code> / <code> ⌘ + u </code>
            <td> Clear uploaded images </td>
        </tr>
    </tbody>
</table>

## Libaries
* bootstrap - MIT -  Copyright (c) 2011-2018 Twitter, Inc & The Bootstrap Authors - https://github.com/twbs/bootstrap
* CtxMenu-Javascript - MIT - Copyright (c) 2019 Nils Söderman - https://github.com/nils-soderman/CtxMenu-Javascript
* ElementCatcher - MIT - Copyright (c) 2022 TheWilley - https://github.com/TheWilley/ElementCatcher
* filepond - MIT - Copyright (c) 2019 PQINA | Rik Schennink - https://github.com/pqina/filepond
* FileSaver.js - MIT - Copyright (c) 2016 Eli Grey - https://github.com/eligrey/FileSaver.js
* gif-frames - MIT - Copyright (c) 2017 Ben Wiley - https://github.com/benwiley4000/gif-frames
* interact.js - MIT - Copyright (c) 2012-present Taye Adeyemi - https://github.com/taye/interact.js
* Jquery - MIT - Copyright (c) 2015 The jQuery Foundation - https://github.com/jquery/jquery
* JSZip - MIT - Copyright (c) 2009-2016 Stuart Knightley, David Duponchel, Franz Buchinger, António Afonso - https://github.com/Stuk/jszip

## Issues
Plase create a new issue if you find a bug or a missing feature. Thanks.
