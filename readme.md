# Fruity Dance Sprite Sheet Generator

<div align=center> <img width="200px"src='logotype.png'> <br> <h3> An Editor & Generator for the Fruity Dance plugin</h3> </div> <br>

This project was made as a tool for the FL Studio plugin [Fruity Dance](https://www.image-line.com/fl-studio-learning/fl-studio-online-manual/html/plugins/Fruity%20Dance.htm). 

## Using the generator
This project has been refactored to use [TypeScript](https://www.typescriptlang.org/). You can find the original pure JavaScript release at the *release* tab of this github page. 

### Original JavaScript release
Simply download the project and open the `index.html` file inside the `generator` folder to get started. The only thing you need is a modern browser to run it.

### New TypeScript release
You have two options:

1. Download build
2. Build from source

#### Download build
You can download the build from the *release* section of this github page.

After downloading, go into the `dist` folder. Inside, there is a `index.html` file. Open it with any modern browser.
#### Build from source
First, clone the project and `cd` into it. Once inside, install all needed dependencies:
```
$ npm i
```
Secondly, build the project:
```
$ npm run build
```

A `dist` folder should now be created. Inside, there is a `index.html` file. Open it with any modern browser.


## Features
* Right click on an image to sort it into a "collection".  <br>
![image](https://user-images.githubusercontent.com/89783791/187178884-fa8c7d50-1223-4e5c-96ae-7d59728c3e0f.png)
* Upload one or many image files **or** a gif file  to auto extract its frames. If you upload a gif, choose upload mode. <br>
    * If you're going to upload a gif with a transparent background, choose `Upload mode: Transparent GIF`. 
    * Otherwise, choose `Upload mode: NON Transparent GIF`. <br>
![image](https://user-images.githubusercontent.com/89783791/187177409-f701b001-628f-4a16-b6ab-13822a92e500.png)
* Edit a cell by clicking on it. You can change the offset or delete the image. <br>
![image](https://user-images.githubusercontent.com/89783791/187177639-dddf4c57-f85c-4f10-bc70-00373c1b8bae.png)
* Drag and drop images into the grid to place them. You can also delete a uploaded image by dragging it to the delete button. A circle will show you where your mouse is, and the preview will show you the image. <br>
![image](https://user-images.githubusercontent.com/89783791/187178031-62db9a84-5a1d-49cb-a0c1-febd3b367b7b.png)
* Save your sprite sheet for later as a json file or download it. 
![image](https://user-images.githubusercontent.com/89783791/187178249-8b816e83-3715-42c2-9558-6f033495c318.png)

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
        imageQuality: 0.7, // The image quality (1 = best quality, 0 = worst quality)
        imageSizeMultiplier: 1, // Multiplies the max proportions of an uploaded image (by default the minWidth/minHeight and maxWidth/maxHeight values). Higher value here means better image quality.
        maxAllowedGifFrames: 30, // Limit how many frames of a gif to export

        /*/ Other settings /*/
        previewFPS: 4, // The FPS of a preview
        amountOfCollections: 12, // The amount of collections 
        background: null, // A custom background, must be a link to an image / path to a local one OR a color in HEX (null will mean default)
        warnBeforeLeavingPage: true // Warn user before leaving page to not discard any progress
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
See `package.json`.

## Issues
Plase create a new issue if you find a bug. Thanks.
