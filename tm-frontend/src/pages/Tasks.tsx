import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InboxIcon from "@mui/icons-material/Inbox";
import {
  useAppDispatch,
  useAppSelector,
  useCurrentUser,
  useIsAdmin,
} from "../store/hooks";
import { deleteTask, listTasks } from "../store/slices/tasks.slice";
import type { Task, TaskPriority, TaskStatus } from "../types";
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

const formatStatus = (s: TaskStatus) =>
  s.replace("_", " ").replace(/^\w/, (c) => c.toUpperCase());

const TasksPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { items, listStatus, error, pagination } = useAppSelector(
    (s) => s.tasks,
  );
  const currentUser = useCurrentUser();
  const isAdmin = useIsAdmin();
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

  const canModify = (task: Task) =>
    isAdmin || task.createdById === currentUser?.id;

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4">Tasks</Typography>
          <Typography variant="body2" color="text.secondary">
            {pagination?.total ?? items.length} task
            {(pagination?.total ?? items.length) === 1 ? "" : "s"} total
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/tasks/new")}
          size="large"
        >
          New task
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {listStatus === "loading" ? (
        <Paper sx={{ p: 8, textAlign: "center" }}>
          <CircularProgress />
        </Paper>
      ) : items.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: "center" }}>
          <Avatar
            sx={{
              bgcolor: "primary.50",
              color: "primary.main",
              mx: "auto",
              mb: 2,
              width: 56,
              height: 56,
            }}
          >
            <InboxIcon />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            No tasks yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first task to get started.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/tasks/new")}
          >
            New task
          </Button>
        </Paper>
      ) : isMobile ? (
        <Stack spacing={2}>
          {items.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              canModify={canModify(task)}
              onView={() => navigate(`/tasks/${task.id}`)}
              onEdit={() => navigate(`/tasks/${task.id}/edit`)}
              onDelete={() => setPendingDeleteId(task.id)}
            />
          ))}
        </Stack>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Assigned to</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((task) => (
                  <TableRow hover key={task.id}>
                    <TableCell sx={{ fontWeight: 500 }}>
                      <RouterLink
                        to={`/tasks/${task.id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {task.title}
                      </RouterLink>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={formatStatus(task.status)}
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
                        sx={{ textTransform: "capitalize" }}
                      />
                    </TableCell>
                    <TableCell>
                      {task.assignedTo ? (
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                        >
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              fontSize: 12,
                              bgcolor: "primary.light",
                            }}
                          >
                            {task.assignedTo.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography variant="body2">
                            {task.assignedTo.name}
                          </Typography>
                        </Stack>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
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
                      {canModify(task) && (
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() =>
                              navigate(`/tasks/${task.id}/edit`)
                            }
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {canModify(task) && (
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setPendingDeleteId(task.id)}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {pagination && totalPages > 1 && (
        <Stack alignItems="center" sx={{ mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            shape="rounded"
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

interface TaskCardProps {
  task: Task;
  canModify: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const TaskCard = ({
  task,
  canModify,
  onView,
  onEdit,
  onDelete,
}: TaskCardProps) => (
  <Card>
    <CardActionArea onClick={onView}>
      <CardContent sx={{ pb: 1 }}>
        <Stack direction="row" justifyContent="space-between" spacing={1}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, flex: 1 }}>
            {task.title}
          </Typography>
          <Chip
            label={formatStatus(task.status)}
            color={statusColor[task.status]}
            size="small"
          />
        </Stack>
        {task.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 1,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {task.description}
          </Typography>
        )}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mt: 1.5, flexWrap: "wrap", gap: 1 }}
        >
          <Chip
            label={task.priority}
            color={priorityColor[task.priority]}
            size="small"
            variant="outlined"
            sx={{ textTransform: "capitalize" }}
          />
          {task.assignedTo && (
            <Typography variant="caption" color="text.secondary">
              · {task.assignedTo.name}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary">
            · {new Date(task.createdAt).toLocaleDateString()}
          </Typography>
        </Stack>
      </CardContent>
    </CardActionArea>
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 0.5,
        px: 1,
        pb: 1,
      }}
    >
      <IconButton size="small" onClick={onView} aria-label="View">
        <VisibilityIcon fontSize="small" />
      </IconButton>
      {canModify && (
        <>
          <IconButton size="small" onClick={onEdit} aria-label="Edit">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={onDelete}
            aria-label="Delete"
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </>
      )}
    </Box>
  </Card>
);

export default TasksPage;
