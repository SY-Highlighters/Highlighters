import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

import "./index.css";
import App from "./App";
import { RecoilRoot } from "recoil";
import axios from "axios";
import { CookiesProvider } from "react-cookie";
import { QueryClient, QueryClientProvider, QueryCache } from "react-query";
axios.defaults.baseURL = `${process.env.REACT_APP_HOST}`;
axios.defaults.withCredentials = true;
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.log("onError", error);
    },
    onSuccess: (data) => {
      // console.log("캐싱된 데이터", data);
    },
  }),
});
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>
  <CookiesProvider>
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </RecoilRoot>
  </CookiesProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
