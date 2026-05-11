let board = [];
let solution = [];
let selectedCell = null;
let difficulty = 'Fácil';

const gridElement = document.getElementById('grid');
const winMessage = document.getElementById('winMessage');

function setDifficulty(level) {
    difficulty = level;
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText === level);
    });
    initGame();
}

function initGame() {
    board = Array(81).fill(0);
    solution = Array(81).fill(0);
    gridElement.innerHTML = '';
    winMessage.style.display = 'none';
    selectedCell = null;
    
    generateSudoku();
    renderGrid();
}

function generateSudoku() {
    // Fill diagonal 3x3 blocks (independent)
    fillDiagonal();
    // Fill remaining
    solveSudoku(solution);
    // Copy solution to board
    board = [...solution];
    
    // Remove numbers based on difficulty
    let removeCount = difficulty === 'Fácil' ? 30 : (difficulty === 'Médio' ? 45 : 55);
    while (removeCount > 0) {
        let i = Math.floor(Math.random() * 81);
        if (board[i] !== 0) {
            board[i] = 0;
            removeCount--;
        }
    }
}

function fillDiagonal() {
    for (let i = 0; i < 9; i += 3) {
        fillBlock(i, i);
    }
}

function fillBlock(row, col) {
    let num;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            do {
                num = Math.floor(Math.random() * 9) + 1;
            } while (!isUnusedInBlock(row, col, num, solution));
            solution[(row + i) * 9 + (col + j)] = num;
        }
    }
}

function isUnusedInBlock(rowStart, colStart, num, b) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (b[(rowStart + i) * 9 + (colStart + j)] === num) return false;
        }
    }
    return true;
}

function isSafe(row, col, num, b) {
    // Check row
    for (let j = 0; j < 9; j++) {
        if (b[row * 9 + j] === num) return false;
    }
    // Check col
    for (let i = 0; i < 9; i++) {
        if (b[i * 9 + col] === num) return false;
    }
    // Check block
    return isUnusedInBlock(row - row % 3, col - col % 3, num, b);
}

function solveSudoku(b) {
    for (let i = 0; i < 81; i++) {
        if (b[i] === 0) {
            let row = Math.floor(i / 9);
            let col = i % 9;
            let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
            for (let num of nums) {
                if (isSafe(row, col, num, b)) {
                    b[i] = num;
                    if (solveSudoku(b)) return true;
                    b[i] = 0;
                }
            }
            return false;
        }
    }
    return true;
}

function renderGrid() {
    for (let i = 0; i < 81; i++) {
        const cell = document.createElement('div');
        cell.className = 'sudoku-cell';
        if (board[i] !== 0) {
            cell.innerText = board[i];
            cell.classList.add('fixed');
        } else {
            cell.innerText = '';
            cell.addEventListener('click', () => selectCell(cell, i));
        }
        cell.dataset.index = i;
        gridElement.appendChild(cell);
    }
}

function selectCell(cell, index) {
    if (cell.classList.contains('fixed')) return;
    
    document.querySelectorAll('.sudoku-cell').forEach(c => c.classList.remove('selected'));
    cell.classList.add('selected');
    selectedCell = { element: cell, index: index };
}

function inputNumber(num) {
    if (!selectedCell) return;
    
    const index = selectedCell.index;
    if (num === 0) {
        selectedCell.element.innerText = '';
        selectedCell.element.classList.remove('error');
        board[index] = 0;
    } else {
        selectedCell.element.innerText = num;
        board[index] = num;
        
        // Instant feedback
        if (num !== solution[index]) {
            selectedCell.element.classList.add('error');
        } else {
            selectedCell.element.classList.remove('error');
        }
    }
    
    checkWin();
}

function checkWin() {
    const isComplete = board.every((val, i) => val === solution[i]);
    if (isComplete) {
        winMessage.style.display = 'block';
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF4DA6', '#C084FC', '#FFD700']
        });
    }
}

// Support for keyboard input
window.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '9') {
        inputNumber(parseInt(e.key));
    } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        inputNumber(0);
    }
});

initGame();
