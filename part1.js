const rs = require("readline-sync");

let shipsRemaining = 2;
const board = [];
const strikes = [];
let hits = 0;

function generateRandomLocation() {
  const row = String.fromCharCode(65 + Math.floor(Math.random() * 3));
  const col = Math.floor(Math.random() * 3) + 1;
  return row + col;
}

function initializeGame() {
  board.length = 0;
  strikes.length = 0;
  for (let i = 0; i < 2; i++) {
    let location;
    {
      location = generateRandomLocation();
    }
    while (board.includes(location));
    board.push(location);
  }

  console.log("Press any key to start the game.");
  rs.keyInPause();
  console.clear();
  console.log("Enter a location to strike (e.g., A2):");
}

function handleInput(input) {
  input = input.toUpperCase();

  if (board.includes(input)) {
    hits += 1;
    shipsRemaining -= 1;
    console.log(
      `Hit. You have sunk a battleship. ${shipsRemaining} ship(s) remaining.`
    );
    if (shipsRemaining === 0) {
      const playAgain = rs.keyInYNStrict(
        "You have destroyed all battleships. Would you like to play again?"
      );
      if (playAgain) {
        shipsRemaining = 2;
        initializeGame();
      } else {
        console.log("Thanks for playing!");
        process.exit();
      }
    }
  } else if (strikes.includes(input)) {
    console.log("You have already picked this location. Miss!");
  } else {
    console.log("You have missed!");
    strikes.push(input);
  }
}

initializeGame(shipsRemaining);

while (true) {
  const input = rs.question("Enter a location: ", { limit: /^[a-cA-C][1-3]$/ });
  handleInput(input);
}
