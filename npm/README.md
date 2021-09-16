# handle-image-zoom

This library provide a listener to add to an `<img>` element.

When you click the `<img> `, a wrapper contains the image will be appended to the `<body>`.

And in the wrapper, you can:

1. click image to move it;
2. wheel mouse to zoom it;
3. press `enter` or double click image to reset the image style;
4. press `esc` or click wrapper to remove the wrapper.

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
```

## Quick Start

```javascript
import 'handle-image-zoom/dist/index.css'
import handleImageZoom from 'handle-image-zoom'

const image = document.getElementById('image')
image.addEventListener('click', handleImageZoom)
```
