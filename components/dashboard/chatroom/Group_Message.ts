import { format, isToday, isYesterday } from "date-fns";

export default function GroupMessage({
  cur,
  pre,
}: {
  cur: Date;
  pre: Date;
}): Date | "Today" | "Yesterday" | string | null | void {
  var currentDate: number = cur.getDate();
  var previousDate: number = pre?.getDate();

  if (currentDate === previousDate) return;
  return isToday(cur)
    ? "Today"
    : isYesterday(cur)
    ? "Yesterday"
    : format(cur, "MMMM dd");
  // if (i === 0) {
  //   if (isToday(cur)) {
  //     return "Today";
  //   } else if (isYesterday(cur)) {
  //     return "Yesterday";
  //   } else {
  //     return format(cur, "mmmm dd");
  //   }
  // } else if (cur !== pre) {
  //   if (date === currentDate) {
  //     return "Today";
  //   } else if (date === currentDate + 1) {
  //     return "Yesterday";
  //   } else {
  //     return String(months[cur.getMonth()].concat(` ${currentDate}`));
  //   }
  // } else {
  //   return null;
  // }
}
