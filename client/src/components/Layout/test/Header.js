import { Fragment } from "react";
import classes from "./Header.module.css"
import mealImage from "../../assets/meals.jpg"
import HeaderCartButton from "./HeaderCartButton";


const Header = (props) => {
    return (
      <Fragment>
        <header className={classes.header}>
          <h1>Highlighters</h1>
          <HeaderCartButton onClick={props.onShowCart} />
        </header>
        <section className={classes.summary}>
          <h2> 검색창</h2>
        </section>
        {/* '-'은 .으로 처리할수없어서 대괄호로 처리함 */}
        <div className={classes[`main-image`]}>
          {/* <img src={mealImage} alt="음식이 한상 차려져 있는 사진" ></img> */}
        </div>
      </Fragment>
    );
};

export default Header;