import { useCookies } from "react-cookie";
import axios from "axios";
import { TagItem } from "../Tags/TagItem/TagItem";
import { useQuery } from "react-query";
import { HashtagIcon } from "@heroicons/react/24/outline";
const GroupTagList = (props:any) => {
  const [cookies] = useCookies(["logCookie"]);

  const { data: tagList, isSuccess } = useQuery(
    ["tagList"],
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
      suspense: true,
    }
  );
  return (
    <div className="">
      {isSuccess && tagList.length === 0 && (
        <div className="flex flex-col items-center justify-center opacity-75 ">
          <div className="flex items-center justify-center w-20 h-20 rounded-full ">
            <HashtagIcon
              className="w-10 h-10 text-sky-400"
              aria-hidden="true"
            />
          </div>
          <p className="text-base font-bold text-gray-500 ">태그가 없습니다.</p>
        </div>
      )}
      {isSuccess &&
        tagList &&
        tagList.map((tag: any) => (
          <span key={tag.tag_name}>
            <TagItem
              name={tag.tag_name}
              count={tag._count.tag_name}
              id={tag.id}
            />
          </span>
        ))}
    </div>
  );
};

export default GroupTagList;
