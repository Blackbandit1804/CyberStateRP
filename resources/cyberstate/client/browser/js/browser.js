
function safeZoneUpdate(screenWidht, screenHeight, safeZoneSize) {
    var savezoneDiv = document.getElementById("safezone");
    safeZoneSize = (((1.0 - safeZoneSize) * 0.5) * 100.0);

    savezoneDiv.style.right = savezoneDiv.style.left = ((screenWidht / 100) * safeZoneSize) + "px";
    savezoneDiv.style.top = savezoneDiv.style.bottom = ((screenHeight / 100) * safeZoneSize) + "px";
}

alt.on(`safeZone.update`, (x, y, safeZone) => {
    safeZoneUpdate(x, y, safeZone);
});