import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  clearSelectedTask,
  createTask,
  fetchTask,
  updateTask,
} from "../store/slices/tasks.slice";
import { listUsers } from "../store/slices/users.slice";

const createSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  assignedToId: z.string().min(1, "Assignee user ID is required"),
});

const editSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed"]),
  priority: z.enum(["low", "medium", "high"]),
});

type CreateValues = z.infer<typeof createSchema>;
type EditValues = z.infer<typeof editSchema>;

interface Props {
  mode: "create" | "edit";
}

const TaskFormPage = ({ mode }: Props) =>
  mode === "create" ? <CreateForm /> : <EditForm />;

const CreateForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { mutationStatus, error } = useAppSelector((s) => s.tasks);
  const users = useAppSelector((s) => s.users.items);
  const usersStatus = useAppSelector((s) => s.users.status);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateValues>({
    resolver: zodResolver(createSchema),
    defaultValues: { title: "", description: "", assignedToId: "" },
  });

  useEffect(() => {
    if (usersStatus === "idle") {
      dispatch(listUsers());
    }
  }, [dispatch, usersStatus]);

  const onSubmit = async (values: CreateValues) => {
    const result = await dispatch(createTask(values));
    if (createTask.fulfilled.match(result)) {
      navigate("/tasks");
    }
  };

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/tasks")}
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      <Paper elevation={1} sx={{ p: 4, maxWidth: 720 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          New task
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2}>
            <TextField
              label="Title"
              fullWidth
              error={!!errors.title}
              helperText={errors.title?.message}
              {...register("title")}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              minRows={3}
              error={!!errors.description}
              helperText={errors.description?.message}
              {...register("description")}
            />
            <Controller
              name="assignedToId"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={users}
                  loading={usersStatus === "loading"}
                  getOptionLabel={(option) =>
                    option ? `${option.name} (${option.email})` : ""
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  value={users.find((u) => u.id === field.value) ?? null}
                  onChange={(_, selected) =>
                    field.onChange(selected ? selected.id : "")
                  }
                  onBlur={field.onBlur}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Assign to"
                      placeholder="Select a user"
                      error={!!errors.assignedToId}
                      helperText={errors.assignedToId?.message}
                    />
                  )}
                />
              )}
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={() => navigate("/tasks")}>Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={mutationStatus === "loading"}
              >
                {mutationStatus === "loading" ? "Creating…" : "Create task"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

const EditForm = () => {
  const { id = "" } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selected, detailStatus, mutationStatus, error } = useAppSelector(
    (s) => s.tasks,
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
    },
  });

  useEffect(() => {
    if (id) dispatch(fetchTask(id));
    return () => {
      dispatch(clearSelectedTask());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (selected && selected.id === id) {
      reset({
        title: selected.title,
        description: selected.description ?? "",
        status: selected.status,
        priority: selected.priority,
      });
    }
  }, [selected, id, reset]);

  const onSubmit = async (values: EditValues) => {
    const result = await dispatch(updateTask({ id, payload: values }));
    if (updateTask.fulfilled.match(result)) {
      navigate(`/tasks/${id}`);
    }
  };

  if (detailStatus === "loading") {
    return (
      <Box sx={{ p: 6, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/tasks/${id}`)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      <Paper elevation={1} sx={{ p: 4, maxWidth: 720 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Edit task
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2}>
            <TextField
              label="Title"
              fullWidth
              error={!!errors.title}
              helperText={errors.title?.message}
              {...register("title")}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              minRows={3}
              error={!!errors.description}
              helperText={errors.description?.message}
              {...register("description")}
            />
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField select label="Status" fullWidth {...field}>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in_progress">In progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </TextField>
              )}
            />
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <TextField select label="Priority" fullWidth {...field}>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </TextField>
              )}
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={() => navigate(`/tasks/${id}`)}>Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={mutationStatus === "loading"}
              >
                {mutationStatus === "loading" ? "Saving…" : "Save changes"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default TaskFormPage;
