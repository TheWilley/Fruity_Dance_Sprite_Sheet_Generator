# Fruity Dance Sprite Sheet Generator

<div style='text-align: center'> <img src='logotype.png'> <br> <h3> A generator for the Fruity Dance plugin</h3> </div> <br>

Yes, there are alot of sprite sheet generators on the internet, but I still belive this project server a purpose. 
This generator was specifically made with the FL studio plugin known as [Fruity Dance](https://www.image-line.com/fl-studio-learning/fl-studio-online-manual/html/plugins/Fruity%20Dance.htm) in mind. This means that you don't have to change settings such as the height and width of the image manually, as this program does all that automatically. The plugin is actually rather specific on how the image is supposed to look. 

## The Rules
(From the plugin page):
> Sprite sheets are PNG format image files. All sprite sheets (e.g. Dance.png) are fixed at 8 cells wide with the option from 1 to an unlimited number of rows (each row is a separate 8 cell animation sequence). The last row is always the 'held by mouse' animation. Cells can be of any size (width/height), but all cells in the sheet must be equal. Remember that the image file must use transparency if the animation is to work against the FL Studio/Windows background although any image format (PNG, JPG, GIF and BMP) will work.
> 
>Text file * .txt - Each sprite sheet must have an accompanying text file with an identical name (e.g. MyAnimation.png + MyAnimation.txt). The text file must contain a name for each row in your sprite sheet. The last row (if you have one) should be called 'Held'. Have a look in the existing Dance.txt and Count.txt files if you are unsure what to do.

The rules can be sumarized as such:
1. All cells must be equal in width and height, and there must be 8 of them for every row. Say we want a image that is 300px wide: we would need to devide it by eight (300 / 8 = 37.5) and thus we get the width of every cell. The same goes for the height. It does not matter if the height and the width is not the same.
2. There must be a txt of the exact same name as the image. (For example: generated.png & generated.txt). Every animation name is devided by a **new line** and the last animation name must always be "Held".
3. Altough not mentioned by the website, the animation goes from left to right in a loop. (frame 1 -> 8, 1 -> 8, ...).

## Using the generator
You can simply clone the project and open the `index.html` file inside the `generator` folder to get started. The only thing you need is a browser to run it. I have not tested it on internet exlorer, but it works fine in chrome and firefox.

1. Start by uploading some images by clicking "Select multiple files...". 
2. Once uploaded, drag and drop them into the grids (edit section). 
3. Click on an image to set an offset. 

## Issues
Plase report all bugs and issues you find in the "issues" section of the github page. If you have suggestions for futures that can be added, feel free to suggest them too. I cannot promise these will be solved or added fast as I'm devoleping this during my free time, but I will try the best I can.