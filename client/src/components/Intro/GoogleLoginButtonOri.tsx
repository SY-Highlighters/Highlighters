import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

import axios from "axios";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";
import { logModalVisble } from "../../atoms/atom";
import { useSetRecoilState } from "recoil";
export function GoogleLoginButton() {
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  const logModalDisable = useSetRecoilState(logModalVisble);

  const closeModal = () => {
    logModalDisable(!logModalVisble);
  };
  // const googleSocialLogin = async() => {

  //   },
  // });

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
  // process.env.REACT_APP_GOOGLE_CLIENT_ID
  return (
    <div className="App">
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
        <GoogleLogin
          // useOneTap={true}

          onSuccess={async (creRes) => {
            // console.log(creRes);
            await axios
              .post(`${process.env.REACT_APP_HOST}/api/auth/google/login`, {
                accessToken: creRes.credential,
              })
              .then(function (response) {
                // console.log("이건머고,?", response);
                if (response) {
                  axios.defaults.headers.common[
                    "Authorization"
                  ] = `Bearer ${response.data.data.accessToken}`;
                  // 유저 데이터 저장
                  // setUserInfo({
                  //   nickname: response.data.nickname,
                  //   img: response.data.image,
                  //   groupId: response.data.group_id,
                  //   groupName: response.data.group_name,
                  // });
                  // 쿠키저장
                  closeModal();
                  handleCookie(response.data.data.accessToken);
                }
              })
              .catch((error) => {
                // console.log(error);
                // Swal.fire({
                //   icon: "error",
                //   title: "Oops...",
                //   text: "이메일 또는 비밀번호가 일치하지 않습니다.",
                //   confirmButtonColor: "#0ea5e9",
                // });
              });
          }}
          onError={() => {
            // console.log("Login Failed");
          }}
        ></GoogleLogin>
      </GoogleOAuthProvider>
    </div>
  );
}
