import React from "react";
import * as Interfaces from "../../../lib/interfaces";
import IncomingMessage from "./IncomingMessage";
import OutgoingMessage from "./OutgoingMessage";
import j from "jquery";
import {Socket} from "socket.io-client";
import axios from "axios";
import {Container, CircularProgress} from "@mui/material";

const RoomBody: React.ForwardRefExoticComponent<{
	messages: Interfaces.MessageType[];
	user: Interfaces.Friends;
	ref: React.Ref<Interfaces.RoomBodyRefType>;
	socket: Socket;
	target: HTMLElement;
	chatboard: React.RefObject<Interfaces.AppChatBoardType>;
}> = React.forwardRef((props, ref) => {
	const {user, messages: y, socket, chatboard, target} = props;
	const [messageData, setMessageData] = React.useState<{
		messages: Interfaces.MessageType[];
		type: "in" | "out" | "loaded";
	}>({
		messages: [],
		type: "out",
	});
	const [loading, setLoading] = React.useState<boolean>(false);

	const bodyRef = React.useRef<HTMLDivElement>();
	const Alert = React.useRef<HTMLDivElement>();

	console.log(props);

	const _callback$IncomingMessage = React.useCallback(
		(message: Interfaces.MessageType) =>
			setMessageData((prevState) => {
				console.log({prevState});
				chatboard.current.SetLastMessage(
					message.coming,
					message.message,
					user.Id
				);
				return {
					...prevState,
					messages: [...prevState.messages, message],
				};
			}),
		[]
	);

	React.useLayoutEffect(() => {
		setMessageData({messages: y, type: "loaded"});

		setTimeout(() => {
			j(bodyRef.current).animate(
				{
					scrollTop: bodyRef.current.scrollHeight,
				},
				"slow"
			);
		}, 300);
		// Socket handler; socket listener set when each group in created
		// they are also removed when user close the room

		socket.on("INCOMINGMESSAGE", _callback$IncomingMessage);
		// socket.on("STATUS", Status);
		// socket.on("INCOMINGFORM", IncomingForm);
		// socket.on("ANSWERED", ANSWERED);

		return () => {
			// All this listener will be off when the user close
			// the chat room
			socket.off("INCOMINGMESSAGE", _callback$IncomingMessage);
			// socket.off("STATUS", Status);
			// socket.off("INCOMINGFORM", IncomingForm);
			// socket.off("ANSWERED", ANSWERED);
		};
	}, [y, socket]);

	// creating a connection for this component with outside
	// component
	React.useImperativeHandle(
		ref,
		() => ({
			getMessages(): Interfaces.MessageType[] {
				return messageData.messages;
			},
			setMessages(message: Interfaces.MessageType, type) {
				setMessageData({
					...messageData,
					messages: [...messageData.messages, message],
					type,
				});

				switch (type) {
					case "out":
						j(bodyRef.current).animate(
							{
								scrollTop: bodyRef.current.scrollHeight,
							},
							"slow"
						);
						break;
					case "in":
						let scrollTop = j(bodyRef.current).prop("scrollTop");
						let scrollHeight = j(bodyRef.current).prop(
							"scrollHeight"
						);

						if (scrollHeight - scrollTop > 200) {
							let downMessages =
								parseInt(Alert.current.innerText) + 1;
							j(Alert.current)
								.text(downMessages)
								.addClass("show");
						}
				}
			},
		}),
		[messageData]
	);

	React.useEffect(() => {
		(async () => {
			try {
				const response = await axios.post<{
					_id: string;
					Message: Interfaces.MessageType[];
				}>("/api/messages", {
					_id: user._id,
				});
				setMessageData({
					messages: response.data.Message,
					type: "loaded",
				});
			} catch (error) {
				console.log({error});
			}
		})();
	}, []);

	if (loading) {
		return (
			<div className="room-body">
				<Container
					sx={{
						height: "100%",
						width: "100%",
						display: "grid",
						placeItems: "center",
					}}
				>
					<CircularProgress size="small" />
				</Container>
			</div>
		);
	}

	return (
		<div className="room-body" ref={bodyRef}>
			<div className="welcome-message">
				<div className="message">
					<span>You are now connected</span>
				</div>
			</div>
			<div
				className="alert-message"
				ref={Alert}
				onClick={() => {
					j(bodyRef.current).animate(
						{
							scrollTop: bodyRef.current?.scrollHeight,
						},
						"slow"
					);
				}}
			>
				0
			</div>
			{messageData.messages.map((data, i) => {
				const hrs: number | string =
					new Date(data.date).getHours().toString().length > 1
						? new Date(data.date).getHours()
						: "0" + new Date(data.date).getHours();
				const mins: number | string =
					new Date(data.date).getMinutes().toString().length > 1
						? new Date(data.date).getMinutes()
						: "0" + new Date(data.date).getMinutes();

				const prevComingId: boolean =
					i > 0
						? messageData.messages[i - 1].coming === data.coming
						: false;
				const nextComingId: boolean =
					i > 0 && i < messageData.messages.length - 1
						? messageData.messages[i + 1].coming === data.coming
						: false;

				const prevGoingId =
					i > 0
						? messageData.messages[i - 1].going === data.going
						: false;
				const nextGoingId =
					i > 0 && i < messageData.messages.length - 1
						? messageData.messages[i + 1].going === data.going
						: false;

				const cur: Date = new Date(data.date);
				const pre: Date | null =
					i > 0 ? new Date(messageData.messages[i - 1].date) : null;

				switch (data.coming) {
					case user.Id:
						switch (data.Format) {
							case "Form":
								return;
							case "plain":
								return (
									<IncomingMessage
										message={data}
										key={i}
										prevComingId={prevComingId}
										nextComingId={nextComingId}
										hrs={hrs}
										mins={mins}
										cur={cur}
										target={target}
										pre={pre}
										i={i}
									/>
								);
							case "image":
								return;
							default:
								return;
						}

					default:
						switch (data.Format) {
							case "Form":
								break;
							case "plain":
								return (
									<OutgoingMessage
										key={i}
										message={data}
										prevGoingId={prevGoingId}
										nextGoingId={nextGoingId}
										hrs={hrs}
										mins={mins}
										cur={cur}
										pre={pre}
										i={i}
									/>
								);
							case "image":
								break;
							default:
								return;
						}
				}
			})}
		</div>
	);
});
RoomBody.displayName = "RoomBody";

export default RoomBody;
