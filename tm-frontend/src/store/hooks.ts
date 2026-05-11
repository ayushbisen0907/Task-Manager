import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { AppDispatch, RootState } from "./index";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useCurrentUser = () => useAppSelector((s) => s.auth.user);
export const useIsAdmin = () =>
  useAppSelector((s) => s.auth.user?.role === "admin");
export const useCanModifyTask = (createdById?: string | null) =>
  useAppSelector(
    (s) =>
      s.auth.user?.role === "admin" ||
      (!!createdById && s.auth.user?.id === createdById),
  );
