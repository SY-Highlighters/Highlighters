import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import { TableHTMLAttributes, useEffect, useState } from "react";
import { TagItem } from "../components/TagItem";
import { useSetRecoilState, useRecoilState } from "recoil";
import { tagsInFeedState } from "../states/atom";
import TagData from "../models/tag";

export default function CreateFeed(this: any) {
  const [groupTags, setGroupTags] = useState<TagData[]>([]);
  const [feedTags, setFeedTags] = useRecoilState(tagsInFeedState);
  const [tagInput, setTagInput] = useState<string>("");
  useEffect(() => {
    async function getTagAsync() {
      await chrome.storage.sync.set({ highlightColor: "#FFFF00" });
      const color = await chrome.storage.sync.get("highlightColor");
      console.log("색 저장끝", color);
      let response = await chrome.runtime.sendMessage({
        greeting: "getGroupTags",
      });
      const data = response.data.data;
      console.log("CreateFeed: ", data);
      groupTagAdd(data);
    }
    getTagAsync();
  }, []);

  const groupTagAdd = (data: []) => {
    data.map((item: any) => {
      const newTag = {
        tag_id: item.id,
        tag_name: item.tag_name,
      };
      setGroupTags((oldTags: any) => [...oldTags, newTag]);
    });
  };

  const tagInputChangeHandler = (event: any) => {
    setTagInput(event.target.value);
  };
  const tagAddHandler = () => {
    // 서버에 api 요청
    const newTag = {
      tag_id: tagInput,
      tag_name: tagInput,
    };

    feedTags.push(newTag);
    setFeedTags(feedTags);
    setTagInput("");
  };

  // enter event handler
  const activeEnter = (e: any) => {
    console.log(e);
    if (e.key === "Enter") {
      console.log("enter");
      tagAddHandler();
    }
  };
  const groupTagList = groupTags.map((tag) => (
    <span>
      <TagItem
        onClick={() => this.feedTagAdd(tag.tag_id, tag.tag_name)}
        id={tag.tag_id}
        name={tag.tag_name}
      ></TagItem>
    </span>
  ));

  return (
    <div>
      <div className="px-4"></div>
      {/* <form action="#" method="POST"> */}
      <div className="shadow ">
        <div className="px-4 py-3 bg-white">
          <h1 className="text-base font-semibold text-left text-sky-500 ">
            피드 제목
          </h1>
          <input
            type="text"
            className="w-full h-8 mt-1 mb-1 mr-1 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
            placeholder=" 제목을 입력하세요"
          />
          <h1 className="my-1 text-base font-semibold text-left text-sky-500 ">
            태그 추가
          </h1>
          <div className="mb-2">
            {feedTags.map((tag: any) => (
              <span>
                <TagItem id={tag.tag_id} name={tag.tag_name}></TagItem>
              </span>
            ))}
          </div>
          <div className="items-center w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400">
            <div className="flex flex-row">
              <div className="w-full">
                <input
                  onChange={tagInputChangeHandler}
                  type="text"
                  className="h-8 mt-1 mb-1 mr-1 text-gray-700 bg-white border border-gray-300 rounded-md w-72 focus:outline-none focus:border-gray-400"
                  placeholder="태그를 입력하세요"
                  value={tagInput}
                  onKeyDown={activeEnter}
                />
              </div>
              <button
                onClick={tagAddHandler}
                className="flex flex-row items-center justify-between w-8 h-8 mt-1 mb-1 ml-1 text-gray-400 bg-white border-white rounded-lg focus:outline-none focus:border-gray-400"
              >
                <ArrowRightCircleIcon
                  className="w-8 h-8 hover:text-sky-500"
                  aria-hidden="true"
                />
              </button>
            </div>
            <div>{groupTagList}</div>
          </div>
        </div>
        <div className="px-4 py-2 text-right bg-gray-50">
          <button
            type="submit"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </div>
      </div>
      {/* </form> */}
    </div>
  );
}
