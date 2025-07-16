const name1 = localStorage.getItem("player1") || "player 1";
const name2 = localStorage.getItem("player2") || "player 2";
document.getElementById("player1-name").innerHTML = `${name1} (Yellow): <span id="score1">0</span>`;
document.getElementById("player2-name").innerHTML = `${name2} (Blue): <span id="score2">0</span>`;


const size = parseInt(localStorage.getItem('boxes')) || 5 ;
const grid = document.getElementById('grid');
grid.style.gridTemplateColumns = `repeat(${size}, 60px)`;

let currentPlayer = 1;
let score = [0, 0];

function createCell(r, c) {
  const cell = document.createElement("div");
  cell.className = "cell";
  cell.dataset.row = r;
  cell.dataset.col = c;

  ["top", "right", "bottom", "left"].forEach(side => {
    const line = document.createElement("div");
    line.className = `line ${side}`;
    line.dataset.side = side;
    line.onclick = () => handleClick(cell, line);
    cell.appendChild(line);
  });

  grid.appendChild(cell);
}
function drawGrid() {
  grid.innerHTML = "";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      createCell(r, c);
    }
  }
}

function restartGame() {
  score = [0, 0];
  currentPlayer = 1;
  updateScoreboard();
  drawGrid();
}

function getAllCells() {
  return Array.from(document.querySelectorAll(".cell"));
}

// Handle click on a line
function handleClick(cell, line) {
  if (line.classList.contains("filled")) return;

  // Mark current line
  line.classList.add("filled", `p${currentPlayer}`);

  // Also fill the opposite line in the adjacent cell
  const neighbor = getNeighbor(cell, line.dataset.side);
  if (neighbor) {
    const opposite = neighbor.querySelector(`.line.${getOppositeSide(line.dataset.side)}`);
    if (opposite && !opposite.classList.contains("filled")) {
      opposite.classList.add("filled", `p${currentPlayer}`);
    }
  }

  // Check completion
  const completedCount = checkBoxesCompleted();

  if (completedCount > 0) {
    score[currentPlayer - 1] += completedCount;
    if (completedCount >= 2) {
      alert(`🔥 Combo! ${completedCount - 1} bonus point${completedCount > 2 ? 's' : ''} awarded.`);
      score[currentPlayer - 1] += (completedCount - 1); // bonus points
    }
  } else {
    currentPlayer = 3 - currentPlayer;
  }

  updateScoreboard();
  checkGameOver();
}

// Get neighbor cell for a given side of current cell
function getNeighbor(cell, side) {
  const row = +cell.dataset.row;
  const col = +cell.dataset.col;
  switch (side) {
    case "top": return row > 0 ? document.querySelector(`[data-row='${row - 1}'][data-col='${col}']`) : null;
    case "bottom": return row < size - 1 ? document.querySelector(`[data-row='${row + 1}'][data-col='${col}']`) : null;
    case "left": return col > 0 ? document.querySelector(`[data-row='${row}'][data-col='${col - 1}']`) : null;
    case "right": return col < size - 1 ? document.querySelector(`[data-row='${row}'][data-col='${col + 1}']`) : null;
  }
  return null;
}

// Get the opposite side string
function getOppositeSide(side) {
  return { top: "bottom", bottom: "top", left: "right", right: "left" }[side];
}

// Check all boxes for completion
function checkBoxesCompleted() {
  let completed = 0;
  getAllCells().forEach(cell => {
    const lines = cell.querySelectorAll(".line");
    const allFilled = Array.from(lines).every(l => l.classList.contains("filled"));
    if (allFilled && !cell.querySelector(".box-owner")) {
      const owner = document.createElement("div");
      owner.className = "box-owner";
      owner.textContent = currentPlayer === 1 ? "O" : "X";
      cell.appendChild(owner);
      cell.classList.add(currentPlayer === 1 ? "player1" : "player2");
      completed++;
    }
  });
  return completed;
}

function updateScoreboard() {
  document.getElementById("score1").textContent = score[0];
  document.getElementById("score2").textContent = score[1];
}

drawGrid();

function checkGameOver(){
  const totalBoxes = size * size;
  const filledBoxes = document.querySelectorAll('.box-owner').length;

  if(filledBoxes === totalBoxes){
    let winner = `🤝 it's a Tie !`;
    if(score[0] > score[1]){
      winner = localStorage.getItem('player1');
    }else if(score[0] < score[1]){
      winner = localStorage.getItem('player2')
    }

    localStorage.setItem('winner', winner);
    setTimeout(()=>{
      window.location.href = 'winner.html'
    },1000);
  }
}