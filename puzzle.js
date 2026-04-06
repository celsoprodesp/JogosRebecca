const board = document.getElementById('puzzleBoard');
const gallery = document.getElementById('puzzleGallery');
const messageBox = document.getElementById('messageBox');
let currentImage = 'arca_noe_color.png';
const GRID_SIZE = 3;
let pieces = [];
let selectedIndex = null;
let boardSize = 300; // Defaults to 300x300, responsive adjustments made in CSS but we calculate bg-size

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
    const pieceSize = boardSize / GRID_SIZE;
    
    // Create ordered pieces
    let tempPieces = [];
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            tempPieces.push({
                id: row * GRID_SIZE + col,
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
    const pieceSize = boardSize / GRID_SIZE;
    
    pieces.forEach((piece, index) => {
        const div = document.createElement('div');
        div.className = 'puzzle-piece';
        div.draggable = true; // Habilita o arrastar nativo do mouse
        
        div.style.backgroundImage = `url(${currentImage})`;
        div.style.backgroundPosition = `${piece.bgPositionX}px ${piece.bgPositionY}px`;
        div.style.backgroundSize = `${boardSize}px ${boardSize}px`; // Fix para tamanhos iguais
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
            e.preventDefault(); // Necessário para permitir o drop
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
    // e.preventDefault(); // Não previne aqui para o click funcionar se for um tap rápido
    dragStartIndex = index;
    isDragging = false;
}

function handleTouchMove(e) {
    if (dragStartIndex === null) return;
    
    // Se o usuário moveu o dedo, consideramos que é um arraste
    isDragging = true;
    e.preventDefault(); // Previne scroll da página
    
    const touch = e.touches[0];
    
    // Cria elemento fantasma se não existir
    if (!ghostElement) {
        ghostElement = document.createElement('div');
        ghostElement.className = 'puzzle-ghost puzzle-piece';
        ghostElement.style.backgroundImage = `url(${currentImage})`;
        ghostElement.style.backgroundPosition = `${pieces[dragStartIndex].bgPositionX}px ${pieces[dragStartIndex].bgPositionY}px`;
        
        // Ajusta o tamanho pelo CSS inline
        const pieceSize = boardSize / GRID_SIZE;
        ghostElement.style.width = `${pieceSize}px`;
        ghostElement.style.height = `${pieceSize}px`;
        ghostElement.style.backgroundSize = `${boardSize}px ${boardSize}px`;
        
        document.body.appendChild(ghostElement);
    }
    
    // Move o fantasma
    ghostElement.style.left = `${touch.clientX - (boardSize / GRID_SIZE) / 2}px`;
    ghostElement.style.top = `${touch.clientY - (boardSize / GRID_SIZE) / 2}px`;
}

function handleTouchEnd(e) {
    if (dragStartIndex === null) return;
    
    // Remove o fantasma
    if (ghostElement) {
        ghostElement.remove();
        ghostElement = null;
    }
    
    if (isDragging) {
        // Encontra onde o dedo soltou
        const touch = e.changedTouches[0];
        const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (targetElement && targetElement.classList.contains('puzzle-piece')) {
            const targetIndex = parseInt(targetElement.dataset.index);
            
            // Se soltou em uma peça diferente, faz a troca
            if (targetIndex !== dragStartIndex && !isNaN(targetIndex)) {
                swapPieces(dragStartIndex, targetIndex);
            }
        }
    }
    
    // Reseta estado após um pequeno atraso para não engatilhar o click
    setTimeout(() => {
        dragStartIndex = null;
        isDragging = false;
    }, 50);
}

function swapPieces(index1, index2) {
    const temp = pieces[index1];
    pieces[index1] = pieces[index2];
    pieces[index2] = temp;
    
    selectedIndex = null; // Reseta qualquer seleção
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
    // Se clicar na mesma, desmarca
    if (selectedIndex === index) {
        selectedIndex = null;
        renderBoard();
        return;
    }

    // Se já havia uma selecionada, faz a troca
    if (selectedIndex !== null) {
        swapPieces(selectedIndex, index);
    } else {
        // Seleciona a primeira peça
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
        // Atualiza a seleção
        document.querySelectorAll('.gallery-item').forEach(item => item.classList.remove('active'));
        e.target.classList.add('active');
        
        // Define imagem atual e reseta
        currentImage = e.target.dataset.img;
        selectedIndex = null;
        initGame();
    }
});

// Window resize listener to handle responsive background sizes if needed
window.addEventListener('resize', () => {
    const oldSize = boardSize;
    checkBoardSize();
    if (oldSize !== boardSize) {
        initGame();
    }
});

// Inicia no load
initGame();
