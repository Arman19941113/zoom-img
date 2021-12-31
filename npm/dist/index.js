var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { watch, reactive, ref } from '@vue/runtime-core';
function clamp(value, min, max) {
    if (value < min)
        return min;
    if (value > max)
        return max;
    return value;
}
let isShowing = false;
export default function handleImageZoom(param) {
    if (isShowing)
        return;
    isShowing = true;
    let imageSrc;
    if (typeof param === 'string') {
        imageSrc = param;
    }
    else {
        imageSrc = param.target.getAttribute('src');
    }
    if (!imageSrc) {
        isShowing = false;
        return console.error('Unexpected error');
    }
    const wrapperElement = document.createElement('div');
    wrapperElement.classList.add('handle-image-zoom-wrapper');
    const imgElement = document.createElement('img');
    imgElement.classList.add('handle-image-zoom-target');
    imgElement.setAttribute('src', imageSrc);
    imgElement.setAttribute('draggable', 'false');
    imgElement.addEventListener('load', onLoaded);
    wrapperElement.appendChild(imgElement);
    document.body.appendChild(wrapperElement);
    setTimeout(() => {
        wrapperElement.classList.add('handle-image-zoom-mask-enter');
    });
    let isLoaded = ref(false);
    setTimeout(() => {
        if (isLoaded.value)
            return;
        const loadingElement = document.createElement('div');
        loadingElement.classList.add('handle-image-zoom-loading-wrapper');
        loadingElement.innerHTML = `<svg class="handle-image-zoom-loading" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="29" fill="none" stroke="#FFF6" stroke-width="6" stroke-linecap="round"></circle>
    </svg>`;
        wrapperElement.appendChild(loadingElement);
        const watcherStop = watch(isLoaded, () => {
            wrapperElement.removeChild(loadingElement);
            watcherStop();
        });
    }, 100);
    function onLoaded() {
        isLoaded.value = true;
        const { width: imgWidth, height: imgHeight } = imgElement.getBoundingClientRect();
        const transformState = reactive({
            origin: `${imgWidth / 2}px ${imgHeight / 2}px`,
            matrix: { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 },
        });
        const resetStyle = () => {
            transformState.origin = `${imgWidth / 2}px ${imgHeight / 2}px`;
            transformState.matrix = { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 };
        };
        watch(transformState, () => {
            imgElement.style.transform = `matrix(${Object.values(transformState.matrix).join(',')})`;
            imgElement.style.transformOrigin = transformState.origin;
        }, { immediate: false });
        imgElement.addEventListener('click', handleClick);
        imgElement.addEventListener('wheel', handleWheel, { passive: false });
        imgElement.addEventListener('mousedown', handleMousedown);
        let isDoubleClick = false;
        function handleClick(e) {
            e.stopPropagation();
            if (isDoubleClick) {
                isDoubleClick = false;
                resetStyle();
            }
            else {
                isDoubleClick = true;
                setTimeout(() => {
                    isDoubleClick = false;
                }, 300);
            }
        }
        let isWheel = false, wheelCd = false, lastWheelEvent = null, wheelTimer = 0;
        function handleWheel(e) {
            return __awaiter(this, void 0, void 0, function* () {
                e.preventDefault();
                e.stopPropagation();
                if (isMove)
                    return;
                if (wheelCd) {
                    lastWheelEvent = e;
                    return;
                }
                wheelCd = true;
                setTimeout(() => {
                    wheelCd = false;
                    if (lastWheelEvent) {
                        const t = lastWheelEvent;
                        lastWheelEvent = null;
                        handleWheel(t);
                    }
                }, 20);
                const currentScale = transformState.matrix.a;
                if (!isWheel) {
                    isWheel = true;
                    const { offsetX: newX, offsetY: newY } = e;
                    const [oldX, oldY] = transformState.origin.split(' ').map(item => Number(item.slice(0, -2)));
                    if (newX !== oldX || newY !== oldY) {
                        transformState.origin = `${newX}px ${newY}px`;
                        transformState.matrix.tx += parseInt(((newX - oldX) * (currentScale - 1)).toFixed(0));
                        transformState.matrix.ty += parseInt(((newY - oldY) * (currentScale - 1)).toFixed(0));
                        yield new Promise(resolve => {
                            setTimeout(() => {
                                resolve(null);
                                imgElement.classList.add('handle-image-zoom-scale-active');
                            });
                        });
                    }
                    else {
                        imgElement.classList.add('handle-image-zoom-scale-active');
                    }
                }
                let ratio;
                if (currentScale >= 5) {
                    ratio = 0.4;
                }
                else if (currentScale >= 4) {
                    ratio = 0.35;
                }
                else if (currentScale >= 3) {
                    ratio = 0.3;
                }
                else if (currentScale >= 2) {
                    ratio = 0.25;
                }
                else {
                    ratio = 0.2;
                }
                const minScale = 1, maxScale = 6;
                const newScale = clamp(currentScale + (e.deltaY > 0 ? -1 : 1) * ratio, minScale, maxScale);
                const fixedNewScale = Number(newScale.toFixed(2));
                Object.assign(transformState.matrix, { a: fixedNewScale, d: fixedNewScale });
                wheelTimer && clearTimeout(wheelTimer);
                wheelTimer = window.setTimeout(() => {
                    isWheel = false;
                    imgElement.classList.remove('handle-image-zoom-scale-active');
                }, 200);
            });
        }
        let isMove = false, moveCd = false, lastMoveEvent = null;
        let lastMoveX, lastMoveY;
        function handleMousedown(e) {
            if (isWheel)
                return;
            if (e.button !== 0)
                return;
            isMove = true;
            lastMoveX = e.pageX;
            lastMoveY = e.pageY;
            imgElement.classList.add('handle-image-zoom-move-active');
            document.addEventListener('mousemove', handleMousemove, { passive: true });
            document.addEventListener('mouseup', handleMouseup);
        }
        function handleMousemove(e) {
            if (moveCd) {
                lastMoveEvent = e;
                return;
            }
            moveCd = true;
            setTimeout(() => {
                moveCd = false;
                if (isMove && lastMoveEvent) {
                    const t = lastMoveEvent;
                    lastMoveEvent = null;
                    handleMousemove(t);
                }
            }, 20);
            transformState.matrix.tx += e.pageX - lastMoveX;
            transformState.matrix.ty += e.pageY - lastMoveY;
            lastMoveX = e.pageX;
            lastMoveY = e.pageY;
        }
        function handleMouseup() {
            isMove = false;
            imgElement.classList.remove('handle-image-zoom-move-active');
            document.removeEventListener('mousemove', handleMousemove);
            document.removeEventListener('mouseup', handleMouseup);
        }
        wrapperElement.addEventListener('click', handleClickWrapper);
        document.addEventListener('keydown', handleKeydown);
        function handleClickWrapper(e) {
            e.stopPropagation();
            beforeDestroy();
        }
        function handleKeydown(e) {
            if (e.code === 'Escape')
                beforeDestroy();
            else if (['Enter', 'NumpadEnter'].includes(e.code)) {
                resetStyle();
            }
        }
        function beforeDestroy() {
            wrapperElement.classList.add('handle-image-zoom-mask-leave');
            wrapperElement.addEventListener('transitionend', destroy, { once: true });
        }
        function destroy() {
            document.body.removeChild(wrapperElement);
            document.removeEventListener('keydown', handleKeydown);
            isShowing = false;
        }
    }
}
