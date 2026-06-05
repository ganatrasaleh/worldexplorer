// ✅ **Store all countries data globally**
let countriesData = [];


// ✅ **Function to fetch countries from API**
async function loadCountries() {
  try {
    // ✅ **Fetch data from REST Countries API**
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,capital,currencies,languages,region,flags,population,area,latlng"
    );

    

    // ✅ **Convert response into JSON format**
    let data = await response.json();

    // ✅ **Sort countries alphabetically (A–Z)**
    data.sort((a, b) => a.name.common.localeCompare(b.name.common));

    // ✅ **Save data globally so we can use it later**
    countriesData = data;

    // ✅ **Fill dropdown menu with country names**
    populateDropdown(data);

  } catch (error) {
    // ✅ **Handle errors (important for debugging)**
    console.log("Error loading countries:", error);
  }
}


// ✅ **Function to populate dropdown list**
function populateDropdown(data) {
  const countrySelect = document.getElementById("countrySelect");

  data.forEach((country) => {
    // ✅ **Create <option> element for each country**
    const option = document.createElement("option");

    option.value = country.name.common;      // ✅ **Set value**
    option.textContent = country.name.common; // ✅ **Set visible text**

    // ✅ **Add option into dropdown**
    countrySelect.appendChild(option);
  });
}


// ✅ **Function to display selected country details**
function showCountry() {
  // ✅ **Get selected country name from dropdown**
  const selected = document.getElementById("countrySelect").value;

  // ✅ **Find matching country from stored data**
  const country = countriesData.find(
    (c) => c.name.common === selected
  );

  // ✅ **If no country selected, show alert**
  if (!country) {
    alert("Please select a country");
    return;
  }

  // ✅ ✅ **Display BASIC INFORMATION**

  document.getElementById("countryName").textContent = country.name.common;

  document.getElementById("countryDescription").textContent =
    `This country is located in ${country.region}.`;

  document.getElementById("capital").textContent = country.capital
    ? country.capital[0]
    : "N/A";

  document.getElementById("population").textContent =
    country.population.toLocaleString();

  document.getElementById("continent").textContent = country.region;


  // ✅ ✅ **Display LANGUAGES**
  const languages = country.languages
    ? Object.values(country.languages).join(", ")
    : "N/A";

  document.getElementById("languages").textContent = languages;


  // ✅ ✅ **Display CURRENCY**
  const currency = country.currencies
    ? Object.values(country.currencies)
        .map((c) => `${c.name} (${c.symbol})`)
        .join(", ")
    : "N/A";

  document.getElementById("currency").textContent = currency;


  // ✅ ✅ **Display FLAG IMAGE**
  const flagImg = document.getElementById("flag");

  flagImg.src = country.flags?.png || country.flags?.svg || "";  // ✅ **Set image URL**
  flagImg.alt = `Flag of ${country.name.common}`;                // ✅ **Alt text for accessibility**


  // ✅ ✅ **Display COUNTRY AREA**
  document.getElementById("area").textContent = country.area
    ? country.area.toLocaleString() + " km²"
    : "N/A";


  // ✅ ✅ **Make country info section visible**
  document.getElementById("countryInfo").classList.remove("d-none");
}


// ✅ ✅ **Run the app when page loads**
loadCountries();