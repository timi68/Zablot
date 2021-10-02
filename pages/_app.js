/* eslint-disable @next/next/no-css-tags */
import NProgress from "nprogress";
import Router from "next/router";
import "nprogress/nprogress.css";
import Head from "next/head";
import {Fragment} from "react";
import "../public/dist/css/icons.css";

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
		<Fragment>
			<Component {...pageProps} />
		</Fragment>
	);
}

export default MyApp;
