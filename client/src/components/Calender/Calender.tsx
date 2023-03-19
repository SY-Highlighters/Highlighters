import { Menu, Transition } from "@headlessui/react";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday,
} from "date-fns";
import { Fragment, useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { selectedDayState, mainSectionState } from "../../atoms/atom";
import { throttle } from "lodash";
import { useQuery } from "react-query";
import { useCookies } from "react-cookie";
import axios from "axios";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
export default function Calender() {
  const [cookies] = useCookies(["logCookie"]);

  let today = startOfToday();
  let [selectedDay, setSelectedDay] = useState(today);
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
  const setGlobalSelectedDay = useSetRecoilState(selectedDayState);
  const setMainSectionNum = useSetRecoilState(mainSectionState);
  // console.log("오늘인가", today);

  const { data, isSuccess } = useQuery(currentMonth, getMouthFeed);
  async function getMouthFeed() {
    const res = await axios({
      method: "get",
      url: `${process.env.REACT_APP_HOST}/api/calendar/month/?date=${currentMonth}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.logCookie}`,
      },
    });
    // console.log("월 날짜가져오기", res.data);
    return res.data;
  }
  // console.log("이번달인가",currentMonth)
  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  // let selectedDayMeetings = meetings.filter((meeting) =>
  //   isSameDay(parseISO(meeting.startDatetime), selectedDay)
  // );
  // const throttledClickedDay = (day: any) => thrrottle(clickedDay(day), 10000);
  function clickedDay(day: Date) {
    setSelectedDay(day);
    setGlobalSelectedDay(day);
    setMainSectionNum(3);
  }
  // useEffect(() => {
  // }, [setCurrentMonth]);
  return (
    <div className="w-full mt-3 bg-white rounded-lg shadow-lg h-15">
      <div className="m-5">
        <div className="py-2 md:divide-gray-200">
          <div className="">
            <div className="flex items-center">
              <h2 className="flex-auto pt-1 font-semibold text-gray-900">
                {format(firstDayCurrentMonth, "MMMM yyyy")}
              </h2>
              <button
                type="button"
                onClick={previousMonth}
                className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Previous month</span>
                <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                onClick={nextMonth}
                type="button"
                className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Next month</span>
                <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <div className="grid grid-cols-7 mt-5 text-sm leading-6 text-center text-gray-500">
              <div>S</div>
              <div>M</div>
              <div>T</div>
              <div>W</div>
              <div>T</div>
              <div>F</div>
              <div>S</div>
            </div>
            <div className="grid grid-cols-7 text-sm">
              {days.map((day, dayIdx) => (
                <div
                  key={day.toString()}
                  className={classNames(
                    dayIdx === 0 && colStartClasses[getDay(day)],
                    "py-1.5"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => {
                      clickedDay(day);
                      // _.throttle(clickedDay(day), 10000);
                    }}
                    className={classNames(
                      isEqual(day, selectedDay) && "text-white",
                      !isEqual(day, selectedDay) &&
                        isToday(day) &&
                        "text-sky-500",
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        isSameMonth(day, firstDayCurrentMonth) &&
                        "text-gray-900",
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        !isSameMonth(day, firstDayCurrentMonth) &&
                        "text-gray-400",
                      isEqual(day, selectedDay) && isToday(day) && "bg-sky-500",
                      isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        "bg-gray-900",
                      !isEqual(day, selectedDay) && "hover:bg-gray-200",
                      (isEqual(day, selectedDay) || isToday(day)) &&
                        "font-semibold",
                      "mx-auto flex h-8 w-8 items-center justify-center rounded-full"
                    )}
                  >
                    <time dateTime={format(day, "yyyy-MM-dd")}>
                      {format(day, "d")}
                    </time>
                  </button>

                  <div className="w-1 h-1 mx-auto mt-1 ">
                    {isSuccess &&
                      data.data.some((meeting: any) =>
                        isSameDay(parseISO(meeting.startDatetime), day)
                      ) && (
                        <div className="w-2 h-2 -mr-1 rounded-full bg-violet-400"></div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// function Meeting({ meeting }) {
//   let startDateTime = parseISO(meeting.startDatetime);
//   let endDateTime = parseISO(meeting.endDatetime);

//   return (
//     <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100">
//       <img
//         src={meeting.imageUrl}
//         alt=""
//         className="flex-none w-10 h-10 rounded-full"
//       />
//       <div className="flex-auto">
//         <p className="text-gray-900">{meeting.name}</p>
//         <p className="mt-0.5">
//           <time dateTime={meeting.startDatetime}>
//             {format(startDateTime, "h:mm a")}
//           </time>{" "}
//           -{" "}
//           <time dateTime={meeting.endDatetime}>
//             {format(endDateTime, "h:mm a")}
//           </time>
//         </p>
//       </div>
//       <Menu
//         as="div"
//         className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100"
//       >
//         <div>
//           <Menu.Button className="-m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600">
//             <span className="sr-only">Open options</span>
//             {/* <DotsVerticalIcon className="w-6 h-6" aria-hidden="true" /> */}
//           </Menu.Button>
//         </div>

//         <Transition
//           as={Fragment}
//           enter="transition ease-out duration-100"
//           enterFrom="transform opacity-0 scale-95"
//           enterTo="transform opacity-100 scale-100"
//           leave="transition ease-in duration-75"
//           leaveFrom="transform opacity-100 scale-100"
//           leaveTo="transform opacity-0 scale-95"
//         >
//           <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right bg-white rounded-md shadow-lg w-36 ring-1 ring-black ring-opacity-5 focus:outline-none">
//             <div className="py-1">
//               <Menu.Item>
//                 {({ active }) => (
//                   <a
//                     href="#"
//                     className={classNames(
//                       active ? "bg-gray-100 text-gray-900" : "text-gray-700",
//                       "block px-4 py-2 text-sm"
//                     )}
//                   >
//                     Edit
//                   </a>
//                 )}
//               </Menu.Item>
//               <Menu.Item>
//                 {({ active }) => (
//                   <a
//                     href="#"
//                     className={classNames(
//                       active ? "bg-gray-100 text-gray-900" : "text-gray-700",
//                       "block px-4 py-2 text-sm"
//                     )}
//                   >
//                     Cancel
//                   </a>
//                 )}
//               </Menu.Item>
//             </div>
//           </Menu.Items>
//         </Transition>
//       </Menu>
//     </li>
//   );
// }

let colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

// function thrrottle(callback: any, limit: any) {
//   let wait = false;
//   return function () {
//     if (!wait) {
//       callback.apply(null, arguments);
//       wait = true;
//       setTimeout(function () {
//         wait = false;
//       }, limit);
//     }
//   };
// }
