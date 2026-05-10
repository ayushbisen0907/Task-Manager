import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
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
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { listActivityLogs } from "../store/slices/activityLogs.slice";

const PAGE_SIZE = 20;

const actionColor = (action: string): "default" | "primary" | "warning" | "error" => {
  if (action.endsWith("_CREATED")) return "primary";
  if (action.endsWith("_UPDATED")) return "warning";
  if (action.endsWith("_DELETED")) return "error";
  return "default";
};

const ActivityLogsPage = () => {
  const dispatch = useAppDispatch();
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
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Activity log
          </Typography>
          <Typography variant="body2" color="text.secondary">
            A history of task creations, updates, and deletions.
          </Typography>
        </Box>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={1}>
        {status === "loading" ? (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <CircularProgress />
          </Box>
        ) : items.length === 0 ? (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              No activity yet.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>When</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>By</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Task</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((log) => (
                  <TableRow hover key={log.id}>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
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
                      {log.user?.name ?? (
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
                          style={{ color: "inherit" }}
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
    </Box>
  );
};

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
