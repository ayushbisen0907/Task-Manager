import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearAuthError, login } from "../store/slices/auth.slice";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, status, error } = useAppSelector((s) => s.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      const from =
        (location.state as { from?: { pathname: string } } | null)?.from
          ?.pathname ?? "/tasks";
      navigate(from, { replace: true });
    }
  }, [token, navigate, location.state]);

  const onSubmit = (values: FormValues) => {
    dispatch(login(values));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        background:
          "radial-gradient(at 80% 0%, rgba(99,102,241,0.12) 0%, transparent 50%), radial-gradient(at 0% 100%, rgba(236,72,153,0.10) 0%, transparent 50%)",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 5 },
          width: "100%",
          maxWidth: 420,
          borderRadius: 4,
        }}
      >
        <Stack alignItems="center" sx={{ mb: 3 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: 22,
              boxShadow: "0 8px 20px rgba(99,102,241,0.35)",
              mb: 2,
            }}
          >
            T
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Sign in to continue to Task Manager
          </Typography>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2.5}>
            <TextField
              label="Email"
              type="email"
              autoComplete="email"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register("email")}
            />
            <TextField
              label="Password"
              type="password"
              autoComplete="current-password"
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register("password")}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={status === "loading"}
              sx={{ mt: 1 }}
            >
              {status === "loading" ? "Signing in…" : "Sign in"}
            </Button>
            <Typography variant="body2" textAlign="center" color="text.secondary">
              Don't have an account?{" "}
              <Link component={RouterLink} to="/register">
                Create one
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
