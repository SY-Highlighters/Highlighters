import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState, useRef } from "react";
import { TagItem } from "../components/TagItem";
import { useSetRecoilState, useRecoilState } from "recoil";
import { feedGenerateState, tagsInFeedState } from "../states/atom";
import TagData from "../models/tag";
import Swal from "sweetalert2";
import { TagEditItem } from "../components/TagEditItem";

const Toast = Swal.mixin({
  toast: true,
  position: "center",
  showConfirmButton: false,
  timer: 500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export default function CreateFeed(this: any) {
  const [groupTags, setGroupTags] = useState<TagData[]>([]);
  const [feedTags, setFeedTags] = useRecoilState(tagsInFeedState);
  const [titleInput, setTitleInput] = useState<string>("");
  const [tagInput, setTagInput] = useState<string>("");
  const [currentURL, setCurrentURL] = useState<string | undefined>("");
  const [ogTitle, setOgTitle] = useState<string>("");
  const [ogImage, setOgimage] = useState<string>("");
  const [ogDescription, setOgDescription] = useState<string>("");
  const setFeedGenerate = useSetRecoilState(feedGenerateState);

  // const [first, setFirst] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function getTagAsync() {
      let response = await chrome.runtime.sendMessage({
        greeting: "getGroupTags",
      });
      const data = response.data.data;
      groupTagAdd(data);
    }

    async function getInfo() {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        async function (tabs) {
          if (tabs[0].id !== undefined) {
            chrome.tabs.sendMessage(
              tabs[0].id,
              {
                greeting: "getOG",
              },
              (response) => {
                console.log("[getInfo] reponse:", response);
                setCurrentURL(tabs[0].url);
                setOgDescription(response.description);
                setOgimage(response.image);
                setOgTitle(response.title);
                setTitleInput(response.title);
              }
            );
          }
        }
      );
    }
    getTagAsync();
    getInfo();
  }, []);

  const groupTagAdd = (data: []) => {
    data.map((item: any) => {
      const newTag = item.tag_name;
      setGroupTags((oldTags: any) => [...oldTags, newTag]);
    });
  };

  const titleInputChangeHandler = (event: any) => {
    setTitleInput(event.target.value);
  };

  const tagInputChangeHandler = (event: any) => {
    setTagInput(event.target.value);
  };

  const newTagHandler = () => {
    // 서버에 api 요청
    const newTag = tagInput;

    setTagInput("");
    feedTags.push(newTag);
    setFeedTags(feedTags);
  };

  // enter event handler
  const activeEnter = (e: any) => {
    if (e.nativeEvent.isComposing) {
      return;
    }
    console.log(e);
    if (e.key === "Enter") {
      newTagHandler();
    }
  };

  const feedSubmitHandler = () => {
    console.log(ogDescription);
    chrome.runtime.sendMessage(
      {
        greeting: "postFeed",
        data: {
          url: currentURL,
          feed_title: titleInput,
          og_title: ogTitle,
          image: ogImage,
          description: ogDescription,
          tag_name: feedTags,
        },
      },
      (response) => {
        console.log(response);
        Toast.fire({
          icon: "success",
          title: "피드 생성 성공!",
        });
        setTitleInput("");
        setFeedGenerate(true);
      }
    );
  };

  const groupTagList = groupTags.map((tag) => (
    <span>
      <TagItem onClick={() => this.feedTagAdd(tag)} name={tag}></TagItem>
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
            onChange={titleInputChangeHandler}
            type="text"
            ref={inputRef}
            className="w-full h-8 mt-1 mb-1 mr-1 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
            value={titleInput}
          />
          <h1 className="my-1 text-base font-semibold text-left text-sky-500 ">
            태그 추가
          </h1>
          <div className="mb-2">
            {feedTags.map((tag: any) => (
              <span>
                <TagEditItem name={tag}></TagEditItem>
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
                onClick={newTagHandler}
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
            onClick={feedSubmitHandler}
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
