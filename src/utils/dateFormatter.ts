/**
 * Formats a date string into a readable format (e.g. "15 May, 2025")
 * This matches the backend's getFormattedDate() method
 *
 * @param dateString - ISO date string or Date object
 * @returns Formatted date string
 */
export const formatDate = (dateString: string | Date | undefined): string => {
  if (!dateString) {
    return "Date not available";
  }

  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Date not available";
    }

    const day = date.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month}, ${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Date not available";
  }
};
