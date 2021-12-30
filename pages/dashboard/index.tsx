/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState, useContext, useCallback} from "react";
import AppLayout from "../../src/AppLayout";
import {AppContext} from "../../lib/context/appContext";
import {ActionType} from "../../lib/interfaces";
import DashboardComponent from "../../components/dashboard";
import axios from "axios";
import NoSession from "../../components/nosession";
import {CircularProgress, Container} from "@mui/material";
import {useSnackbar} from "notistack";

function Dashboard(props) {
	const {
		state: {user, socket, loggedIn},
		dispatch,
	} = useContext(AppContext);
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [error, setError] = useState(null);

	const handleJoined = useCallback(
		(id) => {
			console.log(id);
			const SOCKET_ID = id;
			const session = {
				USERID: user?._id,
				SOCKET_ID,
			};

			dispatch({
				type: ActionType.SESSION,
				payload: {
					session: {
						id: user?._id,
						socket_id: id,
					},
				},
			});

			socket?.emit("ADD_JOINED_REQUEST", session, (err, done) => {
				console.log(err || done);
			});
		},
		[socket]
	);

	useEffect(() => {
		if (!user || !socket || !loggedIn) {
			if (props?.user) {
				(async () => {
					try {
						let data = {id: props.user};
						const request = await axios.post(
							"/api/user/details",
							data
						);
						let user = await request.data;

						user.Notifications =
							user.Notifications[0].notifications;
						user.Friends = user.Friends[0].friends;
						user.FriendRequests = user.FriendRequests[0].requests;
						user.Settings = user.Settings[0].settings;

						console.log("this is from room", user);

						dispatch({
							type: ActionType.FETCHED,
							payload: {
								user,
								loggedIn: true,
							},
						});
					} catch (error) {
						enqueueSnackbar(error.message, {
							variant: "error",
						});
					}
				})();

				return;
			}
			axios.get("/logout").then((response) => {
				socket?.disconnect();
			});
			return;
		}

		if (socket) {
			socket?.on("userid", handleJoined);
			socket?.on("disconnect", () => {
				console.log("disconnected");
			});
			socket?.on("INCOMINGMESSAGE", (data) => {
				console.log(data);
			});
		}

		return () => {
			socket?.off();
		};
	}, [socket]);

	if (socket && user && loggedIn) {
		return (
			<AppLayout loggedIn={true} title="dashboard">
				<DashboardComponent />
			</AppLayout>
		);
	} else if (props?.user) {
		return (
			<Container
				sx={{
					width: "100vw",
					height: "100vh",
					display: "grid",
					placeItems: "center",
				}}
			>
				<CircularProgress />
				Loading...
			</Container>
		);
	} else {
		return <NoSession />;
	}
}

export async function getServerSideProps({req, res}) {
	const user = req.session.user;

	console.log("this is user", user);
	if (!user) {
		return {
			redirect: {
				permanent: false,
				destination: "/login",
			},
			props: {},
		};
	}

	return {
		props: {user},
	};
}

export default Dashboard;
