import { useEffect } from "react";
import { Link as RouterLink, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProfile, logout } from "../store/slices/auth.slice";

const DashboardLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const token = useAppSelector((s) => s.auth.token);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, token, user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/tasks"
            sx={{
              color: "inherit",
              textDecoration: "none",
              fontWeight: 600,
              mr: 4,
            }}
          >
            Task Manager
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexGrow: 1 }}>
            <Button
              component={NavLink}
              to="/tasks"
              color="inherit"
              sx={{
                "&.active": { backgroundColor: "rgba(255,255,255,0.12)" },
              }}
            >
              Tasks
            </Button>
            <Button
              component={NavLink}
              to="/activity-logs"
              color="inherit"
              sx={{
                "&.active": { backgroundColor: "rgba(255,255,255,0.12)" },
              }}
            >
              Activity log
            </Button>
          </Stack>
          {user && (
            <Typography variant="body2" sx={{ mr: 2 }}>
              {user.name}
            </Typography>
          )}
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default DashboardLayout;
