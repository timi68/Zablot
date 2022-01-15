export default function GroupMessage({
	cur,
	pre,
	i,
}: {
	cur: Date;
	pre: Date;
	i: number;
}): Date | "Today" | "Yesterday" | string | null | void {
	var date: number = new Date().getDate();
	var currentDate: number = cur.getDate();
	var previousDate: number = pre?.getDate();

	if (currentDate === previousDate) return;
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"June",
		"July",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	if (i === 0) {
		if (currentDate === date) {
			return "Today";
		} else if (date === currentDate + 1) {
			return "Yesterday";
		} else {
			return String(months[cur.getMonth()].concat(` ${currentDate}`));
		}
	} else if (cur !== pre) {
		if (date === currentDate) {
			return "Today";
		} else if (date === currentDate + 1) {
			return "Yesterday";
		} else {
			return String(months[cur.getMonth()].concat(` ${currentDate}`));
		}
	} else {
		return null;
	}
}
