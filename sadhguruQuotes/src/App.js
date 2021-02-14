import "./App.css";
import QuoteCard from "./QuoteCard";

function App() {
  return (
    <div className="container">
      <div className="app">
        <QuoteCard
          publishedDate="February 14, 2021"
          quoteImage="https://pbs.twimg.com/media/EuJ5HQRU4AAttxG.jpg"
        >
          Love is not about somebody. Love is not some kind of act. Love is the
          way you are.
        </QuoteCard>
      </div>
    </div>
  );
}

export default App;
