import p from "jquery";

function createForm(chat_box) {
	let key = Math.round(Math.random() * 2323233);

	var create = document.createElement("div");
	create.classList.add("outgoing_container");
	create.setAttribute("id", `outgoing_container${key}`);

	create.innerHTML = `<div id = "${key}"  class="outgoing_wrapper"><form id = "form${key}"
                      class="form_outgoing"><div id = "${key}"  class="outgoing_header"><h5 id = "${key}" 
                       class="incoming_title"><span class="del_form" id="del_form${key}"><i class="ion-ios-close" id="${key}">
                       </i></span> Form Question</h5><div id = "${key}" class="add_coin_wrap"><i class="ion-md-add"></i>
                       <input type="text" name="coin_added" class="coin_added" id="coin${key}"
                        maxlength="3" max="3" placeholder="coins"></div></div><div id = "${key}" 
                         class="question_wrap"><textarea id = "question${key}"  name="question" 
                         class="question" placeholder="Enter the question.."></textarea></div>
                         <div class="options_wrap" id = "options_wrap${key}"><div class="option" id="${key}"><input id = "${key}" 
                          type="radio" name="option1" id="options"/><input type="text" rows="4" class="option_span" placeholder="Option 1" id = 
                          "${key}" /></div><div id = "${key}" class="option"><input id = "${key}" type="radio" name="option1" id="options"/>
                          <input type="text" id = "${key}" class="option_span" placeholder="Option 2"></div><div class="option" id="${key}">
                          <input id = "${key}"  type="radio" name="option1" id="options"/><input type="text" class="option_span" placeholder="Option 3" 
                          id = "${key}" /></div><div class="option" id="${key}"><input id = "${key}"
                            type="radio" name="option1"/><input type="text" id = "${key}"  class="option_span"
                             placeholder="Option 4"/></div></div><div id="${key}" class="send_form_wrap">
                             <button id = "button${key}"  type="submit" class="send_form btn" >
                             <i id = "${key}"  class="ion-md-send"></i></button></div>
                             <p id = "p${key}" class="error_display" ></p></form></div>`;

	chat_box.current.appendChild(create);

	let options, question;
	options = document.querySelector(`#options_wrap${key}`);
	question = document.querySelector(`#question${key}`);

	let span = options.children;
	for (let j = 0; j < span.length; j++) {
		let element = span[j].children[1];
		element.addEventListener("focus", (e) => {
			p(element).removeClass("error");
		});
	}

	question.addEventListener("keyup", (e) => {
		if (p(question).val() != "") {
			p(question).removeClass("empty");
		} else {
			p(question).addClass("empty");
		}
	});

	p(`#del_form${key}`).click(() => {
		p(`#outgoing_container${key}`).remove();
	});
	p(`#form${key}`).on("submit", (e) => {
		e.preventDefault();
		e.stopPropagation();

		let options, question, coin;

		options = document.querySelector(`#options_wrap${key}`);
		question = document.querySelector(`#question${key}`);
		coin = document.querySelector(`#coin${key}`);

		let q, option1, option2, option3, option4, ans, err, span, ques;

		span = options.children;
		ques = question.value;

		if (ques != "") {
			q = ques;
			for (let i = 0; i < span.length; i++) {
				let inp = span[i].children[0].checked;
				let element = span[i].children[1].value;
				var reg = new RegExp("Option");
				var result = reg.exec(element);
				var html = "no option here";

				if (result || element == "" || element == html) {
					span[i].children[1].placeholder = html;
					p(span[i].children[1]).addClass("error");
					err = true;
				} else {
					switch (i) {
						case 0:
							option1 = element;
							break;
						case 1:
							option2 = element;
							break;
						case 2:
							option3 = element;
							break;
						case 3:
							option4 = element;
							break;
					}
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
			}
		} else {
			question.placeholder = "There is no question inserted..";
			p(question).addClass("empty");
			question.focus();
			return;
		}

		if (!err) {
			added_coin = coin.value;
			match = /[a-zA-Z]/i;

			// checking if user enter alpha in coin box
			is_alpha = match.exec(added_coin);

			if (added_coin != "") {
				if (is_alpha == null) {
					available_coin = p(".available_coin").html();
					if (Number(added_coin) < Number(available_coin)) {
						if (ans != undefined) {
							var QUESTION = {
								option1: option1,
								option2: option2,
								option3: option3,
								option4: option4,
								question: q,
								ans: ans,
								name: "james",
								type: "form",
								coin_added: added_coin,
								message_id: `${key}`,
								user_id: "60e1e447d4a9a51acc8da023",
							};
							socket.emit("message", QUESTION);
							console.log(JSON >> parseInt("34ds434342"));

							var plain = document.createElement("div");
							plain.classList.add("incoming_plain_container");

							plain.innerHTML = `<div class="incoming_plain_wrapper">
                                         <div class="plain_message">
                                             <div class="image_wrap">
                                                 <img src="/static/media/1.4b0d09c4.jpg" alt="">
                                             </div>
                                             <div class="text_wrap">
                                                 <div class="incoming_message">
                                                     <div class="message">
                                                         Lorem ipsum dolor, sit amet con  
                                                     </div>
                                                     <div class="time">
                                                         3:15
                                                     </div> 
                                                 </div>
                                 
                                             </div>
                                         </div>
                                     </div>`;

							chat_box.appendChild(plain);
							p(`#p${key}`).html("");

							p(`#button${key}`).remove();
							p(`#outgoing_container${key}`).addClass("checked");
							return;
						} else {
							p(`#p${key}`).html("No option selected");
							return;
						}
					} else {
						p(`#p${key}`).html("You dont have enough coin");
						return;
					}
				} else {
					p(`#p${key}`).html("Coin box contains alphabet");
					return;
				}
			} else {
				p(`#p${key}`).html("Add coin");
			}
		} else {
			console.log(new Error("there is an error in solving the issue"));
		}
	});

	return null;
}

export default createForm;
