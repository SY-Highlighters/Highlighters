import { useState } from "react";
import SendMessage from "./SendMessage";
import MessageBox from "./MessageBox";


const tabsData = [
  {
    label: " Send Message",
    content: <SendMessage></SendMessage>,
  },
  {
    label: "Message Box",
    content: <MessageBox></MessageBox>
  },
];

export default function Tabs() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  return (
    <div>
      <div className="flex space-x-5 border-b ml-3">
        {/* Loop through tab data and render button for each. */}
        {tabsData.map((tab, idx) => {
          return (
            <button
              key={idx}
              className={`py-3 border-b-4 transition-colors duration-300 ${
                idx === activeTabIndex
                  ? "border-sky-300"
                  : "border-transparent hover:border-gray-200"
              }`}
              // Change the active tab on click.
              onClick={() => setActiveTabIndex(idx)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {/* Show active tab content. */}
      <div>
        <p>{tabsData[activeTabIndex].content}</p>
      </div>
    </div>
  );
}
