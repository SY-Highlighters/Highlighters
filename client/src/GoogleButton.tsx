import { GoogleLogin } from "@react-oauth/google";
import { gapi } from "gapi-script";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";

// clientId
const clientId =
  "1051615347268-qio4ne1nai8flq7felb5h0relc1lcp0b.apps.googleusercontent.com";
export default function GoogleButton() {
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  // useEffect(() => {
  //   function start() {
  //     gapi.client.init({
  //       clientId,
  //       scope: "email",
  //     });
  //   }

  //   gapi.load("client:auth2", start);
  // }, []);

  const onSuccess = async (response: any) => {
    // 서버에 보내고
    console.log("통과");
    console.log(response);
    await fetch("http://localhost:3001/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userProfile: response.credential,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.accessToken);
        if (data) {
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${data.accessToken}`;
          handleCookie(data.accessToken);
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
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin onSuccess={onSuccess} />
    </GoogleOAuthProvider>
  );
}
