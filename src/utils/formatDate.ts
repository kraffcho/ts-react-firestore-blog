import { format, isToday, isYesterday } from "date-fns";

export const formatDate = (date: Date): string => {
  try {
    if (isToday(date)) {
      return "Today at " + format(date, "HH:mm");
    } else if (isYesterday(date)) {
      return "Yesterday at " + format(date, "HH:mm");
    } else {
      return format(date, "dd.MM.yyyy 'at' HH:mm");
    }
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};
