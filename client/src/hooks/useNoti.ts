import { useInfiniteQuery } from "react-query";
import axios from "axios";
import { useCookies } from "react-cookie";
import { testNoti } from "../atoms/atom";
import { useRecoilState } from "recoil";
export const useNoti = () => {
  const [cookies] = useCookies(["logCookie"]);
  const [testNt, setTestNoti] = useRecoilState(testNoti);
  const getPageBoard = async ({ pageParam = 1 }) => {
    const res = await axios({
      method: "get",
      url: `${
        process.env.REACT_APP_HOST
      }/api/noti/web?page=${pageParam}&take=${3}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.logCookie}`,
      },
    });

    // setTestNoti((pre: any) => [...pre, res.data]);
    // console.log("testNt", testNt);
    return {
      // 실제 데이터
      board_page: res.data,
      // 반환 값에 현재 페이지를 넘겨주자
      current_page: pageParam,
      // 페이지가 마지막인지 알려주는 서버에서 넘겨준 true/false 값
      isLast: pageParam === res.data.totalPage,
    };
  };

  const {
    data: getBoard,
    fetchNextPage: getNextPage,
    isSuccess: getBoardIsSuccess,
    hasNextPage: getNextPageIsPossible,
    status: status,
  } = useInfiniteQuery(["Noti"], getPageBoard, {
    getNextPageParam: (lastPage, pages) => {
      // lastPage와 pages는 콜백함수에서 리턴한 값을 의미한다!!
      // lastPage: 직전에 반환된 리턴값, pages: 여태 받아온 전체 페이지
      if (!lastPage.isLast) return lastPage.current_page + 1;
      // 마지막 페이지면 undefined가 리턴되어서 hasNextPage는 false가 됨!
      return undefined;
    },
    onSuccess: (data) => {
      // console.log("data!!!!", data);
      // let newNotifications = testNt;
      // data.pages.forEach((pageData: any) => {
      //   newNotifications = [
      //     ...newNotifications,
      //     ...pageData.board_page.data.data,
      //   ];
      // });

      setTestNoti(data);
      // console.log("testNt", testNt);
    },
  });

  return {
    getBoard,
    getNextPage,
    getBoardIsSuccess,
    getNextPageIsPossible,
    status,
  };
};
