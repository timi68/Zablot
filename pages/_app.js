/* eslint-disable @next/next/no-css-tags */
import NProgress from "nprogress";
import Router from "next/router";
import "nprogress/nprogress.css";
import "../styles/main.scss";
import {SnackbarProvider} from "notistack";
import "../styles/chatboard.scss";
import "../styles/createQuiz.scss";
import "../public/fonts/index.css";
import AppContextProvider from "../lib/context/appContext";

function MyApp({Component, pageProps}) {
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
			<SnackbarProvider maxSnack={3} dense>
				<Component {...pageProps} />
			</SnackbarProvider>
		</AppContextProvider>
	);
}

export default MyApp;
