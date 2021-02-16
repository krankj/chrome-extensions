import "./App.css";
import QuoteCard from "./QuoteCard";

function App() {
  return (
    <div className="container">
      <div className="app">
        <QuoteCard
          publishedDate="February 15, 2021"
          quoteImage="https://pbs.twimg.com/media/EuRv26-VIAknMkK.jpg"
        >
          This body is made of five fundamental elements – earth, water, fire,
          air, and space. The quality of your life essentially depends on how
          wonderful these five elements are within you.
        </QuoteCard>
      </div>
    </div>
  );
}

export default App;
