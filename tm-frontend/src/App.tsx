import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { useAppDispatch } from "./store/hooks";
import { hydrateAuth } from "./store/slices/auth.slice";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  return <AppRoutes />;
};

export default App;
