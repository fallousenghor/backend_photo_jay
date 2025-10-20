import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role } from '../types/enums';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (user: { id: number; email: string; role: Role }): string => {
  const secret = process.env.JWT_SECRET || 'defaultsecret';
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, secret, { expiresIn: '7d' });
};

export const verifyToken = (token: string): { id: number; email: string; role: Role } | null => {
  try {
    const secret = process.env.JWT_SECRET || 'defaultsecret';
    const decoded = jwt.verify(token, secret) as { id: number; email: string; role: Role };
    return decoded;
  } catch (error) {
    return null;
  }
};
