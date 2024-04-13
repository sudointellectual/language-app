import { useEffect, useState } from "react";

import "./App.css";

function App() {
  const [countries, setCountries] = useState("");
  const [languages, setLanguages] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(null);

  useEffect(() => {
    fetchLanguages();
    setFilteredCountries();
  }, []);

  const fetchLanguages = async () => {
    try {
      const response = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,languages",
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        console.log("network response failed");
      }

      const data = await response.json();

      // set our list of countries
      setCountries(data);

      // get a raw list of languages from data
      const langArray = [];
      for (let i = 0; i < data.length; i++) {
        for (const [key, value] of Object.entries(data[i].languages)) {
          langArray.push({ key: key, value: value });
        }
      }

      // now make them unique
      const unique = new Set();
      const uniqueLangs = [];

      langArray.forEach((obj) => {
        const value = obj["value"];
        if (!unique.has(value)) {
          unique.add(value);
          uniqueLangs.push(obj);
        }
      });

      // and finally sort alphabetically by key
      uniqueLangs.sort((a, b) =>
        a.value > b.value ? 1 : b.value > a.value ? -1 : 0,
      );

      setLanguages(uniqueLangs);
    } catch (e) {
      console.log("error: ", e);
    }
  };

  const handleClick = (e) => {
    // toggle button visibility off by default
    const buttons = document.querySelectorAll(".language");
    buttons.forEach((button) => button.classList.remove("active"));

    // set clicked button to active
    e.target.parentElement.classList.toggle("active");

    // get filtered countries and sort them alphabetically
    const country = e.target.value;
    const filteredCountries = countries.filter((item) =>
      Object.keys(item.languages).includes(country),
    );

    filteredCountries.sort((a, b) =>
      a.name.common > b.name.common
        ? 1
        : b.name.common > a.name.common
          ? -1
          : 0,
    );

    setFilteredCountries(filteredCountries);
  };

  return (
    <div className="App">
      <ul className="wrapper">
        {languages &&
          languages.map((language, key) => {
            return (
              <li className="language" key={key}>
                <button
                  key={language.key}
                  value={language.key}
                  onClick={handleClick}
                >
                  {language.value} ({language.key})
                </button>

                <ul className="dropdown">
                  {filteredCountries &&
                    filteredCountries.map((country, key) => (
                      <li key={key}>{country.name.common}</li>
                    ))}
                </ul>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default App;
