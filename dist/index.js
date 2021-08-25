import { watch, reactive } from '@vue/runtime-core';
function clamp(value, min, max) {
    if (value < min)
        return min;
    if (value > max)
        return max;
    return value;
}
let timestamp = 0;
export default function handleImageZoom(rootEvent) {
    const originImg = rootEvent.target;
    const imageSrc = originImg.getAttribute('src');
    if (!imageSrc)
        return console.error('unexpected error');
    const now = Date.now();
    if ((now - timestamp) > 200)
        timestamp = now;
    else
        return;
    const wrapperElement = document.createElement('div');
    wrapperElement.classList.add('awesome-zoom-image-wrapper');
    wrapperElement.classList.add('enter-from');
    setTimeout(() => {
        wrapperElement.classList.remove('enter-from');
        wrapperElement.addEventListener('transitionend', onShow, { once: true });
    });
    const imgElement = document.createElement('img');
    imgElement.setAttribute('src', imageSrc);
    imgElement.setAttribute('draggable', 'false');
    const { width: originImgWidth, height: originImgHeight } = originImg.getBoundingClientRect();
    const wPercent = originImgWidth / window.innerWidth;
    const hPercent = originImgHeight / window.innerHeight;
    if (wPercent > hPercent) {
        imgElement.setAttribute('width', '70%');
    }
    else {
        imgElement.setAttribute('height', '70%');
    }
    imgElement.classList.add('awesome-zoom-image');
    wrapperElement.appendChild(imgElement);
    document.body.appendChild(wrapperElement);
    function onShow() {
        listenTransform();
        listenClose();
    }
    function listenTransform() {
        imgElement.addEventListener('click', handleClick);
        imgElement.addEventListener('wheel', handleWheel);
        imgElement.addEventListener('mousedown', handleMousedown);
        const { width: imgWidth, height: imgHeight } = imgElement.getBoundingClientRect();
        const transformState = reactive({
            matrix: { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 },
            origin: `${imgWidth / 2}px ${imgHeight / 2}px`,
        });
        watch(transformState, () => {
            imgElement.style.transform = `matrix(${Object.values(transformState.matrix).join(',')})`;
            imgElement.style.transformOrigin = transformState.origin;
        }, { immediate: false });
        function resetStyle() {
            scale = 1;
            accumulateDeltaY = 0;
            wheelingDeltaY = 0;
            imgElement.classList.remove('transition-active');
            transformState.matrix = { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 };
            transformState.origin = `${imgWidth / 2}px ${imgHeight / 2}px`;
        }
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
        const wheelBaseRate = Math.ceil(window.innerHeight / 6);
        const maxScale = 5, minScale = 1;
        const maxDeltaY = wheelBaseRate * maxScale, minDeltaY = 0;
        let isWheel = false, wheelTimer = 0, scale = 1, accumulateDeltaY = 0, wheelingDeltaY = 0;
        function handleWheel(e) {
            e.preventDefault();
            e.stopPropagation();
            if (isMove)
                return;
            updateStyleByWheel(e);
            wheelTimer && clearTimeout(wheelTimer);
            wheelTimer = window.setTimeout(() => {
                isWheel = false;
            }, 100);
        }
        function updateStyleByWheel(e) {
            if (!isWheel)
                accumulateDeltaY = wheelingDeltaY;
            wheelingDeltaY = clamp(-e.deltaY + accumulateDeltaY, minDeltaY, maxDeltaY);
            scale = clamp(Number(((wheelingDeltaY / wheelBaseRate) + 1).toFixed(1)), minScale, maxScale);
            Object.assign(transformState.matrix, { a: scale, d: scale });
            if (!isWheel) {
                isWheel = true;
                imgElement.classList.remove('transition-active');
                const { offsetX: newX, offsetY: newY } = e;
                const [oldX, oldY] = transformState.origin.split(' ').map(item => Number(item.slice(0, -2)));
                transformState.matrix.tx += (newX - oldX) * (scale - 1);
                transformState.matrix.ty += (newY - oldY) * (scale - 1);
                transformState.origin = `${newX}px ${newY}px`;
            }
            else {
                imgElement.classList.add('transition-active');
            }
        }
        let isMove = false;
        let moveCd = false;
        let lastMoveX, lastMoveY;
        function handleMousedown(e) {
            if (isWheel)
                return;
            isMove = true;
            lastMoveX = e.pageX;
            lastMoveY = e.pageY;
            imgElement.classList.add('transition-active');
            document.addEventListener('mousemove', handleMousemove, { passive: false });
            document.addEventListener('mouseup', handleMouseup);
        }
        function handleMousemove(e) {
            if (moveCd)
                return;
            moveCd = true;
            transformState.matrix.tx += e.pageX - lastMoveX;
            transformState.matrix.ty += e.pageY - lastMoveY;
            lastMoveX = e.pageX;
            lastMoveY = e.pageY;
            setTimeout(() => {
                moveCd = false;
            }, 50);
        }
        function handleMouseup() {
            isMove = false;
            document.removeEventListener('mousemove', handleMousemove);
            document.removeEventListener('mouseup', handleMouseup);
        }
    }
    function listenClose() {
        wrapperElement.addEventListener('click', handleClickWrapper);
        document.addEventListener('keydown', handleKeydown);
        function handleClickWrapper(e) {
            e.stopPropagation();
            beforeDestroy();
        }
        function handleKeydown(e) {
            if (['Escape', 'Enter', 'NumpadEnter'].includes(e.code)) {
                beforeDestroy();
            }
        }
        function beforeDestroy() {
            wrapperElement.classList.add('leave-to');
            wrapperElement.addEventListener('transitionend', destroy, { once: true });
        }
        function destroy() {
            document.body.removeChild(wrapperElement);
            document.removeEventListener('keydown', handleKeydown);
        }
    }
}
