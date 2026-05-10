import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearSelectedTask, fetchTask } from "../store/slices/tasks.slice";

const TaskDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selected, detailStatus, error } = useAppSelector((s) => s.tasks);

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

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/tasks")}>
          Back to tasks
        </Button>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/tasks/${selected.id}/edit`)}
        >
          Edit
        </Button>
      </Stack>

      <Paper elevation={1} sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          {selected.title}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
          <Chip label={selected.status.replace("_", " ")} size="small" />
          <Chip
            label={`${selected.priority} priority`}
            size="small"
            variant="outlined"
          />
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ display: "block" }}
        >
          Description
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, whiteSpace: "pre-wrap" }}>
          {selected.description || "No description provided."}
        </Typography>

        <Stack direction="row" spacing={4}>
          <Box>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ display: "block" }}
            >
              Assigned to
            </Typography>
            <Typography variant="body2">
              {selected.assignedTo?.name ?? "—"}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ display: "block" }}
            >
              Created by
            </Typography>
            <Typography variant="body2">
              {selected.createdBy?.name ?? "—"}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ display: "block" }}
            >
              Created
            </Typography>
            <Typography variant="body2">
              {new Date(selected.createdAt).toLocaleString()}
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default TaskDetailPage;
