/* eslint-disable react/no-unescaped-entities */
import React from "react";
import {MessageType} from "../../../lib/interfaces";
import GroupMessage from "./GroupMessage";
import {Socket} from "socket.io-client";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import Chip from "@mui/material/Chip";

function OutgoingForm(props: {
	message: MessageType;
	nextGoingId: boolean;
	hrs: number | string;
	mins: number | string;
	cur: Date;
	pre: Date | null;
	i: number;
	socket: Socket | null;
	setMessageData: React.Dispatch<
		React.SetStateAction<{
			messages: MessageType[];
			type: "in" | "out" | "loaded";
		}>
	>;
}) {
	console.log(props);

	const {
		nextGoingId,
		message,
		hrs,
		mins,
		cur,
		pre,
		i,
		socket,
		setMessageData,
	} = props;
	const FormRef = React.useRef<HTMLDivElement>(null);

	const time = hrs + ":" + mins;
	console.log({cur, pre});
	const Group = GroupMessage({cur, pre, i});

	type DataType = {
		messageId: string;
		OptionPicked: {text: string; checked: boolean};
	};

	const _callback$Answered = React.useCallback(
		(data: DataType) => {
			setMessageData((prevData) => {
				const messages: MessageType[] = prevData.messages.map(
					(message) => {
						if (message._id === data.messageId) {
							message.answered = data.OptionPicked;
						}
						return message;
					}
				);
				return {messages, type: "in"};
			});

			const pollCoinAdded: number = message.coin;
			const coinTagName: HTMLSpanElement =
				document.querySelector(".coin-wrapper span");

			if (pollCoinAdded) {
				var coin: number = parseInt(coinTagName.innerText);

				var count: number = 0;
				var interval: NodeJS.Timer = setInterval(() => {
					if (data.OptionPicked.checked) coin--;
					else coin++;

					coinTagName.innerText = coin as unknown as string;
					count++;

					if (count == pollCoinAdded) {
						clearInterval(interval);
					}
				}, 100);
			}
		},
		[message.coin, setMessageData]
	);

	const _callback$NoAnswer = React.useCallback(
		(data: DataType) => {
			setMessageData((prevData) => {
				const messages: MessageType[] = prevData.messages.map(
					(message) => {
						if (message._id === data.messageId) {
							message.noAnswer = true;
						}
						return message;
					}
				);
				return {messages, type: "in"};
			});

			const pollCoinAdded: number = message.coin;
			const coinTagName: HTMLSpanElement =
				document.querySelector(".coin-wrapper span");

			if (pollCoinAdded) {
				var coin: number = parseInt(coinTagName.innerText);

				var count: number = 0;
				var interval: NodeJS.Timer;
				interval = setInterval(() => {
					coin++;

					coinTagName.innerText = coin as unknown as string;
					count++;

					if (count == pollCoinAdded) {
						clearInterval(interval);
					}
				}, 100);
			}
		},
		[message.coin, setMessageData]
	);

	React.useLayoutEffect(() => {
		if (socket) {
			socket.on("ANSWERED", _callback$Answered);
			socket.on("NOANSWER", _callback$NoAnswer);
		}

		if (Boolean(message?.answered)) {
			if (FormRef.current) {
				FormRef.current.scrollIntoView({
					behavior: "smooth",
					block: "nearest",
				});
			}
		}

		return () => {
			if (socket) {
				socket.off("ANSWERED", _callback$Answered);
				socket.on("NOANSWER", _callback$NoAnswer);
			}
		};
	}, [_callback$Answered, _callback$NoAnswer, message?.answered, socket]);

	const className = `outgoing-message outgoing-form${
		nextGoingId ? " adjust-mg" : ""
	} `;
	const formMessageClass = `form-message poll question${
		Boolean(message?.answered)
			? message.answered?.checked
				? " correct before"
				: " failed before"
			: message?.noAnswer
			? " no-answer-picked before"
			: ""
	}`;

	return (
		<React.Fragment>
			{Group && (
				<div className="group">
					<span>{Group}</span>
				</div>
			)}
			<div
				className={className}
				id={message._id.slice(4, 12)}
				ref={FormRef}
			>
				<div className={formMessageClass} id={message._id.slice(4, 12)}>
					<div className="form-group">
						<div className="poll-question">
							<div className="poll-question-header">
								{message.timer && (
									<div className="timer">
										<Chip
											className="time-count"
											avatar={
												<AccessTimeOutlinedIcon fontSize="small" />
											}
											label={message.timer}
											variant="filled"
										/>
									</div>
								)}
								{message.coin && (
									<div className="coin-added">
										<Chip
											className="time-count"
											avatar={
												<MonetizationOnIcon fontSize="small" />
											}
											label={message.coin}
											variant="filled"
										/>
									</div>
								)}
							</div>
							<div className="text" id="question">
								{message.question}
							</div>
						</div>
						<div className="poll-options">
							<ul className="options">
								{message.options.map((option, i) => {
									const optionClassName = `option${
										Boolean(message?.answered) &&
										option.checked
											? " correct"
											: option.text ===
											  message.answered?.text
											? message.answered?.checked
												? " correct"
												: " failed"
											: ""
									}`;

									return (
										<li className={optionClassName} key={i}>
											<div className="form-group">
												<input
													type="radio"
													name={option.text}
													id="option"
													readOnly
													className="option"
													checked={option.checked}
												/>
											</div>
											<div className="option-text label">
												<label>{option.text}</label>
											</div>
										</li>
									);
								})}
							</ul>
						</div>
					</div>
					<span className="time">
						<small>{time}</small>
					</span>
				</div>
			</div>
		</React.Fragment>
	);
}

export default OutgoingForm;
