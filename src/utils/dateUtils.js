import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const formatDistanceToNow = (date, options = {}) => {
  const result = dayjs(date).fromNow(options.addSuffix ? false : true);
  if (options.addSuffix) {
    return result; // dayjs .fromNow() includes suffix by default, but we can adjust if needed
  }
  return result;
};
