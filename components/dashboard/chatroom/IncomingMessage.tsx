import React from "react";
import * as Interfaces from "../../../lib/interfaces";
import GroupMessage from "./groupMessage";

function IncomingMessage(props: {
	message: Interfaces.MessageType;
	prevComingId: boolean;
	nextComingId: boolean;
	hrs: number | string;
	mins: number | string;
	cur: Date;
	pre: Date | null;
	i: number;
	target: HTMLElement;
}) {
	const {
		message,
		prevComingId,
		nextComingId,
		hrs,
		mins,
		cur,
		pre,
		i,
		target,
	} = props;
	const className = `incoming-message ${
		prevComingId
			? nextComingId
				? "adjust"
				: "adjust-pd"
			: nextComingId
			? "adjust-mg"
			: ""
	}`;
	const time = hrs + ":" + mins;

	console.log({
		node: target.closest(".chat").children[0].innerHTML,
	});
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
						<div
							className="avatar user_image list_item"
							dangerouslySetInnerHTML={{
								__html: String(
									target.closest(".chat").children[0]
										.innerHTML
								),
							}}
						/>
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
