import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  createTaskRequest,
  deleteTaskRequest,
  getTaskRequest,
  listTasksRequest,
  updateTaskRequest,
} from "../../api/tasks.api";
import type {
  CreateTaskPayload,
  ListTasksQuery,
  UpdateTaskPayload,
} from "../../api/tasks.api";
import { extractErrorMessage } from "../../api/axios";
import type { Pagination, Task } from "../../types";

interface TasksState {
  items: Task[];
  selected: Task | null;
  pagination: Pagination | null;
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  detailStatus: "idle" | "loading" | "succeeded" | "failed";
  mutationStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TasksState = {
  items: [],
  selected: null,
  pagination: null,
  listStatus: "idle",
  detailStatus: "idle",
  mutationStatus: "idle",
  error: null,
};

export const listTasks = createAsyncThunk(
  "tasks/list",
  async (query: ListTasksQuery | undefined, { rejectWithValue }) => {
    try {
      const data = await listTasksRequest(query);
      if (Array.isArray(data)) {
        return {
          tasks: data,
          pagination: null as Pagination | null,
        };
      }
      return { tasks: data.tasks, pagination: data.pagination };
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, "Failed to load tasks"));
    }
  },
);

export const fetchTask = createAsyncThunk(
  "tasks/fetchOne",
  async (id: string, { rejectWithValue }) => {
    try {
      return await getTaskRequest(id);
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, "Failed to load task"));
    }
  },
);

export const createTask = createAsyncThunk(
  "tasks/create",
  async (payload: CreateTaskPayload, { rejectWithValue }) => {
    try {
      return await createTaskRequest(payload);
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, "Failed to create task"));
    }
  },
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async (
    args: { id: string; payload: UpdateTaskPayload },
    { rejectWithValue },
  ) => {
    try {
      return await updateTaskRequest(args.id, args.payload);
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, "Failed to update task"));
    }
  },
);

export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteTaskRequest(id);
      return id;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, "Failed to delete task"));
    }
  },
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearSelectedTask: (state) => {
      state.selected = null;
    },
    clearTasksError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listTasks.pending, (state) => {
        state.listStatus = "loading";
        state.error = null;
      })
      .addCase(listTasks.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.items = action.payload.tasks;
        state.pagination = action.payload.pagination;
      })
      .addCase(listTasks.rejected, (state, action: PayloadAction<unknown>) => {
        state.listStatus = "failed";
        state.error = (action.payload as string) ?? "Failed to load tasks";
      })
      .addCase(fetchTask.pending, (state) => {
        state.detailStatus = "loading";
        state.error = null;
        state.selected = null;
      })
      .addCase(fetchTask.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.selected = action.payload;
      })
      .addCase(fetchTask.rejected, (state, action: PayloadAction<unknown>) => {
        state.detailStatus = "failed";
        state.error = (action.payload as string) ?? "Failed to load task";
      })
      .addCase(createTask.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.items.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action: PayloadAction<unknown>) => {
        state.mutationStatus = "failed";
        state.error = (action.payload as string) ?? "Failed to create task";
      })
      .addCase(updateTask.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
        if (state.selected?.id === action.payload.id) {
          state.selected = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action: PayloadAction<unknown>) => {
        state.mutationStatus = "failed";
        state.error = (action.payload as string) ?? "Failed to update task";
      })
      .addCase(deleteTask.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.items = state.items.filter((t) => t.id !== action.payload);
        if (state.selected?.id === action.payload) state.selected = null;
      })
      .addCase(deleteTask.rejected, (state, action: PayloadAction<unknown>) => {
        state.mutationStatus = "failed";
        state.error = (action.payload as string) ?? "Failed to delete task";
      });
  },
});

export const { clearSelectedTask, clearTasksError } = tasksSlice.actions;
export default tasksSlice.reducer;
