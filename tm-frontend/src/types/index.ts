export type TaskStatus = "pending" | "in_progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export interface User {
  id: string;
  name: string;
  email: string;
  role?: { id: string; name: string } | null;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assignedToId: string;
  createdById: string;
  assignedTo?: User;
  createdBy?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedTasks {
  tasks: Task[];
  pagination: Pagination;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ApiError {
  message: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  userId: string;
  user: { id: string; name: string; email: string } | null;
  taskId: string | null;
  details: Record<string, unknown> | null;
  createdAt: string;
}

export interface PaginatedActivityLogs {
  logs: ActivityLog[];
  pagination: Pagination;
}
