/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import {AppContext, ModalContext} from "../../../lib/context";
import {v4 as uuid} from "uuid";
import j from "jquery";
import GroupNotification from "../../../utils/GroupNotifications";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import {CSSTransition} from "react-transition-group";
import {Badge, IconButton} from "@material-ui/core";
import {useSnackbar} from "notistack";
import * as Interfaces from "../../../lib/interfaces";

function Notifications() {
	const {
		state: {socket, user},
	} = React.useContext(AppContext);

	const modalSignal = React.useContext(ModalContext);
	const [openModal, setOpenModal] = React.useState(false);
	const [notifications, setNotifications] = React.useState<
		Interfaces.Notifications[0][]
	>(user?.Notifications || []);
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const IconButtonRef = React.useRef<HTMLButtonElement>(null);

	const handleClick = () => {
		if (!openModal) return;
		setOpenModal(false);
		modalSignal.current.classList.remove("show");
		IconButtonRef.current.classList.remove("active");
	};

	const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (!openModal)
			j(modalSignal?.current).trigger("click").addClass("show");
		else j(modalSignal?.current).removeClass("show");

		IconButtonRef.current.classList.toggle("active");
	};

	React.useEffect(() => {
		const modal = modalSignal?.current;
		j(modalSignal?.current).on("click", handleClick);
		return () => {
			j(modal).off("click", handleClick);
		};
	}, [openModal]);

	React.useEffect(() => {
		const UpdateNotification = (data: {
			Description: string;
			Name: string;
			title: string;
		}) => {
			console.log(data);
			setNotifications([data, ...notifications]);
			enqueueSnackbar(data.title, {
				variant: "info",
				anchorOrigin: {
					vertical: "bottom",
					horizontal: "left",
				},
			});
		};

		if (socket) {
			socket.on("Notifications", UpdateNotification);
		}

		return () => {
			socket.off("Notifications", UpdateNotification);
		};
	}, [socket]);

	console.log("mounting from notification");
	return (
		<div className="notifications-wrapper">
			<Badge color="default" badgeContent={0} showZero>
				<IconButton
					className="open"
					ref={IconButtonRef}
					onClick={(e) => {
						setOpenModal(!openModal);
						handleOpen(e);
					}}
				>
					<NotificationsActiveIcon fontSize="small" />
				</IconButton>
			</Badge>
			<CSSTransition
				in={openModal}
				timeout={200}
				classNames="notifications-box"
				unmountOnExit
			>
				<div className="notifications-box">
					<div className="notifications-header">
						<div className="title">Notifications</div>
						<div className="close-modal" onClick={handleClick}>
							<div className="close">
								<span>Close</span>
							</div>
						</div>
					</div>
					<div className="notifications-body">
						<div className="current">
							{notifications?.length ? (
								<div className="notifications-list">
									{notifications.map((data, i) => {
										var current = notifications[i].Date;
										var previous =
											i > 0
												? notifications[i - 1].Date
												: "";

										var key = uuid();
										return (
											<NotificationsPaper
												key={key}
												data={data}
												current={current}
												previous={previous}
												index={i}
											/>
										);
									})}
								</div>
							) : (
								<div className="empty_notification">
									<div className="empty-text">
										<p className="text">
											No Notification Available
										</p>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</CSSTransition>
		</div>
	);
}

function NotificationsPaper(props) {
	const {data, current, previous, index} = props;
	return (
		<React.Fragment>
			<GroupNotification cur={current} pre={previous} i={index} />
			<li className="notification">
				<div className="notification-image">
					<div className="image">
						<img
							src="./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"
							alt=""
						/>
					</div>
				</div>
				<div className="notification-body">
					<div className="notification-name title">
						<div className="notification-text text">
							<span
								dangerouslySetInnerHTML={{
									__html: data.Description,
								}}
							></span>
							<br />
							<span className="from">
								<b>From {data.Name}</b>
							</span>
						</div>
					</div>
				</div>
			</li>
		</React.Fragment>
	);
}

export default Notifications;
