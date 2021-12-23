/* eslint-disable @next/next/no-img-element */
import React from 'react'

function UploadScreen() {
    return (
        <div>
            <div className="social-wrapper">
				<div className="active-feeds">
					<div className="feeds-title title">
											<h5>Stories</h5>
										</div>
					<div className="feeds-list">
											<ul>
												<li className="feeds">
													<div className="front-feed">
														<div className="image_video">
															<img src="./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"
																className="image" alt="" />
														</div>
													</div>
												</li>
												<li className="feeds">
													<div className="front-feed">
														<div className="image_video">
															<img src="./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"
																className="image" alt="" />
														</div>
													</div>
												</li>
												<li className="feeds">
													<div className="front-feed">
														<div className="image_video">
															<img src="./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"
																className="image" alt="" />
														</div>
													</div>
												</li>
											</ul>
										</div>
				</div>
				<div className="upload create-post">
										<div className="form-group">
											<div className="text-box">
												<textarea type="text" name="writeups" id="writeups"
													placeholder="Write something..." className="text-control post-text"></textarea>

												<div className="post-btn">
													<button className="btn upload">
														<div className="icon">
															<svg className="svg" height="24px" viewBox="0 0 24 24" width="24px"
																fill="#000000">
																<path d="M0 0h24v24H0V0z" fill="none" />
																<path
																	d="M4.01 6.03l7.51 3.22-7.52-1 .01-2.22m7.5 8.72L4 17.97v-2.22l7.51-1M2.01 3L2 10l15 2-15 2 .01 7L23 12 2.01 3z" />
															</svg>
														</div>
													</button>
												</div>
											</div>
											<div className="alternate-post">
												<div className="alternate-wrap">
													<div className="image-alternate upload-image post-image alternate" alt="image">
														<svg className="svg" height="24px" viewBox="0 0 24 24" width="24px"
															fill="#000000">
															<path d="M0 0h24v24H0V0z" fill="none" />
															<path
																d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z" />
														</svg>
													</div>
													<div className="video-alternate post-video alternate" alt="video">
														<svg className="svg" height="24px" viewBox="0 0 24 24" width="24px"
															fill="#000000">
															<path d="M0 0h24v24H0V0z" fill="none" />
															<path
																d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM12 5.5v9l6-4.5z" />
														</svg>

													</div>
													<div className="poll-alternative post-post alternate" alt="poll">
														<svg className="svg" height="24px" viewBox="0 0 24 24" width="24px"
															fill="#000000">
															<path d="M0 0h24v24H0V0z" fill="none" />
															<path
																d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z" />
														</svg>
													</div>
												</div>
											</div>
										</div>
									</div>
				<div className="posts-container uploads">
										<ul className="post-of-users general">
											<li className="post each">
												<div className="post-wrapper">
													<div className="post-content">
														<div className="uploader-wrap">
															<div className="user-image">
																<img src="./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"
																	alt="" className="image" />
															</div>
															<div className="name">
																<div className="username text">
																	Oderinde james Oluwatimileyin
																</div>
															</div>
														</div>
														<div className="image-post">
															<div className="swiper-container">
																<div className="swiper-wrapper">
																	<div className="swiper-slide">
																		<div className="image-content">
																			<img src="./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"
																				alt="" className="image" />
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</div>
													<div className="post-response feedback">
														<div className="likes-count replys">
															<div className="title">
																Likes
															</div>
															<div className="count">
																<span>
																	<svg height="14px" viewBox="0 0 24 24" width="14px"
																		fill="#000000">
																		<path d="M0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none" />
																		<path
																			d="M9 21h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2zM9 9l4.34-4.34L12 10h9v2l-3 7H9V9zM1 9h4v12H1z" />
																	</svg>
																</span>
																<b>500</b>
															</div>
														</div>
														<div className="comments-counts replys">
															<div className="title">
																Comments
															</div>
															<div className="count">
																<span>
																	<svg height="14px" viewBox="0 0 24 24" width="14px"
																		fill="#000000">
																		<path d="M0 0h24v24H0V0z" fill="none" />
																		<path
																			d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM20 4v13.17L18.83 16H4V4h16zM6 12h12v2H6zm0-3h12v2H6zm0-3h12v2H6z" />
																	</svg>
																</span>
																500
															</div>
														</div>
														<div className="shares-counts replys">
															<div className="title">
																Shares
															</div>
															<div className="count">
																<span>
																	<svg height="14px" viewBox="0 0 24 24" width="14px"
																		fill="#000000">
																		<path d="M0 0h24v24H0V0z" fill="none" />
																		<path
																			d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />
																	</svg>
																</span>
																500
															</div>
														</div>
													</div>
													<div className="fast-comment-box">
														<div className="recent-comment">
															<div className="user">
																<div className="user-image">
																	<img src="./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"
																		alt="" className="image" />
																</div>
																<div className="user-name name">
																	<div className="username">
																		Davido Adeniyi
																	</div>
																</div>
															</div>
															<div className="user-comment">
																<div className="text">
																	What is wrong with you &#128513; &#128513;
																</div>
															</div>
														</div>
														<div className="comment-create-box input-box">
															<div className="input-group">
																<div className="icon media-icon">
																	<svg height="24px" viewBox="0 0 24 24" width="24px"
																		fill="#000000">
																		<path d="M0 0h24v24H0V0z" fill="none" />
																		<path
																			d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
																	</svg>
																</div>
																<textarea placeholder="Type a message.." name="message"
																	id="text-control" className="text-control"></textarea>
																<div className="send-btn">
																	<button className="btn send">
																		<svg className="svg" height="24px" viewBox="0 0 24 24"
																			width="24px" fill="#000000">
																			<path d="M0 0h24v24H0V0z" fill="none" />
																			<path
																				d="M4.01 6.03l7.51 3.22-7.52-1 .01-2.22m7.5 8.72L4 17.97v-2.22l7.51-1M2.01 3L2 10l15 2-15 2 .01 7L23 12 2.01 3z" />
																		</svg>
																	</button>
																</div>
															</div>
															<div className="media-comment-wrapper">
																<div className="multimedia-list list">
																	<ul className="media-list">
																		<li className="media">
																			<div className="icon" id="image-icon">
																				<svg height="24px" viewBox="0 0 24 24"
																					width="24px" fill="#000000">
																					<path d="M0 0h24v24H0V0z" fill="none" />
																					<path
																						d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z" />
																				</svg>
																			</div>

																		</li>
																		<li className="media">
																			<div className="icon" id="video-icon">
																				<svg className="svg" height="24px"
																					viewBox="0 0 24 24" width="24px"
																					fill="#000000">
																					<path d="M0 0h24v24H0V0z" fill="none" />
																					<path
																						d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM12 5.5v9l6-4.5z" />
																				</svg>
																			</div>
																		</li>
																		<li className="poll">
																			<div className="icon" id="poll-icon">
																				<svg height="24px" viewBox="0 0 24 24"
																					width="24px" fill="#000000">
																					<path d="M0 0h24v24H0V0z" fill="none" />
																					<path
																						d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z" />
																				</svg>
																			</div>
																		</li>

																	</ul>
																</div>
															</div>
														</div>
													</div>
												</div>
											</li>
											<li className="post each">
												<div className="post-wrapper">
													<div className="post-content">
														<div className="uploader-wrap">
															<div className="user-image">
																<img src="./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"
																	alt="" className="image" />
															</div>
															<div className="name">
																<div className="username text">
																	Oderinde james Oluwatimileyin
																</div>
															</div>
														</div>
														<div className="video-post">
															<iframe width="100%" height="300px" title="YouTube video player"
																frameBorder="0"
																allow="accelerometer;  clipboard-write; encrypted-media; gyroscope; picture-in-picture"
																allowFullScreen></iframe>

														</div>
													</div>
													<div className="post-response feedback">
														<div className="likes-count replys">
															<div className="title">
																Likes
															</div>
															<div className="count">
																<span>
																	<svg height="14px" viewBox="0 0 24 24" width="14px"
																		fill="#000000">
																		<path d="M0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none" />
																		<path
																			d="M9 21h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2zM9 9l4.34-4.34L12 10h9v2l-3 7H9V9zM1 9h4v12H1z" />
																	</svg>
																</span>
																<b>500</b>
															</div>
														</div>
														<div className="comments-counts replys">
															<div className="title">
																Comments
															</div>
															<div className="count">
																<span>
																	<svg height="14px" viewBox="0 0 24 24" width="14px"
																		fill="#000000">
																		<path d="M0 0h24v24H0V0z" fill="none" />
																		<path
																			d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM20 4v13.17L18.83 16H4V4h16zM6 12h12v2H6zm0-3h12v2H6zm0-3h12v2H6z" />
																	</svg>
																</span>
																500
															</div>
														</div>
														<div className="shares-counts replys">
															<div className="title">
																Shares
															</div>
															<div className="count">
																<span>
																	<svg height="14px" viewBox="0 0 24 24" width="14px"
																		fill="#000000">
																		<path d="M0 0h24v24H0V0z" fill="none" />
																		<path
																			d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />
																	</svg>
																</span>
																500
															</div>
														</div>
													</div>
													<div className="fast-comment-box">
														<div className="recent-comment">
															<div className="user">
																<div className="user-image">
																	<img src="./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"
																		alt="" className="image" />
																</div>
																<div className="user-name name">
																	<div className="username">
																		Davido Adeniyi
																	</div>
																</div>
															</div>
															<div className="user-comment">
																<div className="text">
																	What is wrong with you &#128513; &#128513;
																</div>
															</div>
														</div>
														<div className="comment-create-box input-box">
															<div className="input-group">
																<div className="icon media-icon">
																	<svg height="24px" viewBox="0 0 24 24" width="24px"
																		fill="#000000">
																		<path d="M0 0h24v24H0V0z" fill="none" />
																		<path
																			d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
																	</svg>
																</div>
																<textarea placeholder="Type a message.." name="message"
																	id="text-control" className="text-control"></textarea>
																<div className="send-btn">
																	<button className="btn send">
																		<svg className="svg" height="24px" viewBox="0 0 24 24"
																			width="24px" fill="#000000">
																			<path d="M0 0h24v24H0V0z" fill="none" />
																			<path
																				d="M4.01 6.03l7.51 3.22-7.52-1 .01-2.22m7.5 8.72L4 17.97v-2.22l7.51-1M2.01 3L2 10l15 2-15 2 .01 7L23 12 2.01 3z" />
																		</svg>
																	</button>
																</div>
															</div>
															<div className="media-comment-wrapper">
																<div className="multimedia-list list">
																	<ul className="media-list">
																		<li className="media">
																			<div className="icon" id="image-icon">
																				<svg height="24px" viewBox="0 0 24 24"
																					width="24px" fill="#000000">
																					<path d="M0 0h24v24H0V0z" fill="none" />
																					<path
																						d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z" />
																				</svg>
																			</div>

																		</li>
																		<li className="media">
																			<div className="icon" id="video-icon">
																				<svg className="svg" height="24px"
																					viewBox="0 0 24 24" width="24px"
																					fill="#000000">
																					<path d="M0 0h24v24H0V0z" fill="none" />
																					<path
																						d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM12 5.5v9l6-4.5z" />
																				</svg>
																			</div>
																		</li>
																		<li className="poll">
																			<div className="icon" id="poll-icon">
																				<svg height="24px" viewBox="0 0 24 24"
																					width="24px" fill="#000000">
																					<path d="M0 0h24v24H0V0z" fill="none" />
																					<path
																						d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z" />
																				</svg>
																			</div>
																		</li>

																	</ul>
																</div>
															</div>
														</div>
													</div>
												</div>
											</li>

										</ul>
									</div>
			</div>							
        </div>
    )
}

export default UploadScreen
