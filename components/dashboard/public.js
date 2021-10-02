/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/link-passhref */
/* eslint-disable @next/next/no-img-element */
// @ts-check
import Link from "next/link";
import { useEffect, useState, useRef, useContext, useCallback } from "react";
import j from "jquery";
import { SocketContext } from "../../lib/socket";
import React from "react";
import { v4 as uuid } from "uuid";

function Public() {
	const { socket, props, user } = useContext(SocketContext);
	const wrapper = useRef(null);
	const [skipper, setSkipper] = useState(null);
	const [pub, setPublic] = useState([]);
	const defaultImage = "/media/1.4b0d09c4.jpg";

	const handleClick = (/** @type {any} */ id) => {
		const friend_request = {
			FullName: user.FullName,
			UserName: user.UserName,
			from: props?.user.id,
			to: id,
			url: defaultImage,
		};

		socket.emit("FRIEND_REQUEST", friend_request, (res) => {
			console.log(res);
		});
	};
	async function FetchUser() {
		const request = await fetch("/api/users", {
			method: "POST",
			body: JSON.stringify({ skipper }),
			headers: {
				"Content-Type": "application/json",
			},
		});

		const users_res = await request.json();
		if (users_res.length > 0) {
			setPublic(users_res);
		}
	}

	useEffect(() => {
		FetchUser();
	}, []);

	console.log("Public is called");
	return (
		<div className="chat_flex3">
			<div className="public_users_wrapper">
				<div className="toast wrap_me">
					<header className="public_header">
						<div className="public_user_header">
							<h5 className="title">Add new friends..</h5>
							<div className="toggle_wrap">
								<span className="tog_pub">
									<i className="ion-ios-arrow-forward "></i>
								</span>
							</div>
						</div>
					</header>
					<div className="search_wrapper">
						<form action="" className="pub_form">
							<input
								type="search"
								placeholder="Search..."
								className="form-control"
								name="search_value"
								id=""
							/>
							<aside className="btn" id="btn_toggle">
								<i className="ion-ios-search"></i>
							</aside>
						</form>
					</div>
					<div className="public_container">
						<div className="public_wrapper" ref={wrapper}>
							{pub.map((user) => {
								const key = uuid();
								if (user._id != props.user.id) {
									return (
										<div
											className="public_preview_profile"
											key={key}
										>
											<div className="left">
												<div className="public_image">
													<Link href="#">
														<img
															src={
																user.image_url ||
																defaultImage
															}
															className="userImage"
															alt={user.UserName}
														/>
													</Link>
												</div>
												<div className="public_name_wrapper">
													<div className="public_real_name">
														{user.FullName}
													</div>
													<div className="public_user_name">
														@{user.UserName}
													</div>
												</div>
											</div>

											<div className="right">
												<div className="add_wrapper">
													<button
														className="send_request"
														key={key}
														onClick={() =>
															handleClick(
																user._id
															)
														}
													>
														Add Friend
													</button>
												</div>
											</div>
										</div>
									);
								}
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export async function getServerSideProps({ req, res }) {
	const user = req.session.user;

	console.log(user, "from public server side");
	return {
		props: {
			user,
		},
	};
}
export default Public;
