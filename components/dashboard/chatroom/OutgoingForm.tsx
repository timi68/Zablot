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
	const {nextGoingId, message, hrs, mins, cur, pre, i, socket} = props;
	const FormRef = React.useRef<HTMLDivElement>(null);

	console.log({message});
	const time = hrs + ":" + mins;
	const Group = GroupMessage({cur, pre, i});

	React.useLayoutEffect(() => {
		if (Boolean(message?.answered)) {
			if (FormRef.current) {
				FormRef.current.scrollIntoView({
					behavior: "smooth",
					block: "nearest",
				});
			}
		}
	}, [message?.answered, socket]);

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
												<MonetizationOnIcon fontSize="inherit" />
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
