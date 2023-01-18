import { StarIcon } from "@heroicons/react/24/solid";

import axios from "axios";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";
export function UnBookmarked(props: any) {
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);

  // 서버에 북마크 삭제 요청
  async function bookmarkToggleHandler() {
    // console.log(props.bookmarkId);
    const host_url = `${process.env.REACT_APP_HOST}/api/bookmark/delete/${props.bookmarkId.id}`;
    await axios
      .delete(host_url, {
        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${cookies.logCookie}`,
        },
      })
      .then(function (response) {
        props.onFunc();
      });
  }

  return (
    <StarIcon
      onClick={bookmarkToggleHandler}
      className="flex-shrink-0 w-5 h-5 text-yellow-400 cursor-pointer hover:text-yellow-400"
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
