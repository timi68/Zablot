/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-css-tags */
import React, {useEffect, useRef, useContext, useState} from "react";
import Layout from "../../src/AppLayout";
import {AppContext} from "../../lib/context";
import NoSession from "../../components/nosession";
import EditQuestion from "../../components/createQuiz/editQuestion";
import CreateQuestion from "../../components/createQuiz/createQuestion";
import UploadQuestions from "../../components/createQuiz/uploadQuestions";
import CreatedQuestions from "../../components/createQuiz/createdQuestions";
import {Container, CircularProgress} from "@mui/material";
import axios from "axios";
import {useSnackbar} from "notistack";
import * as Interfaces from "../../lib/interfaces";

function QuizCreator(props: {user: string | number}) {
	const {
		state: {loggedIn, user, socket},
		dispatch,
	} = useContext(AppContext);
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const uploadQuestionsRef = useRef<HTMLDivElement & Interfaces.Handle>(null);
	const editingQuestionRef = useRef<HTMLDivElement & Interfaces.Handle>(null);
	const createdQuestionsRef = useRef<HTMLDivElement & Interfaces.Handle>(
		null
	);
	// const [upload, setUpload] = useState<boolean>(false);

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

						dispatch({
							type: Interfaces.ActionType.FETCHED,
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
	}, []);

	if (loggedIn && user && socket) {
		return (
			<Layout title="Zablot | Create Quiz" loggedIn={loggedIn}>
				<UploadQuestions ref={uploadQuestionsRef} />
				<CreateQuestion setQuestion={createdQuestionsRef} />
				<CreatedQuestions
					ref={createdQuestionsRef}
					edit={editingQuestionRef}
					upload={uploadQuestionsRef}
				/>
				<EditQuestion
					ref={editingQuestionRef}
					setQuestion={createdQuestionsRef}
				/>
			</Layout>
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

export default QuizCreator;
