import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { listActivityLogsRequest } from "../../api/activityLogs.api";
import type { ListActivityLogsQuery } from "../../api/activityLogs.api";
import { extractErrorMessage } from "../../api/axios";
import type { ActivityLog, Pagination } from "../../types";

interface ActivityLogsState {
  items: ActivityLog[];
  pagination: Pagination | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ActivityLogsState = {
  items: [],
  pagination: null,
  status: "idle",
  error: null,
};

export const listActivityLogs = createAsyncThunk(
  "activityLogs/list",
  async (query: ListActivityLogsQuery | undefined, { rejectWithValue }) => {
    try {
      return await listActivityLogsRequest(query);
    } catch (err) {
      return rejectWithValue(
        extractErrorMessage(err, "Failed to load activity logs"),
      );
    }
  },
);

const activityLogsSlice = createSlice({
  name: "activityLogs",
  initialState,
  reducers: {
    clearActivityLogsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listActivityLogs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(listActivityLogs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.logs;
        state.pagination = action.payload.pagination;
      })
      .addCase(
        listActivityLogs.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.status = "failed";
          state.error =
            (action.payload as string) ?? "Failed to load activity logs";
        },
      );
  },
});

export const { clearActivityLogsError } = activityLogsSlice.actions;
export default activityLogsSlice.reducer;
