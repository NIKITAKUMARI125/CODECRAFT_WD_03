// ------- Game State -------
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X"; // internally X/O, displayed as emoji
let gameActive = true;

let scoreX = 0;
let scoreO = 0;
let scoreDraw = 0;

let roundNumber = 1;
let startingPlayer = "X"; // alternates each round
let vsAI = false;
let aiDifficulty = "hard"; // easy | medium | hard
const AI_PLAYER = "O"; // AI always plays as O when vsAI is true
const HUMAN_PLAYER = "X";

const PLAYER_EMOJI = { X: "❌", O: "⭕" };
const WIN_EMOJIS = ["🎉", "🏆", "🔥", "✨"];

// ------- DOM Elements -------
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");
const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");
const scoreDrawEl = document.getElementById("scoreDraw");
const resultBox = document.getElementById("resultBox");
const emojiDisplay = document.getElementById("emojiDisplay");

const pvpBtn = document.getElementById("pvpBtn");
const aiBtn = document.getElementById("aiBtn");
const difficultyBox = document.getElementById("difficultyBox");
const difficultySelect = document.getElementById("difficultySelect");
const roundNumEl = document.getElementById("roundNum");
const starterInfo = document.getElementById("starterInfo");

const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const sfxBtn = document.getElementById("sfxBtn");

// ------- Sound Settings -------
let musicOn = false;
let sfxOn = true;
bgMusic.volume = 0.4;

// ------- Sound Effects (Web Audio API - no external files needed) -------
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, duration, type = "sine", volume = 0.15) {
  if (!sfxOn) return;
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = type;
  oscillator.frequency.value = freq;
  gainNode.gain.value = volume;

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
  oscillator.stop(audioCtx.currentTime + duration);
}

function playClickSound() {
  playTone(440, 0.12, "square", 0.1);
}

function playWinSound() {
  // little ascending fanfare
  playTone(523, 0.15, "triangle", 0.15);
  setTimeout(() => playTone(659, 0.15, "triangle", 0.15), 150);
  setTimeout(() => playTone(784, 0.25, "triangle", 0.15), 300);
}

function playDrawSound() {
  playTone(300, 0.3, "sawtooth", 0.1);
}

// ------- Music / SFX Toggle Buttons -------
musicBtn.addEventListener("click", () => {
  musicOn = !musicOn;
  if (musicOn) {
    bgMusic.play().catch(() => {
      // Autoplay might be blocked until user interacts - this click counts as interaction
    });
    musicBtn.textContent = "🎵 Music: On";
    musicBtn.classList.add("active");
  } else {
    bgMusic.pause();
    musicBtn.textContent = "🎵 Music: Off";
    musicBtn.classList.remove("active");
  }
});

sfxBtn.addEventListener("click", () => {
  sfxOn = !sfxOn;
  sfxBtn.textContent = sfxOn ? "🔊 SFX: On" : "🔇 SFX: Off";
  sfxBtn.classList.toggle("active", sfxOn);
});

// ------- Winning Combinations -------
const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

// ------- Mode Switching -------
pvpBtn.addEventListener("click", () => {
  vsAI = false;
  pvpBtn.classList.add("active");
  aiBtn.classList.remove("active");
  difficultyBox.classList.remove("show");
  restartGame(true);
});

aiBtn.addEventListener("click", () => {
  vsAI = true;
  aiBtn.classList.add("active");
  pvpBtn.classList.remove("active");
  difficultyBox.classList.add("show");
  restartGame(true);
});

difficultySelect.addEventListener("change", (e) => {
  aiDifficulty = e.target.value;
});

// ------- Handle Cell Click -------
function handleCellClick(e) {
  const index = parseInt(e.target.getAttribute("data-index"));

  if (board[index] !== "" || !gameActive) return;
  // In AI mode, block clicks when it's AI's turn
  if (vsAI && currentPlayer === AI_PLAYER) return;

  makeMove(index, currentPlayer);

  if (gameActive && vsAI && currentPlayer === AI_PLAYER) {
    emojiDisplay.textContent = "🤔";
    setTimeout(aiMove, 500);
  }
}

// ------- Place a Mark -------
function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = PLAYER_EMOJI[player];
  playClickSound();
  checkResult();
}

// ------- AI Move -------
function aiMove() {
  if (!gameActive) return;

  let index;
  if (aiDifficulty === "easy") {
    index = getRandomMove();
  } else if (aiDifficulty === "medium") {
    index = getWinOrBlockMove() ?? getRandomMove();
  } else {
    index = getBestMove(); // minimax - unbeatable
  }

  if (index !== null && index !== undefined) {
    makeMove(index, AI_PLAYER);
  }
}

function getRandomMove() {
  const emptyCells = board
    .map((val, idx) => (val === "" ? idx : null))
    .filter(v => v !== null);
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// Medium: win if possible, else block, else null (fallback to random)
function getWinOrBlockMove() {
  for (const player of [AI_PLAYER, HUMAN_PLAYER]) {
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      const line = [board[a], board[b], board[c]];
      const emptyIdx = pattern[line.indexOf("")];
      const filled = line.filter(v => v === player).length;
      if (filled === 2 && line.includes("")) {
        return emptyIdx;
      }
    }
  }
  return null;
}

// Hard: Minimax algorithm (unbeatable)
function getBestMove() {
  let bestScore = -Infinity;
  let move = null;

  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = AI_PLAYER;
      const score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(currentBoard, depth, isMaximizing) {
  const result = evaluateBoard(currentBoard);
  if (result !== null) {
    if (result === AI_PLAYER) return 10 - depth;
    if (result === HUMAN_PLAYER) return depth - 10;
    return 0; // draw
  }

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === "") {
        currentBoard[i] = AI_PLAYER;
        best = Math.max(best, minimax(currentBoard, depth + 1, false));
        currentBoard[i] = "";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === "") {
        currentBoard[i] = HUMAN_PLAYER;
        best = Math.min(best, minimax(currentBoard, depth + 1, true));
        currentBoard[i] = "";
      }
    }
    return best;
  }
}

// Returns "X", "O", "draw", or null (game still going)
function evaluateBoard(b) {
  for (const pattern of winPatterns) {
    const [a, x, c] = pattern;
    if (b[a] && b[a] === b[x] && b[a] === b[c]) {
      return b[a];
    }
  }
  if (!b.includes("")) return "draw";
  return null;
}

// ------- Check Win / Draw (used by real gameplay, updates UI) -------
function checkResult() {
  let roundWon = false;
  let winningCombo = [];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      roundWon = true;
      winningCombo = pattern;
      break;
    }
  }

  if (roundWon) {
    gameActive = false;
    highlightWinningCells(winningCombo);

    if (currentPlayer === "X") {
      scoreX++;
      scoreXEl.textContent = scoreX;
    } else {
      scoreO++;
      scoreOEl.textContent = scoreO;
    }

    const emoji = WIN_EMOJIS[Math.floor(Math.random() * WIN_EMOJIS.length)];
    const winnerLabel = vsAI && currentPlayer === AI_PLAYER ? "🤖 AI" : `Player ${PLAYER_EMOJI[currentPlayer]}`;
    statusText.textContent = `${PLAYER_EMOJI[currentPlayer]} Wins! ${emoji}`;
    resultBox.textContent = `🏆 Winner: ${winnerLabel}`;
    emojiDisplay.textContent = "🏆";
    playWinSound();
    return;
  }

  if (!board.includes("")) {
    gameActive = false;
    scoreDraw++;
    scoreDrawEl.textContent = scoreDraw;
    statusText.textContent = "🤝 It's a Draw!";
    resultBox.textContent = "🤝 Result: Draw — no winner!";
    emojiDisplay.textContent = "🤝";
    playDrawSound();
    return;
  }

  // Switch player
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  const turnLabel = vsAI && currentPlayer === AI_PLAYER ? "🤖 AI's turn" : `Player ${PLAYER_EMOJI[currentPlayer]}'s turn`;
  statusText.textContent = turnLabel;
  emojiDisplay.textContent = currentPlayer === "X" ? "❌" : "⭕";
}

// ------- Highlight Winning Cells -------
function highlightWinningCells(combo) {
  combo.forEach(index => {
    cells[index].classList.add("winner");
  });
}

// ------- Restart Game -------
// fullReset = true when switching modes (doesn't advance round/starter)
function restartGame(fullReset = false) {
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;

  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("winner");
  });

  if (!fullReset) {
    // Alternate starting player each new round
    roundNumber++;
    startingPlayer = startingPlayer === "X" ? "O" : "X";
  } else {
    roundNumber = 1;
    startingPlayer = "X";
  }

  currentPlayer = startingPlayer;
  roundNumEl.textContent = roundNumber;
  const starterLabel = vsAI && startingPlayer === AI_PLAYER ? "🤖 AI" : `Player ${PLAYER_EMOJI[startingPlayer]}`;
  starterInfo.textContent = `🚀 Starts: ${starterLabel}`;

  const turnLabel = vsAI && currentPlayer === AI_PLAYER ? "🤖 AI's turn" : `Player ${PLAYER_EMOJI[currentPlayer]}'s turn`;
  statusText.textContent = turnLabel;
  resultBox.textContent = "🎯 Game in progress...";
  emojiDisplay.textContent = "🤖";

  // If AI starts the round, let it move first
  if (vsAI && currentPlayer === AI_PLAYER) {
    emojiDisplay.textContent = "🤔";
    setTimeout(aiMove, 500);
  }
}

// ------- Event Listeners -------
cells.forEach(cell => cell.addEventListener("click", handleCellClick));
restartBtn.addEventListener("click", () => restartGame(false));
