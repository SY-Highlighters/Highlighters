import MealItem from "../FeedItem/MealItem";
import Card from "../../UI/back/Card";
import classes from "./AvailableMeals.module.css";

const DUMMY_MEALS = [
  {
    id: "m1",
    name: "글이름 1",
    description: "하이라이팅 효과",
    price: 25000,
  },
  {
    id: "m2",
    name: "글이름 2",
    description: "하이라이팅 효과",
    price: 16000,
  },
  {
    id: "m3",
    name: "글이름 3",
    description: "하이라이팅 효과",
    price: 12900,
  },
  {
    id: "m4",
    name: "글이름 4",
    description: "하이라이팅 효과",
    price: 18900,
  },
];

const AvailableMeals = () => {
  const mealsList = DUMMY_MEALS.map((meal) => (
    <MealItem
      id={meal.id}
      key={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));
  return (
    <section className={classes.meals}>
      <Card>
        <ul>{mealsList}</ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;
