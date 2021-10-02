import "../mini/connection.js";
import "../jquery.min.js";

!(function (s) {
	s().ready(() => {
		"use-strict";

		`<div class="friend_preview_profile">
        <div class="friend_image">
            <a href="#">
                <img src="/static/media/1.4b0d09c4.jpg" class="userImage" alt="">
            </a>
        </div>
        <div class="friend_name_wrapper">
            <p class="friend_real_name">
                JAMES ODERINDE
                <span class="friend_user_name">
                    @TJ_DIBBS
                </span>
            </p>                                           
        </div>                                        
    </div>`;

		(async () => {})();
	});
})(jQuery);

export class Controller {
	constructor(type, from, active) {
		this.type = type;
		this.from = from;
		this.active = [];
	}

	static async PUB_ACTIVE() {
		const users = await socket.emit("GET_PUB_ACTIVE_USERS");
		this.active.push({ data: users });
		return this.active;
	}
}
