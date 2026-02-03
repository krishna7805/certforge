// Main entry point for the certificate generator application

// Initialize UI components
function initUI() {
    // Load the certificate template
    document.getElementById('templateUpload').addEventListener('change', handleTemplateUpload);
    
    // Handle bulk name input
    document.getElementById('bulkNameInput').addEventListener('input', handleBulkNameInput);
    
    // Generate and export buttons
    document.getElementById('generateButton').addEventListener('click', generateCertificates);
    document.getElementById('exportButton').addEventListener('click', exportCertificates);
}

// Handle template upload
function handleTemplateUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                // Render the template on the canvas
                renderTemplate(img);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Handle bulk name input
function handleBulkNameInput(event) {
    const names = event.target.value.split('\n');
    // Update the canvas with the first name for preview
    updateCanvasWithName(names[0]);
}

// Generate certificates for all names
function generateCertificates() {
    const names = document.getElementById('bulkNameInput').value.split('\n');
    // Loop through names and prepare for export
    names.forEach(name => {
        if (name.trim()) {
            // Logic to generate each certificate
        }
    });
}

// Export certificates as PNG and PDF
function exportCertificates() {
    // Logic to export certificates
}

// Update the canvas with the selected name
function updateCanvasWithName(name) {
    // Logic to update canvas text
}

// Render the uploaded template on the canvas
function renderTemplate(img) {
    // Logic to render the image on the canvas
}

// Initialize the application
window.onload = initUI;

class CertificateGenerator {
    constructor() {
        this.template = null;
        this.templatePosition = { x: 0, y: 0 }; // Add this line
        this.names = [];
        this.currentNameIndex = 0;
        this.textPosition = { x: 0, y: 0 };
        this.textStyle = {
            fontFamily: 'Playfair Display',
            fontSize: 48,
            fontWeight: '400',
            color: '#000000',
            letterSpacing: 0,
            opacity: 100,
            alignment: 'center'
        };
        
        this.isDragging = false;
        this.isDraggingTemplate = false;
        this.dragOffset = { x: 0, y: 0 };
        this.scale = 1;
        this.fileNamePrefix = 'Certificate';

        this.previewCanvas = null;
        this.exportCanvas = null;
        this.previewCtx = null;
        this.exportCtx = null;
        
        this.init();
    }

    async init() {
        await this.waitForFonts();
        this.setupCanvases();
        this.setupEventListeners();
        this.updateNameCount();
        this.updateUI();
    }
    async waitForFonts() {
        try {
            await document.fonts.ready;
            console.log('All fonts loaded successfully');
        } catch (error) {
            console.warn('Some fonts may not have loaded:', error);
        }
    }
    setupCanvases() {
        this.previewCanvas = document.getElementById('previewCanvas');
        this.exportCanvas = document.getElementById('exportCanvas');
        this.previewCtx = this.previewCanvas.getContext('2d');
        this.exportCtx = this.exportCanvas.getContext('2d');
        
        // Set default canvas size
        this.previewCanvas.width = 800;
        this.previewCanvas.height = 600;
    }

    setupEventListeners() {
        // Template upload
        document.getElementById('templateUpload').addEventListener('change', (e) => {
            this.handleTemplateUpload(e);
        });

        // Name input
        document.getElementById('nameInput').addEventListener('input', (e) => {
            this.updateNames(e.target.value);
        });

        // Navigation
        document.getElementById('prevName').addEventListener('click', () => {
            this.navigateName(-1);
        });

        document.getElementById('nextName').addEventListener('click', () => {
            this.navigateName(1);
        });

            // File name prefix input
    document.getElementById('fileNamePrefix').addEventListener('input', (e) => {
        this.fileNamePrefix = e.target.value || 'Certificate';
    });

        // Text styling controls
        document.getElementById('fontFamily').addEventListener('change', (e) => {
            this.textStyle.fontFamily = e.target.value;
            // Force font load before redrawing
            document.fonts.load(`${this.textStyle.fontWeight} ${this.textStyle.fontSize}px "${this.textStyle.fontFamily}"`).then(() => {
                this.redraw();
            });
        });


        document.getElementById('fontSize').addEventListener('input', (e) => {
            this.textStyle.fontSize = parseInt(e.target.value);
            document.getElementById('fontSizeValue').textContent = e.target.value;
            this.redraw();
        });

        document.getElementById('fontWeight').addEventListener('change', (e) => {
            this.textStyle.fontWeight = e.target.value;
            this.redraw();
        });

        document.getElementById('textColor').addEventListener('input', (e) => {
            this.textStyle.color = e.target.value;
            this.redraw();
        });

        document.getElementById('letterSpacing').addEventListener('input', (e) => {
            this.textStyle.letterSpacing = parseFloat(e.target.value);
            document.getElementById('letterSpacingValue').textContent = e.target.value;
            this.redraw();
        });

        document.getElementById('textOpacity').addEventListener('input', (e) => {
            this.textStyle.opacity = parseInt(e.target.value);
            document.getElementById('textOpacityValue').textContent = e.target.value;
            this.redraw();
        });

        // Alignment buttons
        document.querySelectorAll('.align-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.align-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.textStyle.alignment = e.target.dataset.align;
                this.redraw();
            });
        });

        // Center text button
        document.getElementById('centerText').addEventListener('click', () => {
            this.centerText();
        });

        // Canvas mouse events
        this.previewCanvas.addEventListener('mousedown', (e) => {
            this.handleMouseDown(e);
        });

        this.previewCanvas.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e);
        });

        this.previewCanvas.addEventListener('mouseup', () => {
            this.handleMouseUp();
        });

        // Export buttons
        document.getElementById('generateButton').addEventListener('click', () => {
            this.generatePreview();
        });

        document.getElementById('exportPngButton').addEventListener('click', () => {
            this.exportCurrentPNG();
        });

        document.getElementById('exportPdfButton').addEventListener('click', () => {
            this.exportCurrentPDF();
        });

        document.getElementById('exportAllButton').addEventListener('click', () => {
            this.exportAll();
        });
    }

    handleTemplateUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.template = img;
                this.setupCanvas(img.width, img.height);
                this.centerText();
                this.redraw();
                this.updateUI();
                
                // Show template info
                const preview = document.getElementById('templatePreview');
                preview.innerHTML = `Template loaded: ${img.width}×${img.height}px`;
                preview.classList.remove('hidden');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    setupCanvas(width, height) {
        // Calculate scale to fit canvas in container
        const maxWidth = 700;
        const maxHeight = 500;
        this.scale = Math.min(maxWidth / width, maxHeight / height, 1);
        
        this.previewCanvas.width = width;
        this.previewCanvas.height = height;
        this.previewCanvas.style.width = (width * this.scale) + 'px';
        this.previewCanvas.style.height = (height * this.scale) + 'px';
        
        // Setup export canvas at high resolution
        this.exportCanvas.width = width * 2;
        this.exportCanvas.height = height * 2;
    }

    updateNames(input) {
        this.names = input.split('\n').filter(name => name.trim() !== '');
        this.currentNameIndex = 0;
        this.updateNameCount();
        this.updateNameDisplay();
        this.updateUI();
        this.redraw();
    }

    updateNameCount() {
        document.getElementById('nameCount').textContent = this.names.length;
    }

    updateNameDisplay() {
        const display = document.getElementById('currentNameDisplay');
        if (this.names.length === 0) {
            display.textContent = 'No names loaded';
        } else {
            display.textContent = `${this.currentNameIndex + 1} of ${this.names.length}: ${this.names[this.currentNameIndex]}`;
        }
    }

    navigateName(direction) {
        if (this.names.length === 0) return;
        
        this.currentNameIndex += direction;
        if (this.currentNameIndex < 0) this.currentNameIndex = this.names.length - 1;
        if (this.currentNameIndex >= this.names.length) this.currentNameIndex = 0;
        
        this.updateNameDisplay();
        this.redraw();
    }

    centerText() {
        if (!this.template) return;
        
        this.textPosition.x = this.template.width / 2;
        this.textPosition.y = this.template.height / 2;
        this.updatePositionDisplay();
        this.redraw();
    }

    updatePositionDisplay() {
        document.getElementById('textX').textContent = Math.round(this.textPosition.x);
        document.getElementById('textY').textContent = Math.round(this.textPosition.y);
    }

    handleMouseDown(event) {
        const rect = this.previewCanvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) / this.scale;
        const y = (event.clientY - rect.top) / this.scale;
        
        // Check if click is near text
        const textMetrics = this.getTextMetrics();
        if (textMetrics && this.isPointNearText(x, y, textMetrics)) {
            this.isDragging = true;
            this.dragOffset.x = x - this.textPosition.x;
            this.dragOffset.y = y - this.textPosition.y;
            this.previewCanvas.style.cursor = 'grabbing';
            return;
        }
        if (this.template && this.isPointOnTemplate(x, y)) {
            this.isDraggingTemplate = true;
            this.dragOffset.x = x - this.templatePosition.x;
            this.dragOffset.y = y - this.templatePosition.y;
            this.previewCanvas.style.cursor = 'grabbing';
        }
    }

    handleMouseMove(event) {
        const rect = this.previewCanvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) / this.scale;
        const y = (event.clientY - rect.top) / this.scale;
        
        if (this.isDragging) {
            this.textPosition.x = x - this.dragOffset.x;
            this.textPosition.y = y - this.dragOffset.y;
            this.updatePositionDisplay();
            this.redraw();
        } else if (this.isDraggingTemplate) {
            this.templatePosition.x = x - this.dragOffset.x;
            this.templatePosition.y = y - this.dragOffset.y;
            this.redraw();
        }
    }

    handleMouseUp() {
        this.isDragging = false;
        this.isDraggingTemplate = false;
        this.previewCanvas.style.cursor = 'grab';
    }
    

isPointOnTemplate(x, y) {
    if (!this.template) return false;
    
    return x >= this.templatePosition.x && 
           x <= this.templatePosition.x + this.template.width && 
           y >= this.templatePosition.y && 
           y <= this.templatePosition.y + this.template.height;
}

    isPointNearText(x, y, textMetrics) {
        const margin = 20;
        return x >= textMetrics.left - margin && 
               x <= textMetrics.right + margin && 
               y >= textMetrics.top - margin && 
               y <= textMetrics.bottom + margin;
    }

    getTextMetrics() {
        if (!this.template || this.names.length === 0) return null;
        
        const text = this.names[this.currentNameIndex];
        this.previewCtx.font = `${this.textStyle.fontWeight} ${this.textStyle.fontSize}px ${this.textStyle.fontFamily}`;
        const metrics = this.previewCtx.measureText(text);
        
        let textX = this.textPosition.x;
        if (this.textStyle.alignment === 'center') {
            textX -= metrics.width / 2;
        } else if (this.textStyle.alignment === 'right') {
            textX -= metrics.width;
        }
        
        return {
            left: textX,
            right: textX + metrics.width,
            top: this.textPosition.y - this.textStyle.fontSize,
            bottom: this.textPosition.y
        };
    }

    redraw() {
        if (!this.template) return;
        
        this.previewCtx.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
        
        // Draw template at its position
        this.previewCtx.drawImage(
            this.template, 
            this.templatePosition.x, 
            this.templatePosition.y,
            this.template.width,
            this.template.height
        );
        
        if (this.names.length > 0) {
            this.drawText(this.previewCtx, this.names[this.currentNameIndex], 1);
        }
    }
    drawText(ctx, text, scale = 1) {
        const fontSize = this.textStyle.fontSize * scale;
        const letterSpacing = this.textStyle.letterSpacing * scale;
        
        ctx.font = `${this.textStyle.fontWeight} ${fontSize}px ${this.textStyle.fontFamily}`;
        ctx.fillStyle = this.textStyle.color;
        ctx.globalAlpha = this.textStyle.opacity / 100;
        
        let x = this.textPosition.x * scale;
        const y = this.textPosition.y * scale;
        
        if (this.textStyle.alignment === 'center') {
            ctx.textAlign = 'center';
        } else if (this.textStyle.alignment === 'right') {
            ctx.textAlign = 'right';
        } else {
            ctx.textAlign = 'left';
        }
        
        ctx.textBaseline = 'middle';
        
        if (letterSpacing === 0) {
            ctx.fillText(text, x, y);
        } else {
            // Manual letter spacing
            ctx.textAlign = 'left';
            const chars = text.split('');
            const totalWidth = chars.reduce((sum, char, i) => {
                const charWidth = ctx.measureText(char).width;
                return sum + charWidth + (i < chars.length - 1 ? letterSpacing : 0);
            }, 0);
            
            if (this.textStyle.alignment === 'center') {
                x -= totalWidth / 2;
            } else if (this.textStyle.alignment === 'right') {
                x -= totalWidth;
            }
            
            let currentX = x;
            chars.forEach((char, i) => {
                ctx.fillText(char, currentX, y);
                currentX += ctx.measureText(char).width + (i < chars.length - 1 ? letterSpacing : 0);
            });
        }
        
        ctx.globalAlpha = 1;
    }

    generatePreview() {
        if (!this.template || this.names.length === 0) {
            alert('Please upload a template and enter names first.');
            return;
        }
        
        this.redraw();
    }

    async exportCurrentPNG() {
        if (!this.template || this.names.length === 0) return;
        
        const name = this.names[this.currentNameIndex];
        const dataURL = this.generateHighResImage(name);
        this.downloadImage(dataURL, `Certificate_${name}.png`);
    }

    async exportCurrentPDF() {
        if (!this.template || this.names.length === 0) return;
        
        const name = this.names[this.currentNameIndex];
        // Use original dimensions for PDF
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.template.width;
        canvas.height = this.template.height;
        
        ctx.drawImage(this.template, 0, 0);
        this.drawText(ctx, name, 1);
        
        const dataURL = canvas.toDataURL('image/jpeg', 1);
        
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: this.template.width > this.template.height ? 'landscape' : 'portrait',
            unit: 'px',
            format: [this.template.width, this.template.height]
        });
        
        pdf.addImage(dataURL, 'JPEG', 0, 0, this.template.width, this.template.height);
        pdf.save(`${this.fileNamePrefix}_${name}.pdf`);
    }

    async exportAll() {
        if (!this.template || this.names.length === 0) return;
        
        const zip = new JSZip();
        
        // Create a temporary canvas for optimized exports
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = this.template.width * 1.5; // Moderate resolution
        tempCanvas.height = this.template.height * 1.5;
        
        for (let i = 0; i < this.names.length; i++) {
            const name = this.names[i];
            
            tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.drawImage(this.template, 0, 0, tempCanvas.width, tempCanvas.height);
            this.drawText(tempCtx, name, 1.5);
            
            const dataURL = tempCanvas.toDataURL('image/png', 0.85);
            const base64Data = dataURL.split(',')[1];
            zip.file(`Certificate_${name}.png`, base64Data, { base64: true });
        }
        
        const content = await zip.generateAsync({ 
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 }
        });
        
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Certificates.zip';
        a.click();
        
        URL.revokeObjectURL(url);
    }
    generateHighResImage(name) {
        this.exportCtx.clearRect(0, 0, this.exportCanvas.width, this.exportCanvas.height);
        this.exportCtx.drawImage(this.template, 0, 0, this.exportCanvas.width, this.exportCanvas.height);
        this.drawText(this.exportCtx, name, 2); // Changed from 3 to 2
        return this.exportCanvas.toDataURL('image/png', 0.92); // Added quality compression
    }

    downloadImage(dataURL, filename) {
        const name = filename.split('_')[1].split('.')[0]; // Extract name from filename
        const extension = filename.split('.').pop();
        const customFilename = `${this.fileNamePrefix}_${name}.${extension}`;
        
        const a = document.createElement('a');
        a.href = dataURL;
        a.download = customFilename;
        a.click();
    }

    updateUI() {
        const hasTemplate = !!this.template;
        const hasNames = this.names.length > 0;
        const canGenerate = hasTemplate && hasNames;
        
        document.getElementById('generateButton').disabled = !canGenerate;
        document.getElementById('exportPngButton').disabled = !canGenerate;
        document.getElementById('exportPdfButton').disabled = !canGenerate;
        document.getElementById('exportAllButton').disabled = !canGenerate;
        
        document.getElementById('prevName').disabled = !hasNames || this.names.length <= 1;
        document.getElementById('nextName').disabled = !hasNames || this.names.length <= 1;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CertificateGenerator();
});