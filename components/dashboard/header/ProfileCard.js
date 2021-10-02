/* eslint-disable @next/next/no-img-element */
import React, {useEffect, useContext} from "react";
import {SocketContext} from "../../../lib/socket";
import j from "jquery";

function ProfileCard() {
	const {socket, props, user} = useContext(SocketContext);

	useEffect(() => {
		j(".profile-preview").bind("click", function (e) {
			j(document).find(".show").removeClass("show expand");
			j(".profile-link-wrapper").toggleClass("a");
		});
	}, []);

	return (
		<div className="profile-link-wrapper">
			<div className="profile-preview" alt="Profile card">
				<div className="preview-image-wrapper">
					<div className="user-profile-image image">
						<img
							src="./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"
							alt="user-profile-image"
							className="user-image"
						/>
					</div>
				</div>
				<div className="user-preview-name">
					<div className="user-preview-username">
						<div className="username">
							<span>@{user?.UserName}</span>
						</div>
					</div>
				</div>
			</div>
			<div className="profile-expand">
				<div className="profile-header">
					<div className="image-wrapper">
						<div className="user-profile-image image">
							<img
								src="./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"
								alt="user-profile-image"
								className="user-image"
							/>
						</div>
					</div>
					<div className="name-wrapper email-wrapper">
						<div className="name">
							<span className="userfullname">
								{user?.FullName}
							</span>
							<span className="username">@{user?.UserName}</span>
						</div>
						<div className="email">
							<span className="text">{user?.Email}</span>
						</div>
					</div>
				</div>
				<div className="profile-body">
					<ul className="profile-list"></ul>
				</div>
			</div>
		</div>
	);
}

export default ProfileCard;
