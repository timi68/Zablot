/* eslint-disable @next/next/no-css-tags */
import NProgress from "nprogress";
import Router from "next/router";

import { Provider } from "react-redux";
import store from "@lib/redux/store";
import AppContextProvider from "@lib/context/appContext";
import { AppProps } from "next/app";

// styles
import "antd/dist/antd.css";
import "nprogress/nprogress.css";
import "../styles/header.scss";
import "../styles/sidebar.scss";
import "../styles/main.scss";
import "../styles/chatboard.scss";
import "../styles/createQuiz.scss";
import "../styles/pastQuestions.scss";
import "../styles/attemptQuiz.scss";
import "../styles/global.css";

function MyApp({ Component, pageProps }: AppProps) {
  NProgress.configure({
    minimum: 0.3,
    easing: "ease",
    speed: 800,
    showSpinner: false,
  });

  Router.events.on("routeChangeStart", () => NProgress.start());
  Router.events.on("routeChangeComplete", () => NProgress.done());
  Router.events.on("routeChangeError", () => NProgress.done());

  return (
    <Provider store={store}>
      <AppContextProvider>
        <Component {...pageProps} />
      </AppContextProvider>
    </Provider>
  );
}

export default MyApp;
