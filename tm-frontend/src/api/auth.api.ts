import api from "./axios";
import type { AuthUser, User } from "../types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginResult {
  token: string;
  user: User;
}

export const loginRequest = async (payload: LoginPayload): Promise<LoginResult> => {
  const res = await api.post<{ message: string; result: LoginResult }>(
    "/auth/login",
    payload,
  );
  return res.data.result;
};

export const registerRequest = async (
  payload: RegisterPayload,
): Promise<User> => {
  const res = await api.post<{ message: string; user: User }>(
    "/auth/register",
    payload,
  );
  return res.data.user;
};

export const fetchProfileRequest = async (): Promise<AuthUser> => {
  const res = await api.get<{ message: string; user: AuthUser }>(
    "/auth/profile",
  );
  return res.data.user;
};
