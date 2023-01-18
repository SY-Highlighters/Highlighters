import axios from "axios";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";
import { StarIcon } from "@heroicons/react/24/outline";

export function Bookmarked(props: any) {
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);

  async function bookmarkToggleHandler() {
    //인풋 안에 값 비우기

    const host_url = `${process.env.REACT_APP_HOST}/api/bookmark/create`;
    // 서버에 그룹 생성 요청
    await axios
      .post(
        host_url,
        {
          feed_id: props.feedId,
        },
        {
          headers: {
            Authorization: `Bearer ${cookies.logCookie}`,
          },
        }
      )
      .then(function (response) {
        props.onFunc();
      });
  }

  return (
    <StarIcon
      onClick={bookmarkToggleHandler}
      className="flex-shrink-0 w-5 h-5 text-black cursor-pointer hover:text-gray-600"
      aria-hidden="true"
    />
  );
}

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 1000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});
