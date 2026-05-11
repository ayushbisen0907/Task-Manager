import { Router } from "express";
import { login, resgister } from "../controllers/auth.controller";
import { authenticate, AuthRequest } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
import prisma from "../config/prisma";

const router = Router();
// POST /register: creates a new user and returns the created user.
router.post("/register", resgister);
router.post("/login", login);

// GET /profile: returns the authenticated user's full profile (id, name, email, role).
router.get("/profile", authenticate, async (req: AuthRequest, res) => {
  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: { select: { name: true } },
      },
    });
    if (!dbUser) return res.status(404).json({ message: "User not found" });
    res.json({
      message: "Protected route",
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role.name,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// GET /admin: protected route accessible only to users with the "admin" role.
router.get("/admin", authenticate, authorizeRoles("admin"), (req, res) => {
  res.json({
    message: "Welcome Admin",
  });
});

export default router;
