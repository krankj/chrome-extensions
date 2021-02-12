import "./App.css";
import Heading from "./Quote";
import Sadhguru from "./assets/sadhguru.jpg";

function App() {
  return (
    <div className="container">
      <header className="app">
        <img src={Sadhguru} className="sg-image" alt="Sadhguru" />
        <Heading />
      </header>
    </div>
  );
}

export default App;
