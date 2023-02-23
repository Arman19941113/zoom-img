# zoom-img

As you see, it's a function to zoom `<img>` element. And there are two ways to use this function:

1. `image.addEventListener('click', zoomImg)`
2. `zoomImg(imgSrc)`

## Basic Function

1. press the image to move it;
2. wheel mouse to zoom it(or zoom in Magic Trackpad);
3. press `enter` or double click image to reset the image style;
4. press `esc` or click mask to quit.

## Advantages

1. Scale picture based on the mouse position.
2. Use css transform to move and scale picture. So it has better performance in theory.

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

  <script src="https://arman19941113.github.io/zoom-img/index.iife.js"></script>
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
