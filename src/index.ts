import { watch, reactive } from '@vue/runtime-core'

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min
  if (value > max) return max
  return value
}

let timestamp = 0

export default function handleImageZoom(rootEvent: MouseEvent): void {
  const originImg = rootEvent.target as HTMLImageElement
  const imageSrc = originImg.getAttribute('src')
  if (!imageSrc) return console.error('unexpected error')

  // 避免快速点击出现多个图片
  const now = Date.now()
  if ((now - timestamp) > 200) timestamp = now
  else return

  // 生成容器元素
  const wrapperElement = document.createElement('div')
  wrapperElement.classList.add('awesome-zoom-image-wrapper')
  wrapperElement.classList.add('enter-from')
  setTimeout(() => {
    wrapperElement.classList.remove('enter-from')
    wrapperElement.addEventListener('transitionend', onShow, { once: true })
  })

  // 生成图片元素
  const imgElement = document.createElement('img')
  imgElement.setAttribute('src', imageSrc)
  imgElement.setAttribute('draggable', 'false')
  const { width: originImgWidth, height: originImgHeight } = originImg.getBoundingClientRect()
  const wPercent = originImgWidth / window.innerWidth
  const hPercent = originImgHeight / window.innerHeight
  if (wPercent > hPercent) {
    imgElement.setAttribute('width', '80%')
  } else {
    imgElement.setAttribute('height', '80%')
  }
  imgElement.classList.add('awesome-zoom-image')

  // 挂载元素
  wrapperElement.appendChild(imgElement)
  document.body.appendChild(wrapperElement)

  // 图片出现后监听事件
  function onShow(): void {
    imgElement.addEventListener('click', handleClick)
    imgElement.addEventListener('wheel', handleWheel)
    imgElement.addEventListener('mousedown', handleMousedown)

    const { width: imgWidth, height: imgHeight } = imgElement.getBoundingClientRect()

    // 图片缩放、移动样式
    const transformState = reactive({
      matrix: { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 },
      origin: `${imgWidth / 2}px ${imgHeight / 2}px`,
    })
    watch(transformState, () => {
      imgElement.style.transform = `matrix(${Object.values(transformState.matrix).join(',')})`
      imgElement.style.transformOrigin = transformState.origin
    }, { immediate: false })

    function resetStyle(): void {
      scale = 1
      accumulateDeltaY = 0
      wheelingDeltaY = 0
      imgElement.classList.remove('transition-active')
      transformState.matrix = { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 }
      transformState.origin = `${imgWidth / 2}px ${imgHeight / 2}px`
    }

    // 双击图片
    let isDoubleClick = false

    function handleClick(e: MouseEvent): void {
      e.stopPropagation()
      if (isDoubleClick) {
        isDoubleClick = false
        resetStyle()
      } else {
        isDoubleClick = true
        setTimeout(() => {
          isDoubleClick = false
        }, 300)
      }
    }

    // 缩放
    const wheelBaseRate = Math.ceil(window.innerHeight / 6) // 多少像素放大一倍，值越小，缩放越快
    const maxScale = 5, minScale = 1
    const maxDeltaY = wheelBaseRate * maxScale, minDeltaY = 0
    let isWheel = false, wheelTimer = 0, scale = 1, accumulateDeltaY = 0, wheelingDeltaY = 0

    function handleWheel(e: WheelEvent): void {
      e.preventDefault()
      e.stopPropagation()
      if (isMove) return

      updateStyleByWheel(e)
      // 经过试验，滚轮100ms未滚动就会停止当前这个滚动行为的计算，deltaY 置零
      wheelTimer && clearTimeout(wheelTimer)
      wheelTimer = window.setTimeout(() => {
        // onWheelEnd
        isWheel = false
      }, 100)
    }

    function updateStyleByWheel(e: WheelEvent): void {
      // 计算放大倍数更新 transform.scale
      if (!isWheel) accumulateDeltaY = wheelingDeltaY
      wheelingDeltaY = clamp(-e.deltaY + accumulateDeltaY, minDeltaY, maxDeltaY)
      scale = clamp(Number(((wheelingDeltaY / wheelBaseRate) + 1).toFixed(1)), minScale, maxScale)
      Object.assign(transformState.matrix, { a: scale, d: scale })

      if (!isWheel) { // 新一轮滚动
        isWheel = true
        imgElement.classList.remove('transition-active')
        // 更新 transform.translate
        const { offsetX: newX, offsetY: newY } = e
        const [oldX, oldY] = transformState.origin.split(' ').map(item => Number(item.slice(0, -2)))
        transformState.matrix.tx += (newX - oldX) * (scale - 1)
        transformState.matrix.ty += (newY - oldY) * (scale - 1)
        // 更新 transform-origin
        transformState.origin = `${newX}px ${newY}px`
      } else {
        // onContinueWheel
        imgElement.classList.add('transition-active')
      }
    }

    // 拖动
    let isMove = false
    let moveCd = false
    let lastMoveX: number, lastMoveY: number

    function handleMousedown(e: MouseEvent): void {
      if (isWheel) return
      isMove = true
      lastMoveX = e.pageX
      lastMoveY = e.pageY
      imgElement.classList.add('transition-active')
      document.addEventListener('mousemove', handleMousemove, { passive: false })
      document.addEventListener('mouseup', handleMouseup)
    }

    function handleMousemove(e: MouseEvent): void {
      if (moveCd) return
      moveCd = true

      // 节流执行的任务
      transformState.matrix.tx += e.pageX - lastMoveX
      transformState.matrix.ty += e.pageY - lastMoveY
      lastMoveX = e.pageX
      lastMoveY = e.pageY

      setTimeout(() => {
        moveCd = false
      }, 50)
    }

    function handleMouseup(): void {
      isMove = false
      document.removeEventListener('mousemove', handleMousemove)
      document.removeEventListener('mouseup', handleMouseup)
    }

    // 关闭
    wrapperElement.addEventListener('click', handleClickWrapper)
    document.addEventListener('keydown', handleKeydown)

    function handleClickWrapper(e: MouseEvent): void {
      e.stopPropagation()
      beforeDestroy()
    }

    function handleKeydown(e: KeyboardEvent): void {
      if (e.code === 'Escape') beforeDestroy()
      else if (['Enter', 'NumpadEnter'].includes(e.code)) {
        resetStyle()
      }
    }

    function beforeDestroy(): void {
      wrapperElement.classList.add('leave-to')
      wrapperElement.addEventListener('transitionend', destroy, { once: true })
    }

    function destroy(): void {
      document.body.removeChild(wrapperElement)
      document.removeEventListener('keydown', handleKeydown)
    }
  }
}
