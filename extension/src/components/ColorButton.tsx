import { useEffect, useState } from "react";

export default function ColorButton(props: any) {
  async function colorButtonHandler() {
    const setColor = props.color;
    await chrome.storage.sync.set({ highlightColor: setColor });
    console.log("색 저장:", setColor);
  }

  return (
    <button onClick={colorButtonHandler} className={props.css}>
      {props.colorName}
    </button>
  );
}
