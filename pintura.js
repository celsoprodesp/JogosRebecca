const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

// Game State
let isDrawing = false;
let currentX = 0;
let currentY = 0;
let brushColor = '#FF4DA6'; // Default Hot Pink
let brushSize = 10;
let isEraser = false;

// Magical Palette
const colors = [
    '#FF4DA6', // Hot Pink
    '#CC007A', // Dark Pink 
    '#C084FC', // Lavender
    '#9333EA', // Purple
    '#86EFAC', // Mint
    '#22C55E', // Green
    '#38BDF8', // Light Blue
    '#3B82F6', // Blue
    '#FDE047', // Light Yellow
    '#EAB308', // Gold
    '#F97316', // Orange
    '#EF4444', // Red
    '#8B4513', // Brown
    '#000000', // Black
];

/* ── DOM Elements ── */
const colorPalette = document.getElementById('colorPalette');
const brushSizeInput = document.getElementById('brushSize');
const eraserBtn = document.getElementById('eraserBtn');
const clearBtn = document.getElementById('clearBtn');

/* ── Initialize Canvas ── */
function initCanvas() {
    // Fill with white background initially
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set initial brush properties
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = brushColor;

    buildColorPalette();
    resizeCanvasForMobile();
}

function buildColorPalette() {
    colors.forEach(color => {
        const btn = document.createElement('div');
        btn.classList.add('color-btn');
        btn.style.backgroundColor = color;
        
        // Highlight first color
        if (color === brushColor) btn.classList.add('active');

        btn.onclick = () => {
            // Disable eraser
            isEraser = false;
            eraserBtn.classList.remove('active');
            
            // Set Color
            brushColor = color;
            updateColorSelection(btn);
        };
        
        colorPalette.appendChild(btn);
    });
}

function updateColorSelection(selectedBtn) {
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
    if (selectedBtn) selectedBtn.classList.add('active');
}

/* ── Tools Actions ── */
brushSizeInput.addEventListener('input', (e) => {
    brushSize = e.target.value;
});

eraserBtn.addEventListener('click', () => {
    isEraser = true;
    eraserBtn.classList.add('active');
    updateColorSelection(null); // Unselect colors
});

clearBtn.addEventListener('click', () => {
    // Fill white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

/* ── Drawing Logic ── */

// Helper to get exact coordinates considering screen scaling
function getMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    // Scale pointer coordinates to the canvas' internal resolution
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX, clientY;

    if (evt.touches && evt.touches.length > 0) {
        clientX = evt.touches[0].clientX;
        clientY = evt.touches[0].clientY;
    } else {
        clientX = evt.clientX;
        clientY = evt.clientY;
    }

    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

function startDrawing(e) {
    isDrawing = true;
    const pos = getMousePos(e);
    currentX = pos.x;
    currentY = pos.y;
    
    // Draw a single dot if they just click
    ctx.beginPath();
    ctx.moveTo(currentX, currentY);
    ctx.lineTo(currentX, currentY);
    setBrush();
    ctx.stroke();
    ctx.closePath();
}

function draw(e) {
    if (!isDrawing) return;
    
    // Prevent scrolling when touching the canvas
    if (e.cancelable) e.preventDefault();

    const pos = getMousePos(e);
    
    ctx.beginPath();
    ctx.moveTo(currentX, currentY);
    ctx.lineTo(pos.x, pos.y);
    setBrush();
    ctx.stroke();
    ctx.closePath();

    currentX = pos.x;
    currentY = pos.y;
}

function stopDrawing() {
    if (isDrawing) {
        isDrawing = false;
        ctx.closePath();
    }
}

function setBrush() {
    ctx.lineWidth = brushSize;
    if (isEraser) {
        // Eraser acts as a white brush
        ctx.strokeStyle = '#FFFFFF';
        ctx.globalCompositeOperation = 'source-over';
    } else {
        ctx.strokeStyle = brushColor;
        ctx.globalCompositeOperation = 'source-over';
    }
}

/* ── Coloring Gallery Logic ── */
const galleryItems = document.querySelectorAll('.gallery-item');
const overlayImg = document.getElementById('overlayImg');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all
        galleryItems.forEach(g => g.classList.remove('active'));
        item.classList.add('active');

        const imgSrc = item.getAttribute('data-img');
        
        // Show or hide overlay
        if (imgSrc) {
            overlayImg.src = imgSrc;
            overlayImg.style.display = 'block';
        } else {
            overlayImg.style.display = 'none';
        }

        // Auto-clear canvas when switching pages for a fresh start!
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
});

/* ── Event Listeners ── */

// Mouse
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Touch (Mobile/Tablet)
canvas.addEventListener('touchstart', startDrawing, { passive: false });
canvas.addEventListener('touchmove', draw, { passive: false });
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchcancel', stopDrawing);

/* ── Responsiveness ── */
function resizeCanvasForMobile() {
    // Keep internal ratio 800x500. getMousePos handles scale.
}

window.addEventListener('resize', resizeCanvasForMobile);

// Boot
window.onload = initCanvas;
