/* eslint-disable @next/next/no-img-element */
import React, {useContext, useRef} from "react";
import {SocketContext} from "../../../lib/socket";
import Image from "next/image";
import Link from "next/link";
import Dashboard from "@material-ui/icons/Dashboard";
import CreateQuiz from "@material-ui/icons/CreateOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ReportIcon from "@mui/icons-material/Report";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import PeopleIcon from "@mui/icons-material/People";
import QuestionMarkOutlinedIcon from "@mui/icons-material/QuestionMarkOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";

export default function Sidebar() {
	const {user} = useContext(SocketContext);
	const sidebar = useRef(null);
	const openSidebar = () => {
		const bar = sidebar.current;
		if (!bar.classList.contains("show"))
			document.querySelector(".show")?.classList.remove("show");
		bar.classList.toggle("show");
	};
	return (
		<div className="navigator sidebar sticky" ref={sidebar}>
			<div className="open" onClick={openSidebar}></div>
			<div className="navigator-wrapper">
				<div className="preview-profile">
					<div className="user-image-name-wrapper">
						<div className="user-image">
							<Image
								src="/images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"
								alt="/"
								width={30}
								height={30}
								priority={true}
								className="image"
							/>
						</div>
						<div className="user names">
							<div className="name">
								{user?.FullName}
								<br />
								<span className="username">
									@{user?.UserName}
								</span>
							</div>
						</div>
					</div>
					<div className="message-for-user">
						<div className="message-from-zablot">
							<div className="message">Good morning</div>
						</div>
					</div>
				</div>
				<div className="links-container navigators">
					<div className="group-1 face-1 links-wrapper">
						<ul className="links-list">
							<li>
								<div className="icon-wrap">
									<Dashboard className="svg" size="medium" />
								</div>
								<div className="link">
									<a
										href="http://dashboard"
										target="_blank"
										rel="noopener noreferrer"
									>
										Dashboard
									</a>
								</div>
							</li>
							<li>
								<div className="icon-wrap">
									<CreateQuiz className="svg" />
								</div>
								<div className="link">
									<a
										href="#"
										target="_blank"
										rel="noopener noreferrer"
									>
										Create Quiz
									</a>
								</div>
							</li>
							<li>
								<div className="icon-wrap">
									<MonetizationOnOutlinedIcon className="svg" />
								</div>
								<div className="link">
									<a
										href="#"
										target="_blank"
										rel="noopener noreferrer"
									>
										TopUp Coin
									</a>
								</div>
							</li>
							<li>
								<div className="icon-wrap">
									<QuestionMarkOutlinedIcon className="svg" />
								</div>
								<div className="link">
									<a
										href="http://"
										target="_blank"
										rel="noopener noreferrer"
									>
										Add Question
									</a>
								</div>
							</li>
							<li>
								<div className="icon-wrap">
									<QuizOutlinedIcon className="svg" />
								</div>
								<div className="link">
									<a
										href="http://"
										target="_blank"
										rel="noopener noreferrer"
									>
										Attempt Test
									</a>
								</div>
							</li>
							<li>
								<div className="icon-wrap">
									<LogoutOutlinedIcon className="svg" />
								</div>
								<div className="link">
									<a
										href="#"
										target="_blank"
										rel="noopener noreferrer"
									>
										{" "}
										LogOut{" "}
									</a>
								</div>
							</li>
						</ul>
					</div>
					<div className="group-2 face-2 links-wrapper">
						<ul className="links-list">
							<li>
								<div className="icon-wrap">
									<PsychologyOutlinedIcon
										size="medium"
										className="svg"
									/>
								</div>
								<div className="link">
									<a
										href="#"
										target="_blank"
										rel="noopener noreferrer"
									>
										<span>Share Idea</span>
									</a>
								</div>
							</li>
							<li>
								<div className="icon-wrap">
									<ShareOutlinedIcon
										size="medium"
										className="svg"
									/>
								</div>
								<div className="link">
									<a
										href="#"
										target="_blank"
										rel="noopener noreferrer"
									>
										Share web
									</a>
								</div>
							</li>
							<li>
								<div className="icon-wrap">
									<AllInclusiveIcon
										size="medium"
										className="svg"
									/>
								</div>
								<div className="link">
									<a
										href="#"
										target="_blank"
										rel="noopener noreferrer"
									>
										Contribute
									</a>
								</div>
							</li>
							<li>
								<div className="icon-wrap">
									<ReportIcon size="medium" className="svg" />
								</div>
								<div className="link">
									<a
										href="#"
										target="_blank"
										rel="noopener noreferrer"
									>
										Report a problem
									</a>
								</div>
							</li>
							<li>
								<div className="icon-wrap">
									<PeopleIcon size="medium" className="svg" />
								</div>
								<div className="link">
									<a
										href="#"
										target="_blank"
										rel="noopener noreferrer"
									>
										Join community
									</a>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
