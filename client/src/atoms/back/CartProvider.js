import { useReducer } from "react";
import CartContext from "./cart-context";
const defaultCartState = {
  items: [],
  totalAmount: 0,
};
const cartReducer = (state, action) => {
  if (action.type === "ADD") {
    const updatedTotalAmount =
      state.totalAmount + action.item.price * action.item.amount;
    // 같은 id 의 음식(같은 음식)이 있을때 인덱스를 가져옴
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );
    // 만약 같은 음식이 있으면 데이터가 생김(True)
    const existingCartItem = state.items[existingCartItemIndex];
    let updatedItems; // 장바구니에 추가된 음식 리스트 지역 변수 선언
    // 같은 음식이 있을때
    if (existingCartItem) {
      // 같은 음식에 수량만 변화를 줌.
      const updatedItem = {
        ...existingCartItem,
        amount: existingCartItem.amount + action.item.amount,
      };
      // 장바구니 음식 리스트에 현재값 넣어줌.
      updatedItems = [...state.items];
      // 중복 음식 인덱스에 적용
      updatedItems[existingCartItemIndex] = updatedItem;
      //  같은 음식이 아니라면 추가 action -> state
      // concat은 인자로 주어진 배열이나 값들을 기존 배열에 합쳐서 새 배열을 반환합니다.
      // 기존배열을 변경하지않음
    } else {
      updatedItems = state.items.concat(action.item);
    }
    // 음식 리스트와 총 가격 보내줌.
    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }

  if (action.type === "REMOVE") {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );
    const existingItem = state.items[existingCartItemIndex];
    const updatedTotalAmount = state.totalAmount - existingItem.price;
    let updatedItems;
    // 남은 음식수가 1일때 리스트에서 삭제
    if (existingItem.amount === 1) {
      updatedItems = state.items.filter((item) => item.id !== action.id);
    }
    // 음식수 -1
    else {
      const updatedItem = { ...existingItem, amount: existingItem.amount - 1 };
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    }

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }
  return defaultCartState;
};
const CartProvier = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );
  const addItemToCartHandler = (item) => {
    dispatchCartAction({ type: "ADD", item: item });
  };
  const removeItemToCartHandler = (id) => {
    dispatchCartAction({ type: "REMOVE", id: id });
  };
  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemToCartHandler,
  };
  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvier;
