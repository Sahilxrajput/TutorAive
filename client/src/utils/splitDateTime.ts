export const formatDate = (date: string ) => {
  const d = new Date(date).toString();
  const dateStr = d.slice(4, 15);
  return dateStr;
};
export const formatTime = (date: string ) => {
  const d = new Date(date).toString();
  const timeStr = d.slice(16, 21);
  return timeStr ;
};

export const formatDateTime = (date: string | Date) => {
  const d = new Date(date).toString();
  const dateStr = d.slice(4, 15);
  const timeStr = d.slice(16, 21);
  return { dateStr, timeStr };
};

