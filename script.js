const board = document.getElementById("board");
const cells = document.querySelectorAll("[data-cell]");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popupMessage");
const newGameButton = document.getElementById("newGameButton");
const victoryPopup = document.getElementById("victoryPopup");
const victoryMessage = document.getElementById("victoryMessage");
const resetScoresButton = document.getElementById("resetScoresButton");
const menuIcon = document.getElementById("menuIcon");
const menuOptions = document.getElementById("menuOptions");
const restartButton = document.getElementById("restartButton");
const stepBackButton = document.getElementById("stepBackButton");
const clearScoresButton = document.getElementById("clearScoresButton");
const blueScoreElement = document.getElementById("blueScore");
const redScoreElement = document.getElementById("redScore");

const contactPopup = document.getElementById("contactPopup");
const contactCreatorButton = document.getElementById("contactCreatorButton");
const closeContactPopup = document.getElementById("closeContactPopup");
const sendButton = document.getElementById("sendButton");

let currentPlayer = "X";
let isGameActive = true;
let blueScore = 0;
let redScore = 0;
let gameHistory = [];
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

// Start Game
function startGame() {
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("X", "O");
        cell.addEventListener("click", handleClick, { once: true });
    });
    gameHistory = [];
    closePopup();
    currentPlayer = "X";
    isGameActive = true;
}

// Handle Cell Click
function handleClick(e) {
    const cell = e.target;
    const cellIndex = [...cells].indexOf(cell);

    if (!isGameActive) return;

    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer);
    gameHistory.push({ index: cellIndex, player: currentPlayer });

    if (checkWin(currentPlayer)) {
        currentPlayer === "X" ? blueScore++ : redScore++;
        updateScores();
        endGame(`${currentPlayer === "X" ? "Blue" : "Red"} wins!`, currentPlayer === "X" ? "blue" : "red");
    } else if (isDraw()) {
        endGame("It's a draw!", "yellow");
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
}

// Check for Win
function checkWin(player) {
    return winningCombinations.some(combination => {
        return combination.every(index => cells[index].classList.contains(player));
    });
}

// Check for Draw
function isDraw() {
    return [...cells].every(cell => cell.textContent !== "");
}

// End Game
function endGame(message, color) {
    isGameActive = false;
    popupMessage.textContent = message;
    popup.style.background = color;
    popup.style.display = "flex";
}

// Update Scores
function updateScores() {
    blueScoreElement.textContent = blueScore;
    redScoreElement.textContent = redScore;

    if (blueScore === 5 || redScore === 5) {
        showVictoryPopup(blueScore === 5 ? "Blue" : "Red");
    }
}

// Show Victory Popup
function showVictoryPopup(winner) {
    victoryMessage.textContent = `${winner} wins 5 games!`;
    victoryPopup.style.background = winner === "Blue" ? "blue" : "red";
    victoryPopup.style.display = "flex";

    // Party Poppers
    const canvas = document.getElementById("partyPoppers");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    for (let i = 0; i < 300; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            dx: Math.random() * 4 - 2,
            dy: Math.random() * 5 + 4,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`,
            size: Math.random() * 4 + 1,
        });
    }

    const interval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();

            particle.x += particle.dx;
            particle.y += particle.dy;
        });
    }, 30);

    setTimeout(() => {
        clearInterval(interval);
        canvas.width = canvas.height = 0;
    }, 3000);
}

// Close Popup
function closePopup() {
    popup.style.display = "none";
    victoryPopup.style.display = "none";
}

// Menu Options
menuIcon.addEventListener("click", () => {
    menuOptions.style.display = menuOptions.style.display === "flex" ? "none" : "flex";
});

restartButton.addEventListener("click", startGame);

newGameButton.addEventListener("click", startGame); // Fix: New Game button restarts properly

stepBackButton.addEventListener("click", () => {
    if (gameHistory.length === 0 || !isGameActive) return;

    const lastMove = gameHistory.pop();
    cells[lastMove.index].textContent = "";
    cells[lastMove.index].classList.remove("X", "O");
    currentPlayer = lastMove.player;
    isGameActive = true;
});

clearScoresButton.addEventListener("click", () => {
    blueScore = redScore = 0;
    updateScores();
  startGame();
});

// Restart Scores
resetScoresButton.addEventListener("click", () => {
    blueScore = redScore = 0;
    updateScores();
    startGame();
});

// Start the Game
startGame();
