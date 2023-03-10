import { useQuery } from "react-query";
import axios from "axios";
import { UserInfo } from "../types/user";
import { useCookies } from "react-cookie";

export function useUserData() {
  const [cookies] = useCookies(["logCookie"]);

  return useQuery<UserInfo>(
    ["user", cookies.logCookie],
    async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_HOST}/api/user/signin`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookies.logCookie}`,
            },
          }
        );

        return res.data;
      } catch (err) {
        console.error(err);
      }
    },
    {
      // 설정 다시 하기
      cacheTime: 60 * 60 * 1000,
      staleTime: 2 * 60 * 60 * 1000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: !!cookies.logCookie,
      suspense: true,
    }
  );
}
