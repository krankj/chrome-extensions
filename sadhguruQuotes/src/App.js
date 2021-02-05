import logo from "./logo.svg";
import "./App.css";
import Heading from "./Heading";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Heading />
      </header>
    </div>
  );
}

export default App;
