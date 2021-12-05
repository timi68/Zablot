/* eslint-disable @next/next/no-img-element */
// @ts-check

import {v4 as uuid} from "uuid";

export function ChatRoom({j, user, from, e, socket}) {
	console.log(user);
	const to = user.Id;
	const _id = user._id;
	const id = user._id.slice(12, user._id.length) + uuid().slice(0, 12);
	const name = user.Name;
	const index = j(".chat-form-container").children().length;
	if (index == 2) {
		j(".chats-form:first").remove();
	}

	const chatForm = j("<div>", {classname: "chats-form", id});
	const close = j("<div>", {
		classname: "close-card",
		"data-role": "Close card",
	});
	const formGroup = j("<div>", {classname: "form-group chats-room"});
	const roomHeader = j("<div>", {classname: "room-header"});
	const profile = j("<div>", {classname: "profile"});
	const UserName = j("<div>", {classname: "name"});
	const ActiveSign = j("<div>", {classname: "active-sign"});
	const Online = j("<div>", {classname: "active-text"});
	const Options = j("<div>", {classname: "options"});

	// -------------- Room Body ---------------------
	const roomBody = j("<div>", {classname: "room-body"});
	const welcomeMessage = j("<div>", {classname: "welcome-message"});
	const alertMessage = j("<div>", {classname: "alert-message"}).text(0);
	welcomeMessage.html(
		`<div classname="message"><span>You are now connected</span></div>`
	);

	// ------------------- ROOM FOOTER BORAD -------- --------- -------
	const roomFooter = j("<div>", {classname: "room-footer"});
	const createBox = j("<div>", {classname: "message-create-box input-box"});
	const inputGroup = j("<div>", {classname: "input-group"});
	const mediaIcon = j("<div>", {classname: "icon media-icon"});
	const message = j("<textarea>", {
		classname: "text-control",
		name: "message",
		id: "text-control message",
		placeholder: "Type a message..",
	});
	const sendBtn = j("<div>", {classname: "send-btn"});
	const send = j("<button>", {classname: "btn send"});
	const media = j("<div>", {classname: "media-message-wrapper"});
	const multimedia = j("<div>", {classname: "multimedia-list list"});
	const mediaList = j("<ul>", {classname: "media-list"});
	const mediaLi1 = j("<li>", {classname: "media"});
	const mediaLi2 = j("<li>", {classname: "media"});
	const mediaLi3 = j("<li>", {classname: "poll toggle-poll"});

	// Room Footer ==> Create Poll Board
	const CreatePoll = j("<div>", {classname: "create-question"});
	const pollHeader = j("<div>", {classname: "poll-header"});
	const discardPoll = j("<div>", {classname: "discard-wrap"});
	const createPoll = j("<div>", {classname: "create-wrap"});
	const pollBody = j("<div>", {classname: "poll-body"});
	const questionBox = j("<div>", {classname: "question-box"});
	const textBoxQuestion = j("<div>", {classname: "text-box question"});
	const textControl = j("<textarea>", {
		classname: "text-control",
		id: "question",
		name: "question",
		placeholder: "Enter your question..",
	});
	const questionOptions = j("<div>", {classname: "question-options"});
	const header = j("<div>", {classname: "header"});
	const addOptions = j("<div>", {classname: "add-options add"});
	const optionList = j("<ul>", {classname: "option-list wrap"});
	const additionalOptions = j("<div>", {classname: "additional-options"});
	const options = j("<div>", {classname: "options"});
	const timer = j("<div>", {classname: "option-wrap timer"});
	const coin = j("<div>", {classname: "coin option-wrap"});
	const inputTime = j("<input>", {
		classname: "text-control time",
		type: "text",
		id: "timing",
		name: "time",
		maxLength: 3,
		autocomplete: "off",
	});
	const inputCoin = j("<input>", {
		classname: "text-control coin",
		type: "text",
		id: "coin",
		name: "coin",
		maxLength: 3,
		autocomplete: "off",
	});
	const challenge = j("<input>", {
		classname: "radio challenge",
		type: "checkbox",
		id: "challenge",
		name: "challenge",
	});
	const control = j("<div>", {classname: "control"});
	const challengeOption = j("<div>", {classname: "challenge option-wrap"});

	{
		close.click(CloseCard);
		message.keyup(TextControl);
		roomBody.click(RemoveMedia);
		mediaIcon.click(MediaList);
		createPoll.click(CreateWrap);
		discardPoll.click(resetPollStateToDefault);
		addOptions.click(AddOptions);
		textControl.keyup(Question);
		mediaLi3.click(TogglePoll);
		inputTime.keyup(function () {
			var text = j(this).val().match(/\D+/g);
			if (text === null) {
				j(this).removeClass("required");
			} else {
				j(this).addClass("required");
			}
		});
		inputCoin.keyup(function () {
			var text = j(this).val().match(/\D+/g);
			if (text === null) {
				j(this).removeClass("required");
			} else {
				j(this).addClass("required");
			}
		});
	}

	{
		mediaLi1.html(
			`<i classname="ion-ios-image icon image-icon"></i><label classname="icon-label">Image</label>`
		);
		send.html(
			` <svg classname="svg" alt="send message" height="24px"viewBox="0 0 24 24" width="24px" fill="#000000">path d="M0 0h24v24H0V0z" fill="none" /><path d="M4.01 6.03l7.51 3.22-7.52-1 .01-2.22m7.5 8.72L4 17.97v-2.22l7.51-1M2.01 3L2 10l15 2-15 2 .01 7L23 12 2.01 3z" /></svg>`
		);
		mediaLi2.html(
			`<i classname="ion-ios-play-circle icon video-icon"></i><label classname="icon-label">Video</label>`
		);
		close.html("<div classname='icon'>&times;</div>");
		mediaIcon.html(
			`<svg height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" /></svg>`
		);
		challengeOption.html(
			`<div classname="label-text"><div classname="text">Challenge</div></div>`
		);
		timer.html(`<label for="timing" classname="label">Set time(s)</label>`);
		createPoll.html(`<div classname="text"><span>Create</span></div>`);
		questionBox.html(
			`<div classname="title"><div classname="text">Question</div></div>`
		);
		additionalOptions.html(
			`<div classname="title"><div classname="text">Additional options</div></div>`
		);
		discardPoll.html(`<div classname="text"><span>Discard</span></div>`);
		header.html(
			`<div classname="title"><div classname="text">Options</div></div>`
		);
		coin.html(`<label for="coin" classname="label">Add coin</label>`);
		addOptions.html(`<i classname="ion-ios-add icon"></i>`);
		pollHeader.html(
			`<div classname="title"><div classname="text">Poll</div></div>`
		);
		mediaLi3.html(
			`<i classname="ion-ios-podium icon" id="poll-icon"></i><label classname="icon-label">Poll</label>`
		);
		UserName.html(`<span classname="textname">${name}</span>`);

		Online.html(user.active ? "online" : "offline");
		Options.html(
			`<div classname="options-list">
					<div classname="option navigate"></div>
				</div>
			`
		);

		ActiveSign.append(Online);
		UserName.append(ActiveSign);
		profile.append(UserName, Options);
		j(e.target)
			.parents(".user")
			.find(".user-image")
			.clone()
			.prependTo(profile);
	}

	{
		sendBtn.append(send);
		inputGroup.append(mediaIcon, message, sendBtn);
		mediaList.append(mediaLi1, mediaLi2, mediaLi3);
		multimedia.append(mediaList);
		media.append(multimedia);
		timer.append(inputTime);
		coin.append(inputCoin);
		control.append(challenge);
		challengeOption.append(control);
		options.append(timer, coin, challengeOption);
		additionalOptions.append(options);
		header.append(addOptions);
		questionOptions.append(header, optionList);
		textBoxQuestion.append(textControl);
		questionBox.append(textBoxQuestion, questionOptions);
		pollBody.append(questionBox, questionOptions, additionalOptions);
		pollHeader.append(discardPoll, createPoll);
		CreatePoll.append(pollHeader, pollBody);
		createBox.append(inputGroup, media, CreatePoll);
		roomFooter.append(createBox);
		roomBody.append(welcomeMessage, alertMessage);
		roomHeader.append(profile);
		formGroup.append(roomHeader, roomBody, roomFooter);
		chatForm.append(close, formGroup).appendTo(".chat-form-container");
	}

	function TextControl() {
		if (!j(this).val()) {
			j(send).removeClass("activated").off();
		} else {
			const message = j(this).val();
			j(send)
				.addClass("activated")
				.off()
				.click(() => sendMessage(message, "outgoing-message"));
		}
	}

	/**
	 * @param {any} t
	 * @param {string} _class
	 */
	function sendMessage(t, _class) {
		const hrs = new Date().getHours();
		const mins =
			new Date().getMinutes().toString().length > 1
				? new Date().getMinutes()
				: "0" + new Date().getMinutes();
		const lastChild = j(roomBody).children().last();
		const secondLast = j(roomBody).children().eq(-2);
		const lastTime =
			parseInt(j(roomBody).find(".time small").last().html()) > hrs;
		const group = j("<div>", {classname: "group"}).html(
			"<span>Today</span>"
		);
		const text = j("<div>", {classname: "text"}).html(t);
		const time = j("<span>", {classname: "time"}).html(
			`<small> ${hrs + ":" + mins} </small>`
		);
		const image = j(e.target).parents(".user").find(".user-image").clone();
		const plain = j("<div>", {classname: "plain-message"}).append(
			text,
			_class === "incoming-message"
				? lastChild.is(".incoming-message") === true
					? ""
					: image
				: "",
			time
		);
		const wrapper = j("<div>", {classname: "message-wrapper"}).append(
			plain
		);
		const outgoing = j("<div>", {classname: _class}).append(wrapper);

		if (_class === "outgoing-message") {
			console.log("emitting now");

			const I = {
				_id,
				from,
				to,
				type: "plain",
				message: t,
			};
			socket.emit(
				"OUTGOINGMESSAGE",
				I,
				(/** @type {any} */ err, {messageId}) => {
					console.log(err ?? messageId, "from emitter");
					if (!err && messageId) {
						if (lastChild.is(".outgoing-message")) {
							lastChild.addClass("adjust");
						}

						if (lastTime) {
							roomBody.append(group);
						}
						outgoing
							.attr("id", messageId)
							.appendTo(roomBody)
							.parent()
							.animate(
								{
									scrollTop: outgoing
										.parent()
										.prop("scrollHeight"),
								},
								"slow"
							);
					}
				}
			);
			j(message).val("");
		}

		if (_class === "incoming-message") {
			if (lastChild.is(".incoming-message")) {
				secondLast.is(".incoming-message")
					? lastChild.addClass("adjust")
					: lastChild.addClass("adjust-mg"),
					outgoing.addClass("adjust-pd");
			}
			if (lastTime) {
				roomBody.append(group);
			}

			outgoing
				.appendTo(roomBody)
				.parent()
				.animate(
					{
						scrollTop: outgoing.parent().prop("scrollHeight"),
					},
					"slow"
				);
		}
	}

	/**
	 * @param {any} e
	 */
	function MediaList(e) {
		j(media).toggleClass("active");
	}

	function CloseCard() {
		socket.off("INCOMINGMESSAGE", IncomingMessage);
		socket.off("STATUS", Status);
		socket.off("INCOMINGFORM", IncomingForm);
		socket.off("ANSWERED", ANSWERED);
		j(this)
			.parents(".chats-form")
			.slideToggle(700)
			.queue(function () {
				j(this).remove();
			});
	}

	function TogglePoll() {
		j(this)
			.parents(".chats-form")
			.find(".create-question")
			.toggleClass("active");
		j(this).parents(".media-message-wrapper").removeClass("active");
	}

	function Question() {
		j(this).removeClass("empty");
		UpdatePoll();
	}

	function AddOptions() {
		j(this).removeClass("more-option-required");
		j("<li>", {classname: "option"})
			.append(
				j("<div>", {classname: "text-box"})
					.append(
						j("<input>", {
							type: "radio",
							name: "answer",
							id: "answer",
							classname: "answer",
						})
					)
					.append(
						j("<textarea>", {
							name: `option-input`,
							placeholder: "Enter option..",
							classname: "text-control text-box",
						}).keyup(function () {
							j(this).removeClass("empty");
							UpdatePoll();
						})
					)
			)
			.append(
				j("<div>", {classname: "remove-option"})
					.click(function () {
						j(this).parent().slideUp(500);
						setTimeout(() => {
							j(this).parent().remove();
							UpdatePoll();
						}, 500);
					})
					.append(j("<div>", {classname: "icon", html: "&times;"}))
			)
			.slideUp(10)
			.appendTo(optionList)
			.slideDown("slow", function () {
				var child = optionList.children().last();
				j(CreatePoll).animate(
					{
						scrollTop: j(child).prop("offsetTop") / 2,
					},
					"slow"
				);
			})
			.find("textarea")
			.focus();

		UpdatePoll();
	}

	function CreateWrap() {
		{
			var empty = 0;

			if (!j(textControl).val()) {
				j(this)
					.parents(".create-question")
					.animate(
						{
							scrollTop: j(this).prop("offsetTop") / 2,
						},
						"slow",
						function () {
							j(this).after(() => {
								j(textControl).addClass("empty").focus();
							});
						}
					);

				return;
			}
			{
				let totalOption = j(optionList).find("textarea").length;
				if (totalOption < 2) {
					j(CreatePoll).animate(
						{
							scrollTop: j(optionList).offset().Top,
						},
						500,
						function () {
							j(this).after(() => {
								j(addOptions).toggleClass(
									"more-option-required"
								);
							});
						}
					);

					return;
				}
				j(optionList)
					.find("textarea")
					.each((/** @type {number} */ i, /** @type {any} */ e) => {
						let val = j(e).val();
						if (val == "") {
							let jscroll =
								j(CreatePoll).prop("clientHeight") -
								(totalOption - i) * 30;

							j(CreatePoll)
								.animate(
									{
										scrollTop: jscroll,
									},
									500
								)
								.promise()
								.done(() => {
									j(e).addClass("empty").focus();
								});
							empty++;
							return false;
						}
					});
			}

			if (empty > 0) return;
		}

		{
			var options = j(CreatePoll)
				.find(".answer")
				.map(function (/** @type {any} */ i, /** @type {any} */ e) {
					let option = [];
					var text = j(e).parents("li").find("textarea").eq(0).val();
					var checked = j(e).is(":checked");
					option.push({
						index: i,
						text,
						checked,
					});

					return option;
				})
				.toArray();

			var hasClass = j(this).is(".create.active");
			if (hasClass) {
				var isChecked = j(options)
					.filter(
						(/** @type {string | number} */ i) =>
							options[i].checked === true
					)
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

		{
			var data = {};
			var question = j(textControl).val();
			var timer = j(inputTime).val();
			var coin = j(inputCoin).val();
			var C = j(challenge).is(":checked");
			var matchCoin = j(inputCoin).hasClass("required");
			var matchTimer = j(inputTime).hasClass("required");

			if (matchTimer || matchCoin) {
				j(CreatePoll).animate(
					{
						scrollTop: j(CreatePoll).prop("scrollHeight"),
					},
					"slow"
				);

				return;
			}

			if (C) {
				var count = 0;
				if (!timer) {
					j(inputTime).addClass("required");
					count++;
				}
				if (!coin) {
					j(inputCoin).addClass("required");
					count++;
				}

				if (count > 0) {
					j(CreatePoll).animate(
						{
							scrollTop: j(CreatePoll).prop("scrollHeight"),
						},
						"slow"
					);

					return;
				}
			}

			data = {
				...{
					_id,
					from,
					to,
					type: "Form",
					question,
					options,
					timer,
					coin,
					C,
				},
			};

			resetPollStateToDefault();

			socket.emit(
				"OUTGOINGFORM",
				data,
				(
					/** @type {any} */ err,
					/** @type {{ formId: any; }} */ res
				) => {
					console.log(err ?? res);
					if (!err && res?.formId) {
						data._id = res.formId;
						CreateQuestionPreview(data, true);
						j(roomBody).animate(
							{
								scrollTop: j(roomBody).prop("scrollHeight"),
							},
							"slow"
						);
					} else {
						console.log("There is error sending form message");
					}
				}
			);
		}
	}

	function RemoveMedia() {
		j(this)
			.parents(".chats-form")
			.find(".media-message-wrapper")
			.removeClass("active");
	}

	/**
	 * @param {{ answered?: object; _id?: any; options?: any[]; question?: String; coin?: Number; timer?: Number; }} data
	 * @param {boolean} outgoing
	 */
	function CreateQuestionPreview(data, outgoing) {
		console.log(data);
		var answer = data.options.filter(
			(option) => option.checked === true
		)[0];
		var choosed = data.answered?.index ? data.answered : null;
		var key = uuid().slice(0, 12);

		const timeCount = j("<div>", {classname: "time-count"});
		const timer = j("<div>", {classname: "timer"});
		const coin = j("<div>", {classname: "coin"});
		const coinAdded = j("<div>", {classname: "coin-added"});
		const pollQuestionHeader = j("<div>", {
			classname: "poll-question-header",
		});
		const question = j("<div>", {classname: "text", id: "question"});
		const pollQuestion = j("<div>", {classname: "poll-question"});
		const formGroup = j("<div>", {classname: "form-group"});
		const formMessage = j("<div>", {
			classname: `form-message poll question ${
				choosed != undefined
					? choosed.index === answer.index
						? "correct"
						: "failed"
					: ""
			}`,
			id: data._id,
		});
		const wrapper = j("<div>", {
			classname: "outgoing-message outgoing-form",
			id: data._id.slice(0, 10),
		});
		const pollOptions = j("<div>", {classname: "poll-options"});
		const ul = j("<ul>", {classname: "options"}).append(
			data.options.map(
				(
					/** @type {{ index: any; checked: any; text: any; }} */ option,
					/** @type {any} */ i
				) => {
					return j("<li>", {
						classname: `option ${
							choosed != undefined
								? choosed.index === option.index
									? choosed.checked
										? "correct"
										: "failed"
									: option.checked
									? "correct"
									: ""
								: ""
						}`,
					})
						.append(
							j("<div>", {
								classname: "form-group",
							}).append(
								j("<input>", {
									type: "radio",
									name: key,
									id: "option",
									classname: `option${i}`,
								})
							)
						)
						.append(
							j("<div>", {
								classname: "option-text label",
							}).append(j("<label>").text(option.text))
						);
				}
			)
		);

		question.text(data.question);
		coin.html(`coins <b>${data.coin}</b>`);
		timeCount.html(`Time remaining <b>${data.timer}s</b>`);
		coinAdded.append(coin);
		timer.append(timeCount);
		pollQuestionHeader.append(
			data.timer ? timer : "",
			data.coin ? coinAdded : ""
		);
		pollQuestion.append(pollQuestionHeader, question);
		pollOptions.append(ul);
		formGroup.append(pollQuestion, pollOptions);
		formMessage.append(formGroup);
		wrapper.append(formMessage);

		if (outgoing == true) {
			wrapper.appendTo(roomBody);
			return;
		}

		if (choosed) {
			j(ul).find("input").eq(choosed.index).prop("checked", true);
			j(wrapper).css("pointerEvents", "none");
		}
		return wrapper;
	}

	function UpdatePoll() {
		let totalOption = j(optionList).find("textarea").length;
		let count = 0;
		let question = j(textControl).val();
		j(optionList)
			.find("textarea")
			.each((/** @type {any} */ i, /** @type {any} */ e) => {
				let val = j(e).val();
				!val ?? val === "" ? count++ : "";
			});

		if (totalOption >= 2 && count <= 2 && question) {
			switch (totalOption) {
				case 2:
					count < 1
						? j(createPoll).addClass("active create")
						: j(createPoll).removeClass("active create");
					break;
				case 3:
					count <= 1
						? j(createPoll).addClass("active create")
						: j(createPoll).removeClass("active create");
					break;
				case 4:
					count <= 2
						? j(createPoll).addClass("active create")
						: j(createPoll).removeClass("active create");
					break;

				default:
					break;
			}
		} else {
			j(createPoll).removeClass("active create");
		}
	}

	function resetPollStateToDefault() {
		j(chatForm)
			.find(".create-question")
			.removeClass("active")
			.delay(500)
			.queue(function (/** @type {() => void} */ next) {
				j(chatForm)
					.find(".text-control")
					.val("")
					.end()
					.find(".required, .empty, .create-wrap")
					.removeClass("required empty create active")
					.end()
					.find(".option-list")
					.empty()
					.end()
					.find("input")
					.filter(":checked")
					.prop("checked", false);
				next();
			});

		return;
	}

	const optionListMutation = new MutationObserver(function (e) {
		if (e[0].removedNodes) {
			// @ts-ignore
			const childrenLength = e[0].target.children.length;
			{
				if (childrenLength >= 4) {
					j(addOptions).fadeOut();
				} else {
					j(addOptions).fadeIn();
				}
			}
		}
	});

	j(".option-list").each((/** @type {any} */ i, /** @type {Node} */ e) => {
		if (i == index) {
			optionListMutation.observe(e, {
				childList: true,
			});
		}
	});

	const GroupMessage = ({cur, pre, i}) => {
		var date = new Date().getDate();
		if (i === 0) {
			if (cur === date) {
				return "Today";
			} else if (date === cur + 1) {
				return "Yesterday";
			} else {
				var date = new Date(cur).getMonth();
				+":" + new Date(cur).getDate();
				return date;
			}
		} else if (cur !== pre) {
			if (date === cur) {
				return "Today";
			} else if (date === cur + 1) {
				return "Yesterday";
			} else {
				var date = new Date(cur).getMonth();
				+":" + new Date(cur).getDate();
				return date;
			}
		} else {
			return "";
		}
	};

	const FetchedMessages = (
		/** @type {{ Message: any[]; _id: string; }} */ messages
	) => {
		const fragmentArray = [];
		messages.Message.map(
			(
				/** @type {{ date: Date; coming: String; going: String; Format: string; message: string; answered? : object; picked? : object }} */ data,
				/** @type {number} */ i
			) => {
				const hrs = new Date(data.date).getHours();
				const mins =
					new Date(data.date).getMinutes().toString().length > 1
						? new Date(data.date).getMinutes()
						: "0" + new Date(data.date).getMinutes();
				const cur = new Date(data.date).getDate();

				const pre =
					i > 0
						? new Date(messages.Message[i - 1].date).getDate()
						: "";

				const Group = GroupMessage({cur, pre, i});

				if (Group) {
					const group = j("<div>", {classname: "group"}).html(
						"<span>" + Group + "</span>"
					);
					fragmentArray.push(group);
				}

				const prevComingId =
					i > 0
						? messages.Message[i - 1].coming === data.coming
						: false;
				const nextComingId =
					i > 0 && i < messages.Message.length - 1
						? messages.Message[i + 1].coming === data.coming
						: false;
				const prevGoingId =
					i > 0
						? messages.Message[i - 1].going === data.going
						: false;
				const nextGoingId =
					i > 0 && i < messages.Message.length - 1
						? messages.Message[i + 1].going === data.going
						: false;

				if (data.coming === to) {
					if (data.Format === "Form") {
						const incoming = IncomingForm(data);
						fragmentArray.push(incoming);
						return;
					}
					const text = j("<div>", {classname: "text"}).html(
						data.message
					);
					const image = j(e.target)
						.parents(".user")
						.find(".user-image")
						.clone();
					const time = j("<span>", {classname: "time"}).html(
						`<small> ${hrs + ":" + mins} </small>`
					);
					const plain = j("<div>", {
						classname: "plain-message",
					}).append(text, prevComingId ? "" : image, time);

					const wrapper = j("<div>", {
						classname: "message-wrapper",
					}).append(plain);
					const incoming = j("<div>", {
						classname: `incoming-message ${
							prevComingId
								? nextComingId
									? "adjust"
									: "adjust-pd"
								: nextComingId
								? "adjust-mg"
								: ""
						}`,
					}).append(wrapper);

					return fragmentArray.push(incoming);
				} else {
					if (data.Format == "Form") {
						const outgoing = CreateQuestionPreview(data, false);
						fragmentArray.push(outgoing);
						return;
					}
					const text = j("<div>", {classname: "text"}).html(
						data.message
					);
					const time = j("<span>", {classname: "time"}).html(
						`<small> ${hrs + ":" + mins} </small>`
					);
					const plain = j("<div>", {
						classname: "plain-message",
					}).append(text, time);
					const wrapper = j("<div>", {
						classname: "message-wrapper",
					}).append(plain);
					const outgoing = j("<div>", {
						classname: `outgoing-message ${
							prevGoingId
								? nextGoingId
									? "adjust"
									: ""
								: nextGoingId
								? "adjust"
								: ""
						} `,
					}).append(wrapper);

					return fragmentArray.push(outgoing);
				}
			}
		);
		roomBody
			.append(fragmentArray)
			.prop("scrollTop", roomBody.prop("scrollHeight"));
	};

	j.ajax({
		url: "/api/messages",
		type: "POST",
		data: JSON.stringify({_id}),
		contentType: "application/json",
		success: (/** @type {{ Message: any[]; _id: String; }} */ messages) => {
			if (messages?.Message?.length > 0) {
				FetchedMessages(messages);
			}
		},
		error: (
			/** @type {any} */ x,
			/** @type {any} */ i,
			/** @type {any} */ jqXHR
		) => {
			console.log(x, i, jqXHR);
		},
	});

	/**
	 * @param {{ from: any; message: any; }} data
	 */

	function IncomingMessage(data) {
		console.log(data);
		if (data.from === to) {
			sendMessage(data?.message, "incoming-message");
		}
	}

	/**
	 * @param {{ _id: any; online: any; }} data
	 */

	function Status(data) {
		if (data._id === to) {
			Online.html(data.online ? "online" : "offline");
		}
	}

	/**
	 *
	 * @param {{ answered?: object; date?: Date,  _id?: any; options?: any[]; going?: String; coming?: String; from?: String, to?: String; question?: String; coin?: Number; timer?: Number; }} data
	 * @returns
	 */

	const IncomingForm = (data) => {
		console.log("this", data);

		// stopping unwanted caller
		// function must have this specific attribute to continue
		// @from || @going && @coming from the parameter @data

		if (data.from !== to) {
			if (!data.going || !data.coming) {
				return;
			}
		}

		/**
		 * @var {{index: Number, text: String, checked: Boolean}} answer
		 */
		var answer = data.options.filter(
			(option) => option.checked === true
		)[0];
		const choosed = data.answered?.index ? data.answered : null;
		const qCoin = data.coin ? data.coin : null;
		var key = uuid().slice(0, 12);

		const timeCount = j("<div>", {classname: "time-count"});
		const timer = j("<div>", {classname: "timer"});
		const coin = j("<div>", {classname: "coin"});
		const coinAdded = j("<div>", {classname: "coin-added"});
		const pollQuestionHeader = j("<div>", {
			classname: "poll-question-header",
		});
		const question = j("<div>", {classname: "text", id: "question"});
		const pollQuestion = j("<div>", {classname: "poll-question"});
		const formGroup = j("<div>", {classname: "form-group"});
		const formMessage = j("<div>", {
			classname: `form-message poll question ${
				choosed != undefined
					? choosed.index === answer.index
						? "correct"
						: "failed"
					: ""
			}`,
			id: data._id,
		});
		const wrapper = j("<div>", {
			classname: "incoming-message incoming-form",
			id: data._id.slice(0, 10),
		});
		const pollOptions = j("<div>", {classname: "poll-options"});
		const ul = j("<ul>", {classname: "options"}).append(
			data.options.map(Map)
		);

		// Appending to elements created by jquery
		{
			question.text(data.question);
			coin.html(`coins <b>${data.coin}</b>`);
			timeCount.html(`Time remaining <b>${data.timer}</b>s`);
			coinAdded.append(coin);
			timer.append(timeCount);
			pollQuestionHeader.append(
				data.timer ? timer : "",
				data.coin ? coinAdded : ""
			);
			pollQuestion.append(pollQuestionHeader, question);
			pollOptions.append(ul);
			formGroup.append(pollQuestion, pollOptions);
			formMessage.append(formGroup);
			wrapper.append(formMessage);
		}

		/**
		 * @param {{ index?: Number; checked: Boolean; text?: String; }} option
		 * @param {Number} i
		 */

		function Map(option, i) {
			return j("<li>", {
				classname: `option ${
					choosed != undefined
						? choosed.index === option.index
							? choosed.checked
								? "correct"
								: "failed"
							: option.checked
							? "correct"
							: ""
						: ""
				}`,
			})
				.append(
					j("<div>", {
						classname: "form-group",
					}).append(
						data.date || !choosed
							? j("<input>", {
									type: "radio",
									name: key,
									id: "option",
									classname: `option${i}`,
							  }).click(function () {
									ANSWERCLICKED(this, option, data._id);
							  })
							: j("<input>", {
									type: "radio",
									name: key,
									id: "option",
									classname: `option${i}`,
							  })
					)
				)
				.append(
					j("<div>", {
						classname: "option-text label",
					}).append(j("<label>").text(option.text))
				);
		}

		// function that will be triggered when one of the option is clicked
		// user has only one chance of choosing an option

		/**
		 * @param {any} element
		 * @param {{checked: boolean;}} option
		 * @param {String} messageId
		 */
		function ANSWERCLICKED(element, option, messageId) {
			if (option.checked === true) {
				j(element).parents("li").addClass("correct");
				j(formMessage).addClass("correct before");

				const D = {
					id: _id,
					from,
					to,
					messageId,
					picked: option,
					answer,
					coin: data.coin,
					timer: data.timer,
				};

				socket.emit(
					"ANSWERED",
					D,
					(/** @type {any} */ err, /** @type {any} */ done) => {
						console.log(err || done, "from answered callback");

						if (!err) {
							if (qCoin) {
								var text = j(".coin-count span").html();
								text = parseInt(text);
								var count = 0;
								var decrement = setInterval(() => {
									text++;
									j(".coin-count span").html(text);
									count++;

									if (count == qCoin) {
										clearInterval(decrement);
									}
								}, 20);
							}
						}
					}
				);
			} else {
				j(element).parents("li").addClass("failed");
				j(formMessage).addClass("failed before");

				j(formMessage)
					.find(`.option${answer.index}`)
					.parents("li")
					.addClass("correct");

				const D = {
					id: _id,
					from,
					to,
					messageId,
					picked: option,
					answer,
					coin: data.coin,
					timer: data.timer,
				};

				socket.emit(
					"ANSWERED",
					D,
					(/** @type {any} */ err, /** @type {any} */ done) => {
						console.log(err || done, "from answered callback");
						if (!err) {
							if (qCoin) {
								var text = j(".coin-count span").html();
								text = parseInt(text);
								var count = 0;
								var decrement = setInterval(() => {
									text--;
									j(".coin-count span").html(text);
									count++;

									if (count == qCoin) {
										clearInterval(decrement);
									}
								}, 20);
							}
						}
					}
				);
			}

			j(formMessage)
				.find("input")
				.each((/** @type {any} */ i, /** @type {any} */ e) => {
					j(e).off();
				});

			setTimeout(() => {
				j(formMessage).removeClass("before");
			}, 5000);
		}

		// clearing moovement cos the initial function is serving 2 caller
		// checking where it's coming using this if statement
		// @incoming is a parameter pass to the function

		if (!choosed && data.from) {
			wrapper.appendTo(roomBody);
			j(roomBody).animate(
				{
					scrollTop: j(roomBody).prop("scrollHeight"),
				},
				"slow"
			);
			var timing = setInterval(() => {
				var time = parseInt(j(timeCount).find("b").html()) - 1;
				j(timeCount).find("b").html(time);

				if (time === 0) {
					console.log("the time is over");
					clearInterval(timing);

					j(ul);
				}
			}, 1000);
		} else {
			if (choosed) {
				j(ul).find("input").eq(choosed.index).prop("checked", true);
				j(wrapper).css("pointerEvents", "none");
			}

			return wrapper;
		}
	};

	// Handler for socket ANSWERED event
	/**
	 * @param {{ coin: string; answer: { index: any; }; messageId: String; picked: { index: any; }; id: any; answered: { index: any; }; from: String;  _id: any; }} data
	 */
	function ANSWERED(data) {
		console.log(data);

		if (data.from !== to) {
			return;
		}

		var qCoin = parseInt(data.coin);
		var coin = parseInt(j(document).find(".coin-count span").html());

		if (data.answer.index === data.picked.index) {
			var count = 0;
			console.log(
				j(`#${data.messageId}`).find("input").eq(data.answer.index)
			);
			j(`#${data.messageId}`).addClass("correct before");

			j(`#${data.messageId}`)
				.find("input")
				.eq(data.picked.index)
				.prop("checked", true)
				.parents("li")
				.addClass("correct");

			setTimeout(() => {
				j(roomBody).find(`#${data.messageId}`).removeClass("before");
			}, 5000);

			var decrement = setInterval(() => {
				coin--;
				j(document).find(".coin-count span").html(coin);
				count++;

				if (count == qCoin) {
					clearInterval(decrement);
				}
			}, 20);
		} else {
			var count = 0;
			j(`#${data.messageId}`).addClass("failed before");
			j(`#${data.messageId}`)
				.find("input")
				.eq(data.picked.index)
				.prop("checked", true)
				.parents("li")
				.addClass("failed");

			setTimeout(() => {
				j(roomBody).find(`#${data.messageId}`).removeClass("before");
			}, 5000);

			var increment = setInterval(() => {
				coin++;
				j(document).find(".coin-count span").html(coin);
				count++;

				if (count == qCoin) {
					clearInterval(increment);
				}
			}, 20);
		}
	}

	// Socket handler; socket listener set when each group in created
	// they are also removed when user close the room

	socket.on("INCOMINGMESSAGE", IncomingMessage);
	socket.on("STATUS", Status);
	socket.on("INCOMINGFORM", IncomingForm);
	socket.on("ANSWERED", ANSWERED);
}

export default ChatRoom;

function Chat() {
	return (
		<div className="chats-form" id="7c1e77f8207484344adc-e3a">
			<div className="close-card" data-role="Close card">
				<div className="icon">×</div>
			</div>
			<div className="form-group chats-room">
				<div className="room-header">
					<div className="profile">
						<div className="name">
							<span className="textname">oderinde James</span>
							<div className="active-sign">
								<div className="active-text">online</div>
							</div>
						</div>
						<div className="options">
							<div className="options-list">
								<div className="option navigate"></div>
							</div>
						</div>
					</div>
				</div>
				<div className="room-body">
					<div className="welcome-message">
						<div className="message">
							<span>You are now connected</span>
						</div>
					</div>
					<div className="alert-message">0</div>
					<div
						className="outgoing-message outgoing-form"
						id="615eb5b83d"
						style={{pointerEvents: "none"}}
					>
						<div
							className="form-message poll question failed"
							id="615eb5b83d4b7c1e77f8207f"
						>
							<div className="form-group">
								<div className="poll-question">
									<div className="poll-question-header">
										<div className="timer">
											<div className="time-count">
												Time <b>33s</b>
											</div>
										</div>
										<div className="coin-added">
											<div className="coin">
												coins <b>300</b>
											</div>
										</div>
									</div>
									<div className="text" id="question">
										ggzdgfdfgfdg
									</div>
								</div>
								<div className="poll-options">
									<ul className="options">
										<li className="option correct">
											<div className="form-group">
												<input
													type="radio"
													name="c6f99479-009"
													id="option"
													className="option0"
												/>
											</div>
											<div className="option-text label">
												<label>ffggfdgfgzfzd</label>
											</div>
										</li>
										<li className="option failed">
											<div className="form-group">
												<input
													type="radio"
													name="c6f99479-009"
													id="option"
													className="option1"
												/>
											</div>
											<div className="option-text label">
												<label>gdfgdfggfdg</label>
											</div>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
					<div
						className="incoming-message incoming-form"
						id="615ef8aed1"
						style={{pointerEvents: "none"}}
					>
						<div
							className="form-message poll question failed"
							id="615ef8aed16765ffc04f2e16"
						>
							<div className="form-group">
								<div className="poll-question">
									<div className="poll-question-header">
										<div className="timer">
											<div className="time-count">
												Time remaining <b>34</b>s
											</div>
										</div>
										<div className="coin-added">
											<div className="coin">
												coins <b>566</b>
											</div>
										</div>
									</div>
									<div className="text" id="question">
										dffhfhghchchvghgfhfhghfhgh
									</div>
								</div>
								<div className="poll-options">
									<ul className="options">
										<li className="option ">
											<div className="form-group">
												<input
													type="radio"
													name="299107bc-cc2"
													id="option"
													className="option0"
												/>
											</div>
											<div className="option-text label">
												<label>hvgghghghghghhch</label>
											</div>
										</li>
										<li className="option failed">
											<div className="form-group">
												<input
													type="radio"
													name="299107bc-cc2"
													id="option"
													className="option1"
												/>
											</div>
											<div className="option-text label">
												<label>
													chchchchchhchcv ngbnvghvg
												</label>
											</div>
										</li>
										<li className="option correct">
											<div className="form-group">
												<input
													type="radio"
													name="299107bc-cc2"
													id="option"
													className="option2"
												/>
											</div>
											<div className="option-text label">
												<label> hfgffdgdfdgddgdg</label>
											</div>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="room-footer">
					<div className="message-create-box input-box">
						<div className="input-group">
							<div className="icon media-icon">
								<svg
									height="24px"
									viewBox="0 0 24 24"
									width="24px"
									fill="#000000"
								>
									<path
										d="M0 0h24v24H0V0z"
										fill="none"
									></path>
									<path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"></path>
								</svg>
							</div>
							<textarea
								className="text-control"
								name="message"
								id="text-control message"
								placeholder="Type a message.."
							></textarea>
							<div className="send-btn">
								<button className="btn send">
									<svg
										className="svg"
										height="24px"
										viewBox="0 0 24 24"
										width="24px"
										fill="#000000"
									>
										<path d="M0 0h24v24H0V0z" fill="none" />
										<path d="M4.01 6.03l7.51 3.22-7.52-1 .01-2.22m7.5 8.72L4 17.97v-2.22l7.51-1M2.01 3L2 10l15 2-15 2 .01 7L23 12 2.01 3z"></path>
									</svg>
								</button>
							</div>
						</div>
						<div className="media-message-wrapper">
							<div className="multimedia-list list">
								<ul className="media-list">
									<li className="media">
										<i className="ion-ios-image icon image-icon"></i>
										<label className="icon-label">
											Image
										</label>
									</li>
									<li className="media">
										<i className="ion-ios-play-circle icon video-icon"></i>
										<label className="icon-label">
											Video
										</label>
									</li>
									<li className="poll toggle-poll">
										<i
											className="ion-ios-podium icon"
											id="poll-icon"
										></i>
										<label className="icon-label">
											Poll
										</label>
									</li>
								</ul>
							</div>
						</div>
						<div className="create-question">
							<div className="poll-header">
								<div className="title">
									<div className="text">Poll</div>
								</div>
								<div className="discard-wrap">
									<div className="text">
										<span>Discard</span>
									</div>
								</div>
								<div className="create-wrap">
									<div className="text">
										<span>Create</span>
									</div>
								</div>
							</div>
							<div className="poll-body">
								<div className="question-box">
									<div className="title">
										<div className="text">Question</div>
									</div>
									<div className="text-box question">
										<textarea
											className="text-control"
											id="question"
											name="question"
											placeholder="Enter your question.."
										></textarea>
									</div>
								</div>
								<div className="question-options">
									<div className="header">
										<div className="title">
											<div className="text">Options</div>
										</div>
										<div className="add-options add">
											<i className="ion-ios-add icon"></i>
										</div>
									</div>

									<ul className="option-list wrap"></ul>
								</div>
								<div className="additional-options">
									<div className="title">
										<div className="text">
											Additional options
										</div>
									</div>
									<div className="options">
										<div className="option-wrap timer">
											<label
												htmlFor="timing"
												className="label"
											>
												Set time(s)
											</label>
											<input
												className="text-control time"
												type="text"
												id="timing"
												name="time"
												maxLength={3}
												autoComplete="off"
											/>
										</div>
										<div className="coin option-wrap">
											<label
												htmlFor="coin"
												className="label"
											>
												Add coin
											</label>
											<input
												className="text-control coin"
												type="text"
												id="coin"
												name="coin"
												maxLength={3}
												autoComplete="off"
											/>
										</div>
									</div>
									<div className="challenge option-wrap">
										<div className="label-text">
											<div className="text">
												Challenge
											</div>
										</div>
										<div className="control">
											<input
												className="radio challenge"
												type="checkbox"
												id="challenge"
												name="challenge"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
