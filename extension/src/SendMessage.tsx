/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
export default function SendMessage() {
  // 폼 데이터 받기 -> 이건 건들지 않는게 낫겠다.
  const formSubmitHandler = async (event: any) => {
    event.preventDefault();
    // form에서 message 받아오기
    const message = event.target[0].value;
    // Todo: 밑에 서버에 메세지 만드는 것 구현
    // await axios
    //   .post(`localhost:3001/api/auth/signin`, {
    //     email: email,
    //     password: password,
    //   })
    //   .then(function (response) {
    //     console.log(response);
    //     if (response) {
    //       axios.defaults.headers.common[
    //         "Authorization"
    //       ] = `Bearer ${response.data.accessToken}`;
    //       // 유저 데이터 저장
    //       // setUserInfo({
    //       //   nickname: response.data.nickname,
    //       //   img: response.data.image,
    //       //   groupId: response.data.group_id,
    //       //   groupName: response.data.group_name,
    //       // });
    //       // 쿠키저장
    //       console.log(response.data.accessToken);
    //       handleCookie(response.data.accessToken);
    //     } else {
    //       alert("로그인 실패");
    //     }
    //   });
  };

  return (
    <div className="mt-1">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0"></div>
        </div>
        <div className="mt-1 md:col-span-2 md:mt-0">
          <form action="#" method="POST" onSubmit={formSubmitHandler}>
            <div className="shadow sm:overflow-hidden sm:rounded-md">
              <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                <div>
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium text-gray-700"
                  >
                    메세지
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="about"
                      name="about"
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                      placeholder="메세지를 입력하세요"
                      defaultValue={""}
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 text-right sm:px-4">
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-sky-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                >
                  전송
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
