import React, { useState } from "react";
import "./App.scss";
import "./themes/light-theme.scss";
import "./themes/dark-theme.scss";
import Search from "./components/Search";
import ShowInfo from "./components/ShowInfo";
import Graph from "./components/Graph";
import axios from "axios";

export default function App() {
  const [theme, setTheme] = useState("dark");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [show, setShow] = useState({});

  const [xxx, setXxx] = useState([]);

  const searchProps = {
    setTheme,
    query,
    setQuery,
    errorInfo,
    suggestions,
    setSuggestions,
    setXxx,
  };

  const showInfoProps = {
    isLoading,
    show,
  };

  const graphProps = {
    setIsLoading,
    setErrorInfo,
    xxx,
    setSuggestions,
    show,
    setShow,
    theme,
  };

  return (
    <div className="App" id={theme}>
      <Search {...searchProps} />
      <ShowInfo {...showInfoProps} />
      <Graph {...graphProps} />
    </div>
  );
}
