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


/**
 * Formats a timestamp into a human-readable "Last updated" string.
 *
 * Logic:
 * - 0 days ago: "Today"
 * - 1 day ago: "Yesterday"
 * - 2-6 days ago: Day of the week (e.g., "Friday", "Sunday")
 * - 7 days ago: "A week ago"
 * - >7 days ago: Full date (e.g., "Nov 15, 2023")
 *
 * @param dateInput - The date to format (string, Date object, or timestamp)
 * @returns Formatted string
 */
export function formatLastUpdated(dateInput: string | Date | number): string {

  const date = new Date(dateInput);
  const now = new Date();

  // Validate date
  if (isNaN(date.getTime())) {
    console.error("Invalid date passed to formatLastUpdated");
    return "";
  }

  // Reset time to midnight for accurate day comparison
  // We want to compare calendar days, not 24-hour periods
  const dateAtMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const nowAtMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Calculate difference in milliseconds
  const diffTime = nowAtMidnight.getTime() - dateAtMidnight.getTime();
  // Convert to days (1000ms * 60s * 60m * 24h)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  } 
  
  if (diffDays === 1) {
    return "Yesterday";
  }

  // Between 2 and 6 days (exclusive of a full week)
  if (diffDays > 1 && diffDays < 7) {
    // Returns full day name e.g., "Friday", "Sunday"
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }

  if (diffDays === 7) {
    return "A week ago";
  }

  // More than a week ago, return standard date format
  // Example output: "Nov 26, 2025" or "26/11/2025" depending on locale
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}


