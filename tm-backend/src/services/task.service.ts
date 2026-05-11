import { TaskPriority, TaskStatus } from "@prisma/client";
import prisma from "../config/prisma";

// Interface for the data required to create a new task.
interface CreateTaskData {
  title: string;
  description?: string;
  assignedToId: string;
  createdById: string;
}

// Creates a new task and returns it with the assigned and creator users included.
export const createTask = async (data: CreateTaskData) => {
  return prisma.task.create({
    data,
    include: {
      assignedTo: true,
      createdBy: true,
    },
  });
};

// Retrieves tasks for the given user, with pagination and role-based access control (admins see all tasks, users see only their own).
export const getTasks = async (
  userId: string,
  role: string,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;

  const whereCondition =
    role === "admin"
      ? {}
      : {
          OR: [
            {
              assignedToId: userId,
            },
            {
              createdById: userId,
            },
          ],
        };

  const tasks = await prisma.task.findMany({
    where: whereCondition,

    include: {
      assignedTo: true,
      createdBy: true,
    },

    orderBy: {
      createdAt: "desc",
    },

    skip,

    take: limit,
  });

  const totalTasks = await prisma.task.count({
    where: whereCondition,
  });

  return {
    tasks,
    pagination: {
      total: totalTasks,
      page,
      limit,
      totalPages: Math.ceil(totalTasks / limit),
    },
  };
};

// Returns a single task by ID with the assigned and creator users included, or null if not found.
export const getTaskById = async (taskId: string) => {
  return prisma.task.findUnique({
    where: {
      id: taskId,
    },
    include: {
      assignedTo: true,
      createdBy: true,
    },
  });
};

interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

// Updates the given task with the provided fields and returns the updated record.
export const updateTask = async (taskId: string, data: UpdateTaskData) => {
  return prisma.task.update({
    where: {
      id: taskId,
    },
    data,
  });
};

// Deletes the given task and returns the deleted record.
export const deleteTask = async (taskId: string) => {
  return prisma.task.delete({
    where: {
      id: taskId,
    },
  });
};
