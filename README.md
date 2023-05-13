# Zoom Img

As you can see, this library provides a function for zooming <img> elements. There are two ways to utilize this function:

1. `image.addEventListener('click', zoomImg)`
2. `zoomImg(imgSrc)`

## Basic Function

1. Click on the image and move the mouse to change its position
2. Use the scroll wheel on the mouse to zoom in or out (or pinch to zoom on a Magic Trackpad)
3. Press 'Enter' or double-click on the image to reset its style
4. Press 'Esc' or click on the mask to exit

## Advantages

1. Scale the picture based on the position of the mouse
2. Use CSS transform to move and scale the picture, as it should have better performance in theory

## Install

```bash
pnpm add @armantang/zoom-img
```

## Quick Start

```javascript
import '@armantang/zoom-img/dist/index.css'
import zoomImg from '@armantang/zoom-img'

const image = document.getElementById('image')
image.addEventListener('click', zoomImg)

const imgSrc = 'https://xxx'
const button = document.getElementById('button')
button.addEventListener('click', () => {
  zoomImg(imgSrc)
})
```

## Vanilla JS

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta content="width=device-width, initial-scale=1.0" name="viewport" />
  <title>zoom-img</title>
  <link href="https://arman19941113.github.io/zoom-img/index.css" rel="stylesheet">
</head>
<body>
  <h1>Example1: amplify self img</h1>
  <img alt="" class="image" id="image1" src="https://arman19941113.github.io/zoom-img/girl.2x.jpg" width="400" />

  <h1>Example2: amplify high definition img</h1>
  <img alt="" class="image" id="image2" src="https://arman19941113.github.io/zoom-img/girl.1x.jpg" width="400" />

  <script src="https://arman19941113.github.io/zoom-img/index.global.js"></script>
  <script>
    const image1 = document.getElementById('image1')
    image1.addEventListener('click', zoomImg)

    const image2 = document.getElementById('image2')
    image2.addEventListener('click', () => {
      zoomImg('https://arman19941113.github.io/zoom-img/girl.4x.jpg')
    })
  </script>
</body>
</html>
```
