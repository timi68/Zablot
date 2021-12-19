/* eslint-disable @next/next/no-img-element */
// @ts-check

import {v4 as uuid} from "uuid";
import axios from "axios";

export function ChatRoom({j, user, from, e, socket}) {
	const to = user.Id;
	const _id = user._id;
	const id = user._id.slice(12, user._id.length) + uuid().slice(0, 12);
	const name = user.Name;
	const fileId = uuid().substr(0, 12);
	const index = j(".chat-form-container").children().length;
	if (index == 2) j(".chats-form:first").remove();

	const chatForm = j("<div>", {class: "chats-form", id});
	const close = j("<div>", {
		class: "close-card",
		"data-role": "Close card",
	});

	// image editor and previewer
	const imagePreview = j("<div>", {
		class: "image-preview-wrapper application",
		role: "application",
	});
	const videoPreview = j("<div>", {
		class: "video-preview-wrapper application",
		role: "application",
	});
	const formGroup = j("<div>", {class: "form-group chats-room"});
	const roomHeader = j("<div>", {class: "room-header"});
	const profile = j("<div>", {class: "profile"});
	const UserName = j("<div>", {class: "name"});
	const ActiveSign = j("<div>", {class: "active-sign"});
	const Online = j("<div>", {class: "active-text"});
	const Options = j("<div>", {class: "options"});

	// -------------- Room Body ---------------------
	const roomBody = j("<div>", {class: "room-body"});

	const welcomeMessage = j("<div>", {class: "welcome-message"});
	const alertMessage = j("<div>", {class: "alert-message"}).text(0);
	welcomeMessage.html(
		`<div class="message"><span>You are now connected</span></div>`
	);

	// ------------------- ROOM FOOTER BORAD -------- --------- -------
	const roomFooter = j("<div>", {class: "room-footer"});
	const createBox = j("<div>", {class: "message-create-box input-box"});
	const inputGroup = j("<div>", {class: "input-group"});
	const mediaIcon = j("<div>", {class: "icon media-icon"});
	const message = j("<textarea>", {
		class: "text-control",
		name: "message",
		id: "text-control message",
		placeholder: "Type a message..",
	});
	const sendBtn = j("<div>", {class: "send-btn"});
	const send = j("<button>", {class: "btn send"});
	const media = j("<div>", {class: "media-message-wrapper"});
	const multimedia = j("<div>", {class: "multimedia-list list"});
	const mediaList = j("<ul>", {class: "media-list"});
	const mediaLi1 = j("<li>", {class: "media video toggle-video"});
	const mediaLi2 = j("<li>", {class: "media image toggle-image"});
	const mediaLi3 = j("<li>", {class: "media poll toggle-poll"});
	const imageInput = j("<input>", {
		class: "file-control image-file",
		type: "file",
		name: "image-file",
		id: fileId + "image",
		accept: "image/*",
		hidden: "true",
	});
	const videoInput = j("<input>", {
		class: "file-control video-file",
		type: "file",
		accept: "video/*",
		id: fileId + "video",
		name: "video-file",
		hidden: "true",
	});
	// Room Footer ==> Create Poll Board
	const CreatePoll = j("<div>", {class: "create-question"});
	const pollHeader = j("<div>", {class: "poll-header"});
	const discardPoll = j("<div>", {class: "discard-wrap"});
	const createPoll = j("<div>", {class: "create-wrap"});
	const pollBody = j("<div>", {class: "poll-body"});
	const questionBox = j("<div>", {class: "question-box"});
	const textBoxQuestion = j("<div>", {class: "text-box question"});
	const textControl = j("<textarea>", {
		class: "text-control",
		id: "question",
		name: "question",
		placeholder: "Enter your question..",
	});
	const questionOptions = j("<div>", {class: "question-options"});
	const header = j("<div>", {class: "header"});
	const addOptions = j("<div>", {class: "add-options add"});
	const optionList = j("<ul>", {class: "option-list wrap"});
	const additionalOptions = j("<div>", {class: "additional-options"});
	const options = j("<div>", {class: "options"});
	const timer = j("<div>", {class: "option-wrap timer"});
	const coin = j("<div>", {class: "coin option-wrap"});
	const inputTime = j("<input>", {
		class: "text-control time",
		type: "text",
		id: "timing",
		name: "time",
		maxLength: 3,
		autocomplete: "off",
	});
	const inputCoin = j("<input>", {
		class: "text-control coin",
		type: "text",
		id: "coin",
		name: "coin",
		maxLength: 3,
		autocomplete: "off",
	});
	const challenge = j("<input>", {
		class: "radio challenge",
		type: "checkbox",
		id: "challenge",
		name: "challenge",
	});
	const control = j("<div>", {class: "control"});
	const challengeOption = j("<div>", {class: "challenge option-wrap"});

	{
		close.on("click", CloseCard);
		message.on("keyup", TextControl);
		roomBody.on("click", RemoveMedia);
		roomBody.on("scroll", function (e) {
			let scrollHeight = e.target.scrollHeight;
			let scrollTop = e.target.scrollTop;

			if (scrollHeight - scrollTop < 250)
				alertMessage.removeClass("show").html(0);
		});
		alertMessage.on("click", function () {
			j(roomBody).animate(
				{
					scrollTop: j(roomBody).prop("scrollHeight"),
				},
				"slow"
			);
			j(this).toggleClass("show").html(0);
		});
		mediaIcon.on("click", MediaList);
		createPoll.on("click", CreateWrap);
		discardPoll.on("click", resetPollStateToDefault);
		addOptions.on("click", AddOptions);
		textControl.on("keyup", Question);
		mediaLi1.on("click", function () {
			document.getElementById(fileId + "image").click();
		});
		mediaLi2.on("click", function () {
			document.getElementById(fileId + "video").click();
		});
		mediaLi3.on("click", function () {
			CreatePoll.toggleClass("active"), media.removeClass("active");
		});
		imageInput.on("change", handleFile);
		videoInput.on("change", handleFile);
		inputTime.on("keyup", function () {
			var text = j(this).val().match(/\D+/g);

			if (text === null) j(this).removeClass("required");
			else j(this).addClass("required");
		});
		inputCoin.on("keyup", function () {
			var text = j(this).val().match(/\D+/g);

			if (text === null) j(this).removeClass("required");
			else j(this).addClass("required");
		});
	}

	// Assigning the Elements Html
	{
		mediaLi1.html(
			`<i class="ion-ios-image icon image-icon"></i><label class="icon-label">Image</label>`
		);
		send.html(
			` <svg class="svg" alt="send message" height="24px"viewBox="0 0 24 24" width="24px" fill="#000000">path d="M0 0h24v24H0V0z" fill="none" /><path d="M4.01 6.03l7.51 3.22-7.52-1 .01-2.22m7.5 8.72L4 17.97v-2.22l7.51-1M2.01 3L2 10l15 2-15 2 .01 7L23 12 2.01 3z" /></svg>`
		);
		mediaLi2.html(
			`<i class="ion-ios-play-circle icon video-icon"></i><label class="icon-label">Video</label>`
		);
		close.html("<div class='icon'>&times;</div>");
		mediaIcon.html(
			`<svg height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" /></svg>`
		);
		challengeOption.html(
			`<div class="label-text"><div class="text">Challenge</div></div>`
		);
		timer.html(`<label for="timing" class="label">Set time(s)</label>`);
		createPoll.html(`<div class="text"><span>Create</span></div>`);
		questionBox.html(
			`<div class="title"><div class="text">Question</div></div>`
		);
		additionalOptions.html(
			`<div class="title"><div class="text">Additional options</div></div>`
		);
		discardPoll.html(`<div class="text"><span>Discard</span></div>`);
		header.html(`<div class="title"><div class="text">Options</div></div>`);
		coin.html(`<label for="coin" class="label">Add coin</label>`);
		addOptions.html(`<i class="ion-ios-add icon"></i>`);
		pollHeader.html(
			`<div class="title"><div class="text">Poll</div></div>`
		);
		mediaLi3.html(
			`<i class="ion-ios-podium icon" id="poll-icon"></i><label class="icon-label">Poll</label>`
		);
		UserName.html(`<span class="textname">${name}</span>`);

		Online.html(user.active ? "online" : "offline");
		Options.html(
			`<div class="options-list">
					<div class="option navigate"></div>
				</div>
			`
		);

		ActiveSign.append(Online);
		UserName.append(ActiveSign);
		profile.append(UserName, Options);
		j(e.target)
			.closest(".chat")
			.find(".user_image")
			.clone()
			.prependTo(profile);
	}

	// Appending to their various parent element
	// Arranging in order the elements should appear
	{
		sendBtn.append(send);
		inputGroup.append(mediaIcon, message, sendBtn);
		mediaLi1.append(imageInput);
		mediaLi2.append(videoInput);
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
		chatForm
			.append(close, imagePreview, videoPreview, formGroup)
			.appendTo(".chat-form-container");
	}

	function handleFile(e) {
		if (
			!(
				window.File &&
				window.FileReader &&
				window.FileList &&
				window.Blob
			)
		) {
			alert("The File APIs are not fully supported in this browser.");
			return false;
		}

		let file = e.target.files[0];
		let imageFileType = [
			"image/jpeg",
			"image/jpg",
			"image/svg",
			"image/png",
			"image/jfif",
		];
		let videoFileType = [
			"video/mp4",
			"video/avi",
			"video/mv4",
			"video/ogm",
			"video/mpg",
		];

		if (imageFileType.includes(file?.type)) {
			// read the files
			var reader = new FileReader();
			reader.readAsArrayBuffer(file);

			reader.onload = function (event) {
				// blob stuff
				var blob = new Blob([event.target.result]); // create blob...
				window.URL = window.URL || window.webkitURL;
				var blobURL = window.URL.createObjectURL(blob); // and get it's URL

				// helper Image object
				var image = new Image();
				image.src = blobURL;
				image.setAttribute("class", "image-previewer");
				image.setAttribute("alt", "previewer");
				//preview.appendChild(image); // preview commented out, I am using the canvas instead
				image.onload = function () {
					// have to wait till it's loaded
					// var resized = resizeMe(image); // send it to canvas
					const message = j("<div>", {
						class: "outgoing-media outgoing-message",
					});
					const message_wrapper = j("<div>", {
						class: "message-wrapper",
					});
					const image_wrapper = j("<div>", {
						class: "media-wrapper outgoing-picture",
					}).append(image);

					message_wrapper.append(image_wrapper);
					roomBody.append(message.append(message_wrapper)).animate(
						{
							scrollTop: roomBody.prop("scrollHeight"),
						},
						"slow"
					);

					(async () => {
						const form = new FormData();
						form.append("image", file);

						try {
							const uploadImage = await axios.post(
								"/api/media/upload",
								form
							);

							let data = {
								message: "Image",
								type: "image",
								_id,
								from,
								to,
								url: uploadImage.data[0].url,
								filename: uploadImage.data[0].filename,
							};

							socket.emit(
								"OUTGOINGMESSAGE",
								data,
								(/** @type {String} */ active) => {
									console.log(active);
								}
							);
						} catch (err) {
							console.log(err);
							return;
						}

						// if (uploadImage.respons.success) {
						// 	socket.emit()
						// }
					})();
				};
			};
		}
	}

	/**
	 * @param {any} t
	 * @param {string} _class
	 * @summary it controls the incoming and outgoing as at that active moment
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
		const group = j("<div>", {class: "group"}).html("<span>Today</span>");

		const text = j("<div>", {class: "text"}).html(t.message);
		const time = j("<span>", {class: "time"}).html(
			`<small> ${hrs + ":" + mins} </small>`
		);
		const plain = j("<div>", {class: "plain-message"}).append(
			text,
			_class === "incoming-message"
				? lastChild.is(".incoming-message")
					? ""
					: j(e.target).closest(".chat").find(".user_image").clone()
				: "",
			time
		);
		const wrapper = j("<div>", {class: "message-wrapper"}).append(plain);
		const outgoing = j("<div>", {class: _class});

		// checking if the message is an outgoing message or not
		if (_class === "outgoing-message") {
			console.log("emitting now");

			// message details
			const I = {
				_id,
				from,
				to,
				type: "plain",
				message: t.message,
			};

			// since it an outgoing message, socket emit the message
			// to the server with the message details
			socket.emit(
				"OUTGOINGMESSAGE",
				I,
				(/** @type {any} */ err, {messageId}) => {
					//this is a callback gotten from the server
					console.log(err ?? messageId, "from emitter");
					if (!err && messageId) {
						// Checking the previous message to know whether to
						// adjust the look of messages arrangement(margin and padding to
						// to be precise)
						if (lastChild.is(".outgoing-message"))
							lastChild.addClass("adjust");

						// if the a new message is sent in a different at a
						// particular moment a group is append to distinguish their
						// day
						if (lastTime) roomBody.append(group);
						outgoing.append(wrapper);
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
			return;
		}

		// Checking if the message is an Incoming message or not
		if (_class === "incoming-message") {
			// Checking the previous message to know whether to
			// adjust the look of messages arrangement(margin and padding to
			// to be precise)
			if (lastChild.is(".incoming-message")) {
				secondLast.is(".incoming-message")
					? lastChild.addClass("adjust")
					: lastChild.addClass("adjust-mg"),
					outgoing.addClass("adjust-pd");
			}

			// if the a new message is sent in a different at a
			// particular moment a group is append to distinguish their
			// day
			if (lastTime) roomBody.append(group);

			// Checking if the message about to be sent is file/media (video|image)
			if (t.type === "image" || t.type === "video") {
				const image = j("<img>", {
					class: "image-previewer",
					alt: t.filename + " previewer",
					src: t.url,
				});
				const message_wrapper = j("<div>", {
					class: "message-wrapper",
				});
				const image_wrapper = j("<div>", {
					class: "media-wrapper incoming-picture",
				}).append(image);

				message_wrapper.append(image_wrapper);
				message_wrapper.append(
					lastChild.is(".incoming-message")
						? ""
						: j(e.target)
								.closest(".chat")
								.find(".user_image")
								.clone(), //Cloning the friend image from the chatboard(with jquery)
					time.addClass("media")
				);
				outgoing.append(message_wrapper);
			}
			// then if not, it means the message is just plain text
			else outgoing.append(wrapper);

			outgoing.appendTo(roomBody);

			// Checking if the user has scroll to check the top messages
			// if the user up to more than 200 scrollHeight a message alert
			// will be given, when clicked the roomBody will scroll to its height
			// else the roomBody will just scroll to its scrollHeight
			let scrollTop = j(roomBody).prop("scrollTop");
			let scrollHeight = j(roomBody).prop("scrollHeight");

			if (scrollHeight - scrollTop > 200) {
				let downMessages = parseInt(alertMessage.text()) + 1;
				alertMessage.text(downMessages).addClass("show");
			} else {
				j(roomBody).animate(
					{
						scrollTop: j(roomBody).prop("scrollHeight"),
					},
					"slow"
				);
			}
		}
	}

	function TextControl() {
		if (!j(this).val()) {
			j(send).removeClass("activated").off();
		} else {
			const message = j(this).val();
			j(send)
				.addClass("activated")
				.off()
				.on("click", () => sendMessage({message}, "outgoing-message"));
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
		j(this).parents(".chats-form").remove();
	}

	function Question() {
		j(this).removeClass("empty");
		UpdatePoll();
	}

	function AddOptions() {
		j(this).removeClass("more-option-required");
		j("<li>", {class: "option"})
			.append(
				j("<div>", {class: "text-box"})
					.append(
						j("<input>", {
							type: "radio",
							name: "answer",
							id: "answer",
							class: "answer",
						})
					)
					.append(
						j("<textarea>", {
							name: `option-input`,
							placeholder: "Enter option..",
							class: "text-control text-box",
						}).on("keyup", function () {
							j(this).removeClass("empty");
							UpdatePoll();
						})
					)
			)
			.append(
				j("<div>", {class: "remove-option"})
					.on("click", function () {
						j(this).parent().slideUp(500);
						setTimeout(() => {
							j(this).parent().remove();
							UpdatePoll();
						}, 500);
					})
					.append(j("<div>", {class: "icon", html: "&times;"}))
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

		const timeCount = j("<div>", {class: "time-count"});
		const timer = j("<div>", {class: "timer"});
		const coin = j("<div>", {class: "coin"});
		const coinAdded = j("<div>", {class: "coin-added"});
		const pollQuestionHeader = j("<div>", {
			class: "poll-question-header",
		});
		const question = j("<div>", {class: "text", id: "question"});
		const pollQuestion = j("<div>", {class: "poll-question"});
		const formGroup = j("<div>", {class: "form-group"});
		const formMessage = j("<div>", {
			class: `form-message poll question ${
				choosed != undefined
					? choosed.index === answer.index
						? "correct"
						: "failed"
					: ""
			}`,
			id: data._id,
		});
		const wrapper = j("<div>", {
			class: "outgoing-message outgoing-form",
			id: data._id.slice(0, 10),
		});
		const pollOptions = j("<div>", {class: "poll-options"});
		const ul = j("<ul>", {class: "options"}).append(
			data.options.map(
				(
					/** @type {{ index: any; checked: any; text: any; }} */ option,
					/** @type {any} */ i
				) => {
					return j("<li>", {
						class: `option ${
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
								class: "form-group",
							}).append(
								j("<input>", {
									type: "radio",
									name: key,
									id: "option",
									class: `option${i}`,
								})
							)
						)
						.append(
							j("<div>", {
								class: "option-text label",
							}).append(j("<label>").text(option.text))
						);
				}
			)
		);

		question.text(data.question);
		coin.html(`coins <b>${data.coin}</b>`);
		timeCount.html(`Time <b>${data.timer}s</b>`);
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
		console.log(messages);
		messages.Message.map(
			(
				/** @type {{ date: Date; coming: String; going: String; Format: string; message: string; answered? : object; picked? : object, url?: String, filename?: String }} */ data,
				/** @type {number} */ i
			) => {
				const hrs = new Date(data.date).getHours();
				const mins =
					new Date(data.date).getMinutes().toString().length > 1
						? new Date(data.date).getMinutes()
						: "0" + new Date(data.date).getMinutes();
				const time = j("<span>", {class: "time"}).html(
					`<small> ${hrs + ":" + mins} </small>`
				);

				const cur = new Date(data.date).getDate();
				const pre =
					i > 0
						? new Date(messages.Message[i - 1].date).getDate()
						: "";

				const Group = GroupMessage({cur, pre, i});
				if (Group) {
					const group = j("<div>", {class: "group"}).html(
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
					} else if (data.Format === "plain") {
						const text = j("<div>", {class: "text"}).html(
							data.message
						);
						const image = j(e.target)
							.closest(".chat")
							.find(".user_image")
							.clone();

						const plain = j("<div>", {
							class: "plain-message",
						}).append(prevComingId ? "" : image, text, time);

						const wrapper = j("<div>", {
							class: "message-wrapper",
						}).append(plain);
						const incoming = j("<div>", {
							class: `incoming-message ${
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
					} else if (data.Format === "image") {
						const image = j("<img>", {
							class: "image-previewer",
							alt: data.filename + " previewer",
							src: data.url,
						});
						const message = j("<div>", {
							class: `inoming-media incoming-message ${
								prevComingId
									? nextComingId
										? "adjust"
										: "adjust-pd"
									: nextComingId
									? "adjust-mg"
									: ""
							}`,
						});
						const message_wrapper = j("<div>", {
							class: "message-wrapper",
						});
						const image_wrapper = j("<div>", {
							class: "media-wrapper incoming-picture",
						}).append(image);

						message_wrapper.append(
							image_wrapper,
							time.addClass("media")
						);
						message.append(message_wrapper);
						return fragmentArray.push(message);
					}
				} else {
					if (data.Format == "Form") {
						const outgoing = CreateQuestionPreview(data, false);
						fragmentArray.push(outgoing);
						return;
					} else if (data.Format === "plain") {
						const text = j("<div>", {class: "text"}).html(
							data.message
						);
						const time = j("<span>", {class: "time"}).html(
							`<small> ${hrs + ":" + mins} </small>`
						);
						const plain = j("<div>", {
							class: "plain-message",
						}).append(text, time);
						const wrapper = j("<div>", {
							class: "message-wrapper",
						}).append(plain);
						const outgoing = j("<div>", {
							class: `outgoing-message ${
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
					} else if (data.Format === "image") {
						const image = j("<img>", {
							class: "image-previewer",
							alt: data.filename + " previewer",
							src: data.url,
						});
						const message = j("<div>", {
							class: `outgoing-media outgoing-message ${
								prevGoingId
									? nextGoingId
										? "adjust"
										: "adjust-pd"
									: nextGoingId
									? "adjust-mg"
									: ""
							}`,
						});
						const message_wrapper = j("<div>", {
							class: "message-wrapper",
						});
						const image_wrapper = j("<div>", {
							class: "media-wrapper outgoing-picture",
						}).append(image);

						message_wrapper.append(
							image_wrapper,
							time.addClass("media")
						);
						message.append(message_wrapper);
						return fragmentArray.push(message);
					}
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
		if (data.from === to) {
			sendMessage(data, "incoming-message");
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

		const timeCount = j("<div>", {class: "time-count"});
		const timer = j("<div>", {class: "timer"});
		const coin = j("<div>", {class: "coin"});
		const coinAdded = j("<div>", {class: "coin-added"});
		const pollQuestionHeader = j("<div>", {
			class: "poll-question-header",
		});
		const question = j("<div>", {class: "text", id: "question"});
		const pollQuestion = j("<div>", {class: "poll-question"});
		const formGroup = j("<div>", {class: "form-group"});
		const formMessage = j("<div>", {
			class: `form-message poll question ${
				choosed != undefined
					? choosed.index === answer.index
						? "correct"
						: "failed"
					: ""
			}`,
			id: data._id,
		});
		const wrapper = j("<div>", {
			class: "incoming-message incoming-form",
			id: data._id.slice(0, 10),
		});
		const pollOptions = j("<div>", {class: "poll-options"});
		const ul = j("<ul>", {class: "options"}).append(data.options.map(Map));

		// Appending to elements created by jquery
		{
			question.text(data.question);
			coin.html(`coins <b>${data.coin}</b>`);
			timeCount.html(`Time <b>${data.timer}</b>s`);
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
				class: `option ${
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
						class: "form-group",
					}).append(
						data.date || !choosed
							? j("<input>", {
									type: "radio",
									name: key,
									id: "option",
									class: `option${i}`,
							  }).on("click", function () {
									ANSWERCLICKED(this, option, data._id);
							  })
							: j("<input>", {
									type: "radio",
									name: key,
									id: "option",
									class: `option${i}`,
							  })
					)
				)
				.append(
					j("<div>", {
						class: "option-text label",
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

		// clearing movement cos the initial function is serving 2 caller
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
	 * @param {{
	 * coin: string;
	 * answer: { index: any; };
	 * messageId: String;
	 * picked: { index: any; };
	 * id: any;
	 * answered: { index: any; };
	 * from: String;  _id: any;
	 * }} data
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

			// this is the interval that reduce coin if the
			// if the question is gotten, it runs for the number
			// of coins added to the question
			var decrement = setInterval(() => {
				coin--;
				j(document).find(".coin-count span").html(coin);
				count++;

				if (count == qCoin) {
					// and the interval is clear when it reaches
					// the count of the coin added
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
