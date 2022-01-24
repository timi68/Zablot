/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
// @ts-check
import React from "react";
import {AppContext, ModalContext} from "../../../lib/context";
import {motion} from "framer-motion";
import j from "jquery";
import {v4 as uuid} from "uuid";
import {CSSTransition} from "react-transition-group";
import * as Interfaces from "../../../lib/interfaces";
import SearchIcon from "@mui/icons-material/Search";
import {CircularProgress} from "@mui/material";
import axios from "axios";

interface SearchInterface {
	matched: Interfaces.Matched[];
	message?: string;
	pending: string[];
}

const SearchBar = React.forwardRef(function (
	props: {ref: React.Ref<Interfaces.Ref>},
	ref
) {
	const {
		state: {socket, user},
	} = React.useContext(AppContext);

	const modalSignal = React.useContext(ModalContext);
	const [searchData, setSearchData] = React.useState<SearchInterface>({
		matched: [],
		pending: user?.PendingRequests || [],
		message: "Waiting to search",
	});
	const [loading, setLoading] = React.useState<boolean>(false);
	const [open, setOpen] = React.useState<boolean>(false);
	const [friends, setFriends] = React.useState<Interfaces.Friends[]>(
		user?.Friends || []
	);
	const searchbar = React.useRef<HTMLInputElement>(null);
	const searchIcon = React.useRef<HTMLDivElement>(null);
	const container = React.useRef<HTMLDivElement>(null);
	const defaultImage = "./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg";

	React.useImperativeHandle(
		ref,
		() => ({
			UpdateFriends(friend: Interfaces.Friends) {
				console.log(friend);

				setFriends([friend, ...friends]);
				setSearchData((state) => {
					state = {
						...state,
						pending: state.pending.filter((id) => id !== friend.Id),
					};
					return state;
				});

				if (searchData.matched.length > 0) {
					setSearchData((state) => {
						const newstate = state.matched.map((user) => {
							if (user._id === friend.Id) {
								user.sent = false;
								user.friends = true;
							}
							return user;
						});
						return {...state, matched: newstate};
					});
				}
			},
		}),
		[friends, searchData]
	);

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

		j(searchIcon.current).off("click", Search).removeClass("ready");
		j(searchbar.current).find("#text-control").val("");
	};

	const ReadyForSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!j(e.target).val())
			return j(searchIcon.current).removeClass("ready");
		return searchIcon.current.classList.add("ready");
	};

	const Search = async (e: any) => {
		e.preventDefault();
		try {
			const searchText: string = j(searchbar.current).val();
			if (searchText != "") {
				setLoading(true);
				const data = {searchText, id: user._id};

				const response = await axios.post<Interfaces.Matched[]>(
					"/api/search",
					data
				);

				let matched = response.data;
				if (matched?.length) {
					const friendsId = friends.map(({Id}) => Id);
					matched = matched.filter((matchedUser) => {
						if (user._id != matchedUser._id) {
							if (searchData.pending.includes(matchedUser._id))
								matchedUser.sent = true;
							else if (friendsId.includes(matchedUser._id))
								matchedUser.friends = true;
							return matchedUser;
						}
					});
					if (matched?.length)
						setSearchData({...searchData, matched});
					else {
						setSearchData({
							...searchData,
							matched,
							message: "No user matched your search",
						});
					}
					setLoading(false);
				} else
					setSearchData(() => ({
						...searchData,
						matched: [],
						message: "No user matched your search",
					}));
				setLoading(false);
			}
		} catch (error) {
			console.log(error);
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
			setSearchData((state) => {
				let newMatched = state.matched.map((user) => {
					if (user._id === id) user.sent = true;
					return user;
				});
				return {...searchData, matched: newMatched};
			});
		});

		console.log(searchData.pending);
	}

	function processFriend(
		user: Interfaces.Matched,
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) {}

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

					let pending = state.pending.filter((id) => id !== to);
					return {matched, pending};
				});
			} else console.log(err);
		});
	}

	// Getting the type of notification coming in,
	// if it is request rejected type, list of sent request will
	// be checked and the one rejected among them will be updated
	// instantly, this only vital for request sent and rejected
	// immediately
	const Notification = React.useCallback(
		(data: {Id: string}) => {
			if (searchData.matched?.length) {
				setSearchData((state) => {
					let searchUpdate = state.matched.map((m) => {
						if (m._id === data.Id) {
							delete m.sent, delete m.friends;
							m.rejected = true;
						}
						return m;
					});
					let pending = state.pending.filter((id) => id !== data.Id);
					return {matched: searchUpdate, pending};
				});
			}
		},
		[searchData]
	);

	React.useEffect(() => {
		const modal = modalSignal?.current;
		j(modalSignal?.current).on("click", Closemodal);
		return () => j(modal).off("click", Closemodal);
	}, [modalSignal]);

	React.useEffect(() => {
		if (socket) {
			socket.on("Notifications", Notification);
		}
		return () => {
			socket.off("Notifications", Notification);
		};
	}, [socket, searchData]);

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
});

SearchBar.displayName = "SearchBar";

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
