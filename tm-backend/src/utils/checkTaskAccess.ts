import prisma from "../config/prisma";

// Function to check if the user has access to a specific task based on role and ownership.
const checkTaskAccess = async (
  taskId: string,
  userId: string,
  role: string,
) => {
  // Retrieve the task
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
  });
  // Check if the task exists
  if (!task) {
    throw new Error("Task not found");
  }
  // Check if the user is the owner
  const isOwner = task.createdById === userId;

  // Check if the user is an admin
  const isAdmin = role === "admin";

  if (!isOwner && !isAdmin) {
    throw new Error("Access denied");
  }
  // Return the task
  return task;
};

export default checkTaskAccess;
