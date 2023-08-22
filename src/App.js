import "./App.css";
import "./themes/light-theme.css";
import "./themes/dark-theme.css";
import Search from "./components/Search";
import ShowInfo from "./components/ShowInfo";
import Graph from "./components/Graph";

export default function App() {
  return (
    <div className="App">
      <Search />
      <ShowInfo />
      <Graph />
    </div>
  );
}
