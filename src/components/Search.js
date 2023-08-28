import React, { useState, useRef, useEffect } from "react";
import ReactSwitch from "react-switch";
import axios from "axios";

const OMDB_API_URL = "http://www.omdbapi.com/";
const OMDB_API_KEY = "8ea4c4c5";

export default function Search(props) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const suggestionsRef = useRef(null);

  const { setTheme, setSearchedShow } = props;

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get(OMDB_API_URL, {
          params: {
            apikey: OMDB_API_KEY,
            s: query,
            type: "series",
          },
        });

        const data = response.data;

        if (data.Search) {
          setSuggestions(
            data.Search.map(
              (item) => `${item.Title} (${item.Year.split("–")[0]})`
            )
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchSuggestions();
  }, [query]);

  const handleSuggestionClick = (item) => {
    setSuggestions([]);
    setSearchedShow(item.split("(")[0]);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setSuggestions([]);
      setSearchedShow(query);
    }
  };

  const handleClickOutside = (event) => {
    if (
      suggestionsRef.current &&
      !suggestionsRef.current.contains(event.target)
    ) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="search">
      <ReactSwitch
        checked={true}
        onChange={toggleTheme}
        className="search__switch"
      />
      <h1 className="search__title">Series Explorer</h1>

      <div className="search__container">
        <div className="search__input-container">
          <input
            type="text"
            className="search__input"
            placeholder="Enter a TV show name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <div className="search__suggestions-box" ref={suggestionsRef}>
            <ul className="search__suggestions">
              {suggestions.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(item)}
                  className="search__suggestion"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <button
            className={
              query.length > 0 ? "search__button" : "search__button-disabled"
            }
            onClick={() => setSearchedShow(query)}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
