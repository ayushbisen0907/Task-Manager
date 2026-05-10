import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import prisma from "../config/prisma";

// Handles GET /users: returns a list of users (id, name, email) for use in pickers like the task assignment dropdown.
export const getUsersController = async (_req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
