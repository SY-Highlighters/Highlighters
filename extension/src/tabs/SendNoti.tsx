
const formSubmitHandler = async (event: any) => {
  event.preventDefault();
  const contents = event.target[0].value;

  chrome.runtime.sendMessage(
    {
      greeting: "postNoti",
      data: contents,
    },
    (response) => response.farewell
  );
};

export default function SendNoti() {
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
                    className="block text-sm font-large text-gray-700"
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
