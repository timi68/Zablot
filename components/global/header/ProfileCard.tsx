/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, {useEffect, useContext, useState, useCallback} from "react";
import {motion} from "framer-motion";
import {IconButton} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import {ModalContext, AppContext} from "../../../lib/context";
import j from "jquery";
import {CSSTransition} from "react-transition-group";

function ProfileCard() {
	const {
		state: {user},
	} = useContext(AppContext);
	const modalSignal = useContext(ModalContext);
	const [expand, setExpand] = useState(false);

	const handleClick = () => {
		if (!expand) return;
		setExpand(false);
		j(modalSignal.current).removeClass("show");
	};

	useEffect(() => {
		const modal = modalSignal?.current;
		j(modalSignal?.current).on("click", handleClick);
		return () => {
			j(modal).off("click", handleClick);
		};
	}, [expand, handleClick, modalSignal]);

	const handleOpen = () => {
		if (!expand) {
			j(modalSignal?.current).trigger("click").addClass("show");
		} else {
			j(modalSignal?.current).removeClass("show");
		}
	};

	return (
		<div className="profile-link-wrapper">
			<IconButton
				size="medium"
				className="open"
				onClick={() => {
					setExpand(!expand);
					handleOpen();
				}}
			>
				{expand ? (
					<ArrowDropUpIcon fontSize="medium" />
				) : (
					<ArrowDropDownIcon fontSize="medium" />
				)}
			</IconButton>
			<CSSTransition timeout={200} in={expand} unmountOnExit>
				<motion.div
					animate={{
						opacity: 1,
					}}
					transition={{duration: 0.2}}
					className="profile-expand"
				>
					<div className="profile-header">
						<div className="profile_details">
							<div className="name">
								<p className="userfullname">{user?.FullName}</p>
								<div className="username">
									@{user?.UserName}
								</div>
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
			</CSSTransition>
		</div>
	);
}

export default ProfileCard;
