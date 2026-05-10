import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth.middleware";

// Returns an Express middleware that allows the request only if the authenticated user's role is in `allowedRoles`.
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};
