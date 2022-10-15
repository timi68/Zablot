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
}
