/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */
import {Fragment, useEffect, useContext, useState, useRef} from "react";
import {SocketContext} from "../../../lib/socket";
import {v4 as uuid} from "uuid";
import j from "jquery";
import GroupNotification from "../../../lib/GroupNotifications";

function Notifications() {
	const {socket, props, user} = useContext(SocketContext);
	const [notifications, setNotifications] = useState(
		user?.Notifications.sort(() => -1) || []
	);
	const [notseen, setNotseen] = useState(0);
	const Icon = () => {
		if (!j(".notifications-box").hasClass("show"))
			j(document).find(".show").removeClass("show expand");
		j(".notifications-box").prop("scrollTop", 0).toggleClass("show");
	};
	const Modal = () => {
		j(".request-box .close-modal").parents(".show").removeClass("show");
	};

	useEffect(() => {
		const UpdateNotification = (data) => {
			console.log(data);
			setNotifications([data, ...notifications]);
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
			<div className="unseen">0</div>
			<div
				className="notifications-icon icon"
				onClick={Icon}
				alt="Notification"
			>
				<svg
					height="20px"
					viewBox="0 0 24 24"
					width="20px"
					fill="#000000"
					className="svg"
				>
					<path d="M0 0h24v24H0V0z" fill="none" />
					<path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
				</svg>
			</div>
			<div className="notifications-box">
				<div className="notifications-header">
					<div className="title">
						<h3>Notifications</h3>
					</div>
					<div className="close-modal" onClick={Modal}>
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
									var current = new Date(
										notifications[i].Date
									).getDay();
									var previous =
										i > 0
											? new Date(
													notifications[i - 1].Date
											  ).getDay()
											: "";

									var key = uuid();
									return (
										<Fragment key={key}>
											<GroupNotification
												cur={current}
												pre={previous}
												i={i}
											/>
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
																<b>
																	From{" "}
																	{data.Name}
																</b>
															</span>
														</div>
													</div>
												</div>
											</li>
										</Fragment>
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
		</div>
	);
}

export default Notifications;
