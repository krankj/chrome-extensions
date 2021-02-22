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
    nFlag < 3;
    nFlag++, sMask += String(nShifted >>> 16), nShifted <<= 1
  );
  console.log("Smask is", sMask);
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
  const [switchPos, setSwitchPos] = useState(4);
  const switchesArr = toggleNext(switchPos);
  const themeOptions = {
    green: switchesArr[0],
    orange: switchesArr[1],
    magenta: switchesArr[2],
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

  const handleNewWordClick = () => {
    setRandomNumber(randomNumberGenerator(DATA_SIZE));
  };

  const takescreenshotAndSave = () => {
    html2canvas(document.querySelector(".card")).then((canvas) => {
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
    console.log("Switch pos is", switchPos);
    console.log("Switches arr is", switchesArr);
    const themeOptions = {
      green: switchesArr[0],
      orange: switchesArr[1],
      magenta: switchesArr[2],
    };
    console.log("Theme options are", themeOptions);

    setTheme(themeOptions);
  }, [switchPos]);

  const handleColorChange = () => {
    if (switchPos === 1) {
      setSwitchPos(4);
    } else {
      setSwitchPos(switchPos >> 1);
    }
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
          <Header getStyle={getStyle} />
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

const Header = ({ getStyle }) => (
  <div className={classNames("header", getStyle("font"))}>
    <p className="heading">New Word Daily</p>
    <p className="date">{date.format(new Date(), "MMM DD, YYYY")}</p>
  </div>
);

export default App;
