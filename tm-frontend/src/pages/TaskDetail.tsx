import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import {
  useAppDispatch,
  useAppSelector,
  useCurrentUser,
  useIsAdmin,
} from "../store/hooks";
import { clearSelectedTask, fetchTask } from "../store/slices/tasks.slice";
import type { TaskPriority, TaskStatus } from "../types";

const statusColor: Record<
  TaskStatus,
  "default" | "warning" | "info" | "success"
> = {
  pending: "warning",
  in_progress: "info",
  completed: "success",
};

const priorityColor: Record<
  TaskPriority,
  "default" | "success" | "warning" | "error"
> = {
  low: "success",
  medium: "warning",
  high: "error",
};

const formatStatus = (s: TaskStatus) =>
  s.replace("_", " ").replace(/^\w/, (c) => c.toUpperCase());

const TaskDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selected, detailStatus, error } = useAppSelector((s) => s.tasks);
  const currentUser = useCurrentUser();
  const isAdmin = useIsAdmin();

  useEffect(() => {
    if (id) dispatch(fetchTask(id));
    return () => {
      dispatch(clearSelectedTask());
    };
  }, [dispatch, id]);

  if (detailStatus === "loading") {
    return (
      <Box sx={{ p: 6, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/tasks")}>
          Back
        </Button>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!selected) return null;

  const canModify = isAdmin || selected.createdById === currentUser?.id;

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/tasks")}
          sx={{ alignSelf: "flex-start" }}
        >
          Back to tasks
        </Button>
        {canModify && (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/tasks/${selected.id}/edit`)}
          >
            Edit task
          </Button>
        )}
      </Stack>

      <Paper sx={{ p: { xs: 3, md: 4 }, mb: 3 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ mb: 2 }}
        >
          <Chip
            label={formatStatus(selected.status)}
            color={statusColor[selected.status]}
            size="small"
          />
          <Chip
            label={`${selected.priority} priority`}
            color={priorityColor[selected.priority]}
            size="small"
            variant="outlined"
            sx={{ textTransform: "capitalize" }}
          />
        </Stack>
        <Typography variant="h4" sx={{ mb: 2 }}>
          {selected.title}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ display: "block", mb: 1 }}
        >
          Description
        </Typography>
        <Typography
          variant="body1"
          sx={{
            whiteSpace: "pre-wrap",
            color: selected.description ? "text.primary" : "text.secondary",
            fontStyle: selected.description ? "normal" : "italic",
          }}
        >
          {selected.description || "No description provided."}
        </Typography>
      </Paper>

      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ display: "block", mb: 2 }}
        >
          Details
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <PersonField label="Assigned to" name={selected.assignedTo?.name} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <PersonField label="Created by" name={selected.createdBy?.name} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="text.secondary">
              Created
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {new Date(selected.createdAt).toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="text.secondary">
              Last updated
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {new Date(selected.updatedAt).toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

const PersonField = ({ label, name }: { label: string; name?: string }) => (
  <Box>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
      {name ? (
        <>
          <Avatar
            sx={{
              width: 24,
              height: 24,
              fontSize: 12,
              bgcolor: "primary.light",
            }}
          >
            {name.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="body2">{name}</Typography>
        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          —
        </Typography>
      )}
    </Stack>
  </Box>
);

export default TaskDetailPage;
