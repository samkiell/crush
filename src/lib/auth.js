import jwt from 'jsonwebtoken';
import User from '@/lib/models/User';
import dbConnect from '@/lib/db';

export async function protect(req) {
  let token;

  if (
    req.headers.get('authorization') &&
    req.headers.get('authorization').startsWith('Bearer')
  ) {
    token = req.headers.get('authorization').split(' ')[1];
  } else if (req.cookies && req.cookies.get('auth_token')) {
    token = req.cookies.get('auth_token').value;
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
    console.error('Auth Middleware Error:', error);
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
