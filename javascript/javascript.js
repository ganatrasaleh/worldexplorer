/**
 * ==========================================
 * **COUNTRY CLASS (OOP)**
 * Represents a country object
 * ==========================================
 */
class Country {
  constructor(name, capital, region, population) {
    this.name = name;
    this.capital = capital;
    this.region = region;
    this.population = population;
  }

  getSummary() {
    return `${this.name} is in ${this.region} and has population ${this.population}`;
  }
}

/**
 * **GLOBAL DATA STORAGE**
 */
let countriesData = [];

/**
 * ==========================================
 * **LOAD COUNTRIES FROM API**
 * ==========================================
 */
async function loadCountries() {
  const select = document.getElementById("countrySelect");

  if (select) {
    select.innerHTML = "<option>Loading countries...</option>";
  }

  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,capital,currencies,languages,region,flags,population,area"
    );

    const data = await response.json();

    // Sort countries alphabetically
    data.sort((a, b) =>
      a.name.common.localeCompare(b.name.common)
    );

    countriesData = data;

    populateDropdown(data);

  } catch (error) {
    console.log("Error loading countries:", error);

    if (select) {
      select.innerHTML = "<option>Error loading countries</option>";
    }
  }
}

/**
 * ==========================================
 * **FILL DROPDOWN WITH COUNTRIES**
 * ==========================================
 */
function populateDropdown(data) {
  const select = document.getElementById("countrySelect");
  if (!select) return;

  select.innerHTML =
    '<option value="" disabled selected>-- Select a country --</option>';

  data.forEach((country) => {
    const option = document.createElement("option");
    option.value = country.name.common;
    option.textContent = country.name.common;
    select.appendChild(option);
  });
}

/**
 * ==========================================
 * **SHOW COUNTRY DETAILS**
 * ==========================================
 */
function showCountry() {
  const selected = document.getElementById("countrySelect")?.value;

  if (selected) {
    localStorage.setItem("selectedCountry", selected);
  }

  const country = countriesData.find(
    (c) => c.name.common === selected
  );

  if (!country) {
    const info = document.getElementById("countryInfo");
    if (info) {
      info.classList.remove("d-none");
      info.innerHTML = `
        <div class="text-center text-danger">
          <h4>Error</h4>
          <p>Please select a country.</p>
        </div>
      `;
    }
    return;
  }

  // ✅ OOP object
  const countryObj = new Country(
    country.name.common,
    country.capital ? country.capital[0] : "N/A",
    country.region,
    country.population
  );

  console.log(countryObj.getSummary());

  // ✅ SAFE DOM updates (NO ERRORS)
  const nameEl = document.getElementById("countryName");
  if (nameEl) nameEl.textContent = country.name.common;

  const descEl = document.getElementById("countryDescription");
  if (descEl)
    descEl.textContent = `This country is located in ${country.region}.`;

  const capEl = document.getElementById("capital");
  if (capEl)
    capEl.textContent = country.capital ? country.capital[0] : "N/A";

  const popEl = document.getElementById("population");
  if (popEl)
    popEl.textContent = country.population.toLocaleString();

  const contEl = document.getElementById("continent");
  if (contEl) contEl.textContent = country.region;

  const languages = country.languages
    ? Object.values(country.languages).join(", ")
    : "N/A";

  const langEl = document.getElementById("languages");
  if (langEl) langEl.textContent = languages;

  const currency = country.currencies
    ? Object.values(country.currencies)
        .map((c) => `${c.name} (${c.symbol})`)
        .join(", ")
    : "N/A";

  const currEl = document.getElementById("currency");
  if (currEl) currEl.textContent = currency;

  const flagImg = document.getElementById("flag");
  if (flagImg) {
    flagImg.src = country.flags?.png || "";
    flagImg.alt = `Flag of ${country.name.common}`;
  }

  const areaEl = document.getElementById("area");
  if (areaEl)
    areaEl.textContent = country.area
      ? country.area.toLocaleString() + " km²"
      : "N/A";

  const info = document.getElementById("countryInfo");
  if (info) info.classList.remove("d-none");
}

/**
 * ==========================================
 * **SEARCH FUNCTION**
 * ==========================================
 */
function filterCountries() {
  const searchValue =
    document.getElementById("searchInput")?.value.toLowerCase() || "";

  const select = document.getElementById("countrySelect");
  if (!select) return;

  select.innerHTML =
    '<option value="" disabled selected>-- Select a country --</option>';

  const filtered = countriesData.filter((country) => {
    const name = country.name.common.toLowerCase();
    const capital = country.capital?.[0]?.toLowerCase() || "";

    return (
      name.includes(searchValue) ||
      capital.includes(searchValue)
    );
  });

  filtered.forEach((country) => {
    const option = document.createElement("option");
    option.value = country.name.common;
    option.textContent = country.name.common;
    select.appendChild(option);
  });

  // ✅ No results message
  if (filtered.length === 0) {
    const option = document.createElement("option");
    option.textContent = "No results found";
    option.disabled = true;
    select.appendChild(option);
  }
}

/**
 * ==========================================
 * **INITIAL LOAD**
 * ==========================================
 */
window.onload = function () {
  loadCountries();

  const saved = localStorage.getItem("selectedCountry");

  if (saved) {
    setTimeout(() => {
      const select = document.getElementById("countrySelect");
      if (select) {
        select.value = saved;
        showCountry();
      }
    }, 500);
  }
};