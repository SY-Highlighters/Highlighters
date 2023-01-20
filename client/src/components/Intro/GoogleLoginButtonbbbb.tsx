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
      await axios
        .post(`${process.env.REACT_APP_HOST}/api/auth/google`, {
          accessToken: creRes.access_token,
        })
        .then(function (response) {
          console.log('이건머고,?',response);
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
          console.log(error);
          // Swal.fire({
          //   icon: "error",
          //   title: "Oops...",
          //   text: "이메일 또는 비밀번호가 일치하지 않습니다.",
          //   confirmButtonColor: "#0ea5e9",
          // });
        });
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

  return (
    <button
      onClick={() => googleSocialLogin()}
      className="flex flex-row w-full px-4 py-2 mt-3 tracking-wide text-white transition-colors duration-200 transform bg-white rounded-md outline-1 ou outline-black hover:bg-gray-800 focus:outline-none focus:bg-gray-600"
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
