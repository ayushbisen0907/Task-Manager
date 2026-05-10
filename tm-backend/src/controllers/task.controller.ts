import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from "../services/task.service";

// Controller functions for task-related routes, handling request validation, calling service functions, and sending appropriate responses.
import logActivity from "../utils/logActivity";
import checkTaskAccess from "../utils/checkTaskAccess";

// Handles POST /tasks: creates a new task with the provided data and returns the created task.
export const createTaskController = async (req: AuthRequest, res: Response) => {
  try {
    // Destructure the title, description, and assignedToId from the request body.
    const { title, description, assignedToId } = req.body;
    // The ID of the user creating the task is taken from the authenticated request.
    const createdById = req.user.userId;
    // Call the createTask service function to create a new task in the database.
    const task = await createTask({
      title,
      description,
      assignedToId,
      createdById,
    });
    // Log the task creation activity with details about the action, user, and task.
    await logActivity({
      action: "TASK_CREATED",
      userId: req.user.userId,
      taskId: task.id,
      details: {
        title: task.title,
      },
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Handles GET /tasks: retrieves a paginated list of tasks that the authenticated user has access to, based on their role.
export const getTasksController = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const tasks = await getTasks(req.user.userId, req.user.role, page, limit);

    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Handles GET /tasks/:id: retrieves a specific task by ID, ensuring the user has access to it.
export const getTaskByIdController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const task = await getTaskById(String(req.params.id));

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json(task);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Handles PUT /tasks/:id: updates a specific task by ID, ensuring the user has access to it and logging the update activity.
export const updateTaskController = async (req: AuthRequest, res: Response) => {
  try {
    const taskId = String(req.params.id);

    await checkTaskAccess(taskId, req.user.userId, req.user.role);

    const updatedTask = await updateTask(taskId, req.body);

    await logActivity({
      action: "TASK_UPDATED",
      userId: req.user.userId,
      taskId: updatedTask.id,
      details: {
        updatedFields: req.body,
      },
    });

    res.json({
      message: "Task updated successfully",
      updatedTask,
    });
  } catch (error: any) {
    res.status(403).json({
      message: error.message,
    });
  }
};

// Handles DELETE /tasks/:id: deletes a specific task by ID, ensuring the user has access to it and logging the deletion activity.
export const deleteTaskController = async (req: AuthRequest, res: Response) => {
  try {
    const taskId = String(req.params.id);

    await checkTaskAccess(taskId, req.user.userId, req.user.role);

    await deleteTask(taskId);

    await logActivity({
      action: "TASK_DELETED",
      userId: req.user.userId,
      taskId,
    });

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error: any) {
    res.status(403).json({
      message: error.message,
    });
  }
};
