// textEditor.js

const textEditor = (() => {
    let selectedText = null;
    let textElements = [];
    const canvas = document.getElementById('previewCanvas');
    const ctx = canvas.getContext('2d');

    function addText(text, x, y, styles) {
        const textElement = { text, x, y, styles };
        textElements.push(textElement);
        render();
    }

    function selectText(index) {
        selectedText = index;
        render();
    }

    function dragText(index, newX, newY) {
        if (index >= 0 && index < textElements.length) {
            textElements[index].x = newX;
            textElements[index].y = newY;
            render();
        }
    }

    function updateTextStyle(styles) {
        if (selectedText !== null) {
            Object.assign(textElements[selectedText].styles, styles);
            render();
        }
    }

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        textElements.forEach((element, index) => {
            ctx.font = `${element.styles.weight} ${element.styles.size}px ${element.styles.font}`;
            ctx.fillStyle = element.styles.color;
            ctx.globalAlpha = element.styles.opacity;
            ctx.textAlign = element.styles.align;
            ctx.fillText(element.text, element.x, element.y);
            if (selectedText === index) {
                ctx.strokeStyle = 'blue';
                ctx.strokeRect(element.x - 5, element.y - element.styles.size, ctx.measureText(element.text).width + 10, element.styles.size + 10);
            }
        });
    }

    return {
        addText,
        selectText,
        dragText,
        updateTextStyle,
        render
    };
})();