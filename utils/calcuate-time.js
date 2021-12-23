export default function CalculateTime(d1, d) {
	var date1 = d1;
	var date2 = new Date(d);
	var date1Secs = date1.getSeconds();
	var date1Mins = date1.getMinutes();
	var date1Hrs = date1.getHours();
	var date2Secs = date2.getSeconds();
	var date2Mins = date2.getMinutes();
	var date2Hrs = date2.getHours();
	var days = Math.ceil(Math.abs(date1 - date2) / (1000 * 3600 * 24));

	if (days <= 1) {
		if (date1Hrs === date2Hrs) {
			if (date1Mins === date2Mins) {
				var secs = date1Secs - date2Secs;
				return secs == 0 ? "now" : secs + "s ago";
			} else {
				if (date1Mins > date2Mins) {
					if (date1Secs > date2Secs) {
						return date1Mins - date2Mins + "m ago";
					} else {
						var secs =
							date1Mins * 60 -
							date2Mins * 60 -
							(date2Secs - date1Secs);

						if (secs > 60) {
							var split = (secs / 60).toFixed(2).split(".");
							return split[0] + "m ago";
						}

						return secs + "s ago";
					}
				} else {
				}
			}
		} else {
			if (date1Hrs > date2Hrs) {
				if (date1Mins > date2Mins) {
					return (
						date1Hrs -
						date2Hrs +
						"h " +
						(date1Mins - date2Mins) +
						"m ago"
					);
				} else {
					var mins =
						date1Hrs * 60 - date2Hrs * 60 - (date2Mins - date1Mins);

					if (mins > 60) {
						mins = (mins / 60).toFixed(2).replace(".", ":");
					}

					return mins + "m ago";
				}
			} else {
				var mins =
					date2Hrs * 60 - date1Hrs * 60 - (date2Mins - date1Mins);

				if (mins > 60) {
					mins = (mins / 60).toFixed(2).replace(".", "h ");
				}

				return mins + "m ago";
			}
		}
	} else {
		if (days > 8) {
			return days / 8 + "w ago";
		} else {
			return days + "d ago";
		}
	}
}
