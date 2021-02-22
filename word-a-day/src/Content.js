import React from "react";
import classNames from "classnames";

const Content = ({ ele, id, randomNumber, getStyle, setFileName }) => (
  <div key={`${id}-${randomNumber}`}>
    {ele.type === "word" && (
      <>
        {setFileName(`${ele.content}.jpg`)}
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

export default Content;
