import "./App.css";
import Quote from "./Quote";
import SadhguruDefaultImage from "./assets/sadhguru.jpg";

function App() {
  return (
    <div className="container">
      <div className="app">
        <p style={{ fontFamily: "Sadhguru Thin", fontSize: "1.2rem" }}>
          February 12, 2021
        </p>
        <img
          src="https://pbs.twimg.com/media/Es-gepHVcAAwUvE.jpg"
          className="sg-image"
          alt="Sadhguru"
          onError={(e) => {
            e.target.src = SadhguruDefaultImage;
          }}
        />
        <Quote />
      </div>
    </div>
  );
}

export default App;
