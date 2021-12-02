/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-css-tags */
/* eslint-disable @next/next/link-passhref */
/* eslint-disable @next/next/no-img-element */
// @ts-check

import Head from "next/head";
import {useEffect, useState, useRef} from "react";
import AfterRender from "../../components/dashboard/after";
import {useSocket, SocketContext} from "../../lib/socket";
import j from "jquery";

function Dashboard(props) {
	const [user, setUser] = useState();
	const [error, setError] = useState(null);
	const [IsLoading, setIsLoading] = useState(true);
	const modalSignal = useRef(null);
	const socket = useSocket("/");

	const removeAllShowModal = () => {
		console.log("clicked");
		j(modalSignal.current).removeClass("show");
	};

	useEffect(() => {
		document.addEventListener("click", function (e) {
			const target = j(e.target).is(".profile-link-wrapper");
			const parents = j(e.target).parents();
			var count = 0;
			j(parents).each((e, i) => {
				if (j(i).is(".profile-link-wrapper")) count++;
			});
			if (count == 0) {
				j(document).find(".a").removeClass("a");
			}
		});

		// @ts-ignore
		j.ajax({
			url: "/api/user/details",
			type: "POST",
			contentType: "application/json",
			data: JSON.stringify({
				id: props?.user?.id,
			}),
		}).done((res) => {
			if (res?.Error) {
				setError(res.Error);
				return;
			}
			console.log(res);
			setUser(res);
			setTimeout(() => {
				setIsLoading(false);
			}, 1000);
		});
	}, []);

	useEffect(() => {
		const handleJoined = (id) => {
			console.log(id);
			const SOCKET_ID = id;
			const session = {
				USERID: props.user.id,
				SOCKET_ID,
			};

			socket.emit("ADD_JOINED_REQUEST", session, (err, done) => {
				console.log(err || done);
			});
		};

		if (socket) {
			socket.on("userid", handleJoined);
			socket.on("disconnect", () => {
				console.log("disconnected");
			});
			socket.on("INCOMINGMESSAGE", (data) => {
				console.log(data);
			});
		}
	}, [socket]);

	console.log("mounting from dashboard");

	// if (!props.user?.id) router.push("/login");
	return (
		<SocketContext.Provider value={{socket, props, user, modalSignal}}>
			<Head>
				<title>Dashboard</title>
			</Head>
			{IsLoading ? (
				<h1>Is Loading</h1>
			) : error ? (
				<h1>There is an error</h1>
			) : (
				<>
					<AfterRender />
					<div
						className="modal_open_signal"
						ref={modalSignal}
						onClick={removeAllShowModal}
					></div>
				</>
			)}
			{/* <Footer /> */}
		</SocketContext.Provider>
	);
}

export async function getServerSideProps({req, res}) {
	const user = req.session.user;

	if (!user) {
		req.session.flash = {Error: "The page is Protected"};
		res.statusCode = 302;
		res.setHeader("Location", "/login");

		return {
			props: {},
		};
	}

	return {
		props: {
			user: user || null,
			unlock: process.env.CRYPTO_36 || null,
			iv: process.env.CRYPTO_16,
		},
	};
}

export default Dashboard;
