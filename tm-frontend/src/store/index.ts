import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import tasksReducer from "./slices/tasks.slice";
import activityLogsReducer from "./slices/activityLogs.slice";
import usersReducer from "./slices/users.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    activityLogs: activityLogsReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
