import api from "./axios";

export interface UserOption {
  id: string;
  name: string;
  email: string;
}

export const listUsersRequest = async (): Promise<UserOption[]> => {
  const res = await api.get<UserOption[]>("/users");
  return res.data;
};
