function lockAspectRatio(width, height, newWidth) {
    return (newWidth * height) / width;
}

function getCanvasDimensions(image) {
    return {
        width: image.width,
        height: image.height,
    };
}

function parseNames(input) {
    return input.split('\n').map(name => name.trim()).filter(name => name.length > 0);
}

function downloadFile(data, filename) {
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function isValidImageType(file) {
    const validTypes = ['image/png', 'image/jpeg'];
    return validTypes.includes(file.type);
}

export { lockAspectRatio, getCanvasDimensions, parseNames, downloadFile, isValidImageType };