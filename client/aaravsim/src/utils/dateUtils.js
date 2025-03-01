export function formatDate(date) {
    return date.toISOString().split('T')[0];
  }
  /**
   * Subtracts a given number of business days from the date.
   */
export function subtractBusinessDays(date, days) {
let result = new Date(date);
while (days > 0) {
    result.setDate(result.getDate() - 1);
    // Only count weekdays (Monday=1 ... Friday=5)
    if (result.getDay() !== 0 && result.getDay() !== 6) {
    days--;
    }
}
return result;
}
/**
 * Computes start and end dates based on the period.
 * Supported periods: 
 *   '1d'     - Returns today (or the most recent weekday if today is a weekend)
 *   '5d'     - Subtracts 5 business days from today.
 *   '1m'     - Subtracts one calendar month (adjusting to a weekday if needed).
 *   '6m'     - Subtracts 6 calendar months (adjusting to a weekday if needed).
 *   '1y'     - Subtracts one year (adjusting to a weekday if needed).
 *   '5y'     - Subtracts five years (adjusting to a weekday if needed).
 *   'weekly' - Returns the current week’s Monday to Sunday.
 */
export function getStartEndDates(period) {
let endDate = new Date();
let startDate = new Date(endDate);

switch (period) {
    case '1d': {
    // Adjust if today is a weekend: use the most recent Friday.
    if (endDate.getDay() === 0) { // Sunday
        endDate.setDate(endDate.getDate() - 2);
    } else if (endDate.getDay() === 6) { // Saturday
        endDate.setDate(endDate.getDate() - 1);
    }
    startDate = new Date(endDate);
    break;
    }
    case '5d': {
    startDate = subtractBusinessDays(endDate, 5);
    break;
    }
    case '1m': {
    startDate.setMonth(endDate.getMonth() - 1);
    // Adjust startDate forward if it falls on a weekend.
    if (startDate.getDay() === 6) { // Saturday
        startDate.setDate(startDate.getDate() + 2);
    } else if (startDate.getDay() === 0) { // Sunday
        startDate.setDate(startDate.getDate() + 1);
    }
    break;
    }
    case '6m': {
    startDate.setMonth(endDate.getMonth() - 6);
    if (startDate.getDay() === 6) {
        startDate.setDate(startDate.getDate() + 2);
    } else if (startDate.getDay() === 0) {
        startDate.setDate(startDate.getDate() + 1);
    }
    break;
    }
    case '1y': {
    startDate.setFullYear(endDate.getFullYear() - 1);
    if (startDate.getDay() === 6) {
        startDate.setDate(startDate.getDate() + 2);
    } else if (startDate.getDay() === 0) {
        startDate.setDate(startDate.getDate() + 1);
    }
    break;
    }
    case '5y': {
    startDate.setFullYear(endDate.getFullYear() - 5);
    if (startDate.getDay() === 6) {
        startDate.setDate(startDate.getDate() + 2);
    } else if (startDate.getDay() === 0) {
        startDate.setDate(startDate.getDate() + 1);
    }
    break;
    }
    case 'weekly': {
    // For weekly, align to Monday through Sunday of the current week.
    // In JavaScript, Sunday is 0 and Monday is 1.
    // For Sunday (0), we'll treat it as 7 for calculating the Monday offset.
    let dayOfWeek = endDate.getDay();
    let offsetToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - offsetToMonday);
    //   endDate = new Date(endDate);
    //   endDate.setDate(startDate.getDate() + 6);
    break;
    }
    default:
    throw new Error('Unsupported period: ' + period);
}
return { startDate: formatDate(startDate), endDate: formatDate(endDate) };
}

export function filterDataByPeriod(data, period) {
    const { startDate, endDate } = getStartEndDates(period);
    return data.filter(item => {
    // Convert the returned date into the same format as our date values.
    const itemDate = formatDate(new Date(item.date));
    return itemDate >= startDate && itemDate <= endDate;
    });
}
  

/**
 * Converts a date to EST timezone
 * @param {Date} date - Date to convert
 * @returns {Date} - Date object representing the time in EST
 */
export const convertToEST = (date) => {
    // Create a formatter in EST timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    // Get formatted parts
    const parts = formatter.formatToParts(date);
    const dateParts = {};
    
    parts.forEach(part => {
      if (part.type !== 'literal') {
        dateParts[part.type] = parseInt(part.value);
      }
    });
    
    // Create a new Date object using the parts
    return new Date(
      dateParts.year,
      dateParts.month - 1, // Month is 0-indexed
      dateParts.day,
      dateParts.hour,
      dateParts.minute,
      dateParts.second
    );
  };
  
  /**
   * Formats a date as a string in EST timezone
   * @param {Date} date - Date to format
   * @param {String} format - Format type ('date', 'datetime', 'time')
   * @returns {String} - Formatted date string
   */
  export const formatDateEST = (date, format = 'datetime') => {
    const options = {
      timeZone: 'America/New_York',
    };
    
    if (format === 'date' || format === 'datetime') {
      options.year = 'numeric';
      options.month = 'short';
      options.day = 'numeric';
    }
    
    if (format === 'time' || format === 'datetime') {
      options.hour = '2-digit';
      options.minute = '2-digit';
      options.hour12 = true;
    }
    
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };
  
  /**
   * Gets current date in EST timezone
   * @returns {Date} - Current date in EST
   */
  export const getCurrentDateEST = () => {
    return convertToEST(new Date());
  };