/* eslint-disable @next/next/no-css-tags */
import Head from "next/head";
import React, {Fragment, useEffect, useRef, useState} from "react";
import j from "jquery";
import useRouter from "next/router";
import Link from "next/link";
import Layout from "../../src/AppLayout";

function QuizCreator() {
	const [Questions, setQuestions] = useState([]);
	const [loaded, setLoaded] = useState(false);
	const [toggled, setToggled] = useState(false);
	const addBtn = useRef(null);
	const uAddBtn = useRef(null);

	useEffect(() => {
		const optionListMutation = new MutationObserver(function (e) {
			if (e[0].removedNodes) {
				const target = e[0].target as HTMLDivElement;
				const childrenLength = target.children.length;
				{
					if (childrenLength >= 4) {
						j(".add-btn, .uadd-btn").fadeOut();
					} else if (childrenLength < 2) {
						j(".create-btn, .save-btn").removeClass("create save");
					} else {
						j(".add-btn, .uadd-btn").fadeIn();
					}
				}
			}
		});

		optionListMutation.observe(document.querySelector(".options"), {
			childList: true,
		});
		optionListMutation.observe(document.querySelector(".uoptions"), {
			childList: true,
		});

		const Question = sessionStorage.getItem("Questions");
		if (Question?.length) {
			const confirmUserWantsToContinuePreviousQuiz = confirm(
				"You have unfinished quiz, do you wish to continue? "
			);
			if (confirmUserWantsToContinuePreviousQuiz)
				setQuestions(JSON.parse(Question));
			else sessionStorage.removeItem("Questions");
		}

		return () => {
			optionListMutation.disconnect();
		};
	}, []);

	useEffect(() => {
		if (loaded) {
			if (!Questions?.length)
				return sessionStorage.removeItem("Questions");
			sessionStorage.setItem("Questions", JSON.stringify(Questions));
		}
		if (j(".created-questions").hasClass("show"))
			j(".toggle-created-question").html("&times;");
	});

	function KeyUpQuestion(e) {
		j(e.target).removeClass("empty");
		e.target.classList[0] == "uquestion" ? UpdatePoll(true) : UpdatePoll();
	}

	function AddOptions(u: any, option?) {
		const target = (u as React.MouseEvent<HTMLDivElement, MouseEvent>)
			?.target;
		if (target) {
			const children = j(target)
				.parents(".options-wrap")
				.find(".option-list")
				.children().length;
			if (children >= 4) return;
		}
		const _class =
			typeof option == "undefined"
				? (target as HTMLDivElement).classList[0]
				: "";
		if (u != true) j(target).removeClass("more-option-required");
		j("<li>", {class: "option"})
			.append(
				j("<div>", {class: "text-box"})
					.append(
						j("<input>", {
							type: "radio",
							name: "answer",
							id: "answer",
							class: "answer",
						}).prop(
							"checked",
							option ? (option.checked ? true : false) : false
						)
					)
					.append(
						j("<textarea>", {
							name: `option-input`,
							placeholder: "Enter option..",
							class: "text-control text-box",
						})
							.val(option ? option.text : "")
							.keyup(function () {
								j(this).removeClass("empty");
								typeof option != "object"
									? _class == "uadd-btn"
										? UpdatePoll(true)
										: UpdatePoll()
									: UpdatePoll();
							})
					)
			)
			.append(
				j("<div>", {class: "remove-option"})
					.click(function () {
						j(this).parent().slideToggle(500);
						setTimeout(() => {
							j(this).parent().remove();
							UpdatePoll();
						}, 500);
					})
					.append(j("<div>", {class: "icon", html: "&times;"}))
			)
			.slideUp(10)
			.appendTo(
				typeof option != "object"
					? _class == "uadd-btn"
						? ".uoptions"
						: ".options"
					: ".uoptions"
			)
			.slideDown("slow")
			.find("textarea")
			.focus();
	}

	function resetPollStateToDefault() {
		j(".question").val("");
		j(".required, .empty, .create-btn").removeClass(
			"required empty create active"
		);
		j(".create-question .option-list").empty();
		j(".add-btn, .uadd-btn").fadeIn();
		return;
	}

	function Discard() {
		j(".uoptions").empty();
		j(".edit-question").removeClass("show");
	}

	function CreateQuestion(e) {
		{
			var empty = 0;

			if (!j(".question").val()) {
				j(".create-btn")
					.parents(".create-question")
					.animate(
						{
							scrollTop: j("body").prop("offsetTop") / 2,
						},
						"slow",
						function () {
							j(this).after(() => {
								j(".question").addClass("empty").focus();
							});
						}
					);

				return;
			}

			let totalOption = j(".options").find("textarea").length;
			if (totalOption < 2) {
				j(".add-btn").toggleClass("more-option-required");
				return;
			}

			j(".options")
				.find("textarea")
				.each((i, e) => {
					if (!j(e).val()) {
						j(e).addClass("empty").focus();
						empty++;
						return false;
					}
				});

			if (empty > 0) return;
		}

		{
			var options = j(".create-question")
				.find(".answer")
				.map(function (i, e) {
					let option = [];
					var text = j(e)
						.parents(".option")
						.find("textarea")
						.eq(0)
						.val();
					var checked = j(e).is(":checked");
					option.push({index: i, text, checked});

					return option;
				})
				.toArray();

			var hasClass = j(e.target).is(".create.active");
			if (hasClass) {
				var isChecked = j(options)
					.filter((i) => options[i].checked === true)
					.toArray().length;

				if (isChecked === 0) {
					j(".create-question").find(".answer").addClass("required");
					setTimeout(() => {
						j(".create-question")
							.find(".answer")
							.removeClass("required");
					}, 2000);

					return;
				}
			}
		}
		var question = j(".question").val();
		var data = {question, options};

		if (!loaded) setLoaded(true);
		setQuestions([...Questions, data]);
		resetPollStateToDefault();
	}

	function Remove(id) {
		if (!loaded) setLoaded(true);
		setQuestions((state) => {
			state = state.filter((question, i) => i !== id);
			return state;
		});
	}

	function Edit(id) {
		var {question, options} = Questions[id];
		options.forEach((option) => {
			AddOptions(true, option);
		});
		j(".uquestion").val(question);
		j(".edit-question").addClass("show");
		j(".save-btn").attr("id", id).addClass("save");
	}

	function UpdatePoll(u?: string | boolean) {
		let totalOption = j(u ? ".uoptions" : ".options").find(
			"textarea"
		).length;
		let count = 0;
		let question = j(u ? ".uquestion" : ".question").val();
		j(u ? ".uoptions" : ".options")
			.find("textarea")
			.each((i, e) => {
				let val = j(e).val();
				!val || val == "" ? count++ : "";
			});

		if (totalOption >= 2 && count <= 2 && question) {
			switch (totalOption) {
				case 2:
					count < 1
						? j(u ? ".save-btn" : ".create-btn").addClass(
								u ? "save" : "active create"
						  )
						: j(u ? ".save-btn" : ".create-btn").removeClass(
								u ? "save" : "active create"
						  );
					break;
				case 3:
					count <= 1
						? j(u ? ".save-btn" : ".create-btn").addClass(
								u ? "save" : "active create"
						  )
						: j(u ? ".save-btn" : ".create-btn").removeClass(
								u ? "save" : "active create"
						  );
					break;
				case 4:
					count <= 2
						? j(u ? ".save-btn" : ".create-btn").addClass(
								u ? "save" : "active create"
						  )
						: j(u ? ".save-btn" : ".create-btn").removeClass(
								u ? "save" : "active create"
						  );
					break;
				default:
					break;
			}
		} else {
			j(u ? ".save-btn" : ".create-btn").removeClass(
				u ? "save" : "active create"
			);
		}
	}

	function Save(e) {
		{
			var empty = 0;

			if (!j(".uquestion").val()) {
				j(".save-btn")
					.parents(".form-group")
					.animate(
						{
							scrollTop: j("body").prop("offsetTop") / 2,
						},
						"slow",
						function () {
							j(this).after(() => {
								j(".uquestion").addClass("empty").focus();
							});
						}
					);

				return;
			}
			let totalOption = j(".uoptions").find("textarea").length;
			if (totalOption < 2) {
				j(".uadd-btn").toggleClass("more-option-required");
				return;
			}

			j(".uoptions")
				.find("textarea")
				.each((i, e) => {
					if (!j(e).val()) {
						j(e).addClass("empty").focus();
						empty++;
						return false;
					}
				});
			if (empty > 0) return;
		}
		{
			var options = j(".edit-question .form-group")
				.find(".answer")
				.map(function (i, e) {
					let option = [];
					var text = j(e)
						.parents(".option")
						.find("textarea")
						.eq(0)
						.val();
					var checked = j(e).is(":checked");
					option.push({
						index: i,
						text,
						checked,
					});

					return option;
				})
				.toArray();

			var isChecked = j(options)
				.filter((i) => options[i].checked === true)
				.toArray().length;
			if (isChecked === 0) {
				j(".edit-question").find(".answer").addClass("required");
				setTimeout(() => {
					j(".edit-question").find(".answer").removeClass("required");
				}, 2000);

				return;
			}

			var hasClass = j(e.target).is(".save-btn.save");
			if (hasClass) {
				var question = j(".uquestion").val();
				var data = {
					question,
					options,
				};
				setQuestions((state) => {
					state = state.map((question, i) => {
						if (i == Number(e.target.id)) question = data;
						return question;
					});
					return state;
				});
				j(".discard").click();
				alert("saved");
			}
		}
	}

	function toggleCreatedQuestion(e) {
		if (j(".created-questions").hasClass("show"))
			j(e.target).html(Questions.length), setToggled(false);
		else j(e.target).html("&times;"), setToggled(true);
		j(".created-questions").toggleClass("show");
	}

	return (
		<Layout>
			<section className="main">
				<div className="main-wrapper">
					<div className="form-group create-question">
						<div className="wrap">
							<div className="title">
								<h3>Quiz Creator</h3>
							</div>
							<div className="question-wrap">
								<textarea
									className="question"
									id="question"
									placeholder="Enter your question.."
									onKeyUp={KeyUpQuestion}
								/>
							</div>
							<div className="options-wrap">
								<div className="header">
									<div className="title">
										<div className="text">Options</div>
									</div>
									<div
										className="add-btn"
										data-role="button"
										ref={addBtn}
										onClick={(
											e: React.MouseEvent<
												HTMLDivElement,
												MouseEvent
											>
										) => {
											AddOptions(e);
										}}
									>
										&plus;
									</div>
								</div>
								<div className="options option-list" />
							</div>
							<div className="button-wrap">
								<div className="create-wrap">
									<button
										className="create-btn"
										onClick={CreateQuestion}
									>
										Create question
									</button>
								</div>
								<div
									className="reset-wrap"
									onClick={resetPollStateToDefault}
								>
									<button className="reset">Reset</button>
								</div>
							</div>
						</div>
					</div>
					<div className="created-questions">
						<div className="wrap">
							<div className="title">
								<h4>Created Questions</h4>
							</div>
							<ul className="question-list">
								{Questions?.length ? (
									<>
										{Questions.map((qInfo, i) => {
											return (
												<li
													className="question-wrapper ques"
													key={Math.random().toString(
														12
													)}
												>
													<div className="question-box">
														<div className="text">
															{qInfo.question}
														</div>
													</div>
													<div className="options-wrapper">
														<ul className="option-list">
															{qInfo.options.map(
																(option) => {
																	return (
																		<li
																			className={
																				option.checked
																					? "q-option answer"
																					: "q-option"
																			}
																			key={Math.random().toString(
																				12
																			)}
																		>
																			{
																				option.text
																			}
																		</li>
																	);
																}
															)}
														</ul>
													</div>
													<div className="del-edit">
														<button
															className="remove"
															onClick={() =>
																Remove(i)
															}
														>
															Remove
														</button>
														<button
															className="edit"
															onClick={() =>
																Edit(i)
															}
														>
															Edit
														</button>
													</div>
												</li>
											);
										})}
										<div className="save_question">
											<Link href="/saveQuestions">
												<a
													href="#"
													style={{
														width: "100%",
														padding: "10px",
														textAlign: "center",
														background: "grey",
													}}
												>
													Save Questions
												</a>
											</Link>
										</div>
									</>
								) : (
									<div className="empty">
										<h3>No question created</h3>
									</div>
								)}
							</ul>
						</div>
					</div>
					<div className="edit-question">
						<div className="title">
							<h3>Edit Question</h3>
						</div>
						<div className="form-group">
							<div className="wrap">
								<div className="question-wrap">
									<textarea
										className="uquestion"
										id="uquestion"
										placeholder="Enter your question.."
									/>
								</div>
								<div className="options-wrap">
									<div className="header">
										<div className="title">
											<div className="text">Options</div>
										</div>
										<div
											className="uadd-btn"
											data-role="button"
											ref={uAddBtn}
											onClick={AddOptions}
										>
											&times;
										</div>
									</div>
									<div className="uoptions option-list" />
								</div>
								<div className="button-wrap">
									<div className="discard-wrap">
										<button
											className="discard"
											onClick={Discard}
										>
											Discard
										</button>
									</div>
									<div className="save-wrap">
										<button
											className="save-btn save"
											onClick={Save}
										>
											Save
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div
					className="toggle-created-question"
					onClick={toggleCreatedQuestion}
				>
					{!toggled ? Questions.length : <i>&times;</i>}
				</div>
			</section>
		</Layout>
	);
}

export default QuizCreator;
