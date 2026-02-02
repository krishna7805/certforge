// This file handles the export functionality. It implements the two-canvas system for high-quality exports and provides methods for generating PNG and PDF files.

const exportCanvas = document.createElement('canvas');
const exportContext = exportCanvas.getContext('2d');

function setExportCanvasSize(width, height) {
    exportCanvas.width = width * 4; // Scale for high resolution
    exportCanvas.height = height * 4; // Scale for high resolution
}

function drawToExportCanvas(templateImage, textElements) {
    exportContext.clearRect(0, 0, exportCanvas.width, exportCanvas.height);
    exportContext.drawImage(templateImage, 0, 0, exportCanvas.width, exportCanvas.height);

    textElements.forEach(textElement => {
        exportContext.font = `${textElement.fontWeight} ${textElement.fontSize * 4}px '${textElement.fontFamily}'`;
        exportContext.fillStyle = textElement.color;
        exportContext.globalAlpha = textElement.opacity;
        exportContext.textAlign = textElement.alignment;
        exportContext.fillText(textElement.text, textElement.x * 4, textElement.y * 4);
    });
}

function exportToPNG() {
    const link = document.createElement('a');
    link.download = `Certificate_${Date.now()}.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
}

function exportToPDF() {
    const pdf = new jsPDF('landscape');
    pdf.addImage(exportCanvas.toDataURL('image/png'), 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
    pdf.save(`Certificate_${Date.now()}.pdf`);
}

function generateCertificates(names, templateImage, textElements) {
    names.forEach(name => {
        textElements.forEach(textElement => {
            textElement.text = name; // Update text for each name
        });
        setExportCanvasSize(templateImage.width, templateImage.height);
        drawToExportCanvas(templateImage, textElements);
        exportToPNG(); // or exportToPDF() for PDF export
    });
}

export { generateCertificates };