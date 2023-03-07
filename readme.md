# Fruity Dance Sprite Sheet Generator

<div align=center> <img width="200px"src='logotype.png'> <br> <h3> An Editor & Generator for the Fruity Dance plugin</h3> </div> <br>

This project was made as a tool for the FL Studio plugin [Fruity Dance](https://www.image-line.com/fl-studio-learning/fl-studio-online-manual/html/plugins/Fruity%20Dance.htm).

## Using the generator

This project has been refactored to use [TypeScript](https://www.typescriptlang.org/). You can find the original pure JavaScript release at the [releases](https://github.com/TheWilley/Fruity_Dance_Sprite_Sheet_Generator/releases) section of this GitHub page, **but it's recommended to use the TypeScript version.**

### TypeScript version

You have three options:

1. [Go to the GitHub pages website](https://thewilley.github.io/Fruity_Dance_Sprite_Sheet_Generator/)
2. [Download build](#download-build)
3. [Build from source](#build-from-source)

#### Download build

You can download the build from the [releases](https://github.com/TheWilley/Fruity_Dance_Sprite_Sheet_Generator/releases) section of this GitHub page.

Open `index.html` in the `dist` folder with any modern browser.

#### Build from source

_OBS: [nodejs](https://nodejs.org/en/download/) is required_

Firstly, clone the project and navigate into it with a terminal. Once inside, install all needed dependencies:

```
$ npm i
```

Secondly, build the project:

```
$ npm run build
```

A `dist` folder should now be created with a `index.html` file inside. Open it with any modern browser.

## Development

_OBS: [nodejs](https://nodejs.org/en/download/) is required_

Run `npm run dev` in the console and open `http://localhost:9000/dist/index.html` to get started. All changes to files will be automatically compiled and auto reload is enabled.

### Deployment

The `npm run deploy` command is used to deploy to GitHub Pages.

### Hooks

A `.git-hooks/commit-msg` file has been created to enforce [conventional commit messages](https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13). To enable:

- `chmod +x '.git-hooks/commit-msg'`
- `git config core.hooksPath '.git-hooks'`

### Version handling

Versions will be updated according to the following rules:

```
<major>.<minor>.<patch>
```

- The major version is seldom increased as it's hard to define any hard-set rules for it. Generally, it's only when the API no longer is compatible with older versions that this version is increased, but when that happens is a question of definition, i.e. when are there _enough_ changes? For this repo, the version will be increased when I feel that it warrants the changes made, or until I find a better way to handle this.
- If `feat` is in the release notes, the minor version will be increased.
- If `fix` is in the release notes, the patch version will be increased.

OBS: Two version numbers may be increased at the same time if both a `feat` and `fix` is included in the release notes.

## Features

[![image.png](https://i.postimg.cc/pd2SCDYM/image.png)](https://postimg.cc/nXPTc9P3)

- Right-click on an image to sort it into a "collection". <br>
- Upload one or many image files or a gif file to auto-extract its frames. If you upload a GIF, choose the upload mode. <br>
  - If you're going to upload a gif with a transparent background, choose Upload mode: Transparent GIF.
  - Otherwise, choose Upload mode: NON Transparent GIF. <br>
- Drag and drop images into the grid to place them. <br>
- Save your sprite sheet as a JSON file to load it later, or download the compiled sprite sheet image and text file.
- Configure the generator in the settings section

## Keyboard shortcuts

<table>
    <thead> <td> Shortcut </td> <td> Description </td></thead>
    <tbody> 
        <tr>
            <td> <code> ctrl + s </code> / <code> ⌘ + s </code>
            <td> Save the sprite sheet in JSON format </td>
        </tr>
        <tr>
            <td> <code> ctrl + e </code> / <code> ⌘ + e </code>
            <td> Export the sprite sheet </td>
        </tr>
        <tr>
            <td> <code> ctrl + u </code> / <code> ⌘ + u </code>
            <td> Clear uploaded images (i.e. <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage">localstorage</a>) </td>
        </tr>
    </tbody>
</table>

## Libaries

See `bundle.js.LICENSE.txt`.

## Issues

Please create a new issue if you find a bug. Thanks.
