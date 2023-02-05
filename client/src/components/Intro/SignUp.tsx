import axios from "axios";
import { Fragment,useState } from "react";
import { useSetRecoilState, useRecoilState } from "recoil";
import { logModalVisble, sighUpCheck, userInfoState } from "../../states/atom";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";

export default function SignUp() {
  const [sighch, setSignUp] = useRecoilState(sighUpCheck);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const nickNameHandler = (e: any) => {
    setNickname(e.target.value);
  };
  const emailHandler = (e: any) => {
    setEmail(e.target.value);
  };
  const passwordHandler = (e: any) => {
    setPassword(e.target.value);
  };
  
  // 비밀번호와 비밀 번호 확인 일치 여부
  // const [passwordCheck, setPasswordCheck] = useState(false);
  // const [passwordError, setPasswordError] = useState(false);
  const onCheckEnter = (e: any) => {
    if (e.key === "Enter") {
      formSubmitHandler(e);
    }
  };
  // 폼 데이터 받기 -> 이건 건들지 않는게 낫겠다.
  const formSubmitHandler = async (event: any) => {
    event.preventDefault();
    // console.log(event);
    // form에서 email, password 받아오기
    // const nickname = event.target[0].value;
    // const email = event.target[1].value;
    // const password = event.target[2].value;
    await axios
      .post(`${process.env.REACT_APP_HOST}/api/auth/signup`, {
        nickname: nickname,
        email: email,
        password: password,
      })
      .then(function (response) {
        // console.log(response);
        if (response) {
          setSignUp(!sighch);
          // alert("회원가입 성공");
          Swal.fire(
            "회원가입 성공!",
            "지금 바로 피드를 공유하세요!",
            "success"
          );
        } else {
          alert("회원가입 실패");
        }
      });
  };

  // 회원가입으로 컴포넌트 변경 핸들러
  const signUpChangeHandler = () => {
    setSignUp(!sighch);
  };
  return (
    <div>
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
        <div>
          <a href="/">
            <h3 className="text-4xl font-bold text-sky-600">Sign Up</h3>
          </a>
        </div>
        <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white shadow-md sm:max-w-md sm:rounded-lg">
          <form onSubmit={formSubmitHandler} onKeyDown={onCheckEnter}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 undefined"
              >
                Nickname
              </label>
              <div className="flex flex-col items-start">
                <input
                  onChange={nickNameHandler}
                  type="text"
                  name="name"
                  minLength={4}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
            </div>
            <div className="mt-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 undefined"
              >
                Email
              </label>
              <div className="flex flex-col items-start">
                <input
                  onChange={emailHandler}
                  type="email"
                  name="email"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
            </div>
            <div className="mt-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 undefined"
              >
                Password
              </label>
              <div className="flex flex-col items-start">
                <input
                  type="password"
                  name="password"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
            </div>
            <div className="mt-4">
              <label
                htmlFor="password_confirmation"
                className="block text-sm font-medium text-gray-700 undefined"
              >
                Confirm Password
              </label>
              <div className="flex flex-col items-start">
                <input
                  onChange={passwordHandler}
                  type="password"
                  name="password_confirmation"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
            </div>
            <div className="flex items-center justify-end mt-4">
              <p
                onClick={signUpChangeHandler}
                className="text-sm text-gray-600 underline hover:text-gray-900"
              >
                Already registered?
              </p>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 ml-4 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out border border-transparent rounded-md bg-sky-900 active:bg-sky-900 false"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
