import React from "react";
import * as Interfaces from "../../../lib/interfaces";
import GroupMessage from "./GroupMessage";

function IncomingMessage(props: {
	message: Interfaces.MessageType;
	nextComingId: boolean;
	hrs: number | string;
	mins: number | string;
	cur: Date;
	pre: Date | null;
	i: number;
}) {
	const {message, nextComingId, hrs, mins, cur, pre, i} = props;
	const className = `incoming-message${
		nextComingId || i === 0 ? " adjust-mg" : ""
	}`;

	const time = hrs + ":" + mins;
	const Group = GroupMessage({cur, pre, i});

	return (
		<React.Fragment>
			{Group && (
				<div className="group">
					<span>{Group}</span>
				</div>
			)}
			<div className={className}>
				<div className="message-wrapper">
					<div className="plain-message">
						<div className="text">{message.message}</div>
						<span className="time">
							<small>{time}</small>
						</span>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

export default IncomingMessage;
