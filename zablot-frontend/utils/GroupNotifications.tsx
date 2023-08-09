import { format, isToday, isYesterday } from "date-fns";

interface GroupInterface {
  cur: Date;
  pre: Date;
  i: number;
}

export default function GroupNotifications({ cur, pre, i }: GroupInterface) {
  var currentDate: number = cur.getDay();
  var previousDate: number = pre.getDay();

  if (currentDate === previousDate) return <></>;
  return isToday(cur) ? (
    <div className="date">
      <div className="day-text">
        <span>Today</span>
      </div>
    </div>
  ) : isYesterday(cur) ? (
    <div className="date">
      <div className="day-text">
        <span>Yesterday</span>
      </div>
    </div>
  ) : (
    <div className="date">
      <div className="day-text">
        <span>{format(cur, "MMMM dd")}</span>
      </div>
    </div>
  );
}
