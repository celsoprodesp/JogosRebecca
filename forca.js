const words = [
    // ANIMAIS (30)
    { word: 'GATO', category: 'ANIMAL' }, { word: 'CACHORRO', category: 'ANIMAL' }, { word: 'COELHO', category: 'ANIMAL' }, { word: 'LEAO', category: 'ANIMAL' }, { word: 'TIGRE', category: 'ANIMAL' },
    { word: 'ELEFANTE', category: 'ANIMAL' }, { word: 'ZEBRA', category: 'ANIMAL' }, { word: 'GIRAFA', category: 'ANIMAL' }, { word: 'MACACO', category: 'ANIMAL' }, { word: 'URSO', category: 'ANIMAL' },
    { word: 'PANDA', category: 'ANIMAL' }, { word: 'PINGUIM', category: 'ANIMAL' }, { word: 'PEIXE', category: 'ANIMAL' }, { word: 'TUBARAO', category: 'ANIMAL' }, { word: 'BALEIA', category: 'ANIMAL' },
    { word: 'BORBOLETA', category: 'ANIMAL' }, { word: 'ABELHA', category: 'ANIMAL' }, { word: 'FORMIGA', category: 'ANIMAL' }, { word: 'ARANHA', category: 'ANIMAL' }, { word: 'PASSARO', category: 'ANIMAL' },
    { word: 'PATINHO', category: 'ANIMAL' }, { word: 'GALINHA', category: 'ANIMAL' }, { word: 'PORQUINHO', category: 'ANIMAL' }, { word: 'VAQUINHA', category: 'ANIMAL' }, { word: 'CAVALO', category: 'ANIMAL' },
    { word: 'OVELHA', category: 'ANIMAL' }, { word: 'TARTARUGA', category: 'ANIMAL' }, { word: 'JACARE', category: 'ANIMAL' }, { word: 'SAPO', category: 'ANIMAL' }, { word: 'COBRA', category: 'ANIMAL' },

    // PERSONAGENS PIXAR/DISNEY (40)
    { word: 'WOODY', category: 'PERSONAGEM' }, { word: 'BUZZ', category: 'PERSONAGEM' }, { word: 'JESSIE', category: 'PERSONAGEM' }, { word: 'ELSA', category: 'PERSONAGEM' }, { word: 'ANNA', category: 'PERSONAGEM' },
    { word: 'OLAF', category: 'PERSONAGEM' }, { word: 'MIRABEL', category: 'PERSONAGEM' }, { word: 'MOANA', category: 'PERSONAGEM' }, { word: 'ARIEL', category: 'PERSONAGEM' }, { word: 'BELA', category: 'PERSONAGEM' },
    { word: 'CINDERELA', category: 'PERSONAGEM' }, { word: 'RAPUNZEL', category: 'PERSONAGEM' }, { word: 'BRANCA DE NEVE', category: 'PERSONAGEM' }, { word: 'MICKEY', category: 'PERSONAGEM' }, { word: 'MINNIE', category: 'PERSONAGEM' },
    { word: 'DONALD', category: 'PERSONAGEM' }, { word: 'PATETA', category: 'PERSONAGEM' }, { word: 'PLUTO', category: 'PERSONAGEM' }, { word: 'SIMBA', category: 'PERSONAGEM' }, { word: 'NALA', category: 'PERSONAGEM' },
    { word: 'NEMO', category: 'PERSONAGEM' }, { word: 'DORY', category: 'PERSONAGEM' }, { word: 'MCQUEEN', category: 'PERSONAGEM' }, { word: 'MATE', category: 'PERSONAGEM' }, { word: 'SULLIVAN', category: 'PERSONAGEM' },
    { word: 'MIKE', category: 'PERSONAGEM' }, { word: 'REMY', category: 'PERSONAGEM' }, { word: 'WALL-E', category: 'PERSONAGEM' }, { word: 'EVA', category: 'PERSONAGEM' }, { word: 'MIGUEL', category: 'PERSONAGEM' },
    { word: 'LUCA', category: 'PERSONAGEM' }, { word: 'ALBERTO', category: 'PERSONAGEM' }, { word: 'MEI', category: 'PERSONAGEM' }, { word: 'JOY', category: 'PERSONAGEM' }, { word: 'TRISTEZA', category: 'PERSONAGEM' },
    { word: 'RAIVA', category: 'PERSONAGEM' }, { word: 'MEDO', category: 'PERSONAGEM' }, { word: 'NOJO', category: 'PERSONAGEM' }, { word: 'BING BONG', category: 'PERSONAGEM' }, { word: 'STITCH', category: 'PERSONAGEM' },

    // BRINQUEDOS E HOBBIES (30)
    { word: 'BONECA', category: 'BRINQUEDO' }, { word: 'CARRINHO', category: 'BRINQUEDO' }, { word: 'BOLA', category: 'BRINQUEDO' }, { word: 'PIPA', category: 'BRINQUEDO' }, { word: 'LEGO', category: 'BRINQUEDO' },
    { word: 'QUEBRA-CABEÇA', category: 'BRINQUEDO' }, { word: 'PELUCIA', category: 'BRINQUEDO' }, { word: 'PATINS', category: 'BRINQUEDO' }, { word: 'BICICLETA', category: 'BRINQUEDO' }, { word: 'SKATE', category: 'BRINQUEDO' },
    { word: 'CORDA', category: 'BRINQUEDO' }, { word: 'AMARELINHA', category: 'BRINQUEDO' }, { word: 'BALANÇO', category: 'BRINQUEDO' }, { word: 'ESCORREGADOR', category: 'BRINQUEDO' }, { word: 'PISCINA', category: 'BRINQUEDO' },
    { word: 'AREIA', category: 'BRINQUEDO' }, { word: 'DESENHO', category: 'HOBBY' }, { word: 'PINTURA', category: 'HOBBY' }, { word: 'DANÇA', category: 'HOBBY' }, { word: 'MUSICA', category: 'HOBBY' },
    { word: 'CANTO', category: 'HOBBY' }, { word: 'TEATRO', category: 'HOBBY' }, { word: 'PIANO', category: 'MUSICA' }, { word: 'FLAUTA', category: 'MUSICA' }, { word: 'VIOLAO', category: 'MUSICA' },
    { word: 'TAMBOR', category: 'MUSICA' }, { word: 'XADREZ', category: 'JOGO' }, { word: 'DOMINO', category: 'JOGO' }, { word: 'CARTA', category: 'JOGO' }, { word: 'VIDEO GAME', category: 'JOGO' },

    // COMIDA E BEBIDA (30)
    { word: 'MAÇA', category: 'COMIDA' }, { word: 'BANANA', category: 'COMIDA' }, { word: 'MELANCIA', category: 'COMIDA' }, { word: 'UVA', category: 'COMIDA' }, { word: 'MORANGO', category: 'COMIDA' },
    { word: 'LARANJA', category: 'COMIDA' }, { word: 'ABACAXI', category: 'COMIDA' }, { word: 'PERA', category: 'COMIDA' }, { word: 'MANGA', category: 'COMIDA' }, { word: 'COCO', category: 'COMIDA' },
    { word: 'BOLO', category: 'COMIDA' }, { word: 'DOCE', category: 'COMIDA' }, { word: 'SORVETE', category: 'COMIDA' }, { word: 'CHOCOLATE', category: 'COMIDA' }, { word: 'BISCOITO', category: 'COMIDA' },
    { word: 'PIZZA', category: 'COMIDA' }, { word: 'HAMBURGUER', category: 'COMIDA' }, { word: 'BATATA FRITA', category: 'COMIDA' }, { word: 'PIPOCA', category: 'COMIDA' }, { word: 'PAO', category: 'COMIDA' },
    { word: 'QUEIJO', category: 'COMIDA' }, { word: 'OVO', category: 'COMIDA' }, { word: 'LEITE', category: 'BEBIDA' }, { word: 'SUCO', category: 'BEBIDA' }, { word: 'AGUA', category: 'BEBIDA' },
    { word: 'GELATINA', category: 'COMIDA' }, { word: 'ARROZ', category: 'COMIDA' }, { word: 'FEIJAO', category: 'COMIDA' }, { word: 'MACARRAO', category: 'COMIDA' }, { word: 'SALADA', category: 'COMIDA' },

    // NATUREZA E UNIVERSO (30)
    { word: 'SOL', category: 'NATUREZA' }, { word: 'LUA', category: 'NATUREZA' }, { word: 'ESTRELA', category: 'NATUREZA' }, { word: 'NUVEM', category: 'NATUREZA' }, { word: 'CHUVA', category: 'NATUREZA' },
    { word: 'ARCO-IRIS', category: 'NATUREZA' }, { word: 'VENTO', category: 'NATUREZA' }, { word: 'MAR', category: 'NATUREZA' }, { word: 'RIO', category: 'NATUREZA' }, { word: 'LAGO', category: 'NATUREZA' },
    { word: 'AREIA', category: 'NATUREZA' }, { word: 'PEDRA', category: 'NATUREZA' }, { word: 'MONTANHA', category: 'NATUREZA' }, { word: 'ARVORE', category: 'NATUREZA' }, { word: 'FLOR', category: 'NATUREZA' },
    { word: 'GRAMA', category: 'NATUREZA' }, { word: 'FOLHA', category: 'NATUREZA' }, { word: 'FRUTA', category: 'NATUREZA' }, { word: 'TERRA', category: 'NATUREZA' }, { word: 'PLANETA', category: 'UNIVERSO' },
    { word: 'FOGUETE', category: 'UNIVERSO' }, { word: 'ASTRONAUTA', category: 'UNIVERSO' }, { word: 'COMETA', category: 'UNIVERSO' }, { word: 'GALAXIA', category: 'UNIVERSO' }, { word: 'TELESCOPIO', category: 'UNIVERSO' },
    { word: 'INVERNO', category: 'ESTAÇÃO' }, { word: 'VERAO', category: 'ESTAÇÃO' }, { word: 'PRIMAVERA', category: 'ESTAÇÃO' }, { word: 'OUTONO', category: 'ESTAÇÃO' }, { word: 'DIA', category: 'TEMPO' },

    // OBJETOS E CASA (20)
    { word: 'CASA', category: 'OBJETO' }, { word: 'MESA', category: 'OBJETO' }, { word: 'CADEIRA', category: 'OBJETO' }, { word: 'CAMA', category: 'OBJETO' }, { word: 'SOFA', category: 'OBJETO' },
    { word: 'JANELA', category: 'OBJETO' }, { word: 'PORTA', category: 'OBJETO' }, { word: 'ESPELHO', category: 'OBJETO' }, { word: 'RELOGIO', category: 'OBJETO' }, { word: 'TELEFONE', category: 'OBJETO' },
    { word: 'COMPUTADOR', category: 'OBJETO' }, { word: 'CANETA', category: 'OBJETO' }, { word: 'Lapis', category: 'OBJETO' }, { word: 'CADERNO', category: 'OBJETO' }, { word: 'LIVRO', category: 'OBJETO' },
    { word: 'MOCHILA', category: 'OBJETO' }, { word: 'TENIS', category: 'ROUPA' }, { word: 'VESTIDO', category: 'ROUPA' }, { word: 'CAMISETA', category: 'ROUPA' }, { word: 'CHAPÉU', category: 'ROUPA' },

    // CORES E FORMAS (20)
    { word: 'AZUL', category: 'COR' }, { word: 'VERMELHO', category: 'COR' }, { word: 'AMARELO', category: 'COR' }, { word: 'VERDE', category: 'COR' }, { word: 'ROSA', category: 'COR' },
    { word: 'ROXO', category: 'COR' }, { word: 'PRETO', category: 'COR' }, { word: 'BRANCO', category: 'COR' }, { word: 'CINZA', category: 'COR' }, { word: 'MARROM', category: 'COR' },
    { word: 'LARANJA', category: 'COR' }, { word: 'DOURADO', category: 'COR' }, { word: 'PRATEADO', category: 'COR' }, { word: 'CIRCULO', category: 'FORMA' }, { word: 'QUADRADO', category: 'FORMA' },
    { word: 'TRIANGULO', category: 'FORMA' }, { word: 'RETANGULO', category: 'FORMA' }, { word: 'CORAÇÃO', category: 'FORMA' }, { word: 'ESTRELA', category: 'FORMA' }, { word: 'DIAMANTE', category: 'FORMA' },
];

// Masks revealed one-by-one per wrong guess (bottom → top = shoes first → hair last)
const TOTAL_MASKS = 6;
const maxMistakes = TOTAL_MASKS;

let selectedWord = '';
let selectedCategory = '';
let guessedLetters = [];
let mistakes = 0;

/* ── helpers ── */
function getMask(n) {
    return document.getElementById('mask-' + n);
}

function resetMasks() {
    for (let i = 1; i <= TOTAL_MASKS; i++) {
        const m = getMask(i);
        if (m) {
            // Remove revealed class instantly (no animation on reset)
            m.classList.remove('revealed');
            m.style.transition = 'none';
            requestAnimationFrame(() => {
                m.style.transition = '';
            });
        }
    }
}

function revealMask(n) {
    const m = getMask(n);
    if (m) m.classList.add('revealed');
}

function updateHearts() {
    // Hidden as per user request
}

/* ── game logic ── */
function initGame() {
    const random = words[Math.floor(Math.random() * words.length)];
    selectedWord = random.word;
    selectedCategory = random.category;
    guessedLetters = [];
    mistakes = 0;

    document.getElementById('category').innerText = `DICA: ${selectedCategory}`;
    document.getElementById('message').innerText = '';
    document.getElementById('resetBtn').style.display = 'none';

    // Remove doll victory/loss glow
    const doll = document.getElementById('dollImg');
    if (doll) {
        doll.src = 'doll.png';
        doll.style.filter = 'drop-shadow(0 10px 20px rgba(0,0,0,0.25))';
        doll.style.animation = '';
    }

    resetMasks();
    updateHearts();
    updateWordDisplay();
    createKeyboard();
}

function updateWordDisplay() {
    const display = selectedWord.split('').map(l =>
        guessedLetters.includes(l) ? l : '_'
    ).join(' ');
    document.getElementById('wordDisplay').innerText = display;

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
        btn.id = 'key-' + letter;
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
        mistakes++;
        // Reveal the next mask (mask-1 first wrong, mask-2 second, ...)
        revealMask(mistakes);
        updateHearts();
        if (mistakes === TOTAL_MASKS) {
            endGame(false);
        }
    }
}

function endGame(isWin) {
    const msg = document.getElementById('message');
    const reset = document.getElementById('resetBtn');
    const doll = document.getElementById('dollImg');

    document.querySelectorAll('.key').forEach(k => k.disabled = true);

    if (isWin) {
        msg.innerText = '🎉 PARABÉNS! VOCÊ ACERTOU! 🎉';
        msg.style.color = '#15803d';

        // Make all masks vanish instantly → full doll celebration glow
        for (let i = 1; i <= TOTAL_MASKS; i++) revealMask(i);
        if (doll) {
            doll.style.filter =
                'drop-shadow(0 0 20px #FFD700) drop-shadow(0 0 40px #FF4DA6)';
            doll.style.animation = 'dollCelebrate 0.6s ease-in-out infinite alternate';
        }

        confetti({
            particleCount: 200, spread: 80, origin: { y: 0.6 },
            colors: ['#FF4DA6', '#C084FC', '#FFD700', '#86EFAC', '#F9A8D4'],
            shapes: ['star','circle'],
        });
        setTimeout(() => {
            confetti({ particleCount: 100, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#FF4DA6','#C084FC','#FFD700'] });
            confetti({ particleCount: 100, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#FF4DA6','#C084FC','#FFD700'] });
        }, 400);

    } else {
        // Reveal full doll on loss too, but with sad tint
        for (let i = 1; i <= TOTAL_MASKS; i++) revealMask(i);
        msg.innerText = `💔 Quase! A palavra era: ${selectedWord}`;
        msg.style.color = '#CC007A';
        if (doll) {
            doll.src = 'doll_sad.png';
            doll.style.filter =
                'drop-shadow(0 10px 20px rgba(0,0,0,0.25)) grayscale(0.3)';
        }
    }

    reset.style.display = 'inline-block';
}

// Doll celebration animation injected dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes dollCelebrate {
        from { transform: rotate(-4deg) scale(1.02); }
        to   { transform: rotate( 4deg) scale(1.06); }
    }
`;
document.head.appendChild(style);

document.getElementById('resetBtn').onclick = initGame;
window.onload = initGame;
