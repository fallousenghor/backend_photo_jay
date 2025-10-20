import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { Role } from '../types/enums';
import { ERROR_MESSAGES } from '../utils/messages/errorMessage';
import { ErrorCode } from '../utils/codes/errorCode';

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; email: string; role: Role };
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(ErrorCode.UNAUTHORIZED).json({ message: ERROR_MESSAGES.UNAUTHORIZED });
  }
  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(ErrorCode.UNAUTHORIZED).json({ message: ERROR_MESSAGES.UNAUTHORIZED });
  }
  req.user = decoded;
  next();
};

export const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(ErrorCode.FORBIDDEN).json({ message: ERROR_MESSAGES.FORBIDDEN });
  }
    next();
  };
};
