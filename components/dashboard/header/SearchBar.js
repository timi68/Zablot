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
import {motion} from "framer-motion";
import j from "jquery";
import {v4 as uuid} from "uuid";

function SearchBar() {
	const {socket, props, user, modalSignal} = useContext(SocketContext);
	const [matched, setMatched] = useState(null);
	const [skipper, setSkipper] = useState(null);
	const [open, setOpen] = useState(false);
	const [pending, setPending] = useState(user?.PendingRequests || []);
	const [friends, setFriends] = useState(user?.Friends || []);
	const defaultImage = "./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg";
	const searchbar = useRef(null);
	const searchIcon = useRef(null);

	const SearchBox = function () {
		if (open) return;
		j(modalSignal.current).trigger("click").addClass("show");
		setOpen(!open);
	};

	const Close = function () {
		setOpen(!open);
		const media_649 = window.innerWidth > 649;
		if (media_649 === false) {
			j("#search").fadeOut().find("#text-control").val("");
		}
		j(".search-icon").off("click", Search).removeClass("ready");
		j("#search").find("#text-control").val("");
	};

	const ReadyForSearch = (/** @type {any} */ e) => {
		if (!j(e.target).val())
			return j(searchIcon.current).removeClass("ready");
		return j(searchIcon.current).addClass("ready");
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
		j(modalSignal.current).click(function () {
			setOpen(false);
		});
	}, [modalSignal]);

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
			<div className="search-text-box" id="search" onClick={SearchBox}>
				<form action="#" className="search-form">
					<div
						className="search-icon"
						ref={searchIcon}
						onClick={Search}
					>
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
					<div className="form-control">
						<input
							type="text"
							ref={searchbar}
							onKeyUp={(e) => ReadyForSearch(e)}
							className="text-control"
							id="text-control"
							placeholder="Search a friend.."
							autoComplete="off"
						/>
					</div>
				</form>
			</div>
			<motion.div
				animate={{
					height: open ? "calc(100vh - 60px)" : 0,
					width: open ? 600 : 0,
				}}
				transition={{duration: 0.1}}
				className="search-results fetched matched"
			>
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
											<MatchedUser
												key={key}
												processFriend={processFriend}
												processAdd={processAdd}
												processCancel={processCancel}
												user={user}
											/>
										);
									}
							  )
							: ""}
					</ul>
				</div>
			</motion.div>
		</div>
	);
}

/**
 *
 * @param {{user: object, processFriend: Function, processCancel: Function, processAdd: Function}} props
 * @returns
 */
function MatchedUser(props) {
	const {user, processFriend, processCancel, processAdd} = props;
	return (
		<li className="user">
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
						<span>{user.FullName}</span>
					</div>
					<div className="username">
						<span>{user.UserName}</span>
					</div>
				</div>
			</div>
			<div className="friend-reject-accept-btn btn-wrapper">
				{user.friends ? (
					<button
						className="add btn"
						onClick={(e) => {
							processFriend(user, e);
						}}
					>
						message
					</button>
				) : user.sent ? (
					<button
						className="add btn"
						onClick={(e) => {
							processCancel(user._id, e);
						}}
					>
						Cancel request
					</button>
				) : (
					<button
						className="add btn"
						onClick={(e) => {
							processAdd(user._id, e);
						}}
					>
						Add friend
					</button>
				)}
			</div>
		</li>
	);
}
export default SearchBar;
