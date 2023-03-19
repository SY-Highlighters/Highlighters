import React, { Fragment } from "react";
import { useSetRecoilState } from "recoil";
import { groupAddState, groupModalVisble } from "../../../atoms/atom";
import axios from "axios";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";

export default function GroupAdd() {
  const setGroupModal = useSetRecoilState(groupModalVisble);
  const setGroupAdd = useSetRecoilState(groupAddState);
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);

  // 폼 데이터 받기
  const formSubmitHandler = async (event: any) => {
    event.preventDefault();

    // form에서 groupName 받아오기
    const groupName = event.target[0].value;

    const host_url = `${process.env.REACT_APP_HOST}/api/group/create/`;
    // 서버에 그룹 생성 요청
    await axios
      .post(host_url, {
        name: groupName,
      })
      .then(function (response) {
        if (response) {
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${cookies.logCookie}`;
          Swal.fire({
            icon: "success",
            title: "그룹 생성 성공!",
            text: "그룹 생성에 성공했습니다.",
          });
          // 2초 후 리로드
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          alert("그룹 생성 실패!");
        }
      });
    setGroupModal(!groupModalVisble);
    setGroupAdd(!groupAddState);
  };

  return (
    <Fragment>
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
        <h1 className="text-3xl font-semibold text-left text-indigo-500 ">
          그룹 생성
        </h1>
        <form className="mt-6" onSubmit={formSubmitHandler}>
          <div className="mb-2">
            <label
              htmlFor="email"
              className="block font-bold text-left text-gray-800 text-mg"
            >
              그룹명
            </label>
            <input
              type="text"
              placeholder="그룹명을 입력하세요"
              className="block w-full px-4 py-2 mt-2 text-indigo-500 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>

          <div className="mt-6">
            <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-indigo-700 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600">
              생성
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  );
}
