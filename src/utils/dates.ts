// See https://stackoverflow.com/questions/5210376/how-to-get-first-and-last-day-of-the-current-week-in-javascript
// Unused & unfinished at the moment
export const getCurrentWeekSunSat = () => {
  let curr = new Date; // get current date
  let first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
  let last = first + 6; // last day is the first day + 6

  let firstday = new Date(curr.setDate(first));
  let lastday = new Date(curr.setDate(last));
}

export const getCurrentDate = () => {
  let now = new Date();
  let nowFormatted = now.toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year:'numeric'});
  return nowFormatted;
}

export const getCurrentWeekFromToday = () => {
  let curr = new Date; // get current date
  let first = curr.getDate();
  let last = first + 6;

  let firstday = new Date(curr.setDate(first))
  let lastday = new Date(curr.setDate(last))

  return {firstday, lastday};
}
  
export const getCurrentWeekFromTodayMMDD = () => {
  let {firstday, lastday} = getCurrentWeekFromToday();

  // See https://stackoverflow.com/a/63490548
  let firstDayFormatted = firstday.toLocaleDateString('en-US', {month: '2-digit', day: '2-digit'});
  let lastDayFormatted = lastday.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit'});

  return `${firstDayFormatted} - ${lastDayFormatted}`;
}