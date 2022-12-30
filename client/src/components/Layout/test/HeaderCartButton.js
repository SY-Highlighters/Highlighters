import { useContext, useEffect, useState } from "react";
import CartIcon from "../Cart/CartIcon";
import CartContext from "../../states/back/cart-context";
import classes from "./HeaderCartButton.module.css";

const HeaderCartButton = (props) => {
  const cartCtx = useContext(CartContext);
  const [btnIsHighlighted, setBtnIsHighlighted] = useState(false); // 버튼 효과 state
  const { items } = cartCtx; // 컨택스트 객체화
  const numberOfCartItems = items.reduce((curNum, item) => {
    return curNum + item.amount;
  }, 0);
  // 버튼 효과주기
  // useEffect -> items(cartCtx)값이 바뀔때 마다 작동
  useEffect(() => {
    // 장바구니가 비었을때 작동 안함
    if (items.length === 0) {
      return;
    }
    // 버튼 효과주기
    setBtnIsHighlighted(true);
    // 300ms 후에(애니메이션 설정 값) 다시 효과 끄기
    const timer = setTimeout(() => {
      setBtnIsHighlighted(false);
    }, 300);
    // 클린업 함수 -> 빠른 시간에 버튼을 클릭했을때 대처
    return () => {
      clearTimeout(timer);
    };
  }, [items]);
  // state값이 true일때 classes.bump를 넣어준다.
  const btnClasses = `${classes.button} ${
    btnIsHighlighted ? classes.bump : ""
  }`;
  return (
    // <button className={btnClasses} onClick={props.onClick}>
    <button
      className="bg-white-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={props.onClick}
    >
      <span className={classes.icon}></span>
      <span>내 정보</span>
      <span className={classes.badge}> {numberOfCartItems}</span>
    </button>
  );
};

export default HeaderCartButton;
