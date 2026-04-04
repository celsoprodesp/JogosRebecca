const words = [
    { word: 'GATO', category: 'ANIMAL 🐱' },
    { word: 'CACHORRO', category: 'ANIMAL 🐶' },
    { word: 'BONECA', category: 'BRINQUEDO 🪆' },
    { word: 'ROSA', category: 'COR 🌸' },
    { word: 'AMARELO', category: 'COR 💛' },
    { word: 'BANANA', category: 'FRUTA 🍌' },
    { word: 'SORVETE', category: 'COMIDA 🍦' },
    { word: 'SOL', category: 'NATUREZA ☀️' },
    { word: 'LUA', category: 'NATUREZA 🌙' },
    { word: 'SAPO', category: 'ANIMAL 🐸' },
    { word: 'BOLA', category: 'BRINQUEDO ⚽' },
    { word: 'PIPA', category: 'BRINQUEDO 🪁' },
    { word: 'BALAO', category: 'FESTA 🎈' },
    { word: 'PEIXE', category: 'ANIMAL 🐟' },
    { word: 'COELHO', category: 'ANIMAL 🐰' },
    { word: 'ESTRELA', category: 'NATUREZA ⭐' },
    { word: 'GIRAFA', category: 'ANIMAL 🦒' },
    { word: 'ZIGUE', category: 'BRINQUEDO 🛹' },
    { word: 'BOLO', category: 'COMIDA 🎂' },
    { word: 'FOCA', category: 'ANIMAL 🦭' }
];

let selectedWord = '';
let selectedCategory = '';
let guessedLetters = [];
let mistakes = 0;
const maxMistakes = 9; // pole-v, pole-h, rope, head, body, arm-l, arm-r, leg-l, leg-r

const hParts = [
    '.pole-v', '.pole-h', '.rope', 
    '.head', '.body', '.arm-l', '.arm-r', 
    '.leg-l', '.leg-r'
];

function initGame() {
    const random = words[Math.floor(Math.random() * words.length)];
    selectedWord = random.word;
    selectedCategory = random.category;
    guessedLetters = [];
    mistakes = 0;

    document.getElementById('category').innerText = `DICA: ${selectedCategory}`;
    document.getElementById('message').innerText = '';
    document.getElementById('resetBtn').style.display = 'none';
    
    // Clear SVG parts
    hParts.forEach(p => {
        document.querySelector(p).classList.remove('visible');
    });

    updateWordDisplay();
    createKeyboard();
}

function updateWordDisplay() {
    const display = selectedWord.split('').map(letter => {
        return guessedLetters.includes(letter) ? letter : '_';
    }).join(' ');
    document.getElementById('wordDisplay').innerText = display;

    // Check Victory
    if (!display.includes('_')) {
        endGame(true);
    }
}

function createKeyboard() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const container = document.getElementById('keyboard');
    container.innerHTML = '';

    alphabet.forEach(letter => {
        const btn = document.createElement('button');
        btn.innerText = letter;
        btn.classList.add('key');
        btn.onclick = () => handleGuess(letter, btn);
        container.appendChild(btn);
    });
}

function handleGuess(letter, btn) {
    if (guessedLetters.includes(letter)) return;

    btn.disabled = true;
    if (selectedWord.includes(letter)) {
        guessedLetters.push(letter);
        btn.classList.add('correct');
        updateWordDisplay();
    } else {
        btn.classList.add('wrong');
        revealNextPart();
    }
}

function revealNextPart() {
    if (mistakes < hParts.length) {
        const selector = hParts[mistakes];
        document.querySelector(selector).classList.add('visible');
        mistakes++;
    }

    if (mistakes === hParts.length) {
        endGame(false);
    }
}

function endGame(isWin) {
    const msg = document.getElementById('message');
    const reset = document.getElementById('resetBtn');
    
    // Disable all keys
    document.querySelectorAll('.key').forEach(k => k.disabled = true);

    if (isWin) {
        msg.innerText = '🎉 PARABÉNS! VOCÊ CONSEGUIU! 🎉';
        msg.style.color = '#56c596';
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff8ab4', '#70d6ff', '#ffd670']
        });
    } else {
        msg.innerText = `Ah, não foi desta vez! A palavra era: ${selectedWord}`;
        msg.style.color = '#ff8b94';
    }

    reset.style.display = 'inline-block';
}

document.getElementById('resetBtn').onclick = initGame;

// Start on load
window.onload = initGame;
