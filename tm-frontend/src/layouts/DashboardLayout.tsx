import { useEffect, useState } from "react";
import {
  Link as RouterLink,
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import HistoryIcon from "@mui/icons-material/History";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProfile, logout } from "../store/slices/auth.slice";

const navItems = [
  { to: "/tasks", label: "Tasks", icon: <TaskAltIcon fontSize="small" /> },
  { to: "/activity-logs", label: "Activity", icon: <HistoryIcon fontSize="small" /> },
];

const DashboardLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const user = useAppSelector((s) => s.auth.user);
  const token = useAppSelector((s) => s.auth.token);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, token, user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const initial = user?.name?.charAt(0).toUpperCase() ?? "?";

  const brandMark = (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      component={RouterLink}
      to="/tasks"
      sx={{ textDecoration: "none", color: "inherit" }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: 2,
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 700,
          fontSize: 16,
          boxShadow: "0 4px 12px rgba(99,102,241,0.35)",
        }}
      >
        T
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}>
        Task Manager
      </Typography>
    </Stack>
  );

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="sticky">
        <Toolbar sx={{ gap: 2 }}>
          {isMobile && (
            <IconButton
              edge="start"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon />
            </IconButton>
          )}

          {brandMark}

          {!isMobile && (
            <Stack direction="row" spacing={0.5} sx={{ ml: 3, flexGrow: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  startIcon={item.icon}
                  sx={(t) => ({
                    color: t.palette.text.secondary,
                    px: 2,
                    "&.active": {
                      backgroundColor: t.palette.action.selected,
                      color: t.palette.text.primary,
                    },
                    "&:hover": { backgroundColor: t.palette.action.hover },
                  })}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          )}

          {!isMobile && <Box sx={{ flexGrow: 1 }} />}

          {user && (
            <Stack direction="row" spacing={1.25} alignItems="center">
              {!isMobile && (
                <Box sx={{ textAlign: "right", lineHeight: 1.2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {user.name}
                  </Typography>
                  {user.role && (
                    <Typography
                      variant="caption"
                      sx={{
                        color:
                          user.role === "admin"
                            ? "secondary.main"
                            : "text.secondary",
                        textTransform: "capitalize",
                        fontWeight: 600,
                      }}
                    >
                      {user.role}
                    </Typography>
                  )}
                </Box>
              )}
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor:
                    user.role === "admin" ? "secondary.main" : "primary.main",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {initial}
              </Avatar>
              <Tooltip title="Sign out">
                <IconButton onClick={handleLogout} aria-label="Sign out">
                  <LogoutIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 260 } }}
      >
        <Box sx={{ p: 2 }}>{brandMark}</Box>
        <Divider />
        {user && (
          <>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ p: 2 }}>
              <Avatar
                sx={{
                  bgcolor:
                    user.role === "admin" ? "secondary.main" : "primary.main",
                  fontWeight: 700,
                }}
              >
                {initial}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {user.name}
                </Typography>
                {user.role && (
                  <Chip
                    label={user.role}
                    size="small"
                    color={user.role === "admin" ? "secondary" : "default"}
                    sx={{ textTransform: "capitalize", mt: 0.5 }}
                  />
                )}
              </Box>
            </Stack>
            <Divider />
          </>
        )}
        <List>
          {navItems.map((item) => (
            <ListItem key={item.to} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.to}
                onClick={() => setDrawerOpen(false)}
                sx={(t) => ({
                  "&.active": {
                    backgroundColor: t.palette.action.selected,
                    "& .MuiListItemText-primary": { fontWeight: 600 },
                  },
                })}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
          <Divider sx={{ my: 1 }} />
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Sign out" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Container
        maxWidth="lg"
        sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, md: 3 }, flexGrow: 1 }}
      >
        <Outlet />
      </Container>
    </Box>
  );
};

export default DashboardLayout;
