import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { RecoilRoot } from "recoil";
import axios from "axios";
import { CookiesProvider } from "react-cookie";
axios.defaults.baseURL = `http://${process.env.REACT_APP_HOST}`;
axios.defaults.withCredentials = true;
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>
  <RecoilRoot>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </RecoilRoot>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
