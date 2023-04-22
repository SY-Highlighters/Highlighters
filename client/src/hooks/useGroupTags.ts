import { useQuery } from "react-query";
import axios from "axios";
import { useCookies } from "react-cookie";

export const useGroupTags = () => {
  const [cookies] = useCookies(["logCookie"]);

  const {
    data: groupTags,
    isSuccess,
    refetch,
  } = useQuery(
    ["groupTags"],
    async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_HOST}/api/tag/web`,
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
      staleTime: 0,
      suspense: true,
    }
  );

  return {
    groupTags,
    isSuccess,
    refetch,
  };
};
