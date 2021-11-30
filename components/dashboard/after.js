/* eslint-disable @next/next/link-passhref */
/* eslint-disable @next/next/no-img-element */
import Chat from "../../components/dashboard/public";
import {SocketContext} from "../../lib/socket";
import Link from "next/link";
import j from "jquery";
import Notifications from "./header/Notifications";
import UploadScreen from "./uploadsection/UploadScreen";
import ChatRoom from "./ChatRoom";
import {
	useContext,
	useEffect,
	useState,
	useCallback,
	Fragment,
	useRef,
	useMemo,
} from "react";
import Sidebar from "./sidebar/Sidebar";
import ChatBoard from "./chatboard/ChatBoard";
import FriendRequests from "./header/FriendRequest";
import SearchBar from "./header/SearchBar";
import ProfileCard from "./header/ProfileCard";
import {v4 as uuid} from "uuid";

export default function AfterRender() {
	const {socket, props, user} = useContext(SocketContext);
	const Close = useRef(null);
	const NotificationAlert = useRef(null);

	const Handler = (data) => {
		console.log(data);
		j(NotificationAlert.current)
			.animate(
				{
					left: "300px",
				},
				1000
			)
			.promise()
			.done(function () {
				setTimeout(() => {
					j(NotificationAlert.current).css("left", "-300px");
				}, 3000);
			});
	};

	useEffect(() => {
		if (socket) {
			socket.on("Notifications", Handler);
		}

		return () => {
			socket.off("Notifications", Handler);
		};
	}, [socket]);

	useEffect(() => {
		{
			j(".toggle").each((i, e) => {
				j(e).click(function () {
					if (!j(this).parent().hasClass("show"))
						j(document).find(".show").removeClass("show");
					j(this).parent().toggleClass("show");
				});
			});
			j(
				".top-navigation .icon, .alternate, .close-card,.chats-nav .public-chats,.chats-nav .private, .profile-preview, .send-btn svg, .media-icon"
			).bind("mouseleave mouseover", function (e) {
				var w = j(this).width();
				var height = j(this).height();
				var rect = this.getBoundingClientRect();

				var t = j(".toolpit")
					.html("<span>" + j(this).attr("alt") + "</span>")
					.width();

				t = w / 2 - t / 2 - 10;

				var left = rect.left + t;
				var top = rect.top - height - 8;

				if (e.type == "mouseover") {
					j(".toolpit")
						.css({
							left: left,
							top: top,
						})
						.addClass("show");
				} else {
					j(".toolpit").removeClass("show");
				}
			});

			const chatform = new MutationObserver(function (e) {
				if (e[0].removedNodes) {
					const childrenLength = e[0].target.children.length;
					{
						if (childrenLength < 1) {
							j(".chat-form-container").fadeOut();
						} else {
							j(".chat-form-container").fadeIn();
						}
					}
				}
			});

			chatform.observe(document.querySelector(".chat-form-container"), {
				childList: true,
			});
		}
	}, []);

	const Memo = {
		TopHeader: useMemo(() => {
			return (
				<div className="top-header flex-row">
					<div className="logo-wrapper">
						<div className="logo">
							<h4 className="title">Zablot</h4>
						</div>
					</div>
					<div className="coin-wrapper">
						<div className="coin">
							<h4 className="coin-count">
								<span>500</span> <small>coins</small>
							</h4>
						</div>
					</div>
				</div>
			);
		}, []),
		Profile: useMemo(() => <ProfileCard />, []),
		Notification: useMemo(() => <Notifications />, []),
		FriendRequests: useMemo(() => <FriendRequests />, []),
		Sidebar: useMemo(() => <Sidebar />, []),
		ChatBoard: useMemo(() => {
			return <ChatBoard />;
		}, []),
	};

	console.log("mounting from after");
	return (
		<Fragment>
			<div className="container">
				<div className="wrapper">
					<header className="page-header header main-header">
						{Memo.TopHeader}
						<div className="bottom-header flex-row">
							<SearchBar />
							<div className="top-navigation notifications-container friendresquest-box profile-box">
								{Memo.FriendRequests}
								{Memo.Notification}
								{Memo.Profile}
							</div>
						</div>
					</header>
					<div className="main">
						{Memo.Sidebar}
						<section className="main-body wide center-content">
							<div className="posts social-feeds informations view-screen">
								<UploadScreen />
							</div>
							<div className="chat-form-container empty"></div>
						</section>
						{Memo.ChatBoard}
					</div>
				</div>
			</div>
			<div className="toolpit"></div>
			<div className="notification_alert" ref={NotificationAlert}>
				<div className="alert_message alert alert-info alert-dismissible">
					<div className="message">There is a message for you</div>
				</div>
				<div className="btn close" ref={Close}>
					&times;
				</div>
			</div>
		</Fragment>
	);
}
