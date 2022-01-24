import React from "react";
import {Socket} from "socket.io-client";
import Time from "../../../utils/CalculateTime";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Stack from "@mui/material/Stack";

type RoomHeaderPropsType = {
	socket: Socket;
	UpdateRooms(): void;
	target: HTMLElement;
	_id: string;
};
function RoomHeader(props: RoomHeaderPropsType) {
	const {socket, target, _id, UpdateRooms} = props;

	const statusRef = React.useRef<HTMLDivElement>();
	const userImageRef = React.useRef<HTMLDivElement>();

	const _callback$Status = React.useCallback(
		(data: {_id: string; online: boolean; Last_Seen: Date}) => {
			console.log({data, _id, text: statusRef.current.innerHTML});
			if (data._id === _id) {
				statusRef.current.innerHTML = data.online
					? "online"
					: `last seen ${Time(data.Last_Seen)}`;

				if (data.online) {
					userImageRef.current
						.querySelector(".user_active_signal")
						.classList.remove("offline");
				} else {
					userImageRef.current
						.querySelector(".user_active_signal")
						.classList.add("offline");
				}
			}
		},
		[_id]
	);

	React.useEffect(() => {
		socket.on("STATUS", _callback$Status);

		return () => {
			socket.off("STATUS", _callback$Status);
		};
	}, [_callback$Status, socket]);

	return (
		<div className="room-header">
			<div className="profile">
				<div
					className="avatar user_image list_item"
					ref={userImageRef}
					dangerouslySetInnerHTML={{
						__html: String(
							target.closest(".chat").children[0].innerHTML
						),
					}}
				/>
				<div className="name">
					<span className="textname">james</span>
					<div className="active-sign">
						<div className="active-text" ref={statusRef}>
							online
						</div>
					</div>
				</div>
				<div className="options">
					<div className="options-list">
						<div className="option navigate"></div>
					</div>
				</div>
			</div>
			<Stack direction="row" spacing={1}>
				<IconButton
					size="small"
					className="toggle-menu icon"
					data-role="toggle room menu"
				>
					<MoreVertIcon fontSize="small" />
				</IconButton>
				<IconButton
					size="small"
					onClick={UpdateRooms}
					className="close-card icon"
					data-role="close room"
				>
					<CancelIcon fontSize="small" />
				</IconButton>
			</Stack>
		</div>
	);
}

export default RoomHeader;
