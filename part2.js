const rs = require("readline-sync");

const gridSize = 10;
const shipsRemaining = [2, 3, 3, 4, 5];
const board = [];
const shipOnBoard = [];
const strikes = [];
const hits = [];
const shipCoords = [];
let targets = shipsRemaining.reduce((acc, val) => acc + val, 0);

function generateRandomLocation() {
  const row = String.fromCharCode(65 + Math.floor(Math.random() * gridSize));
  const col = Math.floor(Math.random() * gridSize) + 1;
  return row + col;
}

function buildGrid() {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 1; j <= gridSize; j++) {
      board.push(String.fromCharCode(65 + i) + j);
    }
  }
}

function placeShips() {
  for (const shipLength of shipsRemaining) {
    let shipPlaced = false;
    while (!shipPlaced) {
      const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";
      const startLocation = generateRandomLocation();
      const endLocation =
        orientation === "horizontal"
          ? startLocation[0] +
            (parseInt(startLocation.slice(1)) + shipLength - 1)
          : String.fromCharCode(startLocation.charCodeAt(0) + shipLength - 1) +
            startLocation.slice(1);

            const hasDuplicate = checkForDuplicates([...shipOnBoard, ...getShipCoordinates(startLocation, endLocation)]);
            if (hasDuplicate) {
              continue;
            }
          placeShipOnBoard(startLocation, endLocation);
          shipPlaced = true;
      }
    }
  }


function checkForDuplicates(arr) {
  const seen = {};
  let hasDuplicates = false;

  arr.forEach((value) => {
    if (seen[value]) {
      hasDuplicates = true;
      return; 
    }
    seen[value] = true;
  });

  return hasDuplicates;
}

// function checkStartEnd(startRow, endRow, startCol, endCol) {
  //horizontal check
  // for (let i = 0; i < shipsRemaining.length; i++) {
  //   const shipTarget = shipsRemaining[i];
  //   for (let j = 0; j <= shipTarget - 1; j++) {
  //     if (startRow === endRow) {
        
  //       for (let number = startCol; number <= endCol - 1; number++) {
  //         let coords = startRow + number;
  //         shipCoords.push(coords)
  //         console.log(coords);
  //       }
  //     } else {
  //       for (let letterIndex = startRow; letterIndex <= endRow - 1; letterIndex++) {
  //         const letter = String.fromCharCode(65 + letterIndex);
  //         let coords = letter + startCol;
  //         shipCoords.push(coords)
  //       }
  //     }
  //   }


    //vertical check

    // console.log('line 47 ' + startRow, endRow, startCol, endCol);
    // for (let i = startRow; i <= endRow; i++) {
    //   for (let j = startCol; j <= endCol; j++) {
    //     const cell = String.fromCharCode(65 + j) + (i + 1);
    //     console.log('line 51 ' + cell);
    //     if (shipOnBoard.includes(cell)) {
    //       return false;
    //     }
    //   }
//   }
//   return true;
// }

function isValidPlacement(startLocation, endLocation) {
  const startRow = startLocation.charCodeAt(0) - 65;
  const startCol = parseInt(startLocation.slice(1)) - 1;
  const endRow = endLocation.charCodeAt(0) - 65;
  const endCol = parseInt(endLocation.slice(1)) - 1;
  if (
    startRow < 0 ||
    startCol < 0 ||
    endRow >= gridSize ||
    endCol >= gridSize
  ) {
    return false;
  }
  return true;
}

function getShipCoordinates(startLocation, endLocation) {
  const startRow = startLocation.charCodeAt(0) - 65;
  const startCol = parseInt(startLocation.slice(1)) - 1;
  const endRow = endLocation.charCodeAt(0) - 65;
  const endCol = parseInt(endLocation.slice(1)) - 1;
  const coordinates = [];

  for (let i = startRow; i <= endRow; i++) {
    for (let j = startCol; j <= endCol; j++) {
      const cell = String.fromCharCode(65 + i) + (j + 1);
      coordinates.push(cell);
    }
  }
  return coordinates
}

function placeShipOnBoard(startLocation, endLocation) {
  const startRow = startLocation.charCodeAt(0) - 65;
  const startCol = parseInt(startLocation.slice(1)) - 1;
  const endRow = endLocation.charCodeAt(0) - 65;
  const endCol = parseInt(endLocation.slice(1)) - 1;

  for (let i = startRow; i <= endRow; i++) {
    for (let j = startCol; j <= endCol; j++) {
      const cell = String.fromCharCode(65 + i) + (j + 1);
      shipOnBoard.push(cell);
    }
  }
}

function initializeGame() {
  board.length = 0;
  shipOnBoard.length = 0;
  strikes.length = 0;
  hits.length = 0;
  buildGrid();
  placeShips();
  console.log(shipOnBoard);
  console.log(shipCoords);
  console.log("Press any key to start the game.");
  rs.keyInPause();
  // console.clear();
  console.log(
    `Enter a location to strike (e.g., A1-${String.fromCharCode(
      64 + gridSize
    )}${gridSize}):`
  );
}

function handleInput(input) {
  input = input.toUpperCase();

  if (shipOnBoard.includes(input) && !hits.includes(input)) {
    targets -= 1;
    hits.push(input);
    console.log(
      `Hit. You have struck a battleship. There are ${targets} remaining.`
    );

    if (targets === 0) {
      const playAgain = rs.keyInYNStrict(
        "You have destroyed all battleships. Would you like to play again?"
      );
      if (playAgain) {
        initializeGame();
      } else {
        console.log("Thanks for playing!");
        process.exit();
      }
    }
  } else if (hits.includes(input)) {
    console.log("You have hit this location. Please try again!");
  } else if (strikes.includes(input)) {
    console.log("You have already picked this location. Miss!");
  } else if (!strikes.includes(input) && !hits.includes(input)) {
    console.log("You have missed!");
    strikes.push(input);
  }
}

initializeGame();

while (true) {
  const input = rs.question("Enter a location: ", {
    limit: /^[a-jA-J]([1-9]|10)$/,
  });
  handleInput(input);
}
