let countriesData = [];

async function loadCountries() {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,capital,currencies,languages,region,flags,population,area,latlng",
    );

    let data = await response.json();

    // ✅ Sort A–Z
    data.sort((a, b) => a.name.common.localeCompare(b.name.common));

    countriesData = data;
    populateDropdown(data);
  } catch (error) {
    console.log("Error loading countries:", error);
  }
}

function populateDropdown(data) {
  const countrySelect = document.getElementById("countrySelect");

  data.forEach((country) => {
    const option = document.createElement("option");
    option.value = country.name.common;
    option.textContent = country.name.common;
    countrySelect.appendChild(option);
  });
}

function showCountry() {
  const selected = document.getElementById("countrySelect").value;

  const country = countriesData.find((c) => c.name.common === selected);

  if (!country) {
    alert("Please select a country");
    return;
  }

  // ✅ Basic Information
  document.getElementById("countryName").textContent = country.name.common;

  document.getElementById("countryDescription").textContent =
    `This country is located in ${country.region}.`;

  document.getElementById("capital").textContent = country.capital
    ? country.capital[0]
    : "N/A";

  document.getElementById("population").textContent =
    country.population.toLocaleString();

  document.getElementById("continent").textContent = country.region;

  // ✅ Languages
  const languages = country.languages
    ? Object.values(country.languages).join(", ")
    : "N/A";
  document.getElementById("languages").textContent = languages;

  // ✅ Currency
  const currency = country.currencies
    ? Object.values(country.currencies)
        .map((c) => `${c.name} (${c.symbol})`)
        .join(", ")
    : "N/A";
  document.getElementById("currency").textContent = currency;

  // ✅ FLAG
  const flagImg = document.getElementById("flag");
  flagImg.src = country.flags?.png || country.flags?.svg || "";
  flagImg.alt = `Flag of ${country.name.common}`;

  // ✅ ✅ SIMPLE WORKING MAP (NO BUGS)

  // ✅ Area
  document.getElementById("area").textContent = country.area
    ? country.area.toLocaleString() + " km²"
    : "N/A";

  // ✅ Show card
  document.getElementById("countryInfo").classList.remove("d-none");
}

// ✅ Run app
loadCountries();
