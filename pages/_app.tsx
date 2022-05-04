/* eslint-disable @next/next/no-css-tags */
import NProgress from "nprogress";
import Router from "next/router";
import "nprogress/nprogress.css";
import "../styles/main.scss";
import "../styles/chatboard.scss";
import "../styles/createQuiz.scss";
import "../styles/pastQuestions.scss";
import "../styles/attemptQuiz.scss";
import AppContextProvider from "../lib/context/appContext";
import { AppProps } from "next/app";

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
    <AppContextProvider>
      <Component {...pageProps} />
    </AppContextProvider>
  );
}

export default MyApp;
