import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { listUsersRequest } from "../../api/users.api";
import type { UserOption } from "../../api/users.api";
import { extractErrorMessage } from "../../api/axios";

interface UsersState {
  items: UserOption[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UsersState = {
  items: [],
  status: "idle",
  error: null,
};

export const listUsers = createAsyncThunk(
  "users/list",
  async (_, { rejectWithValue }) => {
    try {
      return await listUsersRequest();
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, "Failed to load users"));
    }
  },
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(listUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(listUsers.rejected, (state, action: PayloadAction<unknown>) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to load users";
      });
  },
});

export default usersSlice.reducer;
