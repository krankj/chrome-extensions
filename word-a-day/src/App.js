import React, { useState, useEffect } from "react";
import "./App.css";
import data from "./assets/word-set-magoosh.json";

const DATA_SIZE = data.length;

function randomNumberGenerator(max) {
  return Math.floor(Math.random() * max);
}

function App() {
  const [randomNumber, setRandomNumber] = useState(
    randomNumberGenerator(DATA_SIZE)
  );

  const handleNewWordClick = () => {
    setRandomNumber(randomNumberGenerator(DATA_SIZE));
  };

  React.useEffect(() => {
    function handleSpaceKey(e) {
      if (e.key === " ") {
        setRandomNumber(randomNumberGenerator(DATA_SIZE));
      }
    }
    window.addEventListener("keypress", handleSpaceKey);
    return () => window.removeEventListener("keypress", handleSpaceKey);
  }, []);

  return (
    <div className="container">
      <div className="app">
        {data[randomNumber]["back"].map((ele) => (
          <div>
            {ele.type === "word" && <h1 className="word">{ele.content}</h1>}
            {ele.type === "text" && (
              <p
                dangerouslySetInnerHTML={{ __html: ele.content }}
                className="text"
              />
            )}
            {ele.type === "example" && (
              <p
                dangerouslySetInnerHTML={{ __html: ele.content }}
                className="example"
              />
            )}
          </div>
        ))}

        <button className="newWordButton" onClick={handleNewWordClick}>
          Refresh
        </button>
        <input
          type="hidden"
          onKeyPress={(e) => {
            if (e.key === " ") {
              handleNewWordClick();
            }
          }}
        />
      </div>
    </div>
  );
}

export default App;
