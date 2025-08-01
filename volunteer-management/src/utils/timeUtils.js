import dayjs from 'dayjs';
import 'dayjs/locale/vi'; // Vietnamese locale
import relativeTime from 'dayjs/plugin/relativeTime';
import calendar from 'dayjs/plugin/calendar';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Extend dayjs with plugins
dayjs.extend(relativeTime);
dayjs.extend(calendar);
dayjs.extend(utc);
dayjs.extend(timezone);

// Set Vietnamese as default locale
dayjs.locale('vi');

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {string} format - Format string (default: 'DD/MM/YYYY')
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  return dayjs(date).format(format);
};

/**
 * Format date and time for display
 * @param {string|Date} date - Date to format
 * @param {string} format - Format string (default: 'DD/MM/YYYY HH:mm')
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (date, format = 'DD/MM/YYYY HH:mm') => {
  return dayjs(date).format(format);
};

/**
 * Get relative time (e.g., "2 hours ago", "3 days ago")
 * @param {string|Date} date - Date to get relative time for
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  return dayjs(date).fromNow();
};

/**
 * Get calendar time (e.g., "Today at 2:30 PM", "Yesterday at 3:45 PM")
 * @param {string|Date} date - Date to get calendar time for
 * @returns {string} Calendar time string
 */
export const getCalendarTime = (date) => {
  return dayjs(date).calendar();
};

/**
 * Check if date is in the past
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is in the past
 */
export const isPast = (date) => {
  return dayjs(date).isBefore(dayjs());
};

/**
 * Check if date is in the future
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is in the future
 */
export const isFuture = (date) => {
  return dayjs(date).isAfter(dayjs());
};

/**
 * Check if date is today
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is today
 */
export const isToday = (date) => {
  return dayjs(date).isSame(dayjs(), 'day');
};

/**
 * Get time until event
 * @param {string|Date} eventDate - Event date
 * @returns {string} Time until event (e.g., "2 days", "3 hours")
 */
export const getTimeUntilEvent = (eventDate) => {
  const now = dayjs();
  const event = dayjs(eventDate);
  
  if (event.isBefore(now)) {
    return 'Đã diễn ra';
  }
  
  const diff = event.diff(now, 'day');
  if (diff > 0) {
    return `${diff} ngày nữa`;
  }
  
  const diffHours = event.diff(now, 'hour');
  if (diffHours > 0) {
    return `${diffHours} giờ nữa`;
  }
  
  const diffMinutes = event.diff(now, 'minute');
  if (diffMinutes > 0) {
    return `${diffMinutes} phút nữa`;
  }
  
  return 'Sắp diễn ra';
};

/**
 * Format event duration
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {string} Formatted duration
 */
export const formatEventDuration = (startDate, endDate) => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  
  if (start.isSame(end, 'day')) {
    return `${start.format('DD/MM/YYYY')} từ ${start.format('HH:mm')} - ${end.format('HH:mm')}`;
  }
  
  return `Từ ${start.format('DD/MM/YYYY HH:mm')} đến ${end.format('DD/MM/YYYY HH:mm')}`;
};

/**
 * Get current date in ISO format
 * @returns {string} Current date in ISO format
 */
export const getCurrentDateISO = () => {
  return dayjs().toISOString();
};

/**
 * Parse date string to dayjs object
 * @param {string|Date} date - Date to parse
 * @returns {dayjs.Dayjs} dayjs object
 */
export const parseDate = (date) => {
  return dayjs(date);
};

export default dayjs; 