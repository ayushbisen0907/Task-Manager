import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  fetchProfileRequest,
  loginRequest,
  registerRequest,
} from "../../api/auth.api";
import type {
  LoginPayload,
  RegisterPayload,
} from "../../api/auth.api";
import {
  clearStoredToken,
  extractErrorMessage,
  getStoredToken,
  setStoredToken,
} from "../../api/axios";
import type { AuthUser, User } from "../../types";

export type AuthStatus = "idle" | "loading" | "succeeded" | "failed";

interface AuthState {
  token: string | null;
  user: AuthUser | User | null;
  status: AuthStatus;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  status: "idle",
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const result = await loginRequest(payload);
      setStoredToken(result.token);
      return result;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, "Login failed"));
    }
  },
);

export const register = createAsyncThunk(
  "auth/register",
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      return await registerRequest(payload);
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, "Registration failed"));
    }
  },
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchProfileRequest();
    } catch (err) {
      return rejectWithValue(
        extractErrorMessage(err, "Failed to load profile"),
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateAuth: (state) => {
      const token = getStoredToken();
      state.token = token;
    },
    logout: (state) => {
      clearStoredToken();
      state.token = null;
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action: PayloadAction<unknown>) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Login failed";
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(register.rejected, (state, action: PayloadAction<unknown>) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Registration failed";
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { hydrateAuth, logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
