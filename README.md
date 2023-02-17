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

## Hello World

```html
<body>
  <img id="image" class="image" alt="" src="./girl.jpg" width="400" />
  <link rel="stylesheet" href="https://unpkg.com/@armantang/zoom-img/dist/index.css">
  <script src="https://unpkg.com/@armantang/zoom-img/dist/index.iife.js"></script>
  <script>
    const image = document.getElementById('image')
    image.addEventListener('click', zoomImg)
  </script>
</body>
```

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
