import React, { createRef, useEffect, useRef, useState } from "react";
import "./App.css";
import data from "./assets/word-set-magoosh.json";
import date from "date-and-time";
import ordinal from "date-and-time/plugin/ordinal";
import classNames from "classnames";
import html2canvas from "html2canvas";

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

  const [dataUrl, setDataUrl] = useState();
  const [fileName, setFileName] = useState("word-a-day.jpeg");
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    downloadImage(dataUrl);
  }, [dataUrl, fileName]);

  const takescreenshotAndSave = () => {
    html2canvas(document.querySelector(".card")).then((canvas) => {
      setDataUrl(canvas.toDataURL("image/jpeg"));
    });
  };

  function downloadImage(data) {
    let a = document.createElement("a");
    a.href = data;
    a.download = fileName;
    a.click();
  }

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

  const capitalize = (word) => {
    if (typeof word !== "string") return "";
    return word.charAt(0).toUpperCase() + word.slice(1);

    //or
    // let wordArr = word.split("");
    // wordArr[0] = wordArr[0].toUpperCase();
    // word = wordArr.join("");
  };

  function getStyle(style) {
    style = capitalize(style);
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
              <Content
                ele={ele}
                id={id}
                randomNumber={randomNumber}
                getStyle={getStyle}
              />
            ))}
          </div>
        </div>
        <div className={classNames("controls", theme)}>
          <button className="newWordButton" onClick={handleNewWordClick}>
            Refresh
          </button>
          <button onClick={handleColorChange}>Toggle color</button>
          <button onClick={takescreenshotAndSave}>Save word</button>
        </div>
      </div>
    </div>
  );
}

const Content = ({ ele, id, randomNumber, getStyle }) => (
  <div key={`${id}-${randomNumber}`}>
    {ele.type === "word" && (
      <>
        <h1 className="word">{ele.content}</h1>
      </>
    )}
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
);

export default App;
