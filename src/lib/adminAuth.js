export function isAdmin(req) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.split(' ')[1];
  const adminSecret = process.env.ADMIN_SECRET || 'temp_admin_secret_123'; // Fallback for dev only

  return token === adminSecret;
}
