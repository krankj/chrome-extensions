import "./App.css";
import QuoteCard from "./QuoteCard";

function App() {
  return (
    <div className="container">
      <div className="app">
        <QuoteCard
          publishedDate="February 12, 2021"
          quoteImage="https://pbs.twimg.com/media/Et_luunVgAM1G_Z.jpg"
        >
          If every day you break one limitation, depending upon how many
          limitations you have, one day you will be liberated
        </QuoteCard>
      </div>
    </div>
  );
}

export default App;
