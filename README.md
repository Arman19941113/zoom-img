# handle-image-zoom

As you see, it's a function to zoom `<img>` element. And there are two ways to use this function:

1. `image.addEventListener('click', handleImageZoom)`
2. `handleImageZoom(imgSrc)`

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
  <link rel="stylesheet" href="https://unpkg.com/handle-image-zoom/dist/index.css">
  <script src="https://unpkg.com/handle-image-zoom/dist/index.iife.js"></script>
  <script>
    const image = document.getElementById('image')
    image.addEventListener('click', handleImageZoom)
  </script>
</body>
```

## Install

```
# with npm
npm install handle-image-zoom

# with yarn
yarn add handle-image-zoom

# with pnpm
pnpm add handle-image-zoom
```

## Quick Start

```javascript
import 'handle-image-zoom/dist/index.css'
import handleImageZoom from 'handle-image-zoom'

const image = document.getElementById('image')
image.addEventListener('click', handleImageZoom)

const imgSrc = 'https://xxx'
const button = document.getElementById('button')
button.addEventListener('click', () => {
  handleImageZoom(imgSrc)
})
```
