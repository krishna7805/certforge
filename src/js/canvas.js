// canvas.js

const canvas = document.getElementById('certificateCanvas');
const ctx = canvas.getContext('2d');
let templateImage = new Image();
let textElements = [];
let currentTextElement = null;

function loadTemplate(imageSrc) {
    templateImage.src = imageSrc;
    templateImage.onload = () => {
        canvas.width = templateImage.width;
        canvas.height = templateImage.height;
        draw();
    };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(templateImage, 0, 0);
    textElements.forEach(textElement => {
        ctx.font = `${textElement.fontWeight} ${textElement.fontSize}px '${textElement.fontFamily}'`;
        ctx.fillStyle = textElement.color;
        ctx.globalAlpha = textElement.opacity;
        ctx.textAlign = textElement.alignment;
        ctx.fillText(textElement.text, textElement.x, textElement.y);
    });
}

function addTextElement(text, fontFamily, fontSize, fontWeight, color, opacity, alignment) {
    const textElement = {
        text,
        fontFamily,
        fontSize,
        fontWeight,
        color,
        opacity,
        alignment,
        x: canvas.width / 2,
        y: canvas.height / 2,
    };
    textElements.push(textElement);
    draw();
}

function selectTextElement(x, y) {
    currentTextElement = textElements.find(textElement => {
        const metrics = ctx.measureText(textElement.text);
        return x >= textElement.x - metrics.width / 2 && x <= textElement.x + metrics.width / 2 &&
               y >= textElement.y - parseInt(textElement.fontSize) && y <= textElement.y;
    });
}

function updateTextPosition(x, y) {
    if (currentTextElement) {
        currentTextElement.x = x;
        currentTextElement.y = y;
        draw();
    }
}

function clearTextSelection() {
    currentTextElement = null;
}

function setTextStyle(fontFamily, fontSize, fontWeight, color, opacity, alignment) {
    if (currentTextElement) {
        currentTextElement.fontFamily = fontFamily;
        currentTextElement.fontSize = fontSize;
        currentTextElement.fontWeight = fontWeight;
        currentTextElement.color = color;
        currentTextElement.opacity = opacity;
        currentTextElement.alignment = alignment;
        draw();
    }
}

function getCanvasDataURL() {
    return canvas.toDataURL('image/png');
}

function resetCanvas() {
    textElements = [];
    currentTextElement = null;
    draw();
}

export {
    loadTemplate,
    addTextElement,
    selectTextElement,
    updateTextPosition,
    clearTextSelection,
    setTextStyle,
    getCanvasDataURL,
    resetCanvas
};