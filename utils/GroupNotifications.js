export default function GroupNotifications({cur, pre, i}) {
	var date = new Date().getDay();
	if (i === 0) {
		if (cur === date) {
			return (
				<div className="date">
					<div className="day-text">
						<span>Today</span>
					</div>
				</div>
			);
		} else if (date === cur + 1) {
			return (
				<div className="date">
					<div className="day-text">
						<span>Yesterday</span>
					</div>
				</div>
			);
		} else {
			return (
				<div className="date">
					<div className="day-text">
						<span>{new Date(cur).toLocaleDateString()}</span>
					</div>
				</div>
			);
		}
	} else if (cur !== pre) {
		if (date === cur + 1) {
			return (
				<div className="date">
					<div className="day-text">
						<span>Yesterday</span>
					</div>
				</div>
			);
		} else {
			return (
				<div className="date">
					<div className="day-text">
						<span>{new Date(cur).toLocaleDateString()}</span>
					</div>
				</div>
			);
		}
	} else {
		return "";
	}
}
