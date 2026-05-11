const categories = {
    Animais: ['GATO', 'CACHORRO', 'LEAO', 'TIGRE', 'COELHO', 'GIRAFA', 'ELEFANTE', 'ZEBRA', 'MACACO', 'PANDA'],
    Cores: ['AZUL', 'ROSA', 'VERDE', 'AMARELO', 'ROXO', 'BRANCO', 'PRETO', 'LARANJA', 'CINZA', 'MARROM'],
    Frutas: ['MACA', 'BANANA', 'UVA', 'PERA', 'MELANCIA', 'LARANJA', 'MANGA', 'MORANGO', 'ABACAXI', 'KIWI'],
    Natureza: ['FLOR', 'ARVORE', 'SOL', 'LUA', 'ESTRELA', 'NUVEM', 'RIO', 'MAR', 'MONTAGNE', 'PEDRA']
};

let gridSize = 10;
let currentWords = [];
let foundWords = [];
let isSelecting = false;
let selectionStart = null;
let selectedCells = [];
let difficulty = 'Fácil';

const gridElement = document.getElementById('grid');
const wordListElement = document.getElementById('wordList');
const winMessage = document.getElementById('winMessage');

function setDifficulty(level) {
    difficulty = level;
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText === level);
    });
    
    if (level === 'Fácil') gridSize = 8;
    else if (level === 'Médio') gridSize = 12;
    else gridSize = 15;
    
    initGame();
}

function initGame() {
    gridElement.innerHTML = '';
    wordListElement.innerHTML = '';
    winMessage.style.display = 'none';
    foundWords = [];
    
    // Pick a random category
    const categoryNames = Object.keys(categories);
    const categoryName = categoryNames[Math.floor(Math.random() * categoryNames.length)];
    const wordPool = categories[categoryName];
    
    // Pick 5-8 random words based on grid size
    const count = gridSize === 8 ? 5 : (gridSize === 12 ? 7 : 10);
    currentWords = [...wordPool].sort(() => 0.5 - Math.random()).slice(0, count);
    
    createGrid();
    renderWordList();
}

function createGrid() {
    const grid = Array(gridSize).fill().map(() => Array(gridSize).fill(''));
    
    // Place words
    currentWords.forEach(word => {
        let placed = false;
        let attempts = 0;
        
        while (!placed && attempts < 100) {
            const directions = [
                [0, 1],   // Horizontal
                [1, 0],   // Vertical
                [1, 1],   // Diagonal Down
            ];
            
            // For harder levels add reverse or more diagonals
            if (difficulty !== 'Fácil') {
                directions.push([0, -1]); // Horizontal Reverse
                directions.push([-1, 0]); // Vertical Reverse
            }

            const direction = directions[Math.floor(Math.random() * directions.length)];
            const startRow = Math.floor(Math.random() * gridSize);
            const startCol = Math.floor(Math.random() * gridSize);
            
            if (canPlaceWord(grid, word, startRow, startCol, direction)) {
                placeWord(grid, word, startRow, startCol, direction);
                placed = true;
            }
            attempts++;
        }
    });
    
    // Fill empty cells
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            if (grid[r][c] === '') {
                grid[r][c] = letters.charAt(Math.floor(Math.random() * letters.length));
            }
        }
    }
    
    // Render grid
    gridElement.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.innerText = grid[r][c];
            cell.dataset.row = r;
            cell.dataset.col = c;
            
            cell.addEventListener('mousedown', startSelection);
            cell.addEventListener('mouseover', updateSelection);
            cell.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const realTarget = document.elementFromPoint(touch.clientX, touch.clientY);
                if (realTarget && realTarget.classList.contains('grid-cell')) {
                    startSelection({ target: realTarget });
                }
            });
            cell.addEventListener('touchmove', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const realTarget = document.elementFromPoint(touch.clientX, touch.clientY);
                if (realTarget && realTarget.classList.contains('grid-cell')) {
                    updateSelection({ target: realTarget });
                }
            });
            
            gridElement.appendChild(cell);
        }
    }
    
    window.addEventListener('mouseup', endSelection);
    window.addEventListener('touchend', endSelection);
}

function canPlaceWord(grid, word, row, col, dir) {
    for (let i = 0; i < word.length; i++) {
        const r = row + i * dir[0];
        const c = col + i * dir[1];
        if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) return false;
        if (grid[r][c] !== '' && grid[r][c] !== word[i]) return false;
    }
    return true;
}

function placeWord(grid, word, row, col, dir) {
    for (let i = 0; i < word.length; i++) {
        const r = row + i * dir[0];
        const c = col + i * dir[1];
        grid[r][c] = word[i];
    }
}

function renderWordList() {
    currentWords.forEach(word => {
        const item = document.createElement('div');
        item.className = 'word-item';
        item.innerText = word;
        item.id = `word-${word}`;
        wordListElement.appendChild(item);
    });
}

function startSelection(e) {
    isSelecting = true;
    selectionStart = {
        row: parseInt(e.target.dataset.row),
        col: parseInt(e.target.dataset.col)
    };
    selectedCells = [e.target];
    updateVisualSelection();
}

function updateSelection(e) {
    if (!isSelecting) return;
    
    const currentRow = parseInt(e.target.dataset.row);
    const currentCol = parseInt(e.target.dataset.col);
    
    // Only allow straight lines (horizontal, vertical, diagonal)
    const rowDiff = currentRow - selectionStart.row;
    const colDiff = currentCol - selectionStart.col;
    
    if (rowDiff === 0 || colDiff === 0 || Math.abs(rowDiff) === Math.abs(colDiff)) {
        const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
        const rowStep = rowDiff === 0 ? 0 : rowDiff / steps;
        const colStep = colDiff === 0 ? 0 : colDiff / steps;
        
        selectedCells = [];
        for (let i = 0; i <= steps; i++) {
            const r = selectionStart.row + i * rowStep;
            const c = selectionStart.col + i * colStep;
            const cell = document.querySelector(`.grid-cell[data-row="${r}"][data-col="${c}"]`);
            if (cell) selectedCells.push(cell);
        }
    }
    updateVisualSelection();
}

function endSelection() {
    if (!isSelecting) return;
    isSelecting = false;
    
    const selectedWord = selectedCells.map(c => c.innerText).join('');
    const reversedWord = selectedWord.split('').reverse().join('');
    
    if (currentWords.includes(selectedWord) && !foundWords.includes(selectedWord)) {
        markAsFound(selectedWord);
    } else if (currentWords.includes(reversedWord) && !foundWords.includes(reversedWord)) {
        markAsFound(reversedWord);
    }
    
    selectedCells = [];
    updateVisualSelection();
}

function updateVisualSelection() {
    document.querySelectorAll('.grid-cell').forEach(c => c.classList.remove('selected'));
    selectedCells.forEach(c => c.classList.add('selected'));
}

function markAsFound(word) {
    foundWords.push(word);
    document.getElementById(`word-${word}`).classList.add('found');
    selectedCells.forEach(c => c.classList.add('found'));
    
    // Particle effect logic could be here
    
    if (foundWords.length === currentWords.length) {
        showWin();
    }
}

function showWin() {
    winMessage.style.display = 'block';
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF4DA6', '#C084FC', '#FFD700']
    });
}

// Start game on load
initGame();
