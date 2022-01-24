/* eslint-disable @next/next/no-img-element */
import React, {useContext, useRef} from "react";
import {AppContext} from "../../../lib/context";
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
	const {
		state: {user},
	} = useContext(AppContext);
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
								<Link href="/dashboard" passHref>
									<a>
										<div className="icon-wrap">
											<Dashboard
												className="svg"
												fontSize="medium"
											/>
										</div>
										<div className="link">
											<div className="link-title">
												Dashboard
											</div>
										</div>
									</a>
								</Link>
							</li>
							<li>
								<Link href="/create-quiz" passHref>
									<a href="#">
										<div className="icon-wrap">
											<CreateQuiz className="svg" />
										</div>
										<div className="link">
											<div className="link-title">
												Create Quiz
											</div>
										</div>
									</a>
								</Link>
							</li>
							<li>
								<Link href="/top-up-coin" passHref>
									<a href="#">
										<div className="icon-wrap">
											<MonetizationOnOutlinedIcon className="svg" />
										</div>
										<div className="link">
											<div className="link-title">
												Get Coin
											</div>
										</div>
									</a>
								</Link>
							</li>
							<li>
								<Link href="/add-question" passHref>
									<a href="#">
										<div className="icon-wrap">
											<QuestionMarkOutlinedIcon className="svg" />
										</div>
										<div className="link">
											<div className="link-title">
												Add Question
											</div>
										</div>
									</a>
								</Link>
							</li>
							<li>
								<Link href="/attempt-test" passHref>
									<a href="#">
										<div className="icon-wrap">
											<QuizOutlinedIcon className="svg" />
										</div>
										<div className="link">
											<div className="link-title">
												Attempt Test
											</div>
										</div>
									</a>
								</Link>
							</li>
							<li>
								<Link href="/logout" passHref>
									<a href="#">
										<div className="icon-wrap">
											<LogoutOutlinedIcon className="svg" />
										</div>
										<div className="link">
											<div className="link-title">
												{" "}
												LogOut{" "}
											</div>
										</div>
									</a>
								</Link>
							</li>
						</ul>
					</div>
					<div className="group-2 face-2 links-wrapper">
						<ul className="links-list">
							<li>
								<Link href="/share-idea" passHref>
									<a href="#">
										<div className="icon-wrap">
											<PsychologyOutlinedIcon
												fontSize="medium"
												className="svg"
											/>
										</div>
										<div className="link">
											<div className="link-title">
												Share Idea
											</div>
										</div>
									</a>
								</Link>
							</li>
							<li>
								<Link href="/share-web" passHref>
									<a href="#">
										<div className="icon-wrap">
											<ShareOutlinedIcon
												fontSize="medium"
												className="svg"
											/>
										</div>
										<div className="link">
											<div className="link-title">
												Share web
											</div>
										</div>
									</a>
								</Link>
							</li>
							<li>
								<Link href="/contribute" passHref>
									<a href="#">
										<div className="icon-wrap">
											<AllInclusiveIcon
												fontSize="medium"
												className="svg"
											/>
										</div>
										<div className="link">
											<div className="link-title">
												Contribute
											</div>
										</div>
									</a>
								</Link>
							</li>
							<li>
								<Link href="/repoer-a-problem" passHref>
									<a href="#">
										<div className="icon-wrap">
											<ReportIcon
												fontSize="medium"
												className="svg"
											/>
										</div>
										<div className="link">
											<div className="link-title">
												Report
											</div>
										</div>
									</a>
								</Link>
							</li>
							<li>
								<Link href="/join-community" passHref>
									<a href="#">
										<div className="icon-wrap">
											<PeopleIcon
												fontSize="medium"
												className="svg"
											/>
										</div>
										<div className="link">
											<div className="link-title">
												Community
											</div>
										</div>
									</a>
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
