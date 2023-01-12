import { useEffect, useState } from "react";

export default function ColorButton(props: any) {
  return (
    <button className={props.css}>
      {props.colorName}
    </button>
  );
}

