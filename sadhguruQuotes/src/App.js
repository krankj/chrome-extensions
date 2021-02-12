import "./App.css";
import Quote from "./Quote";
import Sadhguru from "./assets/sadhguru.jpg";

function App() {
  return (
    <div className="container">
      <header className="app">
        <img src={Sadhguru} className="sg-image" alt="Sadhguru" />
        <Quote />
      </header>
    </div>
  );
}

export default App;
