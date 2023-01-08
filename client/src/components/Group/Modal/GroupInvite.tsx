import React, { Fragment, useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { groupModalVisble, groupInviteState } from "../../../states/atom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
export default function GroupInvite() {
  const setGroupModal = useSetRecoilState(groupModalVisble);
  const setGroupInvite = useSetRecoilState(groupInviteState);
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  const host_url = `${process.env.REACT_APP_HOST}/api/group/code`;
  const [code, setCode] = useState("");
  const handleCopyClipBoard = async (text: string) => {
    try {
      console.log("여긴 눌렀을떄", text);

      await navigator.clipboard.writeText(text);
      alert("클립보드에 복사되었습니다.");
      setGroupModal(!groupModalVisble);
      setGroupInvite(!groupInviteState);
    } catch (error) {
      alert("클립보드 복사에 실패하였습니다.");
    }
  };
  useEffect(() => {
    // 서버에서 참여 코드 가져오기
    async function codeGet() {
      const response = await axios({
        method: "get",
        url: host_url,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.logCookie}`,
        },
      });
      console.log(response.data.data);
      setCode(response.data.data);
    }
    codeGet();
  }, []);

  return (
    <Fragment>
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
        <h1 className="text-3xl font-semibold text-left text-sky-500 ">
          그룹 초대
        </h1>

        <div className="mt-5 mb-2">
          <label
            htmlFor="email"
            className="block font-bold text-left text-gray-800 text-mg"
          >
            참여코드
          </label>
        </div>
        <div>
          <span
            onClick={() => handleCopyClipBoard(code)}
            className="flex p-2 rounded-lg bg-sky-500 hover:bg-sky-700"
          >
            <ClipboardDocumentCheckIcon
              className="w-5 h-5 m-2 text-white"
              aria-hidden="true"
            ></ClipboardDocumentCheckIcon>

            <span className="mt-1 ml-5 text-xl text-white">{code}</span>
          </span>
        </div>
      </div>
    </Fragment>
  );
}
