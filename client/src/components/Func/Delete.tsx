import {
  StarIcon as StarIconOutLine,
  TrashIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useCookies } from "react-cookie";
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
  return (
    <TrashIcon
      onClick={feedDelHandler}
      className="flex-shrink-0 w-3 h-3 mr-3 text-gray-400 cursor-pointer xl:h-5 xl:w-5 "
    ></TrashIcon>
  );
}
