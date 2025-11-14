//  export  const formatDateTime = (date: string | Date): string => {
//         const d = new Date(date);

//         const year = d.getFullYear();
//         const month = (d.getMonth() + 1).toString().padStart(2, "0");
//         const day = d.getDate().toString().padStart(2, "0");

//         let hours = d.getHours();
//         const minutes = d.getMinutes().toString().padStart(2, "0");
//         const ampm = hours >= 12 ? "PM" : "AM";
//         hours = hours % 12 || 12; // convert to 12-hour format

//         const time = `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;
//         return `${year}-${month}-${day} ${time}`;
//     };


export const formatDateTime = (date: string | Date) => {
  const d = new Date(date);

  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");

  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  const dateStr = `${year}-${month}-${day}`;
  const timeStr = `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;

  return { dateStr, timeStr };
};
