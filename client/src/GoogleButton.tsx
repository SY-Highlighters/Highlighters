import { GoogleLogin } from "react-google-login";
import { useEffect } from "react";
import { gapi } from "gapi-script";
import { useRef } from "react";
import useScript from "./hooks/useScript";
const clientId =
  "1051615347268-qio4ne1nai8flq7felb5h0relc1lcp0b.apps.googleusercontent.com";
export default function GoogleButton() {
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId,
        scope: "email",
      });
    }

    gapi.load("client:auth2", start);
  }, []);

  const onSuccess = (response: any) => {
    // 서버에 보내고
    console.log(response);
    const res = fetch("http://localhost:3001/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userProfile: response.profileObj,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  };
  const onFailure = (response: any) => {
    console.log(response);
  };

  return (
    <GoogleLogin
      clientId={clientId}
      buttonText="Login"
      onSuccess={onSuccess}
      onFailure={onFailure}
    ></GoogleLogin>
  );
}

//   useEffect(() => {
//     function start() {
//       gapi.client.init({
//         clientId,
//         scope: "email",
//       });
//     }

//     gapi.load("client:auth2", start);
//   }, []);

//   const onSuccess = (response:any) => {
//     console.log(response);
//   };
//   const onFailure = (response:any) => {
//     console.log(response);
//   };
