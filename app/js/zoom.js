let isZoomed = false;

window.onload = function() {
    document.getElementById('zoomButton').addEventListener('click', toggleZoom);
}

function toggleZoom() {
    console.log("Zoom button");
    let body = document.body;
    let currentScale = parseFloat(getComputedStyle(body).getPropertyValue('transform'));
    if (!isZoomed) {
        body.style.transform = 'scale(' + (currentScale + 0.5) + ')';
        isZoomed = true;
    } else {
        body.style.transform = 'scale(' + (currentScale - 0.5) + ')';
        isZoomed = false;
    }
}