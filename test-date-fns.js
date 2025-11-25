const dateFns = require('date-fns');
console.log('date-fns loaded:', !!dateFns);
try {
  const { formatDistanceToNow } = require('date-fns');
  console.log('formatDistanceToNow found:', !!formatDistanceToNow);
} catch (e) {
  console.error(e);
}
