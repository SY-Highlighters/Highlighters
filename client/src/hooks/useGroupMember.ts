import { useQuery } from "react-query";
import axios from "axios";
import { useCookies } from "react-cookie";

export function useGroupMember() {
  const [cookies] = useCookies(["logCookie"]);

  return useQuery(
    ["groupMember"],
    async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_HOST}/api/group/members`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookies.logCookie}`,
            },
          }
        );
        return res.data.data;
      } catch (err) {
        console.error(err);
      }
    },
    {
      cacheTime: 60 * 60 * 1000,
      staleTime: 2 * 60 * 60 * 1000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: !!cookies.logCookie,
    }
  );
}
