import axios from "axios";
import { Fragment } from "react";
import { useSetRecoilState, useRecoilState, constSelector } from "recoil";
import SignUp from "./SignUp";
import { logModalVisble, sighUpCheck } from "../../atoms/atom";
import { userInfo } from "../../atoms/user";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export default function SignIn() {
  const [sighch, setSignUp] = useRecoilState(sighUpCheck);
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  const logModalDisable = useSetRecoilState(logModalVisble);
  // const setUserInfo = useSetRecoilState(userInfo);

  const closeModal = () => {
    logModalDisable(!logModalVisble);
    setSignUp(!sighch);
  };
  // 회원가입으로 컴포넌트 변경 핸들러
  const signUpChangeHandler = () => {
    setSignUp(!sighch);
  };

  // 폼 데이터 받기 -> 이건 건들지 않는게 낫겠다.
  const formSubmitHandler = async (event: any) => {
    event.preventDefault();
    // console.log(event);
    // form에서 email, password 받아오기
    const email = event.target[0].value;
    const password = event.target[1].value;

    await axios
      .post(`${process.env.REACT_APP_HOST}/api/auth/signin`, {
        email: email,
        password: password,
      })
      .then(function (response) {
        // console.log(response);
        if (response) {
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.accessToken}`;
          // 유저 데이터 저장
          // setUserInfo({
          //   nickname: response.data.nickname,
          //   img: response.data.image,
          //   groupId: response.data.group_id,
          //   groupName: response.data.group_name,
          // });
          // 쿠키저장

          handleCookie(response.data.accessToken);
        }
      })
      .catch((error) => {
        // console.log(error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "이메일 또는 비밀번호가 일치하지 않습니다.?",
          confirmButtonColor: "#0ea5e9",
        });
      });
  };

  const handleCookie = (data: any) => {
    const expireDate = new Date();
    expireDate.setMinutes(expireDate.getMinutes() + 360);
    // set cookie with http version
    // setCookie("logCookie", data, { path: "/", expires: expireDate });

    // set cookie with https version
    setCookie("logCookie", data, {
      path: "/",
      expires: expireDate,
      secure: true,
      sameSite: "none",
    });
  };

  return (
    <Fragment>
      {!sighch ? (
        <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
          <h1 className="text-3xl font-semibold text-center text-sky-500 ">
            Sign in
          </h1>
          <form className="mt-6" onSubmit={formSubmitHandler}>
            <div className="mb-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-800"
              >
                Email
              </label>
              <input
                type="email"
                className="block w-full px-4 py-2 mt-2 bg-white border rounded-md text-sky-500 focus:border-sky-400 focus:ring-sky-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-800"
              >
                Password
              </label>
              <input
                type="password"
                className="block w-full px-4 py-2 mt-2 bg-white border rounded-md text-sky-700 focus:border-sky-400 focus:ring-sky-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>
            {/* 비밀번호 잃어버렸을때 기능 -> 구현 할지 모르겠다*/}
            {/* <a href="#!" className="text-xs text-sky-600 hover:underline">
              Forget Password?
            </a> */}
            <div className="mt-6">
              <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform rounded-md bg-sky-700 hover:bg-sky-600 focus:outline-none focus:bg-sky-600">
                Login
              </button>
            </div>
          </form>

          <div className="justify-center mt-1">
            {/* <GoogleOAuthProvider */}
            {/* clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}
            > */}
            <GoogleLoginButton></GoogleLoginButton>
            {/* </GoogleOAuthProvider> */}
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex justify-center ">
              <span className="mt-1 text-xs font-light text-center text-gray-400">
                Don't have an account?
              </span>
            </div>
            <div className="flex justify-center">
              <span
                onClick={signUpChangeHandler}
                className="text-sm font-medium cursor-pointer text-sky-600 hover:text-sky-300"
              >
                Sign up
              </span>
            </div>
          </div>
        </div>
      ) : (
        <SignUp></SignUp>
      )}
    </Fragment>
  );
}
