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
// POST /tasks: creates a new task and returns the created task.
router.post("/", authenticate, createTaskController);

// GET /tasks: retrieves a paginated list of tasks that the authenticated user has access to, based on their role.
router.get("/", authenticate, getTasksController);

// GET /tasks/:id: retrieves a specific task by ID, ensuring the user has access to it.
router.get("/:id", authenticate, getTaskByIdController);

// PUT /tasks/:id: updates a specific task by ID, ensuring the user has access to it and logging the update activity.
router.put("/:id", authenticate, updateTaskController);

// DELETE /tasks/:id: deletes a specific task by ID, ensuring the user has access to it and logging the deletion activity.
router.delete("/:id", authenticate, deleteTaskController);

export default router;
