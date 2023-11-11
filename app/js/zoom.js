let isZoomed = false;

function toggleZoom() {
    let body = document.body;
    let currentZoom = parseFloat(getComputedStyle(body).getPropertyValue('zoom'));
    if (!isZoomed) {
        body.style.zoom = currentZoom + 0.5;
        isZoomed = true;
    } else {
        body.style.zoom = currentZoom - 0.5;
        isZoomed = false;
    }
}

document.getElementById('zoomButton').addEventListener('click', toggleZoom);