const gifs = [
    "/static/imgs/slithering-borders/Romania-Border.gif",
    "/static/imgs/slithering-borders/France-Border.gif",
    "/static/imgs/slithering-borders/USA-Border.gif"
];

const gifDisplay = document.getElementById("gifDisplay");
const gifDisplay2 = document.getElementById("gifDisplay2");

let currentIndex = 0;

// Function to display the next gif
function displayNextGif() {
  gifDisplay.src = gifs[currentIndex];

  currentIndex = (currentIndex + 1) % gifs.length;

  setTimeout(displayNextGif, 3000); // Switch gif every 3 seconds
}

// Start displaying the gifs
displayNextGif();
