import React, { useState } from "react";
import "./App.css";
import data from "./assets/word-set-magoosh.json";
import date from "date-and-time";
import ordinal from "date-and-time/plugin/ordinal";
import classNames from "classnames";

date.plugin(ordinal);
const DATA_SIZE = data.length;

function randomNumberGenerator(max) {
  return Math.floor(Math.random() * max);
}

function App() {
  const [randomNumber, setRandomNumber] = useState(
    randomNumberGenerator(DATA_SIZE)
  );

  const themeOptions = { green: true, orange: false };

  const [theme, setTheme] = useState(themeOptions);

  const handleNewWordClick = () => {
    setRandomNumber(randomNumberGenerator(DATA_SIZE));
  };

  const handleColorChange = () => {
    setTheme({ orange: true, green: false });
  };

  React.useEffect(() => {
    function handleSpaceKey(e) {
      if (e.key === " ") {
        setRandomNumber(randomNumberGenerator(DATA_SIZE));
      }
    }
    window.addEventListener("keyup", handleSpaceKey);
    return () => window.removeEventListener("keyup", handleSpaceKey);
  }, []);

  console.log(randomNumber);

  return (
    <div className="container">
      <div className="app">
        <button onClick={handleColorChange}>Change color</button>
        <div className={classNames("card", theme, { border: true })}>
          <div className="header">
            <p className="heading">New Word Daily</p>
            <p className="date">{date.format(new Date(), "MMM DD, YYYY")}</p>
          </div>
          <div key={randomNumber} className="mainContent">
            {data[randomNumber]["back"].map((ele, id) => (
              <div key={`${id}-${randomNumber}`}>
                {ele.type === "word" && <h1 className="word">{ele.content}</h1>}
                {ele.type === "text" && (
                  <p
                    dangerouslySetInnerHTML={{
                      __html: ele.content,
                      color: "red",
                    }}
                    className="wordDefinition"
                  />
                )}
                {ele.type === "example" && (
                  <p
                    dangerouslySetInnerHTML={{ __html: ele.content }}
                    className="wordExample"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <button className="newWordButton" onClick={handleNewWordClick}>
          Refresh
        </button>
      </div>
    </div>
  );
}

export default App;
