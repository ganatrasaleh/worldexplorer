/**
 * ==========================================
 * REST Countries API + Fetch API
 * Emerging Technology Assignment
 * ==========================================
 */

/**
 * ==========================================
 * COUNTRY CLASS (OOP)
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
    return `${this.name} is in ${this.region} and has a population of ${this.population.toLocaleString()}`;
  }
}

/**
 * Global Storage
 */
let countriesData = [];

/**
 * Helper function
 */
function getElement(id) {
  return document.getElementById(id);
}

/**
 * ==========================================
 * Load Countries from API
 * ==========================================
 */
async function loadCountries() {
  const select = getElement("countrySelect");

  if (select) {
    select.innerHTML = "<option>Loading countries...</option>";
  }

  try {
    const response = await fetch(
      "https://api.allorigins.win/raw?url=https://restcountries.com/v3.1/all",
    );

    if (!response.ok) {
      throw new Error("Failed to load country data");
    }

    const data = await response.json();

    console.log("Countries loaded:", data.length);

    // Sort alphabetically
    data.sort((a, b) => a.name.common.localeCompare(b.name.common));

    countriesData = data;

    // Populate dropdown
    if (select) {
      select.innerHTML = `<option value="" disabled selected>
          -- Select a country --
        </option>`;

      data.forEach((country) => {
        const option = document.createElement("option");
        option.value = country.name.common;
        option.textContent = country.name.common;
        select.appendChild(option);
      });
    }
  } catch (error) {
    console.error("API ERROR:", error);

    if (select) {
      select.innerHTML = "<option>Error loading countries</option>";
    }
  }
}

/**
 * ==========================================
 * Display Country Details
 * ==========================================
 */
function showCountry() {
  const selected = getElement("countrySelect")?.value;

  if (!selected) {
    return;
  }

  localStorage.setItem("selectedCountry", selected);

  const country = countriesData.find((c) => c.name.common === selected);

  if (!country) {
    return;
  }

  // Create OOP object
  const countryObj = new Country(
    country.name.common,
    country.capital?.[0] || "N/A",
    country.region,
    country.population,
  );

  console.log(countryObj.getSummary());

  const update = (id, value) => {
    const element = getElement(id);
    if (element) {
      element.textContent = value;
    }
  };

  update("countryName", country.name.common);
  update("countryDescription", `This country is located in ${country.region}.`);

  update("capital", country.capital?.[0] || "N/A");

  update("population", country.population.toLocaleString());

  update("continent", country.region);

  // Languages
  const languages = country.languages
    ? Object.values(country.languages).join(", ")
    : "N/A";

  update("languages", languages);

  // Currency
  const currency = country.currencies
    ? Object.values(country.currencies)
        .map((c) => c.name)
        .join(", ")
    : "N/A";

  update("currency", currency);

  // Area
  update("area", country.area ? `${country.area.toLocaleString()} km²` : "N/A");

  // Flag
  const flag = getElement("flag");

  if (flag) {
    flag.src = country.flags?.png || "";
    flag.alt = `Flag of ${country.name.common}`;
  }

  // Show information card
  const info = getElement("countryInfo");

  if (info) {
    info.classList.remove("d-none");
  }
}

/**
 * ==========================================
 * Search / Filter Countries
 * ==========================================
 */
function filterCountries() {
  if (countriesData.length === 0) {
    return;
  }

  const search = getElement("searchInput")?.value.toLowerCase() || "";

  const select = getElement("countrySelect");

  if (!select) {
    return;
  }

  select.innerHTML = `<option value="" disabled selected>
      -- Select a country --
    </option>`;

  const filtered = countriesData.filter((country) => {
    const name = country.name.common.toLowerCase();

    const capital = country.capital?.[0]?.toLowerCase() || "";

    return name.includes(search) || capital.includes(search);
  });

  filtered.forEach((country) => {
    const option = document.createElement("option");

    option.value = country.name.common;

    option.textContent = country.name.common;

    select.appendChild(option);
  });

  if (filtered.length === 0) {
    const option = document.createElement("option");

    option.textContent = "No results found";

    option.disabled = true;

    select.appendChild(option);
  }
}

/**
 * ==========================================
 * Initial Application Load
 * ==========================================
 */
window.addEventListener("load", async () => {
  await loadCountries();

  const savedCountry = localStorage.getItem("selectedCountry");

  if (savedCountry) {
    const select = getElement("countrySelect");

    if (select) {
      select.value = savedCountry;

      showCountry();
    }
  }
});

/**
 * ==========================================
 * FEEDBACK / CONTACT FORM
 * ==========================================
 */
function submitFeedback() {
  // ✅ Get values from form
  const name = document.getElementById("name")?.value;
  const email = document.getElementById("email")?.value;
  const message = document.getElementById("message")?.value;

  // ✅ Basic validation
  if (!name || !email || !message) {
    alert("Please fill all fields.");
    return;
  }

  // ✅ Create feedback string
  const feedback = `
    Name: ${name}
    Email: ${email}
    Message: ${message}
    ---------------------------
  `;

  // ✅ Store in localStorage (acts like data file)
  let existingData = localStorage.getItem("feedback") || "";
  localStorage.setItem("feedback", existingData + feedback);

  console.log("Saved Feedback:", feedback);

  // ✅ Show success message
  alert("Feedback submitted successfully!");

  // ✅ Clear form
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("message").value = "";
}
