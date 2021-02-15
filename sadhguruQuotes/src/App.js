import "./App.css";
import QuoteCard from "./QuoteCard";

function App() {
  return (
    <div className="container">
      <div className="app">
        <QuoteCard
          publishedDate="February 15, 2021"
          quoteImage="https://pbs.twimg.com/media/EuEvVcWUcAAwO2W.jpg"
        >
          A seeker means someone who has not made any conclusions about
          anything.
        </QuoteCard>
      </div>
    </div>
  );
}

export default App;
