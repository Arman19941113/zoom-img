# handle-image-zoom

This library provide a listener to add to an `<img>` element.

When you click the `<img> `, a wrapper contains the image will be appended to the `<body>`.

And in the wrapper, you can:

1. mousedown the image to move it;
2. wheel the mouse to zoom it taking the mouse position as the center;
3. double click to reset the style;
4. click the wrapper or press `enter`, `esc` to remove the wrapper.

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
