export function drawMessage(canvas, ctx, text) {
    const fontsize = 120;
    ctx.font = `${fontsize}px Arial`;
    ctx.fillStyle = "#000000aa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

export function fillSelect(element, options) {
    for (const option of options) {
        const elem = document.createElement("option");
        elem.value = option;
        elem.innerHTML = option;
        element.appendChild(elem);
    }
}