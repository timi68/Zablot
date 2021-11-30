/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
// @ts-check
import React, {
	useEffect,
	useRef,
	useState,
	useContext,
	useCallback,
} from "react";
import {SocketContext} from "../../../lib/socket";
import ChatRoom from "../ChatRoom";
import j from "jquery";
import {v4 as uuid} from "uuid";

function SearchBar() {
	const {socket, props, user} = useContext(SocketContext);
	const [matched, setMatched] = useState(null);
	const [skipper, setSkipper] = useState(null);
	const [pending, setPending] = useState(user?.PendingRequests || []);
	const [friends, setFriends] = useState(user?.Friends || []);
	const defaultImage = "./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg";
	const searchbar = useRef(null);

	const SearchBox = function () {
		const media_649 = window.innerWidth > 649;

		if (!j(".search-results").hasClass("show"))
			j(document).find(".show").removeClass("show");
		if (j(".search-results").hasClass("show")) return;
		if (media_649 === false) {
			j(".search-results").toggleClass("show");

			j("#search").fadeOut();
			setTimeout(() => {
				j(this)
					.parent()
					.toggleClass("not-focus focus-input")
					.find("#search")
					.toggleClass("active");
				j("#search").fadeIn().find("#form-control").focus();
			}, 500);
			return;
		} else {
			j(".search-results").toggleClass("show");
		}
	};

	const Close = function () {
		const media_649 = window.innerWidth > 649;
		if (media_649 === false) {
			j("#search").fadeOut().find("#form-control").val("");
		}
		j("#search").find("#form-control").val("");
		j(".search-results")
			.animate(
				{
					width: "0px",
					height: "0px",
				},
				500
			)
			.promise()
			.done(function () {
				j(".search-results").removeClass("show").attr("style", "");
				if (matched?.length) {
					setMatched([]);
				}
			});
		if (!media_649) {
			setTimeout(() => {
				j(this)
					.parents(".focus-input")
					.toggleClass("not-focus focus-input");
				j("#search").removeClass("active");
				j("#search").fadeIn();
			}, 1000);
		}
		j(".search-icon").off("click", Search);
	};

	const Search = () => {
		const searchText = j(searchbar.current).val();
		if (searchText != "") {
			const data = {searchText, id: props?.user.id};

			// @ts-ignore
			j.ajax({
				url: `/api/search`,
				type: "POST",
				data: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json",
				},
				success: (matched) => {
					if (matched?.length) {
						const friendsId = friends.map(
							(/** @type {{ Id: any; }} */ user) => user.Id
						);
						matched = matched.filter((user) => {
							if (user._id != props.user.id) {
								if (pending.includes(user._id)) {
									user.sent = true;
								}
								if (friendsId.includes(user._id)) {
									user.friends = true;
								}
								return user;
							}
						});
						setMatched(matched);
					}
				},
				error: (i, j, x) => {
					console.log(j, x);
				},
			});
		}
	};

	/**
	 * @param {String} id
	 * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e
	 */
	function processAdd(id, e) {
		const friend_request = {
			FullName: user.FullName,
			UserName: user.UserName,
			From: props?.user.id,
			To: id,
			Image: defaultImage,
		};

		socket.emit(
			"FRIEND_REQUEST",
			friend_request,
			(/** @type {any} */ res) => {
				setPending([id, ...pending]);
				setMatched((/** @type {any[]} */ state) => {
					state = state.map(
						(/** @type {{ _id: any; sent: boolean; }} */ user) => {
							if (user._id === id) user.sent = true;
							return user;
						}
					);
					return state;
				});
			}
		);
	}

	/**
	 * @param {Object} user
	 * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e
	 */
	function processFriend(user, e) {
		ChatRoom({j, user, from: props?.user.id, e, socket});
	}

	/**
	 * @param {String} to
	 * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e
	 */
	function processCancel(to, e) {
		const data = {from: props.user.id, to};
		socket.emit("CANCELREQUEST", data, (err) => {
			if (!err) {
				setMatched((/** @type {any[]} */ state) => {
					state = state.map((user) => {
						if (user._id === to) {
							user.sent = false;
						}
						return user;
					});

					return state;
				});
				setPending((/** @type {any[]} */ state) => {
					state = state.filter((id) => id !== to);
					return state;
				});
			} else {
				console.log(err);
			}
		});
	}

	const NewFriend = useCallback(
		(data) => {
			console.log(data);
			if (data?.IsComing) {
				setFriends([data, ...friends]);
				setPending((state) => {
					return (state = state.filter((user) => user !== data.Id));
				});
				if (matched.length > 0) {
					console.log(data, "IsComing");
					setMatched((state) => {
						const newstate = state.map((user) => {
							if (user._id === data.Id) {
								user.sent = false;
								user.friends = true;
							}
							return user;
						});
						return newstate;
					});
				}
			}
		},
		[matched]
	);

	useEffect(() => {
		j(window).resize(function () {
			const media_649 = window.innerWidth > 649;
			const is_visible = j(".search-results").hasClass("show");
			if (!media_649 && is_visible) j("#search").addClass("active");
			if (media_649 && is_visible) j("#search").removeClass("active");
		});

		return () => {
			j(window).off();
		};
	}, []);

	useEffect(() => {
		console.log("Mounting");
		if (socket) {
			socket.on("NEWFRIEND", NewFriend);
		}

		return () => {
			socket.off("NEWFRIEND", NewFriend);
		};
	}, [socket, matched]);

	console.log(matched, friends, pending);
	console.log("mounting from searchbar");
	return (
		<div className="search-container not-focus">
			<div className="search-results fetched matched">
				<div className="listed-matched">
					<div className="header">
						<div className="close-btn modal">
							<div className="close" onClick={Close.bind(Close)}>
								<span>Close</span>
							</div>
						</div>
						<div className="title">
							<div className="text">Matched Results</div>
						</div>
					</div>
					<ul className="matched users">
						{matched?.length
							? matched.map(
									(
										/** @type {{ FullName: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal; UserName: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal; friends: any; sent: any; _id: any; }} */ user
									) => {
										var key = uuid();
										return (
											<li className="user" key={key}>
												<div className="user-profile">
													<div className="user-image">
														<div className="image-wrapper">
															<img
																src="./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"
																alt="user-image"
																className="image"
															/>
														</div>
													</div>
													<div className="user-name">
														<div className="name">
															<span>
																{user.FullName}
															</span>
														</div>
														<div className="username">
															<span>
																{user.UserName}
															</span>
														</div>
													</div>
												</div>
												<div className="friend-reject-accept-btn btn-wrapper">
													{user.friends ? (
														<button
															className="add btn"
															onClick={(e) => {
																processFriend(
																	user,
																	e
																);
															}}
														>
															message
														</button>
													) : user.sent ? (
														<button
															className="add btn"
															onClick={(e) => {
																processCancel(
																	user._id,
																	e
																);
															}}
														>
															Cancel request
														</button>
													) : (
														<button
															className="add btn"
															onClick={(e) => {
																processAdd(
																	user._id,
																	e
																);
															}}
														>
															Add friend
														</button>
													)}
												</div>
											</li>
										);
									}
							  )
							: ""}
					</ul>
				</div>
			</div>
			<div className="search-text-box" id="search" onClick={SearchBox}>
				<form action="#" className="search-form">
					<div className="search-icon" onClick={Search}>
						<svg
							height="20px"
							viewBox="0 0 24 24"
							width="20px"
							fill="#000000"
						>
							<path d="M0 0h24v24H0V0z" fill="none" />
							<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
						</svg>
					</div>
					<div className="form-group">
						<input
							type="text"
							ref={searchbar}
							className="form-control"
							id="form-control"
							placeholder="Search a friend.."
							autoComplete="off"
						/>
					</div>
				</form>
			</div>
		</div>
	);
}

export default SearchBar;
