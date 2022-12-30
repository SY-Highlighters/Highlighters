import React from "react";
import classes from "./Input.module.css";

const Input = React.forwardRef((props, ref) => {
  return (
    <div className={classes.input}>
      <label htmlFor={props.input.id}>{props.label}</label>
      {/* 키를 spread 연산자로 p설정값을 받음 */}
      {/*ex -> id: '', type: '', .....  */}
      <input ref={ref} {...props.input} />
    </div>
  );
});

export default Input;
