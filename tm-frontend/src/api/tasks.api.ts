import api from "./axios";
import type {
  PaginatedTasks,
  Task,
  TaskPriority,
  TaskStatus,
} from "../types";

export interface CreateTaskPayload {
  title: string;
  description?: string;
  assignedToId: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

export interface ListTasksQuery {
  page?: number;
  limit?: number;
}

export const listTasksRequest = async (
  query: ListTasksQuery = {},
): Promise<PaginatedTasks | Task[]> => {
  const res = await api.get<PaginatedTasks | Task[]>("/tasks", { params: query });
  return res.data;
};

export const getTaskRequest = async (id: string): Promise<Task> => {
  const res = await api.get<Task>(`/tasks/${id}`);
  return res.data;
};

export const createTaskRequest = async (
  payload: CreateTaskPayload,
): Promise<Task> => {
  const res = await api.post<{ message: string; task: Task }>(
    "/tasks",
    payload,
  );
  return res.data.task;
};

export const updateTaskRequest = async (
  id: string,
  payload: UpdateTaskPayload,
): Promise<Task> => {
  const res = await api.put<{ message: string; updatedTask: Task }>(
    `/tasks/${id}`,
    payload,
  );
  return res.data.updatedTask;
};

export const deleteTaskRequest = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};
