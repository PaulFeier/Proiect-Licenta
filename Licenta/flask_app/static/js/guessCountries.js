let unsuccessfulTries = 0;

const paths = [...document.querySelectorAll('path')]
const availablePaths = [...paths];  // 2nd array so that I won't remove the elements from the 1st one;

let randomId = availablePaths[Math.floor(Math.random() * availablePaths.length)];

function replace(id, colour) {
  const path = document.getElementById(id);
  if (path === null) {
    console.log('Element not found.');
  } else {
    path.style.fill = colour;
  }
}

function handleClick(event) {
  console.log(event.target.id);
  let clickedId = event.target;



  if (clickedId.id === randomId.id && unsuccessfulTries <= 2) {
    // correct element was clicked
    if (unsuccessfulTries === 0)
      replace(clickedId.id, "#7ed46b");
    else if (unsuccessfulTries === 1)
      replace(clickedId.id, "#fbfb3f");
    else if (unsuccessfulTries === 2)
      replace(clickedId.id, "#ffa159")
    removeElementFromList(clickedId);
  } else if (availablePaths.includes(clickedId)){
    // incorrect element was clicked
    unsuccessfulTries++;

    replace(clickedId.id, "#f0f0f0");
    setTimeout(() => replace(clickedId.id, '#c0c0c0'), 125);
    if (unsuccessfulTries >= 3) {
      // 3 unsuccessful tries have been made
      replace(randomId.id, "#b92525");
      removeElementFromList(randomId);
    }

    var outputTries = document.getElementById("tries");
    outputTries.textContent = "Tries left: " + (3 - unsuccessfulTries);
  }
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

  const style = elementToRemove.getAttribute('style');
  replace(style);
  elementToRemove.setAttribute('style', style);
  // generate a new random element
  randomId = availablePaths[Math.floor(Math.random() * availablePaths.length)];
  console.log("*:", randomId.id.toUpperCase());

  var outputName = document.getElementById("id");
  outputName.textContent = randomId.id.toUpperCase();

 var outputTries = document.getElementById("tries");
  outputTries.textContent = "Tries left: " + (3 - unsuccessfulTries);

  // check if game is over
  if (availablePaths.length === 0) {
    alert('Congratulations, you won!');
  }
}

function playGame() {
  availablePaths.forEach(path => {
    path.addEventListener('click', handleClick);
  });

  console.log("*: ", randomId.id);

  var outputName = document.getElementById("id");
  var outputTries = document.getElementById("tries");

  outputName.textContent = randomId.id.toUpperCase();
  outputTries.textContent = "Tries left: " + (3 - unsuccessfulTries);
  console.log(availablePaths.length);
}

// call playGame to start the game
playGame();
