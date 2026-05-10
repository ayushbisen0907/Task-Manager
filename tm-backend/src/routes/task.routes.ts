import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  createTaskController,
  deleteTaskController,
  getTaskByIdController,
  getTasksController,
  updateTaskController,
} from "../controllers/task.controller";

const router = Router();

router.post("/", authenticate, createTaskController);

router.get("/", authenticate, getTasksController);

router.get("/:id", authenticate, getTaskByIdController);

router.put("/:id", authenticate, updateTaskController);

router.delete("/:id", authenticate, deleteTaskController);

export default router;
