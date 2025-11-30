import jwt from 'jsonwebtoken';
import User from '@/lib/models/User';
import dbConnect from '@/lib/db';

export async function protect(req) {
  let token;

  // Check Authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  } 
  // Check cookies
  else if (req.cookies) {
    // req.cookies can be a Map-like object in Next.js middleware/Edge or an object in standard Node
    const cookieToken = typeof req.cookies.get === 'function' 
      ? req.cookies.get('auth_token')?.value 
      : req.cookies.auth_token;
      
    if (cookieToken) {
      token = cookieToken;
    }
  }

  if (!token) {
    throw new Error('Not authorized, no token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await dbConnect();
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      throw new Error('Not authorized, user not found');
    }

    return user;
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    throw new Error('Not authorized, token failed');
  }
}

export async function authorizeAdmin(req) {
  const user = await protect(req);
  if (user && user.role === 'admin') {
    return user;
  }
  throw new Error('Not authorized as an admin');
}
