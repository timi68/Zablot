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
import {AppContext, ModalContext} from "../../../lib/context";
import {ChatRoom} from "../../../utils/ChatRoom";
import {motion} from "framer-motion";
import j from "jquery";
import {v4 as uuid} from "uuid";
import {CSSTransition} from "react-transition-group";
import * as Interfaces from "../../../lib/interfaces";

function SearchBar() {
	const {
		state: {socket, user, session},
	} = useContext(AppContext);

	const modalSignal = useContext(ModalContext);
	const [matched, setMatched] = useState<Interfaces.Matched[]>([]);
	const [skipper, setSkipper] = useState(null);
	const [open, setOpen] = useState<boolean>(false);
	const [pending, setPending] = useState<string[]>(
		user?.PendingRequests || []
	);
	const [friends, setFriends] = useState(user?.Friends || []);
	const defaultImage = "./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg";
	const searchbar = useRef(null);
	const searchIcon = useRef(null);
	const container = useRef(null);

	const SearchBox = function () {
		if (open) return;

		j(modalSignal.current).trigger("click").addClass("show");
		j(container.current).addClass("focused");
		setOpen(!open);
	};

	const Closemodal = function () {
		if (open) setOpen(false);

		j(modalSignal.current).removeClass("show");
		j(container.current).removeClass("focused");

		j(".search-icon").off("click", Search).removeClass("ready");
		j("#search").find("#text-control").val("");
	};

	const ReadyForSearch = (/** @type {any} */ e) => {
		if (!j(e.target).val())
			return searchIcon.current.classList.remove("ready");
		return searchIcon.current.classList.add("ready");
	};

	const Search = (e) => {
		e.preventDefault();
		const searchText: string = j(searchbar.current).val();
		if (searchText != "") {
			const data = {searchText, id: session.id};

			// @ts-ignore
			j.ajax({
				url: `/api/search`,
				type: "POST",
				data: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json",
				},
				success: (matched: Interfaces.Matched[]) => {
					if (matched?.length) {
						console.log(matched);
						const friendsId = friends.map((user) => user.Id);
						matched = matched.filter((user) => {
							if (user._id != session.id) {
								if (pending.includes(user._id))
									user.sent = true;
								else if (friendsId.includes(user._id))
									user.friends = true;
								return user;
							}
						});
						setMatched(matched);
					} else setMatched(() => []);
				},
				error: (i, j, x) => console.log(j, x),
			});
		}
	};

	function processAdd(id: string) {
		const friend_request = {
			Info: {
				Name: user.FullName,
				UserName: user.UserName,
				From: session.id,
				Image: defaultImage,
			},
			To: id,
		};

		socket.emit("FRIEND_REQUEST", friend_request, (res) => {
			setPending([id, ...pending]);
			setMatched((state) => {
				state = state.map((user) => {
					if (user._id === id) user.sent = true;
					return user;
				});
				return state;
			});
		});
	}

	function processFriend(user: Interfaces.Friends, e: Event) {
		ChatRoom({j, user, from: session.id, e, socket});
	}

	function processCancel(to: string) {
		const data = {from: session.id, to};
		socket.emit("CANCELREQUEST", data, (err: string) => {
			if (!err) {
				setMatched((state) => {
					return (state = state.map((user) => {
						if (user._id === to) user.sent = false;
						return user;
					}));
				});
				setPending((state) => {
					return (state = state.filter((id) => id !== to));
				});
			} else console.log(err);
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
		const modal = modalSignal?.current;
		j(modalSignal?.current).on("click", Closemodal);
		return () => j(modal).off("click", Closemodal);
	}, [open, modalSignal]);

	useEffect(() => {
		if (socket) socket.on("NEWFRIEND", NewFriend);
		return () => {
			socket.off("NEWFRIEND", NewFriend);
		};
	}, [socket]);

	console.log("mounting from searchbar");
	return (
		<div className="search-container" ref={container}>
			<div className="search-text-box" id="search" onClick={SearchBox}>
				<form action="#" className="search-form" onSubmit={Search}>
					<div
						className="search-icon"
						ref={searchIcon}
						onClick={Search}
						role="search"
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
							type="search"
							role="searchbox"
							aria-autocomplete="none"
							ref={searchbar}
							onChange={ReadyForSearch}
							className="text-control"
							id="text-control"
							placeholder="Search a friend.."
							autoComplete="off"
						/>
					</div>
				</form>
			</div>
			<CSSTransition
				in={open}
				timeout={200}
				unmountOnExit
				classNames="search-results"
			>
				<div className="search-results fetched matched">
					<div className="search-matched-wrapper">
						<div className="header">
							<div className="title">
								<div className="text">Matched Results</div>
							</div>
							<div className="close-btn modal">
								<div className="close" onClick={Closemodal}>
									<span>Close</span>
								</div>
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
													processFriend={
														processFriend
													}
													processAdd={processAdd}
													processCancel={
														processCancel
													}
													user={user}
												/>
											);
										}
								  )
								: ""}
						</ul>
					</div>
				</div>
			</CSSTransition>
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
						<span>@{user.UserName}</span>
					</div>
				</div>
			</div>
			<div className="friend-reject-accept-btn btn-wrapper">
				{user.friends ? (
					<button
						className="message-btn btn"
						onClick={(e) => {
							processFriend(user, e);
						}}
					>
						<span>message</span>
					</button>
				) : user.sent ? (
					<button
						className="cancel-btn btn"
						onClick={(e) => {
							processCancel(user._id, e);
						}}
					>
						<span>Cancel request</span>
					</button>
				) : (
					<button
						className="add-btn btn"
						onClick={(e) => {
							processAdd(user._id, e);
						}}
					>
						<span>Add friend</span>
					</button>
				)}
			</div>
		</li>
	);
}
export default SearchBar;
