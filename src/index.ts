import { watch, reactive, ref } from '@vue/runtime-core'

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min
  if (value > max) return max
  return value
}

let isShowing = false

export default function handleImageZoom(param: string | MouseEvent): void {
  if (isShowing) return
  isShowing = true

  let imageSrc
  if (typeof param === 'string') {
    imageSrc = param
  } else {
    imageSrc = (param.target as HTMLImageElement).getAttribute('src')
  }
  if (!imageSrc) {
    isShowing = false
    return console.error('Unexpected error')
  }

  // 生成容器元素
  const wrapperElement = document.createElement('div')
  wrapperElement.classList.add('handle-image-zoom-wrapper')

  // 生成图片元素
  const imgElement = document.createElement('img')
  imgElement.classList.add('handle-image-zoom-target')
  imgElement.setAttribute('src', imageSrc)
  imgElement.setAttribute('draggable', 'false')
  imgElement.addEventListener('load', onLoaded)
  wrapperElement.appendChild(imgElement)

  // 挂载元素
  document.body.appendChild(wrapperElement)
  setTimeout(() => {
    wrapperElement.classList.add('handle-image-zoom-mask-enter')
  })

  // 如果 100ms 内图片未加载完成 生成加载元素
  let isLoaded = ref(false)
  setTimeout(() => {
    if (isLoaded.value) return
    // 尚未加载完成
    const loadingElement = document.createElement('div')
    loadingElement.classList.add('handle-image-zoom-loading-wrapper')
    loadingElement.innerHTML = `<svg class="handle-image-zoom-loading" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="29" fill="none" stroke="#FFF6" stroke-width="6" stroke-linecap="round"></circle>
    </svg>`
    wrapperElement.appendChild(loadingElement)
    const watcherStop = watch(isLoaded, () => {
      wrapperElement.removeChild(loadingElement)
      watcherStop()
    })
  }, 100)

  // 图片加载完毕
  function onLoaded(): void {
    isLoaded.value = true

    /**
     * 图片缩放、移动样式
     */
    const { width: imgWidth, height: imgHeight } = imgElement.getBoundingClientRect()
    const transformState = reactive({
      origin: `${imgWidth / 2}px ${imgHeight / 2}px`,
      matrix: { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 },
    })
    const resetStyle = (): void => {
      transformState.origin = `${imgWidth / 2}px ${imgHeight / 2}px`
      transformState.matrix = { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 }
    }
    watch(transformState, () => {
      imgElement.style.transform = `matrix(${Object.values(transformState.matrix).join(',')})`
      imgElement.style.transformOrigin = transformState.origin
    }, { immediate: false })

    /**
     * 图片交互处理
     */
    imgElement.addEventListener('click', handleClick)
    imgElement.addEventListener('wheel', handleWheel, { passive: false })
    imgElement.addEventListener('mousedown', handleMousedown)

    /**
     * 双击还原
     */
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

    /**
     * 缩放
     */
    let isWheel = false, wheelCd = false, lastWheelEvent: WheelEvent | null = null, wheelTimer = 0

    async function handleWheel(e: WheelEvent): Promise<void> {
      e.preventDefault()
      e.stopPropagation()
      if (isMove) return

      // 节流
      if (wheelCd) {
        lastWheelEvent = e
        return
      }
      wheelCd = true
      setTimeout(() => {
        wheelCd = false
        if (lastWheelEvent) {
          const t = lastWheelEvent
          lastWheelEvent = null
          handleWheel(t)
        }
      }, 20)

      const currentScale = transformState.matrix.a

      if (!isWheel) {
        // 新一轮滚动，记录滚动过程
        isWheel = true
        // 变形中心可能变化，初始化 transformState 信息
        const { offsetX: newX, offsetY: newY } = e
        const [oldX, oldY] = transformState.origin.split(' ').map(item => Number(item.slice(0, -2)))
        if (newX !== oldX || newY !== oldY) {
          // 更新 transform-origin
          transformState.origin = `${newX}px ${newY}px`
          // 更新 transform.translate
          transformState.matrix.tx += parseInt(((newX - oldX) * (currentScale - 1)).toFixed(0))
          transformState.matrix.ty += parseInt(((newY - oldY) * (currentScale - 1)).toFixed(0))
          // 先重置 transform 信息，再加动画渲染缩放结果
          await new Promise(resolve => {
            setTimeout(() => {
              resolve(null)
              imgElement.classList.add('handle-image-zoom-scale-active')
            })
          })
        } else {
          imgElement.classList.add('handle-image-zoom-scale-active')
        }
      }

      // 处理放大倍数
      let ratio
      if (currentScale >= 5) {
        ratio = 0.4
      } else if (currentScale >= 4) {
        ratio = 0.35
      } else if (currentScale >= 3) {
        ratio = 0.3
      } else if (currentScale >= 2) {
        ratio = 0.25
      } else {
        ratio = 0.2
      }
      const minScale = 1, maxScale = 6
      const newScale = clamp(currentScale + (e.deltaY > 0 ? -1 : 1) * ratio, minScale, maxScale)
      const fixedNewScale = Number(newScale.toFixed(2))
      Object.assign(transformState.matrix, { a: fixedNewScale, d: fixedNewScale })

      // 200ms 内没有收到 wheel 事件，缩放过程结束
      wheelTimer && clearTimeout(wheelTimer)
      wheelTimer = window.setTimeout(() => {
        isWheel = false
        imgElement.classList.remove('handle-image-zoom-scale-active')
      }, 200)
    }

    /**
     * 拖动
     */
    let isMove = false, moveCd = false, lastMoveEvent: MouseEvent | null = null
    let lastMoveX: number, lastMoveY: number

    function handleMousedown(e: MouseEvent): void {
      if (isWheel) return
      if (e.button !== 0) return

      isMove = true
      lastMoveX = e.pageX
      lastMoveY = e.pageY
      imgElement.classList.add('handle-image-zoom-move-active')
      document.addEventListener('mousemove', handleMousemove, { passive: true })
      document.addEventListener('mouseup', handleMouseup)
    }

    function handleMousemove(e: MouseEvent): void {
      if (moveCd) {
        lastMoveEvent = e
        return
      }
      moveCd = true
      setTimeout(() => {
        moveCd = false
        if (isMove && lastMoveEvent) {
          const t = lastMoveEvent
          lastMoveEvent = null
          handleMousemove(t)
        }
      }, 20)

      // 节流执行的任务
      transformState.matrix.tx += e.pageX - lastMoveX
      transformState.matrix.ty += e.pageY - lastMoveY
      lastMoveX = e.pageX
      lastMoveY = e.pageY
    }

    function handleMouseup(): void {
      isMove = false
      imgElement.classList.remove('handle-image-zoom-move-active')
      document.removeEventListener('mousemove', handleMousemove)
      document.removeEventListener('mouseup', handleMouseup)
    }

    /**
     * 关闭组件
     */
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
      wrapperElement.classList.add('handle-image-zoom-mask-leave')
      wrapperElement.addEventListener('transitionend', destroy, { once: true })
    }

    function destroy(): void {
      document.body.removeChild(wrapperElement)
      document.removeEventListener('keydown', handleKeydown)
      isShowing = false
    }
  }
}
