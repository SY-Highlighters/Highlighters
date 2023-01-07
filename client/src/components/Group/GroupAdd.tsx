import React, { Fragment, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { groupAddState, groupModalVisble } from "../../states/atom";
import axios from "axios";

export default function GroupAdd() {
  const setGroupModal = useSetRecoilState(groupModalVisble);
  const setGroupAdd = useSetRecoilState(groupAddState);
  // 폼 데이터 받기
  const formSubmitHandler = (event: any) => {
    event.preventDefault();
    console.log(event.target[0].value);

    // form에서 groupName 받아오기
      const groupName = event.target[0].value;
      
    const host_url = `${process.env.REACT_APP_HOST}:3001/api/group/create/`;

    axios
      .post(host_url, {
        groupName,
      })
      .then(function (response) {
        console.log(response);
        if (response) {
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.accessToken}`;
          // 잘 전달했을때
          console.log("그룹 생성 성공");
          setGroupModal(!groupModalVisble);
          setGroupAdd(!groupAddState);
        } else {
          alert("그룹 생성 실패");
        }
      });
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
