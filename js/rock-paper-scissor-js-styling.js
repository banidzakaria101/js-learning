const resultElement = document.querySelector(".js-results");
const movesElement = document.querySelector(".js-moves");
let computerChoice = "";
function pickComputerCHoice() {
  const randomNumber = Math.random();
  if (randomNumber < 1 / 3 && randomNumber > 0) {
    computerChoice = "rock";
    console.log("Computer chose rock");
  } else if (randomNumber > 1 / 3 && randomNumber < 2 / 3) {
    computerChoice = "paper";
    console.log("computer chose paper");
  } else if (randomNumber > 2 / 3 && randomNumber < 1) {
    computerChoice = "scissors";
    console.log("computer chose scissors");
  } else {
    console.log("Invalid choice, try again");
  }

  return computerChoice;
}

const score = JSON.parse(localStorage.getItem("score")) || {
  wins: 0,
  loses: 0,
  ties: 0,
};

updateScoreElements();

function playGame(playerMove) {
  console.log(resultElement);
  const computerChoice = pickComputerCHoice();
  let result = "";
  if (playerMove === "rock") {
    if (computerChoice === "rock") {
      result = "Tie!";
    } else if (computerChoice === "paper") {
      result = "You lose!";
    } else if (computerChoice === "scissors") {
      result = "You win!";
    }
  } else if (playerMove === "paper") {
    if (computerChoice === "rock") {
      result = "You win!";
    } else if (computerChoice === "paper") {
      result = "Tie!";
    } else if (computerChoice === "scissors") {
      result = "You lose!";
    }
  } else if (playerMove === "scissors") {
    if (computerChoice === "rock") {
      result = "You lose!";
    } else if (computerChoice === "paper") {
      result = "You win!";
    } else if (computerChoice === "scissors") {
      result = "Tie!";
    }
  }

  if (result === "You win!") {
    score.wins += 1;
  } else if (result === "You lose!") {
    score.loses += 1;
  } else if (result === "Tie!") {
    score.ties += 1;
  }

  localStorage.setItem("score", JSON.stringify(score));

  updateScoreElements();
  resultElement.innerHTML = `${result}`;
  movesElement.innerHTML = `you chose
    <img class="move-icon" src="images/${playerMove}-emoji.png" alt="">
    <img class="move-icon" src="images/${computerChoice}-emoji.png" alt="">
    computer`;

  // alert(`You chose ${playerMove}, Computer choses ${computerChoice}. ${result}
  //   Your score : Wins: ${score.wins}, Loses: ${score.loses}, Ties: ${score.ties}`
  //   );
}

function updateScoreElements() {
  document.querySelector(
    ".js-score"
  ).innerHTML = `Wins: ${score.wins}, Loses: ${score.loses}, Ties: ${score.ties}`;
}

function resetScore() {
  score.wins = 0;
  score.loses = 0;
  score.ties = 0;
  localStorage.removeItem("score");
  updateScoreElements();
  // alert(`Your reseted score : Wins: ${score.wins}, Loses: ${score.loses}, Ties: ${score.ties}`);
}
