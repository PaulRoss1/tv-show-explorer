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
  const [show, setShow] = useState({});
  const [searchedShow, setSearchedShow] = useState([]);

  const searchProps = {
    setTheme,
    setSearchedShow,
  };

  const showInfoProps = {
    show,
  };

  const graphProps = {
    searchedShow,
    show,
    setShow,
  };

  return (
    <div className="App" id={theme}>
      <Search {...searchProps} />
      <ShowInfo {...showInfoProps} />
      <Graph {...graphProps} />
    </div>
  );
}
