import React, { useState } from "react";
import "./App.css";
import data from "./assets/word-set-magoosh.json";
import date from "date-and-time";
import ordinal from "date-and-time/plugin/ordinal";
import classNames from "classnames";

date.plugin(ordinal);
const DATA_SIZE = data.length;

function randomNumberGenerator(max) {
  //return 856;
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
    setTheme({ orange: !theme.orange, green: !theme.green });
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

  function getStyle(style) {
    let styleArr = style.split("");
    styleArr[0] = styleArr[0].toUpperCase();
    style = styleArr.join("");
    return { [`green${style}`]: theme.green, [`orange${style}`]: theme.orange };
  }

  console.log(randomNumber);

  return (
    <div className="container">
      <div className="app">
        <div
          className={classNames("card", getStyle("border"), {
            thickBorder: true,
          })}
        >
          <div className={classNames("header", getStyle("font"))}>
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
                      __html: ele.content.replace(
                        "<strong>",
                        `<strong class=${classNames(getStyle("font"))}>`
                      ),
                    }}
                    className="wordDefinition"
                  />
                )}
                {ele.type === "example" && (
                  <p
                    dangerouslySetInnerHTML={{
                      __html: ele.content.replace(
                        "<strong>",
                        `<strong class=${classNames(getStyle("font"))}>`
                      ),
                    }}
                    className="wordExample"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className={classNames("controls", theme)}>
          <button className="newWordButton" onClick={handleNewWordClick}>
            Refresh
          </button>
          <button onClick={handleColorChange}>Change color</button>
        </div>
      </div>
    </div>
  );
}

export default App;
