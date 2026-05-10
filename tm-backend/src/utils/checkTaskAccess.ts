import prisma from "../config/prisma";

const checkTaskAccess = async (
  taskId: string,
  userId: string,
  role: string
) => {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  const isOwner =
    task.createdById === userId;

  const isAdmin = role === "admin";

  if (!isOwner && !isAdmin) {
    throw new Error("Access denied");
  }

  return task;
};

export default checkTaskAccess;