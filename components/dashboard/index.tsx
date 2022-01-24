import React from "react";
import UploadScreen from "./uploadsection";
import AppChatBoard from "./chatboard";
import {Friends, AppChatBoardType} from "../../lib/interfaces";
import ChatRoom from "./chatroom";

const DashboardComponent = React.forwardRef(function (props, ref) {
	const AppChatBoardRef = React.useRef<AppChatBoardType>(null);
	const ChatRoomRef =
		React.useRef<{OpenRoom(user: Friends, target: HTMLElement): void}>(
			null
		);
	React.useImperativeHandle(
		ref,
		() => ({
			UpdateFriends(friend: Friends) {
				AppChatBoardRef.current.UpdateFriends(friend);
			},
			toggle() {
				AppChatBoardRef.current.toggle();
			},
			getModalState() {
				AppChatBoardRef.current.getModalState();
			},
		}),
		[]
	);
	return (
		<React.Fragment>
			<section className="main-body wide center-content">
				<div className="posts social-feeds informations view-screen">
					<UploadScreen />
				</div>
				<ChatRoom ref={ChatRoomRef} chatBoard={AppChatBoardRef} />
			</section>
			<AppChatBoard ref={AppChatBoardRef} chatRoom={ChatRoomRef} />
		</React.Fragment>
	);
});

DashboardComponent.displayName = "DashboardComponentWrapper";

export default DashboardComponent;
