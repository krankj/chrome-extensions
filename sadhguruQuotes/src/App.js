import logo from "./logo.svg";
import "./App.css";
import Heading from "./Heading";
import Sadhguru from "./assets/sadhguru.jpg";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={Sadhguru} className="App-logo" alt="logo" />
        <Heading />
      </header>
    </div>
  );
}

export default App;
