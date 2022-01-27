/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import * as Interfaces from "../../../lib/interfaces";
import IncomingMessage from "./IncomingMessage";
import OutgoingMessage from "./OutgoingMessage";
import j from "jquery";
import {Socket} from "socket.io-client";
import axios from "axios";
import {Container, CircularProgress} from "@mui/material";
import OutgoingForm from "./OutgoingForm";
import IncomingForm from "./IncomingForm";
import IncomingImage from "./IncomingImage";
import OutgoingImage from "./OutgoingImage";

const RoomBody: React.ForwardRefExoticComponent<{
	messages: Interfaces.MessageType[];
	user: Interfaces.Friends;
	ref: React.Ref<Interfaces.RoomBodyRefType>;
	socket: Socket;
	target: HTMLElement;
	chatboard: React.RefObject<Interfaces.AppChatBoardType>;
	loaded: boolean;
	coming: string;
}> = React.forwardRef((props, ref) => {
	// ----------------------------------------------

	const {user, messages: y, socket, chatboard, coming, loaded} = props;
	const [messageData, setMessageData] = React.useState<{
		messages: Interfaces.MessageType[];
		type?: "in" | "out" | "loaded";
	}>({
		messages: y,
		type: "loaded",
	});
	const [loading, setLoading] = React.useState<boolean>(!loaded);

	const bodyRef = React.useRef<HTMLDivElement>();
	const Alert = React.useRef<HTMLDivElement>();

	const _callback$Incoming = React.useCallback(
		(message: Interfaces.MessageType) => {
			console.log({message});
			if (message.coming !== user.Id) return;
			setMessageData((prevState) => {
				return {
					type: "in",
					messages: [...prevState.messages, message],
				};
			});
			chatboard.current.SetLastMessage(
				message.coming,
				message?.message ?? "Poll",
				user.Id
			);
		},
		[chatboard, user.Id]
	);

	type DataType = {
		messageId: string;
		OptionPicked: {text: string; checked: boolean};
	};

	const _callback$Answered = React.useCallback(
		(data: DataType) => {
			setMessageData((prevData) => {
				const messages: Interfaces.MessageType[] =
					prevData.messages.map((message) => {
						if (message._id === data.messageId) {
							message.answered = data.OptionPicked;
							processCoin(
								message.coin,
								data.OptionPicked.checked
							);
						}
						return message;
					});
				return {messages};
			});
		},
		[setMessageData]
	);

	const _callback$NoAnswer = React.useCallback(
		(data: DataType) => {
			setMessageData((prevData) => {
				const messages: Interfaces.MessageType[] =
					prevData.messages.map((message) => {
						if (message._id === data.messageId) {
							message.noAnswer = true;
							processCoin(
								message.coin,
								data.OptionPicked.checked
							);
						}
						return message;
					});
				return {messages, type: "in"};
			});
		},
		[setMessageData]
	);

	function processCoin(coinAdded: number, checked: boolean) {
		console.log({coinAdded, checked});
		const coinTagName: HTMLSpanElement =
			document.querySelector(".coin-wrapper span");

		if (coinAdded) {
			var coin: number = parseInt(coinTagName.innerText);

			var count: number = 0;
			var interval: NodeJS.Timer;
			interval = setInterval(() => {
				if (checked) coin--;
				else coin++;

				coinTagName.innerText = coin as unknown as string;
				count++;

				if (count >= coinAdded) {
					clearInterval(interval);
				}
			}, 100);
		}
	}

	const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
		const target = e.target as HTMLDivElement;
		if (target.scrollTop >= target.scrollHeight - 180) {
			j(Alert.current).removeClass("show").text(0);
		}
	};

	React.useEffect(() => {
		// setMessageData({messages: y, type: "loaded"});
		if (!loading) {
			switch (messageData.type) {
				case "out":
				case "loaded":
					j(bodyRef.current).animate(
						{
							scrollTop: bodyRef.current.scrollHeight,
						},
						"slow"
					);
					break;
				case "in":
					let scrollTop = bodyRef.current.scrollTop;
					let scrollHeight = bodyRef.current.scrollHeight;

					if (scrollHeight - scrollTop > 230) {
						let downMessages = parseInt(j(Alert.current).text());

						j(Alert.current)
							.text(downMessages + 1)
							.addClass("show");
					} else
						j(bodyRef.current).animate(
							{
								scrollTop: bodyRef.current.scrollHeight,
							},
							"slow"
						);
					break;
				default:
					break;
			}
		}
	}, [messageData, loading]);

	React.useEffect(() => {
		if (!loaded) {
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
					}),
						setLoading(false);
				} catch (error) {
					console.log({error});
				}
			})();
		}

		// Socket handler; socket listener set when each group in created
		// they are also removed when user close the room
		socket.on("INCOMINGMESSAGE", _callback$Incoming);
		socket.on("INCOMINGFORM", _callback$Incoming);
		socket.on("ANSWERED", _callback$Answered);
		socket.on("NOANSWER", _callback$NoAnswer);

		return () => {
			// All this listener will be off when the user close
			// the chat room
			socket.off("INCOMINGMESSAGE", _callback$Incoming);
			socket.off("INCOMINGFORM", _callback$Incoming);
			socket.off("ANSWERED", _callback$Answered);
			socket.off("NOANSWER", _callback$NoAnswer);
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
				const newMessages = [...messageData.messages, message];
				setMessageData(() => ({
					messages: newMessages,
					type,
				}));
			},
		}),
		[messageData]
	);

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
					<CircularProgress size={30} thickness={3} />
				</Container>
			</div>
		);
	}

	return (
		<div className="room-body" ref={bodyRef} onScroll={handleScroll}>
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
					j(Alert.current).removeClass("show").text(0);
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

				const nextComingId: boolean =
					i > 0 && i < messageData.messages.length - 1
						? messageData.messages[i + 1].coming === data.coming
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
								return (
									<IncomingForm
										message={data}
										messagesId={user._id}
										going={user.Id}
										coming={coming}
										key={i}
										nextComingId={nextComingId}
										hrs={hrs}
										mins={mins}
										cur={cur}
										pre={pre}
										setMessageData={setMessageData}
										i={i}
										socket={
											data.answered?.text ? null : socket
										}
									/>
								);
							case "plain":
								return (
									<IncomingMessage
										message={data}
										key={i}
										nextComingId={nextComingId}
										hrs={hrs}
										mins={mins}
										cur={cur}
										pre={pre}
										i={i}
									/>
								);
							case "image":
								return (
									<IncomingImage
										message={data}
										messagesId={user._id}
										key={i}
										nextComingId={nextComingId}
										setMessageData={setMessageData}
										hrs={hrs}
										mins={mins}
										cur={cur}
										pre={pre}
										i={i}
									/>
								);
							default:
								return;
						}

					default:
						switch (data.Format) {
							case "Form":
								return (
									<OutgoingForm
										key={i}
										message={data}
										nextGoingId={nextGoingId}
										hrs={hrs}
										mins={mins}
										cur={cur}
										pre={pre}
										i={i}
										setMessageData={setMessageData}
										socket={
											data.answered?.text ? null : socket
										}
									/>
								);
							case "plain":
								return (
									<OutgoingMessage
										key={i}
										message={data}
										nextGoingId={nextGoingId}
										hrs={hrs}
										mins={mins}
										cur={cur}
										pre={pre}
										i={i}
									/>
								);
							case "image":
								return (
									<OutgoingImage
										key={i}
										message={data}
										messagesId={user._id}
										going={user.Id}
										coming={coming}
										nextGoingId={nextComingId}
										hrs={hrs}
										mins={mins}
										cur={cur}
										pre={pre}
										i={i}
										setMessageData={setMessageData}
										socket={
											data.answered?.text ? null : socket
										}
									/>
								);
							default:
								return;
						}
				}
			})}

			{!messageData.messages.length && (
				<div className="empty-messages">
					<div className="text">Be the first to send message</div>
				</div>
			)}
		</div>
	);
});
RoomBody.displayName = "RoomBody";

export default RoomBody;
