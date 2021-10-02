/* eslint-disable @next/next/no-img-element */
import React, {useContext} from "react";
import {SocketContext} from "../../../lib/socket";

export default function Sidebar() {
	const {socket, props, user} = useContext(SocketContext);

	return (
		<aside className="navigator sidebar sticky">
			<div className="toggle"></div>
			<div className="navigator-wrapper">
				<div className="preview-profile">
					<div className="user-image-name-wrapper">
						<div className="user-image">
							<img
								src="./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"
								alt="/"
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
							<div className="message">
								Good morning {console.log(new Date().getTime())}
							</div>
						</div>
					</div>
				</div>
				<div className="links-container navigators">
					<div className="group-1 face-1 links-wrapper">
						<ul className="links-list">
							<li>
								<div className="icon-wrap">
									<i className="icon">
										<svg
											height="24px"
											viewBox="0 0 24 24"
											width="24px"
											fill="#000000"
										>
											<path
												d="M0 0h24v24H0z"
												fill="none"
											/>
											<path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
										</svg>
									</i>
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
									<div className="icon">
										<i>
											<svg
												className="ionicon"
												viewBox="0 0 512 512"
											>
												<path
													d="M384 224v184a40 40 0 01-40 40H104a40 40 0 01-40-40V168a40 40 0 0140-40h167.48"
													fill="none"
													stroke="currentColor"
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="32"
												/>
												<path d="M459.94 53.25a16.06 16.06 0 00-23.22-.56L424.35 65a8 8 0 000 11.31l11.34 11.32a8 8 0 0011.34 0l12.06-12c6.1-6.09 6.67-16.01.85-22.38zM399.34 90L218.82 270.2a9 9 0 00-2.31 3.93L208.16 299a3.91 3.91 0 004.86 4.86l24.85-8.35a9 9 0 003.93-2.31L422 112.66a9 9 0 000-12.66l-9.95-10a9 9 0 00-12.71 0z" />
											</svg>
										</i>
									</div>
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
									<div className="icon">
										<i>
											<svg
												height="24px"
												viewBox="0 0 24 24"
												width="24px"
												fill="#000000"
											>
												<path
													d="M0 0h24v24H0z"
													fill="none"
												/>
												<path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z" />
											</svg>
										</i>
									</div>
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
									<div className="coin">
										<i>
											<svg
												height="24px"
												viewBox="0 0 24 24"
												width="24px"
												fill="#000000"
											>
												<path
													d="M0 0h24v24H0V0z"
													fill="none"
												/>
												<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z" />
											</svg>
										</i>
									</div>
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
									<div className="coin">
										<i>
											<svg
												enableBackground="new 0 0 24 24"
												height="36px"
												viewBox="0 0 24 24"
												width="36px"
												fill="#000000"
											>
												<g>
													<path
														d="M0,0h24v24H0V0z"
														fill="none"
													/>
												</g>
												<g>
													<path d="M4,6H2v14c0,1.1,0.9,2,2,2h14v-2H4V6z M20,2H8C6.9,2,6,2.9,6,4v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V4 C22,2.9,21.1,2,20,2z M20,16H8V4h12V16z M13.51,10.16c0.41-0.73,1.18-1.16,1.63-1.8c0.48-0.68,0.21-1.94-1.14-1.94 c-0.88,0-1.32,0.67-1.5,1.23l-1.37-0.57C11.51,5.96,12.52,5,13.99,5c1.23,0,2.08,0.56,2.51,1.26c0.37,0.6,0.58,1.73,0.01,2.57 c-0.63,0.93-1.23,1.21-1.56,1.81c-0.13,0.24-0.18,0.4-0.18,1.18h-1.52C13.26,11.41,13.19,10.74,13.51,10.16z M12.95,13.95 c0-0.59,0.47-1.04,1.05-1.04c0.59,0,1.04,0.45,1.04,1.04c0,0.58-0.44,1.05-1.04,1.05C13.42,15,12.95,14.53,12.95,13.95z" />
												</g>
											</svg>
										</i>
									</div>
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
									<div className="coin">
										<i>
											<svg
												enableBackground="new 0 0 24 24"
												height="24px"
												viewBox="0 0 24 24"
												width="24px"
												fill="#000000"
											>
												<g>
													<rect
														fill="none"
														height="24"
														width="24"
													/>
												</g>
												<g>
													<g />
													<g>
														<path d="M21,5l-9-4L3,5v6c0,5.55,3.84,10.74,9,12c2.3-0.56,4.33-1.9,5.88-3.71l-3.12-3.12c-1.94,1.29-4.58,1.07-6.29-0.64 c-1.95-1.95-1.95-5.12,0-7.07c1.95-1.95,5.12-1.95,7.07,0c1.71,1.71,1.92,4.35,0.64,6.29l2.9,2.9C20.29,15.69,21,13.38,21,11V5z" />
														<circle
															cx="12"
															cy="12"
															r="3"
														/>
													</g>
												</g>
											</svg>
										</i>
									</div>
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
									<div className="coin">
										<i>
											<svg
												height="24px"
												viewBox="0 0 24 24"
												width="24px"
												fill="#000000"
											>
												<path
													d="M0 0h24v24H0z"
													fill="none"
												/>
												<path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z" />
											</svg>
										</i>
									</div>
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
									<div className="coin">
										<i>
											<svg
												enableBackground="new 0 0 24 24"
												height="24px"
												viewBox="0 0 24 24"
												width="24px"
												fill="#000000"
											>
												<g>
													<rect
														fill="none"
														height="24"
														width="24"
													/>
													<rect
														fill="none"
														height="24"
														width="24"
													/>
													<rect
														fill="none"
														height="24"
														width="24"
													/>
												</g>
												<g>
													<g />
													<path d="M20,4H4C2.9,4,2.01,4.9,2.01,6L2,18c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V6C22,4.9,21.1,4,20,4z M4,9h10.5v3.5H4V9z M4,14.5 h10.5V18L4,18V14.5z M20,18l-3.5,0V9H20V18z" />
												</g>
											</svg>
										</i>
									</div>
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
									<div className="coin">
										<i>
											<svg
												enableBackground="new 0 0 24 24"
												height="24px"
												viewBox="0 0 24 24"
												width="24px"
												fill="#000000"
											>
												<g>
													<path
														d="M0,0h24v24H0V0z"
														fill="none"
													/>
												</g>
												<g>
													<path d="M16,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V8L16,3z M19,19H5V5h10v4h4V19z M7,17h10v-2H7V17z M12,7H7 v2h5V7z M7,13h10v-2H7V13z" />
												</g>
											</svg>
										</i>
									</div>
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
									<div className="coin">
										<i>
											<svg
												height="24px"
												viewBox="0 0 24 24"
												width="24px"
												fill="#000000"
											>
												<path
													d="M0 0h24v24H0V0z"
													fill="none"
												/>
												<path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z" />
											</svg>
										</i>
									</div>
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
									<div className="coin">
										<i>
											<svg
												enableBackground="new 0 0 24 24"
												height="24px"
												viewBox="0 0 24 24"
												width="24px"
												fill="#000000"
											>
												<rect
													fill="none"
													height="24"
													width="24"
												/>
												<g>
													<path d="M12,12.75c1.63,0,3.07,0.39,4.24,0.9c1.08,0.48,1.76,1.56,1.76,2.73L18,18H6l0-1.61c0-1.18,0.68-2.26,1.76-2.73 C8.93,13.14,10.37,12.75,12,12.75z M4,13c1.1,0,2-0.9,2-2c0-1.1-0.9-2-2-2s-2,0.9-2,2C2,12.1,2.9,13,4,13z M5.13,14.1 C4.76,14.04,4.39,14,4,14c-0.99,0-1.93,0.21-2.78,0.58C0.48,14.9,0,15.62,0,16.43V18l4.5,0v-1.61C4.5,15.56,4.73,14.78,5.13,14.1z M20,13c1.1,0,2-0.9,2-2c0-1.1-0.9-2-2-2s-2,0.9-2,2C18,12.1,18.9,13,20,13z M24,16.43c0-0.81-0.48-1.53-1.22-1.85 C21.93,14.21,20.99,14,20,14c-0.39,0-0.76,0.04-1.13,0.1c0.4,0.68,0.63,1.46,0.63,2.29V18l4.5,0V16.43z M12,6c1.66,0,3,1.34,3,3 c0,1.66-1.34,3-3,3s-3-1.34-3-3C9,7.34,10.34,6,12,6z" />
												</g>
											</svg>
										</i>
									</div>
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
		</aside>
	);
}
