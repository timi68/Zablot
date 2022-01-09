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
import SearchIcon from "@mui/icons-material/Search";
import {CircularProgress} from "@mui/material";

interface SearchInterface {
	matched: Interfaces.Matched[];
	message?: string;
}
function SearchBar() {
	const {
		state: {socket, user, session},
	} = useContext(AppContext);

	const modalSignal = useContext(ModalContext);
	const [searchData, setSearchData] = useState<SearchInterface>({
		matched: [],
		message: "Waiting to search",
	});
	const [loading, setLoading] = useState<boolean>(false);
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
			setLoading(true);
			const data = {searchText, id: user._id};

			// @ts-ignore
			j.ajax({
				url: `/api/search`,
				type: "POST",
				data: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json",
				},
				success: (matched: Interfaces.Matched[]) => {
					console.log(pending, "this available pending");
					console.log(matched);
					if (matched?.length) {
						const friendsId = friends.map(({_id}) => _id);
						matched = matched.filter((matchedUser) => {
							if (user._id != matchedUser._id) {
								if (pending.includes(matchedUser._id))
									matchedUser.sent = true;
								else if (friendsId.includes(matchedUser._id))
									matchedUser.friends = true;
								return matchedUser;
							}
						});
						if (matched?.length) setSearchData({matched});
						else
							setSearchData(() => ({
								matched,
								message: "No user matched your search",
							}));
						setLoading(false);
					} else
						setSearchData(() => ({
							matched: [],
							message: "No user matched your search",
						}));
					setLoading(false);
				},
				error: (i, j, x) => console.log(j, x),
			});
		}
	};

	function processAdd(id: string) {
		const newRequest = {
			Info: {
				Name: user.FullName,
				UserName: user.UserName,
				From: user._id,
				Image: defaultImage,
			},
			To: id,
		};

		socket.emit("FRIEND_REQUEST", newRequest, (res) => {
			setPending([id, ...pending]);
			setSearchData((state) => {
				let newMatched = state.matched.map((user) => {
					if (user._id === id) user.sent = true;
					return user;
				});
				return {matched: newMatched};
			});
		});

		console.log(pending);
	}

	function processFriend(
		user: Interfaces.Matched,
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) {
		ChatRoom({j, user, from: user._id, e, socket});
	}

	// Function that runs when user cancelled the request
	// he/she had sent and delivered or on delivery
	function processCancel(to: string) {
		const data = {from: user._id, to};
		console.log(data);
		socket.emit("CANCELREQUEST", data, (err: string) => {
			console.log("Response from socket", err);
			if (!err) {
				setSearchData((state) => {
					let matched = state.matched.map((user) => {
						if (user._id === to) delete user.sent;
						return user;
					});
					return {matched};
				});
				setPending((state) => {
					return (state = state.filter((id) => id !== to));
				});
			} else console.log(err);
		});
	}

	// This is a callback function listening to NewFriend
	// coming from socket, when called it will update the
	// array of friends
	const NewFriend = useCallback(
		(data) => {
			console.log(data);
			if (data?.IsComing) {
				setFriends([data, ...friends]);
				setPending((state) => {
					return (state = state.filter((user) => user !== data.Id));
				});
				if (searchData.matched.length > 0) {
					console.log(data, "IsComing");
					setSearchData((state) => {
						const newstate = state.matched.map((user) => {
							if (user._id === data.Id) {
								user.sent = false;
								user.friends = true;
							}
							return user;
						});
						return {matched: newstate};
					});
				}
			}
		},
		[searchData]
	);

	// Getting the type of notification coming in,
	// if it is request rejected type, list of sent request will
	// be checked and the one rejected among them will be updated
	// instantly, this only vital for request sent and rejected
	// immediately
	const Notification = useCallback(
		(data) => {
			console.log(data, searchData.matched);
			if (searchData.matched?.length) {
				console.log("Rejected friend request");
				setSearchData((state) => {
					let searchUpdate = state.matched.map((m) => {
						console.log(m._id, data.Id);
						if (m._id === data.Id)
							(m.rejected = true),
								(m.friends = false),
								(m.sent = false);
						return m;
					});
					return {matched: searchUpdate};
				});
			}
		},
		[searchData]
	);

	useEffect(() => {
		const modal = modalSignal?.current;
		j(modalSignal?.current).on("click", Closemodal);
		return () => j(modal).off("click", Closemodal);
	}, [open, modalSignal]);

	useEffect(() => {
		if (socket) {
			socket.on("NEWFRIEND", NewFriend);
			socket.on("Notifications", Notification);
		}
		return () => {
			socket.off("NEWFRIEND", NewFriend);
			socket.off("Notifications", Notification);
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
						<SearchIcon fontSize="small" />
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
						<div className="list-wrapper">
							{!loading && Boolean(searchData.matched?.length) && (
								<ul className="matched users">
									{searchData.matched?.map((user) => {
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
									})}
								</ul>
							)}
							{!loading && !Boolean(searchData.matched?.length) && (
								<div className="search-message">
									<h5 className="text">
										{searchData?.message}
									</h5>
								</div>
							)}
							{loading && (
								<div className="search-loader">
									<CircularProgress />
								</div>
							)}
						</div>
					</div>
				</div>
			</CSSTransition>
		</div>
	);
}

interface MatchedUserInterface {
	user: Interfaces.Matched;
	processFriend(
		user: Interfaces.Matched,
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	): void;
	processCancel(to?: string): void;
	processAdd(id?: String): void;
}
function MatchedUser(props: MatchedUserInterface) {
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
				{user?.rejected && (
					<button
						className="message-btn btn"
						disabled
						aria-disabled="true"
						aria-details="Displayed when friend request sent is rejected immediately"
					>
						<span>Request rejected</span>
					</button>
				)}

				{user.friends && (
					<button
						className="message-btn btn"
						onClick={(e) => {
							processFriend(user, e);
						}}
					>
						<span>message</span>
					</button>
				)}
				{user?.sent && (
					<button
						className="cancel-btn btn"
						onClick={(e) => {
							processCancel(user._id);
						}}
					>
						<span>Cancel request</span>
					</button>
				)}
				{!user?.sent && !user?.friends && !user?.rejected && (
					<button
						className="add-btn btn"
						onClick={(e) => {
							processAdd(user._id);
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
