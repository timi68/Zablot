const media_399 = window.innerWidth > 399;

$(".friendrequest-wrapper .icon").bind("click", function () {
	if (!$(".request-box").hasClass("show"))
		$(document).find(".show").removeClass("show expand");
	$(".request-box")
		.prop("scrollTop", 0)
		.toggleClass("show")
		.delay(2000)
		.toggleClass("expand");
}),
	$(".notifications-icon").bind("click", function () {
		if (!$(".notifications-box").hasClass("show"))
			$(document).find(".show").removeClass("show expand");
		$(".notifications-box")
			.prop("scrollTop", 0)
			.toggleClass("show")
			.delay(2000)
			.toggleClass("expand");
	}),
	$(".close-modal").each((i, e) => {
		$(e).click(function () {
			$(this)
				.parents(".show")
				.removeClass("show")
				.delay(500)
				.removeClass("expand");
		});
	}),
	$(".search-text-box").click(function () {
		const media_649 = window.innerWidth > 649;
		if ($(".search-results").hasClass("show")) return;
		if (media_649 === false) {
			$(".search-results").toggleClass("show");

			$("#search").fadeOut();
			setTimeout(() => {
				$(this)
					.parent()
					.toggleClass("not-focus focus-input")
					.find("#search")
					.toggleClass("active");
				$("#search").fadeIn().find("#form-control").focus();
			}, 500);
			return;
		} else {
			$(".search-results").toggleClass("show");
		}
	}),
	$(".search-container .close").click(function () {
		const media_649 = window.innerWidth > 649;
		if (media_649 === false) {
			$("#search").fadeOut().find("#form-control").val("");
		}
		$("#search").find("#form-control").val("");
		$(".search-results")
			.animate(
				{
					width: "0px",
					height: "0px",
				},
				500
			)
			.promise()
			.done(function () {
				$(".search-results").removeClass("show").attr("style", "");
			});
		if (!media_649) {
			setTimeout(() => {
				$(this)
					.parents(".focus-input")
					.toggleClass("not-focus focus-input");
				$("#search").removeClass("active");
				$("#search").fadeIn();
			}, 1000);
		}
	});
$(".profile-preview").bind("click", function (e) {
	$(document).find(".show").removeClass("show expand");
	$(".profile-link-wrapper").toggleClass("a");
}),
	$(".private").click(function () {
		$(".nav-active").addClass("p");
		$(".private-chats").addClass("p").fadeIn(1000);
	}),
	$(".common").click(function () {
		$(".common-chats").fadeIn(1000).next(".private-chats").fadeOut();
		$(".nav-active").removeClass("p");
	}),
	$(document).click(function (e) {
		const target = $(e.target).is(".profile-link-wrapper");
		const parents = $(e.target).parents();
		var count = 0;
		$(parents).each((e, i) => {
			if ($(i).is(".profile-link-wrapper")) count++;
		});
		if (count == 0) {
			$(document).find(".a").removeClass("a");
		}
	});

$(".toggle").each((i, e) => {
	$(e).click(function () {
		if (!$(this).parent().hasClass("show"))
			$(document).find(".show").removeClass("show expand");
		$(this).parent().toggleClass("show");
	});
});

$(".media-icon").click(() => {
	$(".media-message-wrapper").toggleClass("active");
});

$(".room-body").click(() => {
	$(".media-message-wrapper").removeClass("active");
});

$(".toggle-poll").click(function () {
	$(".create-question").toggleClass("active");
	$(this).parents(".media-message-wrapper").removeClass("active");
});

$(".discard-wrap").click(resetPollStateToDefault);

$("#question").keyup(function () {
	$(this).removeClass("empty");
	UpdatePoll();
});

$(".add-options").click(function () {
	$(this).removeClass("more-option-required");
	$("<li>", {class: "option"})
		.append(
			$("<div>", {class: "text-box"})
				.append(
					$("<input>", {
						type: "radio",
						name: "answer",
						id: "answer",
						class: "answer",
					})
				)
				.append(
					$("<textarea>", {
						name: `option-input`,
						placeholder: "Enter option..",
						class: "text-control text-box",
					}).keyup(function () {
						$(this).removeClass("empty");
						UpdatePoll();
					})
				)
		)
		.append(
			$("<div>", {class: "remove-option"})
				.click(function () {
					$(this).parent().slideUp(500);
					setTimeout(() => {
						$(this).parent().remove();
						UpdatePoll();
					}, 500);
				})
				.append($("<div>", {class: "icon", html: "&times;"}))
		)
		.slideUp(10)
		.appendTo(".option-list")

		.slideDown("slow", function () {
			$(this)
				.parents(".poll.create-question")
				.animate(
					{
						scrollTop: $(this).prop("offsetTop") / 2,
					},
					"slow"
				);
		})
		.find("textarea")
		.focus();

	UpdatePoll();
});

$(".create-wrap").click(function () {
	{
		var question = $("#question");
		var empty = 0;
		if ($(question).val() == "") {
			$(".poll.create-question").animate(
				{
					scrollTop: $(this).prop("offsetTop") / 2,
				},
				"slow",
				function () {
					$(this).after(() => {
						$(question).addClass("empty").focus();
					});
				}
			);

			return;
		}
		{
			let totalOption = $(".wrap.option-list").find("textarea").length;
			if (totalOption < 2) {
				$(".poll.create-question").animate(
					{
						scrollTop: $(".option-list").offset().Top,
					},
					500,
					function () {
						$(this).after(() => {
							$(".add-options").toggleClass(
								"more-option-required"
							);
						});
					}
				);

				return;
			}
			$(".wrap.option-list")
				.find("textarea")
				.each((i, e) => {
					let val = $(e).val();
					if (val == "") {
						let $scroll =
							$(".poll.create-question").prop("clientHeight") -
							(totalOption - i) * 30;

						$(".poll.create-question")
							.animate(
								{
									scrollTop: $scroll,
								},
								500
							)
							.promise()
							.done(() => {
								$(e).addClass("empty").focus();
							});
						empty++;
						return false;
					}
				});
		}

		if (empty > 0) return;
	}

	{
		var options = $(".create-question")
			.find(".answer")
			.map(function (i, e) {
				let option = [];
				var text = $(e).parents(".option").find("textarea").eq(0).val();
				var checked = $(e).is(":checked");
				option.push({
					index: i,
					text,
					checked,
				});

				return option;
			})
			.toArray();

		var hasClass = $(this).is(".create.active");
		if (hasClass) {
			var isChecked = $(options)
				.filter((i) => options[i].checked === true)
				.toArray().length;

			if (isChecked === 0) {
				$(".create-question").find(".answer").addClass("required");
				setTimeout(() => {
					$(".create-question")
						.find(".answer")
						.removeClass("required");
				}, 2000);

				return;
			}
		}
	}

	{
		var data = {};
		var timer = $("#timing").val();
		var coin = $("#coin").val();
		var challenge = $("#challenge").is(":checked");

		if (challenge) {
			var matchCoin = coin.match(/\D+/g);
			var matchTimer = timer.match(/\D+/g);

			if (!timer || matchTimer) {
				$("#timing").addClass("required");
				return;
			} else if (!coin || matchCoin) {
				$("#coin").addClass("required");
				return;
			}
		}

		question = question.val();
		data = {...{question, options, timer, coin, challenge}};

		resetPollStateToDefault();
		CreateQuestionPreview(data);
	}
});

$(".input-box .text-control").keyup(function () {
	if (!$(this).val()) {
		$(".send").removeClass("activated").off();
	} else {
		const message = $(this).val();
		$(".send")
			.addClass("activated")
			.off()
			.click(() => sendMessage(message));
	}
});

function sendMessage(message) {
	var text = $("<div>", {class: "text"}).html(message),
		image = $(".preview-profile .user-image").clone(),
		plain = $("<div>", {class: "plain-message"}).append(text, image),
		wrapper = $("<div>", {class: "message-wrapper"}).append(plain),
		outgoing = $("<div>", {class: "outgoing-message"}).append(wrapper);
	outgoing
		.appendTo(".room-body")
		.parent()
		.animate(
			{
				scrollTop: outgoing.parent().prop("scrollHeight"),
			},
			"slow"
		);
	$(".input-box .text-control").val("");
}

$(".timing,.coin").keyup(function () {
	$(this).removeClass("required");
});

{
	function CreateQuestionPreview(data) {
		console.log(data);
		$("<div>", {class: "outgoing-message outgoing-form"})
			.append(
				$("<div>", {class: "form-message poll question"})
					.append($(".preview-profile .user-image").clone())
					.append(
						$("<div>", {class: "form-group"})
							.append(
								$("<div>", {class: "poll-question"})
									.append(
										$("<div>", {
											class: "poll-question-header",
										})
											.append(
												data.timer
													? $("<div>", {
															class: "timer",
													  }).append(
															$("<div>", {
																class: "time-count",
															})
																.append(
																	"<span>"
																)
																.html(
																	`Time remaining <b>${data.timer}s</b>`
																)
													  )
													: ""
											)
											.append(
												data.coin
													? $("<div>", {
															class: "coin-added",
													  }).append(
															$("<div>", {
																class: "coin",
															})
																.append(
																	"<span>"
																)
																.html(
																	`coins <b>${data.coin}</b>`
																)
													  )
													: ""
											)
									)
									.append(
										$("<div>", {class: "text"})
											.append("<span>")
											.text(data.question)
									)
							)
							.append(
								$("<div>", {class: "poll-options"}).append(
									$("<ul>", {class: "options"}).append(
										data.options.map((option, i) => {
											return $("<li>", {class: "option"})
												.append(
													$("<div>", {
														class: "form-group",
													}).append(
														$("<input>", {
															type: "radio",
															name: `option`,
															id: "option",
															class: `option${i}`,
														}).click(function () {
															console.log(
																"answer picked"
															);
														})
													)
												)
												.append(
													$("<div>", {
														class: "option-text label",
													}).append(
														$("<label>").text(
															option.text
														)
													)
												);
										})
									)
								)
							)
					)
			)
			.appendTo(".room-body");
	}
	function UpdatePoll() {
		let totalOption = $(".wrap.option-list").find("textarea").length;
		let count = 0;
		let question = $("#question").val();
		$(".wrap.option-list")
			.find("textarea")
			.each((i, e) => {
				let val = $(e).val();
				!val ?? val === "" ? count++ : "";
			});

		if (totalOption >= 2 && count <= 2 && question) {
			switch (totalOption) {
				case 2:
					count < 1
						? $(".create-wrap").addClass("active create")
						: $(".create-wrap").removeClass("active create");
					break;
				case 3:
					count <= 1
						? $(".create-wrap").addClass("active create")
						: $(".create-wrap").removeClass("active create");
					break;
				case 4:
					count <= 2
						? $(".create-wrap").addClass("active create")
						: $(".create-wrap").removeClass("active create");
					break;

				default:
					break;
			}
		} else {
			$(".create-wrap").removeClass("active create");
		}
	}
	function resetPollStateToDefault() {
		$(".create-question")
			.removeClass("active")
			.delay(500)
			.queue(function (next) {
				$(this)
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

	var optionListMutation = new MutationObserver(function (e) {
		if (e[0].removedNodes) {
			const childrenLength = e[0].target.children.length;
			{
				if (childrenLength >= 4) {
					$(".add-options").fadeOut();
				} else {
					$(".add-options").fadeIn();
				}
			}
		}
	});
	optionListMutation.observe(document.querySelector(".wrap.option-list"), {
		childList: true,
	});

	window.onresize = () => {
		const media_649 = window.innerWidth > 649;
		const is_visible = $(".search-results").hasClass("show");
		if (!media_649 && is_visible) $("#search").addClass("active");
		if (media_649 && is_visible) $("#search").removeClass("active");
	};
}

// ---------  Animation for incoming message ------------
{
	function incomingMessage() {
		var parent = outgoing.parent(),
			scrollTop = outgoing.parent().prop("scrollTop"),
			scrollHeight = outgoing.parent().prop("scrollHeight"),
			alert = $(".alert-message"),
			int = parseInt(alert.text());

		if (scrollTop < scrollHeight - 50) {
			alert
				.html(int + 1)
				.addClass("show")
				.click(function () {
					parent.animate(
						{
							scrollTop: scrollHeight,
						},
						"slow"
					);
					$(this).html(0).removeClass("show");
				});
		} else {
			parent.animate(
				{
					scrollTop: scrollHeight,
				},
				"slow"
			);
		}
	}
}

$(
	".top-navigation .icon, .alternate, .close-card,.chats-nav .public-chats,.chats-nav .private, .profile-preview, .send-btn svg, .media-icon"
).bind("mouseleave mouseover", function (e) {
	var w = $(this).width();
	var height = $(this).height();
	var rect = this.getBoundingClientRect();

	var t = $(".toolpit")
		.html("<span>" + $(this).attr("alt") + "</span>")
		.width();

	t = w / 2 - t / 2 - 10;

	var left = rect.left + t;
	var top = rect.top - height - 8;

	if (e.type == "mouseover") {
		$(".toolpit")
			.css({
				left: left,
				top: top,
			})
			.addClass("show");
	} else {
		$(".toolpit").removeClass("show");
	}
});

$(".chats-body .chat").click(openChatRoom);

function openChatRoom(e) {
	const name = $(this).find(".name span").text();
	const user = $(this).find(".user img").clone();
	const room_headr = $("<div>", {});
}

const chatForm = new MutationObserver(function (e) {
	if (e[0].removedNodes) {
		const childrenLength = e[0].target.children.length;
		{
			if (childrenLength < 1) {
				$(".chat-form-container").fadeOut();
			} else {
				$(".chat-form-container").fadeIn();
			}
		}
	}
});

chatForm.observe(document.querySelector(".chat-form-container"), {
	childList: true,
});
$(".close-card").click(function () {
	$(this)
		.parent()
		.slideToggle(700)
		.queue(function () {
			$(this).remove();
		});
});

// var mobileDetector = new MobileDetect(window.navigator.userAgent);
// console.log(mobileDetector.is("iphone"));
