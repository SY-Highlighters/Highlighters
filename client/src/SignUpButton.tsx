import React, { useCallback } from "react";
export default function SignUpButton() {
  function clickHandler() {
    // 로그인 완료후 루트로 돌아오기
    const openGoogleLoginPage = useCallback(() => {
      const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
      const redirectUri = "api/auth/";

      const scope = [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
      ].join(" ");

      const params = {
        response_type: "code",
        client_id:
          "903880010974-g7o9ss5vgvbvb5l9jkq27jql55e962si.apps.googleusercontent.com",
        redirect_uri: `${"https://localhost:3001"}/${redirectUri}`,
        prompt: "select_account",
        access_type: "offline",
        scope,
      };

      const urlParams = new URLSearchParams(params).toString();

      window.location = `${googleAuthUrl}?${urlParams}`;
    }, []);
  }
  return (
    // tawilwind sign up Large button
    <div className="flex justify-center">
      <button
        onClick={clickHandler}
        className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
      >
        Sign Up
      </button>
    </div>
  );
}
