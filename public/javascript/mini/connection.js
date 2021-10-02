import "../socket.io.js";
import "../jquery.min.js";
import { Controller } from "./index.js";

!(function (processor) {
	const chat_box = document.querySelector(".chat_box_wrap");
	const socket = io("/");
	let SOCKET_ID, newUser;

	socket.on("userid", (user_id) => {
		SOCKET_ID = user_id;

		const session = {
			USERFULLNAME: n,
			USERNAME: u,
			USERID: _id,
			SOCKET_ID,
			STATUS: "Online",
		};

		socket.emit("ADD_JOINED_REQUEST", session, (err, done) => {
			var activeUser = Controller.FRIENDS();
			console.log(activeUser);

			console.log(SOCKET_ID);
		});
	});
	socket.on("no_checked", () => {
		console.log("the user didnt check any answer");
	});

	socket.on("incoming_message", (data) => {
		console.log("one message sent", data.name);
		// userCoin_Available = processor('#available_coin').html();

		// if(userCoin_Available < data.added_coin)
		answer = data.ans.option;
		let time = new Date();
		let cu = 20;

		if (data.type === "form") {
			let key = Math.round(Math.random() * 5555555);
			var incoming_container = document.createElement("div");

			incoming_container.classList.add("incoming_container");
			incoming_container.setAttribute("id", `incoming_container${key}`);

			var incoming_wrapper = `<div class="incoming_wrapper" id="${key}">
                <form class="form_incoming" id="form_incoming${key}"><div class="incoming_header" id="${key}"><h5 class="incoming_title" id="${key}"> ${data.name} Question</h5><div class="added_coin_wrap" id="${key}">${data.coin_added} coins</div></div><div class="question_wrap" id="${key}"><p class="question_sent" id="${key}">${data.question}</p></div><div class="options_wrap" id="options_wrap${key}"><div class="option" id="${key}"><input type="radio" name="option1" id="options${key}"><span class="option_span" id="${key}">${data.option1}</span></div><div class="option" id="${key}"><input type="radio" name="option1" id="options${key}"><span class="option_span">${data.option2}</span></div><div class="option" id="${key}"><input type="radio" name="option1" id="options${key}" id="${key}"><span class="option_span" id="${key}">${data.option3}</span></div><div class="option" id="${key}"><input type="radio" name="option1" id="options${key}"><span class="option_span" id="${key}">${data.option4}</span></div></div><div class="timer" id="timer${key}"></div><div class="send_form_wrap" id="${key}"><button type="submit" id="button${key}" class="send_form"><i class="ion-md-send"></i></button></div>
                    <p class="response" id="response${key}"></p>
                </form>
            </div>`;

			var timer = setInterval(() => {
				cu -= 1;
				if (cu == 0) {
					processor(`#timer${key}`).html("Time up");
					clearInterval(timer);

					var options = document.querySelectorAll(`#options${key}`);

					//checking if user check answer
					let checker = false;
					processor(options).each((index, element) => {
						let answer = element.checked;
						if (answer == true) {
							checker = true;
						}
					});

					console.log(checker);
					if (checker == true) {
						document.querySelector(`#form_incoming${key}`).submit();
					} else {
						reply =
							'<span style="color:red">No answer picked : Coin deducted</span>';
						processor(`#response${key}`).html(reply);

						socket.emit("no_answer_checked", user_id);
						processor(`#button${key}`).remove();
						processor(`#incoming_container${key}`).addClass(
							"ended"
						);
					}
				} else {
					processor(`#timer${key}`).html(`Count Down: ${cu}s`);
				}
			}, 1000);
			incoming_container.innerHTML = incoming_wrapper;

			chat_box.appendChild(incoming_container);

			processor(`#form_incoming${key}`).submit((e) => {
				e.preventDefault();
				let options, ans;

				options = document.querySelector(`#options_wrap${key}`);

				span = options.children;

				for (let i = 0; i < span.length; i++) {
					let inp = span[i].children[0].checked;
					let element = span[i].children[1].innerText;
					if (inp == true) {
						switch (i) {
							case 0:
								ans = {
									option: 1,
									text: element,
								};
								break;
							case 1:
								ans = {
									option: 2,
									text: element,
								};
								break;
							case 2:
								ans = {
									option: 3,
									text: element,
								};
								break;
							case 3:
								ans = {
									option: 4,
									text: element,
								};
								break;
						}
					}
				}

				if (ans !== undefined) {
					let quesAns = data.ans;
					socket.emit(
						"answer_submitted",
						{ ans, quesAns },
						({ res }) => {
							if (res === "wrong") {
								res = `<span style="color:red">${res}</span>`;
								processor(`#response${key}`).html(res);
								processor(`#button${key}`).remove();
								processor(`#incoming_container${key}`).addClass(
									"ended"
								);
								clearInterval(timer);
							} else if (res === "correct") {
								res = `<span style="color:green">${res}</span>`;
								processor(`#response${key}`).html(res);
								processor(`#button${key}`).remove();
								processor(`#incoming_container${key}`).addClass(
									"ended"
								);
								clearInterval(timer);
							}
						}
					);
				} else {
					processor(`#response${key}`).html("check your answer");
				}
			});
		}
	});

	socket.on("join", (data) => {
		console.log("this is newuser", data);
		newUser = data;
	});

	socket.on("answered", ({ res }) => {
		console.log(res);
	});

	socket.on("ACTIVE_USER", (u) => {
		console.log(JSON.parse(u));
	});
})(jQuery);
