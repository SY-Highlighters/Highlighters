import {
  StarIcon as StarIconOutLine,
  TrashIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";
export function Delete(props: any) {
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);

  const feedDelHandler = async () => {
    const host_url = `${process.env.REACT_APP_HOST}/api/feed/delete/${props.feedId}`;
    // 서버에 태그 삭제 요청
    await axios.delete(host_url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.logCookie}`,
      },
    });
    window.location.reload();
  };
  const delClickHandler = () => {
    Swal.fire({
      title: "피드를 삭제하시겠습니까?",
      text: "삭제된 피드는 복구할 수 없습니다.",
      icon: "warning",

      showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
      confirmButtonColor: "#d33", // confrim 버튼 색깔 지정
      cancelButtonColor: "#3085d6", // cancel 버튼 색깔 지정
      confirmButtonText: "삭제", // confirm 버튼 텍스트 지정
      cancelButtonText: "취소", // cancel 버튼 텍스트 지정

      reverseButtons: true, // 버튼 순서 거꾸로
    }).then((result) => {
      // 만약 Promise리턴을 받으면,
      if (result.isConfirmed) {
        // 만약 모달창에서 confirm 버튼을 눌렀다면
        feedDelHandler();
      }
    });
  };
  return (
    <TrashIcon
      onClick={delClickHandler}
      className="flex-shrink-0 w-3 h-4 mr-4 text-gray-400 cursor-pointer xl:h-5 xl:w-5 "
    ></TrashIcon>
  );
}
