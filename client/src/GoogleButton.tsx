import { GoogleLogin } from "react-google-login";
import { useEffect } from "react";
import { gapi } from "gapi-script";

const clientId =
  "1051615347268-qio4ne1nai8flq7felb5h0relc1lcp0b.apps.googleusercontent.com";
const GoogleButton = () => {
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
    console.log(response);
  };
  const onFailure = (response:any) => {
    console.log(response);
  };

  return (
      <div className="flex justify-center">
          
      <GoogleLogin
        clientId={clientId}
        buttonText="구글 아이디로 로그인 하세요!"
        onSuccess={onSuccess}
        onFailure={onFailure}
      ></GoogleLogin>
    </div>
  );
};
export default GoogleButton;
