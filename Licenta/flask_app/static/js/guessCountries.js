let unsuccessfulTries = 0;

const paths = [...document.querySelectorAll('path')];

for (let i = paths.length - 1; i >= 0; i--) {
  const id = paths[i].getAttribute('id');
  if (id === '1' || id === '2' || id === '3') {
    console.log(paths[i]);
    paths.splice(i, 1);
  }
}

// 2nd array so that I won't remove the elements from the 1st one
const availablePaths = [...paths];

let randomId = availablePaths[Math.floor(Math.random() * availablePaths.length)];

let totalAttempts = 0;
let correctGuesses = 0;

function replace(id, colour) {
  const path = document.getElementById(id);
  if (path === null) {
    // do nothing
  } else {
    path.style.fill = colour;
  }
}

function handleClick(event) {
  console.log(event.target.id);
  let clickedId = event.target;
  totalAttempts++;
  if (clickedId.id === randomId.id && unsuccessfulTries <= 2) {
    // correct element was clicked
    correctGuesses++;

    displayText();

    if (unsuccessfulTries === 0)
      replace(clickedId.id, "#7ed46b");
    else if (unsuccessfulTries === 1)
      replace(clickedId.id, "#fbfb3f");
    else if (unsuccessfulTries === 2)
      replace(clickedId.id, "#ffa159");
    removeElementFromList(clickedId);
  } else if (availablePaths.includes(clickedId)) {
    // incorrect element was clicked
    unsuccessfulTries++;

    replace(clickedId.id, "#f0f0f0");
    setTimeout(() => replace(clickedId.id, '#c0c0c0'), 125);
    if (unsuccessfulTries >= 3) {
      // 3 unsuccessful tries have been made
      replace(randomId.id, "#b92525");
      removeElementFromList(randomId);
    }

    displayText();

  }
}

function formatTime(minutes, seconds, milliseconds) {
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  const formattedMilliseconds = milliseconds.toString().padStart(3, '0');
  const millisecondsSubstring = formattedMilliseconds.substring(0, 3);
  return `${formattedMinutes}:${formattedSeconds}.${millisecondsSubstring}`;
}

function startTimer() {
  let startTime = Date.now();
  const timer = document.getElementById('timer');

  const timerInterval = setInterval(() => {
    const currentTime = Date.now();
    const elapsedMilliseconds = currentTime - startTime;
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
    const minutesElapsed = Math.floor(elapsedSeconds / 60);
    const secondsElapsed = elapsedSeconds % 60;
    const millisecondsElapsed = elapsedMilliseconds % 1000;

    timer.textContent = 'Time: ' + formatTime(minutesElapsed, secondsElapsed, millisecondsElapsed);

    if (availablePaths.length === 0) {
      clearInterval(timerInterval);
      const score = calculateScore();
      console.log('Score:', score);
      const leaderboardUrl = `/leaderboard?score=${score}`;
      window.location.href = leaderboardUrl;
    }
  }, 1);
}

function removeElementFromList(elementToRemove) {
  // remove the clicked element from the list
  const indexToRemove = availablePaths.indexOf(elementToRemove);
  if (indexToRemove > -1) {
    availablePaths.splice(indexToRemove, 1);
  }
  console.log(availablePaths.length);
  // reset the unsuccessful tries counter
  unsuccessfulTries = 0;
  elementToRemove.removeEventListener('click', handleClick);

  if (availablePaths.length > 0) {
    const style = elementToRemove.getAttribute('style');
    replace(style);
    elementToRemove.setAttribute('style', style);
    // generate a new random element
    randomId = availablePaths[Math.floor(Math.random() * availablePaths.length)];

    const outputName = document.getElementById("id");
    outputName.textContent = randomId.id.toUpperCase();

    displayText();
  }
}

function displayText() {
    const outputTries = document.getElementById("tries");
    outputTries.textContent = "Tries left: " + (3 - unsuccessfulTries);

    const accuracyPercentage = ((correctGuesses / totalAttempts) * 100).toFixed(2);
    const accuracyElement = document.getElementById('accuracy');
    if(correctGuesses !== 0)
      accuracyElement.textContent = `Accuracy: ${accuracyPercentage}%`;
    else
      accuracyElement.textContent = `Accuracy: 0.00%`;

    const currentCounty = document.getElementById('current');
    currentCounty.textContent = 'Current: ' +
        (paths.length - availablePaths.length + 1) + '/' + paths.length;

    const correctCounty = document.getElementById('correct');
    correctCounty.textContent = 'Correct: ' +
        correctGuesses + '/' + paths.length;
}

function calculateScore() {
  const maxScore = 500;
  const accuracyPercentage = (correctGuesses / totalAttempts) * 100;
  const score = Math.round((accuracyPercentage / 100) * maxScore);
  return score;
}

function playGame() {
  availablePaths.forEach(path => {
    path.addEventListener('click', handleClick);
  });

  const outputName = document.getElementById("id");

  outputName.textContent = randomId.id.toUpperCase();

  displayText();

  startTimer();
}

// Call playGame to start the game
playGame();
