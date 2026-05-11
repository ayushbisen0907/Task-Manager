import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { listActivityLogs } from "../store/slices/activityLogs.slice";
import type { ActivityLog } from "../types";

const PAGE_SIZE = 20;

const actionColor = (
  action: string,
): "default" | "primary" | "warning" | "error" => {
  if (action.endsWith("_CREATED")) return "primary";
  if (action.endsWith("_UPDATED")) return "warning";
  if (action.endsWith("_DELETED")) return "error";
  return "default";
};

const ActivityLogsPage = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { items, status, error, pagination } = useAppSelector(
    (s) => s.activityLogs,
  );
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(listActivityLogs({ page, limit: PAGE_SIZE }));
  }, [dispatch, page]);

  const totalPages = pagination?.totalPages ?? 1;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Activity log</Typography>
        <Typography variant="body2" color="text.secondary">
          A history of task creations, updates, and deletions.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {status === "loading" ? (
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
            <HistoryIcon />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            No activity yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Actions on tasks will appear here.
          </Typography>
        </Paper>
      ) : isMobile ? (
        <Stack spacing={1.5}>
          {items.map((log) => (
            <ActivityCard key={log.id} log={log} />
          ))}
        </Stack>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>When</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>By</TableCell>
                  <TableCell>Task</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((log) => (
                  <TableRow hover key={log.id}>
                    <TableCell
                      sx={{ whiteSpace: "nowrap", color: "text.secondary" }}
                    >
                      {new Date(log.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.action.replace(/_/g, " ")}
                        color={actionColor(log.action)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {log.user ? (
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
                            {log.user.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography variant="body2">
                            {log.user.name}
                          </Typography>
                        </Stack>
                      ) : (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontFamily: "monospace" }}
                        >
                          {log.userId.slice(0, 8)}…
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {log.taskId ? (
                        <RouterLink
                          to={`/tasks/${log.taskId}`}
                          style={{
                            color: "inherit",
                            fontFamily: "monospace",
                            fontSize: 13,
                          }}
                        >
                          {log.taskId.slice(0, 8)}…
                        </RouterLink>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      <DetailsCell details={log.details} />
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
    </Box>
  );
};

const ActivityCard = ({ log }: { log: ActivityLog }) => (
  <Card>
    <CardContent>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1 }}
      >
        <Chip
          label={log.action.replace(/_/g, " ")}
          color={actionColor(log.action)}
          size="small"
        />
        <Typography variant="caption" color="text.secondary">
          {new Date(log.createdAt).toLocaleString()}
        </Typography>
      </Stack>
      <DetailsCell details={log.details} />
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ mt: 1.5 }}
      >
        {log.user ? (
          <>
            <Avatar
              sx={{
                width: 20,
                height: 20,
                fontSize: 10,
                bgcolor: "primary.light",
              }}
            >
              {log.user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="caption" color="text.secondary">
              {log.user.name}
            </Typography>
          </>
        ) : (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontFamily: "monospace" }}
          >
            {log.userId.slice(0, 8)}…
          </Typography>
        )}
        {log.taskId && (
          <Typography variant="caption" color="text.secondary">
            ·{" "}
            <RouterLink
              to={`/tasks/${log.taskId}`}
              style={{
                color: "inherit",
                fontFamily: "monospace",
              }}
            >
              {log.taskId.slice(0, 8)}…
            </RouterLink>
          </Typography>
        )}
      </Stack>
    </CardContent>
  </Card>
);

const DetailsCell = ({
  details,
}: {
  details: Record<string, unknown> | null;
}) => {
  if (!details || Object.keys(details).length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        —
      </Typography>
    );
  }

  if ("title" in details && typeof details.title === "string") {
    return <Typography variant="body2">{details.title}</Typography>;
  }

  if (
    "updatedFields" in details &&
    details.updatedFields &&
    typeof details.updatedFields === "object"
  ) {
    const fields = Object.keys(details.updatedFields as object);
    return (
      <Typography variant="body2" color="text.secondary">
        Changed: {fields.join(", ")}
      </Typography>
    );
  }

  return (
    <Typography
      variant="caption"
      sx={{
        fontFamily: "monospace",
        whiteSpace: "pre",
        display: "block",
        maxWidth: 360,
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {JSON.stringify(details)}
    </Typography>
  );
};

export default ActivityLogsPage;
