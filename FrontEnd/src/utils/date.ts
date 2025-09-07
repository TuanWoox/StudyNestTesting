// utils/date.ts
export const formatDMY = (iso: string, tz = "Asia/Ho_Chi_Minh") =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
