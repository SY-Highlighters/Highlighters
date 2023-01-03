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

  const onSuccess = (response:any) => {
    // 서버에 보내기
    console.log(response);
      fetch("http://localhost:3001/api/auth/google", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              userProfile: response.profileObj
          }),
      })    
        
  };
  const onFailure = (response:any) => {
    console.log(response);
  };

return(
<GoogleLogin
    clientId={clientId}
    buttonText="Login"
    onSuccess={onSuccess}
    onFailure={onFailure}
 >
</GoogleLogin>);
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
