import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";

export default function CreateFeed() {
  return (
    <div>
      <div className="px-4"></div>
      <form action="#" method="POST">
        <div className="shadow ">
          <div className="bg-white px-4 py-3">
            <h1 className="text-base font-semibold text-left text-sky-500 ">
              피드 제목
            </h1>
            <input
              type="text"
              className="w-full h-8 mr-1 mb-1 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
              placeholder=" 제목을 입력하세요"
            />
            <h1 className="my-2 text-base font-semibold text-left text-sky-500 ">
              태그
            </h1>
            <div className="items-center w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400">
              <div className="flex flex-row">
                <div className="w-full">
                  <input
                    type="text"
                    className="w-72 h-8 mr-1 mb-1 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
                    placeholder=" 태그를 입력하세요"
                  />
                </div>
                <button className="flex flex-row items-center justify-between w-8 h-8 ml-1 mb-1 mt-1 text-gray-400 bg-white  border-white rounded-lg focus:outline-none focus:border-gray-400">
                  <ArrowRightCircleIcon
                    className="w-8 h-8 hover:text-sky-500"
                    aria-hidden="true"
                  />
                </button>
              </div>
              <div className="w-full">
                <select
                  id="country"
                  name="country"
                  autoComplete="country-name"
                  className="mt-1 w-full block rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                >
                  <option>미분류</option>
                  <option>수소차</option>
                  <option>전기차</option>
                </select>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-2 text-right">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-sky-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
