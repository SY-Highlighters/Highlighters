import axios from "axios";
import { useCookies } from "react-cookie";

export function useGetThree(url: any) {
  const [cookies] = useCookies(["logCookie"]);

  return axios({
    method: "post",
    url: `${process.env.REACT_APP_HOST}/api/summary`,
    data: {
      url: url,
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookies.logCookie}`,
    },
  });
}
