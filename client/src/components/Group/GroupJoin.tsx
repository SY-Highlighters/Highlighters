import React, { Fragment, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  groupAddState,
  groupJoinState,
  groupModalVisble,
} from "../../states/atom";
import axios from "axios";

export default function GroupJoin() {
  const setGroupJoin = useSetRecoilState(groupJoinState);
  const setGroupModal = useSetRecoilState(groupModalVisble);

  // 폼 데이터 받기
  const formSubmitHandler = (event: any) => {
    event.preventDefault();
    console.log(event);
    setGroupModal(!groupModalVisble);
    setGroupJoin(!groupJoinState);
    // form에서 참여 코드 받아오기
    const joinCode = event.target[0].value;

    const host_url = `http://${process.env.REACT_APP_HOST}:3001/api/group/join/`;

    axios
      .post(host_url, {
        joinCode,
      })
      .then(function (response) {
        console.log(response);
        if (response) {
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.accessToken}`;
        } else {
          alert("그룹 참여 실패!");
        }
      });
  };

  return (
    <Fragment>
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
        <h1 className="text-3xl font-semibold text-left text-rose-300 ">
          그룹 참여
        </h1>
        <form className="mt-6" onSubmit={formSubmitHandler}>
          <div className="mb-2">
            <label
              htmlFor="email"
              className="block font-bold text-left text-gray-800 text-mg"
            >
              참여 코드
            </label>
            <input
              type="text"
              placeholder="참여 코드를 입력하세요"
              className="block w-full px-4 py-2 mt-2 bg-white border rounded-md text-rose-300 focus:border-rose-500 focus:ring-rose-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>

          <div className="mt-6">
            <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform rounded-md bg-rose-500 hover:bg-rose-600 focus:outline-none focus:bg-rose-600">
              입력
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  );
}
