// import { GoogleOAuthProvider } from "@react-oauth/google";
// import { GoogleLogin } from "@react-oauth/google";
// import { Fragment, useEffect } from "react";
// import { gapi } from "gapi-script";

// export function GoogleLoginButton() {
//   return (
//     // <div className="flex justify-center">
//     <Fragment>

//         <GoogleLogin
//           onSuccess={(credentialrRes) => {
//             console.log(credentialrRes);
//           }}
//           onError={() => {
//             console.log("error");
//           }}
//         ></GoogleLogin>
//       </GoogleOAuthProvider>
//     </Fragment>
//     // </div>
//   );
// }
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";

export function GoogleLoginButton() {
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);

  const googleSocialLogin = useGoogleLogin({
    onSuccess: async (creRes) => {
      console.log(creRes);

      const response = await axios({
        method: "get",
        url: `${process.env.REACT_APP_HOST}/api/auth/google/login`,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      // 유저 데이터 저장
      // setUserInfo({
      //   nickname: response.data.nickname,
      //   img: response.data.image,
      //   groupId: response.data.group_id,
      //   groupName: response.data.group_name,
      // });
      // 쿠키저장

      handleCookie(response.data.accessToken);
    },
  });

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
  // flow: "auth-code",

  const devsungtae = () => {
    // const response = await axios({
    //   method: "get",
    //   url: `${process.env.REACT_APP_HOST}/api/auth/google/login`,
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // console.log(response);
    window.open(
      `${process.env.REACT_APP_HOST}/api/auth/google/login`,
      "_blank",
      "height=500,width=500,left=100,top=100"
    );
  };
  // const devsungtae = async() => {
  //   const response = await axios({
  //     method: "get",
  //     url: `${process.env.REACT_APP_HOST}/api/auth/google/login`,
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   console.log(response);
  //   // window.open(response.data.url, "_self");

  // };

  return (
    <button
      // onClick={() => googleSocialLogin()}
      onClick={() => devsungtae()}
      className="flex flex-row w-full px-4 py-2 mt-3 tracking-wide text-white transition-colors duration-200 transform bg-white rounded-md outline-1 outline outline-black hover:bg-gray-200 focus:outline-none focus:bg-gray-400"
    >
      <div className="w-1/3">
        <img
          src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
          className="w-5 h-5"
          alt="google_login"
        />
      </div>
      <div className="">
        <span className="font-bold text-gray-500 hover:text-white">
          구글 아이디로 로그인
        </span>
      </div>
    </button>
  );
}
