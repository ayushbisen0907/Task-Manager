import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";

// Extend the Request interface to include the `user` property.
export interface AuthRequest extends Request {
  user?: any;
}

// Express middleware that verifies the Bearer JWT and attaches the decoded payload to `req.user`.
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
