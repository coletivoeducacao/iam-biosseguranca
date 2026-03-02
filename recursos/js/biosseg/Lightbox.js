import "../panzoom/panzoom.min.js";

const lightbox = document.getElementById('lightbox');
const lightboxBounds = document.getElementById('lightbox-bounds');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxZoomIn = document.getElementById('lightbox-zoom-in');
const lightboxZoomOut = document.getElementById('lightbox-zoom-out');
const lightboxZoomFit = document.getElementById('lightbox-zoom-fit');
const lightboxClose = document.getElementById('lightbox-close');

const getParentRect = () => lightboxBounds.getBoundingClientRect();

document.querySelectorAll('img.lightbox').forEach(instance => {
    if (!instance.hasAttribute('tabindex')) {
        instance.tabIndex = 0;
    }
    if (instance.alt) instance.alt += ' Selecione para expandir a imagem.';
    instance.addEventListener('click', select);
    instance.addEventListener('keydown', function(e) {
        if (e.key === " " || e.key === "Enter" || e.key === "Spacebar") {
            select();
        }
    });
    function select() {
        lightboxImg.src = instance.currentSrc;
        lightbox.showModal();
    };
});

lightbox.addEventListener('focusout', (e) => {
    if (!e.relatedTarget || lightbox.contains(e.relatedTarget)) {
        return;
    }
    lightbox.close();
    lightboxImg.src = '';
});

lightbox.addEventListener('toggle', function(e) {
    if (e.newState === 'open') {
        document.querySelectorAll('img.lightbox').forEach((instance) => {
            instance.classList.add('pe-none');
        });
        lightboxImg.panZoom.zoomAbs(0, 0, 1);
        // BUG: Imagem não fica centralizada. Executar duas vezes resolve.
        lightboxImg.panZoom.zoomAbs(0, 0, 1);
    } else {
        document.querySelectorAll('img.lightbox').forEach((instance) => {
            instance.classList.remove('pe-none');
        });
    }
});

lightboxImg.panZoom = panzoom(lightboxImg, {
    zoomSpeed: 0.1,
    maxZoom: 3,
    minZoom: 1,
    bounds: true,
    boundsPadding: 1,
    zoomDoubleClickSpeed: 1.5
});

lightboxImg.addEventListener('dblclick', function(e) {
    lightboxImg.panZoom.pause();
    const xys = lightboxImg.panZoom.getTransform();
    let offsetX, offsetY, offsetS;
    if(xys.scale >= 3) {
        const fScale = (1 - xys.scale);
        offsetX = xys.x / fScale;
        offsetY = xys.y / fScale;
        offsetS = 0.99;
    } else {
        offsetX = e.clientX - getParentRect().left;
        offsetY = e.clientY - getParentRect().top;
        offsetS = xys.scale + .501;
    }
    lightboxImg.panZoom.smoothZoomAbs(offsetX, offsetY, offsetS);
});

lightboxImg.addEventListener('touchend', function(e) {
    const xys = lightboxImg.panZoom.getTransform();
    if(xys.scale >= 3 && e.touches.length <= 0) {
        const lastTouch = this.panZoom.lastTouch;
        this.panZoom.lastTouch = (new Date).getTime();
        if (lastTouch + 300 > (new Date).getTime()) {
            const fScale = (1 - xys.scale);
            const offsetX = (xys.x / fScale);
            const offsetY = (xys.y / fScale);
            this.panZoom.pause();
            this.panZoom.smoothZoomAbs(offsetX, offsetY, 0.99)
        }
    }
});

lightboxImg.panZoom.on('transform', function(instance) {
    if (instance.isPaused()) {
        instance.resume();
    }
});

lightboxZoomFit.addEventListener('click', function(e) {
    const xys = lightboxImg.panZoom.getTransform();
    if (xys.scale === 1) {
        return;
    }
    const fScale = (1 - xys.scale);
    const offsetX = (xys.x / fScale);
    const offsetY = (xys.y / fScale);
    lightboxImg.panZoom.smoothZoomAbs(offsetX, offsetY, 0.99);
});

lightboxZoomIn.addEventListener('click', function(e) {
    const xys = lightboxImg.panZoom.getTransform();
    const fScale = xys.scale === 1 ? 1 : 1 - xys.scale;
    let offsetX, offsetY;
    if (xys.scale === 1) {
        offsetX = getParentRect().width / 2;
        offsetY = getParentRect().height / 2;
    } else {
        offsetX = xys.x / fScale;
        offsetY = xys.y / fScale;
    }
    lightboxImg.panZoom.smoothZoomAbs(offsetX, offsetY, xys.scale + .501);
});

lightboxZoomOut.addEventListener('click', function(e) {
    const xys = lightboxImg.panZoom.getTransform();
    const fScale = xys.scale === 1 ? 1 : 1 - xys.scale;
    let offsetX, offsetY;
    offsetX = xys.x / fScale;
    offsetY = xys.y / fScale;
    lightboxImg.panZoom.smoothZoomAbs(offsetX, offsetY, xys.scale - .501);
});

lightboxClose.addEventListener('click', function(e) {
    lightbox.close();
});
