const rs = require('readline-sync');

const gridSize = 10; 
const shipsRemaining = [2, 3, 3, 4, 5]; 
const board = [];
const shipOnBoard = [];
const strikes = [];
let targets = 17;

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
            const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
            const startLocation = generateRandomLocation();
            const endLocation = orientation === 'horizontal'
                ? String.fromCharCode(startLocation.charCodeAt(0) + (shipLength) - 1) + startLocation.slice(1)
                : startLocation[0] + (parseInt(startLocation.slice(1)) + (shipLength) - 1);

                

            if (isValidPlacement(startLocation, endLocation)) {
                placeShipOnBoard(startLocation, endLocation);
                shipPlaced = true;
            }
        }console.log("line 37 " + (shipLength));
    }
}

function isValidPlacement(startLocation, endLocation) {
    const startRow = startLocation.charCodeAt(0) - 65;
    const startCol = parseInt(startLocation.slice(1)) - 1;
    const endRow = endLocation.charCodeAt(0) - 65;
    const endCol = parseInt(endLocation.slice(1)) - 1;
    

    if (startRow < 0 || startCol < 0 || endRow >= gridSize || endCol >= gridSize) {
        
        return false; 
    
    }

    for (let i = startRow; i <= endRow; i++) {
        for (let j = startCol; j <= endCol; j++) {
            const cell = String.fromCharCode(65 + i) + (j + 1);
            if (shipOnBoard.includes(cell)) {
                return false;
            }
        }
    }
    return true;
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
            console.log("line 85" + cell);
        }
    }  
}

function initializeGame() {
    board.length = 0;
    shipOnBoard.length = 0;
    strikes.length = 0; 
    buildGrid();
    placeShips();
    console.log("Press any key to start the game.");
    rs.keyInPause();
    console.clear();
    console.log(`Enter a location to strike (e.g., A1-${String.fromCharCode(64 + gridSize)}${gridSize}):`);
}

function handleInput(input) {
    input = input.toUpperCase();

    console.log("line 104 " + shipOnBoard);

    if (shipOnBoard.includes(input)) 
    {
        targets -= 1;    

        console.log(`Hit. You have struck a battleship. There are ${targets} remaining.`);

        if (targets === 0) {
            console.log("Congratulations! You have destroyed all battleships.");
            process.exit();
        }
    } 
    else if (strikes.includes(input)) {
        console.log("You have already picked this location. Miss!");
    } 
    else {
        console.log("You have missed!");
        strikes.push(input);
    }
}

initializeGame();

while (true) {
    const input = rs.question("Enter a location: ");
    handleInput(input);
}