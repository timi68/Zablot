import SecurityIcon from "@mui/icons-material/Security";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import {Button, CardActionArea} from "@material-ui/core";
import Image from "next/image";
import * as Interface from "../../../lib/interfaces";

interface chats {
	friendId: string;
	user: Interface.Friends;
	open(
		user: Interface.Friends,
		e: React.MouseEvent<HTMLElement, MouseEvent>
	): void;
}
/**
 *
 */
function Chats({friendId, user, open}: chats): JSX.Element {
	return (
		<CardActionArea
			className="chats_listItem list_item chat"
			role="listitem"
			onClick={(e) => open(user, e)}
		>
			<div className="avatar user_image list_item" role="listitem">
				<Image
					src={"/images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"}
					alt={user.Name}
					layout="fill"
					role="img"
					className="image list_image"
				/>
				<div
					className={`badge user_active_signal ${
						user.active ? "" : " offline"
					}`}
				></div>
			</div>
			<div className="text" role="listitem">
				<div className="user_name primary_text">{user.Name}</div>
				<div className="last_message secondary_text">
					{user?.LastPersonToSendMessage === friendId && (
						<span>You: </span>
					)}
					{user.Last_Message === "Image" ? (
						<ImageOutlinedIcon fontSize="small" />
					) : (
						user.Last_Message
					)}
				</div>
			</div>
			{!!user.UnseenMessages && (
				<div className="unseenmessages badge">
					<span className="label count">{user.UnseenMessages}</span>
				</div>
			)}
		</CardActionArea>
	);
}

export default Chats;
