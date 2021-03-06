import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import data from "./assets/word-set-magoosh.json";
import date from "date-and-time";
import ordinal from "date-and-time/plugin/ordinal";
import classNames from "classnames";
import html2canvas from "html2canvas";
import Content from "./Content";
import { randomNumberGenerator } from "./utils";

date.plugin(ordinal);
const datePattern = date.compile("DD-MM-YYYY");

const DATA_SIZE = data.length;

function createBinaryString(nMask) {
  // nMask must be between -2147483648 and 2147483647
  if (nMask > 2 ** 31 - 1)
    throw "number too large. number shouldn't be > 2**31-1"; //added
  if (nMask < -1 * 2 ** 31)
    throw "number too far negative, number shouldn't be < 2**31"; //added
  for (
    var nFlag = 0, nShifted = nMask, sMask = "";
    nFlag < 32;
    nFlag++, sMask += String(nShifted >>> 31), nShifted <<= 1
  );
  sMask = sMask.replace(/\B(?=(.{8})+(?!.))/g, " "); // added
  return sMask;
}

function toggleNext(n) {
  return createBinaryString(n)
    .split("")
    .map((x) => +x);
}

function App() {
  const [randomNumber, setRandomNumber] = useState(
    randomNumberGenerator(DATA_SIZE)
  );
  const [dataUrl, setDataUrl] = useState();
  const [fileName, setFileName] = useState(
    `NWD-${date.format(new Date(), datePattern)}.jpg`
  );
  const [switchPos, setSwitchPos] = useState(8);
  const themeOptions = {
    green: 1,
    orange: 0,
    magenta: 0,
    yellow: 0,
  };
  const [theme, setTheme] = useState(themeOptions);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    downloadImage(dataUrl);
  }, [dataUrl]);

  useEffect(() => {
    console.log(randomNumber);
  }, [randomNumber]);

  const handleNewWord = () => {
    setRandomNumber(randomNumberGenerator(DATA_SIZE));
  };

  const takescreenshotAndSave = () => {
    html2canvas(document.querySelector(".card"), {
      onclone: function (clonedDoc) {
        let app = clonedDoc.querySelector(".app");
        let mainContent = clonedDoc.querySelector(".mainContent");
        // let card = clonedDoc.querySelector(".card");
        // let header = clonedDoc.querySelector(".header");
        // let word = clonedDoc.querySelector(".word");
        // let wordDefinition = clonedDoc.querySelector(".wordDefinition");
        // let wordExample = clonedDoc.querySelector(".wordExample");
        mainContent.style.animation = "none";
        // card.style.maxWidth = "900px";
        // card.style.minHeight = "900px";
        // header.style.fontSize = "1.1rem";
        // word.style.fontSize = "6.5rem";
        // wordDefinition.style.fontSize = "2.8rem";
        // wordExample.style.fontSize = "2.1rem";
      },
    }).then((canvas) => {
      setDataUrl(canvas.toDataURL("image/jpeg"));
    });
  };

  const downloadImage = (data) => {
    let a = document.createElement("a");
    a.href = data;
    a.download = fileName;
    a.click();
  };

  useEffect(() => {
    const switchesArr = toggleNext(switchPos);
    let length = switchesArr.length;
    const themeOptions = {
      green: switchesArr[length - 4],
      orange: switchesArr[length - 3],
      magenta: switchesArr[length - 2],
      yellow: switchesArr[length - 1],
    };
    setTheme(themeOptions);
  }, [switchPos]);

  const handleColorChange = () => {
    setSwitchPos((prev) => {
      let newPos = prev >> 1;
      if (newPos === 0) {
        newPos = 8;
      }
      return newPos;
    });
  };

  useEffect(() => {
    function handleKeyUp(e) {
      e.preventDefault(); //prevent space bar from acting as a click on the focued element.
      if (e.key === "r") {
        handleNewWord();
      }
      if (e.key === "t") {
        handleColorChange();
      }
    }
    window.addEventListener("keyup", handleKeyUp);
    return () => window.removeEventListener("keyup", handleKeyUp);
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
    return {
      [`green${style}`]: theme.green,
      [`orange${style}`]: theme.orange,
      [`magenta${style}`]: theme.magenta,
      [`yellow${style}`]: theme.yellow,
    };
  }

  return (
    <div className="container">
      <div className="app">
        <div
          className={classNames("card", getStyle("border"), {
            thickBorder: true,
          })}
        >
          <Header getStyle={getStyle} />
          {/* Key is required to re-mount the component so that the animation is applied */}
          <div key={randomNumber} className="mainContent">
            {data[randomNumber]["back"].map((ele, id) => (
              <Content
                ele={ele}
                id={id}
                randomNumber={randomNumber}
                getStyle={getStyle}
                setFileName={setFileName}
              />
            ))}
          </div>
        </div>
        <div className={classNames("controls", theme)}>
          <button onClick={handleNewWord}>Refresh</button>
          <button onClick={handleColorChange}>Toggle color</button>
          <button onClick={takescreenshotAndSave}>Save word</button>
        </div>
      </div>
    </div>
  );
}

const Header = ({ getStyle }) => (
  <div className={classNames("header", getStyle("font"))}>
    <p className="heading">New Word Daily</p>
    <p className="date">{date.format(new Date(), "MMM DD, YYYY")}</p>
  </div>
);

export default App;
