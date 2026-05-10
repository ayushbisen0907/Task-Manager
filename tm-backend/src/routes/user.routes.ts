import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getUsersController } from "../controllers/user.controller";

const router = Router();

router.get("/", authenticate, getUsersController);

export default router;
