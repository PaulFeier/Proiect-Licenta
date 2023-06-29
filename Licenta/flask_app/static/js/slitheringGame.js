const gifs = new Map([
  ["Romania", "/static/imgs/slithering-borders/Romania-Border.gif"],
  ["France", "/static/imgs/slithering-borders/France-Border.gif"],
  ["USA", "/static/imgs/slithering-borders/USA-Border.gif"]
]);

const gifDisplay = document.getElementById("gifDisplay");
const countdownElement = document.getElementById("countdown");
const userInput = document.getElementById("input");
let countryArray = Array.from(gifs.keys()); // Array to track available countries
let currentCountry; // Variable to store the currently displayed country
let score = 0;
const totalTime = 120; // Total time for the game in seconds
let timeLeft = totalTime;
let timer;

let timeStarted = false;

// Function to display the next gif and update the countdown
function displayNextGif() {
  if (timeStarted === false) {
    startTimer();
    timeStarted = true;
  }

  if (countryArray.length === 0) {
    // All countries have been guessed
    clearInterval(timer);
    alert("Game Over! Your score: " + score);
    return;
  }

  const randomIndex = Math.floor(Math.random() * countryArray.length); // Get a random index
  currentCountry = countryArray[randomIndex]; // Set the current country
  const gifUrl = gifs.get(currentCountry);

  gifDisplay.src = gifUrl;
  countdownElement.textContent = timeLeft;
}

// Function to check if the user input is correct
function checkInput() {
  const userGuess = userInput.value.toLowerCase(); // Get the user's guess

  if (userGuess === currentCountry.toLowerCase()) {
    score++;
    countryArray.splice(countryArray.indexOf(currentCountry), 1); // Remove the guessed country from the available countries array
    displayNextGif();
  } else {
    alert("Incorrect guess! Try again.");
  }

  userInput.value = ""; // Clear input field
}

// Start the game
displayNextGif();


userInput.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    checkInput();
  }
});

function formatTime(minutes, seconds, milliseconds) {
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  const formattedMilliseconds = milliseconds.toString().padStart(3, '0');
  const millisecondsSubstring = formattedMilliseconds.substring(0, 3);
  return `${formattedMinutes}:${formattedSeconds}.${millisecondsSubstring}`;
}

function startTimer() {
  const countdownDuration = 2 * 60 * 1000; // 2 minutes in milliseconds
  let startTime = Date.now() + countdownDuration; // Set the start time to future time
  const timerElement = document.getElementById('timer');

  const timerInterval = setInterval(() => {
    const currentTime = Date.now();
    const remainingMilliseconds = startTime - currentTime;

    if (remainingMilliseconds <= 0) {
      clearInterval(timerInterval);
      // Handle timer expiration
      return;
    }

    const elapsedSeconds = Math.floor(remainingMilliseconds / 1000);
    const minutesElapsed = Math.floor(elapsedSeconds / 60);
    const secondsElapsed = elapsedSeconds % 60;
    const millisecondsElapsed = remainingMilliseconds % 1000;

    timerElement.textContent = 'Time: ' + formatTime(minutesElapsed, secondsElapsed, millisecondsElapsed);
  }, 1);
}


