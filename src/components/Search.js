import React, { useState, useRef, useEffect } from "react";
import ReactSwitch from "react-switch";
import axios from "axios";

const OMDB_API_URL = "http://www.omdbapi.com/";
const OMDB_API_KEY = "8ea4c4c5";

export default function Search(props) {
  const suggestionsRef = useRef(null);

  const {
    setTheme,
    query,
    setQuery,
    handleSearch,
    errorInfo,
    suggestions,
    setSuggestions,
    setXxx,
  } = props;

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    // Fetch autocomplete suggestions here based on the current query
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get(OMDB_API_URL, {
          params: {
            apikey: OMDB_API_KEY,
            s: query, // Use 's' parameter to get search suggestions
            type: "series",
          },
        });

        const data = response.data;
        if (data.Search) {
          setSuggestions(data.Search.map((item) => item.Title));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchSuggestions();
  }, [query]); // Run the effect whenever the query changes

  const handleSuggestionClick = (item) => {
    // setQuery(item);
    setXxx(item);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setXxx(query);
      setSuggestions([]);
    }
  };

  const handleClickOutside = (event) => {
    if (
      suggestionsRef.current &&
      !suggestionsRef.current.contains(event.target)
    ) {
      setSuggestions([]); // Hide suggestions when clicking outside the suggestions box
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
      <button className="search__button" onClick={() => setXxx(query)}>
        Search
      </button>
      <span className="search__error">{errorInfo}</span>
    </div>
  );
}
