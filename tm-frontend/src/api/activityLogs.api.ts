import api from "./axios";
import type { PaginatedActivityLogs } from "../types";

export interface ListActivityLogsQuery {
  page?: number;
  limit?: number;
}

export const listActivityLogsRequest = async (
  query: ListActivityLogsQuery = {},
): Promise<PaginatedActivityLogs> => {
  const res = await api.get<PaginatedActivityLogs>("/activity-logs", {
    params: query,
  });
  return res.data;
};
