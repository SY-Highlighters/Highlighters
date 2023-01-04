import axios from "axios";
import { Fragment } from "react";
import { useSetRecoilState, useRecoilState } from "recoil";
import SignUp from "./SignUp";
import { logModalVisble, sighUpCheck } from "./states/atom";
import { useCookies } from "react-cookie";

export default function SignIn() {
  const [sighch, setSignUp] = useRecoilState(sighUpCheck);
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  const logModalDisable = useSetRecoilState(logModalVisble);

  const closeModal = () => {
    logModalDisable(!logModalVisble);
    setSignUp(!sighch);
  };

  const signUpChangeHandler = () => {
    setSignUp(!sighch);
  };

  // 폼 데이터 받기
  const formSubmitHandler = (event: any) => {
    event.preventDefault();
    console.log(event);
    logModalDisable(!logModalVisble);   
    // form에서 email, password 받아오기
    const email = event.target[0].value;
    const password = event.target[1].value;

    axios
      .post("http://localhost:3001/api/auth/signin/", {
        email: email,
        password: password,
      })
      .then(function (response) {
        console.log(response.data.accessToken);
        if (response) {
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.accessToken}`;
          handleCookie(response.data.accessToken);
        } else {
          alert("로그인 실패");
        }
      });
  };

  const handleCookie = (data: any) => {
    const expireDate = new Date();
    expireDate.setMinutes(expireDate.getMinutes() + 10);
    setCookie("logCookie", data, { path: "/", expires: expireDate });
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
            <a href="#!" className="text-xs text-sky-600 hover:underline">
              Forget Password?
            </a>
            <div className="mt-6">
              <button
                className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform rounded-md bg-sky-700 hover:bg-sky-600 focus:outline-none focus:bg-sky-600"
              >
                Login
              </button>
            </div>
          </form>

          <p className="mt-8 text-xs font-light text-center text-gray-700">
            {" "}
            Don't have an account?{" "}
            <p
              onClick={signUpChangeHandler}
              className="font-medium text-sky-600 hover:underline"
            >
              Sign up
            </p>
          </p>
        </div>
      ) : (
        <SignUp></SignUp>
      )}
    </Fragment>
  );
}
