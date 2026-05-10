import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { deleteTask, listTasks } from "../store/slices/tasks.slice";
import type { TaskPriority, TaskStatus } from "../types";
import ConfirmDialog from "../components/ConfirmDialog";

const PAGE_SIZE = 10;

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

const TasksPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, listStatus, error, pagination } = useAppSelector(
    (s) => s.tasks,
  );
  const [page, setPage] = useState(1);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(listTasks({ page, limit: PAGE_SIZE }));
  }, [dispatch, page]);

  const totalPages = pagination?.totalPages ?? 1;

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    const result = await dispatch(deleteTask(pendingDeleteId));
    setPendingDeleteId(null);
    if (deleteTask.fulfilled.match(result)) {
      dispatch(listTasks({ page, limit: PAGE_SIZE }));
    }
  };

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Tasks
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/tasks/new")}
        >
          New task
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={1}>
        {listStatus === "loading" ? (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <CircularProgress />
          </Box>
        ) : items.length === 0 ? (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              No tasks yet. Create your first task to get started.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Assigned to</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((task) => (
                  <TableRow hover key={task.id}>
                    <TableCell>
                      <RouterLink
                        to={`/tasks/${task.id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {task.title}
                      </RouterLink>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={task.status.replace("_", " ")}
                        color={statusColor[task.status]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={task.priority}
                        color={priorityColor[task.priority]}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{task.assignedTo?.name ?? "—"}</TableCell>
                    <TableCell>
                      {new Date(task.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/tasks/${task.id}`)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/tasks/${task.id}/edit`)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setPendingDeleteId(task.id)}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {pagination && totalPages > 1 && (
        <Stack alignItems="center" sx={{ mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Stack>
      )}

      <ConfirmDialog
        open={!!pendingDeleteId}
        title="Delete task?"
        message="This action cannot be undone."
        confirmLabel="Delete"
        confirmColor="error"
        onConfirm={confirmDelete}
        onClose={() => setPendingDeleteId(null)}
      />
    </Box>
  );
};

export default TasksPage;
