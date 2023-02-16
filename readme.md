# Fruity Dance Sprite Sheet Generator

<div align=center> <img width="200px"src='logotype.png'> <br> <h3> An Editor & Generator for the Fruity Dance plugin</h3> </div> <br>

This project was made as a tool for the FL Studio plugin [Fruity Dance](https://www.image-line.com/fl-studio-learning/fl-studio-online-manual/html/plugins/Fruity%20Dance.htm).

## Using the generator

This project has been refactored to use [TypeScript](https://www.typescriptlang.org/). You can find the original pure JavaScript release at the _releases_ tab of this GitHub page.

### Original JavaScript release

Simply download the project and open the `index.html` file inside the `generator` folder to get started. The only thing you need is a modern browser to run it.

### New TypeScript release

You have two options:

1. Download build
2. Build from source

#### Download build (not currently avaible)

You can download the build from the _releases_ section of this GitHub page.

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

### Development

Run `npm run dev` in the console and open `http://localhost:9000/dist/index.html` to get started. All changes to files will be automatically compiled and auto reload is enabled.

## Features

![image](https://user-images.githubusercontent.com/89783791/219487771-f7902095-826e-413a-8db9-dba32b5482ff.png)

- Right click on an image to sort it into a "collection". <br>
- Upload one or many image files **or** a gif file to auto extract its frames. If you upload a gif, choose upload mode. <br>
  - If you're going to upload a gif with a transparent background, choose `Upload mode: Transparent GIF`.
  - Otherwise, choose `Upload mode: NON Transparent GIF`. <br>
- Drag and drop images into the grid to place them. <br>
- Save your sprite sheet as a JSON file and load it later, or download the compiled sprite sheet image and text file
- Adjust the generator in the settings

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

Please create a new issue if you find a bug. Thanks.
