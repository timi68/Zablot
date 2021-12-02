/* eslint-disable @next/next/no-img-element */
import React, {useEffect, useContext, useState, useCallback} from "react";
import {motion} from "framer-motion";
import {SocketContext} from "../../../lib/socket";
import j from "jquery";

function ProfileCard() {
	const {user, modalSignal} = useContext(SocketContext);
	const [expand, setExpand] = useState(false);

	const handleClick = () => {
		if (!expand) return;
		setExpand(false);
	};

	useEffect(() => {
		const modal = modalSignal.current;
		j(modalSignal.current).on("click", handleClick);
		return () => {
			j(modal).off("click", handleClick);
		};
	}, [expand]);

	const handleOpen = () => {
		if (!expand) {
			j(modalSignal.current).trigger("click");
			j(modalSignal.current).addClass("show");
		} else {
			j(modalSignal.current).removeClass("show");
		}
	};

	return (
		<div className="profile-link-wrapper">
			<div
				className="profile-preview"
				alt="Profile card"
				onClick={() => {
					setExpand(!expand);
					handleOpen();
				}}
			>
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
			<motion.div
				animate={{
					opacity: expand ? 1 : 0.3,
					width: expand ? 200 : 0,
					height: expand ? 300 : 0,
				}}
				transition={{duration: 0.2}}
				className={expand ? "profile-expand expand" : "profile-expand"}
			>
				<div className="profile-header">
					<div className="profile_details">
						<div className="name">
							<p className="userfullname">{user?.FullName}</p>
							<div className="username">@{user?.UserName}</div>
						</div>
						<div className="email">
							<span className="text">{user?.Email}</span>
						</div>
					</div>
				</div>
				<div className="profile-body">
					<ul className="profile-list"></ul>
				</div>
			</motion.div>
		</div>
	);
}

export default ProfileCard;
