const board = document.getElementById('puzzleBoard');
const gallery = document.getElementById('puzzleGallery');
const difficultySelector = document.getElementById('difficultySelector');
const messageBox = document.getElementById('messageBox');
let currentImage = 'arca_noe_color.png';
let gridSize = 3; // Default Médio (3x3)
let pieces = [];
let selectedIndex = null;
let boardSize = 300; // Defaults to 300x300

function checkBoardSize() {
    if (window.innerWidth <= 450) {
        boardSize = 270;
    } else {
        boardSize = 300;
    }
}

// Inicializa o jogo
function initGame() {
    checkBoardSize();
    createPieces();
    renderBoard();
    messageBox.textContent = 'Pode começar!';
}

// Cria os dados das peças originais
function createPieces() {
    pieces = [];
    const pieceSize = boardSize / gridSize;
    
    // Create ordered pieces
    let tempPieces = [];
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            tempPieces.push({
                id: row * gridSize + col,
                bgPositionX: -(col * pieceSize),
                bgPositionY: -(row * pieceSize)
            });
        }
    }

    // Shuffle pieces
    pieces = [...tempPieces].sort(() => Math.random() - 0.5);
    
    // In rare case it's instantly solved, shuffle again
    if (checkWin(false)) {
        pieces = [...pieces].sort(() => Math.random() - 0.5);
    }
}

let dragStartIndex = null;
let ghostElement = null;
let isDragging = false;

// Renderiza o tabuleiro no HTML
function renderBoard() {
    board.innerHTML = '';
    
    // Ajusta o grid conforme a dificuldade
    board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

    pieces.forEach((piece, index) => {
        const div = document.createElement('div');
        div.className = 'puzzle-piece';
        div.draggable = true; 
        
        div.style.backgroundImage = `url(${currentImage})`;
        div.style.backgroundPosition = `${piece.bgPositionX}px ${piece.bgPositionY}px`;
        div.style.backgroundSize = `${boardSize}px ${boardSize}px`;
        div.style.backgroundRepeat = 'no-repeat';
        
        div.dataset.index = index;
        
        if (index === selectedIndex) {
            div.classList.add('selected');
        }

        // --- Lógica de Clique (Mouse) ---
        div.addEventListener('click', () => {
            if (!isDragging) handlePieceClick(index);
        });

        // --- Lógica de Arraste Nativo (Mouse) ---
        div.addEventListener('dragstart', (e) => {
            dragStartIndex = index;
            e.dataTransfer.setData('text/plain', index);
            div.classList.add('selected');
        });

        div.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        div.addEventListener('drop', (e) => {
            e.preventDefault();
            const targetIndex = index;
            if (dragStartIndex !== null && dragStartIndex !== targetIndex) {
                swapPieces(dragStartIndex, targetIndex);
            }
            dragStartIndex = null;
        });

        div.addEventListener('dragend', () => {
            div.classList.remove('selected');
            dragStartIndex = null;
        });

        // --- Lógica de Arraste (Touch para Celular) ---
        div.addEventListener('touchstart', (e) => handleTouchStart(e, index), { passive: false });
        div.addEventListener('touchmove', handleTouchMove, { passive: false });
        div.addEventListener('touchend', handleTouchEnd);

        board.appendChild(div);
    });
}

function handleTouchStart(e, index) {
    dragStartIndex = index;
    isDragging = false;
}

function handleTouchMove(e) {
    if (dragStartIndex === null) return;
    
    isDragging = true;
    e.preventDefault(); 
    
    const touch = e.touches[0];
    
    if (!ghostElement) {
        ghostElement = document.createElement('div');
        ghostElement.className = 'puzzle-ghost puzzle-piece';
        ghostElement.style.backgroundImage = `url(${currentImage})`;
        ghostElement.style.backgroundPosition = `${pieces[dragStartIndex].bgPositionX}px ${pieces[dragStartIndex].bgPositionY}px`;
        
        const pieceSize = boardSize / gridSize;
        ghostElement.style.width = `${pieceSize}px`;
        ghostElement.style.height = `${pieceSize}px`;
        ghostElement.style.backgroundSize = `${boardSize}px ${boardSize}px`;
        
        document.body.appendChild(ghostElement);
    }
    
    const ghostSize = boardSize / gridSize;
    ghostElement.style.left = `${touch.clientX - ghostSize / 2}px`;
    ghostElement.style.top = `${touch.clientY - ghostSize / 2}px`;
}

function handleTouchEnd(e) {
    if (dragStartIndex === null) return;
    
    if (ghostElement) {
        ghostElement.remove();
        ghostElement = null;
    }
    
    if (isDragging) {
        const touch = e.changedTouches[0];
        const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (targetElement && targetElement.classList.contains('puzzle-piece')) {
            const targetIndex = parseInt(targetElement.dataset.index);
            if (targetIndex !== dragStartIndex && !isNaN(targetIndex)) {
                swapPieces(dragStartIndex, targetIndex);
            }
        }
    }
    
    setTimeout(() => {
        dragStartIndex = null;
        isDragging = false;
    }, 50);
}

function swapPieces(index1, index2) {
    const temp = pieces[index1];
    pieces[index1] = pieces[index2];
    pieces[index2] = temp;
    
    selectedIndex = null;
    renderBoard();
    
    if (checkWin(true)) {
        messageBox.textContent = 'Parabéns! Você conseguiu!! 🎉';
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}

function handlePieceClick(index) {
    if (selectedIndex === index) {
        selectedIndex = null;
        renderBoard();
        return;
    }

    if (selectedIndex !== null) {
        swapPieces(selectedIndex, index);
    } else {
        selectedIndex = index;
        renderBoard();
    }
}

function checkWin(playSound) {
    let win = true;
    for (let i = 0; i < pieces.length; i++) {
        if (pieces[i].id !== i) {
            win = false;
            break;
        }
    }
    return win;
}

// Event listeners para a galeria
gallery.addEventListener('click', (e) => {
    if (e.target.classList.contains('gallery-item')) {
        document.querySelectorAll('.gallery-item').forEach(item => item.classList.remove('active'));
        e.target.classList.add('active');
        currentImage = e.target.dataset.img;
        selectedIndex = null;
        initGame();
    }
});

// Event listener para dificuldade
difficultySelector.addEventListener('click', (e) => {
    if (e.target.classList.contains('difficulty-btn')) {
        document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        gridSize = parseInt(e.target.dataset.size);
        selectedIndex = null;
        initGame();
    }
});

window.addEventListener('resize', () => {
    const oldSize = boardSize;
    checkBoardSize();
    if (oldSize !== boardSize) {
        initGame();
    }
});

initGame();
