import { Router } from "express";
import { login, resgister } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

router.post("/register", resgister);
router.post("/login", login);
// GET /profile: returns the authenticated user's decoded JWT payload (protected route).
router.get(
  "/profile",
  authenticate,
  (req, res) => {
    res.json({
      message: "Protected route",
      user: (req as any).user,
    });
  }
);
// GET /admin: protected route accessible only to users with the "admin" role.
router.get(
  "/admin",
  authenticate,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({
      message: "Welcome Admin",
    });
  }
);

export default router;
