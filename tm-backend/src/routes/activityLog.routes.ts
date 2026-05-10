import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getActivityLogsController } from "../controllers/activityLog.controller";

const router = Router();

router.get("/", authenticate, getActivityLogsController);

export default router;
