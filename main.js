const solutionBoard = [
  [8, 5, 1, 7, 9, 3, 6, 2, 4],
  [6, 4, 9, 5, 8, 2, 3, 7, 1],
  [7, 3, 2, 1, 4, 6, 8, 5, 9],
  [3, 6, 8, 4, 2, 5, 1, 9, 7],
  [9, 1, 5, 3, 7, 8, 2, 4, 6],
  [2, 7, 4, 6, 1, 9, 5, 3, 8],
  [1, 8, 7, 2, 5, 4, 9, 6, 3],
  [5, 9, 3, 8, 6, 7, 4, 1, 2],
  [4, 2, 6, 9, 3, 1, 7, 8, 5],
];

const puzzleBoard = safeRemoveCells(solutionBoard, 35);

const feedbackBoard = Array.from({ length: 9 }, () => Array(9).fill(null));

const playerBoard = JSON.parse(JSON.stringify(puzzleBoard));

function gridInit() {
  const board = document.getElementById("sudoku-board");

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = document.createElement("div");
      const value = puzzleBoard[row][col];

      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;

      if (value !== null) {
        cell.textContent = value;
        cell.classList.add("locked");
      } else {
        cell.textContent = "";
      }

      board.appendChild(cell);
    }
  }
}

function getBoxIndex(row, col) {
  return Math.floor(row / 3) * 3 + Math.floor(col / 3);
}

function safeRemoveCells(solutionBoard, blanks = 30) {
  const puzzle = JSON.parse(JSON.stringify(solutionBoard));

  let rowCount = Array(9).fill(0);
  let colCount = Array(9).fill(0);
  let boxCount = Array(9).fill(0);

  const maxPerRow = 4;
  const maxPerCol = 4;
  const maxPerBox = 4;

  let removed = 0;
  let attempts = 0;

  while (removed < blanks && attempts < 500) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    const box = getBoxIndex(row, col);

    if (puzzle[row][col] === null) {
      attempts++;
      continue;
    }

    if (
      rowCount[row] >= maxPerRow ||
      colCount[col] >= maxPerCol ||
      boxCount[box] >= maxPerBox
    ) {
      attempts++;
      continue;
    }

    puzzle[row][col] = null;
    rowCount[row]++;
    colCount[col]++;
    boxCount[box]++;
    removed++;
  }

  return puzzle;
}

function isCellAvailable(row, col, currentUID, players) {
  return Object.entries(players).every(([uid, player]) => {
    if (uid === currentUID) return true;
    const cell = player.selectedCell;
    return !(cell && cell.row === row && cell.col === col);
  });
}

function updatePlayerCell(row, col, value) {
  if (puzzleBoard[row][col] != null) {
    return;
  }

  if (!isCellAvailable(row, col, null, null)) {
    // Show error here!
    return;
  }

  playerBoard[row][col] = value;

  if (!checkValidCell(row, col, value)) {
    feedbackBoard[row][col] = "invalid";
  }

  if (value === solutionBoard[row][col]) {
    feedbackBoard[row][col] = "correct";
  } else {
    feedbackBoard[row][col] = "wrong";
  }
}

function checkWin() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (playerBoard[i][j] != solutionBoard[i][j]) {
        return false;
      }
    }
  }

  return true;
}

function getSquareStart(index) {
  return Math.floor(index / 3) * 3;
}

function checkValidCell(row, col, value) {
  if (playerBoard[row].includes(value)) return false;

  for (let i = 0; i < 9; i++) {
    if (playerBoard[i][col] === value) return false;
  }

  const boxRowStart = getSquareStart(row);
  const boxColStart = getSquareStart(col);

  for (let i = boxRowStart; i < boxRowStart + 3; i++) {
    for (let j = boxColStart; j < boxColStart + 3; j++) {
      if (i === row && j === col) continue; // Skip current cell
      if (playerBoard[i][j] === value) return false;
    }
  }

  return true;
}

gridInit();
