import jwt from 'jsonwebtoken';
import User from '@/lib/models/User';
import dbConnect from '@/lib/db';

export async function protect(req) {
  let token;

  if (
    req.headers.get('authorization') &&
    req.headers.get('authorization').startsWith('Bearer')
  ) {
    try {
      token = req.headers.get('authorization').split(' ')[1];

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

  if (!token) {
    throw new Error('Not authorized, no token');
  }
}

export async function authorizeAdmin(req) {
  const user = await protect(req);
  if (user && user.role === 'admin') {
    return user;
  }
  throw new Error('Not authorized as an admin');
}
