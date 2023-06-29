const flagFilenames = [
  "Flag of Afghanistan.gif",
  "Flag of Albania.gif",
  "Flag of Algeria.gif",
  "Flag of Andorra.gif",
  "Flag of Angola.gif",
  "Flag of Antigua and Barbuda.gif",
  "Flag of Argentina.gif",
  "Flag of Armenia.gif",
  "Flag of Australia.gif",
  "Flag of Austria.gif",
  "Flag of Azerbaijan.gif",
  "Flag of Bahamas.gif",
  "Flag of Bahrain.gif",
  "Flag of Bangladesh.gif",
  "Flag of Barbados.gif",
  "Flag of Belarus.gif",
  "Flag of Belgium.gif",
  "Flag of Belize.gif",
  "Flag of Benin.gif",
  "Flag of Bhutan.gif",
  "Flag of Bolivia.gif",
  "Flag of Bosnia and Herzegovina.gif",
  "Flag of Botswana.gif",
  "Flag of Brazil.gif",
  "Flag of Brunei.gif",
  "Flag of Bulgaria.gif",
  "Flag of Burkina Faso.gif",
  "Flag of Burundi.gif",
  "Flag of Cabo Verde.gif",
  "Flag of Cambodia.gif",
  "Flag of Cameroon.gif",
  "Flag of Canada.gif",
  "Flag of Central African Republic.gif",
  "Flag of Chad.gif",
  "Flag of Chile.gif",
  "Flag of China.gif",
  "Flag of Colombia.gif",
  "Flag of Comoros.gif",
  "Flag of Congo (Brazzaville).gif",
  "Flag of Congo (Kinshasa).gif",
  "Flag of Costa Rica.gif",
  "Flag of Croatia.gif",
  "Flag of Cuba.gif",
  "Flag of Cyprus.gif",
  "Flag of Czech Republic.gif",
  "Flag of Côte d'Ivoire.gif",
  "Flag of Denmark.gif",
  "Flag of Djibouti.gif",
  "Flag of Dominica.gif",
  "Flag of Dominican Republic.gif",
  "Flag of Ecuador.gif",
  "Flag of Egypt.gif",
  "Flag of El Salvador.gif",
  "Flag of Equatorial Guinea.gif",
  "Flag of Eritrea.gif",
  "Flag of Estonia.gif",
  "Flag of Eswatini.gif",
  "Flag of Ethiopia.gif",
  "Flag of Fiji.gif",
  "Flag of Finland.gif",
  "Flag of France.gif",
  "Flag of Gabon.gif",
  "Flag of Gambia.gif",
  "Flag of Georgia.gif",
  "Flag of Germany.gif",
  "Flag of Ghana.gif",
  "Flag of Greece.gif",
  "Flag of Grenada.gif",
  "Flag of Guatemala.gif",
  "Flag of Guinea.gif",
  "Flag of Guinea-Bissau.gif",
  "Flag of Guyana.gif",
  "Flag of Haiti.gif",
  "Flag of Honduras.gif",
  "Flag of Hungary.gif",
  "Flag of Iceland.gif",
  "Flag of India.gif",
  "Flag of Indonesia.gif",
  "Flag of Iran.gif",
  "Flag of Iraq.gif",
  "Flag of Ireland.gif",
  "Flag of Israel.gif",
  "Flag of Italy.gif",
  "Flag of Jamaica.gif",
  "Flag of Japan.gif",
  "Flag of Jordan.gif",
  "Flag of Kazakhstan.gif",
  "Flag of Kenya.gif",
  "Flag of Kiribati.gif",
  "Flag of Korea, North.gif",
  "Flag of Korea, South.gif",
  "Flag of Kuwait.gif",
  "Flag of Kyrgyzstan.gif",
  "Flag of Laos.gif",
  "Flag of Latvia.gif",
  "Flag of Lebanon.gif",
  "Flag of Lesotho.gif",
  "Flag of Liberia.gif",
  "Flag of Libya.gif",
  "Flag of Liechtenstein.gif",
  "Flag of Lithuania.gif",
  "Flag of Luxembourg.gif",
  "Flag of Madagascar.gif",
  "Flag of Malawi.gif",
  "Flag of Malaysia.gif",
  "Flag of Maldives.gif",
  "Flag of Mali.gif",
  "Flag of Malta.gif",
  "Flag of Marshall Islands.gif",
  "Flag of Mauritania.gif",
  "Flag of Mauritius.gif",
  "Flag of Mexico.gif",
  "Flag of Micronesia.gif",
  "Flag of Moldova.gif",
  "Flag of Monaco.gif",
  "Flag of Mongolia.gif",
  "Flag of Montenegro.gif",
  "Flag of Morocco.gif",
  "Flag of Mozambique.gif",
  "Flag of Myanmar.gif",
  "Flag of Namibia.gif",
  "Flag of Nauru.gif",
  "Flag of Nepal.gif",
  "Flag of Netherlands.gif",
  "Flag of New Zealand.gif",
  "Flag of Nicaragua.gif",
  "Flag of Niger.gif",
  "Flag of Nigeria.gif",
  "Flag of North Macedonia.gif",
  "Flag of Norway.gif",
  "Flag of Oman.gif",
  "Flag of Pakistan.gif",
  "Flag of Palau.gif",
  "Flag of Panama.gif",
  "Flag of Papua New Guinea.gif",
  "Flag of Paraguay.gif",
  "Flag of Peru.gif",
  "Flag of Philippines.gif",
  "Flag of Poland.gif",
  "Flag of Portugal.gif",
  "Flag of Qatar.gif",
  "Flag of Romania.gif",
  "Flag of Russia.gif",
  "Flag of Rwanda.gif",
  "Flag of Saint Kitts and Nevis.gif",
  "Flag of Saint Lucia.gif",
  "Flag of Saint Vincent and the Grenadines.gif",
  "Flag of Samoa.gif",
  "Flag of San Marino.gif",
  "Flag of Sao Tome and Principe.gif",
  "Flag of Saudi Arabia.gif",
  "Flag of Senegal.gif",
  "Flag of Serbia.gif",
  "Flag of Seychelles.gif",
  "Flag of Sierra Leone.gif",
  "Flag of Singapore.gif",
  "Flag of Slovakia.gif",
  "Flag of Slovenia.gif",
  "Flag of Solomon Islands.gif",
  "Flag of Somalia.gif",
  "Flag of South Africa.gif",
  "Flag of South Sudan.gif",
  "Flag of Spain.gif",
  "Flag of Sri Lanka.gif",
  "Flag of Sudan.gif",
  "Flag of Suriname.gif",
  "Flag of Sweden.gif",
  "Flag of Switzerland.gif",
  "Flag of Syria.gif",
  "Flag of Taiwan.gif",
  "Flag of Tajikistan.gif",
  "Flag of Tanzania.gif",
  "Flag of Thailand.gif",
  "Flag of Timor-Leste.gif",
  "Flag of Togo.gif",
  "Flag of Tonga.gif",
  "Flag of Trinidad and Tobago.gif",
  "Flag of Tunisia.gif",
  "Flag of Turkey.gif",
  "Flag of Turkmenistan.gif",
  "Flag of Tuvalu.gif",
  "Flag of Uganda.gif",
  "Flag of Ukraine.gif",
  "Flag of United Arab Emirates.gif",
  "Flag of United Kingdom.gif",
  "Flag of United States.gif",
  "Flag of Uruguay.gif",
  "Flag of Uzbekistan.gif",
  "Flag of Vanuatu.gif",
  "Flag of Vatican City.gif",
  "Flag of Venezuela.gif",
  "Flag of Vietnam.gif",
  "Flag of Yemen.gif",
  "Flag of Zambia.gif",
  "Flag of Zimbabwe.gif",
];

let correctCount = 0;
let totalAttempts = -1;
let numOfFlags = 0;

// Start the game with the desired number of flags
function startGame() {
  const flagsInput = document.getElementById("num-of-flags").value;
  numOfFlags = parseInt(flagsInput);

  if (isNaN(numOfFlags) || numOfFlags <= 0) {
    alert("Please enter a valid number of flags.");
    return;
  }

  displayRandomFlag();
}

// Function to display a random flag
function displayRandomFlag() {
  totalAttempts++;
  const flagContainer = document.getElementById("flag-container");
  flagContainer.innerHTML = "";

  // Check if all flags have been shown
  if (totalAttempts === numOfFlags) {
    alert(`Game over! You answered ${correctCount} out of ${numOfFlags} correctly.`);
    return;
  }

  // Get a random flag index
  const randomIndex = Math.floor(Math.random() * flagFilenames.length);
  const flagFilename = flagFilenames[randomIndex];
  const countryName = flagFilename.replace("Flag of ", "").split(".")[0];

  // Display the flag
  const flagImage = document.createElement("img");
  flagImage.src = "/static/imgs/flags/" + flagFilename; // Replace with the correct path to your flag images
  flagContainer.appendChild(flagImage);

  // Display the options for the flag
  const optionsContainer = document.createElement("div");

  // Generate random incorrect options
  const incorrectOptions = [];
  while (incorrectOptions.length < 3) {
    const randomIndex = Math.floor(Math.random() * flagFilenames.length);
    const incorrectCountryName = flagFilenames[randomIndex]
      .replace("Flag of ", "")
      .split(".")[0];
    if (
      incorrectCountryName !== countryName &&
      !incorrectOptions.includes(incorrectCountryName)
    ) {
      incorrectOptions.push(incorrectCountryName);
    }
  }

  // Shuffle options (correct and incorrect)
  const options = [countryName, ...incorrectOptions];
  options.sort(() => Math.random() - 0.5);

  // Create option buttons
  options.forEach((option) => {
    const optionButton = document.createElement("button");
    optionButton.textContent = option;
    optionButton.addEventListener("click", () => checkAnswer(option, countryName));
    optionsContainer.appendChild(optionButton);
  });

  flagContainer.appendChild(optionsContainer);
}

// Function to check the selected answer
function checkAnswer(selectedOption, correctOption) {
  if (selectedOption === correctOption)
    correctCount++;

  displayRandomFlag();
}

startGame();