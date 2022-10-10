import { format } from "date-fns";

interface GroupInterface {
  cur: Date;
  pre: Date;
  i: number;
}

export default function GroupNotifications({ cur, pre, i }: GroupInterface) {
  var date: number = new Date().getDay();
  var currentDate: number = new Date(cur).getDay();
  var previousDate: number = new Date(pre).getDay();

  if (i === 0) {
    if (currentDate === date) {
      return (
        <div className="date">
          <div className="day-text">
            <span>Today</span>
          </div>
        </div>
      );
    } else if (date === currentDate + 1) {
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
            <span>{format(new Date(cur), "dd MMMM, yyyy.")}</span>
          </div>
        </div>
      );
    }
  } else if (currentDate !== previousDate) {
    if (date === currentDate + 1) {
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
            <span>{format(new Date(cur), "dd MMMM, yyyy.")}</span>
          </div>
        </div>
      );
    }
  } else {
    return null;
  }
}
